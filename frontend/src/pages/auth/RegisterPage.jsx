import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthInput, PasswordInput, PasswordStrength, AuthButton, FormAlert } from '../../components/auth/AuthElements';
import { isValidEmail, validatePassword } from '../../lib/authValidation';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!name.trim()) {
      errs.name = 'Full name is required';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!isValidEmail(email)) {
      errs.email = 'Please enter a valid email format';
    }

    const pwdVal = validatePassword(password);
    if (!password) {
      errs.password = 'Password is required';
    } else if (!pwdVal.isValid) {
      errs.password = 'Password does not satisfy all requirements';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!acceptTerms) {
      errs.acceptTerms = 'You must accept the Terms of Service & Privacy Policy';
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
      await register({ name, email, password });
      // Redirect to verify email status screen
      navigate('/verify-email', { replace: true });
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create an account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Start organizing your work and tracking productivity today.
        </p>
      </div>

      {formError && <FormAlert type="error" message={formError} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Full Name"
          type="text"
          autoComplete="name"
          placeholder="Alex Vance"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
          }}
          error={errors.name}
        />

        <AuthInput
          label="Work Email"
          type="email"
          autoComplete="email"
          placeholder="alex@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
          }}
          error={errors.email}
        />

        <div>
          <PasswordInput
            label="Password"
            autoComplete="new-password"
            placeholder="Min. 8 chars, 1 letter, 1 number"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
            }}
            error={errors.password}
          />
          <div className="mt-2">
            <PasswordStrength password={password} />
          </div>
        </div>

        <PasswordInput
          label="Confirm Password"
          autoComplete="new-password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
          }}
          error={errors.confirmPassword}
        />

        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => {
                setAcceptTerms(e.target.checked);
                if (errors.acceptTerms) setErrors((prev) => ({ ...prev, acceptTerms: null }));
              }}
              className="mt-0.5 rounded border-slate-300 text-brand-500 focus:ring-brand-500 shrink-0"
            />
            <span>
              I agree to the <span className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Terms of Service</span> and{' '}
              <span className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Privacy Policy</span>.
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.acceptTerms}</p>
          )}
        </div>

        <AuthButton type="submit" isLoading={isLoading} className="mt-2">
          Create Account
        </AuthButton>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}

