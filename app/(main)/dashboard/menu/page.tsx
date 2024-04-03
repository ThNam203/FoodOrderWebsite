"use client";
import MenuTable from "@/components/MenuTable/menu_table";
import { NewFoodForm } from "@/components/NewFoodForm/new_food_form";
import { Food } from "@/models/Food";
import FoodService from "@/services/foodService";
import { useEffect, useState } from "react";

export default function DashboardMenu() {
  const [data, setData] = useState<Food[]>([
    {
      id: 1,
      name: "Pizza",
      rating: 3,
      category: {
        id: 777777,
        name: "Italian",
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      images: [
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      description: "Delicious pizza with assorted toppings.",
      createdDate: new Date().toISOString(),
      isDeleted: false,
      foodSizes: [
        {
          id: 1,
          name: "Default",
          weight: 100,
          note: "6 pieces",
          price: 10,
        },
      ],
      tags: ["pizza", "italian"],
    },
    {
      id: 2,
      name: "Sushi",
      rating: 3,
      category: {
        id: 777777,
        name: "Japanese",
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      images: [
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      description: "Fresh sushi rolls with wasabi and soy sauce.",
      createdDate: new Date().toISOString(),
      isDeleted: false,
      foodSizes: [
        {
          id: 1,
          name: "Default",
          weight: 100,
          note: "6 pieces",
          price: 10,
        },
      ],
      tags: ["sushi", "japanese"],
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      await FoodService.getAllFood()
        .then((res) => {
          setData([...data, ...res.data]);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, []);

  const [openNewFoodForm, setOpenNewFoodForm] = useState(false);
  const onDeleteClick = (id: number) =>
    setData(data.filter((f) => f.id !== id));

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
