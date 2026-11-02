import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthInput, PasswordInput, AuthButton, FormAlert } from '../../components/auth/AuthElements';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Username or email is required';
    }

    if (!password) {
      errs.password = 'Password is required';
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
      await login({ email: email.trim(), password, rememberMe });
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Enter your credentials to access your workspace.
        </p>
      </div>

      {formError && <FormAlert type="error" message={formError} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Email or Username"
          type="text"
          autoComplete="username"
          placeholder="subhajitm or user@example.com"
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
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
            }}
            error={errors.password}
          />
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-300 text-brand-500 focus:ring-brand-500"
            />
            <span>Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <AuthButton type="submit" isLoading={isLoading} className="mt-2">
          Sign In
        </AuthButton>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
          Create an account
        </Link>
      </div>
    </div>
  );
}
