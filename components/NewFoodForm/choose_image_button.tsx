"use client";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { nanoid } from "nanoid";
import { ClassValue } from "clsx";
import { cn } from "@/utils/cn";

export const ChooseImageButton = ({
  fileUrl,
  onImageChanged,
  className,
}: {
  fileUrl: string | null;
  onImageChanged: (file: File | null) => void;
  className?: ClassValue;
}) => {
  const id = nanoid();
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0)
      onImageChanged(e.target.files[0]);
  }

  return (
    <div
      className={cn(
        "w-[100px] h-[80px] relative border rounded-sm select-none",
        className
      )}
    >
      {!fileUrl || fileUrl.length === 0 ? (
        <>
          <label
            htmlFor={id}
            className="absolute top-0 left-0 flex items-center justify-center w-full h-full hover:cursor-pointer text-gray-600"
          >
            + Image
          </label>
          <input
            id={id}
            type="file"
            onChange={handleChange}
            className="hidden"
            accept="image/*"
          />
        </>
      ) : (
        <>
          <Image
            width={0}
            height={0}
            sizes="100vw"
            src={fileUrl!}
            alt="image"
            className="w-full h-full"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1rem"
            height="1rem"
            className="absolute top-[-8px] right-[-8px] hover:cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onImageChanged(null);
            }}
            viewBox="0 0 24 24"
          >
            <path
              fill="black"
              d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
            />
          </svg>
        </>
      )}
    </div>
  );
};
