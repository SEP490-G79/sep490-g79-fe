import React from 'react';
import type { Shelter } from '@/types/Shelter';

interface ShelterInfoProps {
  shelter: Shelter;
}

// Utility để chọn class theo status
const statusClasses: Record<Shelter['status'], string> = {
  verifying: 'bg-yellow-100 text-yellow-800',
  active:    'bg-green-100 text-green-800',
  banned:    'bg-red-100 text-red-800',
};

export const ShelterInfo: React.FC<ShelterInfoProps> = ({ shelter }) => {
  const foundation = new Date(shelter.foundationDate).toLocaleDateString();

  return (
    <div className="sticky top-20 space-y-6 p-4 bg-[var(--card)] rounded-lg shadow">
      {/* Name & Bio */}
      <div className="space-y-2">
        {shelter.bio && (
          <p className="text-sm text-[var(--muted-foreground)]">
            {shelter.bio}
          </p>
        )}
      </div>

      {/* Contact & Info */}
      <div className="space-y-1 text-sm text-[var(--foreground)]">
        <div>
          <span className="font-medium">Email:</span>{' '}
          <a
            href={`mailto:${shelter.email}`}
            className="text-primary hover:underline"
          >
            {shelter.email}
          </a>
        </div>
        <div>
          <span className="font-medium">Hotline:</span>{' '}
          <a href={`tel:${shelter.hotline}`} className="text-primary hover:underline">
            {shelter.hotline}
          </a>
        </div>
        <div>
          <span className="font-medium">Địa chỉ:</span> {shelter.address || 'Đang cập nhật'}
        </div>
        <div>
          <span className="font-medium">Thành lập:</span>{' '}
          {foundation}
        </div>
      </div>

      
    </div>
  );
};

export default ShelterInfo;
