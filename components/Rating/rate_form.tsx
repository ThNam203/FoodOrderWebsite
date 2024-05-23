"use client";

import {
  FoodFormDataToFood,
  FoodToReceive,
  FoodToSend,
} from "@/convertor/foodConvertor";
import { Food, FoodCategory, FoodStatus } from "@/models/Food";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addFoodCategory } from "@/redux/slices/category";
import { addFood, updateFood } from "@/redux/slices/food";
import FoodService from "@/services/foodService";
import { cn } from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassValue } from "clsx";
import {
  Annoyed,
  Frown,
  Laugh,
  Meh,
  Smile,
  TextCursorInput,
  X,
} from "lucide-react";
import { useEffect, useId, useState } from "react";
import { FieldError, Path, UseFormRegister, useForm } from "react-hook-form";
import * as z from "zod";
import { TextButton } from "../buttons";
import { Input, TextArea } from "../input";
import NewCategoryModal from "../new_category_modal";
import SearchAndChooseButton from "../search_and_choose_button";
import { showErrorToast, showSuccessToast } from "../toast";
import { ChooseImageButton } from "../NewFoodForm/choose_image_button";
import { displayNumber, removeCharNAN } from "@/utils/func";
import { User } from "@/models/User";
import { color } from "framer-motion";
import MotionWrapper from "../visualEffect/motion-wrapper";
import { Separate } from "../separate";

export type RateFormData = {
  comment: string;
  images: (string | null)[];
};

const rateSchema: z.ZodType<RateFormData> = z.object({
  comment: z.string(),
  images: z.array(z.string()),
});

const faces = [
  {
    icon: (
      <Frown
        size={80}
        className="text-[#fca5a5] cursor-pointer hover:scale-125 ease-linear duration-150"
      />
    ),
    color: "text-[#fca5a5]",
  },
  {
    icon: (
      <Annoyed
        size={80}
        className="text-[#fdba74] cursor-pointer hover:scale-125 ease-linear duration-150"
      />
    ),
    color: "text-[#fdba74]",
  },
  {
    icon: (
      <Meh
        size={80}
        className="text-[#a5b4fc] cursor-pointer hover:scale-125 ease-linear duration-150"
      />
    ),
    color: "text-[#a5b4fc]",
  },
  {
    icon: (
      <Smile
        size={80}
        className="text-[#67e8f9] cursor-pointer hover:scale-125 ease-linear duration-150"
      />
    ),
    color: "text-[#67e8f9]",
  },
  {
    icon: (
      <Laugh
        size={80}
        className="text-[#86efac] cursor-pointer hover:scale-125 ease-linear duration-150"
      />
    ),
    color: "text-[#86efac]",
  },
];

export const useRateForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [food, setFood] = useState<Food | undefined>(undefined);
  const openForm = (food: Food) => {
    setFood(food);
    setIsOpen(true);
  };
  const closeForm = () => {
    setFood(undefined);
    setIsOpen(false);
  };
  return { isOpen, openForm, closeForm, food, setFood };
};

export const RateForm = ({
  closeForm,
  food,
}: {
  food?: Food;
  closeForm: () => any;
}) => {
  const dispatch = useAppDispatch();
  const thisUser = useAppSelector((state) => state.profile.value);
  const [chosenImageFiles, setChosenImageFiles] = useState<File[]>([]);

  const [isUploadingFood, setIsUploadingFood] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number>(-1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    resetField,
    watch,
  } = useForm<z.infer<typeof rateSchema>>({
    resolver: zodResolver(rateSchema),
    defaultValues: {
      comment: "",
      images: [],
    },
  });

  // const setInitialValues = () => {
  //   if (food) {
  //     console.log("food: ", food);
  //     setValue("name", food.name);
  //     setValue("status", food.status ? "true" : "false");
  //     setValue("category", food.category.name);
  //     setValue("images", food.images);
  //     setValue(
  //       "sizes",
  //       food.foodSizes.map((size) => {
  //         return {
  //           sizeName: size.name,
  //           price: size.price,
  //           weight: size.weight,
  //           note: size.note,
  //         };
  //       })
  //     );
  //     setValue("description", food.description);
  //     setValue("tags", food.tags);
  //   }
  // };

  // useEffect(() => {
  //   if (food) setInitialValues();
  // }, []);

  // if newFileUrl == null, it means the user removed image
  const handleImageChosen = (newFileUrl: File | null, index: number) => {
    if (newFileUrl === null) chosenImageFiles.splice(index, 1);
    else chosenImageFiles.push(newFileUrl);
    setChosenImageFiles(chosenImageFiles);

    const newImages = [...watch("images")];
    if (newFileUrl) newImages[index] = URL.createObjectURL(newFileUrl);
    else newImages.splice(index, 1);

    setValue("images", newImages);
  };

  const onSubmit = async (values: RateFormData) => {
    // const selectedCategory = categories.find(
    //   (cat: any) => cat.name === values.category
    // );
    // const newFood = FoodFormDataToFood(values, selectedCategory!);
    // const dataForm: any = new FormData();
    // dataForm.append(
    //   "data",
    //   new Blob([JSON.stringify(FoodToSend(newFood))], {
    //     type: "application/json",
    //   })
    // );
    // chosenImageFiles
    //   .filter((file) => file != null)
    //   .forEach((imageFile) => dataForm.append("files", imageFile));
    // setIsUploadingFood(true);
    // if (food) {
    //   await FoodService.updateFood(food.id, dataForm)
    //     .then((result) => {
    //       const updatedFood = FoodToReceive(result.data);
    //       dispatch(updateFood(updatedFood));
    //       showSuccessToast("Food updated successfully");
    //     })
    //     .catch((e) => console.error(e))
    //     .finally(() => {
    //       setIsUploadingFood(false);
    //       closeForm();
    //     });
    // } else {
    //   await FoodService.createNewFood(dataForm)
    //     .then((result) => {
    //       const newFood = FoodToReceive(result.data);
    //       dispatch(addFood(newFood));
    //       showSuccessToast("New food added successfully");
    //     })
    //     .catch((e) => console.error(e))
    //     .finally(() => {
    //       setIsUploadingFood(false);
    //       closeForm();
    //     });
    // }
  };

  return (
    <div className="fixed left-0 top-0 z-[50] flex h-screen w-screen items-center justify-center bg-black bg-opacity-30">
      <MotionWrapper
        hasHoverEffect={false}
        initial={{ x: 0, y: 40 }}
        animate={{ x: 0, y: 0 }}
        className="flex max-h-[95%] w-[95%] max-w-[600px] flex-col overflow-y-auto rounded-md bg-white p-4 scrollbar scrollbar-none"
      >
        <div className="mb-4 flex flex-row items-center justify-between">
          <h3 className="text-lg font-semibold">
            Well, how was it ? Rate your experience
          </h3>
          <X
            size={20}
            className="cursor-pointer hover:text-red-500 ease-linear duration-200"
            onClick={(e) => {
              e.stopPropagation();
              closeForm();
            }}
          />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
          className="space-y-6 flex flex-col items-center"
        >
          <p className="w-full font-semibold text-secondaryWord">
            Please feel free to share your experience with us. Your feedback is
            important to us.
          </p>
          <div className="w-full flex flex-row justify-center items-center gap-2">
            {faces.map((face, index) => {
              return (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 shrink-0 group cursor-pointer select-none"
                  )}
                  onClick={() => setSelectedOption(index + 1)}
                >
                  {face.icon}
                  <span
                    className={cn(
                      "text-md font-semibold",
                      selectedOption === index + 1
                        ? face.color
                        : "text-secondaryWord "
                    )}
                  >
                    {index + 1}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="w-full space-y-2">
            <Separate />
            <TextArea
              {...register("comment")}
              placeholder="Leave your feedback here to build trust and help other customers know more about this food"
              className="w-full h-[100px] outline-0 border-0 resize-none"
            />
            <ImagesInput
              fileUrls={watch("images")}
              onImageChanged={handleImageChosen}
              {...register("images", { required: true })}
              error={errors.images as FieldError}
            />
          </div>

          <div className="flex flex-row items-center justify-center gap-4 mt-4">
            <TextButton
              type="submit"
              className="px-10 text-white rounded-[999px]"
              disabled={isUploadingFood || selectedOption === -1}
              onClick={() => {
                closeForm();
              }}
            >
              Submit
            </TextButton>
          </div>
        </form>
      </MotionWrapper>
    </div>
  );
};

const ImagesInput = ({
  fileUrls,
  onImageChanged,
  error,
}: {
  fileUrls: (string | null)[];
  onImageChanged: (file: File | null, index: number) => void;
  error?: FieldError;
}) => {
  const [displayFileUrls, setDisplayFileUrls] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);
  useEffect(() => {
    let temp: (string | null)[] = [null, null, null, null, null];
    fileUrls.forEach((fileUrl, index) => {
      temp[index] = fileUrl;
    });
    setDisplayFileUrls(temp);
  }, [fileUrls]);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row w-full items-center h-20 justify-between">
        {displayFileUrls.map((fileUrl, index) => (
          <ChooseImageButton
            key={index}
            fileUrl={fileUrl}
            onImageChanged={(imageFile) => {
              console.log(imageFile, " ", index);
              onImageChanged(imageFile, index);
            }}
            className="rounded-md"
          />
        ))}
      </div>
    </div>
  );
};
