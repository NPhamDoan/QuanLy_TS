import { useRef, useState } from 'react';
import Avatar from './Avatar';
import axiosClient from '../../api/axiosClient';

interface AvatarUploadProps {
  hoTen: string;
  maSinhVien: string;
  anhDaiDien?: string | null;
  size?: number;
  onUploaded?: (newPath: string) => void;
}

export default function AvatarUpload({ hoTen, maSinhVien, anhDaiDien, size = 100, onUploaded }: AvatarUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(anhDaiDien);
  const [avatarKey, setAvatarKey] = useState(0); // force re-render Avatar
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    fileRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate client-side
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Chi chap nhan jpg, png, webp');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File qua lon (max 5MB)');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const { data } = await axiosClient.post(
        `/sinhvien/${maSinhVien}/avatar`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setCurrentAvatar(data.anhDaiDien);
      setAvatarKey((k) => k + 1); // force Avatar to reload image
      onUploaded?.(data.anhDaiDien);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload that bai');
    } finally {
      setUploading(false);
      // Reset input
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={uploading}
        className="relative group cursor-pointer disabled:cursor-wait"
        title="Click de upload anh dai dien"
      >
        <Avatar
          key={avatarKey}
          hoTen={hoTen}
          anhDaiDien={currentAvatar}
          size={size}
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-medium">
            {uploading ? 'Dang tai...' : 'Doi anh'}
          </span>
        </div>
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
