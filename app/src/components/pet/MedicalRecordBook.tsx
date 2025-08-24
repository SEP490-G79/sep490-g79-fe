import { useState } from "react"
import { PhotoProvider, PhotoView } from "react-photo-view"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { MedicalRecord } from "@/types/MedicalRecord"

interface SpiralNotebookMedicalRecordProps {
    records: MedicalRecord[]
}

export default function SpiralNotebookMedicalRecord({ records }: SpiralNotebookMedicalRecordProps) {
    const [pageIndex, setPageIndex] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const record = records[pageIndex]
    const [isGalleryOpen, setIsGalleryOpen] = useState(false)

    const handleDialogOpenChange = (open: boolean) => {
        if (!open && isGalleryOpen) {
            return // Don't close dialog if gallery is open
        }
        setIsOpen(open)
    }

    const typeLabels: Record<string, string> = {
        vaccination: "Tiêm phòng",
        surgery: "Phẫu thuật",
        checkup: "Khám sức khỏe",
        treatment: "Điều trị",
        other: "Khác",
    };

    const statusLabels: Record<string, string> = {
        availabled: "Hoàn thành",
    };


    if (!records || !Array.isArray(records) || records.length === 0) {
        return <p className="text-muted-foreground italic">Không có hồ sơ bệnh án</p>;
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>

            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                    <BookOpen className="w-4 h-4" /> Xem sổ bệnh án
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl p-0 bg-transparent border-none [&>button]:hidden"
                onPointerDownOutside={(e) => {
                    if (isGalleryOpen) {
                        e.preventDefault(); // Vẫn chặn khi gallery đang mở
                    }
                }}
                onEscapeKeyDown={(e) => {
                    if (isGalleryOpen) {
                        e.preventDefault();
                    }
                }}
            >

                <div className="flex items-center justify-center min-h-[90vh] p-4">
                    <div className="relative">
                        {/* Shadow */}
                        <div className="absolute inset-0 bg-gray-400 rounded-r-lg transform translate-x-2 translate-y-2 blur-sm opacity-40" />

                        {/* Notebook */}
                        <div className="relative w-[600px] h-[650px] bg-white rounded-r-lg overflow-visible shadow-2xl">
                            {/* Spiral Binding */}
                            <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-gray-100 to-gray-50 border-r border-gray-200 overflow-hidden flex flex-col justify-between py-4">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 border-gray-300 rounded-full shadow-inner" />
                                        <div
                                            className="absolute left-1/2 -translate-x-1/2 w-8 h-4 border-2 border-gray-400 rounded-full"
                                            style={{
                                                background:
                                                    "linear-gradient(45deg, #9ca3af 25%, transparent 25%, transparent 75%, #9ca3af 75%)",
                                                backgroundSize: "4px 4px",
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>


                            {/* Content Page */}
                            <div className="ml-6 h-full relative">
                                <div
                                    className="h-full p-8 overflow-y-auto"
                                    style={{
                                        backgroundImage: `
                      linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                      repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, #e5e7eb 31px, #e5e7eb 32px)
                    `,
                                        backgroundSize: "100% 100%, 100% 32px",
                                        backgroundPosition: "60px 0, 0 40px",
                                    }}
                                >
                                    <div className="absolute left-16 top-0 bottom-0 w-px bg-red-300" />


                                    <div className="relative z-10 space-y-6 pt-8 pl-10">
                                        {/* Thông tin cơ bản */}
                                        <div className="space-y-4 text-sm">
  {/* Tiêu đề riêng 1 hàng */}
  <InfoRow 
    label="📌 Tiêu đề" 
    value={record.title} 
    color="text-blue-600" 
  />

  {/* Các field khác: 2 cột */}
  <div className="grid grid-cols-2 gap-4">
    <InfoRow 
      label="📅 Ngày thực hiện" 
      value={new Date(record.procedureDate).toLocaleDateString("vi-VN")} 
      color="text-blue-600" 
    />
    <InfoRow 
      label="💰 Chi phí" 
      value={`${record.cost.toLocaleString()}đ`} 
      color="text-green-600 font-bold" 
    />
    <InfoRow
      label="📂 Loại hồ sơ"
      value={typeLabels[record.type] || record.type || "Chưa xác định"}
      color="text-purple-600"
    />
    <InfoRow
      label="⚠️ Trạng thái"
      value={statusLabels[record.status] || record.status || "Chưa xác định"}
      color="text-blue-600"
    />
  </div>
</div>


                                        {/* Mô tả */}
                                        <Section title="📝 Mô tả chi tiết:">
                                            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-300">
                                                <p className="text-sm leading-relaxed text-gray-800">{record.description}</p>
                                            </div>
                                        </Section>

                                        {/* Hình ảnh */}
                                        <Section title="📷 Hình ảnh minh họa:">
                                            {record.photos?.length ? (
                                                <PhotoProvider
                                                    onVisibleChange={(visible) => {
                                                        setIsGalleryOpen(visible);

                                                        // Khi gallery đóng, cho phép click ra ngoài
                                                        if (!visible) {
                                                            setTimeout(() => {
                                                                setIsGalleryOpen(false);
                                                            }, 200); // delay nhỏ để tránh race condition
                                                        }
                                                    }}
                                                >
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {record.photos.map((url, idx) => (
                                                            <PhotoView key={idx} src={url}>
                                                                <div className="relative cursor-pointer group">
                                                                    <div className="bg-white p-2 shadow-lg transform rotate-1 group-hover:rotate-0 transition-transform duration-200">
                                                                        <img src={url || "/placeholder.svg"} alt={`Ảnh ${idx + 1}`} className="w-full h-32 object-cover" />
                                                                        <div className="text-center mt-2 text-xs text-gray-600 font-handwriting">Ảnh {idx + 1}</div>
                                                                    </div>
                                                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-200 opacity-80 transform rotate-45" />
                                                                </div>
                                                            </PhotoView>
                                                        ))}
                                                    </div>
                                                </PhotoProvider>
                                            ) : (
                                                <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                                                    <div className="text-center text-gray-500">
                                                        <div className="text-2xl mb-2">📷</div>
                                                        <p className="text-sm">Chưa có ảnh minh họa</p>
                                                    </div>
                                                </div>
                                            )}
                                        </Section>
                                    </div>
                                </div>
                            </div>

                            {/* Điều hướng trang */}
                            <div className="absolute -right-10 top-20 z-20 flex flex-col gap-3">
                                {records.map((_, i) => {
                                    const isActive = i === pageIndex
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setPageIndex(i)}
                                            className={cn(
                                                "w-17 h-10 rounded-r-md shadow-md border border-black/10 relative overflow-hidden transition-all",
                                                isActive
                                                    ? "scale-110   z-10"
                                                    : "opacity-70 hover:opacity-100 hover:translate-x-0",
                                                i % 2 === 0 ? "bg-green-400" : "bg-purple-400"
                                            )}
                                            style={{
                                                // Khi không active, cắt bỏ phần bên trái để tạo hiệu ứng trong suốt
                                                clipPath: !isActive ? 'polygon(41% 0%, 100% 0%, 100% 100%, 41% 100%)' : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
                                            }}
                                            title={`Trang ${i + 1}`}
                                        >
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="absolute bottom-4 right-4 text-sm text-gray-400">Trang {pageIndex + 1}</div>
                        </div>

                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}

/* Subcomponents */
function InfoRow({ label, value, color }: { label: string, value: string, color?: string }) {
    return (
        <div>
            <span className="font-semibold text-gray-700">{label}:</span>
            <div className={cn("ml-6", color)}>{value}</div>
        </div>
    )
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <h3 className="font-semibold text-gray-700 border-b border-gray-300 pb-1">{title}</h3>
            {children}
        </div>
    )
}
