/**
 * src/features/auth/components/LoginForm.tsx
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
 * LoginForm Component
 * Handles user authentication, session initiation, and navigation.
 * Utilizes React Hook Form for performant, uncontrolled state management.
 */
export function LoginForm() {
  const navigate = useNavigate();

  // We only use standard state for the global network/API error now.
  // Field-level validation is handled entirely by React Hook Form.
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Initialize React Hook Form with our strictly typed Zod schema
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
   * Submits credentials to AuthService and redirects on success.
   * This is only triggered if the Zod schema passes validation.
   */
  const onSubmit = async (data: LoginDTO) => {
    setGlobalError(null);
    try {
      await authService.signIn(data);
      navigate("/dashboard");
    } catch (err: unknown) {
      // Senior practice: Strict type checking on unknown catch errors
      const errorMessage =
        err instanceof Error ? err.message : "Invalid email or password.";
      setGlobalError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Global API Error Banner */}
      {globalError && (
        <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20 animate-in fade-in duration-300">
          <p className="text-sm text-destructive font-medium text-center">
            {globalError}
          </p>
        </div>
      )}

      {/* 
        We use space-y-8 to account for the absolute positioned field errors 
        that render below the inputs, preventing overlapping text.
      */}
      <div className="space-y-8 pb-2">
        {/* Email Field */}
        <Input
          id="email"
          type="email"
          label="Email Address"
          autoComplete="username"
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Password Field Group */}
        <div className="space-y-2">
          <Input
            id="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
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

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Sign In
      </Button>

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
