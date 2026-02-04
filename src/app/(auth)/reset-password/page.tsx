"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import Image from "next/image";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }

      setSuccess(true);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0A0A0F' }}>
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#F0F0F5' }}>Invalid reset link</h1>
          <p className="mb-6" style={{ color: '#A0A0B0' }}>
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-semibold uppercase tracking-wide transition-all"
            style={{
              backgroundColor: '#00F0FF',
              color: '#0A0A0F',
            }}
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0A0A0F' }}>
        <div className="w-full max-w-md text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
          >
            <CheckCircle className="w-8 h-8" style={{ color: '#10B981' }} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#F0F0F5' }}>Password reset successful</h1>
          <p className="mb-6" style={{ color: '#A0A0B0' }}>
            Your password has been reset. You can now sign in with your new password.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-semibold uppercase tracking-wide transition-all"
            style={{
              backgroundColor: '#00F0FF',
              color: '#0A0A0F',
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0A0A0F' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <Image src="/keystone-icon.svg" alt="Keystone" width={48} height={48} className="drop-glow-primary" />
            <span className="text-2xl font-bold text-gradient-power font-display tracking-wide">KEYSTONE</span>
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: '#F0F0F5' }}>Set new password</h1>
          <p className="mt-2" style={{ color: '#A0A0B0' }}>Enter your new password below</p>
        </div>

        <div
          className="rounded-lg p-6 relative"
          style={{
            backgroundColor: '#12121A',
            border: '1px solid #2A2A38'
          }}
        >
          {/* Top accent */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg"
            style={{ background: 'linear-gradient(135deg, #00F0FF 0%, #8B5CF6 100%)' }}
          />

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="p-3 rounded-md text-sm"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#EF4444'
                }}
              >
                {error}
              </div>
            )}

            <div>
              <label
                className="block text-sm font-semibold mb-2 uppercase tracking-wide"
                style={{ color: '#A0A0B0' }}
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 rounded-sm text-sm transition-all outline-none pr-12"
                  style={{
                    backgroundColor: '#22222E',
                    border: '1px solid #3A3A48',
                    color: '#F0F0F5'
                  }}
                  placeholder="At least 8 characters"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00F0FF';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 240, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#3A3A48';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#6A6A7A' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#A0A0B0'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#6A6A7A'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2 uppercase tracking-wide"
                style={{ color: '#A0A0B0' }}
              >
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-sm text-sm transition-all outline-none"
                style={{
                  backgroundColor: '#22222E',
                  border: '1px solid #3A3A48',
                  color: '#F0F0F5'
                }}
                placeholder="Confirm your password"
                onFocus={(e) => {
                  e.target.style.borderColor = '#00F0FF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 240, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3A3A48';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-md text-sm font-semibold uppercase tracking-wide transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#00F0FF',
                color: '#0A0A0F',
                border: 'none',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#00D4E0';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#00F0FF';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0F' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#00F0FF' }} />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
