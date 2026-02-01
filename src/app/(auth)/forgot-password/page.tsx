"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, CheckCircle, Zap } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send reset email");
        return;
      }

      setSuccess(true);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#F0F0F5' }}>Check your email</h1>
          <p className="mb-6" style={{ color: '#A0A0B0' }}>
            If an account exists for {email}, you&apos;ll receive a password reset link shortly.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 transition-colors"
            style={{ color: '#00F0FF' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
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
            <div
              className="w-12 h-12 rounded-md flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #00F0FF 0%, #8B5CF6 100%)',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)'
              }}
            >
              <Zap className="w-6 h-6" style={{ color: '#0A0A0F' }} />
            </div>
            <span className="text-2xl font-bold" style={{ color: '#F0F0F5' }}>Keystone</span>
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: '#F0F0F5' }}>Reset your password</h1>
          <p className="mt-2" style={{ color: '#A0A0B0' }}>
            Enter your email and we&apos;ll send you a reset link
          </p>
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
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-sm text-sm transition-all outline-none"
                style={{
                  backgroundColor: '#22222E',
                  border: '1px solid #3A3A48',
                  color: '#F0F0F5'
                }}
                placeholder="you@example.com"
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
              Send Reset Link
            </button>
          </form>
        </div>

        <p className="text-center mt-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 transition-colors"
            style={{ color: '#A0A0B0' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#F0F0F5'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#A0A0B0'}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
