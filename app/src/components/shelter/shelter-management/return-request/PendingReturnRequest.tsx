import { DataTable } from '@/components/data-table'
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppContext from '@/context/AppContext';
import type { ReturnRequest } from '@/types/ReturnRequest';
import useAuthAxios from '@/utils/authAxios';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Loader2Icon, MoreHorizontal, NotebookText } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import ReturnRequestTable from './ReturnRequestTable';
import ReturnRequestDialog from './ReturnRequestDialog';

const PendingReturnRequests = () => {
      const [returnRequest, setReturnRequest] = useState<ReturnRequest[]>([]);
      const [filteredReturnRequest, setFilteredReturnRequest] = useState<ReturnRequest[]>([]);
      const {shelterAPI} = useContext(AppContext);
      const authAxios = useAuthAxios();
      const [loading, setLoading] = useState<boolean>(false);
      const [refresh, setRefresh] = useState<boolean>(false);
      const [isPreview, setIsPreview] = useState<boolean>(false);
      const [currentIndex, setCurrentIndex] = useState<number>(0);
      const [dialogDetail, setDialogDetail] = useState<ReturnRequest | null>(null);
      const {shelterId} = useParams();

      useEffect(() => {
        authAxios.get(`${shelterAPI}/${shelterId}/return-requests/get-by-shelter`)
        .then(({data}) => {
          const sortedData = data.filter((item : any) => item.status === "pending");
          setReturnRequest(sortedData);
          setFilteredReturnRequest(sortedData);
        }) 
        .catch((err) => console.log(err?.response.data.message))
      }, [refresh])
    

    const handleApproveReturnRequest = async (requestId : string) => {
      try {
        setLoading(true);
        await authAxios.put(`${shelterAPI}/${shelterId}/${requestId}/approve`)
        setDialogDetail(null);
        setRefresh(prev => !prev)
        toast.success("Xử lý yêu cầu thành công!")
      } catch (error: any) {
        toast.error(error?.response.data.message);
      } finally{
        setLoading(false)
      }
    };

    const handleRejectReturnRequest = async (requestId : string) => {
      try {
        setLoading(true);
        await authAxios.put(`${shelterAPI}/${shelterId}/${requestId}/reject`)
        setDialogDetail(null);
        setRefresh(prev => !prev)
        toast.success("Xử lý yêu cầu thành công!")
      } catch (error: any) {
        toast.error(error?.response.data.message);
      } finally{
        setLoading(false)
      }
    };


  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="col-span-12">
          <ReturnRequestTable
            filteredReturnRequest={filteredReturnRequest ?? []}
            setDialogDetail={setDialogDetail}
          />
        </div>
        <ReturnRequestDialog
        dialogDetail={dialogDetail}
        setDialogDetail={setDialogDetail}
        handleApprove={handleApproveReturnRequest}
        handleReject={handleRejectReturnRequest}
        loading={loading}
        setCurrentIndex={setCurrentIndex}
        />
      </div>
    </div>
  );
}

export default PendingReturnRequests;