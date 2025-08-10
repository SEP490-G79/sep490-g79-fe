import { useEffect, useState, useContext, useRef } from "react";
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
  // Không toast lỗi vì việc không tìm thấy consent form là bình thường
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
          const savedAnswers = localStorage.getItem(`adoptionFormAnswers-${id}`);
          const savedStep = localStorage.getItem(`adoptionFormStep-${id}`);
          const savedAgreed = localStorage.getItem(`adoptionFormAgreed-${id}`);

          const defaultAnswers: Record<string, string | string[]> = {};
          res.data.questions.forEach((q: Question) => {
            defaultAnswers[q._id] = q.type === "MULTIPLECHOICE" ? [] : "";
          });

          setAnswers(savedAnswers ? JSON.parse(savedAnswers) : defaultAnswers);
          setStep(savedStep ? Number(savedStep) : 1);
          setAgreed(savedAgreed ? JSON.parse(savedAgreed) : false);
        }
      } catch (err) {
        showErrorToast("Không thể lấy thông tin đơn xin nhận nuôi");

      } finally {
        setLoading(false);
        setHasCheckedSubmitted(true); //  Đánh dấu đã check xong
      }
    };

    fetchData();
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


  useEffect(() => {
    const fetchSubmission = async () => {
      if (!submissionId) return;
      try {
        const res = await authAxios.get(`${coreAPI}/adoption-submissions/${submissionId}`);
        setSubmission(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy submission:", err);
      }
    };

    if (!submission && submissionId && hasCheckedSubmitted) {
      fetchSubmission();
    }
  }, [submissionId, submission, hasCheckedSubmitted]);



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
    if (id && hasCheckedSubmitted && !submissionId) {
      localStorage.setItem(`adoptionFormAnswers-${id}`, JSON.stringify(answers));
    }
  }, [answers, id, submissionId, hasCheckedSubmitted]);

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
  if (consentStatus === "approved" || consentStatus === "rejected") {
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
          onNext={next}
          onBack={back}
          submission={submission}
          onLoadedConsentForm={(form) => setConsentForm(form)} />

      case 6:
        return <Step6_Result onNext={next} onBack={back} submission={submission} consentForm={consentForm} />
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-5">
      {renderStepIndicator()}
      {renderCurrentStep()}
    </div>
  );
};

export default UserAdoptionFormPage;
