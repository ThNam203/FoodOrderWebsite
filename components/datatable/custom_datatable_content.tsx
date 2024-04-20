import {
  ColumnDef,
  Table as ReactTable,
  flexRender,
} from "@tanstack/react-table";
import { RefObject } from "react";
import { CustomDataTablePagination } from "./custom_datatable_pagination";
import CustomDatatableRow, { TabProps } from "./custom_datatable_row";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { ClassValue } from "clsx";

interface CustomDataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  table: ReactTable<TData>;
  tableContainerRef: RefObject<HTMLDivElement>;
  infoTabs?: TabProps<TData>[];
  showRowSelectedCounter: boolean;
  rowColorDependence?: RowColorDependence;
}

export type RowColorDependence = {
  key: string;
  condition: { value: string; borderColor: ClassValue }[];
};

export default function CustomDataTableContent<TData>({
  columns,
  table,
  tableContainerRef,
  infoTabs,
  showRowSelectedCounter,
  rowColorDependence,
}: CustomDataTableProps<TData>) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, idx) => {
                let borderColor: ClassValue = "border-primary";
                if (rowColorDependence) {
                  //get status value from row data
                  const value =
                    row.original[
                      rowColorDependence.key as keyof typeof row.original
                    ];
                  borderColor = rowColorDependence.condition.find(
                    (cond) => cond.value === value
                  )?.borderColor;
                }
                return (
                  <CustomDatatableRow
                    key={row.id}
                    row={row}
                    containerRef={tableContainerRef}
                    tabs={infoTabs}
                    rowBorderColor={borderColor}
                  />
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <CustomDataTablePagination
        table={table}
        config={{
          showRowSelectedCounter: showRowSelectedCounter,
        }}
      />
    </div>
  );
}
