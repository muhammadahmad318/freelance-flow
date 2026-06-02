/**
 * src/features/auth/pages/LoginPage.tsx
 *
 * Entry point for the authentication module's login flow.
 * Wraps the LoginForm within the standardized AuthLayout.
 */
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";

/**
 * Renders the login page view.
 *
 * @returns {JSX.Element} The composed login page.
 */
export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to access your workspace"
    >
      <LoginForm />
    </AuthLayout>
  );
}
