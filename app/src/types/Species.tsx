// mockSpeciesList.tsx
export interface Species {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export const mockSpeciesList: Species[] = [
  {
    id: "60df6b2f5311236168a109ca",
    name: "Chó",
    description: "Domestic dog (Canis lupus familiaris)",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    id: "60df6b2f5311236168a109ce",
    name: "Mèo",
    description: "Domestic cat (Felis catus)",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    id: "60df6b2f5311236168a109d2",
    name: "Thỏ",
    description: "Domestic rabbit (Oryctolagus cuniculus)",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    id: "60df6b2f5311236168a109d6",
    name: "Chuột",
    description: "Small mammal of the rodent family",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  {
    id: "60df6b2f5311236168a109d7",
    name: "Vẹt",
    description: "Bird known for its ability to mimic sounds",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
];
