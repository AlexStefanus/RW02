import React from "react";

interface FormInputProps {
  label: string;
  id?: string;
  name?: string;
  type?: "text" | "email" | "password" | "date";
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const FormInput = ({ label, id, name, type = "text", value, defaultValue, placeholder, required = false, disabled = false, onChange, className = "" }: FormInputProps) => {
  return (
    <div>
      <label className="block text-xs font-medium text-black mb-2" htmlFor={id}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className={`form-input app-form-input w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00a753] focus:border-transparent text-black ${disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""} ${className}`}
      />
    </div>
  );
};

export default FormInput;
