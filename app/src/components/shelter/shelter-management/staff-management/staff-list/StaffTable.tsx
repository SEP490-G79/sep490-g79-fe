import { DataTableStaff } from "@/components/data-table-staff";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { ShelterMember } from "@/types/ShelterMember";
import type { User } from "@/types/User";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Ban, MoreHorizontal, UserRoundCog } from "lucide-react";
import type { UseFormReturn } from "node_modules/react-hook-form/dist/types";


type StaffTableProps = {
  user: User | null;
  isManager: boolean;
  handleKickMember: (userId: string) => void;
  changeRoleForm: UseFormReturn<
    {
      roles: string[];
      userId: string;
    },
    any,
    {
      roles: string[];
      userId: string;
    }
  >;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  filteredMembers: ShelterMember[];
};

const StaffTable = ({user, isManager, handleKickMember, changeRoleForm, setOpenDialog, filteredMembers} : StaffTableProps) => {
    const columns: ColumnDef<ShelterMember>[] = [
       {
         header: "STT",
         cell: ({ row }) => <p className="text-left px-2">{row.index + 1}</p>,
       },
       {
         accessorKey: "fullName",
         header: ({ column }) => {
           return (
             <Button
               variant="ghost"
               onClick={() =>
                 column.toggleSorting(column.getIsSorted() === "asc")
               }
               className="cursor-pointer"
             >
               Họ và tên
               <ArrowUpDown className="ml-2 h-4 w-4" />
             </Button>
           );
         },
         cell: ({ row }) => {
           return (
             <p className="px-2 flex flex-row gap-2">
               <img
                 src={row.original.avatar}
                 alt={row.original.fullName}
                 className="h-10 w-10 rounded-full object-cover"
               />
               <span className="my-auto">{row.original.fullName}</span>
             </p>
           );
         },
       },
       {
         accessorKey: "roles",
         header: ({ column }) => {
           return (
             <Button
               variant="ghost"
               onClick={() =>
                 column.toggleSorting(column.getIsSorted() === "asc")
               }
               className="cursor-pointer"
             >
               Vai trò
               <ArrowUpDown className="ml-2 h-4 w-4" />
             </Button>
           );
         },
         cell: ({ row }) => {
           return (
             <div className="flex gap-2">
               {row.original?.shelterRoles?.sort((a,b) => b.localeCompare(a)).map((role) => {
                 if (role === "manager") {
                   return <Badge variant="destructive">Quản lý</Badge>;
                 } else {
                   return <Badge variant="outline">Thành viên</Badge>;
                 }
               })}
             </div>
           );
         },
       },
       {
         id: "actions",
         cell: ({ row }) =>
           user?._id === row.original.id || !isManager ? (
             ""
           ) : (
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                   <MoreHorizontal className="w-4 h-4" />
                 </Button>
               </DropdownMenuTrigger>

               <DropdownMenuContent
                 align="center"
                 sideOffset={0}
                 className="w-40 rounded-md border bg-background shadow-lg p-1"
               >
                {row.original.shelterRoles.includes("manager") ? "" :
                <AlertDialog>
                   <AlertDialogTrigger asChild>
                     <DropdownMenuItem 
                     onSelect={(e) => e.preventDefault()}
                     className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded">
                       <Ban className="w-4 h-4" />
                       Kick thành viên
                     </DropdownMenuItem>
                   </AlertDialogTrigger>

                   <AlertDialogContent>
                     <AlertDialogHeader>
                       <AlertDialogTitle>
                         Xác nhận kick thành viên
                       </AlertDialogTitle>
                       <AlertDialogDescription className="flex gap-2">
                         Kick thành viên
                        <Avatar>
                          <AvatarImage src={row.original.avatar} alt={row.original.fullName + " avatar"} />
                        </Avatar>
                         <strong>{row.original.fullName}</strong> ra khỏi
                         trạm cứu hộ?
                       </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                       <AlertDialogCancel>Hủy</AlertDialogCancel>
                       <AlertDialogAction
                         onClick={() => handleKickMember(row.original.id)}
                       >
                         Xác nhận kick
                       </AlertDialogAction>
                     </AlertDialogFooter>
                   </AlertDialogContent>
                 </AlertDialog>
                }
                 

                 <DropdownMenuItem
                   onClick={() => {
                     changeRoleForm.reset({
                       userId: row.original.id,
                       roles: row.original.shelterRoles,
                     });
                     setOpenDialog(true);
                   }}
                   className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded"
                 >
                   <UserRoundCog /> Chỉnh vai trò
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
           ),
       },
     ];

  return (
    <DataTableStaff columns={columns} data={filteredMembers ?? []} />
  )
}

export default StaffTable