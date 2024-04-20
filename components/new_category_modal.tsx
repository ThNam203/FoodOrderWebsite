"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import LoadingCircle from "./LoadingCircle/loading_circle";
import { TextButton } from "./buttons";
import { Input } from "./input";
import { showErrorToast } from "./toast";

export type NewCategoryFormData = {
  name: string;
};

const schema: ZodType<NewCategoryFormData> = z.object({
  name: z.string().min(1),
});

const NewCategoryModal = ({
  onAddClick,
}: {
  onAddClick: (value: string, image: File | null) => Promise<any>;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const form = useForm<NewCategoryFormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: undefined },
  });
  const {
    register,
    handleSubmit,
    watch,
    reset,
    resetField,
    formState: { errors },
  } = form;

  const handleFormSubmit = async (data: NewCategoryFormData) => {
    console.log("submit");
    setIsLoading(true);
    await onAddClick(data.name, image)
      .then(() => {
        reset();
        onOpenChange();
      })
      .catch((e) => {
        showErrorToast(e.message);
      })
      .finally(() => setIsLoading(false));
  };

  const resetValues = () => {
    resetField("name");
    setImage(null);
    setFileUrl(null);
  };

  return (
    <form>
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
        className="text-black rounded-md font-sans"
      >
        <ModalContent>
          {(onClose) => {
            return (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  New category
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-row gap-4">
                    <ChooseImageButton
                      fileUrl={fileUrl}
                      setFileUrl={setFileUrl}
                      onFileChosen={setImage}
                    />
                    <div className="!my-4 w-full flex flex-col gap-3 text-sm">
                      <Input
                        id="category_name"
                        label="Category name"
                        placeholder="Category name"
                        errorMessages={
                          errors.name ? errors.name.message?.toString() : ""
                        }
                        {...register("name")}
                        className="flex-1 rounded-sm border p-1"
                      />
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <TextButton
                    type="button"
                    onClick={() => {
                      handleSubmit(handleFormSubmit)();
                    }}
                    className="!h-[35px] w-[100px] bg-green-400 text-white hover:bg-green-500 disabled:bg-green-400/60 rounded hover:text-white"
                    disabled={isLoading}
                    content="Add"
                    iconAfter={isLoading ? <LoadingCircle /> : null}
                  />
                  <TextButton
                    type="button"
                    className={
                      "!h-[35px] w-[100px] border-none bg-red-400 disabled:bg-red-400/60 text-white hover:bg-red-500 rounded px-2 hover:text-white"
                    }
                    disabled={isLoading}
                    onClick={() => {
                      resetValues();
                      onClose();
                    }}
                    content="Cancel"
                  />
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </form>
  );
};

export const ChooseImageButton = ({
  fileUrl,
  setFileUrl,
  onFileChosen,
}: {
  fileUrl: string | null;
  setFileUrl: (url: string | null) => void;
  onFileChosen: (file: File | null) => void;
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileUrl(URL.createObjectURL(e.target.files[0]));
      onFileChosen(e.target.files[0]);
    }
  };

  return (
    <div className="w-[100px] h-[80px] relative border rounded-sm shrink-0">
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
            onChange={handleFileChange}
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
