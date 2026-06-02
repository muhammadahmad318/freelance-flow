/**
 * src/features/auth/pages/SignupPage.tsx
 *
 * Entry point for the authentication module's registration flow.
 * Wraps the SignupForm within the standardized AuthLayout.
 */
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { SignupForm } from "@/features/auth/components/SignupForm";

/**
 * Renders the registration page view.
 *
 * @returns {JSX.Element} The composed signup page.
 */
export default function SignupPage() {
  return (
    <AuthLayout
      title="Start your journey"
      subtitle="Join FreelanceFlow and manage your projects like a pro"
    >
      <SignupForm />
    </AuthLayout>
  );
}
