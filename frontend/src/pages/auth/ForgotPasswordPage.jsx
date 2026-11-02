import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthInput, AuthButton, FormAlert } from '../../components/auth/AuthElements';
import { isValidEmail } from '../../lib/authValidation';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Forgot your password?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Enter the email address associated with your account. We&apos;ll help you get back in.
        </p>
      </div>

      {isSubmitted ? (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-200 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Password reset requested</span>
            </div>
            <p className="leading-relaxed">
              If an account exists for <strong>{email}</strong>, password reset instructions would be sent.
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 border-t border-emerald-200/60 dark:border-emerald-900/60 pt-2">
              Note: This is a frontend demo prototype. In a production environment with backend integration, an actual email with a reset token link would be delivered.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link
              to="/reset-password"
              className="text-center py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              Continue to Demo Password Reset
            </Link>
            <Link
              to="/login"
              className="text-center py-2 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
            >
              Back to Sign in
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="alex@workpulse.app"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            error={error}
          />

          <AuthButton type="submit" isLoading={isLoading} className="mt-2">
            Send Reset Link
          </AuthButton>

          <div className="pt-2 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign in
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

