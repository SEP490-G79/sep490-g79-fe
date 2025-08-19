import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/magicui/marquee";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

type Review = {
  name: string;
  username: string;
  body: string;
  img: string;
};

const reviews = [
  {
    name: "Minh Anh",
    username: "@minhanh",
    body: "Mình đã nhận nuôi bé mèo tại PawShelter và trải nghiệm rất tuyệt vời. Giao diện dễ dùng, đội ngũ hỗ trợ nhanh chóng!",
    img: "https://avatar.vercel.sh/minhanh",
  },
  {
    name: "Quốc Bảo",
    username: "@quocbao",
    body: "PawShelter giúp mình tìm được một người bạn bốn chân đáng yêu. Cảm ơn nền tảng đã kết nối mình với bé cún nhỏ này!",
    img: "https://avatar.vercel.sh/quocbao",
  },
  {
    name: "Thanh Trúc",
    username: "@thanhtruc",
    body: "Rất ấn tượng với cách tổ chức và quy trình nhận nuôi minh bạch. Mình hoàn toàn yên tâm khi sử dụng dịch vụ của PawShelter.",
    img: "https://avatar.vercel.sh/thanhtruc",
  },
  {
    name: "Ngọc Hân",
    username: "@ngochan",
    body: "Mình yêu động vật và luôn muốn đóng góp cho cộng đồng. PawShelter cho mình cơ hội làm điều đó một cách dễ dàng.",
    img: "https://avatar.vercel.sh/ngochan",
  },
  {
    name: "Trung Kiên",
    username: "@trungkien",
    body: "Bé chó mình nhận nuôi giờ đã thành một phần của gia đình. Cảm ơn PawShelter vì đã tạo nên nền tảng ý nghĩa như thế này!",
    img: "https://avatar.vercel.sh/trungkien",
  },
  {
    name: "Bảo Ngọc",
    username: "@baongoc",
    body: "Từ đăng ký đến liên hệ nhận nuôi đều rất mượt mà. Mình đã giới thiệu PawShelter cho nhiều người bạn rồi!",
    img: "https://avatar.vercel.sh/baongoc",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);


const toCardItem = [
  {
    name: "Minh Anh",
    title: "@minhanh",
    quote: "Mình đã nhận nuôi bé mèo tại PawShelter và trải nghiệm rất tuyệt vời. Giao diện dễ dùng, đội ngũ hỗ trợ nhanh chóng!",

  },
  {
    name: "Quốc Bảo",
    title: "@quocbao",
    quote: "PawShelter giúp mình tìm được một người bạn bốn chân đáng yêu. Cảm ơn nền tảng đã kết nối mình với bé cún nhỏ này!",

  },
  {
    name: "Thanh Trúc",
    title: "@thanhtruc",
    quote: "Rất ấn tượng với cách tổ chức và quy trình nhận nuôi minh bạch. Mình hoàn toàn yên tâm khi sử dụng dịch vụ của PawShelter.",

  },
  {
    name: "Ngọc Hân",
    title: "@ngochan",
    quote: "Mình yêu động vật và luôn muốn đóng góp cho cộng đồng. PawShelter cho mình cơ hội làm điều đó một cách dễ dàng.",

  },
  {
    name: "Trung Kiên",
    title: "@trungkien",
    quote: "Bé chó mình nhận nuôi giờ đã thành một phần của gia đình. Cảm ơn PawShelter vì đã tạo nên nền tảng ý nghĩa như thế này!",

  },
  {
    name: "Bảo Ngọc",
    title: "@baongoc",
    quote: "Từ đăng ký đến liên hệ nhận nuôi đều rất mượt mà. Mình đã giới thiệu PawShelter cho nhiều người bạn rồi!",

  },
];

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function Testimonial() {
  return (
    <div className="w-full flex flex-wrap justify-center py-20">
      <h2 className="basis-full text-center text-3xl font-bold mb-5">
        Những câu chuyện yêu thương từ cộng đồng PawShelter
      </h2>
      <p className="basis-full text-center text-1xl text-muted-foreground mb-10 px-20">
        Người dùng chia sẻ hành trình nhận nuôi và lan tỏa yêu thương tới các bé
        thú cưng đang cần một mái ấm.
      </p>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        {/* <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]">
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee> */}
        <InfiniteMovingCards
        items={toCardItem}
        direction="right"
        speed="slow"
      />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
      </div>
    </div>
  );
}
