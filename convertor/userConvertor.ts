import { UserSettingFormData } from "@/app/(main)/user-setting/page";
import { User } from "@/models/User";

export const joinAddress = (
  houseNumber: string,
  street: string,
  district: string,
  province: string
) => {
  const address = `${houseNumber}, ${street}, ${district}, ${province}`;
  return address;
};

const UserToUpdate = (
  currentUser: User,
  data: UserSettingFormData,
  imageFile: string
) => {
  const address = joinAddress(
    data.houseNumber,
    data.street,
    data.district,
    data.province
  );
  const updatedProfile = {
    ...currentUser,
    name: data.name,
    email: data.email,
    phoneNumber: data.phonenumber,
    address: address,
    profileImage: imageFile,
    preferences: "Movie, music",
  };
  return updatedProfile;
};

export { UserToUpdate };
