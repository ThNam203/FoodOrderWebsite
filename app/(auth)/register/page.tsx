"use client";

import { TextButton } from "@/components/buttons";
import { Input } from "@/components/input";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  return (
    <div className="w-screen h-screen font-sans flex items-center justify-center bg-[#fff2e8] text-primaryWord">
      <div className="w-[730px] h-[530px] flex flex-col items-center justify-start rounded-md shadow-primaryShadow bg-white pt-12 px-12">
        <div className="font-bold text-lg text-center">
          Sign up your account
        </div>
        <div className="flex flex-col w-full gap-6 mt-4">
          <Input id="username" label="Username" placeholder="username" />
          <Input id="email" label="Email" placeholder="demo@example.com" />
          <Input id="password" label="Password" type="password" />
        </div>
        <TextButton content="Sign me up" className="mt-10 font-extrabold" />
        <span className="text-sm text-secondaryWord self-start mt-4">
          Already have an account
          <span
            onClick={() => router.push("login")}
            className="text-primary cursor-pointer"
          >
            {" "}
            Sign in
          </span>
        </span>
      </div>
    </div>
  );
}
