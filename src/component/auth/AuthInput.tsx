import React from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface AuthInputProps {
  label: string;
  type?: "text" | "email" | "password";
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  mounted?: boolean;
}

const AuthInput = ({ label, type = "text", id, name, value, onChange, placeholder, required = false, showPassword, onTogglePassword, mounted = true }: AuthInputProps) => {
  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2 smooth-transition">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="form-input w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm text-black smooth-transition hover:border-gray-400 hover-lift"
          placeholder={placeholder}
          required={required}
        />
        {type === "password" && onTogglePassword && (
          <button type="button" onClick={onTogglePassword} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 smooth-transition hover:scale-110 active:scale-95">
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
