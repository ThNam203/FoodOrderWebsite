import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./my_table_column_header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { ReactNode } from "react";
import { format } from "date-fns";
import { formatDate, formatPrice } from "@/utils/func";
import { Checkbox } from "@nextui-org/react";
import { TextButton } from "../buttons";

function defaultColumn<T>(
  accessorKey: string,
  columnHeader: object
): ColumnDef<T> {
  const col: ColumnDef<T> = {
    accessorKey: accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={columnHeader[accessorKey as keyof typeof columnHeader]}
      />
    ),
    cell: ({ row }) => {
      const value: ReactNode = row.getValue(accessorKey);
      let formatedValue: ReactNode = "";
      if (accessorKey === "maxValue") console.log("type", typeof value);
      if (value instanceof Date) formatedValue = formatDate(value, "datetime");
      else if (
        (accessorKey === "createdAt" ||
          accessorKey === "createdDate" ||
          accessorKey === "issuedDate" ||
          accessorKey === "usedDate") &&
        value !== null &&
        value !== undefined &&
        new Date(String(value)) instanceof Date
      ) {
        formatedValue = format(new Date(String(value)), "MM/dd/yyyy");
      } else if (
        typeof value === "number" &&
        accessorKey !== "phoneNumber" &&
        accessorKey !== "cccd"
      )
        formatedValue = formatPrice(value);
      else formatedValue = value;

      return <p className="px-2">{formatedValue}</p>;
    },
  };
  return col;
}

function defaultSelectColumn<T>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        isSelected={table.getIsAllPageRowsSelected()}
        onValueChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        isSelected={row.getIsSelected()}
        onValueChange={(value) => row.toggleSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        className="mr-5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

function defaultIndexColumn<T>(): ColumnDef<T> {
  return {
    accessorKey: "#",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <p className="px-2">{row.index + 1}</p>,
  };
}

function defaultConfigColumn<T>(): ColumnDef<T> {
  return {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const rowData = row.original;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <TextButton className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </TextButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  };
}

function getColumns<T>(
  columnHeader: object,
  hasConfigColumn?: boolean
): ColumnDef<T>[] {
  const columns: ColumnDef<T>[] = [
    defaultSelectColumn<T>(),
    defaultIndexColumn<T>(),
  ];
  for (let key in columnHeader) {
    const col: ColumnDef<T> = defaultColumn<T>(key, columnHeader);
    columns.push(col);
  }
  if (hasConfigColumn) {
    const lastCol: ColumnDef<T> = defaultConfigColumn();
    columns.push(lastCol);
  }
  return columns;
}

export {
  defaultColumn,
  defaultSelectColumn,
  defaultIndexColumn,
  defaultConfigColumn,
  getColumns,
};
