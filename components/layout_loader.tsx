"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setProfile } from "@/redux/slices/profile";
import UserService from "@/services/userService";
import { useEffect, useState } from "react";
import Preloader from "./preloader";
import { showErrorToast } from "./toast";
import { disablePreloader } from "@/redux/slices/preloader";
import { usePathname, useRouter } from "next/navigation";
import CartService from "@/services/cartService";
import { CartToReceive } from "@/convertor/cartConvertor";
import { setCartItems } from "@/redux/slices/cart";

const LayoutLoader = ({ children }: { children: React.ReactNode }) => {
  const [searchedForUser, setSearchedForUser] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathName = usePathname();
  useEffect(() => {
    const getGlobalData = async () => {
      await UserService.getProfile().then((res) => {
        dispatch(setProfile(res.data));
      });
      await CartService.GetCart().then((res) => {
        const convertedData = res.data.map((cart: any) => CartToReceive(cart));
        dispatch(setCartItems(convertedData));
      });
    };

    getGlobalData()
      .catch((e) => {
        showErrorToast(e);
        if (pathName !== "/register" && pathName !== "/login")
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
