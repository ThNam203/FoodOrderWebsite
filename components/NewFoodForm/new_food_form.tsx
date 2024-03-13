"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldError,
  FieldErrors,
  Form,
  FormState,
  Path,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import * as z from "zod";
import React, { useEffect, useId, useState } from "react";
import { ChooseImageButton } from "./choose_image_button";

const foodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is missing!" })
    .max(100, { message: "Name must be at most 100 characters!" }),
  status: z.string(),
  images: z.array(z.string().nullable()).min(0).max(5),
  sizes: z.array(
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
        .number()
        .min(0, { message: "Weight must be at least 0" })
        .max(Number.MAX_VALUE, {
          message: `Weight must be less than ${Number.MAX_VALUE}`,
        }),
      note: z.string(),
    })
  ),
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
  const [isCreatingNewProduct, setIsCreatingNewProduct] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
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
    console.log(values);
    // const dataForm: any = new FormData();
    // dataForm.append(
    //   "data",
    //   new Blob([JSON.stringify(data)], { type: "application/json" })
    // );
    // chosenImageFiles
    //   .filter((file) => file != null)
    //   .forEach((imageFile) => dataForm.append("files", imageFile));
    // setIsCreatingNewProduct(true);
    // ProductService.createNewProduct(dataForm)
    //   .then((result) => {
    //     onNewProductsAdded(result.data);
    //     onChangeVisibility(false);
    //   })
    //   .catch((e) => axiosUIErrorHandler(e, toast, router))
    //   .finally(() => {
    //     setIsCreatingNewProduct(false);
    //   });
  }

  return (
    <div className="fixed left-0 top-0 z-[100] flex h-screen w-screen items-center justify-center bg-black bg-opacity-30">
      <div
        className={
          "flex max-h-[95%] w-[95%] max-w-[600px] flex-col overflow-y-auto rounded-md bg-white p-4"
        }
      >
        <div className="mb-4 flex flex-row items-center justify-between">
          <h3 className="text-base font-semibold">Add new product</h3>
          <div
            className="w-4 h-4 bg-red-500 rounded-full p-1 hover:cursor-pointer hover:bg-slate-200"
            onClick={closeForm}
          />
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
            {/* <FormField
              control={form.control}
              name="productGroup"
              render={({ field }) => (
                <FormItem className="mb-2 flex flex-row">
                  <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                    <div className="flex flex-row items-center gap-2">
                      <h5 className="text-sm">Product group</h5>
                      <Info size={16} />
                    </div>
                    <FormMessage className="mr-2 text-xs" />
                  </FormLabel>
                  <FormControl>
                    <div className="!m-0 flex min-h-[40px] flex-1 flex-row items-center rounded-md border border-input">
                      <div className="h-full w-full flex-1">
                        <SearchAndChooseButton
                          value={field.value}
                          placeholder="---Choose group---"
                          searchPlaceholder="Search product..."
                          onValueChanged={(val) => {
                            form.setValue(
                              "productGroup",
                              val === null ? "" : val,
                              { shouldValidate: true }
                            );
                          }}
                          choices={productGroupChoices.map((v) => v.name)}
                        />
                      </div>
                      <AddNewThing
                        title="Add new group"
                        placeholder="Group's name"
                        open={openGroup}
                        onOpenChange={setOpenGroup}
                        onAddClick={addNewGroup}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            /> */}
            <StatusInput
              label="status"
              register={register}
              required
              error={errors.status}
            />
            <ImagesInput
              fileUrls={getValues("images")}
              onImageChanged={handleImageChosen}
            />
            <DescriptionInput
              label="description"
              register={register}
              required
              error={errors.description}
            />
            {/* <div className="mb-4 rounded-sm border">
            <FormField
              control={form.control}
              name="productProperties"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="bg-gray-200 p-3 text-sm">
                          <div className="flex flex-row gap-10">
                            <p>Product properties</p>
                            <NewProductPropertiesInputErrorFormMessage />
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-2">
                          <div className="flex flex-col">
                            {field.value
                              ? field.value.map((value, index) => {
                                  return (
                                    <div
                                      key={index}
                                      className="flex flex-row items-center gap-2"
                                    >
                                      <Popover>
                                        <PopoverTrigger className="w-[150px]">
                                          {!value.key ||
                                          value.key.length === 0 ? (
                                            <>
                                              <p className=" p-1 text-start">
                                                Choose property...
                                              </p>
                                            </>
                                          ) : (
                                            <div className="flex flex-row items-center justify-between">
                                              <p className=" p-1 text-start">
                                                {value.key}
                                              </p>
                                              <UpdatePropertyView
                                                property={value}
                                                onDeleteClick={onDeleteProperty}
                                                onUpdateClick={onUpdateProperty}
                                                onUpdateSuccess={(
                                                  newVal,
                                                  valId
                                                ) => {
                                                  const newValue =
                                                    field.value!.map((v) =>
                                                      v.id === valId
                                                        ? {
                                                            ...v,
                                                            key: newVal,
                                                          }
                                                        : v
                                                    );

                                                  form.setValue(
                                                    "productProperties",
                                                    newValue
                                                  );
                                                }}
                                                onDeleteSuccess={(
                                                  propertyId
                                                ) => {
                                                  form.setValue(
                                                    "productProperties",
                                                    field.value!.filter(
                                                      (v) => v.id !== propertyId
                                                    )
                                                  );
                                                }}
                                              ></UpdatePropertyView>
                                            </div>
                                          )}
                                        </PopoverTrigger>
                                        <PopoverContent
                                          className={cn(
                                            "max-h-[200px] overflow-auto p-0",
                                            scrollbar_style.scrollbar
                                          )}
                                        >
                                          {productPropertyChoices.length ===
                                          0 ? (
                                            <div className="flex flex-row items-center justify-between rounded-sm p-2 hover:bg-slate-300">
                                              <p className="select-none text-sm">
                                                No properties!
                                              </p>
                                            </div>
                                          ) : (
                                            productPropertyChoices.map(
                                              (choice, choiceIndex) => {
                                                return (
                                                  <div
                                                    key={choiceIndex}
                                                    className="flex flex-row items-center justify-between rounded-sm p-2 hover:cursor-pointer hover:bg-slate-300"
                                                    onClick={() => {
                                                      let newFormProperties: any;
                                                      if (
                                                        field.value![index]
                                                          .key === choice.name
                                                      ) {
                                                        field.value![
                                                          index
                                                        ].key = "";
                                                        newFormProperties = [
                                                          ...field.value!,
                                                        ];

                                                        form.setValue(
                                                          "productProperties",
                                                          newFormProperties
                                                        );
                                                      } else if (
                                                        !field.value!.every(
                                                          (
                                                            fieldVal,
                                                            fieldIdx
                                                          ) => {
                                                            return (
                                                              fieldVal.key !==
                                                              choice.name
                                                            );
                                                          }
                                                        )
                                                      ) {
                                                        toast({
                                                          description:
                                                            "Property has already been chosen",
                                                          variant:
                                                            "destructive",
                                                        });
                                                        return;
                                                      } else {
                                                        field.value![
                                                          index
                                                        ].key = choice.name;
                                                        newFormProperties = [
                                                          ...field.value!,
                                                        ];

                                                        form.setValue(
                                                          "productProperties",
                                                          newFormProperties
                                                        );
                                                      }
                                                      // important
                                                      const newFormData = {
                                                        ...form.getValues(),
                                                        productProperties:
                                                          newFormProperties,
                                                      };
                                                      updateSameTypeProducts(
                                                        newFormData
                                                      );
                                                    }}
                                                  >
                                                    <p className="text-sm">
                                                      {choice.name}
                                                    </p>
                                                    {value.key ===
                                                    choice.name ? (
                                                      <Check size={16} />
                                                    ) : null}
                                                  </div>
                                                );
                                              }
                                            )
                                          )}
                                        </PopoverContent>
                                      </Popover>
                                      <div className="ml-8 flex flex-1 flex-row flex-wrap items-center gap-1">
                                        {value.values.map((keyVal, keyIdx) => (
                                          <div
                                            key={keyIdx}
                                            className="flex flex-row items-center gap-[2px] rounded-md bg-blue-400 p-1 text-white"
                                          >
                                            <p>{keyVal}</p>
                                            <X
                                              size={16}
                                              color="white"
                                              className="p-[2px] hover:cursor-pointer"
                                              onClick={(e) => {
                                                onProductPropertyValueDelete(
                                                  index,
                                                  keyIdx,
                                                  field.value!
                                                );
                                              }}
                                            />
                                          </div>
                                        ))}
                                        <Input
                                          placeholder="Type value and enter"
                                          value={
                                            productPropertyInputValues[index]
                                          }
                                          onChange={(e) => {
                                            setProductPropertyInputValues(
                                              (prev) => {
                                                prev[index] = e.target.value;
                                                return [...prev];
                                              }
                                            );
                                          }}
                                          onBlur={() =>
                                            updateSameTypeProducts(
                                              form.getValues()
                                            )
                                          }
                                          onKeyDown={(e) => {
                                            onProductPropertyInputKeyDown(
                                              e,
                                              productPropertyInputValues[index],
                                              field.value!,
                                              index
                                            );
                                          }}
                                          className="h-[35px] w-[200px] rounded-none border-0 border-b focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                        />
                                      </div>
                                      <Trash
                                        size={16}
                                        className="mr-1 hover:cursor-pointer"
                                        fill="black"
                                        onClick={(e) => {
                                          const newProperties =
                                            field.value!.filter(
                                              (_, idx) => idx !== index
                                            );

                                          form.setValue(
                                            "productProperties",
                                            newProperties
                                          );
                                          setProductPropertyInputValues(
                                            (prev) =>
                                              prev.filter(
                                                (_, idx) => idx !== index
                                              )
                                          );

                                          updateSameTypeProducts({
                                            ...form.getValues(),
                                            productProperties: newProperties,
                                          });
                                        }}
                                      />
                                    </div>
                                  );
                                })
                              : null}
                          </div>
                          <div className="flex flex-row">
                            <Button
                              variant={"green"}
                              className="ml-1 mt-2 h-[35px] border"
                              type="button"
                              onClick={(e) => {
                                let newVal: {
                                  id: number;
                                  key: string;
                                  values: string[];
                                }[];

                                if (field.value === null)
                                  newVal = [
                                    { id: 123123, key: "", values: [] },
                                  ];
                                else
                                  newVal = [
                                    ...field.value,
                                    { id: 123123, key: "", values: [] },
                                  ];
                                form.setValue("productProperties", newVal, {
                                  shouldValidate: false,
                                });
                                setProductPropertyInputValues((prev) => [
                                  ...prev,
                                  "",
                                ]);
                              }}
                            >
                              <Plus size={16} className="mr-2" />
                              New property
                            </Button>
                            <ButtonAddNewThing
                              triggerTitle="Add property"
                              title="Add new property"
                              placeholder="Property's name"
                              open={openProperty}
                              onOpenChange={setOpenProperty}
                              onAddClick={addNewProperty}
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </FormControl>
                </FormItem>
              )}
            />
          </div> */}
            {/* <div className="mb-4 rounded-sm border">
            <FormField
              control={form.control}
              name="units"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="bg-gray-200 p-3 text-sm">
                          <div className="flex flex-row gap-10">
                            <p>Product units</p>
                            <NewProductUnitInputErrorFormMessage />
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col">
                            <div className="m-2 ml-4 flex flex-row items-center gap-4">
                              <p>Base unit</p>
                              <Input
                                value={field.value?.baseUnit}
                                onChange={(e) => {
                                  form.setValue(
                                    "units",
                                    {
                                      baseUnit: e.target.value,
                                      otherUnits: field.value?.otherUnits,
                                    },
                                    { shouldValidate: true }
                                  );
                                }}
                                onBlur={() =>
                                  updateSameTypeProducts(form.getValues())
                                }
                              />
                            </div>
                            {field.value?.otherUnits
                              ? field.value.otherUnits.map((value, index) => {
                                  return (
                                    <ProductNewUnitView
                                      key={index}
                                      unitName={value.unitName}
                                      price={value.price}
                                      exchangeValue={value.exchangeValue}
                                      originalPrice={value.originalPrice}
                                      onUnitNameBlur={() =>
                                        updateSameTypeProducts(form.getValues())
                                      }
                                      onExchangeValueBlur={() =>
                                        updatePriceUnits()
                                      }
                                      onPriceBlur={() => updatePriceUnits()}
                                      onOriginalPriceBlur={() =>
                                        updatePriceUnits()
                                      }
                                      onUnitNameChanged={(val: string) => {
                                        const newObj = {
                                          ...field.value!.otherUnits![index],
                                          unitName: val,
                                        };
                                        field.value!.otherUnits![index] =
                                          newObj;
                                        form.setValue(
                                          "units.otherUnits",
                                          [...field.value!.otherUnits!],

                                          { shouldValidate: true }
                                        );
                                      }}
                                      onPriceChanged={(val: number) => {
                                        const newObj = {
                                          ...field.value!.otherUnits![index],
                                          price: val,
                                        };
                                        field.value!.otherUnits![index] =
                                          newObj;
                                        form.setValue(
                                          "units",
                                          {
                                            baseUnit: field.value!.baseUnit,
                                            otherUnits: [
                                              ...field.value!.otherUnits!,
                                            ],
                                          },
                                          { shouldValidate: true }
                                        );
                                      }}
                                      onOriginalPriceChanged={(val: number) => {
                                        const newObj = {
                                          ...field.value!.otherUnits![index],
                                          originalPrice: val,
                                        };
                                        field.value!.otherUnits![index] =
                                          newObj;
                                        form.setValue(
                                          "units",
                                          {
                                            baseUnit: field.value!.baseUnit,
                                            otherUnits: [
                                              ...field.value!.otherUnits!,
                                            ],
                                          },
                                          { shouldValidate: true }
                                        );
                                      }}
                                      onExchangeValueChanged={(val: number) => {
                                        const newObj = {
                                          ...field.value!.otherUnits![index],
                                          exchangeValue: val,
                                        };
                                        field.value!.otherUnits![index] =
                                          newObj;
                                        form.setValue(
                                          "units",
                                          {
                                            baseUnit: field.value!.baseUnit,
                                            otherUnits: [
                                              ...field.value!.otherUnits!,
                                            ],
                                          },
                                          { shouldValidate: true }
                                        );
                                      }}
                                      onRemoveClick={() => {
                                        const newUnits = {
                                          baseUnit: field.value!.baseUnit,
                                          otherUnits:
                                            field.value!.otherUnits!.filter(
                                              (_, idx) => idx !== index
                                            ),
                                        };
                                        form.setValue("units", newUnits, {
                                          shouldValidate: false,
                                        });
                                        updateSameTypeProducts({
                                          ...form.getValues(),
                                          units: newUnits,
                                        });
                                      }}
                                    />
                                  );
                                })
                              : null}
                          </div>
                          <Button
                            variant={"green"}
                            type="button"
                            className="ml-4 mt-2 h-[35px] border"
                            onClick={(e) => {
                              e.preventDefault();
                              if (
                                field.value === undefined ||
                                field.value.baseUnit.length === 0
                              ) {
                                form.setError(
                                  "units",
                                  { message: "Please specify base unit!" },
                                  { shouldFocus: true }
                                );
                                return;
                              }

                              const newUnit = {
                                unitName: "",
                                exchangeValue: 1,
                                originalPrice: form.getValues("originalPrice"),
                                price: form.getValues("productPrice"),
                              };

                              const newVal =
                                field.value!.otherUnits === undefined
                                  ? [newUnit]
                                  : [...field.value!.otherUnits!, newUnit];
                              form.setValue("units", {
                                baseUnit: field.value!.baseUnit,
                                otherUnits: newVal,
                              });
                            }}
                          >
                            <Plus size={16} className="mr-2" />
                            Add unit
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </FormControl>
                </FormItem>
              )}
            />
          </div> */}
          </div>
          <div className="flex flex-row gap-4 mt-4">
            <div className="flex-1" />
            <button
              type="submit"
              className="min-w-[150px] px-4 uppercase bg-green-600 text-white rounded-sm py-2"
              disabled={isCreatingNewProduct}
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
              disabled={isCreatingNewProduct}
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
      >
        {" "}
      </textarea>
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
        <label htmlFor="label" className="w-[150px] text-sm font-medium">
          {label.length > 0
            ? label[0].toUpperCase() + label.slice(1, label.length)
            : ""}
        </label>
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
