import { Timeline } from "@/components/ui/timeline_custom";
import step1 from "@/assets/adoption-procedures/register.png";
import step2 from "@/assets/adoption-procedures/edit_profile.png";
import step3 from "@/assets/adoption-procedures/find_pet_for_adoption.png";
import step4 from "@/assets/adoption-procedures/answer_question.png";
import step5 from "@/assets/adoption-procedures/wait_for_response.png";
import step6 from "@/assets/adoption-procedures/select_schedule.png";
import step7 from "@/assets/adoption-procedures/confirm_consent_form.png";
import step8 from "@/assets/adoption-procedures/adoption_success.png";
import { PhotoProvider, PhotoView } from "react-photo-view";

type TimelineEntry = {
  title: string;
  content: React.ReactNode;
};

const AdoptionProcedures = () => {
  const data: TimelineEntry[] = [
    {
      title: "Bước 1: Tạo tài khoản",
      content: (
        <div className="flex gap-4">
          <PhotoView src={step1}>
            <img
              src={step1}
              alt="step1_img"
              className="flex-1 rounded-lg object-cover max-w-90"
            />
          </PhotoView>
          <p className="flex-1 text-left">
            Người dùng đăng ký tài khoản trên nền tảng PawShelter bằng email
            hoặc tài khoản Google. Sau khi xác thực email, người dùng có thể
            đăng nhập để sử dụng đầy đủ các chức năng.
          </p>
        </div>
      ),
    },
    {
      title: "Bước 2: Cập nhật hồ sơ",
      content: (
        <div className="flex gap-4">
          <PhotoView src={step2}>
            <img
              src={step2}
              alt="step2_img"
              className="flex-1 rounded-lg object-cover max-w-90"
            />
          </PhotoView>
          <p className="flex-1 text-left">
            Người dùng cần hoàn thiện hồ sơ cá nhân: họ tên, ngày sinh, số điện
            thoại, địa chỉ cư trú,... Đây là thông tin cần thiết để liên hệ và
            xét duyệt yêu cầu nhận nuôi.
          </p>
        </div>
      ),
    },
    {
      title: "Bước 3: Tìm kiếm thú cưng",
      content: (
        <div className="flex gap-4">
          <PhotoView src={step3}>
            <img
              src={step3}
              alt="step3_img"
              className="flex-1 rounded-lg object-cover max-w-90"
            />
          </PhotoView>
          <p className="flex-1 text-left">
            Người dùng duyệt danh sách thú cưng đang cần được nhận nuôi. Có thể
            lọc theo loài, giống, độ tuổi, màu lông, hoặc vị trí gần bạn.
          </p>
        </div>
      ),
    },
    {
      title: "Bước 4: Gửi yêu cầu nhận nuôi",
      content: (
        <div className="flex gap-4">
          <PhotoView src={step4}>
            <img
              src={step4}
              alt="step4_img"
              className="flex-1 rounded-lg object-cover max-w-90"
            />
          </PhotoView>
          <p className="flex-1 text-left">
            Với mỗi thú cưng, người dùng cần điền form đăng ký nhận nuôi, trả
            lời các câu hỏi đánh giá sự phù hợp và cam kết chăm sóc thú cưng
            đúng quy định.
          </p>
        </div>
      ),
    },
    {
      title: "Bước 5: Chờ xét duyệt",
      content: (
        <div className="flex gap-4">
          <PhotoView src={step5}>
            <img
              src={step5}
              alt="step5_img"
              className="flex-1 rounded-lg object-cover max-w-90"
            />
          </PhotoView>
          <p className="flex-1 text-left">
            Trạm cứu hộ sẽ xét duyệt yêu cầu dựa trên câu trả lời, mức độ phù
            hợp và tình trạng hiện tại của thú cưng. Có thể sẽ có thêm cuộc gọi
            hoặc phỏng vấn online nếu cần.
          </p>
        </div>
      ),
    },
    {
      title: "Bước 6: Chọn lịch phỏng vấn",
      content: (
        <div className="flex gap-4">
          <PhotoView src={step6}>
            <img
              src={step6}
              alt="step6_img"
              className="flex-1 rounded-lg object-cover max-w-90"
            />
          </PhotoView>
          <p className="flex-1 text-left">
            Nếu yêu cầu được duyệt, người dùng sẽ được chọn lịch hẹn để phỏng
            vấn với nhân viên trạm cứu hộ theo phương pháp và địa điểm được
            thống nhất.
          </p>
        </div>
      ),
    },
    {
      title: "Bước 7: Ký cam kết nhận nuôi",
      content: (
        <div className="flex gap-4">
          <PhotoView src={step7}>
            <img
              src={step7}
              alt="step7_img"
              className="flex-1 rounded-lg object-cover max-w-90"
            />
          </PhotoView>
          <p className="flex-1 text-left">
            Người dùng và trạm cứu hộ sẽ cùng ký vào đơn cam kết nhận nuôi, thể
            hiện sự đồng ý về các điều khoản chăm sóc, theo dõi sau khi nhận
            nuôi, và quyền lợi của hai bên.
          </p>
        </div>
      ),
    },
    {
      title: "Bước 8: Hoàn tất nhận nuôi",
      content: (
        <div className="flex gap-4">
          <PhotoView src={step8}>
            <img
              src={step8}
              alt="step8_img"
              className="flex-1 rounded-lg object-cover max-w-90"
            />
          </PhotoView>
          <p className="flex-1 text-left">
            Sau khi ký cam kết, thú cưng sẽ được bàn giao cho người nhận nuôi.
            Trạm cứu hộ có thể thực hiện kiểm tra định kỳ trong thời gian đầu để
            đảm bảo thú cưng được chăm sóc tốt.
          </p>
        </div>
      ),
    },
  ];

  return (
    <PhotoProvider>
      <div className="h-full w-full bg-background px-40 pt-10 pb-60">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center text-primary">
          {" "}
          Thủ tục nhận nuôi{" "}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground text-left">
          {" "}
          Quy trình nhận nuôi tại <strong>PawShelter</strong> được thiết kế cẩn
          trọng để đảm bảo mỗi thú cưng tìm được mái ấm phù hợp và yêu thương.
          Người nhận nuôi sẽ trải qua các bước từ tạo tài khoản, hoàn thiện hồ
          sơ, tìm kiếm thú cưng phù hợp, gửi đơn đăng ký, đến ký cam kết và
          chính thức đưa thú cưng về nhà. Trong suốt quá trình, đội ngũ trạm cứu
          hộ sẽ đồng hành, đánh giá và hỗ trợ nhằm đảm bảo lợi ích tốt nhất cho
          cả thú cưng và người nhận nuôi.
        </p>
        <div className="shadow-lg my-2">
          <Timeline data={data} />
        </div>
      </div>
    </PhotoProvider>
  );
};

export default AdoptionProcedures;
