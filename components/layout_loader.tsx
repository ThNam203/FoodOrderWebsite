"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setProfile } from "@/redux/slices/profile";
import UserService from "@/services/userService";
import { useEffect, useState } from "react";
import Preloader from "./preloader";
import { showErrorToast } from "./toast";
import { disablePreloader } from "@/redux/slices/preloader";

const LayoutLoader = ({ children }: { children: React.ReactNode }) => {
  const [searchedForUser, setSearchedForUser] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getGlobalData = async () => {
      const profile = await UserService.getProfile();
      dispatch(setProfile(profile.data));
    };

    getGlobalData()
      .catch((e) => {})
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
