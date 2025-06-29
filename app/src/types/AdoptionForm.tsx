
export interface AdoptionForm {
    _id: string;
    title: string;
    pet: string;          
    description?: string;
    questions: string[];  
    createdBy: string;   
    shelter: string;     
    status: "draft" | "active" | "closed";
    createdAt: string;
    updatedAt: string;
  }
  

  export const mockAdoptionForms: AdoptionForm[] = [
    {
      _id: '610a1f2b8cfa34001f8b4567',
      title: 'Form nhận nuôi lũ mèo con',
      pet: '60f6c4a7b4fa2b001c8e4d11',
      description: 'Dành cho các bạn yêu mèo, muốn nhận nuôi mèo con.',
      questions: [
        '621b2e3c9dfa55002a9d1234',
        '621b2e3c9dfa55002a9d1235',
      ],
      createdBy: '60f6c4a7b4fa2b001c8e4d22',
      shelter: '60f6c4a7b4fa2b001c8e4d11',
      status: 'active',
      createdAt: new Date('2023-05-10').toISOString(),
      updatedAt: new Date('2023-06-01').toISOString(),
    },
    {
      _id: '610a1f2b8cfa34001f8b4568',
      title: 'Form nhận nuôi chó già',
      pet: '60f6c4a7b4fa2b001c8e4d44',
      description: 'Ưu tiên những bạn có kinh nghiệm chăm sóc chó lớn tuổi.',
      questions: [
        '621b2e3c9dfa55002a9d1236',
        '621b2e3c9dfa55002a9d1237',
      ],
      createdBy: '60f6c4a7b4fa2b001c8e4d33',
      shelter: '60f6c4a7b4fa2b001c8e4d44',
      status: 'draft',
      createdAt: new Date('2023-06-05').toISOString(),
      updatedAt: new Date('2023-06-05').toISOString(),
    },
    {
      _id: '610a1f2b8cfa34001f8b4569',
      title: 'Form nhận nuôi chó con năng động',
      pet: '60f6c4a7b4fa2b001c8e4d55',
      description: 'Phù hợp với gia đình nhiều trẻ em, có không gian rộng.',
      questions: [
        '621b2e3c9dfa55002a9d1238',
        '621b2e3c9dfa55002a9d1239',
      ],
      createdBy: '60f6c4a7b4fa2b001c8e4d22',
      shelter: '60f6c4a7b4fa2b001c8e4d11',
      status: 'active',
      createdAt: new Date('2023-04-20').toISOString(),
      updatedAt: new Date('2023-05-15').toISOString(),
    },
    {
      _id: '610a1f2b8cfa34001f8b4560',
      title: 'Form nhận nuôi mèo không lông',
      pet: '60f6c4a7b4fa2b001c8e4d66',
      questions: [
        '621b2e3c9dfa55002a9d1240',
        '621b2e3c9dfa55002a9d1241',
      ],
      createdBy: '60f6c4a7b4fa2b001c8e4d33',
      shelter: '60f6c4a7b4fa2b001c8e4d44',
      status: 'closed',
      createdAt: new Date('2023-03-01').toISOString(),
      updatedAt: new Date('2023-04-01').toISOString(),
    },
    {
      _id: '610a1f2b8cfa34001f8b4561',
      title: 'Form nhận nuôi Thỏ cảnh',
      pet: '60f6c4a7b4fa2b001c8e4d77',
      description: 'Yêu cầu chuồng rộng, có chế độ ăn chuyên biệt.',
      questions: [
        '621b2e3c9dfa55002a9d1242',
        '621b2e3c9dfa55002a9d1243',
      ],
      createdBy: '60f6c4a7b4fa2b001c8e4d22',
      shelter: '60f6c4a7b4fa2b001c8e4d11',
      status: 'active',
      createdAt: new Date('2023-02-14').toISOString(),
      updatedAt: new Date('2023-06-10').toISOString(),
    },
    {
      _id: '610a1f2b8cfa34001f8b4561',
      title: 'Form nhận nuôi Thỏ cảnh',
      pet: '60f6c4a7b4fa2b001c8e4d77',
      description: 'Yêu cầu chuồng rộng, có chế độ ăn chuyên biệt.',
      questions: [
        '621b2e3c9dfa55002a9d1242',
        '621b2e3c9dfa55002a9d1243',
      ],
      createdBy: '60f6c4a7b4fa2b001c8e4d22',
      shelter: '60f6c4a7b4fa2b001c8e4d11',
      status: 'active',
      createdAt: new Date('2023-02-14').toISOString(),
      updatedAt: new Date('2023-06-10').toISOString(),
    },
    {
      _id: '610a1f2b8cfa34001f8b4561',
      title: 'Form nhận nuôi Thỏ cảnh',
      pet: '60f6c4a7b4fa2b001c8e4d77',
      description: 'Yêu cầu chuồng rộng, có chế độ ăn chuyên biệt.',
      questions: [
        '621b2e3c9dfa55002a9d1242',
        '621b2e3c9dfa55002a9d1243',
      ],
      createdBy: '60f6c4a7b4fa2b001c8e4d22',
      shelter: '60f6c4a7b4fa2b001c8e4d11',
      status: 'active',
      createdAt: new Date('2023-02-14').toISOString(),
      updatedAt: new Date('2023-06-10').toISOString(),
    },
    {
      _id: '610a1f2b8cfa34001f8b4561',
      title: 'Form nhận nuôi Thỏ cảnh',
      pet: '60f6c4a7b4fa2b001c8e4d77',
      description: 'Yêu cầu chuồng rộng, có chế độ ăn chuyên biệt.',
      questions: [
        '621b2e3c9dfa55002a9d1242',
        '621b2e3c9dfa55002a9d1243',
      ],
      createdBy: '60f6c4a7b4fa2b001c8e4d22',
      shelter: '60f6c4a7b4fa2b001c8e4d11',
      status: 'active',
      createdAt: new Date('2023-02-14').toISOString(),
      updatedAt: new Date('2023-06-10').toISOString(),
    },
  ];
  