"use client";

import { useEffect, useState } from "react";
import { authRouter } from "../../router/authRouter";
import { Toast } from "../../components/toast/toast";
import { ToastProvider, useToast } from "../../components/toast/toastComponent";
import { useRouter } from "next/navigation";
import ProfilePage from "../../components/form/profile-form";
import Link from "next/link";
import Button from "../../components/button/button";
import { userRouter } from "@/app/router/userRouter";

export default function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [submit, setSubmit] = useState<boolean>(false);
  const [login, setLogin] = useState<boolean>(false);
  const [loginPending, setLoginPending] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmit(true);
  };

  const showToast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (submit) {
      const log = async () => {
        setLoginPending(true);
        try {
          // const {message,success} = await authRouter.login({userName, password})
          const [result] = await Promise.all([
            authRouter.login({ userName, password }),
            new Promise((resolve) => setTimeout(resolve, 1500)), // wait 1.5s
          ]);
  
          const { message, success } = result;

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
          setLoginPending(false);
        }
      };

      log();
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
            <Button type="submit" typeStyle="primary" onClick={handleLogin} pending={loginPending}>
              Login
            </Button>
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
