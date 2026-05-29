import React from "react";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";

/**
 * LoginPage entry point for the Auth module.
 */
const LoginPage: React.FC = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to access your workspace"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
