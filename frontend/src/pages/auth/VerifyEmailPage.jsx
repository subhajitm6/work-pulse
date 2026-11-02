import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react';
import { FormAlert } from '../../components/auth/AuthElements';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const { currentUser, markEmailVerified } = useAuth();

  const [isResending, setIsResending] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [verifiedSuccess, setVerifiedSuccess] = useState(currentUser?.isEmailVerified ?? false);

  const targetEmail = currentUser?.email || 'your email';

  const handleResend = async () => {
    setIsResending(true);
    setFeedback('');
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsResending(false);
    setFeedback(`Demo simulation: A fresh verification link would be dispatched to ${targetEmail}.`);
  };

  const handleSimulateVerification = () => {
    markEmailVerified();
    setVerifiedSuccess(true);
  };

  return (
    <div className="space-y-6 text-center sm:text-left">
      <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto sm:mx-0 shadow-xs">
        <Mail className="w-6 h-6" />
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Check your inbox
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          We need to verify your email address to ensure your account security.
        </p>
      </div>

      {feedback && <FormAlert type="info" message={feedback} />}

      {verifiedSuccess ? (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-200 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Email verified successfully</span>
          </div>
          <p className="leading-relaxed">
            Your email has been verified in this demo session. You now have full access to WorkPulse.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs transition-colors"
          >
            <span>Proceed to Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-2">
            <p className="text-slate-600 dark:text-slate-300">
              A verification link would be sent to:
            </p>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">
              {targetEmail}
            </p>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800">
              Note: Email delivery is not configured in this frontend-only build. Use the button below to test verification success.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleSimulateVerification}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simulate Email Verified (Demo)</span>
            </button>

            <button
              onClick={handleResend}
              disabled={isResending}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>Resend Verification Email</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <Link
              to="/login"
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
            >
              Back to Sign in
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

