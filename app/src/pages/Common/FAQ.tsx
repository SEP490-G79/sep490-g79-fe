import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ArrowRight, Link } from "lucide-react";

const items = [
  {
    question: "PawShelter làm nhiệm vụ gì trong quá trình nhận nuôi?",
    answer:
      "PawShelter đóng vai trò trung gian: kết nối hồ sơ của trung tâm cứu hộ với người nhận nuôi, hỗ trợ xét duyệt, lên lịch bàn giao và theo dõi hậu nhận nuôi.",
  },
  {
    question: "Tôi cần làm gì để nhận nuôi qua PawShelter?",
    answer:
      "Đăng ký tài khoản, điền form “Đơn nhận nuôi” trên PawShelter, chọn thú cưng từ danh sách trung tâm gửi lên, chờ xét duyệt và lên lịch nhận bàn giao.",
  },
  {
    question: "PawShelter có xét duyệt hồ sơ nhận nuôi không?",
    answer:
      "PawShelter kiểm tra tính hợp lệ của hồ sơ (đầy đủ giấy tờ, cam kết chăm sóc) rồi chuyển cho trung tâm cứu hộ để duyệt cuối cùng.",
  },
  {
    question: "Trung tâm cứu hộ chịu trách nhiệm gì trước khi bàn giao?",
    answer:
      "Trung tâm cứu hộ chịu trách nhiệm tiêm phòng, khám sức khỏe cơ bản và chuẩn bị thú cưng trong tình trạng tốt nhất trước khi giao cho người nhận.",
  },
  {
    question: "Nếu tôi không thể tiếp tục chăm sóc thú cưng, tôi phải làm sao?",
    answer:
      "Liên hệ PawShelter qua email hoặc hotline để gửi yêu cầu trả lại; chúng tôi sẽ điều phối trung tâm cứu hộ nhận lại và tái phân phối cho người nuôi mới.",
  },
  {
    question: "PawShelter có thu phí hay hoa hồng không?",
    answer:
      "Hoạt động của PawShelter hoàn toàn miễn phí với người nhận nuôi và trung tâm cứu hộ; chi phí duy trì nền tảng đến từ các khoản ủng hộ và tài trợ.",
  },
];

const FAQ = () => {
  return (
    <section>
      <div className="flex flex-wrap py-10 px-40">
        <Breadcrumb  className="basis-full mb-10">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="hover:text-(--primary) text-(--muted)" href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>FAQ</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className=" basis-full sm:basis-1/2 w-full mx-auto flex max-w-3xl flex-col text-start px-20">
          <h1 className="mb-3 md:mb-4 lg:mb-6 text-5xl font-bold ">
            Những câu hỏi thường gặp
          </h1>
          <p className="text-muted-foreground text-sm">
            Tìm câu trả lời cho các câu hỏi thường gặp về PawShelter. Nếu không
            tìm thấy thông tin bạn cần, hãy liên hệ với đội hỗ trợ của chúng
            tôi.
          </p>
        </div>
        <Accordion
          type="single"
          collapsible
          className=" basis-full sm:basis-1/2  mx-auto w-full lg:max-w-3xl"
        >
          {items.map((item, index) => (
            <AccordionItem key={index} value={index.toString()}>
              <AccordionTrigger className="transition-opacity duration-200 hover:no-underline hover:opacity-60">
                <div className="font-medium sm:py-1 lg:py-2">
                  {item.question}
                </div>
              </AccordionTrigger>
              <AccordionContent className="sm:mb-1 lg:mb-2">
                <div className="text-muted-foreground ">{item.answer}</div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export { FAQ };
