"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Plus,
  Trash2,
  Key,
  Users,
  Shield,
  ShieldCheck,
  Copy,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "SUPER_ADMIN";
  createdAt: string;
  _count: {
    habits: number;
    weeks: number;
  };
  stats: {
    totalXp: number;
    level: number;
  } | null;
}

interface UsersResponse {
  users: User[];
}

function AddUserModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (password: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"USER" | "SUPER_ADMIN">("USER");
  const [error, setError] = useState("");

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, role, generatePassword: true }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create user");
      }
      return res.json();
    },
    onSuccess: (data) => {
      onSuccess(data.generatedPassword);
      setEmail("");
      setName("");
      setRole("USER");
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    createMutation.mutate();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0A0A0F]/90 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md rounded-lg shadow-2xl"
        style={{ backgroundColor: "#12121A", border: "1px solid #2A2A38" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
          style={{ background: "linear-gradient(135deg, #00F0FF 0%, #8B5CF6 100%)" }}
        />
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: "#F0F0F5" }}>
              Add New User
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md transition-colors hover:bg-[#2A2A38]"
              style={{ color: "#6A6A7A" }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="p-3 rounded-md text-sm"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#EF4444",
                }}
              >
                {error}
              </div>
            )}

            <div>
              <label
                className="block text-sm font-semibold mb-2 uppercase tracking-wide"
                style={{ color: "#A0A0B0" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-sm text-sm outline-none"
                style={{
                  backgroundColor: "#22222E",
                  border: "1px solid #3A3A48",
                  color: "#F0F0F5",
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2 uppercase tracking-wide"
                style={{ color: "#A0A0B0" }}
              >
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-sm text-sm outline-none"
                style={{
                  backgroundColor: "#22222E",
                  border: "1px solid #3A3A48",
                  color: "#F0F0F5",
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2 uppercase tracking-wide"
                style={{ color: "#A0A0B0" }}
              >
                Role
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRole("USER")}
                  className="flex-1 py-2.5 rounded-md text-sm font-semibold uppercase tracking-wide transition-all"
                  style={{
                    backgroundColor: role === "USER" ? "rgba(0, 240, 255, 0.2)" : "#22222E",
                    color: role === "USER" ? "#00F0FF" : "#6A6A7A",
                    border: `1px solid ${role === "USER" ? "rgba(0, 240, 255, 0.5)" : "#2A2A38"}`,
                  }}
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setRole("SUPER_ADMIN")}
                  className="flex-1 py-2.5 rounded-md text-sm font-semibold uppercase tracking-wide transition-all"
                  style={{
                    backgroundColor: role === "SUPER_ADMIN" ? "rgba(139, 92, 246, 0.2)" : "#22222E",
                    color: role === "SUPER_ADMIN" ? "#8B5CF6" : "#6A6A7A",
                    border: `1px solid ${role === "SUPER_ADMIN" ? "rgba(139, 92, 246, 0.5)" : "#2A2A38"}`,
                  }}
                >
                  <ShieldCheck className="w-4 h-4 inline mr-2" />
                  Super Admin
                </button>
              </div>
            </div>

            <p className="text-xs" style={{ color: "#6A6A7A" }}>
              A secure password will be automatically generated for this user.
            </p>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-md text-sm font-semibold uppercase tracking-wide transition-all"
                style={{
                  backgroundColor: "transparent",
                  color: "#F0F0F5",
                  border: "1px solid #3A3A48",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 py-3 rounded-md text-sm font-semibold uppercase tracking-wide transition-all disabled:opacity-50"
                style={{
                  backgroundColor: "#00F0FF",
                  color: "#0A0A0F",
                }}
              >
                {createMutation.isPending ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function PasswordModal({
  isOpen,
  onClose,
  password,
  email,
}: {
  isOpen: boolean;
  onClose: () => void;
  password: string;
  email?: string;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0A0A0F]/90 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md rounded-lg shadow-2xl"
        style={{ backgroundColor: "#12121A", border: "1px solid #2A2A38" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
          style={{ background: "linear-gradient(135deg, #10B981 0%, #00F0FF 100%)" }}
        />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(16, 185, 129, 0.2)" }}
            >
              <Key className="w-6 h-6" style={{ color: "#10B981" }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "#F0F0F5" }}>
                {email ? "Password Reset" : "User Created"}
              </h2>
              <p className="text-sm" style={{ color: "#A0A0B0" }}>
                {email ? `New password for ${email}` : "Share this password with the user"}
              </p>
            </div>
          </div>

          <div
            className="p-4 rounded-md flex items-center justify-between mb-4"
            style={{ backgroundColor: "#22222E", border: "1px solid #3A3A48" }}
          >
            <code className="font-mono text-lg" style={{ color: "#00F0FF" }}>
              {password}
            </code>
            <button
              onClick={handleCopy}
              className="p-2 rounded-md transition-all"
              style={{
                backgroundColor: copied ? "rgba(16, 185, 129, 0.2)" : "transparent",
                color: copied ? "#10B981" : "#A0A0B0",
              }}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <p className="text-xs mb-4" style={{ color: "#FBBF24" }}>
            This password will only be shown once. Make sure to save or share it securely.
          </p>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-md text-sm font-semibold uppercase tracking-wide transition-all"
            style={{ backgroundColor: "#00F0FF", color: "#0A0A0F" }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordEmail, setPasswordEmail] = useState<string | undefined>();

  const { data, isLoading } = useQuery<UsersResponse>({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Forbidden");
        }
        throw new Error("Failed to fetch users");
      }
      return res.json();
    },
    enabled: status === "authenticated",
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetPassword: true }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to reset password");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setGeneratedPassword(data.generatedPassword);
      setPasswordEmail(data.user.email);
      setShowPasswordModal(true);
    },
  });

  // Redirect if not super admin
  if (status === "authenticated" && session?.user?.role !== "SUPER_ADMIN") {
    router.push("/dashboard");
    return null;
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: "#00F0FF" }} />
          <p style={{ color: "#6A6A7A" }}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8" style={{ color: "#8B5CF6" }} />
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#F0F0F5" }}>
              User Management
            </h1>
            <p className="mt-1" style={{ color: "#A0A0B0" }}>
              {data?.users.length || 0} registered users
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold uppercase tracking-wide transition-all"
          style={{ backgroundColor: "#00F0FF", color: "#0A0A0F" }}
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid #2A2A38" }}>
              <th
                className="text-left py-4 px-4 text-xs font-semibold uppercase tracking-wide"
                style={{ color: "#6A6A7A" }}
              >
                User
              </th>
              <th
                className="text-left py-4 px-4 text-xs font-semibold uppercase tracking-wide"
                style={{ color: "#6A6A7A" }}
              >
                Role
              </th>
              <th
                className="text-left py-4 px-4 text-xs font-semibold uppercase tracking-wide"
                style={{ color: "#6A6A7A" }}
              >
                Stats
              </th>
              <th
                className="text-left py-4 px-4 text-xs font-semibold uppercase tracking-wide"
                style={{ color: "#6A6A7A" }}
              >
                Joined
              </th>
              <th
                className="text-right py-4 px-4 text-xs font-semibold uppercase tracking-wide"
                style={{ color: "#6A6A7A" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.users.map((user) => (
              <tr
                key={user.id}
                className="group"
                style={{ borderBottom: "1px solid #2A2A38" }}
              >
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium" style={{ color: "#F0F0F5" }}>
                      {user.name || "Unnamed"}
                    </p>
                    <p className="text-sm" style={{ color: "#6A6A7A" }}>
                      {user.email}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold uppercase"
                    )}
                    style={{
                      backgroundColor:
                        user.role === "SUPER_ADMIN"
                          ? "rgba(139, 92, 246, 0.2)"
                          : "rgba(0, 240, 255, 0.1)",
                      color: user.role === "SUPER_ADMIN" ? "#8B5CF6" : "#00F0FF",
                    }}
                  >
                    {user.role === "SUPER_ADMIN" ? (
                      <ShieldCheck className="w-3 h-3" />
                    ) : (
                      <Users className="w-3 h-3" />
                    )}
                    {user.role === "SUPER_ADMIN" ? "Admin" : "User"}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm">
                    <p style={{ color: "#A0A0B0" }}>
                      Level {user.stats?.level || 1} &bull;{" "}
                      {user.stats?.totalXp?.toLocaleString() || 0} XP
                    </p>
                    <p style={{ color: "#6A6A7A" }}>
                      {user._count.habits} habits &bull; {user._count.weeks} weeks
                    </p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm" style={{ color: "#A0A0B0" }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        if (confirm(`Reset password for ${user.email}?`)) {
                          resetPasswordMutation.mutate(user.id);
                        }
                      }}
                      disabled={resetPasswordMutation.isPending}
                      className="p-2 rounded-md transition-colors"
                      style={{ color: "#FBBF24" }}
                      title="Reset Password"
                    >
                      <Key className="w-4 h-4" />
                    </button>
                    {user.id !== session?.user?.id && (
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              `Delete user ${user.email}? This cannot be undone.`
                            )
                          ) {
                            deleteMutation.mutate(user.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="p-2 rounded-md transition-colors"
                        style={{ color: "#EF4444" }}
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={(password) => {
          setShowAddModal(false);
          setGeneratedPassword(password);
          setPasswordEmail(undefined);
          setShowPasswordModal(true);
          queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
        }}
      />

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        password={generatedPassword}
        email={passwordEmail}
      />
    </div>
  );
}
