import { Button } from "@/components/ui/button";
import React, { useContext, useEffect, useState } from "react";
import type { Question } from "@/types/Question";
import type { AdoptionForm } from "@/types/AdoptionForm";
import type { User } from "@/types/User";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
    CardDescription,
} from "@/components/ui/card";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Car, Flag } from "lucide-react";
import useAuthAxios from "@/utils/authAxios";
import { toast } from "sonner";
import AppContext from "@/context/AppContext";




interface Step2Props {
    questions: Question[];
    answers: Record<string, string | string[]>;
    onAnswerChange: (questionId: string, value: string | string[]) => void;
    onNext: (submissionId?: string) => void;
    onBack: () => void;
    form: AdoptionForm;
    userProfile: User | null;
    readOnly?: boolean;
    onNextNormal: () => void

}


const Step2_AdoptionForm = ({ questions, answers, onAnswerChange, onNext, onBack, form, userProfile, readOnly, onNextNormal }: Step2Props) => {
    const pet = form.pet;
    const activeQuestions = questions.filter((q) => q.status === "active");
    const authAxios = useAuthAxios();
    const { coreAPI } = useContext(AppContext);
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [openConfirm, setOpenConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAnswerChange = (qid: string, value: string | string[]) => {
        onAnswerChange(qid, value);
        const question = questions.find(q => q._id === qid);
        if (question) validateQuestion(question, value);
    };

    const clearAdoptionFormCache = (petId: string) => {
        localStorage.removeItem(`adoptionFormStep-${petId}`);
        localStorage.removeItem(`adoptionFormAnswers-${petId}`);
        localStorage.removeItem(`adoptionFormAgreed-${petId}`);
    };

    const validateRequiredQuestions = () => {
        const requiredQuestions = activeQuestions.filter((q) => q.priority !== "none");

        const hasUnansweredRequired = requiredQuestions.some((q) => {
            const value = answers[q._id];

            if (q.type === "TEXT") {
                return !value || (typeof value === "string" && value.trim() === "");
            }

            if (q.type === "SINGLECHOICE") {
                return !value || value === "";
            }

            if (q.type === "MULTIPLECHOICE") {
                return !Array.isArray(value) || value.length === 0;
            }

            return false;
        });

        if (hasUnansweredRequired) {
            toast.error("Vui lòng trả lời tất cả các câu hỏi bắt buộc trước khi nộp đơn.");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true); // bật loading
            const payload = {
                adoptionFormId: form._id,
                answers: Object.entries(answers).map(([questionId, value]) => ({
                    questionId,
                    selections: Array.isArray(value) ? value : [value],
                })),
                adoptionsLastMonth: 0,
                total: 0,
            };

            const res = await authAxios.post(
                `${coreAPI}/pets/${form.pet._id}/adoption-submissions/create-adoption-submission`,
                payload
            );

            toast.success("Nộp đơn thành công");
            clearAdoptionFormCache(form.pet._id);
            onNext(res.data._id);
        } catch (error) {
            toast.error("Có lỗi xảy ra khi nộp đơn");
            console.error(error);
        } finally {
            setIsSubmitting(false); // tắt loading dù thành công hay thất bại
        }
    };


    const handleSingleChange = (qid: string, value: string) => {
        handleAnswerChange(qid, value);
    };

    const handleMultipleChange = (qid: string, value: string) => {
        const current = Array.isArray(answers[qid]) ? (answers[qid] as string[]) : [];
        const updated = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
        handleAnswerChange(qid, updated);
    };

    // kiểm tra câu hỏi bắt buộc
    const validateQuestion = (question: Question, value?: string | string[]) => {
        const answer = value !== undefined ? value : answers[question._id];

        const isEmpty =
            (question.priority !== "none") &&
            (
                (question.type === "TEXT" && (!answer || (answer as string).trim() === "")) ||
                (question.type === "SINGLECHOICE" && !answer) ||
                (question.type === "MULTIPLECHOICE" && (!Array.isArray(answer) || answer.length === 0))
            );

        setErrors((prev) => ({
            ...prev,
            [question._id]: isEmpty,
        }));
    };


    return (
        <div className="flex justify-center">
            <div className="w-full max-w-4xl">
                <div >
                    <div className="space-y-6 pt-12 pb-5">
                        <Card className="dark:border-primary">
                            <CardHeader className="space-y-4">
                                <CardTitle className="text-2xl font-semibold">
                                    Đơn đăng ký nhận nuôi {pet?.name}
                                </CardTitle>

                                <p className="text-sm leading-relaxed text-foreground">
                                    <span className="font-semibold">{form?.shelter}</span>
                                    {", "}
                                    xin chân thành cảm ơn bạn đã quan tâm đến việc nhận nuôi các bé chó/mèo ở sân.
                                    Trước khi điền vào biểu mẫu đăng ký, bạn vui lòng đọc kỹ các điều kiện nhận nuôi dưới đây.
                                    Nếu đồng ý, hãy cung cấp đầy đủ thông tin theo biểu mẫu.
                                    Những thông tin bạn cung cấp sẽ giúp sân hiểu rõ hơn về nhu cầu và khả năng chăm sóc thú cưng,
                                    từ đó hỗ trợ bạn tốt hơn trong quá trình nhận nuôi.
                                </p>

                                <CardDescription className="flex items-start text-sm text-muted-foreground">
                                    <span className="italic">
                                        Lưu ý: Thông tin bạn cung cấp chỉ được sử dụng để hỗ trợ tìm kiếm người phù hợp nhất với thú cưng
                                        và sẽ không được sử dụng cho bất kỳ mục đích nào khác.
                                    </span>
                                </CardDescription>
                            </CardHeader>

                            <Separator className="dark:bg-primary" />

                            <CardContent className="space-y-4">
                                <h2 className="text-xl font-semibold">Thông tin cơ bản</h2>
                                {userProfile && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                        <p className="text-sm">
                                            <span className="font-semibold">Họ và tên:</span> {userProfile.fullName}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-semibold">Email:</span> {userProfile.email}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-semibold">Nơi ở hiện tại:</span> {userProfile.address}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-semibold">Số điện thoại:</span> {userProfile.phoneNumber}
                                        </p>
                                    </div>
                                )}
                            </CardContent>

                            <Separator className="dark:bg-primary" />

                            <CardFooter>
                                <p className="text-sm text-red-500 italic">* Biểu thị câu hỏi bắt buộc</p>
                            </CardFooter>
                        </Card>



                        {activeQuestions.map((q) => (
                            <Card key={q._id} className="space-y-2 dark:border-primary ">
                                <CardHeader>
                                    <CardTitle>
                                        <p className="font-medium ">
                                            {q.title}{" "}
                                            {q.priority !== "none" && <span className="text-red-500">*</span>}
                                        </p>
                                    </CardTitle>
                                    <CardDescription>
                                        {q.type === "SINGLECHOICE" && (
                                            <p className="text-sm text-gray-500 italic">Chỉ chọn 1 đáp án</p>
                                        )}
                                        {q.type === "MULTIPLECHOICE" && (
                                            <p className="text-sm text-gray-500 italic">Bạn có thể chọn nhiều đáp án</p>
                                        )}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    {q.options.map((opt, idx) => {
                                        let checked = false;

                                        if (q.type === "SINGLECHOICE") {
                                            checked = answers[q._id] === opt.title;
                                        }

                                        if (q.type === "MULTIPLECHOICE") {
                                            checked = Array.isArray(answers[q._id]) && answers[q._id].includes(opt.title);
                                        }

                                        return (
                                            <label key={idx} className="flex items-center space-x-2 mb-1">
                                                <input
                                                    type={q.type === "SINGLECHOICE" ? "radio" : "checkbox"}
                                                    name={q._id}
                                                    value={opt.title}
                                                    checked={checked}

                                                    disabled={readOnly}
                                                    onChange={() => {
                                                        if (!readOnly) {
                                                            if (q.type === "SINGLECHOICE") {
                                                                handleSingleChange(q._id, opt.title);

                                                            } else if (q.type === "MULTIPLECHOICE") {
                                                                handleMultipleChange(q._id, opt.title);

                                                            }
                                                        }
                                                    }}
                                                />
                                                <span>{opt.title}</span>
                                            </label>
                                        );
                                    })}



                                    {q.type === "TEXT" && (
                                        readOnly ? (
                                            <p className="text-sm dark:text-white whitespace-pre-line">
                                                {answers[q._id] || <i>Không có câu trả lời</i>}
                                            </p>
                                        ) : (
                                            <textarea
                                                className="w-full border-0 border-b border-gray-300 
                                                focus:border-b-2 focus:border-primary 
                                                 outline-none p-2 transition-all duration-200 ease-in-out"
                                                rows={2}

                                                value={answers[q._id] || ""}
                                                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                                placeholder="Hãy nhập câu trả lời"
                                            />
                                        )
                                    )}


                                    {errors[q._id] && (
                                        <p className="text-sm text-red-500 mt-1 italic">Đây là một câu hỏi bắt buộc</p>
                                    )}

                                </CardContent>
                            </Card>
                        ))}

                    </div>



                    {/* Navigation Buttons */}
                    <div className="flex justify-between ">
                        <Button variant="outline" onClick={onBack}>
                            {readOnly ? "Xem lại" : "Quay lại"
                            }
                        </Button>

                        {readOnly && (
                            <Button variant="outline" className="bg-primary" onClick={onNextNormal}>
                                Tiếp theo
                            </Button>
                        )

                        }


                        {!readOnly && (
                            <Button onClick={() => {
                                if (validateRequiredQuestions()) {
                                    setOpenConfirm(true);
                                }
                            }}>
                                Gửi yêu cầu
                            </Button>
                        )}
                    </div>

                    <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Bạn có chắc chắn?</DialogTitle>
                            </DialogHeader>
                            <p className="text-sm text-muted-foreground">
                                Bạn có chắc muốn gửi yêu cầu nhận nuôi? Sau khi gửi sẽ không thể chỉnh sửa.
                            </p>
                            <DialogFooter className="pt-4">
                                <Button variant="outline" onClick={() => setOpenConfirm(false)}>
                                    Huỷ
                                </Button>
                                <Button
                                    disabled={isSubmitting}
                                    onClick={async () => {
                                        setOpenConfirm(false);
                                        await handleSubmit();
                                    }}
                                >
                                    {isSubmitting ? "Đang gửi..." : "Đồng ý và gửi"}
                                </Button>

                            </DialogFooter>
                        </DialogContent>
                    </Dialog>



                </div>
            </div>
        </div>
    );
};

export default Step2_AdoptionForm;
