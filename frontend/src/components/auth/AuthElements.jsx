import React, { useState } from 'react';
import { Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react';
import { validatePassword } from '../../lib/authValidation';

export function AuthInput({ label, error, className = '', id, ...props }) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-colors ${
          error
            ? 'border-rose-400 dark:border-rose-800 focus:ring-rose-400'
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="flex items-center gap-1 text-xs text-rose-500 dark:text-rose-400 pt-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export function PasswordInput({ label = 'Password', error, value, id, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5 text-left">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </label>
      </div>
      <div className="relative">
        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          value={value}
          className={`w-full pl-3.5 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-colors ${
            error
              ? 'border-rose-400 dark:border-rose-800 focus:ring-rose-400'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-rose-500 dark:text-rose-400 pt-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export function PasswordStrength({ password }) {
  const { hasMinLength, hasLetter, hasNumber } = validatePassword(password);

  if (!password) return null;

  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
      <span className="font-semibold text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500 block mb-1">
        Password Requirements:
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}`}>
          {hasMinLength ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-1" />}
          <span>8+ characters</span>
        </div>
        <div className={`flex items-center gap-1.5 ${hasLetter ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}`}>
          {hasLetter ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-1" />}
          <span>At least 1 letter</span>
        </div>
        <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}`}>
          {hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-1" />}
          <span>At least 1 number</span>
        </div>
      </div>
    </div>
  );
}

export function AuthButton({ children, isLoading, disabled, className = '', ...props }) {
  return (
    <button
      disabled={isLoading || disabled}
      className={`w-full py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 disabled:opacity-50 text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function FormAlert({ type = 'error', message }) {
  if (!message) return null;

  const isError = type === 'error';
  return (
    <div
      className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
        isError
          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300'
          : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300'
      }`}
    >
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      <span className="leading-relaxed">{message}</span>
    </div>
  );
}

