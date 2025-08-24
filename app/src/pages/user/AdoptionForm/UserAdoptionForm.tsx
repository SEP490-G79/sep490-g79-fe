import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";
import { toast } from "sonner";
import AppContext from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import Step1_Introduction from "@/components/user/AdoptionForm/Step1_Introduction";
import Step2_AdoptionForm from "@/components/user/AdoptionForm/Step2_AdoptionForm";
import Step3_SubmissionForm from "@/components/user/AdoptionForm/Step3_SubmissionForm";
import Step4_ScheduleConfirm from "@/components/user/AdoptionForm/Step4_ScheduleConfirm";
import Step5_ConsentForm from "@/components/user/AdoptionForm/Step5_ConsentForm";
import Step6_Result from "@/components/user/AdoptionForm/Step6_Result";
import type { AdoptionForm } from "@/types/AdoptionForm";
import type { Question } from "@/types/Question";
import type { ConsentForm } from "@/types/ConsentForm";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { socketClient } from "@/lib/socket.io";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

// ---------- Stable keys & hashing ----------
type AnswerValue = string | string[];
type Answers = Record<string, AnswerValue>;
type AnswersByKey = Record<string, AnswerValue>;

const toSlug = (s: string = "") =>
  s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu tiếng Việt
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s/g, "-");

const qKey = (q: Question) => `${q.type}|${toSlug(q.title)}`;
const optKey = (title: string) => toSlug(title);

// djb2 hash -> chuỗi base36 ngắn, đủ ổn định cho signature
const djb2 = (str: string) => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash >>>= 0;
  }
  return hash.toString(36);
};

const buildSchemaHash = (form: AdoptionForm) => {
  const data = (form?.questions ?? [])
    .filter(q => q?.status !== "deleted") // tùy bạn, có thể giữ "active" thôi
    .map(q => ({
      k: qKey(q),
      t: q.type,
      p: q.priority,
      // options có thể rỗng với YESNO; cứ bọc an toàn
      opts: (q.options ?? []).map(o => optKey(o.title)),
    }));
  return djb2(JSON.stringify(data));
};

const buildDefaults = (form: AdoptionForm): Answers => {
  const out: Answers = {};
  (form?.questions ?? []).forEach(q => {
    out[q._id] = q.type === "MULTIPLECHOICE" ? [] : "";
  });
  return out;
};

// ---------- Convert answers <-> answersByKey ----------
const answersToByKey = (form: AdoptionForm, answers: Answers): AnswersByKey => {
  const byKey: AnswersByKey = {};
  (form?.questions ?? []).forEach(q => {
    const key = qKey(q);
    const val = answers[q._id];
    if (val == null) return;

    if (q.type === "MULTIPLECHOICE") {
      const arr = Array.isArray(val) ? val : [val];
      byKey[key] = arr.map(v => optKey(String(v))); // lưu option theo slug
    } else if (q.type === "TEXT") {
      byKey[key] = String(val); // giữ nguyên text
    } else if (q.type === "YESNO" || q.type === "SINGLECHOICE") {
      byKey[key] = optKey(String(val)); // lưu slug của lựa chọn
    }
  });
  return byKey;
};

const byKeyToAnswers = (form: AdoptionForm, byKey?: AnswersByKey): Answers => {
  const out = buildDefaults(form);
  if (!byKey) return out;

  (form?.questions ?? []).forEach(q => {
    const key = qKey(q);
    const saved = byKey[key];
    if (saved == null) return;

    if (q.type === "TEXT") {
      out[q._id] = String(saved);
      return;
    }

    if (q.type === "MULTIPLECHOICE") {
      const wanted = new Set((Array.isArray(saved) ? saved : [saved]).map(s => optKey(String(s))));
      const mapped = (q.options ?? [])
        .map(o => o.title)
        .filter(title => wanted.has(optKey(title)));
      out[q._id] = mapped;
      return;
    }

    // YESNO hoặc SINGLECHOICE
    if (q.type === "YESNO") {
      // Trong UI bạn render "Có"/"Không" cứng -> map slug
      const choice = optKey(String(saved)) === optKey("Có") ? "Có" : (optKey(String(saved)) === optKey("Không") ? "Không" : "");
      if (choice) out[q._id] = choice;
      return;
    }

    // SINGLECHOICE map theo options hiện tại
    const match = (q.options ?? [])
      .map(o => o.title)
      .find(title => optKey(title) === optKey(String(saved)));
    if (match) out[q._id] = match;
  });

  return out;
};

// ---------- LocalStorage keys ----------
const LS_ANSWERS_BY_KEY = (petId: string) => `adoptionFormAnswersByKey-${petId}`;
const LS_SIG           = (petId: string) => `adoptionFormSig-${petId}`;

const UserAdoptionFormPage = () => {
  const getInitialAnswers = (): Record<string, string | string[]> => {
    if (!id || submissionId) return {};
    const saved = localStorage.getItem(`adoptionFormAnswers-${id}`);
    return saved ? JSON.parse(saved) : {};
  };
  const { id, submissionId: routeSubmissionId } = useParams();
  const { coreAPI, userProfile } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<AdoptionForm | null>(null);
  const authAxios = useAuthAxios();
  const [submissionId, setSubmissionId] = useState<string | null>(routeSubmissionId ?? null);
  const [submission, setSubmission] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(getInitialAnswers);
  const [hasCheckedSubmitted, setHasCheckedSubmitted] = useState(false);
  const [hasChecked, setHasChecked] = useState<any>(null);
  const [consentForm, setConsentForm] = useState<ConsentForm | null>(null);
  const hasShownNotFoundToast = useRef(false);

  const navigate = useNavigate();
  const showErrorToast = (message: string) => {
    toast.error(message, {
      description: "Vui lòng thử lại hoặc liên hệ hỗ trợ.",
      duration: 5000,
    });
  };

 useEffect(() => {
  if (!id) return;

  // Dọn sạch mọi thứ thuộc pet trước
  setSubmissionId(routeSubmissionId ?? null);
  setSubmission(null);
  setConsentForm(null);
  setHasChecked(null);
  setHasCheckedSubmitted(false);
  setAnswers({});      // hoặc buildDefaults(form) nếu bạn đã có form
  setLoading(true);

  // Reset step & agreed theo cache của pet mới (nếu có)
  const savedStep = localStorage.getItem(`adoptionFormStep-${id}`);
  setStep(savedStep ? Number(savedStep) : 1);

  const savedAgreed = localStorage.getItem(`adoptionFormAgreed-${id}`);
  setAgreed(savedAgreed ? JSON.parse(savedAgreed) : false);

  // (tuỳ chọn) clear debounce cũ
  if (debounceRef.current) clearTimeout(debounceRef.current);
}, [id, routeSubmissionId]);    // <-- nhớ thêm cả routeSubmissionId


  const getInitialStep = () => {
    if (!id || submissionId) return 1;
    const saved = localStorage.getItem(`adoptionFormStep-${id}`);
    return saved ? Number(saved) : 1;
  };
  const [step, setStep] = useState<number>(getInitialStep);
  const getInitialAgreed = () => {
    if (!id || submissionId) return false;
    const saved = localStorage.getItem(`adoptionFormAgreed-${id}`);
    return saved ? JSON.parse(saved) : false;
  };
  const [agreed, setAgreed] = useState<boolean>(getInitialAgreed);
  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  const onAgree = () => {
    setAgreed(true);
  };

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  useEffect(() => {
    if (!id) return;
     setLoading(true);
  setForm(null);
  setSubmission(null);
  setConsentForm(null);
  setHasChecked(null);
  setSubmissionId(routeSubmissionId ?? null);

    const controller = new AbortController();
 const { signal } = controller;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await authAxios.get(`${coreAPI}/pets/get-adoptionForms-by-petId/${id}`);
        if (!res.data || Object.keys(res.data).length === 0) {
          if (!hasShownNotFoundToast.current) {
            showErrorToast("Không tìm thấy đơn xin nhận nuôi cho thú cưng này.");
            hasShownNotFoundToast.current = true;
          }
          navigate("/");
          return;
        }
        setForm(res.data);

      if (routeSubmissionId) {
        const subRes = await authAxios.get(
          `${coreAPI}/adoption-submissions/${routeSubmissionId}?t=${Date.now()}`,
          { signal }
        );
        const sub = subRes.data;
        setSubmissionId(routeSubmissionId);
        setSubmission(sub);

        // map answers nếu cần
        const parsed: Record<string, string | string[]> = {};
        sub.answers?.forEach((item: any) => {
          const qid = typeof item.questionId === "string" ? item.questionId : item.questionId?._id;
          if (!qid) return;
          parsed[qid] = item.selections.length === 1 ? item.selections[0] : item.selections;
        });
        setAnswers(parsed);
        setHasChecked({ selectedSchedule: Boolean(sub?.interview?.selectedSchedule) });
        setStep(computeStep(sub, null, { selectedSchedule: Boolean(sub?.interview?.selectedSchedule) }));
        return; 
      }


        
        // Kiểm tra đã nộp chưa
        const checkRes = await authAxios.post(
          `${coreAPI}/pets/${id}/adoption-submissions/check-user-submitted`,
          { adoptionFormId: res.data._id }
        );

        if (checkRes.data.submitted) {
          const status = checkRes.data.status;
          const selectedSchedule = checkRes.data.selectedSchedule;
          setSubmissionId(checkRes.data.submissionId);
          setAgreed(true);
          setHasChecked(checkRes.data);
          // Fetch consentForm nếu đã có submission

          try {
            const consentRes = await authAxios.get(`${coreAPI}/consentForms/get-by-user`);
            if (Array.isArray(consentRes.data)) {
              const consentFormMatched = consentRes.data.find(
                (form: ConsentForm) => form?.pet?._id === res.data.pet?._id
              );
              if (consentFormMatched) {
                setConsentForm(consentFormMatched);

                if (
                  consentFormMatched.status === "approved" ||
                  consentFormMatched.status === "rejected"
                ) {
                  setStep(6);
                  return;
                }
              }
            }
          } catch (error) {
            console.warn("Không tìm thấy consent form hoặc lỗi khi fetch:", error);
          }


          if (status === "pending" || status === "scheduling") {
            setStep(3);
          } else if (status === "interviewing" || status === "reviewed") {
            setStep(4);
          } else if (status === "rejected") {
            if (selectedSchedule) {
              setStep(6);
            } else {
              setStep(3);
            }
          } else if (status === "approved") {
            setStep(5);
          } else {
            setStep(3);
          }
        }
       else {
  // 1) Lấy cache theo khóa ổn định (nếu có)
  const savedByKeyRaw = localStorage.getItem(LS_ANSWERS_BY_KEY(id));
  const savedSig      = localStorage.getItem(LS_SIG(id));
  const schemaSig     = buildSchemaHash(res.data); // res.data = AdoptionForm

  let initialAnswers: Record<string, string | string[]>;

  if (savedByKeyRaw && savedSig === schemaSig) {
    // Map byKey -> answers theo questionId hiện tại
    const byKey = JSON.parse(savedByKeyRaw);
    initialAnswers = byKeyToAnswers(res.data, byKey);
  } else {
    // 2) Thử migrate dữ liệu legacy (đã lưu theo questionId)
    const legacy = localStorage.getItem(`adoptionFormAnswers-${id}`);
    if (legacy) {
      const legacyAnswers = JSON.parse(legacy);
      initialAnswers = {};
      res.data.questions.forEach((q: Question) => {
        const v = legacyAnswers[q._id];
        if (q.type === "MULTIPLECHOICE") {
          initialAnswers[q._id] = Array.isArray(v) ? v : v ? [v] : [];
        } else {
          initialAnswers[q._id] = typeof v === "string" ? v : Array.isArray(v) ? (v[0] ?? "") : "";
        }
      });
    } else {
      // 3) Không có gì lưu → mặc định trống
      initialAnswers = {};
      res.data.questions.forEach((q: Question) => {
        initialAnswers[q._id] = q.type === "MULTIPLECHOICE" ? [] : "";
      });
    }

    // 4) Ghi lại cache chuẩn hoá (bằng stable key) + chữ ký schema
    localStorage.setItem(LS_SIG(id), schemaSig);
    const byKey = answersToByKey(res.data, initialAnswers);
    localStorage.setItem(LS_ANSWERS_BY_KEY(id), JSON.stringify(byKey));
  }

  setAnswers(initialAnswers);

  // Giữ nguyên step/agreed như trước
  const savedStep   = localStorage.getItem(`adoptionFormStep-${id}`);
  const savedAgreed = localStorage.getItem(`adoptionFormAgreed-${id}`);
  setStep(savedStep ? Number(savedStep) : 1);
  setAgreed(savedAgreed ? JSON.parse(savedAgreed) : false);
}

      } catch (err) {
        // showErrorToast("Không thể lấy thông tin đơn xin nhận nuôid");

      } finally {
        setLoading(false);
        setHasCheckedSubmitted(true); //  Đánh dấu đã check xong
      }
    };
     fetchData();
  return () => {
    controller.abort();   // huỷ mọi request cũ khi đổi pet
  };
   
 }, [id]);


  useEffect(() => {
    const checkReturned = async () => {
      try {
        const res = await authAxios.get(`${coreAPI}/return-requests/get-by-user`);
        const hasReturned = res.data.some((req: any) =>
          req.pet?._id === id && req.status === "approved"
        );
        if (hasReturned) {
          showErrorToast("Bạn đã từng trả lại thú cưng này, không thể nhận nuôi lại.");

          navigate("/");
        }
      } catch (err) {
        showErrorToast("Không thể kiểm tra yêu cầu trả thú cưng");

      }
    };

    if (form && !submissionId) {
      checkReturned();
    }
  }, [form, submissionId]);


  // useEffect(() => {
  //   const fetchSubmission = async () => {
  //     if (!submissionId) return;
  //     try {
  //       const res = await authAxios.get(`${coreAPI}/adoption-submissions/${submissionId}`);
  //       setSubmission(res.data);
  //     } catch (err) {
  //       console.error("Lỗi khi lấy submission:", err);
  //     }
  //   };

  //   if (!submission && submissionId && hasCheckedSubmitted) {
  //     fetchSubmission();
  //   }
  // }, [submissionId, submission, hasCheckedSubmitted]);

  useEffect(() => {
  const fetchSubmission = async () => {
    if (!submissionId) return;
    try {
      const res = await authAxios.get(`${coreAPI}/adoption-submissions/${submissionId}`);
      const sub = res.data;

      // Nếu submission không thuộc pet hiện tại thì bỏ qua
      const petOfSubmission = sub?.adoptionForm?.pet?._id ?? sub?.pet?._id;
      if (petIdRef.current && petOfSubmission && petOfSubmission !== petIdRef.current) {
        return;
      }

      setSubmission(sub);
    } catch (err) {
      console.error("Lỗi khi lấy submission:", err);
    }
  };

  if (!submission && submissionId && hasCheckedSubmitted) {
    fetchSubmission();
  }
}, [submissionId, submission, hasCheckedSubmitted]);

  useEffect(() => {
    setStep(computeStep(submission, consentForm, hasChecked));
  }, [submission?.status, consentForm?.status, hasChecked?.selectedSchedule]);
  const computeStep = (
    sub: any | null,
    consent: ConsentForm | null,
    hasChecked: any
  ) => {
    const s = sub?.status;
    const consentStatus = consent?.status;

    if (consentStatus === "approved" || consentStatus === "cancelled") return 6;
    if (consentStatus === "send" || consentStatus === "rejected" ) return 5;
    if (s === "pending" || s === "scheduling") return 3;
    if (s === "interviewing" || s === "reviewed") return 4;
    if (s === "approved") return 5;
    if (s === "rejected") return hasChecked?.selectedSchedule ? 6 : 3;

    return 3;
  };

  // giữ id hiện hành để tránh stale closure
  const petIdRef = useRef<string | null>(null);
  const submissionIdRef = useRef<string | null>(null);
  useEffect(() => { petIdRef.current = id ?? null; }, [id]);
  useEffect(() => { submissionIdRef.current = submissionId ?? null; }, [submissionId]);
  // refetch consent form (get-by-user) và cập nhật step
  const fetchAndApplyConsent = useCallback(async () => {
    const consentRes = await authAxios.get(`${coreAPI}/consentForms/get-by-user`);
    if (Array.isArray(consentRes.data)) {
      const matched = consentRes.data.find((f: ConsentForm) => f?.pet?._id === petIdRef.current);
      if (matched) setConsentForm(matched);
      // tính step mới dựa trên submission/consent hiện tại
      setStep((prev) => computeStep(submission, matched ?? null, hasChecked));
    }
  }, [authAxios, coreAPI, submission, hasChecked]);

  const fetchAndApplySubmission = useCallback(async (sid: string) => {
    const res = await authAxios.get(`${coreAPI}/adoption-submissions/${sid}`);
    const fresh = res.data;
    setSubmission(fresh);
    // map answers
    const parsed: Record<string, string | string[]> = {};
    fresh.answers.forEach((item: any) => {
      const qid = typeof item.questionId === "string" ? item.questionId : item.questionId?._id;
      if (!qid) return;
      parsed[qid] = item.selections.length === 1 ? item.selections[0] : item.selections;
    });
    setAnswers(parsed);
    const selected = Boolean(fresh?.interview?.selectedSchedule);
    setHasChecked((prev: any) => ({ ...(prev ?? {}), selectedSchedule: selected }));

    // cập nhật step (không đụng consent ở đây)
    setStep(computeStep(fresh, consentForm, hasChecked));
  }, [authAxios, coreAPI, consentForm, hasChecked]);

  // debounce nhẹ để tránh spam refetch khi bắn nhiều event
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!id) return;

    const onSocketEvent = (eventName: string) => async (payload: any) => {
      // lọc theo pet đang xem
      if (payload?.petId && payload.petId !== petIdRef.current) return;

      // optimistic step khi biết status ngay trong payload
      if (eventName !== "consentForm:statusChanged") {
        const sid = submissionIdRef.current;
        if (sid && payload?.submissionId === sid) {
          // Nếu backend gửi kèm status thì dựa vào đó chuyển step nhanh
          if (payload?.status) {
            const tmpSubmission = {
              ...submission,
              status: payload.status,
              selectedSchedule: payload.selectedSchedule ?? submission?.selectedSchedule,
            };
            setStep(computeStep(tmpSubmission, consentForm, hasChecked));
          }

        }
      }
      if (eventName === "adoptionSubmission:statusChanged") {
        const sid = submissionIdRef.current;
        if (!sid || payload?.submissionId !== sid) return;

        const newStatus = payload?.status as string | undefined;
        if (!newStatus) return;

        // Ưu tiên lấy selectedSchedule từ payload; fallback sang state hiện tại/submission
        const selected =
          payload?.selectedSchedule !== undefined
            ? Boolean(payload.selectedSchedule)
            : Boolean(hasChecked?.selectedSchedule ?? submission?.interview?.selectedSchedule);

        setHasChecked((prev: any) => ({ ...(prev ?? {}), selectedSchedule: selected }));
        setSubmission((prev: any) =>
          prev
            ? {
              ...prev,
              status: newStatus,
              interview: { ...(prev.interview ?? {}), selectedSchedule: selected },
            }
            : prev
        );
        if (newStatus === "rejected") {
          setStep(selected ? 6 : 3);
        } else {
          const tmp = { ...(submission ?? {}), status: newStatus };
          setStep(
            computeStep(tmp, consentForm, { ...(hasChecked ?? {}), selectedSchedule: selected })
          );
        }

        // Refetch nhẹ để đồng bộ đầy đủ
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
          const sid2 = submissionIdRef.current;
          await Promise.allSettled([sid2 ? fetchAndApplySubmission(sid2) : Promise.resolve()]);
        }, 150);

        return;
      }

      if (eventName === "consentForm:statusChanged") {
  const { status: st, petId, consentFormId } = payload ?? {};
  if (!st) return;

  // Chỉ xử lý nếu đúng pet đang mở
  if (petIdRef.current && petId && petId !== petIdRef.current) return;

  // Cập nhật lạc quan trạng thái ngay lập tức để UI phản hồi nhanh
  setConsentForm((prev) => {
    if (!prev) {
      // nếu chưa có consentForm trong state thì chỉ set tối thiểu các field cần thiết
      return consentFormId
        ? ({ _id: consentFormId, status: st } as any)
        : (prev as any);
    }
    return { ...prev, status: st };
  });

  // Với "send" và "rejected": refetch NGAY để hydrate nội dung Step 5 trước khi hiển thị
  if (st === "send" || st === "rejected") {
    fetchAndApplyConsent().catch(() => {});
    setStep((prev) => (prev < 5 ? 5 : prev));
  }

  // Với "approved" / "cancelled": nhảy thẳng Step 6; vẫn refetch để đồng bộ dữ liệu
  if (st === "approved" || st === "cancelled") {
    setStep(6);
    fetchAndApplyConsent().catch(() => {});
  }

  // Debounce refetch để đảm bảo state đồng bộ tuyệt đối sau đó
  if (debounceRef.current) clearTimeout(debounceRef.current);
  debounceRef.current = setTimeout(() => {
    fetchAndApplyConsent().catch(() => {});
  }, 150);

  return;
}


      // debounce refetch: submission/consent chạy song song khi cần
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        const sid = submissionIdRef.current;

        await Promise.allSettled([
          // Khi là event liên quan submission ⇒ refetch submission (nếu đang xem đúng submission)
          (eventName === "adoptionSubmission:interviewSchedule" ||
            eventName === "adoptionSubmission:statusChanged") && sid && payload?.submissionId === sid
            ? fetchAndApplySubmission(sid)
            : Promise.resolve(),

          // Khi là event consent ⇒ refetch consent
          eventName === "consentForm:statusChanged"
            ? fetchAndApplyConsent()
            : Promise.resolve(),
        ]);
      }, 150);
    };

    // đăng ký một lần cho tất cả event liên quan user
    const bindings: Array<[string, (p: any) => void]> = [
      ["adoptionSubmission:interviewSchedule", onSocketEvent("adoptionSubmission:interviewSchedule")],
      // nếu sau này bạn bắn statusChanged về user thì đã sẵn sàng:
      ["adoptionSubmission:statusChanged", onSocketEvent("adoptionSubmission:statusChanged")],
      ["consentForm:statusChanged", onSocketEvent("consentForm:statusChanged")],
    ];

    // đảm bảo không nhân bản listener
    bindings.forEach(([ev]) => socketClient.unsubscribe(ev));
    bindings.forEach(([ev, cb]) => socketClient.subscribe(ev, cb));

    return () => {
      bindings.forEach(([ev]) => socketClient.unsubscribe(ev));
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [id, fetchAndApplySubmission, fetchAndApplyConsent, submission, consentForm, hasChecked]);



  // Ghi lại mỗi khi step thay đổi
  useEffect(() => {
    if (id && hasCheckedSubmitted && !submissionId) {
      localStorage.setItem(`adoptionFormStep-${id}`, step.toString());
    }
  }, [step, id, submissionId, hasCheckedSubmitted]);

  useEffect(() => {
    if (id && hasCheckedSubmitted && !submissionId) {
      localStorage.setItem(`adoptionFormAgreed-${id}`, JSON.stringify(agreed));
    }
  }, [agreed, id, submissionId, hasCheckedSubmitted]);

useEffect(() => {
  if (!id || !hasCheckedSubmitted || submissionId || !form) return;
  localStorage.setItem(LS_SIG(id), buildSchemaHash(form));
  localStorage.setItem(LS_ANSWERS_BY_KEY(id), JSON.stringify(answersToByKey(form, answers)));
}, [answers, id, submissionId, hasCheckedSubmitted, form]);


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);



  if (loading || !form || !hasCheckedSubmitted) {
    return <div className="text-center mt-10">Đang tải dữ liệu thú cưng...</div>;
  }

  const steps = ["Quy định chung", "Đăng ký nhận nuôi", "Chờ phản hồi", "Xác nhận lịch phỏng vấn", "Đơn cam kết", "Kết quả"];
  const status = submission?.status;
  const consentStatus = consentForm?.status;

  let maxStep = step - 1;

  if (status === "pending" || status === "scheduling") {
    maxStep = 2;
  } else if (status === "interviewing" || status === "reviewed") {
    maxStep = 3;
  } else if (status === "rejected") {
    if (hasChecked?.selectedSchedule) {
      maxStep = 5;
    } else {
      maxStep = 2;
    }
  }
  else if (status === "approved") {
    maxStep = 4;
  }
  if (consentStatus === "send" || consentStatus === "rejected" ) {
    maxStep = 4;
  }
  if (consentStatus === "approved" || consentStatus === "cancelled") {
    maxStep = 5;
  }

  const renderStepIndicator = () => (
    <TooltipProvider>
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto px-4 py-4 relative">
        {steps.map((label, index) => {
          const isActive = index === step - 1;
          const isCompleted = index < maxStep;
          const isLineCompleted = index < maxStep;
          const isLast = index === steps.length - 1;
          const canNavigate = index <= maxStep;

          const tooltipMessage = isCompleted
            ? "Bước đã hoàn thành"
            : isActive
              ? "Bước hiện tại"
              : `Cần hoàn thành bước trước để đến "${label}"`;

          const StepCircle = (
            <div
              className={`
    rounded-full w-12 h-12 flex items-center justify-center text-sm font-semibold
    transition-transform duration-300 ease-in-out
    ${isActive ? "bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white scale-125 shadow-xl z-10" : ""}
    ${isCompleted ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white" : ""}
    ${!isActive && !isCompleted ? "bg-slate-200 text-slate-500" : ""}
  `}
              style={{ transformOrigin: "center" }}
            >
              {index + 1}
            </div>

          );

          return (
            <div
              key={index}
              className={`relative flex-1 flex items-center justify-center ${canNavigate ? "cursor-pointer" : "cursor-not-allowed"
                }`}
              onClick={() => {
                if (canNavigate) {
                  if (index + 1 === 4) {
                    if (submission?.status === "pending" || submission?.status === "scheduling") {
                      showErrorToast("Bạn chưa thể xác nhận lịch phỏng vấn. Đơn đang chờ xử lý.");

                      return;
                    }
                  }
                  setStep(index + 1);
                }
              }}
            >
              {!isLast && (
                <div className="absolute top-1/3 left-1/2 w-full h-1 bg-gray-300 z-0">
                  <div
                    className={`h-1 transition-all duration-300 ${isLineCompleted ? "bg-green-500 w-full" : "bg-gray-300 w-0"
                      }`}
                  />
                </div>
              )}

              <div className="relative z-10 flex flex-col items-center">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    {StepCircle}
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-sm text-center">
                    {tooltipMessage}
                  </TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="text-sm font-medium mt-1 text-center">
                      {label}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-sm text-center">
                    {tooltipMessage}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );



  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return <Step1_Introduction
          form={form}
          agreed={agreed}
          onAgree={onAgree}
          setAgreed={setAgreed}
          onNext={next}
          readOnly={!!submissionId}
          onBack={back} />;
      case 2:
        return (
          <Step2_AdoptionForm
            questions={form.questions}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onNext={(id) => {
              if (id) setSubmissionId(id);
              next();
            }}
            onBack={back}
            onNextNormal={next}
            form={form}
            userProfile={userProfile}
            readOnly={!!submissionId}
          />


        );
      case 3:
        return <Step3_SubmissionForm
          submissionId={submissionId}
          onNext={() => {
            if (submission?.status === "pending" || submission?.status === "scheduling") {
              showErrorToast("Bạn chưa thể xác nhận lịch phỏng vấn. Đơn đang chờ xử lý.");

              return;
            }
            next();
          }}
          onBack={back}
          onLoadedSubmission={(submission) => {
            setSubmission(submission);
            const parsed: Record<string, string | string[]> = {};
            submission.answers.forEach((item: any) => {
              const qid = typeof item.questionId === "string"
                ? item.questionId
                : item.questionId?._id;

              if (!qid) return;
              parsed[qid] = item.selections.length === 1 ? item.selections[0] : item.selections;
            });

            setAnswers(parsed);
          }}
          submission={submission}
        />


      case 4:
        return <Step4_ScheduleConfirm
          submissionId={submissionId}
          onNext={next} onBack={back}
          onLoadedSubmission={(submission) => {
            setSubmission(submission);
            const parsed: Record<string, string | string[]> = {};
            submission.answers.forEach((item: any) => {
              const qid = typeof item.questionId === "string"
                ? item.questionId
                : item.questionId?._id;

              if (!qid) return;
              parsed[qid] = item.selections.length === 1 ? item.selections[0] : item.selections;
            });

            setAnswers(parsed);
          }} />;

      case 5:
        return <Step5_ConsentForm
         key={(consentForm?._id ?? "no-id") + "-" + (consentForm?.updatedAt ?? "no-updated")}
          onNext={next}
          onBack={back}
          submission={submission}
          onLoadedConsentForm={(f) => setConsentForm(f)}
          consentForm={consentForm}
        />

      case 6:
        return <Step6_Result
          onNext={next}
          onBack={back}
          submission={submission}
          consentForm={consentForm}
        />
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            {userProfile?._id ? (
              <BreadcrumbLink asChild>
                <Link to={`/profile/${userProfile._id}`}>Hoạt động nhận nuôi</Link>
              </BreadcrumbLink>
            ) : (
              // Khi chưa có id thì chỉ hiện text, không cho click
              <BreadcrumbPage className="text-muted-foreground">
                Hoạt động nhận nuôi
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Chi tiết đơn nhận nuôi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {renderStepIndicator()}
      {renderCurrentStep()}
    </div>
  );
};

export default UserAdoptionFormPage;
