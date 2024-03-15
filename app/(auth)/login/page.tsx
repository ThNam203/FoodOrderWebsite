"use client";

import { TextButton } from "@/components/buttons";
import { Input } from "@/components/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Background from "@/public/images/bg-login-page.jpg";
import { Separate } from "@/components/separate";

export default function LoginPage() {
  const router = useRouter();
  return (
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
            <Input id="email" label="Email" placeholder="demo@example.com" />
            <Input id="password" label="Password" type="password" />
          </div>
          <TextButton content="Sign Me In" className="mt-10 font-extrabold" />

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
  );
}
