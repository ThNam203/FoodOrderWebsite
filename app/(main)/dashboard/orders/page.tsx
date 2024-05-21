"use client";
import { Food } from "@/models/Food";
import { useAppDispatch } from "@/redux/hooks";
import { setFoods } from "@/redux/slices/food";
import FoodService from "@/services/foodService";
import { useEffect, useState } from "react";

export default function DashboardOrder() {
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

  return (
    <section className="p-4 text-black">
      <h1 className="text-4xl font-bold text-black my-8">Orders</h1>
      
    </section>
  );
}
