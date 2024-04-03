"use client";
import { useState } from "react";
import LoadingCircle from "./LoadingCircle/loading_circle";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";

const NewCategoryModal = ({
  onAddClick,
}: {
  onAddClick: (value: string, image: File | null) => Promise<any>;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [value, setValue] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <div>
        <svg
          className="mx-2 hover:cursor-pointer"
          onClick={onOpen}
          xmlns="http://www.w3.org/2000/svg"
          width="1rem"
          height="1rem"
          viewBox="0 0 256 256"
        >
          <path
            fill="black"
            d="M128 20a108 108 0 1 0 108 108A108.12 108.12 0 0 0 128 20m0 192a84 84 0 1 1 84-84a84.09 84.09 0 0 1-84 84m52-84a12 12 0 0 1-12 12h-28v28a12 12 0 0 1-24 0v-28H88a12 12 0 0 1 0-24h28V88a12 12 0 0 1 24 0v28h28a12 12 0 0 1 12 12"
          />
        </svg>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="text-black rounded-md"
      >
        <ModalContent>
          {(onClose) => {
            return (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  New category
                </ModalHeader>
                <ModalBody>
                  <div className="flex justify-between">
                    <ChooseImageButton onFileChosen={setImage} />
                    <div className="!my-4 flex flex-col gap-3 text-sm">
                      <label
                        htmlFor="alert_input"
                        className="w-36 font-semibold"
                      >
                        New category name
                      </label>
                      <input
                        id="alert_input"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="flex-1 rounded-sm border p-1"
                      />
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <button
                    onClick={async (e) => {
                      setIsLoading(true);
                      try {
                        await onAddClick(value, image);
                        onClose();
                      } catch (e) {}

                      setIsLoading(false);
                    }}
                    className="!h-[35px] w-[100px] bg-green-400 text-white hover:bg-green-500 rounded-sm hover:text-white"
                    disabled={isLoading}
                  >
                    ADD
                    {isLoading ? <LoadingCircle /> : null}
                  </button>
                  <button
                    className={
                      "!h-[35px] w-[100px] border-none bg-red-400 text-white hover:bg-red-500 rounded-sm px-2 hover:text-white"
                    }
                    disabled={isLoading}
                    onClick={onClose}
                  >
                    CANCEL
                  </button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </>
  );
};

export const ChooseImageButton = ({
  onFileChosen,
}: {
  onFileChosen: (file: File | null) => void;
}) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  return (
    <div className="w-[100px] h-[80px] relative border rounded-sm">
      {!fileUrl || fileUrl.length === 0 ? (
        <>
          <label
            htmlFor={"new_category_image"}
            className="absolute top-0 left-0 flex items-center justify-center w-full h-full hover:cursor-pointer text-opacity-90"
          >
            + Image
          </label>
          <input
            id={"new_category_image"}
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setFileUrl(URL.createObjectURL(e.target.files[0]));
                onFileChosen(e.target.files[0]);
              }
            }}
            className="hidden"
            accept="image/*"
          />
        </>
      ) : (
        <>
          <Image
            width={100}
            height={100}
            sizes="100px"
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
              onFileChosen(null);
              setFileUrl(null);
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

export default NewCategoryModal;
