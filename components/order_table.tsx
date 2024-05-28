"use client";
import IndeterminateCheckbox from "@/components/indeterminate_checkbox";
import { Food } from "@/models/Food";
import {
  CellContext,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function OrderTable({
  data,
  onDeleteClick,
  onEditClick,
}: {
  data: Food[];
  onDeleteClick: (foodId: number) => any;
  onEditClick: (foodId: number) => any;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<Food>();
  const columns = [
    columnHelper.display({
      id: "select",
      maxSize: 30,
      enableResizing: false,
      enableSorting: false,
      header: ({ table }) => (
        <div className="px-1 flex items-center justify-center">
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div>
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        </div>
      ),
    }),
    columnHelper.accessor("id", {
      maxSize: 30,
      enableResizing: false,
      header: (h) => "Id",
      cell: (info) => <CellDefaultTemplate info={info} />,
    }),
    columnHelper.accessor("name", {
      maxSize: 100,
      header: (h) => "Name",
      cell: (info) => <CellDefaultTemplate info={info} />,
    }),
    columnHelper.accessor("images", {
      maxSize: 5,
      enableResizing: false,
      enableSorting: false,
      header: (h) => "Image",
      cell: (info) => <ImageCell info={info} />,
    }),
    columnHelper.accessor("category.name", {
      maxSize: 100,
      header: (h) => "Category",
      cell: (info) => <CellDefaultTemplate info={info} />,
    }),
    columnHelper.accessor("description", {
      header: (h) => "Description",
      cell: (info) => <CellDefaultTemplate info={info} />,
    }),
    columnHelper.display({
      id: "actions",
      size: 1,
      enableResizing: false,
      enableSorting: false,
      cell: ({ row }) => (
        <RowEditCell
          onDeleteClick={() => onDeleteClick(row.original.id)}
          onEditClick={() => {}}
        />
      ),
    }),
  ];

  const table = useReactTable<Food>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    state: {
      sorting,
    },
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });
  return (
    <>
      <table className="border-2 w-full text-black">
        <thead className="h-12 border-b-2">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    className="text-start relative select-none"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1rem"
                              height="1rem"
                              viewBox="0 0 24 24"
                              className="inline-block ml-1"
                            >
                              <path
                                fill="black"
                                d="M18.2 13.3L12 7l-6.2 6.3c-.2.2-.3.5-.3.7s.1.5.3.7c.2.2.4.3.7.3h11c.3 0 .5-.1.7-.3c.2-.2.3-.5.3-.7s-.1-.5-.3-.7"
                              />
                            </svg>
                          ),
                          desc: (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1rem"
                              height="1rem"
                              viewBox="0 0 24 24"
                              className="inline-block ml-1"
                            >
                              <path
                                fill="black"
                                d="M5.8 9.7L12 16l6.2-6.3c.2-.2.3-.5.3-.7s-.1-.5-.3-.7c-.2-.2-.4-.3-.7-.3h-11c-.3 0-.5.1-.7.3c-.2.2-.3.4-.3.7s.1.5.3.7"
                              />
                            </svg>
                          ),
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                    {header.column.getCanResize() && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1rem"
                        height="1rem"
                        viewBox="0 0 24 24"
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 hover:cursor-grab hover:opacity-80 opacity-10 ${
                          header.column.getIsResizing()
                            ? "hover:cursor-grabbing"
                            : ""
                        }`}
                      >
                        <path
                          fill="black"
                          d="M18 16v-3h-3v9h-2V2h2v9h3V8l4 4zM2 12l4 4v-3h3v9h2V2H9v9H6V8z"
                        />
                      </svg>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b-2">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="align-middle h-12 text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {/* <tfoot>
          {table.getFooterGroups().map((footerGroup) => {
            console.log(footerGroup)
            return (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          )})}
        </tfoot> */}
      </table>
    </>
  );
}

const CellDefaultTemplate = ({
  info,
  className,
}: {
  info: CellContext<Food, any>;
  className?: "";
}) => {
  return (
    <p
      className={twMerge("text-start", className)}
      style={{
        overflow: "hidden",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        lineClamp: 2,
        WebkitBoxOrient: "vertical",
      }}
    >
      {info.getValue()}
    </p>
  );
};

const ImageCell = ({
  info,
  className,
}: {
  info: CellContext<Food, string[]>;
  className?: "";
}) => {
  return (
    <div className={twMerge("w-14 h-10", className)}>
      <Image
        width={56}
        height={40}
        className="object-contain w-full h-full object-center"
        src={info.getValue()[0] ?? ""}
        alt="food image"
      />
    </div>
  );
};

const RowEditCell = ({
  onEditClick,
  onDeleteClick,
}: {
  onEditClick: () => any;
  onDeleteClick: () => any;
}) => {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.7rem"
        height="1.7rem"
        viewBox="0 0 1024 1024"
        onClick={() => setShowEdit(!showEdit)}
        className="hover:cursor-pointer rounded-full hover:bg-slate-500 p-1 mx-auto"
      >
        <path
          fill="black"
          d="M456 231a56 56 0 1 0 112 0a56 56 0 1 0-112 0m0 280a56 56 0 1 0 112 0a56 56 0 1 0-112 0m0 280a56 56 0 1 0 112 0a56 56 0 1 0-112 0"
        />
      </svg>
      {showEdit && (
        <ActionsDialog
          closeDialog={() => setShowEdit(false)}
          onDeleteClick={onDeleteClick}
          onEditClick={onEditClick}
        />
      )}
    </div>
  );
};

const ActionsDialog = ({
  closeDialog,
  onEditClick,
  onDeleteClick,
}: {
  closeDialog: () => any;
  onEditClick: () => any;
  onDeleteClick: () => any;
}) => {
  const editDialogRef = useRef<HTMLUListElement>(null!);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        editDialogRef.current &&
        !editDialogRef.current.contains(event.target)
      ) {
        // Click occurred outside of the edit dialog, so close it
        closeDialog();
      }
    };

    // Attach the event listener to the document body
    document.body.addEventListener("click", handleClickOutside);

    return () => {
      // Clean up the event listener when component unmounts
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <ul
      ref={editDialogRef}
      className="z-10 absolute top-1 right-0 bg-white shadow-lg rounded-md p-2"
    >
      <li
        onClick={onEditClick}
        className="hover:bg-slate-500 hover:text-slate-200 rounded-md p-2 text-center text-xs w-full hover:cursor-pointer"
      >
        Edit
      </li>
      <li
        onClick={onDeleteClick}
        className="hover:bg-slate-500 hover:text-slate-200 rounded-md p-2 text-center text-xs w-full hover:cursor-pointer"
      >
        Delete
      </li>
    </ul>
  );
};
