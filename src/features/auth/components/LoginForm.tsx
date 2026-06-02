/**
 * src/features/auth/components/LoginForm.tsx
 *
 * Authenticates existing users and establishes sessions.
 * Integrates React Hook Form with Zod for strict data validation.
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authService } from "@/features/auth/services/authService";
import { loginSchema, type LoginDTO } from "../validation/authSchema";

/**
 * Renders the login interface and handles credential submission.
 *
 * @returns {JSX.Element} The login form component.
 */
export function LoginForm() {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * Submits validated credentials to the authentication service.
   * Redirects to the dashboard upon successful authentication.
   *
   * @param {LoginDTO} data - The validated user credentials.
   */
  const onSubmit = async (data: LoginDTO) => {
    setGlobalError(null);
    try {
      await authService.signIn(data);
      navigate("/dashboard");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Invalid email or password.";
      setGlobalError(errorMessage);
    }
  };

  return (
    /* Main Form Container */
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Global Error Banner */}
      {globalError && (
        <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20 animate-in fade-in duration-300">
          <p className="text-sm text-destructive font-medium text-center">
            {globalError}
          </p>
        </div>
      )}

      {/* Form Fields Wrapper */}
      <div className="space-y-8 pb-2">
        {/* Email Input Field */}
        <Input
          id="email"
          type="email"
          label="Email Address"
          autoComplete="username"
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Password Input Group */}
        <div className="space-y-2">
          <Input
            id="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />

          {/* Password Recovery Link */}
          <div className="flex justify-end pt-2">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>

      {/* Form Submit Action */}
      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Sign In
      </Button>

      {/* Registration Redirect Link */}
      <div className="pt-2 text-center">
        <p className="text-sm text-muted-foreground">
          New to FreelanceFlow?{" "}
          <Link
            to="/signup"
            className="text-primary hover:text-primary/80 font-bold underline-offset-4 hover:underline transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </form>
  );
}
