"use client";
import MenuTable from "@/components/MenuTable/menu_table";
import { NewFoodForm } from "@/components/NewFoodForm/new_food_form";
import { Food } from "@/models/Food";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setFoods } from "@/redux/slices/food";
import FoodService from "@/services/foodService";
import { useEffect, useState } from "react";

export default function DashboardMenu() {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<Food[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await FoodService.getAllFood()
        .then((res) => {
          setData(res.data);
          dispatch(setFoods(res.data));
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, []);

  const [openNewFoodForm, setOpenNewFoodForm] = useState(false);
  const onDeleteClick = (id: number) => {
    const newData = data.filter((f) => f.id !== id);
    dispatch(setFoods(newData));
  };

  return (
    <section className="p-4 text-black">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold text-black my-8">Menu</h1>
        <button className="text-black" onClick={() => setOpenNewFoodForm(true)}>
          Add Food
        </button>
      </div>
      <MenuTable
        data={data}
        onDeleteClick={onDeleteClick}
        onEditClick={() => {}}
      />
      {openNewFoodForm && (
        <NewFoodForm closeForm={() => setOpenNewFoodForm(false)} />
      )}
    </section>
  );
}
