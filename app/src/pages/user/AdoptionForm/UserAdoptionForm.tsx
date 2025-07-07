import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import AppContext from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import Step1_Introduction from "@/components/user/AdoptionForm/Step1_Introduction";
import Step2_AdoptionForm from "@/components/user/AdoptionForm/Step2_AdoptionForm";
import Step3_SubmissionForm from "@/components/user/AdoptionForm/Step3_SubmissionForm";
import Step4_ConsentForm from "@/components/user/AdoptionForm/Step4_ConsentForm";
import type { AdoptionForm } from "@/types/AdoptionForm";
import type { Question } from "@/types/Question";

const UserAdoptionFormPage = () => {
  const getInitialAnswers = (): Record<string, string | string[]> => {
    if (!id) return {};
    const saved = localStorage.getItem(`adoptionFormAnswers-${id}`);
    return saved ? JSON.parse(saved) : {};
  };

  const { id } = useParams();
  const { coreAPI, userProfile } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<AdoptionForm | null>(null);
  const authAxios = useAuthAxios();
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(getInitialAnswers);



  console.log("answers user", answers);



  const getInitialStep = () => {
    if (!id) return 1;
    const saved = localStorage.getItem(`adoptionFormStep-${id}`);
    return saved ? Number(saved) : 1;
  };
  const [step, setStep] = useState<number>(getInitialStep);
  const getInitialAgreed = () => {
    if (!id) return false;
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
        setForm(res.data);

        // Khởi tạo câu trả lời mặc định
        const defaultAnswers: Record<string, string | string[]> = {};
        res.data.questions.forEach((q: Question) => {
          defaultAnswers[q._id] = q.type === "MULTIPLECHOICE" ? [] : "";
        });
        // Lấy answers đã lưu
        const savedAnswers = localStorage.getItem(`adoptionFormAnswers-${id}`);
        if (savedAnswers) {
          setAnswers(JSON.parse(savedAnswers));
        } else {
          setAnswers(defaultAnswers);
        }

        // Lấy trạng thái agreed
        const savedAgreed = localStorage.getItem(`adoptionFormAgreed-${id}`);
        if (savedAgreed) {
          setAgreed(JSON.parse(savedAgreed));
        }

        // Gọi API kiểm tra đã nộp chưa
        const checkRes = await authAxios.post(
          `${coreAPI}/pets/${id}/adoption-submissions/check-user-submitted`,
          { adoptionFormId: res.data._id }
        );
        if (checkRes.data.submitted) {
          setStep(3);
          setSubmissionId(checkRes.data.submissionId);
        } else {
          // Nếu chưa nộp thì lấy step từ localStorage
          const savedStep = localStorage.getItem(`adoptionFormStep-${id}`);
          if (savedStep) {
            setStep(Number(savedStep));
          }
        }
      } catch (err) {
        toast.error("Không thể lấy thông tin đơn xin nhận nuôi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Ghi lại mỗi khi step thay đổi
  useEffect(() => {
    if (id) {
      localStorage.setItem(`adoptionFormStep-${id}`, step.toString());
    }
  }, [step, id]);
  // Lưu agreed
  useEffect(() => {
    if (id) {
      localStorage.setItem(`adoptionFormAgreed-${id}`, JSON.stringify(agreed));
    }
  }, [agreed, id]);

  // Lưu answers
  useEffect(() => {
    if (id) {
      localStorage.setItem(`adoptionFormAnswers-${id}`, JSON.stringify(answers));
    }
  }, [answers, id]);


  if (loading || !form) {
    return <div className="text-center mt-10">Đang tải dữ liệu thú cưng...</div>;
  }

  const steps = ["Quy định chung", "Đăng ký nhận nuôi", "Chờ phản hồi", "Đơn cam kết"];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto px-4 py-4 relative">
      {steps.map((label, index) => {
        const isActive = index === step - 1;
        const isCompleted = index < step - 1;
        const isLast = index === steps.length - 1;

        return (
          <div key={index} className="relative flex-1 flex items-center justify-center">
            {!isLast && (
              <div className="absolute top-1/3 left-1/2 w-full h-1 bg-gray-300 z-0">
                <div className={`h-1 ${isCompleted ? "bg-green-500 w-full" : "bg-gray-300 w-0"}`} />
              </div>
            )}

            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`rounded-full w-12 h-12 flex items-center justify-center text-sm font-medium
                ${isCompleted ? "bg-green-500 text-white" : isActive ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"}`}
              >
                {index + 1}
              </div>
              <div className="text-sm font-medium mt-1">{label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );

console.log("ngu",form.questions);


  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return <Step1_Introduction
          form={form}
          agreed={agreed}
          onAgree={onAgree}
          setAgreed={setAgreed}
          onNext={next}
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
            form={form}
            userProfile={userProfile}
            readOnly={!!submissionId}
          />


        );
      case 3:
        return <Step3_SubmissionForm
          submissionId={submissionId}
          onNext={next}
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
        return <Step4_ConsentForm onNext={next} onBack={back} />;
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
