"use client";
import { TextButton } from "@/components/buttons";
import { Input } from "@/components/input";
import { Separate } from "@/components/separate";
import { Tab, TabContent } from "@/components/tab";
import { showErrorToast } from "@/components/toast";
import anime_girl from "@/public/images/anime_girl.jpg";
import AddressService from "@/services/addressService";
import Image from "next/image";
import { useEffect, useState } from "react";

import { showSuccessToast } from "@/components/toast";
import AuthService from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

export type UserSettingFormData = {
  name: string;
  phonenumber: string;
  houseNumber: string;
  street: string;
  district: string;
  province: string;
  email: string;
  password?: string;
  confirmPassword?: string;
};

const schema: ZodType<UserSettingFormData> = z
  .object({
    name: z.string().min(2, "Username must be at least 2 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
    confirmPassword: z.string().optional(),
    email: z.string().email(),
    phonenumber: z.string().min(10, "Phone number must have 10 characters"),
    houseNumber: z
      .string()
      .min(1, "House number must be at least 1 characters"),
    street: z.string().min(1, "Street must be at least 1 characters"),
    district: z.string(),
    province: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm Password do not match",
    path: ["confirmPassword"],
  });

export default function UserSettingPage() {
  const [selectedTab, setSelectedTab] = useState("General");
  const [provincesData, setProvincesData] = useState<
    { province_id: number; province_name: string; province_type: string }[]
  >([]);
  const [provinceNameList, setProvinceNameList] = useState<string[]>([]);
  const [districtNameList, setDistrictNameList] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);

  const form = useForm<UserSettingFormData>({
    resolver: zodResolver(schema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleFormSubmit = async (data: UserSettingFormData) => {
    // setIsSaving(true);
    // await AuthService.Register(data)
    //   .then((res) => {
    //     console.log(res);
    //     showSuccessToast("Sign Up Success");
    //   })
    //   .catch((err) => {
    //     showErrorToast(err.message);
    //   });
  };

  useEffect(() => {
    const fetchAllProvinces = async () => {
      await AddressService.getAllProvinces()
        .then((object) => {
          setProvincesData(object.data.results);
          setProvinceNameList(
            object.data.results.map((province: any) => province.province_name)
          );
        })
        .catch((error) => {
          showErrorToast(error.message);
        });
    };
    fetchAllProvinces();
  }, []);

  const handleProvinceChange = async (provinceName: string) => {
    form.setValue("province", provinceName);
    form.setValue("district", "");
    const province = provincesData.find(
      (province) => province.province_name === provinceName
    );
    if (province) {
      await AddressService.getDistrictsByProvinceId(province.province_id)
        .then((object) => {
          setDistrictNameList(
            object.data.results.map((district: any) => district.district_name)
          );
        })
        .catch((error) => {
          showErrorToast(error.message);
        });
    }
  };
  return (
    <div className="min-h-screen h-screen w-full font-sans p-8 text-primaryWord bg-[#fff2e8]">
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
                  className="w-24 h-24 flex-shrink-0 rounded-full overflow-hidden cursor-pointer"
                />
                <div className="w-full flex flex-row items-center gap-6">
                  <Input
                    id="username"
                    label="Name"
                    defaultValue="Girl"
                    labelColor="text-secondaryWord"
                    className="text-secondaryWord"
                    {...register("name")}
                  />
                  <Input
                    id="phonenumber"
                    label="Phonenumber"
                    labelColor="text-secondaryWord"
                    className="text-secondaryWord"
                    type="tel"
                    {...register("phonenumber")}
                  />
                </div>
              </div>
              <div className="w-full flex flex-col items-center gap-6">
                <div className="w-full flex flex-col font-bold text-lg">
                  Your address
                  <Separate classname="h-[1.5px]" />
                </div>
                <div className="w-full flex flex-row gap-2">
                  <Input
                    id="house-number"
                    label="House number"
                    labelColor="text-secondaryWord"
                    className="text-secondaryWord"
                    {...register("houseNumber")}
                  />
                  <Input
                    id="street"
                    label="Street"
                    labelColor="text-secondaryWord"
                    className="text-secondaryWord"
                    {...register("street")}
                  />
                  <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                      <Input
                        id="district"
                        label="District"
                        labelColor="text-secondaryWord"
                        className="text-secondaryWord text-left"
                        value={form.watch("district")}
                        onChange={(e) => {
                          form.setValue("district", e.target.value);
                        }}
                      />
                    </DropdownTrigger>
                    <DropdownMenu>
                      {districtNameList.map((districtName) => (
                        <DropdownItem
                          key={districtName}
                          onClick={() =>
                            form.setValue("district", districtName)
                          }
                        >
                          <div className="text-primaryWord bg-transparent">
                            {districtName}
                          </div>
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                  <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                      <Input
                        id="province"
                        label="Province/City"
                        labelColor="text-secondaryWord"
                        className="text-secondaryWord text-left"
                        value={form.watch("province")}
                        onChange={(e) => {
                          form.setValue("province", e.target.value);
                        }}
                      />
                    </DropdownTrigger>
                    <DropdownMenu className="max-h-[300px] !rounded-sm overflow-y-scroll">
                      {provinceNameList.map((provinceName) => (
                        <DropdownItem
                          key={provinceName}
                          onClick={() => handleProvinceChange(provinceName)}
                        >
                          <div className="text-primaryWord bg-transparent">
                            {provinceName}
                          </div>
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>
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
                    placeholder="demo@gmail.com"
                    labelColor="text-secondaryWord"
                    className="text-secondaryWord"
                    {...register("email")}
                  />
                  <Input
                    id="password"
                    label="Change password"
                    labelColor="text-secondaryWord"
                    className="text-secondaryWord"
                    type="password"
                    {...register("password")}
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
