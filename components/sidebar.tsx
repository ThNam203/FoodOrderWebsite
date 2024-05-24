"use client";

import style from "@/styles/sidebar.module.css";
import { ReactNode, use, useEffect, useState } from "react";
import {
  BrowseIcon,
  CartIcon,
  DashBoardIcon,
  FavouriteIcon,
  HistoryIcon,
  IntroIcon,
  LoadingIcon,
  LoginIcon,
  LogoutIcon,
  OrderIcon,
  SettingIcon,
} from "./icons";
import { getCookie, getCookies, setCookie } from "cookies-next";
import { cn } from "@/utils/cn";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ClassValue } from "clsx";
import Link from "next/link";
import { cookies } from "next/headers";
import { usePathname } from "next/navigation";
import AuthService from "@/services/authService";
import { showErrorToast, showSuccessToast } from "./toast";
import { Home, LayoutList } from "lucide-react";
import { Tooltip } from "@nextui-org/react";
import CartService from "@/services/cartService";
import { CartToReceive } from "@/convertor/cartConvertor";
import { setCartItems } from "@/redux/slices/cart";

const CustomLink = ({
  className,
  href = "#",
  icon,
  content,
  selectedLink,
  onClick,
  isSidebarOpen,
  notification,
}: {
  className?: ClassValue;
  href?: string;
  content: string;
  selectedLink: string;
  icon?: ReactNode;
  onClick?: () => void;
  isSidebarOpen: boolean;
  notification?: number;
}) => {
  return (
    <div>
      {isSidebarOpen ? (
        <Link
          href={href}
          className={cn(
            style["nav__link"],
            selectedLink === href ? style["active"] : "",
            className
          )}
          onClick={onClick}
        >
          <div className="relative">
            <div
              className={cn(
                "absolute -right-2 -top-1 w-4 h-4 rounded-full shrink-0 text-xs bg-red-600 text-white flex items-center justify-center",
                notification ? "" : "hidden"
              )}
            >
              {notification && notification > 0 && notification}
            </div>
            {icon}
          </div>
          <span className={style["nav__name"]}>{content}</span>
        </Link>
      ) : (
        <Tooltip
          content={<span className="px-2">{content}</span>}
          closeDelay={0}
          placement="right"
          className={cn(
            "text-white font-sans px-1 border-0 rounded-[999px]",
            content === "Log out" ? "bg-red-400" : "bg-blue-500"
          )}
        >
          <Link
            href={href}
            className={cn(
              style["nav__link"],
              selectedLink === href ? style["active"] : "",
              className
            )}
            onClick={onClick}
          >
            <div className="relative">
              <div
                className={cn(
                  "absolute -right-2 -top-1 w-4 h-4 rounded-full shrink-0 text-xs bg-red-600 text-white flex items-center justify-center",
                  notification ? "" : "hidden"
                )}
              >
                {notification && notification > 0 && notification}
              </div>
              {icon}
            </div>
            <span className={style["nav__name"]}>{content}</span>
          </Link>
        </Tooltip>
      )}
    </div>
  );
};

export default function Sidebar({
  onSidebarToggle,
  isSidebarOpen,
}: {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
}) {
  const isLogin = useAppSelector((state) => state.profile.isLogin);
  const cart = useAppSelector((state) => state.cart.cartItems);
  const selectedLink = usePathname();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await AuthService.logOut()
      .then(() => {
        showSuccessToast("Logout successfully");
      })
      .catch((err) => showErrorToast(err.message))
      .finally(() => {
        setIsLoggingOut(false);
      });
  };

  return (
    <div
      className={cn(
        style["l-navbar"],
        isSidebarOpen ? style.expander : "",
        "max-sm:w-[92px] z-40"
      )}
      id="navbar"
    >
      <nav className={style.nav}>
        <div>
          <div className={style["nav__brand"]}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="3rem"
              height="3rem"
              viewBox="0 0 24 24"
              className={cn(style["nav__toggle"], "max-sm:hidden")}
              id="nav-toggle"
              onClick={() => {
                onSidebarToggle();
              }}
            >
              <path
                fill="white"
                d="M4 17.27v-1h16v1zm0-4.77v-1h16v1zm0-4.77v-1h16v1z"
              />
            </svg>
            <a href="/" className={cn(style["nav__logo"], "max-sm:hidden")}>
              FFOOD
            </a>
          </div>
          <div className={style["nav__list"]}>
            <CustomLink
              href="/"
              content=""
              icon={<Home size={20} />}
              selectedLink={usePathname()}
              className="sm:hidden"
              isSidebarOpen={isSidebarOpen}
            />
            <CustomLink
              href="/dashboard"
              content="Dashboard"
              icon={<DashBoardIcon />}
              selectedLink={usePathname()}
              isSidebarOpen={isSidebarOpen}
            />
            {/* <a href="/" className={twMerge(style["nav__link"])}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11.235 2.374c-.368.152-.697.482-1.356 1.14c-.659.66-.989.989-1.14 1.356a2 2 0 0 0 0 1.531c.151.368.48.697 1.14 1.356c.658.659.988.989 1.356 1.14a2 2 0 0 0 1.53 0c.368-.151.697-.48 1.356-1.14c.66-.659.988-.988 1.14-1.356a2 2 0 0 0 0-1.53c-.152-.368-.48-.697-1.14-1.356c-.659-.66-.988-.989-1.356-1.141a2 2 0 0 0-1.53 0M4.87 8.738c-.367.152-.697.481-1.355 1.14c-.66.66-.989.989-1.141 1.356a2 2 0 0 0 0 1.531c.152.368.482.697 1.14 1.356c.66.659.989.988 1.356 1.14a2 2 0 0 0 1.531 0c.368-.152.697-.481 1.356-1.14c.66-.659.988-.988 1.14-1.356a2 2 0 0 0 0-1.53c-.152-.368-.48-.698-1.14-1.357c-.659-.659-.988-.988-1.356-1.14a2 2 0 0 0-1.53 0m11.372 1.14c-.659.66-.988.989-1.14 1.356a2 2 0 0 0 0 1.531c.152.368.481.697 1.14 1.356c.659.659.989.988 1.356 1.14a2 2 0 0 0 1.53 0c.368-.152.698-.481 1.357-1.14c.659-.659.987-.988 1.14-1.356a2 2 0 0 0 0-1.53c-.153-.368-.481-.698-1.14-1.357c-.66-.659-.989-.988-1.356-1.14a2 2 0 0 0-1.531 0c-.367.152-.697.481-1.356 1.14m-5.008 5.224c-.368.152-.697.482-1.356 1.14c-.659.66-.989.989-1.14 1.357a2 2 0 0 0 0 1.53c.151.368.48.697 1.14 1.356c.658.659.988.989 1.356 1.14a2 2 0 0 0 1.53 0c.368-.151.697-.48 1.356-1.14c.66-.659.988-.988 1.14-1.356c.203-.49.203-1.04 0-1.53c-.152-.368-.48-.698-1.14-1.356c-.659-.66-.988-.989-1.356-1.141a2 2 0 0 0-1.53 0"
                />
              </svg>
              <span className={style["nav__name"]}>Intro</span>
            </a> */}
            <CustomLink
              href="/inventory/menu"
              content="Inventory"
              icon={<LayoutList strokeWidth={1} />}
              selectedLink={usePathname()}
              isSidebarOpen={isSidebarOpen}
            />

            <CustomLink
              href="/cart"
              content="Your cart"
              icon={<CartIcon />}
              selectedLink={selectedLink}
              isSidebarOpen={isSidebarOpen}
              notification={cart.length}
            />

            <CustomLink
              href="/favourite"
              content="Favourites"
              icon={<FavouriteIcon />}
              selectedLink={selectedLink}
              isSidebarOpen={isSidebarOpen}
            />
            <CustomLink
              href="/order-management"
              content="Orders"
              icon={<OrderIcon />}
              selectedLink={selectedLink}
              isSidebarOpen={isSidebarOpen}
            />
            <CustomLink
              href="/history"
              content="History"
              icon={<HistoryIcon />}
              selectedLink={selectedLink}
              isSidebarOpen={isSidebarOpen}
            />
          </div>
        </div>

        {isLogin && (
          <div className={style["nav__list"]}>
            <CustomLink
              href="/user-setting"
              content="User setting"
              icon={<SettingIcon />}
              selectedLink={selectedLink}
              isSidebarOpen={isSidebarOpen}
            />
            <CustomLink
              content="Log out"
              href="/login"
              icon={isLoggingOut ? <LoadingIcon /> : <LogoutIcon />}
              selectedLink={selectedLink}
              className={cn("hover:bg-red-400")}
              onClick={handleLogout}
              isSidebarOpen={isSidebarOpen}
            />
          </div>
        )}
        {!isLogin && (
          <div className={style["nav__list"]}>
            <CustomLink
              href="/login"
              content="Login"
              icon={<LoginIcon />}
              selectedLink={selectedLink}
              isSidebarOpen={isSidebarOpen}
            />
          </div>
        )}
      </nav>
    </div>
  );
}
