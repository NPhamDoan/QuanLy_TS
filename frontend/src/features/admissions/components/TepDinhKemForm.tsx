import { useState, useRef } from 'react';
import { Upload, X, FileUp, CheckCircle } from 'lucide-react';
import { uploadTepDinhKem } from '../../../api/tuyensinh.api';
import { getErrorMessage } from '../../../utils/formatters';

interface TepDinhKemFormProps {
  maHoSo: string;
  onSuccess: () => void;
}

interface FileStatus {
  file: File;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

export default function TepDinhKemForm({ maHoSo, onSuccess }: TepDinhKemFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: FileList | File[]) => {
    const toAdd = Array.from(newFiles).filter(
      (f) => !files.some((existing) => existing.file.name === f.name && existing.file.size === f.size)
    );
    if (toAdd.length > 0) {
      setFiles((prev) => [...prev, ...toAdd.map((file) => ({ file, status: 'pending' as const }))]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    const pending = files.filter((f) => f.status === 'pending' || f.status === 'error');
    if (pending.length === 0 || uploading) return;

    setUploading(true);
    let hasSuccess = false;

    for (let i = 0; i < files.length; i++) {
      const item = files[i];
      if (item.status !== 'pending' && item.status !== 'error') continue;

      setFiles((prev) => prev.map((f, idx) => idx === i ? { ...f, status: 'uploading' } : f));

      try {
        await uploadTepDinhKem(maHoSo, item.file);
        setFiles((prev) => prev.map((f, idx) => idx === i ? { ...f, status: 'done' } : f));
        hasSuccess = true;
      } catch (err) {
        setFiles((prev) => prev.map((f, idx) => idx === i ? { ...f, status: 'error', error: getErrorMessage(err) } : f));
      }
    }

    setUploading(false);
    if (hasSuccess) onSuccess();
  };

  const handleClose = () => {
    if (uploading) return;
    setIsOpen(false);
    setFiles([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const pendingCount = files.filter((f) => f.status === 'pending' || f.status === 'error').length;
  const doneCount = files.filter((f) => f.status === 'done').length;
  const allDone = files.length > 0 && doneCount === files.length;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-[#A51C30] px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#A51C30] focus:outline-none focus:ring-2 focus:ring-red-300 cursor-pointer"
      >
        <Upload className="h-4 w-4" />
        Tải tệp lên
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="upload-dialog-title">
          <div className="fixed inset-0 bg-black/50" onClick={handleClose} aria-hidden="true" />
          <div className="relative w-full max-w-lg mx-4 rounded-xl bg-white p-6 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 id="upload-dialog-title" className="text-lg font-semibold text-slate-900">Tải tệp đính kèm</h2>
              <button onClick={handleClose} aria-label="Đóng" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors duration-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors duration-200 ${
                dragOver ? 'border-[#A51C30] bg-red-50' : 'border-slate-300 bg-slate-50 hover:border-[#A51C30] hover:bg-red-50/50'
              }`}
            >
              <FileUp className={`h-10 w-10 mb-3 ${dragOver ? 'text-purple-500' : 'text-slate-400'}`} />
              <p className="text-sm font-medium text-slate-700">Kéo thả tệp vào đây hoặc nhấn để chọn</p>
              <p className="mt-1 text-xs text-slate-500">Chọn nhiều tệp · Tối đa 10MB mỗi tệp</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleInputChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.xls,.xlsx"
              />
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="mt-4 max-h-48 overflow-y-auto space-y-2">
                {files.map((item, index) => (
                  <div key={`${item.file.name}-${index}`} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    {item.status === 'done' && <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />}
                    {item.status === 'uploading' && (
                      <svg className="h-4 w-4 shrink-0 animate-spin text-purple-500" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    )}
                    {item.status === 'pending' && <div className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-300" />}
                    {item.status === 'error' && <X className="h-4 w-4 shrink-0 text-red-500" />}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-slate-900">{item.file.name}</p>
                      <p className="text-xs text-slate-500">
                        {formatFileSize(item.file.size)}
                        {item.status === 'error' && item.error && <span className="text-red-500"> · {item.error}</span>}
                      </p>
                    </div>

                    {(item.status === 'pending' || item.status === 'error') && !uploading && (
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        aria-label="Bỏ tệp"
                        className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors duration-200"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Summary */}
            {files.length > 0 && (
              <p className="mt-2 text-xs text-slate-500">
                {files.length} tệp · {doneCount} đã tải · {pendingCount} chờ tải
              </p>
            )}

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={uploading}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors duration-200 cursor-pointer disabled:opacity-50"
              >
                {allDone ? 'Đóng' : 'Hủy'}
              </button>
              {!allDone && (
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={pendingCount === 0 || uploading}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#A51C30] px-4 py-2 text-sm font-medium text-white hover:bg-[#A51C30] transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Đang tải lên...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Tải lên {pendingCount > 1 ? `(${pendingCount} tệp)` : ''}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
