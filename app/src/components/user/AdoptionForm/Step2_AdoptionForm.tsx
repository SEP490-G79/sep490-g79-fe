import { Button } from "@/components/ui/button";
import React from "react";
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
import { Separator } from "@/components/ui/separator";
import { Car, Flag } from "lucide-react";




interface Step2Props {
    questions: Question[];
    answers: Record<string, string | string[]>;
    onAnswerChange: (questionId: string, value: string | string[]) => void;
    onNext: () => void;
    onBack: () => void;
    form: AdoptionForm;
    userProfile: User | null;
}


const Step2_AdoptionForm = ({ questions, answers, onAnswerChange, onNext, onBack, form, userProfile }: Step2Props) => {
    const pet = form.pet;

    console.log("userProfile:", userProfile);

    const handleSingleChange = (qid: string, value: string) => {
        onAnswerChange(qid, value);
    };

    const handleMultipleChange = (qid: string, value: string) => {
        const current = Array.isArray(answers[qid]) ? (answers[qid] as string[]) : [];
        const updated = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
        onAnswerChange(qid, updated);
    };

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-4xl">
                <div >
                    <div className="space-y-6 pt-12 pb-5">
                        <Card className="dark:border-primary">
                            <CardHeader>
                                <CardTitle className="text-2xl font-semibold "> Đơn đăng kí nhận nuôi {pet?.name}</CardTitle>
                                <div> <span className="font-semibold">{form?.shelter}</span>{', '}
                                    xin chân thành cảm ơn các bạn đã quan tâm đến việc nhận nuôi các bé chó/mèo ở sân. Trước khi điền vào biểu mẫu đăng ký, các bạn vui lòng đọc kỹ các điều kiện nhận nuôi dưới đây. Nếu các bạn đồng ý với những điều kiện này, vui lòng cung cấp đầy đủ thông tin trong biểu mẫu.
                                    Những thông tin các bạn cung cấp sẽ giúp sân hiểu rõ hơn về nhu cầu và khả năng chăm sóc thú cưng của bạn, từ đó có thể hỗ trợ bạn tốt nhất trong quá trình nhận nuôi.
                                </div>
                                <CardDescription className="text-sm text-muted-foreground"> Lưu ý: Thông tin bạn cung cấp chỉ được sử dụng để hỗ trợ tìm kiếm người phù hợp nhất với thú cưng và sẽ không được sử dụng cho bất kỳ mục đích nào khác.</CardDescription>
                            </CardHeader>
                            <Separator className="dark:bg-primary" />
                            <CardContent>
                                <CardTitle className="text-xl font-semibold mb-2">
                                    Thông tin cơ bản
                                </CardTitle>
                                {userProfile && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
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
                                  <CardDescription>Lưu ý: Thông tin bạn cung cấp chỉ được sử dụng để hỗ trợ tìm kiếm người phù hợp nhất với thú cưng và sẽ không được sử dụng cho bất kỳ mục đích nào khác.</CardDescription>
                            </CardFooter>

                        </Card>


                        {questions.map((q) => (

                            <Card key={q._id} className="space-y-2 dark:border-primary ">
                                <CardHeader>
                                    <CardTitle>
                                        <p className="font-medium ">
                                            {q.title}{" "}
                                            {q.priority === "high" && <span className="text-red-500">*</span>}
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
                                    {q.type === "SINGLECHOICE" &&
                                        q.options.map((opt, idx) => (
                                            <label key={idx} className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name={q._id}
                                                    value={opt.title}
                                                    checked={answers[q._id] === opt.title}
                                                    onChange={() => handleSingleChange(q._id, opt.title)}
                                                />
                                                <span>{opt.title}</span>
                                            </label>
                                        ))}

                                    {q.type === "MULTIPLECHOICE" &&
                                        q.options.map((opt, idx) => (
                                            <label key={idx} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    name={`${q._id}-${idx}`}
                                                    value={opt.title}
                                                    checked={(answers[q._id] as string[])?.includes(opt.title)}
                                                    onChange={() => handleMultipleChange(q._id, opt.title)}
                                                />
                                                <span>{opt.title}</span>
                                            </label>
                                        ))}

                                    {q.type === "TEXT" && (
                                        <textarea
                                            className="w-full border-0 border-b border-gray-300 
                                      focus:border-b-2 focus:border-primary 
                                      outline-none p-2 transition-all duration-200 ease-in-out
                                       transition-all duration-200 ease-in-out
                                    "
                                            rows={1}
                                            value={(answers[q._id] as string) || ""}
                                            onChange={(e) => onAnswerChange(q._id, e.target.value)}
                                            placeholder="Hãy nhập câu trả lời vào đây"
                                        />
                                    )}
                                </CardContent>

                            </Card>
                        ))}
                    </div>



                    {/* Navigation Buttons */}
                    <div className="flex justify-between ">
                        <Button variant="outline" onClick={onBack}>
                            Tôi bỏ cuộc
                        </Button>
                        <Button onClick={onNext}>Tôi đồng ý và tiếp tục</Button>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default Step2_AdoptionForm;
