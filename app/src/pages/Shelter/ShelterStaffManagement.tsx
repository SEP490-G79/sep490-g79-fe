import { useContext} from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShelterStaffsList from "../../components/shelter/shelter-management/staff-management/staff-list/ShelterStaffsList";
import ShelterStaffRequestManagement from "../../components/shelter/shelter-management/staff-management/staff-request-list/ShelterStaffRequestManagement";
import { useParams } from "react-router-dom";
import AppContext from "@/context/AppContext";

const ShelterStaffManagement = () => {
  const { shelters, user } = useContext(AppContext);
  const { shelterId } = useParams();
  const shelter = shelters?.find(
    (shelter) => String(shelter._id) === shelterId
  );
  const shelterRoles = shelter?.members.find(
    (member) => member._id === user?._id
  )?.roles;

  if (shelterRoles?.includes("manager")) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <Tabs defaultValue="staffs-list">
            <TabsList>
              <TabsTrigger value="staffs-list" className="cursor-pointer">
                Tất cả thành viên
              </TabsTrigger>
              <TabsTrigger
                value="staff-requests-list"
                className="cursor-pointer"
              >
                Các yêu cầu gia nhập và lời mời vào trạm cứu hộ
              </TabsTrigger>
            </TabsList>
            <TabsContent value="staffs-list">
              <ShelterStaffsList />
            </TabsContent>
            <TabsContent value="staff-requests-list">
              <ShelterStaffRequestManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  } else {
    return <ShelterStaffsList />;
  }
};

export default ShelterStaffManagement;
