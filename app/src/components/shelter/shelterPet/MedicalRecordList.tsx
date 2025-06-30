import React, { useEffect, useState } from "react";
import {
  getMedicalRecordsByPet,
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

interface MedicalRecord {
  _id: string;
  type: string;
  title: string;
  description?: string;
  cost?: number;
  procedureDate: string;
  performedBy?: { fullName: string; email: string };
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

  const fetchMedicalRecords = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await getMedicalRecords(petId, page, limit);
      setRecords(res.data.records || []);
      setTotal(res.data.total);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalRecords();
  }, [petId, page, limit]);

  const handleDelete = async (id: string) => {
    if (!accessToken) return;
    if (!window.confirm("Delete this record?")) return;
    await deleteMedicalRecord(petId, id, accessToken);
    fetchMedicalRecords();
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Hồ sơ y tế</h2>
        <Button
          onClick={() => {
            setEditRecord(null);
            setShowForm(true);
          }}
        >
          Thêm hồ sơ y tế
        </Button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-3">
          {records.map((rec) => (
            <li
              key={rec._id}
              className="border rounded p-4 flex justify-between items-start gap-4"
            >
              <div className="flex-1">
                <div className="font-bold text-lg mb-1">{rec.title}</div>
                <div className="text-sm text-gray-700 mb-1">
                  <b>Giá:</b> {rec.cost ? rec.cost + " VND" : "Không có"}
                </div>
                <div className="text-sm text-gray-700 mb-1">
                  <b>Phòng khám/Nơi thực hiện:</b> {String(rec.performedBy)}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  className="bg-blue-500 text-white"
                  onClick={() => setViewRecord(rec)}
                >
                  Xem chi tiết
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditRecord(rec);
                    setShowForm(true);
                  }}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(rec._id)}
                >
                  Xoá
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-end gap-2 mt-2">
        <Button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          size="sm"
          variant="outline"
        >
          Trước
        </Button>
        <span>
          Trang {page} / {Math.ceil(total / limit)}
        </span>
        <Button
          disabled={page >= Math.ceil(total / limit)}
          onClick={() => setPage(page + 1)}
          size="sm"
          variant="outline"
        >
          Sau
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
        <DialogContent className="sm:max-w-md w-full">
          <MedicalRecordForm
            petId={petId}
            record={editRecord}
            onClose={() => {
              setShowForm(false);
              setEditRecord(null);
              fetchMedicalRecords();
            }}
            accessToken={accessToken}
          />
        </DialogContent>
      </Dialog>

      {/* Modal for viewing record */}
      <Dialog open={!!viewRecord} onOpenChange={() => setViewRecord(null)}>
        <DialogContent className="sm:max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Medical Record Detail</DialogTitle>
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
                <strong>Chi phí:</strong> {viewRecord.cost || 0} VND
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
                      style={{ width: 80, borderRadius: 8 }}
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
    if (!form.description.trim()) newErrors.description = "Vui lòng nhập mô tả";
    if (form.cost === "" || isNaN(Number(form.cost)) || Number(form.cost) < 0)
      newErrors.cost = "Chi phí phải là số không âm";
    if (!form.procedureDate)
      newErrors.procedureDate = "Vui lòng chọn ngày thực hiện";
    else if (new Date(form.procedureDate) > new Date())
      newErrors.procedureDate = "Ngày thực hiện không được lớn hơn hôm nay";
    if (!form.performedBy.trim())
      newErrors.performedBy = "Vui lòng nhập nơi thực hiện";
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
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = await uploadToCloudinary(files[i]);
      urls.push(url);
    }
    setPhotos(urls);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {record ? "Chỉnh sửa hồ sơ y tế" : "Thêm hồ sơ y tế"}
        </DialogTitle>
      </DialogHeader>
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
      >
        <option value="">Chọn loại</option>
        <option value="vaccination">Tiêm phòng</option>
        <option value="surgery">Phẫu thuật</option>
        <option value="checkup">Khám bệnh</option>
        <option value="treatment">Điều trị</option>
        <option value="other">Khác</option>
      </select>
      {errors.type && <div className="text-red-500 text-xs">{errors.type}</div>}
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Tiêu đề"
        required
        className="w-full border rounded p-2"
      />
      {errors.title && (
        <div className="text-red-500 text-xs">{errors.title}</div>
      )}
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Mô tả"
        className="w-full border rounded p-2"
      />
      {errors.description && (
        <div className="text-red-500 text-xs">{errors.description}</div>
      )}
      <input
        name="cost"
        type="number"
        value={form.cost}
        onChange={handleChange}
        placeholder="Chi phí"
        className="w-full border rounded p-2"
      />
      {errors.cost && <div className="text-red-500 text-xs">{errors.cost}</div>}
      <input
        name="procedureDate"
        type="date"
        value={form.procedureDate}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
      />
      {errors.procedureDate && (
        <div className="text-red-500 text-xs">{errors.procedureDate}</div>
      )}
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
      >
        <option value="availabled">Hiệu lực</option>
        <option value="disabled">Vô hiệu hóa</option>
      </select>
      <input
        name="performedBy"
        value={form.performedBy}
        onChange={handleChange}
        placeholder="Phòng khám/Nơi thực hiện"
        required
        className="w-full border rounded p-2"
      />
      {errors.performedBy && (
        <div className="text-red-500 text-xs">{errors.performedBy}</div>
      )}
      <div>
        <label className="block mb-1 font-medium">
          Ảnh (có thể chọn nhiều)
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          onClick={() => document.getElementById("file-upload")?.click()}
          className="mb-2"
        >
          Chọn ảnh
        </Button>
        <div className="flex gap-2 mt-2 flex-wrap">
          {photos.map((url) => (
            <img
              key={url}
              src={url}
              alt="preview"
              style={{ width: 80, borderRadius: 8 }}
            />
          ))}
        </div>
      </div>
      <DialogFooter>
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
