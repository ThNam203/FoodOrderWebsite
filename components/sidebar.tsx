"use client";

import style from "@/styles/sidebar.module.css";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

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
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24"><path fill="white" d="M13.5 9V4H20v5zM4 12V4h6.5v8zm9.5 8v-8H20v8zM4 20v-5h6.5v5zm1-9h4.5V5H5zm9.5 8H19v-6h-4.5zm0-11H19V5h-4.5zM5 19h4.5v-3H5zm4.5-3"/></svg>
              <span className={style["nav__name"]}>Dashboard</span>
            </a>
            <a href="#" className={style["nav__link"]}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
              >
                <g fill="none" stroke="white">
                  <path
                    strokeLinejoin="round"
                    d="M14.5 21v-5a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v5"
                  />
                  <path d="M5 11v6c0 1.886 0 2.828.586 3.414C6.172 21 7.114 21 9 21h6c1.886 0 2.828 0 3.414-.586C19 19.828 19 18.886 19 17v-6M4.621 4.515c.182-.728.273-1.091.544-1.303C5.437 3 5.812 3 6.562 3h10.876c.75 0 1.125 0 1.397.212c.27.212.362.575.544 1.303l1.203 4.814c.097.388.146.581.135.739a1 1 0 0 1-.69.883c-.15.049-.354.049-.763.049c-.533 0-.8 0-1.023-.052a2 2 0 0 1-1.393-1.18c-.089-.212-.132-.47-.217-.983c-.024-.144-.036-.216-.05-.235a.1.1 0 0 0-.162 0c-.014.019-.026.09-.05.235l-.081.489A2 2 0 0 1 14.352 11h-.204a2 2 0 0 1-1.936-1.726l-.081-.49c-.024-.143-.036-.215-.05-.234a.1.1 0 0 0-.162 0c-.014.019-.026.09-.05.235l-.081.489A2 2 0 0 1 9.852 11h-.204A2 2 0 0 1 7.73 9.374a1.386 1.386 0 0 1-.018-.1l-.081-.49c-.024-.143-.036-.215-.05-.234a.1.1 0 0 0-.162 0c-.014.019-.026.09-.05.235c-.085.514-.128.77-.217.983a2 2 0 0 1-1.392 1.18C5.536 11 5.27 11 4.736 11c-.409 0-.613 0-.763-.049a1 1 0 0 1-.69-.883c-.01-.158.038-.351.135-.739z" />
                </g>
              </svg>
              <span className={style["nav__name"]}>Browse</span>
            </a>

            <a href="#" className={twMerge(style["nav__link"])}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
              >
                <g fill="none" stroke="white" strokeWidth="1.5">
                  <path d="M3.864 16.455c-.858-3.432-1.287-5.147-.386-6.301C4.378 9 6.148 9 9.685 9h4.63c3.538 0 5.306 0 6.207 1.154c.901 1.153.472 2.87-.386 6.301c-.546 2.183-.818 3.274-1.632 3.91c-.814.635-1.939.635-4.189.635h-4.63c-2.25 0-3.375 0-4.189-.635c-.814-.636-1.087-1.727-1.632-3.91Z" />
                  <path
                    d="m19.5 9.5l-.71-2.605c-.274-1.005-.411-1.507-.692-1.886A2.5 2.5 0 0 0 17 4.172C16.56 4 16.04 4 15 4M4.5 9.5l.71-2.605c.274-1.005.411-1.507.692-1.886A2.5 2.5 0 0 1 7 4.172C7.44 4 7.96 4 9 4"
                    opacity="0.5"
                  />
                  <path d="M9 4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1Z" />
                </g>
              </svg>
              <span className={style["nav__name"]}>Your Cart</span>
            </a>

            <a href="#" className={twMerge(style["nav__link"])}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="m12 19.654l-.758-.685q-2.448-2.236-4.05-3.829q-1.602-1.592-2.529-2.808q-.926-1.217-1.295-2.201Q3 9.146 3 8.15q0-1.908 1.296-3.204Q5.592 3.65 7.5 3.65q1.32 0 2.475.675T12 6.288Q12.87 5 14.025 4.325T16.5 3.65q1.908 0 3.204 1.296Q21 6.242 21 8.15q0 .996-.368 1.98q-.369.985-1.295 2.202q-.927 1.216-2.52 2.808q-1.592 1.593-4.06 3.83zm0-1.354q2.4-2.17 3.95-3.716q1.55-1.547 2.45-2.685t1.25-2.015Q20 9.006 20 8.15q0-1.5-1-2.5t-2.5-1q-1.194 0-2.204.682q-1.01.681-1.808 2.053h-.976q-.818-1.39-1.818-2.063q-1-.672-2.194-.672q-1.48 0-2.49 1Q4 6.65 4 8.15q0 .856.35 1.734t1.25 2.015t2.45 2.675Q9.6 16.112 12 18.3m0-6.825"
                />
              </svg>
              <span className={style["nav__name"]}>Favorites</span>
            </a>
            <a href="#" className={twMerge(style["nav__link"])}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24"><path fill="white" d="M11.962 20q-3.047 0-5.311-1.99Q4.387 16.022 4.03 13h1.011q.408 2.58 2.351 4.29Q9.337 19 11.962 19q2.925 0 4.962-2.037T18.962 12q0-2.925-2.038-4.963T11.962 5q-1.552 0-2.918.656q-1.365.656-2.41 1.806h2.481v1H4.962V4.308h1v2.388q1.16-1.273 2.718-1.984Q10.238 4 11.962 4q1.663 0 3.118.626q1.455.626 2.542 1.713t1.714 2.543q.626 1.455.626 3.118q0 1.663-.626 3.118q-.626 1.455-1.714 2.543q-1.087 1.087-2.542 1.713q-1.455.626-3.118.626m3.203-4.146l-3.646-3.646V7h1v4.792l3.354 3.354z"/></svg>
              <span className={style["nav__name"]}>History</span>
            </a>
          </div>
        </div>

        <a href="#" className={twMerge(style["nav__link"], "hover:bg-red-400")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
          >
            <path
              fill="white"
              d="M5.615 20q-.69 0-1.152-.462Q4 19.075 4 18.385V5.615q0-.69.463-1.152Q4.925 4 5.615 4h6.404v1H5.615q-.23 0-.423.192Q5 5.385 5 5.615v12.77q0 .23.192.423q.193.192.423.192h6.404v1zm10.847-4.462l-.702-.719l2.319-2.319H9.192v-1h8.887l-2.32-2.32l.703-.718L20 12z"
            />
          </svg>
          <span className={style["nav__name"]}>Log Out</span>
        </a>
      </nav>
    </div>
  );
}
