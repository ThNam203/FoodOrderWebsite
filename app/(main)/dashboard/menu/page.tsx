"use client";
import MenuTable from "@/components/MenuTable/menu_table";
import { NewFoodForm } from "@/components/NewFoodForm/new_food_form";
import { useState } from "react";

export default function DashboardMenu() {
  const [data, setData] = useState([
    {
      foodId: 1,
      name: "Pizza",
      price: 10,
      category: "Italian",
      images: [
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      description: "Delicious pizza with assorted toppings.",
      createdAt: new Date().toISOString(),
    },
    {
      foodId: 2,
      name: "Sushi",
      price: 15,
      category: "Japanese",
      images: [
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      description: "Fresh sushi rolls with wasabi and soy sauce.",
      createdAt: new Date().toISOString(),
    },
  ]);

  const [openNewFoodForm, setOpenNewFoodForm] = useState(false);
  const onDeleteClick = (foodId: number) =>
    setData(data.filter((f) => f.foodId !== foodId));

  return (
    <section className="p-4 text-black">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold text-black my-8">Menu</h1>
        <button className="text-black" onClick={() => setOpenNewFoodForm(true)}>Add Food</button>
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
