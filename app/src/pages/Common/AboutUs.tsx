import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Eye, HeartHandshake, Play, Shield, Sprout } from "lucide-react"
import background from "../../assets/about-us/rescue-dog-enjoying-being-pet-by-woman-shelter.jpg"
import teamwork1 from "../../assets/about-us/team-work-1.jpg"
import pet1 from "../../assets/about-us/3729519.jpg"

const team = [
  {
    name: "Nguyễn Minh Trí",
    title: "HE176657",
    avatar: "/avatars/minh.png",
  },
  {
    name: "Trần Hữu Hảo",
    title: "HE176192",
    avatar: "/avatars/linh.png",
  },
  {
    name: "Lê Quý Hoàn",
    title: "HE172020",
    avatar: "/avatars/anh.png",
  },
  {
    name: "Nguyễn Viết Hưng",
    title: "HE173464",
    avatar: "/avatars/ha.png",
  },
  {
    name: "Dương Quang Tuấn",
    title: "HE176834",
    avatar: "/avatars/ha.png",
  },
]

const AboutUs = () => {
  return (
    <div className="w-full">
      {/* Header Section */}
      <section className="relative w-full h-[30vh] bg-cover bg-center flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        <h1 className="text-4xl text-white font-bold z-10 relative">
          Về chúng tôi
        </h1>
        <img
          className="absolute inset-0 brightness-70 bg-cover bg-center w-full h-[40vh] object-cover object-[25%_20%]"
          src={background}
        />
      </section>

      {/* Introduction */}
      <section className="py-20 px-4 md:px-20 text-center">
        {/* <span className="text-xs font-semibold text-orange-500 uppercase tracking-wide">
          Về chúng tôi
        </span> */}
        <h2 className="text-3xl md:text-4xl font-bold mt-4 text-primary">
          Nền tảng hỗ trợ nhận nuôi thú cưng PawShelter
        </h2>
        <p className="mt-4 text-muted-foreground max-w-6xl mx-auto text-left">
          PawShelter là nền tảng công nghệ tiên phong tại Việt Nam trong việc
          kết nối cộng đồng yêu động vật với các trạm cứu hộ và thú cưng bị bỏ
          rơi. Chúng tôi xây dựng một hệ sinh thái hỗ trợ toàn diện, nơi mọi
          người có thể{" "}
          <strong>tìm kiếm, nhận nuôi, quyên góp, chia sẻ thông tin</strong> và
          cùng chung tay tạo ra những mái ấm mới cho các bạn thú cưng.
          <br />
          <br />
          Mỗi năm, hàng ngàn thú cưng bị bỏ rơi không có nơi nương tựa. Chúng
          tôi tin rằng với sự trợ giúp của cộng đồng, mỗi sinh mệnh nhỏ bé đều
          xứng đáng được chăm sóc, bảo vệ và yêu thương. PawShelter không chỉ là
          cầu nối, mà còn là người bạn đồng hành của các trạm cứu hộ trong hành
          trình đầy nhân văn này.
          <br />
          <br />
          Nền tảng của chúng tôi cung cấp:
          <br />
          <strong>Thông tin minh bạch</strong> về các thú cưng đang chờ được
          nhận nuôi, bao gồm hình ảnh, tình trạng sức khỏe và hồ sơ y tế.
          <br />
          <strong>Kết nối trực tiếp</strong> với các trạm cứu hộ uy tín trên
          toàn quốc.
          <br />
          <strong>Chia sẻ và tương tác</strong> thông qua mạng xã hội nội bộ
          dành riêng cho cộng đồng yêu thú cưng.
          <br />
          <strong>Báo cáo vi phạm</strong> và theo dõi hành trình chăm sóc thú
          cưng sau khi được nhận nuôi.
          <br />
          <br />
          Với đội ngũ sáng lập là những người yêu động vật, am hiểu công nghệ và
          đầy tâm huyết, PawShelter không ngừng nỗ lực cải tiến sản phẩm để lan
          tỏa lòng nhân ái, nâng cao nhận thức cộng đồng và kiến tạo một xã hội
          nhân văn hơn - nơi thú cưng được đối xử như thành viên thực thụ trong
          mỗi gia đình.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle>An toàn và minh bạch</CardTitle>
            </CardHeader>
            <CardContent>
              <Shield className="h-14 w-14 mx-auto my-2 text-primary" />
              <p className="text-sm text-muted-foreground">
                Hợp tác với các trạm cứu hộ được xác minh, mọi quy trình nhận
                nuôi đều minh bạch và rõ ràng.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Hệ sinh thái hỗ trợ toàn diện</CardTitle>
            </CardHeader>
            <CardContent>
              <Sprout className="h-14 w-14 mx-auto my-2 text-green-500" />
              <p className="text-sm text-muted-foreground">
                Từ nhận nuôi, quyên góp, báo cáo vi phạm đến chia sẻ bài viết -
                tất cả trong một nền tảng.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Đội ngũ tận tâm</CardTitle>
            </CardHeader>
            <CardContent>
              <HeartHandshake className="h-14 w-14 mx-auto my-2 text-red-300" />
              <p className="text-sm text-muted-foreground">
                Chúng tôi là những người yêu động vật và làm việc vì sự an toàn,
                hạnh phúc của thú cưng.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Image Section */}
      <section className="flex flex-col md:flex-row gap-6 px-4 md:px-20 pb-20 justify-around">
        <img
          src={teamwork1}
          alt="Team working"
          className="rounded-xl w-full md:w-1/2 object-cover max-w-[42vw]"
        />
        <img
          src={pet1}
          alt="pet preview"
          className="rounded-xl object-cover w-full h-full max-w-[42vw]"
        />
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 md:px-20 text-center bg-muted">
        <span className="text-xs font-semibold text-orange-500 uppercase tracking-wide">
          Đội ngũ sáng lập
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-10">
          Các thành viên
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {team.map((member) => (
            <Card key={member.name} className="text-center">
              <CardHeader className="flex flex-col items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <CardTitle>{member.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{member.title}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AboutUs
