"use client";
import MenuTable from "@/components/MenuTable/menu_table";
import { NewFoodForm } from "@/components/NewFoodForm/new_food_form";
import { TextButton } from "@/components/buttons";
import { CustomDatatable } from "@/components/datatable/custom_datatable";
import { Food } from "@/models/Food";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setFoods } from "@/redux/slices/food";
import FoodService from "@/services/foodService";
import { use, useEffect, useState } from "react";

import { cn } from "@/utils/cn";
import {
  menuColumnTitles,
  menuDefaultVisibilityState,
  menuTableColumns,
} from "./table_columns";
import { setFoodCategories } from "@/redux/slices/category";
import { disablePreloader, showPreloader } from "@/redux/slices/preloader";
import { showErrorToast } from "@/components/toast";
import { handleFilterColumn } from "@/utils/func";
import { Row } from "@tanstack/react-table";
import { FoodToReceive } from "@/convertor/foodConvertor";

export default function DashboardMenu() {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<Food[]>([]);
  const [filteredData, setFilteredData] = useState<Food[]>(data);
  const categories = useAppSelector((state: any) => state.foodCategory.value);
  const filterOptionKeys = Object.keys(menuColumnTitles)
    .filter((key) => key !== "images")
    .map((key) => key);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showPreloader());
      await FoodService.getAllFood()
        .then((res) => {
          const data = res.data.map((food) => FoodToReceive(food));
          setData(data);
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

  const handleFilterCategory = (filterInput: string, data: Food[]) => {
    const filteredData = data.filter((food) =>
      food.category.name.toLowerCase().includes(filterInput.toLowerCase())
    );
    return filteredData;
  };
  const handleFilterChange = (filterInput: string, col: string) => {
    console.log(filterInput, col);
    let filteredData = [];

    //special col that cannot filter as default
    if (col === "category")
      filteredData = handleFilterCategory(filterInput, data);
    else filteredData = handleFilterColumn(filterInput, col, data);
    setFilteredData(filteredData);
  };

  return (
    <div className="flex flex-col p-8 text-primaryWord">
      <div className="flex flex-row justify-between mb-4">
        <h1 className="text-4xl font-bold text-primary">Menu</h1>
      </div>
      <CustomDatatable
        data={filteredData}
        columns={menuTableColumns()}
        columnTitles={menuColumnTitles}
        buttons={[
          <div key={1} className="flex flex-row items-center justify-end gap-2">
            <TextButton
              content="Add new food"
              className="w-fit whitespace-nowrap py-2"
              onClick={() => setOpenNewFoodForm(true)}
            />
          </div>,
        ]}
        infoTabs={[
          {
            render(row, setShowTabs) {
              return <FoodDetailTab row={row} setShowTabs={setShowTabs} />;
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
        <NewFoodForm
          categories={categories}
          closeForm={() => setOpenNewFoodForm(false)}
          onNewFoodSubmit={(food: Food) => setData([...data, food])}
        />
      )}
    </div>
  );
}

const FoodDetailTab = ({
  row,
  setShowTabs,
}: {
  row: Row<Food>;
  setShowTabs: (value: boolean) => any;
}) => {
  const food = row.original;
  return (
    <div className="flex h-[300px] flex-col justify-between gap-4 py-2 pl-8 pr-4">
      Food detail
    </div>
  );
};
