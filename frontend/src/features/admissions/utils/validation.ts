import type { FormErrors, ValidationRule } from '../types';

export const VALIDATION_RULES: Record<string, ValidationRule> = {
  hoTen:        { required: true, message: 'Trường này là bắt buộc' },
  ngaySinh:     { required: true, pattern: /^\d{4}-\d{2}-\d{2}$/, message: 'Ngày sinh không hợp lệ' },
  gioiTinh:     { required: true, message: 'Vui lòng chọn giới tính' },
  cccd:         { required: true, pattern: /^\d{12}$/, message: 'CCCD phải gồm đúng 12 chữ số' },
  email:        { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email không hợp lệ' },
  soDienThoai:  { required: true, pattern: /^0\d{9,10}$/, message: 'Số điện thoại phải gồm 10-11 chữ số và bắt đầu bằng 0' },
  diaChi:       { required: true, message: 'Trường này là bắt buộc' },
  namTuyenSinhId: { required: true, message: 'Trường này là bắt buộc' },
  dotTuyenSinhId: { required: true, message: 'Trường này là bắt buộc' },
  nganhDangKyId:  { required: true, message: 'Trường này là bắt buộc' },
  heDaoTaoId:     { required: true, message: 'Trường này là bắt buộc' },
};

export function validateField(name: string, value: string): string | undefined {
  const rule = VALIDATION_RULES[name];
  if (!rule) return undefined;

  if (rule.required && !value.trim()) {
    return rule.pattern ? 'Trường này là bắt buộc' : rule.message;
  }

  if (rule.pattern && value.trim() && !rule.pattern.test(value)) {
    return rule.message;
  }

  return undefined;
}

export function validateForm(data: Record<string, string>): FormErrors {
  const errors: FormErrors = {};
  for (const name of Object.keys(VALIDATION_RULES)) {
    const error = validateField(name, data[name] ?? '');
    if (error) {
      errors[name] = error;
    }
  }
  return errors;
}
