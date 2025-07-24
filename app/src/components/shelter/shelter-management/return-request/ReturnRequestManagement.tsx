import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PendingReturnRequests from './PendingReturnRequest'
import AllReturnRequests from './AllReturnRequest'

const ReturnRequestManagement = () => {
  return (
      <div className="@container/main">
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending" className="cursor-pointer">
              Chờ xử lý
            </TabsTrigger>
            <TabsTrigger value="all" className="cursor-pointer">
              Lịch sử
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
              <PendingReturnRequests />
          </TabsContent>
          <TabsContent value="all">
              <AllReturnRequests />
          </TabsContent>
        </Tabs>
      </div>
  )
}

export default ReturnRequestManagement