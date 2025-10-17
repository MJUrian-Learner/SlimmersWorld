"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { RegisterSchema, RegisterType } from "@/lib/validation/auth";
import { createClient } from "@/lib/supabase/client";
import { getURL } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const supabase = createClient();

  const form = useForm<RegisterType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterType) {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
          emailRedirectTo: getURL(),
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success(
        "Registration successful! Please check your email to confirm your account."
      );
      router.push("/auth/login");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full bg-card border-border">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">
            Create Account
          </CardTitle>
        </div>
        <CardDescription>
          Create a new account to get started with SlimmersWorld
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="flex gap-4">
              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-first-name">
                      First Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="register-first-name"
                      type="text"
                      placeholder="John"
                      aria-invalid={fieldState.invalid}
                      autoComplete="given-name"
                      disabled={isLoading}
                    />
                  </Field>
                )}
              />
              <Controller
                name="lastName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-last-name">
                      Last Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="register-last-name"
                      type="text"
                      placeholder="Doe"
                      aria-invalid={fieldState.invalid}
                      autoComplete="family-name"
                      disabled={isLoading}
                    />
                  </Field>
                )}
              />
            </div>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="register-email"
                    type="email"
                    placeholder="m@example.com"
                    aria-invalid={fieldState.invalid}
                    autoComplete="email"
                    disabled={isLoading}
                  />
                  <FieldDescription>
                    We'll send you a confirmation email to verify your account.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-password">Password</FieldLabel>
                  <PasswordInput
                    {...field}
                    id="register-password"
                    placeholder="********"
                    aria-invalid={fieldState.invalid}
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                  <FieldDescription>
                    Password must be at least 6 characters with uppercase,
                    lowercase, and a number.
                  </FieldDescription>
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
                  <FieldLabel htmlFor="register-confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id="register-confirm-password"
                    placeholder="********"
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
      <CardFooter className="flex flex-col space-y-2">
        <Button asChild type="button" className="w-full" variant="outline">
          <Link href="/auth/login">Login</Link>
        </Button>
        <Button
          type="submit"
          form="register-form"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </CardFooter>
    </Card>
  );
}
