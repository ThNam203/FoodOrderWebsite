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
import { X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { FieldError, Path, UseFormRegister, useForm } from "react-hook-form";
import * as z from "zod";
import { TextButton } from "../buttons";
import { Input } from "../input";
import NewCategoryModal from "../new_category_modal";
import SearchAndChooseButton from "../search_and_choose_button";
import { showErrorToast, showSuccessToast } from "../toast";
import { ChooseImageButton } from "./choose_image_button";

export type FoodFormData = {
  name: string;
  status: string;
  category: string;
  images: (string | null)[];
  sizes: {
    sizeName: string;
    price: number;
    weight: number;
    note: string;
  }[];
  description: string;
  tags: string[];
};

const foodSchema: z.ZodType<FoodFormData> = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is missing!" })
    .max(100, { message: "Name must be at most 100 characters!" }),
  status: z.string(),
  category: z.string(),
  images: z
    .array(z.string())
    .min(1, { message: "Please add one image about this food" })
    .max(5),
  sizes: z
    .array(
      z.object({
        sizeName: z
          .string({ required_error: "Missing size name" })
          .min(1, { message: "Missing size name" })
          .max(100, { message: "Size name must be less than 100" }),
        price: z
          .number({ required_error: "Missing price!" })
          .min(0, { message: "Price must be at least 0" })
          .max(Number.MAX_VALUE, {
            message: `Price must be less than ${Number.MAX_VALUE}`,
          }),
        weight: z
          .number({ required_error: "Missing price!" })
          .min(0, { message: "Weight must be at least 0" })
          .max(Number.MAX_VALUE, {
            message: `Weight must be less than ${Number.MAX_VALUE}`,
          }),
        note: z.string(),
      })
    )
    .min(1, { message: "Please add at least one size" }),
  description: z.string(),
  tags: z.array(z.string()),
});

export const FoodForm = ({
  closeForm,
  categories,
  food,
}: {
  food?: Food;
  closeForm: () => any;
  categories: FoodCategory[];
}) => {
  const dispatch = useAppDispatch();

  const [chosenImageFiles, setChosenImageFiles] = useState<File[]>([]);

  const [isUploadingFood, setIsUploadingFood] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    resetField,
    watch,
  } = useForm<z.infer<typeof foodSchema>>({
    resolver: zodResolver(foodSchema),
    defaultValues: {
      status: "true",
      images: [],
      sizes: [
        {
          sizeName: "",
          price: 0,
          weight: 0,
          note: "",
        },
      ],
      description: "",
      category: undefined,
      tags: [],
    },
  });

  const setInitialValues = () => {
    if (food) {
      setValue("name", food.name);
      setValue("status", food.status ? "true" : "false");
      setValue("category", food.category.name);
      setValue("images", food.images);
      setValue(
        "sizes",
        food.foodSizes.map((size) => {
          return {
            sizeName: size.name,
            price: size.price,
            weight: size.weight,
            note: size.note,
          };
        })
      );
      setValue("description", food.description);
      setValue("tags", food.tags);
    }
  };

  useEffect(() => {
    if (food) setInitialValues();
  }, []);

  // if newFileUrl == null, it means the user removed image
  const handleImageChosen = (newFileUrl: File | null, index: number) => {
    if (newFileUrl === null) chosenImageFiles.splice(index, 1);
    else chosenImageFiles.push(newFileUrl);
    setChosenImageFiles(chosenImageFiles);

    const newImages = [...watch("images")];
    console.log("before", newImages);
    if (newFileUrl) newImages[index] = URL.createObjectURL(newFileUrl);
    else newImages.splice(index, 1);
    console.log("after", newImages);

    setValue("images", newImages);
  };

  useEffect(() => {
    console.log("images changed: ", watch("images"));
  }, [watch("images")]);

  const onSubmit = async (values: FoodFormData) => {
    console.log(values);
    const selectedCategory = categories.find(
      (cat: any) => cat.name === values.category
    );
    const newFood = FoodFormDataToFood(values, selectedCategory!);
    const dataForm: any = new FormData();
    dataForm.append(
      "data",
      new Blob([JSON.stringify(FoodToSend(newFood))], {
        type: "application/json",
      })
    );
    chosenImageFiles
      .filter((file) => file != null)
      .forEach((imageFile) => dataForm.append("files", imageFile));
    setIsUploadingFood(true);

    if (food) {
      await FoodService.updateFood(food.id, dataForm)
        .then((result) => {
          const updatedFood = FoodToReceive(result.data);
          dispatch(updateFood(updatedFood));
          showSuccessToast("Food updated successfully");
        })
        .catch((e) => console.error(e))
        .finally(() => {
          setIsUploadingFood(false);
          closeForm();
        });
    } else {
      await FoodService.createNewFood(dataForm)
        .then((result) => {
          const newFood = FoodToReceive(result.data);
          dispatch(addFood(newFood));
          showSuccessToast("New food added successfully");
        })
        .catch((e) => console.error(e))
        .finally(() => {
          setIsUploadingFood(false);
          closeForm();
        });
    }
  };

  return (
    <div className="fixed left-0 top-0 z-[50] flex h-screen w-screen items-center justify-center bg-black bg-opacity-30">
      <div
        className={
          "flex max-h-[95%] w-[95%] max-w-[600px] flex-col overflow-y-auto rounded-md bg-white p-4 scrollbar-no-arrows scrollbar scrollbar-hidden"
        }
      >
        <div className="mb-4 flex flex-row items-center justify-between">
          <h3 className="text-base font-semibold">
            {food ? "Update food" : "Add new food"}
          </h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.25rem"
            height="1.25rem"
            viewBox="0 0 24 24"
            className="hover:cursor-pointer"
            onClick={closeForm}
          >
            <path
              fill="black"
              d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
            />
          </svg>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        >
          <div className="flex h-full w-full flex-col gap-4">
            <DefaultInput
              label="name"
              register={register}
              required
              placeholder="Food name"
              error={errors.name}
            />
            <StatusInput
              label="status"
              register={register}
              required
              error={errors.status}
            />
            <CategoryInput
              value={watch("category")}
              onValueChanged={(val) => {
                if (val) setValue("category", val);
                else resetField("category");
              }}
              {...register("category", { required: true })}
              error={errors.category}
            />
            <TagsInput
              value={watch("tags")}
              onValueChanged={(vals) => {
                if (vals) setValue("tags", vals);
                else resetField("tags");
              }}
              error={errors.tags ? errors.tags[0] : undefined}
            />
            <ImagesInput
              fileUrls={watch("images")}
              onImageChanged={handleImageChosen}
              {...register("images", { required: true })}
              error={errors.images as FieldError}
            />
            <DescriptionInput
              label="description"
              register={register}
              required
              error={errors.description}
            />
            <div className="flex flex-col rounded overflow-hidden">
              <div className="bg-gray-200 hover:bg-gray-100 p-3 text-sm w-full">
                <div className="flex flex-row items-center gap-10">
                  <p>Food variants</p>
                  {errors && errors.sizes ? (
                    <p className="text-xs text-red-500">
                      {errors.sizes.message}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="border p-4">
                <div className="flex flex-col gap-4">
                  {watch("sizes").map((value, index) => {
                    const fieldValue = watch("sizes");
                    return (
                      <FoodVariantView
                        key={index}
                        sizeName={value.sizeName}
                        price={value.price}
                        weight={value.weight}
                        note={value.note}
                        onSizeNameChanged={(val: string) => {
                          fieldValue[index].sizeName = val;
                          setValue("sizes", [...fieldValue], {
                            shouldValidate: true,
                          });
                        }}
                        onPriceChanged={(val: number) => {
                          fieldValue[index].price = val;
                          setValue("sizes", [...fieldValue], {
                            shouldValidate: true,
                          });
                        }}
                        onWeightChanged={(val: number) => {
                          fieldValue[index].weight = val;
                          setValue("sizes", [...fieldValue], {
                            shouldValidate: true,
                          });
                        }}
                        onNoteChanged={(val: string) => {
                          fieldValue[index].note = val;
                          setValue("sizes", [...fieldValue], {
                            shouldValidate: true,
                          });
                        }}
                        onRemoveClick={() => {
                          setValue("sizes", fieldValue.toSpliced(index, 1), {
                            shouldValidate: false,
                          });
                        }}
                      />
                    );
                  })}
                </div>
                <TextButton
                  type="button"
                  className="w-auto mt-4 h-[35px] border bg-green-500 hover:bg-green-600 text-white px-2 text-sm rounded-md"
                  onClick={(e) => {
                    e.preventDefault();

                    const newSize = {
                      sizeName: "",
                      price: 0,
                      weight: 0,
                      note: "",
                    };

                    setValue("sizes", [...watch("sizes"), newSize]);
                  }}
                  content="Add size"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4 mt-4">
            <div className="flex-1" />
            <TextButton
              type="submit"
              className="w-[100px] px-4 text-white"
              disabled={isUploadingFood}
              content={food ? "Update" : "Add"}
            />
            <TextButton
              type="button"
              className="w-[100px] bg-gray-400 px-4 hover:bg-gray-500 disabled:bg-gray-400/60"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                closeForm();
              }}
              disabled={isUploadingFood}
              content="Cancel"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

type InputProps = {
  label: Path<z.infer<typeof foodSchema>>;
  register: UseFormRegister<z.infer<typeof foodSchema>>;
  required: boolean;
  error?: FieldError;
  placeholder?: string;
};

const LabelInput = ({
  label,
  error,
  className,
}: {
  label: string;
  error?: FieldError;
  className?: ClassValue;
}) => {
  return (
    <div className={cn("w-[150px] shrink-0", className)}>
      <label htmlFor={label} className="w-[150px] text-sm font-medium">
        {label.length > 0
          ? label[0].toUpperCase() + label.slice(1, label.length)
          : ""}
      </label>
      <ErrorMessage error={error} />
    </div>
  );
};

const ErrorMessage = ({ error }: { error?: FieldError }) => {
  return error && error.message ? (
    <p className="text-xs text-red-500">{error.message}</p>
  ) : null;
};

const DefaultInput = ({
  label,
  register,
  required,
  error,
  placeholder,
}: InputProps) => {
  const id = useId();
  return (
    <div className="flex flex-row w-full items-center h-10">
      <LabelInput label={label} error={error} />
      <Input
        id={id}
        className="flex h-10 outline-1 rounded-md px-2"
        placeholder={placeholder}
        {...register(label, { required })}
      />
    </div>
  );
};

const DescriptionInput = ({ label, register, required, error }: InputProps) => {
  const id = useId();
  return (
    <>
      <textarea
        id={id}
        {...register(label, { required })}
        className="resize-none w-full border border-borderColor focus:border-primary outline-none rounded-md p-2 placeholder:text-sm text-sm"
        rows={3}
        placeholder="Description"
      />
      <ErrorMessage error={error} />
    </>
  );
};

const StatusInput = ({ label, register, required, error }: InputProps) => {
  const id1 = useId();
  const id2 = useId();

  return (
    <div className="flex flex-row w-full items-center h-10">
      <LabelInput label={label} error={error} />
      <input
        id={id1}
        {...register(label, {
          required,
        })}
        type="radio"
        value={"true"}
        name={label}
        className="mr-2"
      />
      <label htmlFor={id1}>{FoodStatus.ACTIVE}</label>
      <input
        id={id2}
        {...register(label, {
          required,
        })}
        type="radio"
        value={"false"}
        name={label}
        className="ml-4 mr-2"
      />
      <label htmlFor={id2}>{FoodStatus.DISABLE}</label>
    </div>
  );
};

const CategoryInput = ({
  value,
  onValueChanged,
  error,
}: {
  value: string;
  onValueChanged: (value: string | null) => any;
  error?: FieldError;
}) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.foodCategory.value);

  return (
    <div className="flex flex-row items-baseline">
      <LabelInput label="Category" error={error} />
      <div className="relative !m-0 flex min-h-[40px] flex-1 flex-row items-center rounded-md border border-input">
        <div className="h-full w-full flex-1">
          <SearchAndChooseButton
            value={value}
            placeholder="---Choose category---"
            searchPlaceholder="Search category..."
            onValueChanged={onValueChanged}
            choices={categories.map((v) => v.name)}
          />
        </div>
        <NewCategoryModal
          onAddClick={async (catName: string, imageFile: File | null) => {
            const dataForm: any = new FormData();
            dataForm.append(
              "data",
              new Blob([JSON.stringify({ name: catName })], {
                type: "application/json",
              })
            );
            if (imageFile) dataForm.append("files", imageFile);
            return await FoodService.createNewCategory(dataForm)
              .then((newCat) => {
                dispatch(addFoodCategory(newCat.data));
              })
              .catch((errr) => showErrorToast(errr));
          }}
        />
      </div>
    </div>
  );
};
const TagsInput = ({
  value,
  onValueChanged,
  error,
}: {
  value: string[];
  onValueChanged: (value: string[]) => any;
  error?: FieldError;
}) => {
  const [curInput, setCurInput] = useState("");

  return (
    <div className="flex flex-row items-baseline">
      <LabelInput label="Tags" error={error} />
      <div className="!m-0 py-1 px-2 min-h-[40px] rounded-md border flex flex-1 flex-row flex-wrap items-center gap-2 border-borderColor focus-within:border-primary">
        {value.map((keyVal, keyIdx) => (
          <div
            key={keyIdx}
            className="flex flex-row items-center gap-[2px] rounded-md bg-blue-400 p-1 text-white"
          >
            <p>{keyVal}</p>
            <X
              size={16}
              color="white"
              className="p-[2px] hover:cursor-pointer"
              onClick={(e) => onValueChanged(value.filter((v) => v !== keyVal))}
            />
          </div>
        ))}
        <input
          placeholder="Type value and enter"
          value={curInput}
          onChange={(e) => setCurInput(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onValueChanged([...value, curInput]);
              setCurInput("");
            }
          }}
          className="h-[35px] min-w-[150px] flex-1 rounded-none border-0 outline-none"
        />
      </div>
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
      <LabelInput label="Images" error={error} className="w-full" />
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

const FoodVariantView = ({
  sizeName,
  price,
  weight,
  note,
  onSizeNameChanged,
  onWeightChanged,
  onPriceChanged,
  onNoteChanged,
  onRemoveClick,
}: {
  sizeName: string;
  price: number;
  weight: number;
  note: string;
  onSizeNameChanged: (val: string) => void;
  onWeightChanged: (val: number) => void;
  onPriceChanged: (val: number) => void;
  onNoteChanged: (val: string) => void;
  onRemoveClick: () => void;
}) => {
  return (
    <div className="relative px-2 text-[0.85rem] py-4 rounded-md bg-white shadow-lg">
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <div className="flex flex-row items-baseline">
            <p className="w-[80px] font-semibold">Size name</p>
            <input
              type="text"
              value={sizeName}
              onChange={(e) => onSizeNameChanged(e.target.value)}
              placeholder="Size name"
              className="border-b border-slate-400 outline-none p-1 pb-0 text-end max-w-44 bg-inherit flex-1 focus:border-primary"
            />
          </div>
          <div className="flex flex-row items-baseline">
            <p className="w-[80px] font-semibold">Price</p>
            <input
              type="number"
              min={0}
              value={price === 0 ? undefined : price}
              placeholder="0"
              onChange={(e) => {
                onPriceChanged(e.target.valueAsNumber);
              }}
              className="border-b border-slate-400 outline-none p-1 pb-0 text-end max-w-44 bg-inherit flex-1 focus:border-primary"
            />
          </div>
          <div className="flex flex-row items-baseline">
            <p className="w-[80px] font-semibold">Weight</p>
            <input
              value={weight === 0 ? undefined : weight}
              type="number"
              min={0}
              placeholder="0"
              onChange={(e) => onWeightChanged(e.target.valueAsNumber)}
              className="border-b border-slate-400 outline-none p-1 pb-0 text-end max-w-44 bg-inherit flex-1 focus:border-primary"
            />
          </div>
        </div>
        <textarea
          placeholder="Note"
          value={note}
          onChange={(e) => onNoteChanged(e.target.value)}
          className="border-slate-400 rounded-md p-1 resize-none flex-1 min-h-full border bg-inherit scrollbar small-scrollbar outline-none focus:border-primary"
        />
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1rem"
        height="1rem"
        viewBox="0 0 24 24"
        className="absolute right-[0.125rem] top-[0.125rem] rounded-full translate-x-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemoveClick();
        }}
      >
        <path
          fill="black"
          d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
        />
      </svg>
    </div>
  );
};
