"use client";

import { CartToReceive } from "@/convertor/cartConvertor";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCartItems } from "@/redux/slices/cart";
import { disablePreloader } from "@/redux/slices/preloader";
import { setProfile } from "@/redux/slices/profile";
import CartService from "@/services/cartService";
import UserService from "@/services/userService";
import { cn } from "@/utils/cn";
import { useEffect } from "react";
import { showErrorToast } from "./toast";
import Preloader from "./preloader";

const LayoutLoader = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const thisUser = useAppSelector((state) => state.profile.value);
  const preloaderVisibility = useAppSelector((state) => state.preloader.value);
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

    if (!thisUser)
      getGlobalData()
        .catch((e) => {
          showErrorToast(e);
        })
        .finally(() => {
          dispatch(disablePreloader());
        });
  }, [thisUser]);

  return (
    <>
      <Preloader
        className={cn(
          "ease-linear duration-100 z-[99999]",
          !preloaderVisibility ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      />
      {children}
    </>
  );
};

export default LayoutLoader;
