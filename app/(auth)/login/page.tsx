"use client";

import { TextButton } from "@/components/buttons";
import { Input } from "@/components/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Background from "@/public/images/bg-login-page.jpg";
import { Separate } from "@/components/separate";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import { useDispatch } from "react-redux";
import { setCookie } from "cookies-next";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthService from "@/services/authService";
import { showErrorToast, showSuccessToast } from "@/components/toast";
import { LoadingIcon } from "@/components/icons";
export type LoginFormData = {
  email: string;
  password: string;
};

const loginSchema: ZodType<LoginFormData> = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleFormSubmit = async (data: LoginFormData) => {
    setIsLoggingIn(true);
    await AuthService.Login(data)
      .then((res) => {
        const token = res.data.token;
        setCookie("token", token);
        showSuccessToast("Login Successfully");
        router.push("/");
      })
      .catch((err) => {
        showErrorToast("Login Failed");
        console.log(err);
      })
      .finally(() => {
        setIsLoggingIn(false);
      });
  };
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="w-screen h-screen font-sans bg-transparent flex flex-row items-center justify-center text-primaryWord">
        <div className="w-11/12 flex flex-row items-center justify-center gap-10">
          <Image
            width={940}
            height={560}
            src={Background}
            alt="hamburger"
            className="w-[940px] h-[560px] rounded-md"
          />
          <div className="w-1/3 h-[560px] flex flex-col items-center justify-start pt-8 gap-4">
            <div className="font-extrabold text-xl text-center">
              Create an Account
            </div>
            <div className="w-2/3 flex flex-row items-center justify-between gap-4">
              <Separate classname="h-[2px]" />
              <span className="text-nowrap text-sm text-secondaryWord">
                Sign Up
              </span>
              <Separate classname="h-[2px]" />
            </div>
            <div className="flex flex-col w-full gap-6 mt-4">
              <Input
                id="email"
                label="Email"
                errorMessages={errors.email ? errors.email.message : ""}
                placeholder="demo@example.com"
                {...register("email")}
              />
              <Input
                id="password"
                label="Password"
                type="password"
                errorMessages={errors.password ? errors.password.message : ""}
                {...register("password")}
              />
            </div>
            <TextButton
              type="submit"
              iconBefore={isLoggingIn ? <LoadingIcon /> : null}
              content={isLoggingIn ? "" : "Sign Me In"}
              disabled={isLoggingIn}
              className="mt-6 text-sm font-extrabold text-white bg-primary hover:bg-primary/90"
            />

            <span className="text-sm text-secondaryWord">
              Don&#39;t have an account
              <span
                onClick={() => router.push("/register")}
                className="text-primary cursor-pointer"
              >
                {" "}
                Sign up
              </span>
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}
