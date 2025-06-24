"use client";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { storeData } from "@/utils/userGetServerAction";

// Type definitions
export interface SignInFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  id: string;
  email: string;
  username: string;
  message?: string;
}

interface User {
  id: string;
  email: string;
  username: string;
  loginTime: string;
}

export default function SignIn() {
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    try {
      const loggedInUser = localStorage.getItem("currentUser");
      if (loggedInUser) {
        const userData: User = JSON.parse(loggedInUser);
        // Validate user data structure
        if (userData.id && userData.email && userData.username) {
          setIsLoggedIn(true);
        } else {
          // Remove invalid user data
          localStorage.removeItem("currentUser");
        }
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("currentUser");
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): string | null => {
    if (!formData.email || !formData.password) {
      return "Email dan password harus diisi";
    }

    if (!validateEmail(formData.email)) {
      return "Format email tidak valid";
    }

    if (formData.password.length < 6) {
      return "Password minimal 6 karakter";
    }

    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    const toastId = toast.loading("Sedang masuk...");

    try {
      const response = await storeData(formData);

      if (response.ok) {
        const loginResult = response.data as LoginResponse;
        const userData: User = {
          id: loginResult.id,
          email: loginResult.email,
          username: loginResult.username,
          loginTime: new Date().toISOString(),
        };

        localStorage.setItem("currentUser", JSON.stringify(userData));
        document.cookie = `userRole=ADMIN; path=/`;
        setIsLoggedIn(true);
        toast.success("Berhasil masuk!", { id: toastId });

        // Redirect to admin dashboard
        router.push("/admin");
      } else {
        const errorMessage = response.message || "Email atau password salah";
        setError(errorMessage);
        toast.error(errorMessage, { id: toastId });
      }
    } catch (error) {
      const errorMessage = "Terjadi kesalahan saat login. Silakan coba lagi.";
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  // If user is logged in, redirect to dashboard
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/admin");
    }
  }, [isLoggedIn, router]);

  // Demo credentials data
  const demoCredentials = [
    {
      role: "Admin",
      email: "admin@example.com",
      password: "admin123",
    },
    {
      role: "User",
      email: "user@example.com",
      password: "user123",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
          <p className="text-gray-600">Masuk ke akun Anda</p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            Demo Credentials:
          </h3>
          <div className="text-sm text-blue-800 space-y-1">
            {demoCredentials.map((credential, index) => (
              <p key={index}>
                <strong>{credential.role}:</strong> {credential.email} /{" "}
                {credential.password}
              </p>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@example.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={isLoading}>
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Data tersimpan di Local Storage browser Anda</p>
        </div>
      </div>
    </div>
  );
}
