import { Button } from "@/components/ui/button";
import React from "react";
import type { Question } from "@/types/Question";
import type { AdoptionForm } from "@/types/AdoptionForm";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Step2Props {
    questions: Question[];
    answers: Record<string, string | string[]>;
    onAnswerChange: (questionId: string, value: string | string[]) => void;
    onNext: () => void;
    onBack: () => void;
    form: AdoptionForm;
}

const Step2_AdoptionForm = ({ questions, answers, onAnswerChange, onNext, onBack, form }: Step2Props) => {
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
            <Card className="w-full max-w-4xl">
                <CardHeader className="flex justify-center">
                    <CardTitle className="text-xl font-semibold">  {form.title}</CardTitle>

                </CardHeader>
                <Separator />
                <CardContent>
                     <div className="space-y-8">
                    {questions.map((q) => (

                        <div key={q._id} className="space-y-2">
                            <p className="font-medium ">
                                {q.title}{" "}
                                {q.priority === "high" && <span className="text-red-500">*</span>}
                            </p>
                            {q.type === "SINGLECHOICE" && (
                                <p className="text-sm text-gray-500 italic">Chỉ chọn 1 đáp án</p>
                            )}
                            {q.type === "MULTIPLECHOICE" && (
                                <p className="text-sm text-gray-500 italic">Bạn có thể chọn nhiều đáp án</p>
                            )}

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
                        </div>
                    ))}
                    </div>
                </CardContent>
                <Separator />
                <CardFooter>
                    {/* Navigation Buttons */}
                    <div className="flex justify-between ">
                        <Button variant="outline" onClick={onBack}>
                            Tôi bỏ cuộc
                        </Button>
                        <Button onClick={onNext}>Tôi đồng ý và tiếp tục</Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Step2_AdoptionForm;
