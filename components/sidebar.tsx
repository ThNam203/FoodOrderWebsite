"use client";

import style from "@/styles/sidebar.module.css";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  BrowseIcon,
  CartIcon,
  DashBoardIcon,
  FavouriteIcon,
  HistoryIcon,
  IntroIcon,
  LogoutIcon,
  SettingIcon,
} from "./icons";

export default function Sidebar({
  onSidebarToggle,
  intitalState,
}: {
  intitalState: boolean;
  onSidebarToggle: () => void;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(intitalState);

  return (
    <div
      className={twMerge(
        style["l-navbar"],
        isSidebarOpen ? style.expander : ""
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
            <a
              href="#"
              className={twMerge(style["nav__link"], style["active"])}
            >
              <DashBoardIcon />
              <span className={style["nav__name"]}>Dashboard</span>
            </a>
            <a href="/" className={twMerge(style["nav__link"])}>
              <IntroIcon />
              <span className={style["nav__name"]}>Intro</span>
            </a>
            <a href="/browse" className={style["nav__link"]}>
              <BrowseIcon />
              <span className={style["nav__name"]}>Browse</span>
            </a>

            <a href="#" className={twMerge(style["nav__link"])}>
              <CartIcon />
              <span className={style["nav__name"]}>Your Cart</span>
            </a>

            <a href="#" className={twMerge(style["nav__link"])}>
              <FavouriteIcon />
              <span className={style["nav__name"]}>Favorites</span>
            </a>
            <a href="#" className={twMerge(style["nav__link"])}>
              <HistoryIcon />
              <span className={style["nav__name"]}>History</span>
            </a>
          </div>
        </div>

        <div className={style["nav__list"]}>
          <a
            href="/user-setting"
            className={twMerge(style["nav__link"], "hover:bg-red-400")}
          >
            <SettingIcon />
            <span className={style["nav__name"]}>User Setting</span>
          </a>
          <a
            href="#"
            className={twMerge(style["nav__link"], "hover:bg-red-400")}
          >
            <LogoutIcon />
            <span className={style["nav__name"]}>Log Out</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
