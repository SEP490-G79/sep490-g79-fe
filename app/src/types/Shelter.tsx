// src/types/Shelter.ts

// File data structure for license
export interface FileData {
    fileName: string;
    url: string;
    size?: number;
    mimeType?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  // Member of a shelter with roles
  export interface ShelterMember {
    id: string; // User ObjectId as string
    roles: ('manager' | 'staff')[];
  }
  
  // Main Shelter interface
  export interface Shelter {
    _id: string;
    name: string;
    bio?: string;
    email: string;
    hotline: number;
    avatar: string;
    address?: string;
    background: string;
    members: ShelterMember[];
    shelterLicense: FileData;
    foundationDate: string; // ISO date string
    status: 'verifying' | 'active' | 'banned';
    warningCount: number;
    createdAt: string;
    updatedAt: string;
  }
  
  // Mock data for Shelter
  export const mockShelters: Shelter[] = [
    {
      _id: '60f6c4a7b4fa2b001c8e4d11',
      name: 'Paws & Claws Rescue Center',
      bio: 'Chúng tôi cứu hộ và chăm sóc hàng ngàn thú cưng mỗi năm.',
      email: 'contact@pawsclaws.org',
      hotline: 19001234,
      avatar: 'https://i.pinimg.com/736x/1e/c4/dd/1ec4ddfe6de7f6bea6c8d5342b0d0389.jpg',
      address: '123 Đường Yêu Thương, Quận 1, TP.HCM',
      background: 'https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg',
      members: [
        { id: '60f6c4a7b4fa2b001c8e4d22', roles: ['manager'] },
        { id: '60f6c4a7b4fa2b001c8e4d33', roles: ['staff'] },
      ],
      shelterLicense: {
        fileName: 'license_pawsclaws.pdf',
        url: 'https://example.com/licenses/license_pawsclaws.pdf',
        size: 345678,
        mimeType: 'application/pdf',
        createdAt: new Date('2020-05-15').toISOString(),
        updatedAt: new Date('2023-02-10').toISOString(),
      },
      foundationDate: new Date('2010-08-01').toISOString(),
      status: 'active',
      warningCount: 0,
      createdAt: new Date('2010-08-01').toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '60f6c4a7b4fa2b001c8e4d44',
      name: 'Little Paws Sanctuary',
      bio: 'Thứ hạng hàng đầu về chăm sóc vật nuôi già và bệnh tật.',
      email: 'info@littlepaws.org',
      hotline: 19005678,
      avatar: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
      address: '456 Đường Ấm Áp, Quận 2, TP. HCM',
      background: 'https://cdn.pixabay.com/photo/2015/10/01/20/17/01/background-980970_1280.jpg',
      members: [
        { id: '60f6c4a7b4fa2b001c8e4d55', roles: ['manager', 'staff'] },
        { id: '60f6c4a7b4fa2b001c8e4d66', roles: ['staff'] },
      ],
      shelterLicense: {
        fileName: 'license_littlepaws.pdf',
        url: 'https://example.com/licenses/license_littlepaws.pdf',
        size: 289345,
        mimeType: 'application/pdf',
        createdAt: new Date('2015-03-20').toISOString(),
        updatedAt: new Date('2024-01-05').toISOString(),
      },
      foundationDate: new Date('2015-03-20').toISOString(),
      status: 'verifying',
      warningCount: 1,
      createdAt: new Date('2015-03-20').toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  