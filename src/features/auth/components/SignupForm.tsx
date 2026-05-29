/**
 * src/features/auth/components/SignupForm.tsx
 */
import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import { authService } from "@/features/auth/services/authService";
import { signupSchema, type SignupDTO } from "../validation/authSchema";

/**
 * SignupForm Component
 * Handles user registration logic with strict Zod validation.
 * Features real-time password strength tracking and dynamic floating labels.
 */
export function SignupForm() {
  // Global state solely tracks network responses, not field-level data
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize highly performant, uncontrolled form state
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupDTO>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Watch the password field specifically to feed our Strength Meter
  const passwordValue = watch("password");

  /**
   * Submits the validated DTO to the backend layer.
   */
  const onSubmit = async (data: SignupDTO) => {
    setGlobalError(null);
    try {
      await authService.signUp({
        email: data.email,
        password: data.password,
        name: data.name,
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setGlobalError(errorMessage);
    }
  };

  // Modernized Success State utilizing semantic and dynamic theme tokens
  if (isSuccess) {
    return (
      <div className="text-center space-y-4 animate-in fade-in duration-500">
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
          <p className="text-emerald-600 dark:text-emerald-500 font-medium">
            Verification email sent! Please check your inbox to activate your
            account.
          </p>
        </div>
        <Link
          to="/login"
          className="inline-block text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
        >
          Return to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Global Error Banner */}
      {globalError && (
        <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20 animate-in fade-in duration-300">
          <p className="text-sm text-destructive font-medium text-center">
            {globalError}
          </p>
        </div>
      )}

      {/* space-y-8 provides exact clearance for our absolute positioned floating error text */}
      <div className="space-y-8 pb-2">
        <Input
          id="name"
          type="text"
          label="Full Name"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          id="email"
          type="email"
          label="Email Address"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordStrengthMeter password={passwordValue} />

        <Input
          id="password"
          type="password"
          label="Password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>

      <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>
        Create Account
      </Button>

      <div className="pt-2 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:text-primary/80 font-bold underline-offset-4 hover:underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}
