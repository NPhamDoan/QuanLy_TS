import { useState, type FormEvent } from 'react';

export interface CatalogField {
  key: string;
  label: string;
  type?: 'text' | 'select';
  options?: Array<{ value: string | number; label: string }>;
}

interface CatalogFormProps {
  fields: CatalogField[];
  initialValues?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
  title?: string;
}

export default function CatalogForm({
  fields,
  initialValues,
  onSubmit,
  onCancel,
  isEditing = false,
  title,
}: CatalogFormProps) {
  const buildInitial = () => {
    const vals: Record<string, any> = {};
    for (const f of fields) {
      vals[f.key] = initialValues?.[f.key] ?? '';
    }
    return vals;
  };

  const [form, setForm] = useState<Record<string, any>>(buildInitial);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit(form);
      if (!isEditing) {
        setForm(buildInitial());
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError(err.response.data?.error || 'Dữ liệu đã tồn tại');
      } else {
        setError(err.response?.data?.error || 'Có lỗi xảy ra');
      }
    } finally {
      setLoading(false);
    }
  };

  const heading = title ?? (isEditing ? 'Cập nhật' : 'Thêm mới');

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">{heading}</h2>

      {error && (
        <div className="mb-4 p-3 bg-purple-50 text-red-700 rounded border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(field => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select
                value={form[field.key] ?? ''}
                onChange={e => handleChange(field.key, e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">-- Chọn --</option>
                {field.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                value={form[field.key] ?? ''}
                onChange={e => handleChange(field.key, e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-purple-800 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Thêm mới'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-700 bg-slate-100 rounded text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}
