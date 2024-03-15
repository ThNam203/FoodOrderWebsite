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

  useEffect(() => {
    console.log(getCookies());
    setIsLogin(
      getCookie("access-token") !== undefined &&
        getCookie("access-token") !== ""
        ? true
        : false
    );
  }, []);

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
            <a href="/" className={cn(style["nav__link"])}>
              <IntroIcon />
              <span className={style["nav__name"]}>Intro</span>
            </a>
            <a href="/browse" className={style["nav__link"]}>
              <BrowseIcon />
              <span className={style["nav__name"]}>Browse</span>
            </a>

            <a href="#" className={cn(style["nav__link"])}>
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
