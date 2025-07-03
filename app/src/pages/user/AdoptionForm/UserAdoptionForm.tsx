import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import type { Pet } from "@/types/Pet";
import AppContext from "@/context/AppContext";
import Step1_Introduction from "@/components/user/AdoptionForm/Step1_Introduction";
import Step2_AdoptionForm from "@/components/user/AdoptionForm/Step2_AdoptionForm";
import Step3_SubmissionForm from "@/components/user/AdoptionForm/Step3_SubmissionForm";
import Step4_ConsentForm from "@/components/user/AdoptionForm/Step4_ConsentForm";
import type { AdoptionForm } from "@/types/AdoptionForm";
import useAuthAxios from "@/utils/authAxios";


const UserAdoptionFormPage = () => {
  const [step, setStep] = useState(1);
  const { id } = useParams();
  const { coreAPI, userProfile } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState<AdoptionForm | null>(null);
  const authAxios = useAuthAxios();
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});


  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);


  const handleAnswerChange = (questionId: string, value: string | string[]) => {
  setAnswers((prev) => ({ ...prev, [questionId]: value }));
};

  useEffect(() => {
    if (!id) return;
    authAxios
      .get(`${coreAPI}/pets/get-adoptionForms-by-petId/${id}`)
      .then((res) => {
        setForm(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Không thể lấy thông tin đơn xín nhận nuôi");
        setLoading(false);
      });
  }, [id]);



  // 👇 Kiểm tra pet trước khi tạo mockForm
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
            {/* Thanh nối (kéo dài sang phải, nằm giữa vòng tròn) */}
            {!isLast && (
              <div className="absolute top-1/3 left-1/2 w-full h-1 bg-gray-300 z-0">
                <div
                  className={`h-1 transition-all duration-300 ${isCompleted ? "bg-green-500 w-full" : "bg-gray-300 w-0"
                    }`}
                />
              </div>
            )}

            {/* Step circle + label */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`rounded-full w-12 h-12 flex items-center justify-center text-sm font-medium ${isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
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



  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return <Step1_Introduction
          form={form}
          agreed={agreed}
          onAgree={onAgree}
          onNext={next}
          onBack={back}
        />;
     case 2:
  return (
    <Step2_AdoptionForm
      questions={form.questions}
      answers={answers}
      onAnswerChange={handleAnswerChange}
      onNext={next}
      onBack={back}
      form={form}
      userProfile={userProfile} 
    />
  );

      case 3:
        return <Step3_SubmissionForm onNext={next} onBack={back} />;
      case 4:
        return <Step4_ConsentForm onNext={next} onBack={back} />;
      default:
        return null;
    }
  };

  const onAgree = () => {
    setAgreed(true);
    next(); // sang bước tiếp theo
  };


  return (
    <div className="max-w-6xl mx-auto px-6 py-5">
      {/* Progress Bar */}
      <div className="flex items-center justify-between w-full max-w-4xl mx-auto px-4 ">
        {renderStepIndicator()}
      </div>

      {/* Nội dung từng bước */}
      {renderCurrentStep()}
    </div>
  );
};

export default UserAdoptionFormPage;
