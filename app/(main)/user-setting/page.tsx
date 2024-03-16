"use client";
import { Tab, TabContent } from "@/components/tab";
import Image from "next/image";
import { useState } from "react";
import anime_girl from "@/public/images/anime_girl.jpg";
import { Input } from "@/components/input";
import { Separate } from "@/components/separate";
import { TextButton } from "@/components/buttons";

export default function UserSettingPage() {
  const [selectedTab, setSelectedTab] = useState("General");
  return (
    <div className="min-h-screen h-screen font-sans p-8 text-primaryWord bg-[#fff2e8]">
      <div className="w-full h-full p-6 flex flex-row gap-10 rounded-md bg-white shadow-primaryShadow">
        <div className="flex flex-col items-center justify-start gap-4">
          <Tab
            className="w-[200px]"
            content="General"
            setSelectedTab={setSelectedTab}
            selectedTab={selectedTab}
          />
          <Tab
            className="w-[200px]"
            content="Billing"
            setSelectedTab={setSelectedTab}
            selectedTab={selectedTab}
          />
          <Tab
            className="w-[200px]"
            content="Notification"
            setSelectedTab={setSelectedTab}
            selectedTab={selectedTab}
          />
        </div>
        <TabContent
          className="w-5/6"
          selectedTab={selectedTab}
          contentFor="General"
          content={
            <div className="h-full flex flex-col items-center gap-14 relative">
              <div className="w-full flex flex-col items-center gap-6">
                <div className="w-full flex flex-col font-bold text-lg">
                  Your profile
                  <Separate classname="h-[1.5px]" />
                </div>
                <Image
                  src={anime_girl}
                  width={400}
                  height={400}
                  alt="user avatar"
                  className="w-28 h-28 flex-shrink-0 rounded-full overflow-hidden cursor-pointer"
                />
                <div className="w-full flex flex-row items-center gap-6">
                  <Input
                    id="username"
                    label="Name"
                    defaultValue="Girl"
                    labelColor="text-secondaryWord"
                    className="text-secondaryWord"
                  />
                  <Input
                    id="phonenumber"
                    label="Phonenumber"
                    labelColor="text-secondaryWord"
                    className="text-secondaryWord"
                    type="tel"
                  />
                </div>
                <Input
                  id="address"
                  label="Address"
                  labelColor="text-secondaryWord"
                  className="text-secondaryWord"
                />
              </div>
              <div className="w-full flex flex-col items-center gap-6">
                <div className="w-full flex flex-col font-bold text-lg">
                  Your account
                  <Separate classname="h-[1.5px]" />
                </div>
                <div className="w-full flex flex-row items-center gap-6">
                  <Input
                    id="email"
                    label="Email"
                    value="demo@gmail.com"
                    labelColor="text-secondaryWord"
                    className="text-secondaryWord"
                  />
                  <Input
                    id="password"
                    label="Change password"
                    labelColor="text-secondaryWord"
                    className="text-secondaryWord"
                    type="password"
                  />
                </div>
              </div>
              <TextButton
                type="submit"
                content="Save"
                className="absolute bottom-0 w-[100px] self-end text-sm font-extrabold text-white bg-primary hover:bg-primary/80"
              />
            </div>
          }
        />
      </div>
    </div>
  );
}
