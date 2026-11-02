import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PasswordInput, PasswordStrength, AuthButton, FormAlert } from '../../components/auth/AuthElements';
import { validatePassword } from '../../lib/authValidation';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword, currentUser } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    const pwdVal = validatePassword(newPassword);

    if (!newPassword) {
      errs.newPassword = 'New password is required';
    } else if (!pwdVal.isValid) {
      errs.newPassword = 'Password does not meet the requirements';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validate()) return;

    setIsLoading(true);
    try {
      await resetPassword({ newPassword });
      setIsSuccess(true);
    } catch (err) {
      setFormError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Set new password
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Your new password must be at least 8 characters with letters and numbers.
        </p>
      </div>

      {/* Demo token notice */}
      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <span className="leading-relaxed">
          Demo Flow: In production, this form requires a verified reset token from your email. In this frontend prototype, passwords are demonstrative.
        </span>
      </div>

      {formError && <FormAlert type="error" message={formError} />}

      {isSuccess ? (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-200 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Password successfully updated</span>
            </div>
            <p className="leading-relaxed">
              Your password has been changed. You can now use your updated credentials to access WorkPulse.
            </p>
          </div>

          <Link
            to="/login"
            className="block text-center py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            Sign In with New Password
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <PasswordInput
              label="New Password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: null }));
              }}
              error={errors.newPassword}
            />
            <div className="mt-2">
              <PasswordStrength password={newPassword} />
            </div>
          </div>

          <PasswordInput
            label="Confirm New Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
            }}
            error={errors.confirmPassword}
          />

          <AuthButton type="submit" isLoading={isLoading} className="mt-2">
            Update Password
          </AuthButton>

          <div className="pt-2 text-center">
            <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium">
              Cancel and return to Sign in
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

