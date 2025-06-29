import React, { useEffect, useState } from "react";
import {
  getMedicalRecordsByPet,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
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

  const fetchRecords = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await getMedicalRecordsByPet(petId, accessToken);
      setRecords(res.data.records || []);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [petId]);

  const handleDelete = async (id: string) => {
    if (!accessToken) return;
    if (!window.confirm("Delete this record?")) return;
    await deleteMedicalRecord(id, accessToken);
    fetchRecords();
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Medical Records</h2>
        <Button
          onClick={() => {
            setEditRecord(null);
            setShowForm(true);
          }}
        >
          Add Record
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
                <div className="font-bold">{rec.title}</div>
                <div className="text-xs text-gray-500 mb-1">
                  {rec.type} |{" "}
                  {new Date(rec.procedureDate).toLocaleDateString()}
                </div>
                {rec.description && <div>{rec.description}</div>}
                <div className="text-xs text-gray-600">
                  By:{" "}
                  {rec.performedBy?.fullName || rec.performedBy?.email || "N/A"}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  className="bg-blue-500 text-white"
                  onClick={() => setViewRecord(rec)}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditRecord(rec);
                    setShowForm(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(rec._id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

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
              fetchRecords();
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
                <strong>Title:</strong> {viewRecord.title}
              </div>
              <div>
                <strong>Type:</strong> {viewRecord.type}
              </div>
              <div>
                <strong>Description:</strong> {viewRecord.description}
              </div>
              <div>
                <strong>Cost:</strong> {viewRecord.cost || 0} VND
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {new Date(viewRecord.procedureDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Status:</strong> {viewRecord.status}
              </div>
              <div>
                <strong>Performed By:</strong>{" "}
                {viewRecord.performedBy?.fullName ||
                  viewRecord.performedBy?.email ||
                  "N/A"}
              </div>
              <DialogFooter>
                <Button onClick={() => setViewRecord(null)}>Close</Button>
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
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<any>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    setLoading(true);
    try {
      if (record) {
        await updateMedicalRecord(record._id, form, accessToken);
      } else {
        await createMedicalRecord({ ...form, pet: petId }, accessToken);
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
        <DialogTitle>{record ? "Edit" : "Add"} Medical Record</DialogTitle>
      </DialogHeader>
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
      >
        <option value="">Select type</option>
        <option value="vaccination">Vaccination</option>
        <option value="surgery">Surgery</option>
        <option value="checkup">Checkup</option>
        <option value="treatment">Treatment</option>
        <option value="other">Other</option>
      </select>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        required
        className="w-full border rounded p-2"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full border rounded p-2"
      />
      <input
        name="cost"
        type="number"
        value={form.cost}
        onChange={handleChange}
        placeholder="Cost"
        className="w-full border rounded p-2"
      />
      <input
        name="procedureDate"
        type="date"
        value={form.procedureDate}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
      />
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
      >
        <option value="availabled">Available</option>
        <option value="disabled">Disabled</option>
      </select>
      <DialogFooter>
        <Button type="submit" disabled={loading}>
          {record ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </DialogFooter>
    </form>
  );
};
