"use client";
import MenuTable from "@/components/MenuTable/menu_table";
import { NewFoodForm } from "@/components/NewFoodForm/new_food_form";
import { TextButton } from "@/components/buttons";
import { CustomDatatable } from "@/components/datatable/custom_datatable";
import { Food } from "@/models/Food";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setFoods } from "@/redux/slices/food";
import FoodService from "@/services/foodService";
import { PageWithFilters } from "@/utils/ui";
import { useEffect, useState } from "react";

import { cn } from "@/utils/cn";
import {
  menuColumnTitles,
  menuDefaultVisibilityState,
  menuTableColumns,
} from "./table_columns";
import { setFoodCategories } from "@/redux/slices/category";
import { disablePreloader, showPreloader } from "@/redux/slices/preloader";
import { showErrorToast } from "@/components/toast";

export default function DashboardMenu() {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<Food[]>([]);
  const categories = useAppSelector((state: any) => state.foodCategory.value);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showPreloader());
      await FoodService.getAllFood()
        .then((res) => {
          setData(res.data);
          dispatch(setFoods(res.data));
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

  const [openNewFoodForm, setOpenNewFoodForm] = useState(false);
  const onDeleteClick = (id: number) => {
    const newData = data.filter((f) => f.id !== id);
    dispatch(setFoods(newData));
  };

  const filters = [<div key={1}></div>];

  return (
    <PageWithFilters title="Menu" filters={filters}>
      <div className="flex flex-col p-8 text-primaryWord">
        <div className="flex flex-row justify-between mb-4">
          <h1 className="text-4xl font-bold text-primary">Menu</h1>
        </div>
        <CustomDatatable
          data={data}
          columns={menuTableColumns()}
          columnTitles={menuColumnTitles}
          buttons={[
            <div
              key={1}
              className="flex flex-row items-center justify-end gap-2"
            >
              <TextButton
                content="Add new food"
                className="w-fit whitespace-nowrap py-2"
                onClick={() => setOpenNewFoodForm(true)}
              />
            </div>,
          ]}
          config={{
            defaultVisibilityState: menuDefaultVisibilityState,
            showDataTableViewOptions: true,
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
    </PageWithFilters>
  );
}
