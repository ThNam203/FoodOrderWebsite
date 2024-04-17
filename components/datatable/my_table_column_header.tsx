import { cn } from "@/utils/cn";
import { Column } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, Ban, EyeOff } from "lucide-react";
import { CollumnHeaderButton, TextButton } from "../buttons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  return (
    <div
      className={cn(
        "font-sans w-min flex items-center space-x-2 text-primaryWord justify-stretch",
        className
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <CollumnHeaderButton
            iconAfter={
              column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="h-4 w-4" />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : (
                <div className="h-4 w-4" />
              )
            }
            canSort={column.getCanSort()}
            content={title}
            className="data-[state=open]:bg-accent text-left"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className={cn(
            "font-sans bg-white text-secondaryWord",
            column.getCanSort() ? "" : "hidden"
          )}
        >
          <DropdownMenuItem
            className="cursor-pointer hover:bg-gray-100 ease-linear duration-100"
            onClick={() => column.toggleSorting(false)}
          >
            <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer hover:bg-gray-100 ease-linear duration-100"
            onClick={() => column.toggleSorting(true)}
          >
            <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer hover:bg-gray-100 ease-linear duration-100"
            onClick={() => column.clearSorting()}
          >
            <Ban className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            No sorting
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer hover:bg-gray-100 ease-linear duration-100"
            onClick={() => column.toggleVisibility(false)}
          >
            <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export { DataTableColumnHeader };
