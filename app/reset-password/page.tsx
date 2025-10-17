"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { ResetPasswordSchema, ResetPasswordType } from "@/lib/validation/auth";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const supabase = createClient();

  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ResetPasswordType) {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
        data: { password_reset_required: false },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // Refresh the session to ensure the updated metadata is available
      const { error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError) {
        console.error("Error refreshing session:", refreshError);
        toast.error(
          "Password updated but session refresh failed. Please log in again."
        );
        return;
      }

      toast.success(
        "Password updated successfully! Redirecting to dashboard..."
      );

      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl font-semibold">
            Reset Password
          </CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="reset-password-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="reset-password">
                      New Password
                    </FieldLabel>
                    <PasswordInput
                      {...field}
                      id="reset-password"
                      placeholder="Enter new password"
                      aria-invalid={fieldState.invalid}
                      autoComplete="new-password"
                      disabled={isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <PasswordInput
                      {...field}
                      id="confirm-password"
                      placeholder="Confirm new password"
                      aria-invalid={fieldState.invalid}
                      autoComplete="new-password"
                      disabled={isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="reset-password-form"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Updating Password..." : "Update Password"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
