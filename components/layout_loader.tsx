"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setProfile } from "@/redux/slices/profile";
import UserService from "@/services/userService";
import { useEffect, useState } from "react";
import Preloader from "./preloader";
import { showErrorToast } from "./toast";
import { disablePreloader } from "@/redux/slices/preloader";
import { useRouter } from "next/navigation";

const LayoutLoader = ({ children }: { children: React.ReactNode }) => {
  const [searchedForUser, setSearchedForUser] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    const getGlobalData = async () => {
      await UserService.getProfile().then((res) => {
        dispatch(setProfile(res.data));
      });
    };

    getGlobalData()
      .catch((e) => {
        showErrorToast(e);
        router.push("/login");
      })
      .finally(() => {
        {
          setSearchedForUser(true);
          dispatch(disablePreloader());
        }
      });
  }, []);

  if (!searchedForUser) return <GlobalPreloader />;
  return (
    <>
      <GlobalPreloader />
      {children}
    </>
  );
};

const GlobalPreloader = () => {
  const preloaderVisibility = useAppSelector((state) => state.preloader.value);
  return preloaderVisibility ? <Preloader /> : null;
};

export default LayoutLoader;
