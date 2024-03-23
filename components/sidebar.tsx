"use client";

import style from "@/styles/sidebar.module.css";
import { useEffect, useState } from "react";
import {
  BrowseIcon,
  CartIcon,
  DashBoardIcon,
  FavouriteIcon,
  HistoryIcon,
  IntroIcon,
  LoginIcon,
  LogoutIcon,
  SettingIcon,
} from "./icons";
import { getCookie, getCookies } from "cookies-next";
import { cn } from "@/utils/cn";

export default function Sidebar({
  onSidebarToggle,
  intitalState,
}: {
  intitalState: boolean;
  onSidebarToggle: () => void;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(intitalState);
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div
      className={cn(style["l-navbar"], isSidebarOpen ? style.expander : "")}
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
              className={style["nav__toggle"]}
              id="nav-toggle"
              onClick={() => {
                onSidebarToggle();
                setIsSidebarOpen(!isSidebarOpen);
              }}
            >
              <path
                fill="white"
                d="M4 17.27v-1h16v1zm0-4.77v-1h16v1zm0-4.77v-1h16v1z"
              />
            </svg>
            <a href="#" className={style["nav__logo"]}>
              FFOOD
            </a>
          </div>
          <div className={style["nav__list"]}>
            <a href="#" className={cn(style["nav__link"], style["active"])}>
              <DashBoardIcon />
              <span className={style["nav__name"]}>Dashboard</span>
            </a>
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
            <a href="/browse" className={style["nav__link"]}>
              <BrowseIcon />
              <span className={style["nav__name"]}>Browse</span>
            </a>

            <a href="/cart" className={cn(style["nav__link"])}>
              <CartIcon />
              <span className={style["nav__name"]}>Your Cart</span>
            </a>

            <a href="#" className={cn(style["nav__link"])}>
              <FavouriteIcon />
              <span className={style["nav__name"]}>Favorites</span>
            </a>
            <a href="#" className={cn(style["nav__link"])}>
              <HistoryIcon />
              <span className={style["nav__name"]}>History</span>
            </a>
          </div>
        </div>

        <div className={style["nav__list"]}>
          <a
            href="/user-setting"
            className={cn(style["nav__link"], "hover:bg-red-400")}
          >
            <SettingIcon />
            <span className={style["nav__name"]}>User Setting</span>
          </a>
          <span className={isLogin ? "hidden" : ""}>
            <a
              href="/login"
              className={cn(style["nav__link"], "hover:bg-red-400")}
            >
              <LoginIcon />
              <span className={style["nav__name"]}>Log In</span>
            </a>
          </span>
          <span className={isLogin ? "" : "hidden"}>
            <a
              href="#"
              className={cn(
                style["nav__link"],
                "hover:bg-red-400",
                isLogin ? "" : "hidden"
              )}
            >
              <LogoutIcon />
              <span className={style["nav__name"]}>Log Out</span>
            </a>
          </span>
        </div>
      </nav>
    </div>
  );
}
