
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import EditProfile from "../../../components/user/user-setting/EditProfile";
import ChangePassword from "../../../components/user/user-setting/ChangePassword";
import DonationHistory from "@/components/user/user-setting/DonationHistory";

export default function ProfileSettings() {

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-1 text-primary">Chỉnh sửa profile của bạn</h1>
      <p className="text-muted-foreground mb-6">
        Chỉnh sửa thông tin cá nhân của bạn
      </p>

      <div className="flex gap-8">
        <Tabs defaultValue="profile" className="flex w-full gap-8">
          <TabsList className="flex flex-col w-64 gap-1 items-start border shadow-sm p-2 rounded-md">
            <TabsTrigger
              value="profile"
              className="w-full justify-start px-4 py-2 text-left rounded transition-colors cursor-pointer
               hover:bg-accent hover:text-blue-600
               data-[state=active]:bg-zinc-500 data-[state=active]:text-white"
            >
              Chỉnh sửa thông tin cá nhân
            </TabsTrigger>

            <TabsTrigger
              value="change-password"
              className="w-full justify-start px-4 py-2 text-left rounded transition-colors cursor-pointer
               hover:bg-accent hover:text-blue-600
               data-[state=active]:bg-zinc-500 data-[state=active]:text-white"
            >
              Đổi mật khẩu
            </TabsTrigger>

            <TabsTrigger
              value="donate-history"
              className="w-full justify-start px-4 py-2 text-left rounded transition-colors cursor-pointer
               hover:bg-accent hover:text-blue-600
               data-[state=active]:bg-zinc-500 data-[state=active]:text-white"
            >
              Lịch sử giao dịch
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="flex-1">
            <EditProfile />
          </TabsContent>

          <TabsContent value="change-password" className="flex-1">
            <ChangePassword />
          </TabsContent>

          <TabsContent value="donate-history" className="flex-1">
            <DonationHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}