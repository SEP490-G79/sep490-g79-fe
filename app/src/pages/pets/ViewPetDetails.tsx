import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import MedicalRecordList from "@/components/pet/MedicalRecordList";

interface Pet {
  _id: string;
  name: string;
  isMale: boolean;
  age: number;
  weight: number;
  identificationFeature?: string;
  sterilizationStatus?: boolean;
  species?: { name: string };
  breeds?: { name: string }[];
  color?: string;
  bio?: string;
  intakeTime?: string;
  foundLocation?: string;
  tokenMoney?: number;
  shelter?: { name: string };
  status: string;
  photos: string[];
}

const ViewPetDetails: React.FC = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState<Pet | null>(null);
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axios.get(`http://localhost:9999/pets/${petId}`);
        console.log("Fetched pet data:", res.data);

        setPet(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPet();
  }, [petId]);

  if (!pet) return <p className="text-center mt-10">Loading pet details...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-primary">
        {pet.name}
      </h1>
      <div className="mb-6">
        <Link to="../profilePetList">
          <Button className="bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-sm cursor-pointer">
            ← Back To Pet Profile
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <img
          src={pet.photos?.[0] || "/placeholder.png"}
          alt={pet.name}
          className="w-full md:w-80 h-80 object-cover rounded-xl shadow-md border"
        />

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 text-sm md:text-base text-gray-800">
          <p>
            <strong>Status:</strong> {pet.status}
          </p>
          <p>
            <strong>Gender:</strong> {pet.isMale ? "Male" : "Female"}
          </p>
          <p>
            <strong>Age:</strong> {pet.age} months
          </p>
          <p>
            <strong>Weight:</strong> {pet.weight} kg
          </p>
          <p>
            <strong>Color:</strong> {pet.color}
          </p>
          <p>
            <strong>Breed(s):</strong>{" "}
            {pet.breeds?.map((b) => b.name).join(", ") || "Unknown"}
          </p>
          <p>
            <strong>Species:</strong> {pet.species?.name || "Unknown"}
          </p>
          <p>
            <strong>Sterilized:</strong>{" "}
            {pet.sterilizationStatus ? "Yes" : "No"}
          </p>
          <p>
            <strong>ID Feature:</strong> {pet.identificationFeature || "None"}
          </p>
          <p>
            <strong>Intake Time:</strong>{" "}
            {new Date(pet.intakeTime!).toLocaleDateString()}
          </p>
          <p>
            <strong>Found Location:</strong> {pet.foundLocation}
          </p>
          <p>
            <strong>Shelter:</strong> {pet.shelter?.name || "Unknown"}
          </p>
          <p>
            <strong>Token Money:</strong> {pet.tokenMoney?.toLocaleString()} VND
          </p>
          <div className="col-span-full mt-4">
            <p>
              <span className="font-semibold text-gray-600">Bio:</span>{" "}
              {pet.bio || "No description available"}
            </p>
          </div>
        </div>
      </div>
      {/* Medical Records Section */}
      {pet._id && <MedicalRecordList petId={pet._id} />}
    </div>
  );
};

export default ViewPetDetails;
