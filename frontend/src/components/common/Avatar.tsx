import { useState } from 'react';

// Bảng màu pastel cho fallback avatar
const COLORS = [
  '#F87171', '#FB923C', '#FBBF24', '#34D399', '#60A5FA',
  '#A78BFA', '#F472B6', '#2DD4BF', '#818CF8', '#FB7185',
];

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getInitials(hoTen: string): string {
  const parts = hoTen.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

interface AvatarProps {
  hoTen: string;
  anhDaiDien?: string | null;
  size?: number; // px, default 80
  className?: string;
}

export default function Avatar({ hoTen, anhDaiDien, size = 80, className = '' }: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const avatarUrl = anhDaiDien
    ? `${import.meta.env.VITE_API_URL || ''}/uploads/public/${anhDaiDien}?t=${Date.now()}`
    : null;

  const showImage = avatarUrl && !imgError;

  const bgColor = getColorFromName(hoTen);
  const initials = getInitials(hoTen);
  const fontSize = Math.round(size * 0.38);

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size, backgroundColor: showImage ? 'transparent' : bgColor }}
    >
      {showImage ? (
        <img
          src={avatarUrl}
          alt={`Avatar ${hoTen}`}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          className="font-bold text-white select-none"
          style={{ fontSize }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}
