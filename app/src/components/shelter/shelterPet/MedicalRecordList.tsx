import React, { useEffect, useState } from "react";
import {
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  getMedicalRecords,
} from "@/apis/medicalRecord.api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAppContext } from "@/context/AppContext";
import { uploadToCloudinary } from "@/utils/cloudinaryUpload";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { createPortal } from "react-dom";

interface MedicalRecord {
  _id: string;
  type: string;
  title: string;
  description?: string;
  cost?: number;
  procedureDate: string;
  performedBy?: { fullName: string; email: string } | string;
  status: string;
  dueDate?: string;
  photos?: string[];
}

interface Props {
  petId: string;
}

const MedicalRecordList: React.FC<Props> = ({ petId }) => {
  const { accessToken } = useAppContext();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editRecord, setEditRecord] = useState<MedicalRecord | null>(null);
  const [viewRecord, setViewRecord] = useState<MedicalRecord | null>(null);
  const [page, setPage] = useState(1);
  const limit = 2;
  const [total, setTotal] = useState(0);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const fetchMedicalRecords = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await getMedicalRecords(petId, page, limit);
      setRecords(res.data.records || []);
      setTotal(res.data.total);
    } catch {
      toast.error("Không thể tải hồ sơ y tế");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalRecords();
  }, [petId, page]);

  const handleDelete = async (id: string) => {
    if (!accessToken) return;
    if (!window.confirm("Bạn có chắc muốn xoá hồ sơ này?")) return;
    try {
      await deleteMedicalRecord(petId, id, accessToken);
      toast.success("Đã xoá hồ sơ");
      fetchMedicalRecords();
    } catch {
      toast.error("Xoá thất bại");
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">📋 Hồ sơ y tế</h2>
        <Button
          onClick={() => {
            setEditRecord(null);
            setShowForm(true);
          }}
        >
          ➕ Thêm hồ sơ y tế
        </Button>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : records.length === 0 ? (
        <p className="text-muted-foreground italic">Chưa có hồ sơ nào.</p>
      ) : (
        <ul className="space-y-3">
          {records.map((rec) => (
            <li
              key={rec._id}
              className="border rounded-md p-4 flex justify-between items-start shadow-sm bg-background"
            >
              <div className="flex gap-4 flex-1 items-center">
                {/* Thumbnail nếu có ảnh */}
                {rec.photos && rec.photos.length > 0 && (
                  <img
                    src={rec.photos[0]}
                    alt="record thumbnail"
                    className="w-14 h-14 object-cover rounded-md ring-2 ring-primary"
                  />
                )}

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-primary mb-1">
                    {rec.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    <b>Chi phí:</b>{" "}
                    {rec.cost
                      ? rec.cost.toLocaleString("vi-VN") + " VND"
                      : "Không có"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <b>Nơi thực hiện:</b>{" "}
                    {typeof rec.performedBy === "string"
                      ? rec.performedBy
                      : rec.performedBy?.fullName || "Không rõ"}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setViewRecord(rec)}>
                    👁 Xem chi tiết
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setEditRecord(rec);
                      setShowForm(true);
                    }}
                  >
                    ✏️ Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(rec._id)}>
                    ❌ Xoá
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-end items-center gap-3 mt-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          ← Trước
        </Button>
        <span className="text-sm text-gray-700">
          Trang {page} / {Math.ceil(total / limit)}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage(page + 1)}
          disabled={page >= Math.ceil(total / limit)}
        >
          Sau →
        </Button>
      </div>

      {/* Modal for form */}
      <Dialog
        open={showForm}
        onOpenChange={(val) => {
          setShowForm(val);
          if (!val) setEditRecord(null);
        }}
      >
        <DialogContent className="sm:max-w-md w-full max-h-[90vh] overflow-y-auto bg-background text-foreground">
          <MedicalRecordForm
            petId={petId}
            record={editRecord}
            onClose={() => {
              setShowForm(false);
              setEditRecord(null);
              setPage(1);
              fetchMedicalRecords();
            }}
            accessToken={accessToken}
          />
        </DialogContent>
      </Dialog>

      {/* Modal for viewing record */}
      <Dialog open={!!viewRecord} onOpenChange={() => setViewRecord(null)}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Hồ sơ y tế chi tiết</DialogTitle>
          </DialogHeader>
          {viewRecord && (
            <div className="space-y-2 text-sm">
              <div>
                <strong>Tiêu đề:</strong> {viewRecord.title}
              </div>
              <div>
                <strong>Loại:</strong>{" "}
                {(() => {
                  switch (viewRecord.type) {
                    case "vaccination":
                      return "Tiêm phòng";
                    case "surgery":
                      return "Phẫu thuật";
                    case "checkup":
                      return "Khám bệnh";
                    case "treatment":
                      return "Điều trị";
                    case "other":
                      return "Khác";
                    default:
                      return viewRecord.type;
                  }
                })()}
              </div>
              <div>
                <strong>Mô tả:</strong> {viewRecord.description}
              </div>
              <div>
                <strong>Chi phí:</strong>{" "}
                {(viewRecord.cost || 0).toLocaleString("vi-VN")} VND
              </div>
              <div>
                <strong>Ngày thực hiện:</strong>{" "}
                {new Date(viewRecord.procedureDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Trạng thái:</strong>{" "}
                {viewRecord.status === "availabled"
                  ? "Hiệu lực"
                  : "Hết hiệu lực"}
              </div>
              <div>
                <strong>Phòng khám/Nơi thực hiện:</strong>{" "}
                {String(viewRecord.performedBy)}
              </div>
              {viewRecord.photos && viewRecord.photos.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {viewRecord.photos.map((url) => (
                    <img
                      key={url}
                      src={url}
                      alt="record"
                      style={{ width: 80, borderRadius: 8, cursor: "pointer" }}
                      onClick={() => setPreviewImg(url)}
                    />
                  ))}
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => setViewRecord(null)}>Đóng</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {previewImg &&
        createPortal(
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[99999]"
            onClick={() => setPreviewImg(null)}
          >
            <img
              src={previewImg}
              alt="preview"
              className="max-w-[90vw] max-h-[90vh] rounded shadow-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body
        )}
    </div>
  );
};

export default MedicalRecordList;

// --------------------- FORM COMPONENT ---------------------
const MedicalRecordForm: React.FC<{
  petId: string;
  record: MedicalRecord | null;
  onClose: () => void;
  accessToken: string | null;
}> = ({ petId, record, onClose, accessToken }) => {
  const [form, setForm] = useState({
    type: record?.type || "",
    title: record?.title || "",
    description: record?.description || "",
    cost: record?.cost || "",
    procedureDate: record?.procedureDate?.slice(0, 10) || "",
    status: record?.status || "availabled",
    performedBy: record?.performedBy || "",
  });
  const [photos, setPhotos] = useState<string[]>(record?.photos || []);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.type) newErrors.type = "Vui lòng chọn loại hồ sơ";
    if (!form.title.trim()) newErrors.title = "Vui lòng nhập tiêu đề";
    if (
      form.cost &&
      isNaN(Number(form.cost)) ||
      Number(form.cost) > 0
    )
      newErrors.cost = "Chi phí phải lớn hơn 0 VND";
    if (!form.procedureDate)
      newErrors.procedureDate = "Vui lòng chọn ngày thực hiện";
    else if (new Date(form.procedureDate) > new Date())
      newErrors.procedureDate = "Ngày thực hiện không được lớn hơn hôm nay";
    if (
      typeof form.performedBy !== "string" ||
      form.performedBy.trim() === ""
    ) {
      newErrors.performedBy = "Vui lòng nhập nơi thực hiện";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (photos.length >= 4) {
      toast.warning("Chỉ được chọn tối đa 4 ảnh");
      return;
    }

    const filesToUpload = Array.from(files).slice(0, 4 - photos.length); // Giới hạn số ảnh upload

    const urls: string[] = [];
    for (let i = 0; i < filesToUpload.length; i++) {
      const url = await uploadToCloudinary(filesToUpload[i]);
      urls.push(url);
    }

    setPhotos((prev) => [...prev, ...urls]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    if (!validate()) return;
    setLoading(true);
    try {
      if (record) {
        await updateMedicalRecord(
          petId,
          record._id,
          { ...form, photos },
          accessToken
        );
      } else {
        await createMedicalRecord(
          petId,
          { ...form, pet: petId, photos },
          accessToken
        );
      }
      onClose();
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">
          {record ? "Chỉnh sửa hồ sơ y tế" : "Thêm hồ sơ y tế"}
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Type */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Loại hồ sơ <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border rounded px-3 py-2 text-sm bg-background text-foreground"
            required
          >
            <option value="">Chọn loại</option>
            <option value="vaccination">Tiêm phòng</option>
            <option value="surgery">Phẫu thuật</option>
            <option value="checkup">Khám bệnh</option>
            <option value="treatment">Điều trị</option>
            <option value="other">Khác</option>
          </select>

          {errors.type && (
            <span className="text-red-500 text-xs">{errors.type}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Tiêu đề"
            className="border rounded px-3 py-2 text-sm"
            required
          />
          {errors.title && (
            <span className="text-red-500 text-xs">{errors.title}</span>
          )}
        </div>

        {/* Cost */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Chi phí (VND)</label>
          <input
            name="cost"
            type="number"
            value={form.cost}
            onChange={handleChange}
            placeholder="Ví dụ: 200000"
            className="border rounded px-3 py-2 text-sm"
          />
          {errors.cost && (
            <span className="text-red-500 text-xs">{errors.cost}</span>
          )}
        </div>

        {/* Procedure Date */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Ngày thực hiện <span className="text-red-500">*</span>
          </label>
          <input
            name="procedureDate"
            type="date"
            value={form.procedureDate}
            onChange={handleChange}
            className="border rounded px-3 py-2 text-sm"
            required
          />
          {errors.procedureDate && (
            <span className="text-red-500 text-xs">{errors.procedureDate}</span>
          )}
        </div>

        {/* Status (only when edit) */}
        {record && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Trạng thái *</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-sm"
              required
            >
              <option value="availabled">Hiệu lực</option>
              <option value="disabled">Vô hiệu hóa</option>
            </select>
          </div>
        )}

        {/* PerformedBy */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Phòng khám/Nơi thực hiện <span className="text-red-500">*</span>
          </label>
          <input
            name="performedBy"
            value={
              typeof form.performedBy === "string"
                ? form.performedBy
                : form.performedBy?.fullName || ""
            }
            onChange={handleChange}
            placeholder="Nhập tên phòng khám hoặc nơi thực hiện"
            className="border rounded px-3 py-2 text-sm"
            required
          />
          {errors.performedBy && (
            <span className="text-red-500 text-xs">{errors.performedBy}</span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">
          Mô tả <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Nhập mô tả chi tiết..."
          className="border rounded px-3 py-2 text-sm min-h-[80px]"
        />
      </div>

      {/* Image Upload */}
      {/* Image Upload */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          Ảnh minh hoạ (tối đa 4 ảnh)
        </label>
        <p className="text-xs text-muted-foreground">
          {photos.length}/4 ảnh đã chọn
        </p>
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {photos.length < 4 && (
          <Button
            type="button"
            onClick={() => document.getElementById("file-upload")?.click()}
            className="w-fit"
            variant="outline"
          >
            Chọn ảnh
          </Button>
        )}
        <div className="flex gap-2 flex-wrap mt-2">
          {photos.map((url) => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt="Ảnh minh hoạ"
                className="w-20 h-20 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() =>
                  setPhotos((prev) => prev.filter((photo) => photo !== url))
                }
                className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                title="Xoá ảnh"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit/Cancel */}
      <DialogFooter className="pt-4 gap-2">
        <Button type="submit" disabled={loading}>
          {record ? "Cập nhật" : "Tạo"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Hủy
        </Button>
      </DialogFooter>
    </form>
  );
};
