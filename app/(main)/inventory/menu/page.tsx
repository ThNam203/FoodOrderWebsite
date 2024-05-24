"use client";
import { TextButton } from "@/components/buttons";
import { CustomDatatable } from "@/components/datatable/custom_datatable";
import { Food } from "@/models/Food";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setFoods } from "@/redux/slices/food";
import FoodService from "@/services/foodService";
import { useEffect, useState } from "react";

import ImageCarousel, {
  CarouselItem,
} from "@/components/CustomCarousel/image_carousel";
import { FoodForm } from "@/components/NewFoodForm/food_form";
import {
  ConfirmDialog,
  ConfirmDialogType,
  useConfirmDialog,
} from "@/components/confirm_dialog";
import { showErrorToast } from "@/components/toast";
import { FoodToReceive } from "@/convertor/foodConvertor";
import { setFoodCategories } from "@/redux/slices/category";
import { disablePreloader, showPreloader } from "@/redux/slices/preloader";
import { cn } from "@/utils/cn";
import { formatDate, handleFilterColumn } from "@/utils/func";
import { Row } from "@tanstack/react-table";
import { Plus, RefreshCw, Trash } from "lucide-react";
import {
  menuColumnTitles,
  menuDefaultVisibilityState,
  menuTableColumns,
} from "./table_columns";
// import CustomCarousel, { CarouselItem } from "@/components/custom_carousel";

export default function DashboardMenu() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.food.allFood);
  const [filteredData, setFilteredData] = useState<Food[]>(data);
  const categories = useAppSelector((state: any) => state.foodCategory.value);
  const filterOptionKeys = Object.keys(menuColumnTitles)
    .filter((key) => key !== "images")
    .map((key) => key);
  const [selectedFood, setSelectedFood] = useState<Food | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showPreloader());
      await FoodService.getAllFood()
        .then((res) => {
          const data = res.data.map((food) => FoodToReceive(food));
          dispatch(setFoods(data));
        })
        .catch((err) => {
          showErrorToast(err.message);
        });
      await FoodService.getCategories()
        .then((data) => dispatch(setFoodCategories(data.data)))
        .catch((err) => {
          showErrorToast(err.message);
        });
      dispatch(disablePreloader());
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const [openNewFoodForm, setOpenNewFoodForm] = useState(false);
  const onDeleteClick = (id: number) => {
    const newData = data.filter((f) => f.id !== id);
    dispatch(setFoods(newData));
  };

  const handleCategoryFilter = (filterInput: string, data: Food[]) => {
    const filteredData = data.filter((food) =>
      food.category.name.toLowerCase().includes(filterInput.toLowerCase())
    );
    return filteredData;
  };
  const handleCreatedDateFilter = (filterInput: string, data: Food[]) => {
    const filteredData = data.filter((food) =>
      formatDate(food.createdAt).includes(filterInput.toString())
    );
    return filteredData;
  };

  const handleFilterChange = (filterInput: string, col: string) => {
    console.log(filterInput, col);
    let filteredData: Food[] = [];
    if (col === "") filteredData = getFilterAllTableData(filterInput);
    else filteredData = getDataFilter(filterInput, col);
    setFilteredData(filteredData);
  };

  const getDataFilter = (filterInput: string, col: string) => {
    //special col that cannot filter as default
    if (col === "category") return handleCategoryFilter(filterInput, data);
    if (col === "createdAt") return handleCreatedDateFilter(filterInput, data);
    return handleFilterColumn(filterInput, col, data);
  };
  const getFilterAllTableData = (filterInput: string) => {
    let filteredAllTableData: Set<Food> = new Set();
    Object.keys(menuColumnTitles).forEach((col) => {
      if (col === "images") return;
      const filteredData = getDataFilter(filterInput, col);
      filteredData.forEach((order) => filteredAllTableData.add(order));
    });
    const filteredData = Array.from(filteredAllTableData);
    return filteredData;
  };

  const handleDeleteFood = async (id: number) => {
    await FoodService.deleteFood(id)
      .then(() => {
        const newData = data.filter((f) => f.id !== id);
        dispatch(setFoods(newData));
      })
      .catch((err) => {
        showErrorToast(err.message);
      });
  };

  return (
    <div className="h-screen flex flex-col p-8 text-primaryWord overflow-y-scroll">
      <div className="flex flex-row justify-between mb-4">
        <h1 className="text-4xl font-bold text-primary">Inventory</h1>
      </div>
      <CustomDatatable
        data={filteredData}
        columns={menuTableColumns()}
        columnTitles={menuColumnTitles}
        buttons={[
          <div key={1} className="flex flex-row items-center justify-end gap-2">
            <TextButton
              iconBefore={<Plus size={16} />}
              className="w-fit whitespace-nowrap gap-2 py-2"
              onClick={() => setOpenNewFoodForm(true)}
            >
              Add new food
            </TextButton>
          </div>,
        ]}
        infoTabs={[
          {
            render(row, setShowTabs) {
              return (
                <FoodDetailTab
                  row={row}
                  setShowTabs={setShowTabs}
                  onDeleteFood={handleDeleteFood}
                  onUpdateFood={() => {
                    setSelectedFood(row.original);
                    setOpenNewFoodForm(true);
                  }}
                />
              );
            },
            tabName: "Food details",
          },
        ]}
        config={{
          defaultVisibilityState: menuDefaultVisibilityState,
          showFilterButton: true,
          filterOptionKeys: filterOptionKeys,
          showDataTableViewOptions: true,
          onFilterChange: handleFilterChange,
        }}
      />
      {openNewFoodForm && (
        <FoodForm
          food={selectedFood}
          categories={categories}
          closeForm={() => {
            setSelectedFood(undefined);
            setOpenNewFoodForm(false);
          }}
        />
      )}
    </div>
  );
}

const FoodDetailTab = ({
  row,
  setShowTabs,
  onDeleteFood,
  onUpdateFood,
}: {
  row: Row<Food>;
  onUpdateFood?: () => void;
  setShowTabs: (value: boolean) => any;
  onDeleteFood?: (id: number) => void;
}) => {
  const food = row.original;
  const carouselItems: CarouselItem[] = food.images.map((image) => {
    console.log("image", image);
    return {
      image: image,
    };
  });
  const { isOpen, setOpen, content, title, type, setConfirmDialog } =
    useConfirmDialog();
  return (
    <div className="flex h-fit flex-col gap-4 px-4 py-4">
      <div className="flex flex-row gap-4">
        <div
          className={cn("w-[250px] max-h-[200px] rounded-sm overflow-hidden")}
        >
          <ImageCarousel carouselItems={carouselItems} />
        </div>
        <div className="flex shrink-[5] grow-[5] flex-row gap-2 text-[0.8rem]">
          <div className="flex flex-1 flex-col">
            <RowInfo label="Food ID:" value={food.id.toString()} />
            <RowInfo label="Food name:" value={food.name} />
            <RowInfo
              label="Status:"
              value={food.status ? "Active" : "Disable"}
            />
            <RowInfo label="Category:" value={food.category.name} />
            <RowInfo label="Tags:" value={food.tags.join(", ")} />
          </div>
          <div className="flex flex-1 flex-col">
            <RowInfo
              label="Description:"
              value={food.description}
              showTextArea
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2 justify-end">
        <TextButton
          className="bg-green-500 gap-2"
          onClick={onUpdateFood}
          iconBefore={<RefreshCw size={16} />}
        >
          Update food
        </TextButton>
        <TextButton
          onClick={() => {
            setConfirmDialog(
              "Delete food",
              "Are you sure you want to delete this food?",
              "warning" as ConfirmDialogType
            );
            setOpen(true);
          }}
          className="bg-red-500 gap-2"
          iconBefore={<Trash size={16} />}
        >
          Delete
        </TextButton>
      </div>
      <ConfirmDialog
        isOpen={isOpen}
        onOpenChange={setOpen}
        title="Delete food"
        content="Are you sure you want to delete this food?"
        onAccept={() => {
          if (!onDeleteFood) return;
          setOpen(false);
          onDeleteFood(food.id);
          setShowTabs(false);
        }}
      />
    </div>
  );
};

const RowInfo = ({
  label,
  value,
  showTextArea = false,
}: {
  label: string;
  value: string;
  showTextArea?: boolean;
}) => {
  return (
    <div
      className={cn(
        "mb-2 font-medium",
        showTextArea ? "" : "flex flex-row border-b"
      )}
    >
      <p className="w-[100px] font-semibold">{label}</p>
      {showTextArea ? (
        <textarea
          readOnly
          disabled
          className={cn("h-[120px] w-full resize-none border-2 p-1")}
          defaultValue={value}
        ></textarea>
      ) : (
        <p>{value}</p>
      )}
    </div>
  );
};
