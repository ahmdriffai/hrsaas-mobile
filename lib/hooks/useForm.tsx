import { useState } from "react";

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [form, setForm] = useState<T>(initialValues);

  const handleChange = (name: keyof T, value: any) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialValues);
  };

  const setValues = (values: Partial<T>) => {
    setForm((prev) => ({
      ...prev,
      ...values,
    }));
  };

  return {
    form,
    setForm,
    handleChange,
    resetForm,
    setValues,
  };
}
