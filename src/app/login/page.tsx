"use client";

import { useEffect, useState } from "react";
import { authRouter } from "../router/authRouter";
import { Toast } from "../components/toast";
import { ToastProvider, useToast } from "../components/toastComponent";
import { useRouter } from "next/navigation";
import ProfilePage from "../components/form/profile-form";
import Link from "next/link";

export default function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [submit, setSubmit] = useState<boolean>(false);
  const [login, setLogin] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmit(true);
  };

  const showToast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (submit) {
      const loginUser = async () => {
        try {
          const { message, success } = await authRouter.login({
            userName,
            password,
          });
          if (success) {
            setLogin(true);
            router.push(`/edit?email=${userName}`);
            showToast({ message: message, type: "success" });
          } else {
            showToast({ message: message, type: "error" });
          }
        } catch (error) {
          showToast({ message: "Login failed", type: "error" });
        } finally {
          setSubmit(false);
        }
      };

      loginUser();
    }
  }, [submit]);

  const handleLogout = () => {
    setLogin(false);
    showToast({ message: "Successfully logout", type: "info" });
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Welcome To Eazy 👋
          </h1>
          <form className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              onClick={handleLogin}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Don’t have an account?{" "}
            <Link href="/create" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
