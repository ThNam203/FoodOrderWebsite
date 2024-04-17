"use client";
import { DataTableColumnHeader } from "@/components/datatable/my_table_column_header";
import {
  defaultColumn,
  defaultIndexColumn,
  defaultSelectColumn,
} from "@/components/datatable/my_table_default_column";
import { Food, FoodCategory } from "@/models/Food";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import default_food_image from "@/public/images/default_food.jpg";

export const menuColumnTitles = {
  id: "Food ID",
  name: "Name",
  images: "Image",
  category: "Category",
  description: "Description",
  createdAt: "Created Date",
};

export const menuDefaultVisibilityState = {
  id: true,
  name: true,
  images: true,
  category: true,
  description: true,
  createdAt: false,
};

function imageColumn(accessorKey: string, title: string): ColumnDef<Food> {
  const col: ColumnDef<Food> = {
    accessorKey: accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      const values: string[] = row.getValue(accessorKey);
      let imageSrc = values.length > 0 ? values[0] : default_food_image;

      return (
        <div className="w-fit px-2">
          <Image
            alt="food image"
            width={30}
            height={30}
            src={imageSrc}
            className="mx-auto object-contain"
          />
        </div>
      );
    },
    enableSorting: false,
  };
  return col;
}

function categoryColumn(accessorKey: string, title: string): ColumnDef<Food> {
  const col: ColumnDef<Food> = {
    accessorKey: accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      const value: FoodCategory = row.getValue(accessorKey);

      return <p className="px-2">{value.name}</p>;
    },
    enableSorting: true,
  };
  return col;
}

export const menuTableColumns = (): ColumnDef<Food>[] => {
  const columns: ColumnDef<Food>[] = [
    defaultSelectColumn<Food>(),
    defaultIndexColumn<Food>(),
  ];

  for (let key in menuColumnTitles) {
    let col: ColumnDef<Food>;
    if (key === "images") col = imageColumn(key, menuColumnTitles[key]);
    else if (key === "category")
      col = categoryColumn(key, menuColumnTitles[key]);
    else col = defaultColumn<Food>(key, menuColumnTitles);
    columns.push(col);
  }

  return columns;
};
