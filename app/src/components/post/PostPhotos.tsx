import React from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";

interface PostPhotosProps {
  photos: string[];
  className?: string;
}

const PostPhotos: React.FC<PostPhotosProps> = ({ photos, className = "" }) => {
  if (!photos || photos.length === 0) return null;

  return (
    <PhotoProvider>
      <div className={`grid grid-cols-2 gap-2 ${className}`}>
        {photos.slice(0, 4).map((url, idx) => (
          <PhotoView key={idx} src={url}>
            <div className="relative cursor-pointer">
              <img
                src={url}
                alt={`Ảnh ${idx + 1}`}
                className={`w-full h-40 object-cover rounded-lg ${idx === 3 && photos.length > 4 ? "brightness-50" : ""}`}
              />
              {idx === 3 && photos.length > 4 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold bg-black/50 px-2 py-1 rounded">
                    +{photos.length - 4}
                  </span>
                </div>
              )}
            </div>
          </PhotoView>
        ))}

        {photos.slice(4).map((url, idx) => (
          <PhotoView key={idx + 4} src={url}>
            <div className="hidden" />
          </PhotoView>
        ))}
      </div>
    </PhotoProvider>
  );
};

export default PostPhotos;
