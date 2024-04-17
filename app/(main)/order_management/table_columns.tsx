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
import { Order, OrderStatus } from "@/models/Order";
import { Cart } from "@/models/Cart";
import { TextButton } from "@/components/buttons";
import { cn } from "@/utils/cn";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/datatable/dropdown-menu";
import OrderService from "@/services/orderService";
import { showErrorToast } from "@/components/toast";
import { LoadingIcon } from "@/components/icons";
import { useForceUpdate } from "framer-motion";
import { setOrders } from "@/redux/slices/order";

export const orderColumnTitles = {
  id: "Order ID",
  total: "Total",
  status: "Status",
  createdAt: "Created Date",
};

export const orderDefaultVisibilityState = {
  id: true,
  total: true,
  status: true,
  createdAt: false,
};

// function imageColumn(accessorKey: string, title: string): ColumnDef<Food> {
//   const col: ColumnDef<Food> = {
//     accessorKey: accessorKey,
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title={title} />
//     ),
//     cell: ({ row }) => {
//       const values: string[] = row.getValue(accessorKey);
//       let imageSrc = values.length > 0 ? values[0] : default_food_image;

//       return (
//         <div className="w-fit px-2">
//           <Image
//             alt="food image"
//             width={30}
//             height={30}
//             src={imageSrc}
//             className="mx-auto object-contain"
//           />
//         </div>
//       );
//     },
//     enableSorting: false,
//   };
//   return col;
// }

const statusColumn = (
  accessorKey: string,
  title: string,
  rowUpdating: number[],
  onStatusChange: (id: number, status: OrderStatus) => Promise<void>
): ColumnDef<Order> => {
  const col: ColumnDef<Order> = {
    accessorKey: accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      let value: OrderStatus = row.getValue(accessorKey);
      let styleButton = "";
      //styles of each status
      if (value === OrderStatus.PENDING)
        styleButton =
          "text-yellow-400 bg-yellow-50 hover:bg-yellow-100 outline-yellow-300";
      if (value === OrderStatus.ACCEPTED)
        styleButton =
          "text-green-400 bg-green-50 hover:bg-green-100 outline-green-300";
      if (value === OrderStatus.CANCELLED)
        styleButton =
          "text-orange-500 bg-orange-50 hover:bg-orange-100 focus:outline-orange-300";
      if (value === OrderStatus.DELIVERED)
        styleButton =
          "text-blue-500 bg-blue-50 hover:bg-blue-100 focus:outline-blue-300";
      if (value === OrderStatus.REJECTED)
        styleButton =
          "text-red-500 bg-red-50 hover:bg-red-100 focus:outline-red-300";
      const handleStatusChange = async (status: OrderStatus) => {
        const id = row.original.id;
        onStatusChange(id, status);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <TextButton
              content={
                rowUpdating.includes(row.original.id)
                  ? "Updating..."
                  : (value as OrderStatus)
              }
              className={cn(
                "w-[100px] gap-2 whitespace-nowrap ease-linear duration-100 py-1 rounded-md cursor-pointer outline outline-offset-0 outline-1",
                styleButton
              )}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="font-sans bg-white text-secondaryWord">
            {Object.keys(OrderStatus).map((key) => (
              <DropdownMenuCheckboxItem
                key={key}
                checked={value === key}
                onClick={(checked) => {
                  handleStatusChange(key as OrderStatus);
                }}
                className={cn(
                  "cursor-pointer ease-linear duration-100 bg-white",
                  key === OrderStatus.PENDING
                    ? "text-yellow-400 hover:bg-yellow-100"
                    : "",
                  key === OrderStatus.ACCEPTED
                    ? "text-green-400 hover:bg-green-100"
                    : "",
                  key === OrderStatus.CANCELLED
                    ? "text-orange-400 hover:bg-orange-100"
                    : "",
                  key === OrderStatus.DELIVERED
                    ? "text-blue-400 hover:bg-blue-100"
                    : "",
                  key === OrderStatus.REJECTED
                    ? "text-red-400 hover:bg-red-100"
                    : ""
                )}
              >
                {key}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: true,
  };
  return col;
};

export const orderTableColumns = (
  rowUpdating: number[],
  onStatusChange: (id: number, status: OrderStatus) => Promise<void>
): ColumnDef<Order>[] => {
  const columns: ColumnDef<Order>[] = [defaultSelectColumn<Order>()];

  for (let key in orderColumnTitles) {
    let col: ColumnDef<Order>;
    if (key === "status")
      col = statusColumn(
        key,
        orderColumnTitles[key],
        rowUpdating,
        onStatusChange
      );
    else col = defaultColumn<Order>(key, orderColumnTitles);
    columns.push(col);
  }

  return columns;
};
