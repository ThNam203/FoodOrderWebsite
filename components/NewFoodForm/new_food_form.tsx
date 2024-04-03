"use client";

import { useAppDispatch } from "@/redux/hooks";
import { addFood } from "@/redux/slices/food";
import FoodService from "@/services/foodService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { FieldError, Path, UseFormRegister, useForm } from "react-hook-form";
import * as z from "zod";
import AddNewThingModal from "../new_category_modal";
import SearchAndChooseButton from "../search_and_choose_button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../shadcn_components/accordion";
import { ChooseImageButton } from "./choose_image_button";

const foodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is missing!" })
    .max(100, { message: "Name must be at most 100 characters!" }),
  status: z.string(),
  category: z.string(),
  images: z.array(z.string().nullable()).min(0).max(5),
  sizes: z
    .array(
      z.object({
        sizeName: z
          .string({ required_error: "Missing size name" })
          .min(10, { message: "Missing size name" })
          .max(100, { message: "Size name must be less than 100" }),
        price: z
          .number({ required_error: "Missing price!" })
          .min(0, { message: "Price must be at least 0" })
          .max(Number.MAX_VALUE, {
            message: `Price must be less than ${Number.MAX_VALUE}`,
          }),
        weight: z
          .number()
          .min(0, { message: "Weight must be at least 0" })
          .max(Number.MAX_VALUE, {
            message: `Weight must be less than ${Number.MAX_VALUE}`,
          }),
        note: z.string(),
      })
    )
    .min(1),
  description: z.string(),
});

export const NewFoodForm = ({ closeForm }: { closeForm: () => any }) => {
  const [chosenImageFiles, setChosenImageFiles] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);

  const [isUploadingFood, setIsUploadingFood] = useState(false);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<z.infer<typeof foodSchema>>({
    resolver: zodResolver(foodSchema),
    defaultValues: {
      name: "",
      status: "true",
      images: [null, null, null, null, null],
      sizes: [
        {
          sizeName: "Default",
          price: 0,
          weight: 0,
          note: "",
        },
      ],
      description: "",
    },
  });

  // if newFileUrl == null, it means the user removed image
  const handleImageChosen = (newFileUrl: File | null, index: number) => {
    if (newFileUrl === null) {
      for (let i = index; i < chosenImageFiles.length - 1; i++) {
        chosenImageFiles[i] = chosenImageFiles[i + 1];
      }
      chosenImageFiles[chosenImageFiles.length - 1] = null;
    } else chosenImageFiles[chosenImageFiles.indexOf(null)] = newFileUrl;

    setValue(
      "images",
      chosenImageFiles.map((file) => (file ? URL.createObjectURL(file) : null)),
      { shouldValidate: true }
    );
    setChosenImageFiles(chosenImageFiles);
  };

  function onSubmit(values: z.infer<typeof foodSchema>) {
    const dataForm: any = new FormData();
    dataForm.append(
      "data",
      new Blob([JSON.stringify(values)], { type: "application/json" })
    );
    chosenImageFiles
      .filter((file) => file != null)
      .forEach((imageFile) => dataForm.append("files", imageFile));
    setIsUploadingFood(true);
    FoodService.createNewFood(dataForm)
      .then((result) => {
        dispatch(addFood(result.data));
      })
      .catch((e) => console.error(e))
      .finally(() => {
        setIsUploadingFood(false);
        closeForm();
      });
  }

  return (
    <div className="fixed left-0 top-0 z-[50] flex h-screen w-screen items-center justify-center bg-black bg-opacity-30">
      <div
        className={
          "flex max-h-[95%] w-[95%] max-w-[600px] flex-col overflow-y-auto rounded-md bg-white p-4 scrollbar-no-arrows scrollbar scrollbar-hidden"
        }
      >
        <div className="mb-4 flex flex-row items-center justify-between">
          <h3 className="text-base font-semibold">Add new food</h3>
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
              error={errors.name}
            />
            <StatusInput
              label="status"
              register={register}
              required
              error={errors.status}
            />
            <CategoryInput
              label="category"
              value={watch("category")}
              onValueChanged={(val) => setValue("category", val ? val : "")}
              categories={["a", "b", "c"]}
              error={errors.category}
            />
            <ImagesInput
              fileUrls={watch("images")}
              onImageChanged={handleImageChosen}
            />
            <DescriptionInput
              label="description"
              register={register}
              required
              error={errors.description}
            />
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="bg-gray-200 p-3 text-sm w-full">
                  <div className="flex flex-row gap-10">
                    <p>Food variants</p>
                    {errors && errors.sizes ? (
                      <p className="text-xs text-red-500">
                        {errors.sizes.message}
                      </p>
                    ) : null}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="border p-0">
                  <div className="flex flex-col">
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
                  <button
                    type="button"
                    className="ml-2 my-2 h-[35px] border bg-green-500 text-white px-2 text-sm rounded-md"
                    onClick={(e) => {
                      e.preventDefault();

                      const newSize = {
                        sizeName: "Default",
                        price: 0,
                        weight: 0,
                        note: "",
                      };

                      setValue("sizes", [...watch("sizes"), newSize]);
                    }}
                  >
                    Add size
                  </button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="flex flex-row gap-4 mt-4">
            <div className="flex-1" />
            <button
              type="submit"
              className="min-w-[150px] px-4 uppercase bg-green-600 text-white rounded-sm py-2"
              disabled={isUploadingFood}
            >
              Save
            </button>
            <button
              type="button"
              className="min-w-[150px] bg-gray-400 px-4 uppercase hover:bg-gray-500 rounded-sm"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                closeForm();
              }}
              disabled={isUploadingFood}
            >
              Cancel
            </button>
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
};

const DefaultInput = ({ label, register, required, error }: InputProps) => {
  const id = useId();
  return (
    <div className="flex flex-row w-full items-center h-10">
      <div className="w-[150px]">
        <label htmlFor={id} className="w-[150px] text-sm font-medium">
          {label.length > 0
            ? label[0].toUpperCase() + label.slice(1, label.length)
            : ""}
        </label>
        {error && error.message ? (
          <p className="text-xs text-red-500">{error.message}</p>
        ) : null}
      </div>
      <input
        id={id}
        className="flex-1 h-10 border rounded-md px-2"
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
        className="resize-none w-full border rounded-md p-2 placeholder:text-sm text-sm"
        rows={3}
        placeholder="Description"
      />
      {error && error.message ? (
        <p className="text-xs text-red-500">{error.message}</p>
      ) : null}
    </>
  );
};

const StatusInput = ({ label, register, required, error }: InputProps) => {
  const id1 = useId();
  const id2 = useId();

  return (
    <div className="flex flex-row w-full items-center h-10">
      <div className="w-[150px]">
        <p className="w-[150px] text-sm font-medium">
          {label.length > 0
            ? label[0].toUpperCase() + label.slice(1, label.length)
            : ""}
        </p>
        {error && error.message ? (
          <p className="text-xs text-red-500">{error.message}</p>
        ) : null}
      </div>
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
      <label htmlFor={id1}>Active</label>
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
      <label htmlFor={id2}>Disable</label>
    </div>
  );
};

const CategoryInput = ({
  label,
  value,
  onValueChanged,
  categories,
  error,
}: {
  label: Path<z.infer<typeof foodSchema>>;
  value: string;
  categories: string[];
  onValueChanged: (value: string | null) => any;
  error?: FieldError;
}) => {
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  return (
    <div className="flex flex-row items-baseline">
      <div className="w-[150px]">
        <h5 className="text-sm">Category</h5>
        {error && error.message ? (
          <p className="text-xs text-red-500">{error.message}</p>
        ) : null}
      </div>
      <div className="!m-0 flex min-h-[40px] flex-1 flex-row items-center rounded-md border border-input">
        <div className="h-full w-full flex-1">
          <SearchAndChooseButton
            value={value}
            placeholder="---Choose category---"
            searchPlaceholder="Search category..."
            onValueChanged={onValueChanged}
            choices={categories.map((v) => v)}
          />
        </div>
        <AddNewThingModal
          title="New category"
          placeholder="Category name"
          onAddClick={async () => {}}
        />
      </div>
    </div>
  );
};

const ImagesInput = ({
  fileUrls,
  onImageChanged,
}: {
  fileUrls: (string | null)[];
  onImageChanged: (file: File | null, index: number) => void;
}) => {
  return (
    <div className="flex flex-row w-full items-center h-20 justify-between">
      {fileUrls.map((fileUrl, index) => (
        <ChooseImageButton
          key={index}
          fileUrl={fileUrl}
          onImageChanged={(imageFile) => onImageChanged(imageFile, index)}
        />
      ))}
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
    <div className="relative mb-2 px-2 text-[0.85rem] m-2 p-2 rounded-md bg-slate-300">
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <div className="flex flex-row items-baseline">
            <p className="w-[80px] font-semibold">Size name</p>
            <input
              value={sizeName}
              onChange={(e) => onSizeNameChanged(e.target.value)}
              className="border-b border-slate-400 p-1 pb-0 max-w-44 bg-inherit flex-1 text-right"
            />
          </div>
          <div className="flex flex-row items-baseline">
            <p className="w-[80px] font-semibold">Price</p>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => onPriceChanged(e.target.valueAsNumber)}
              className="border-b border-slate-400 p-1 pb-0 text-end max-w-44 bg-inherit flex-1"
            />
          </div>
          <div className="flex flex-row items-baseline">
            <p className="w-[80px] font-semibold">Weight</p>
            <input
              value={weight}
              type="number"
              min={0}
              onChange={(e) => onWeightChanged(e.target.valueAsNumber)}
              className="border-b border-slate-400 p-1 pb-0 text-end max-w-44 bg-inherit flex-1"
            />
          </div>
        </div>
        <textarea
          placeholder="Note"
          value={note}
          onChange={(e) => onNoteChanged(e.target.value)}
          className="border-slate-400 rounded-md p-1 resize-none flex-1 min-h-full border bg-inherit scrollbar small-scrollbar"
        />
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1rem"
        height="1rem"
        viewBox="0 0 24 24"
        className="absolute right-[0.125rem] top-[0.125rem] rounded-full translate-x-1/2 -translate-y-1/2 bg-slate-300 hover:bg-slate-400 hover:cursor-pointer"
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
