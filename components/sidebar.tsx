"use client";

import Logo from "@/public/images/logo.png";
import { useAppSelector } from "@/redux/hooks";
import AuthService from "@/services/authService";
import style from "@/styles/sidebar.module.css";
import { cn } from "@/utils/cn";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@nextui-org/react";
import { ClassValue } from "clsx";
import { Home, LayoutDashboard, LayoutList } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import {
  CartIcon,
  FavouriteIcon,
  HistoryIcon,
  LoadingIcon,
  LoginIcon,
  LogoutIcon,
  OrderIcon,
  SettingIcon,
} from "./icons";
import { showErrorToast, showSuccessToast } from "./toast";
import default_user_image from "@/public/images/default_user.png";
import { Separate } from "./separate";

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
  const router = useRouter();
  const isLogin = useAppSelector((state) => state.profile.isLogin);
  const thisUser = useAppSelector((state) => state.profile.value);
  const cart = useAppSelector((state) => state.cart.cartItems);
  const selectedLink = usePathname();
  const [showPopover, setShowPopover] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await AuthService.logOut()
      .then(() => {
        showSuccessToast("Logout successfully");
        router.push("/login");
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
          {thisUser && thisUser.isAdmin === true ? (
            <div className={cn(style["nav__brand"], "select-none pl-1")}>
              <Image src={Logo} alt="logo" width={40} height={40} />
              <span
                className={cn(style["nav__logo"], "text-nowrap max-sm:hidden")}
              >
                Fresh Mart
              </span>
            </div>
          ) : (
            <a href="/" className={cn(style["nav__brand"], "cursor-pointer")}>
              <Image src={Logo} alt="logo" width={40} height={40} />
              <span
                className={cn(style["nav__logo"], "text-nowrap max-sm:hidden")}
              >
                Fresh Mart
              </span>
            </a>
          )}

          <div className={style["nav__list"]}>
            <CustomLink
              href="/"
              content=""
              icon={<Home size={20} />}
              selectedLink={usePathname()}
              isSidebarOpen={isSidebarOpen}
              className={cn(
                "sm:hidden",
                thisUser && thisUser.isAdmin === false ? "" : "hidden"
              )}
            />
            <CustomLink
              href="/dashboard"
              content="Dashboard"
              icon={<LayoutDashboard />}
              selectedLink={usePathname()}
              isSidebarOpen={isSidebarOpen}
              className={cn(
                thisUser && thisUser.isAdmin === true ? "" : "hidden"
              )}
            />
            <CustomLink
              href="/inventory/menu"
              content="Inventory"
              icon={<LayoutList />}
              selectedLink={usePathname()}
              isSidebarOpen={isSidebarOpen}
              className={cn(
                thisUser && thisUser.isAdmin === true ? "" : "hidden"
              )}
            />

            <CustomLink
              href="/cart"
              content="Your cart"
              icon={<CartIcon />}
              selectedLink={selectedLink}
              isSidebarOpen={isSidebarOpen}
              notification={cart.length}
              className={cn(
                thisUser && thisUser.isAdmin === false ? "" : "hidden"
              )}
            />

            <CustomLink
              href="/favourite"
              content="Favourites"
              icon={<FavouriteIcon />}
              selectedLink={selectedLink}
              isSidebarOpen={isSidebarOpen}
              className={cn(
                thisUser && thisUser.isAdmin === false ? "" : "hidden"
              )}
            />
            <CustomLink
              href="/order-management"
              content="Orders"
              icon={<OrderIcon />}
              selectedLink={selectedLink}
              isSidebarOpen={isSidebarOpen}
              className={cn(
                thisUser && thisUser.isAdmin === true ? "" : "hidden"
              )}
            />
            <CustomLink
              href="/history"
              content="History"
              icon={<HistoryIcon />}
              selectedLink={selectedLink}
              isSidebarOpen={isSidebarOpen}
              className={cn(
                thisUser && thisUser.isAdmin === false ? "" : "hidden"
              )}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Popover
            isOpen={showPopover}
            onOpenChange={setShowPopover}
            placement="right-end"
          >
            <PopoverTrigger>
              <div className="flex flex-row gap-2 items-center hover:bg-white/10 rounded-lg py-3 pl-2 cursor-pointer shrink-0">
                <Image
                  width={400}
                  height={400}
                  src={
                    thisUser && thisUser.profileImage
                      ? thisUser.profileImage
                      : default_user_image
                  }
                  alt="image"
                  className="w-[30px] h-[30px] flex-shrink-0 rounded-full object-cover overflow-hidden cursor-pointer select-none"
                />
                <span className="font-semibold">
                  {thisUser ? thisUser.name : ""}
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="font-sans text-primaryWord select-none">
              <div className="w-[200px] py-2 rounded-md flex flex-col">
                <div className="flex flex-row gap-2 items-center">
                  <Image
                    width={400}
                    height={400}
                    sizes="100vw"
                    src={
                      thisUser && thisUser.profileImage
                        ? thisUser.profileImage
                        : default_user_image
                    }
                    alt="image"
                    className="w-[50px] h-[50px] flex-shrink-0 rounded-full object-cover overflow-hidden"
                  />
                  <span className="font-semibold">
                    {thisUser ? thisUser.name : ""}
                  </span>
                </div>

                <Separate classname="my-2" />
                <div
                  className="flex flex-row gap-2 items-center cursor-pointer hover:bg-gray-100 rounded-lg p-2"
                  onClick={() => {
                    router.push("/user-setting");
                    setShowPopover(false);
                  }}
                >
                  <SettingIcon />
                  <span>Setting</span>
                </div>

                <Separate classname="my-2" />
                <div
                  className="flex flex-row gap-2 items-center text-red-500 cursor-pointer hover:bg-gray-100 rounded-lg p-2"
                  onClick={() => {
                    handleLogout();
                    setShowPopover(false);
                  }}
                >
                  <LogoutIcon />
                  <span>Log Out</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Tooltip
            content={
              <span className="px-2">
                {isSidebarOpen ? "Minimize the navbar" : "Expand the navbar"}
              </span>
            }
            closeDelay={0}
            placement="right"
            className={cn(
              "text-white font-sans px-1 border-0 rounded-[999px] bg-blue-500"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="3rem"
              height="3rem"
              viewBox="0 0 24 24"
              id="nav-toggle"
              className={cn(
                style["nav__toggle"],
                "max-sm:hidden",
                "flex flex-row items-center ease-linear duration-100 rounded-lg cursor-pointer"
              )}
              onClick={() => {
                onSidebarToggle();
              }}
            >
              <path
                fill="white"
                d="M4 17.27v-1h16v1zm0-4.77v-1h16v1zm0-4.77v-1h16v1z"
              />
            </svg>
          </Tooltip>

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
        </div>
      </nav>
    </div>
  );
}
