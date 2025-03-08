import { useState } from "react";

type ValidationRules<T> = {
  [K in keyof T]?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: T[K]) => boolean;
    message?: string;
  };
};

type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T>,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    {} as Record<keyof T, boolean>,
  );

  const validate = (fieldName?: keyof T): boolean => {
    const newErrors: ValidationErrors<T> = { ...errors };
    let isValid = true;

    const validateField = (name: keyof T) => {
      const value = values[name];
      const rules = validationRules[name];

      if (!rules) return true;

      // Clear previous error
      delete newErrors[name];

      // Required validation
      if (
        rules.required &&
        (value === undefined || value === null || value === "")
      ) {
        newErrors[name] = rules.message || "هذا الحقل مطلوب";
        return false;
      }

      // Skip other validations if value is empty and not required
      if (value === undefined || value === null || value === "") return true;

      // Min length validation
      if (
        rules.minLength !== undefined &&
        typeof value === "string" &&
        value.length < rules.minLength
      ) {
        newErrors[name] =
          rules.message ||
          `يجب أن يكون الحقل ${rules.minLength} أحرف على الأقل`;
        return false;
      }

      // Max length validation
      if (
        rules.maxLength !== undefined &&
        typeof value === "string" &&
        value.length > rules.maxLength
      ) {
        newErrors[name] =
          rules.message || `يجب أن لا يتجاوز الحقل ${rules.maxLength} حرف`;
        return false;
      }

      // Min value validation
      if (
        rules.min !== undefined &&
        typeof value === "number" &&
        value < rules.min
      ) {
        newErrors[name] =
          rules.message || `يجب أن تكون القيمة ${rules.min} على الأقل`;
        return false;
      }

      // Max value validation
      if (
        rules.max !== undefined &&
        typeof value === "number" &&
        value > rules.max
      ) {
        newErrors[name] =
          rules.message || `يجب أن لا تتجاوز القيمة ${rules.max}`;
        return false;
      }

      // Pattern validation
      if (
        rules.pattern &&
        typeof value === "string" &&
        !rules.pattern.test(value)
      ) {
        newErrors[name] = rules.message || "القيمة غير صالحة";
        return false;
      }

      // Custom validation
      if (rules.custom && !rules.custom(value)) {
        newErrors[name] = rules.message || "القيمة غير صالحة";
        return false;
      }

      return true;
    };

    if (fieldName) {
      isValid = validateField(fieldName);
    } else {
      // Validate all fields
      for (const key in validationRules) {
        const fieldValid = validateField(key as keyof T);
        isValid = isValid && fieldValid;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "number" ? (value === "" ? "" : Number(value)) : value;

    setValues({
      ...values,
      [name]: newValue,
    });

    // Mark field as touched
    setTouched({
      ...touched,
      [name]: true,
    });

    // Validate field if it's already been touched
    if (touched[name as keyof T]) {
      validate(name as keyof T);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name } = e.target;

    // Mark field as touched
    setTouched({
      ...touched,
      [name]: true,
    });

    // Validate field
    validate(name as keyof T);
  };

  const handleSubmit =
    (onSubmit: (values: T) => void) => (e: React.FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched
      const allTouched = Object.keys(validationRules).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>,
      );
      setTouched(allTouched);

      // Validate all fields
      const isValid = validate();

      if (isValid) {
        onSubmit(values);
      }
    };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({} as Record<keyof T, boolean>);
  };

  const setFieldValue = (name: keyof T, value: T[keyof T]) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    validate,
    setValues,
  };
}
