"use client";

import { TextButton } from "@/components/buttons";
import { LoadingIcon } from "@/components/icons";
import { Input } from "@/components/input";
import { showErrorToast, showSuccessToast } from "@/components/toast";
import AuthService from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ZodType, z } from "zod";
export type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const registerSchema: ZodType<RegisterFormData> = z
  .object({
    username: z.string().min(2, "Username must be at least 2 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    email: z.string().email(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm Password do not match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const router = useRouter();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleFormSubmit = async (data: RegisterFormData) => {
    setIsSigningUp(true);
    await AuthService.register(data)
      .then((res) => {
        console.log(res);
        showSuccessToast("Sign Up Success");
        router.push("/");
      })
      .catch((err) => {
        showErrorToast(err.message);
      })
      .finally(() => {
        setIsSigningUp(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="w-screen h-screen font-sans flex items-center justify-center bg-[#fff2e8] text-primaryWord">
        <div className="w-[730px] flex flex-col items-center justify-start rounded-md shadow-primaryShadow bg-white py-12 px-12">
          <div className="font-bold text-lg text-center">
            Sign up your account
          </div>
          <div className="flex flex-col w-full gap-6 mt-4">
            <Input
              id="username"
              label="Username"
              placeholder="username"
              errorMessages={errors.username ? errors.username.message : ""}
              {...register("username")}
            />
            <Input
              id="email"
              label="Email"
              placeholder="demo@example.com"
              errorMessages={errors.email ? errors.email.message : ""}
              {...register("email")}
            />
            <Input
              id="password"
              label="Password"
              type="password"
              errorMessages={errors.password ? errors.password.message : ""}
              {...register("password")}
            />
            <Input
              id="confirm-password"
              label="Confirm Password"
              type="password"
              errorMessages={
                errors.confirmPassword ? errors.confirmPassword.message : ""
              }
              {...register("confirmPassword")}
            />
          </div>
          <TextButton
            type="submit"
            iconBefore={isSigningUp ? <LoadingIcon /> : null}
            content={isSigningUp ? "" : "Sign Up"}
            className="mt-10 text-sm font-extrabold text-white bg-primary hover:bg-primary/80"
            disabled={isSigningUp}
          />

          <span className="text-sm text-secondaryWord self-start mt-4">
            Already have an account
            <span
              onClick={() => router.push("/login")}
              className="text-primary cursor-pointer"
            >
              {" "}
              Sign in
            </span>
          </span>
        </div>
      </div>
    </form>
  );
}
