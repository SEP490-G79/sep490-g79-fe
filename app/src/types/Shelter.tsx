// src/types/Shelter.ts

export interface FileData {
  fileName: string;
  url: string;
  size?: number;
  mimeType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShelterMember {
  id: string;
  roles: ('manager' | 'staff')[];
}

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
  foundationDate: string;
  status: 'verifying' | 'active' | 'banned';
  warningCount: number;
  createdAt: string;
  updatedAt: string;
}

export const mockShelters: Shelter[] = [
  // --- 2 cái cũ ---
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

  // --- 8 mock thêm vào ---
  {
    _id: '60f6c4a7b4fa2b001c8e4d77',
    name: 'Happy Tails Rescue',
    bio: 'Nơi mang lại nụ cười và mái ấm cho thú cưng.',
    email: 'contact@happytails.org',
    hotline: 19002345,
    avatar: 'https://i.imgur.com/OYVpe8R.jpg',
    address: '789 Đường Hạnh Phúc, Quận 3, TP.HCM',
    background: 'https://images.pexels.com/photos/1584714/pexels-photo-1584714.jpeg',
    members: [
      { id: '60f6c4a7b4fa2b001c8e4d88', roles: ['manager'] },
      { id: '60f6c4a7b4fa2b001c8e4d99', roles: ['staff'] },
    ],
    shelterLicense: {
      fileName: 'license_happytails.pdf',
      url: 'https://example.com/licenses/license_happytails.pdf',
      size: 210123,
      mimeType: 'application/pdf',
      createdAt: new Date('2018-07-10').toISOString(),
      updatedAt: new Date('2023-11-12').toISOString(),
    },
    foundationDate: new Date('2018-07-10').toISOString(),
    status: 'active',
    warningCount: 0,
    createdAt: new Date('2018-07-10').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '60f6c4a7b4fa2b001c8e4daa',
    name: 'Safe Paws Haven',
    bio: 'Chăm sóc và cứu hộ thú cưng khỏi nguy cơ đường phố.',
    email: 'hello@safepaws.org',
    hotline: 19003456,
    avatar: 'https://i.imgur.com/1QgrNNw.jpg',
    address: '123 Đường Bình Yên, Quận 4, TP.HCM',
    background: 'https://images.pexels.com/photos/460648/pexels-photo-460648.jpeg',
    members: [
      { id: '60f6c4a7b4fa2b001c8e4dbb', roles: ['manager'] },
      { id: '60f6c4a7b4fa2b001c8e4dcc', roles: ['staff'] },
    ],
    shelterLicense: {
      fileName: 'license_safepaws.pdf',
      url: 'https://example.com/licenses/license_safepaws.pdf',
      size: 198765,
      mimeType: 'application/pdf',
      createdAt: new Date('2019-02-14').toISOString(),
      updatedAt: new Date('2024-03-01').toISOString(),
    },
    foundationDate: new Date('2019-02-14').toISOString(),
    status: 'active',
    warningCount: 0,
    createdAt: new Date('2019-02-14').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '60f6c4a7b4fa2b001c8e4edd',
    name: 'Furry Friends Shelter',
    bio: 'Nơi các bạn lông dài tìm thấy mái nhà mới.',
    email: 'info@furryfriends.org',
    hotline: 19004567,
    avatar: 'https://i.imgur.com/4AiXzf8.jpg',
    address: '456 Đường Lông Thú, Quận 5, TP.HCM',
    background: 'https://images.pexels.com/photos/45170/kittens-cute-cat-cat-puppy-45170.jpeg',
    members: [
      { id: '60f6c4a7b4fa2b001c8e4fee', roles: ['manager'] },
      { id: '60f6c4a7b4fa2b001c8e4fff', roles: ['staff'] },
    ],
    shelterLicense: {
      fileName: 'license_furryfriends.pdf',
      url: 'https://example.com/licenses/license_furryfriends.pdf',
      size: 256789,
      mimeType: 'application/pdf',
      createdAt: new Date('2020-09-05').toISOString(),
      updatedAt: new Date('2024-02-20').toISOString(),
    },
    foundationDate: new Date('2020-09-05').toISOString(),
    status: 'verifying',
    warningCount: 1,
    createdAt: new Date('2020-09-05').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '60f6c4a7b4fa2b001c8e4f11',
    name: 'Purrfect Home',
    bio: 'Chuyên cứu hộ mèo bị bỏ rơi trên đường phố.',
    email: 'hello@purrfecthome.org',
    hotline: 19005679,
    avatar: 'https://i.imgur.com/X1pJk1L.jpg',
    address: '789 Đường Mèo Con, Quận 6, TP.HCM',
    background: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg',
    members: [
      { id: '60f6c4a7b4fa2b001c8e4f22', roles: ['manager'] },
      { id: '60f6c4a7b4fa2b001c8e4f33', roles: ['staff'] },
    ],
    shelterLicense: {
      fileName: 'license_purrfecthome.pdf',
      url: 'https://example.com/licenses/license_purrfecthome.pdf',
      size: 312345,
      mimeType: 'application/pdf',
      createdAt: new Date('2021-01-20').toISOString(),
      updatedAt: new Date('2024-04-15').toISOString(),
    },
    foundationDate: new Date('2021-01-20').toISOString(),
    status: 'active',
    warningCount: 0,
    createdAt: new Date('2021-01-20').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '60f6c4a7b4fa2b001c8e4f44',
    name: 'Rescue Paw Haven',
    bio: 'Cứu hộ thú cưng bị tai nạn và khuyết tật.',
    email: 'contact@rescuepaw.org',
    hotline: 19006780,
    avatar: 'https://i.imgur.com/MnK1R7Y.jpg',
    address: '123 Đường Yêu Thương, Quận 7, TP.HCM',
    background: 'https://images.pexels.com/photos/240035/pexels-photo-240035.jpeg',
    members: [
      { id: '60f6c4a7b4fa2b001c8e4f55', roles: ['manager'] },
      { id: '60f6c4a7b4fa2b001c8e4f66', roles: ['staff'] },
    ],
    shelterLicense: {
      fileName: 'license_rescuepaw.pdf',
      url: 'https://example.com/licenses/license_rescuepaw.pdf',
      size: 276543,
      mimeType: 'application/pdf',
      createdAt: new Date('2022-06-10').toISOString(),
      updatedAt: new Date('2024-05-22').toISOString(),
    },
    foundationDate: new Date('2022-06-10').toISOString(),
    status: 'active',
    warningCount: 0,
    createdAt: new Date('2022-06-10').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '60f6c4a7b4fa2b001c8e4f77',
    name: 'Companion Care Center',
    bio: 'Trung tâm chăm sóc và tái hòa nhập thú cưng bị bỏ rơi.',
    email: 'info@companioncare.org',
    hotline: 19007891,
    avatar: 'https://i.imgur.com/6XZ9XFi.jpg',
    address: '456 Đường Đồng Hành, Quận 8, TP.HCM',
    background: 'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg',
    members: [
      { id: '60f6c4a7b4fa2b001c8e4f88', roles: ['manager'] },
      { id: '60f6c4a7b4fa2b001c8e4f99', roles: ['staff'] },
    ],
    shelterLicense: {
      fileName: 'license_companioncare.pdf',
      url: 'https://example.com/licenses/license_companioncare.pdf',
      size: 295432,
      mimeType: 'application/pdf',
      createdAt: new Date('2019-11-25').toISOString(),
      updatedAt: new Date('2024-03-30').toISOString(),
    },
    foundationDate: new Date('2019-11-25').toISOString(),
    status: 'verifying',
    warningCount: 2,
    createdAt: new Date('2019-11-25').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '60f6c4a7b4fa2b001c8e4f88',
    name: 'Four Paws Refuge',
    bio: 'Tiếp nhận và chăm sóc mọi giống loài thú cưng.',
    email: 'hello@fourpaws.org',
    hotline: 19008912,
    avatar: 'https://i.imgur.com/ZX8YhKA.jpg',
    address: '789 Đường Bốn Chân, Quận 9, TP.HCM',
    background: 'https://images.pexels.com/photos/348412/pexels-photo-348412.jpeg',
    members: [
      { id: '60f6c4a7b4fa2b001c8e4faa', roles: ['manager'] },
      { id: '60f6c4a7b4fa2b001c8e4fbb', roles: ['staff'] },
    ],
    shelterLicense: {
      fileName: 'license_fourpaws.pdf',
      url: 'https://example.com/licenses/license_fourpaws.pdf',
      size: 325678,
      mimeType: 'application/pdf',
      createdAt: new Date('2018-12-12').toISOString(),
      updatedAt: new Date('2024-01-10').toISOString(),
    },
    foundationDate: new Date('2018-12-12').toISOString(),
    status: 'active',
    warningCount: 0,
    createdAt: new Date('2018-12-12').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
