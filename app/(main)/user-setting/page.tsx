"use client";
import { TextButton } from "@/components/buttons";
import { Input } from "@/components/input";
import { Separate } from "@/components/separate";
import { Tab, TabContent } from "@/components/tab";
import {
  showDefaultToast,
  showErrorToast,
  showSuccessToast,
} from "@/components/toast";
import AddressService from "@/services/addressService";
import { useEffect, useState } from "react";

import { ChooseAvatarButton } from "@/components/UserSetting/choose_avatar_button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import UserService from "@/services/userService";
import { setProfile } from "@/redux/slices/profile";
import { User } from "@/models/User";
import { UserToUpdate } from "@/convertor/userConvertor";
import { LoadingIcon } from "@/components/icons";

export type UserSettingFormData = {
  name: string;
  phonenumber: string;
  houseNumber: string;
  street: string;
  district: string;
  province: string;
  email: string;
  password?: string | null;
};

const schema: ZodType<UserSettingFormData> = z.object({
  name: z.string().min(2, "Username must be at least 2 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .nullable(),
  email: z.string().email(),
  phonenumber: z.string().min(10, "Phone number must have 10 characters"),
  houseNumber: z.string().min(1, "House number is empty"),
  street: z.string().min(1, "Street is empty"),
  district: z.string().min(1, "District is empty"),
  province: z.string().min(1, "Province is empty"),
});

export default function UserSettingPage() {
  const dispatch = useAppDispatch();
  const [selectedTab, setSelectedTab] = useState("General");
  const [provincesData, setProvincesData] = useState<
    { province_id: number; province_name: string; province_type: string }[]
  >([]);
  const [provinceNameList, setProvinceNameList] = useState<string[]>([]);
  const [districtNameList, setDistrictNameList] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [chosenImage, setChosenImage] = useState<File | null>(null);
  const [chosenImageUrl, setChosenImageUrl] = useState<string | null>(null);

  const form = useForm<UserSettingFormData>({
    resolver: zodResolver(schema),
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;
  const thisUser = useAppSelector((state) => state.profile.value);

  const splitAddress = (address: string) => {
    const [houseNumber, street, district, province] = address.split(", ");
    return { houseNumber, street, district, province };
  };

  const setInitialValues = () => {
    if (!thisUser) return;
    setChosenImageUrl(thisUser.profileImage);
    form.setValue("name", thisUser.name);
    form.setValue("phonenumber", thisUser.phoneNumber);

    const address = thisUser.address;
    if (address) {
      const { houseNumber, street, district, province } = splitAddress(address);
      form.setValue("houseNumber", houseNumber);
      form.setValue("street", street);
      form.setValue("district", district);
      form.setValue("province", province);
    }

    form.setValue("email", thisUser.email);
  };

  const handleFormSubmit = async (data: UserSettingFormData) => {
    if (!thisUser) return;

    const dataForm: any = new FormData();
    const updatedProfile = UserToUpdate(
      thisUser,
      data,
      chosenImageUrl ? chosenImageUrl : ""
    );
    dataForm.append(
      "data",
      new Blob([JSON.stringify(updatedProfile)], {
        type: "application/json",
      })
    );
    dataForm.append("files", chosenImage);

    setIsSaving(true);
    // Update password
    if (data.password && data.password.length > 0) {
    }

    await UserService.updateProfile(dataForm)
      .then(() => {
        dispatch(setProfile(updatedProfile));
        showSuccessToast("Update profile successfully");
      })
      .catch((e) => showErrorToast(e.message))
      .finally(() => {
        setIsSaving(false);
      });
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
    setInitialValues();
  }, []);

  const handleImageChosen = (newFileUrl: File | null) => {
    console.log(newFileUrl);
    setChosenImage(newFileUrl);
    if (newFileUrl) setChosenImageUrl(URL.createObjectURL(newFileUrl));
    else setChosenImageUrl(null);
  };

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
    <form onSubmit={handleSubmit(handleFormSubmit)}>
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
              <div className="h-full flex flex-col items-center justify-between">
                <div className="w-full flex flex-col items-center gap-8 p-1 overflow-y-scroll">
                  <div className="w-full flex flex-col items-center gap-4">
                    <div className="w-full flex flex-col font-bold text-lg">
                      Your profile
                      <Separate classname="h-[1.5px]" />
                    </div>
                    <ChooseAvatarButton
                      fileUrl={chosenImageUrl}
                      onImageChanged={handleImageChosen}
                    />
                    <div className="w-full flex flex-row items-center gap-6">
                      <Input
                        id="username"
                        label="Name"
                        labelColor="text-secondaryWord"
                        className="text-secondaryWord"
                        errorMessages={errors.name ? errors.name.message : ""}
                        {...register("name")}
                      />
                      <Input
                        id="phonenumber"
                        label="Phonenumber"
                        labelColor="text-secondaryWord"
                        className="text-secondaryWord"
                        type="tel"
                        errorMessages={
                          errors.phonenumber ? errors.phonenumber.message : ""
                        }
                        {...register("phonenumber")}
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-col items-center gap-6">
                    <div className="w-full flex flex-col font-bold text-lg">
                      Your address
                      <Separate classname="h-[1.5px]" />
                    </div>
                    <div className="w-full flex flex-row gap-6">
                      <Input
                        id="house-number"
                        label="House number"
                        labelColor="text-secondaryWord"
                        className="text-secondaryWord"
                        errorMessages={
                          errors.houseNumber ? errors.houseNumber.message : ""
                        }
                        {...register("houseNumber")}
                      />
                      <Input
                        id="street"
                        label="Street"
                        labelColor="text-secondaryWord"
                        className="text-secondaryWord"
                        errorMessages={
                          errors.street ? errors.street.message : ""
                        }
                        {...register("street")}
                      />
                      <Dropdown placement="bottom-start" className="font-sans">
                        <DropdownTrigger>
                          <Input
                            id="district"
                            label="District"
                            labelColor="text-secondaryWord"
                            className="text-secondaryWord text-left cursor-pointer"
                            {...register("district")}
                            errorMessages={
                              errors.district ? errors.district.message : ""
                            }
                            onClick={() => {
                              if (districtNameList.length === 0) {
                                showDefaultToast(
                                  "Please select a province first"
                                );
                              }
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
                      <Dropdown placement="bottom-start" className="font-sans">
                        <DropdownTrigger>
                          <Input
                            id="province"
                            label="Province/City"
                            labelColor="text-secondaryWord"
                            className="text-secondaryWord text-left cursor-pointer"
                            errorMessages={
                              errors.province ? errors.province.message : ""
                            }
                            {...register("province")}
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
                        errorMessages={errors.email ? errors.email.message : ""}
                        {...register("email")}
                        disabled
                      />
                      <Input
                        id="password"
                        label="Change password"
                        labelColor="text-secondaryWord"
                        className="text-secondaryWord"
                        errorMessages={
                          errors.password ? errors.password.message : ""
                        }
                        type="password"
                        value={watch("password") ?? ""}
                        onChange={(e) => {
                          const password = e.target.value;
                          if (password === "") form.setValue("password", null);
                          else form.setValue("password", e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center self-end gap-2">
                  <TextButton
                    type="button"
                    content="Cancel"
                    className="w-[100px] self-end text-sm font-extrabold text-white bg-gray-400 hover:bg-gray-300/80 disabled:bg-gray-300/60"
                    onClick={() => {
                      handleImageChosen(null);
                    }}
                  />
                  <TextButton
                    type="submit"
                    content={isSaving ? "" : "Save"}
                    className="w-[100px] text-sm font-extrabold text-white bg-primary hover:bg-primary/80"
                    iconAfter={isSaving ? <LoadingIcon /> : null}
                    onClick={() => {
                      console.log("submit", errors);
                    }}
                  />
                </div>
              </div>
            }
          />
        </div>
      </div>
    </form>
  );
}
