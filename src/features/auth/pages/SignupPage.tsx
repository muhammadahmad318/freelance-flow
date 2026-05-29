import React from "react";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { SignupForm } from "@/features/auth/components/SignupForm";

const SignupPage: React.FC = () => {
  return (
    <AuthLayout
      title="Start your journey"
      subtitle="Join FreelanceFlow and manage your projects like a pro"
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default SignupPage;
