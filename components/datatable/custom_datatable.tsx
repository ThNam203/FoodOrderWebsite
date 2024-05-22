import { cn } from "@/utils/cn";
import {
  ColumnDef,
  ColumnFiltersState,
  Table as ReactTable,
  RowSelectionState,
  SortingState,
  TableMeta,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FileDown, FileUp, Filter } from "lucide-react";
import { Key, useEffect, useMemo, useRef, useState } from "react";
import { TextButton } from "../buttons";
import { LoadingIcon } from "../icons";
import { Input } from "../input";
import CustomDataTableContent from "./custom_datatable_content";
import { TabProps } from "./custom_datatable_row";
import { DataTableViewOptions } from "./my_table_column_visibility_toggle";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export type DatatableConfig<TData> = {
  showDefaultSearchInput?: boolean;
  showFilterButton?: boolean;
  alternativeSearchInput?: JSX.Element;
  showDataTableViewOptions?: boolean;
  showRowSelectedCounter?: boolean;
  onDeleteRowsBtnClick?: (dataToDelete: TData[]) => Promise<any>; // if null, remove button
  onExportExcelBtnClick?: (table: ReactTable<TData>) => void; // if null, remove button
  onImportExcelBtnClick?: (table: ReactTable<TData>) => void; // if null, remove button
  filterOptionKeys?: string[];
  onFilterChange?: (filterInput: string, col: string) => void;
  defaultVisibilityState?: {
    [key: string]: boolean;
  };
  className?: string;
  rowColorDependence?: {
    key: string;
    condition: { value: string; borderColor: string }[];
  };
};

const defaultConfig: DatatableConfig<any> = {
  showDefaultSearchInput: true,
  showFilterButton: true,
  alternativeSearchInput: undefined,
  showDataTableViewOptions: true,
  showRowSelectedCounter: true,
  defaultVisibilityState: {},
  onDeleteRowsBtnClick: undefined,
  onExportExcelBtnClick: undefined,
  onImportExcelBtnClick: undefined,
  filterOptionKeys: [],
  className: "",
  rowColorDependence: undefined,
};

export type CustomDatatableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  columnTitles: {
    [key: string]: string;
  };
  infoTabs?: TabProps<TData>[];
  buttons?: JSX.Element[];
  config?: DatatableConfig<TData>;
  meta?: TableMeta<TData>;
};

export function CustomDatatable<TData>({
  data,
  columns,
  columnTitles,
  infoTabs,
  buttons,
  config,
  meta,
}: CustomDatatableProps<TData>) {
  config = { ...defaultConfig, ...config };

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    config?.defaultVisibilityState ?? {}
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [colFilterInput, setColFilterInput] = useState("");
  const [filterKeys, setFilterKeys] = useState(config.filterOptionKeys ?? []);
  const [selectedFilterKey, setSelectedFilterKey] = useState("");

  const table = useReactTable<TData>({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: meta,
  });

  const [isDeletingCodes, setIsDeletingCodes] = useState(false);

  const handleFilterChange = (filterInput: string, col: string) => {
    setSelectedFilterKey(col);
    if (config.onFilterChange) config.onFilterChange(filterInput, col);
  };

  return (
    <div ref={tableContainerRef} className="w-full space-y-2">
      <div
        className={cn(
          "flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-0",
          config.className
        )}
      >
        <div className="flex flex-row items-center justify-stretch gap-2">
          {!config.showDefaultSearchInput ||
          config.alternativeSearchInput ? null : (
            <Input
              placeholder="Search anything..."
              value={colFilterInput}
              onChange={(event) => {
                setColFilterInput(event.target.value);
                handleFilterChange(event.target.value, selectedFilterKey);
              }}
              className="max-w-sm shrink-0 md:w-[300px] max-md:w-auto py-2"
            />
          )}
          {!config.showFilterButton ? null : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TextButton
                  iconBefore={<Filter className="h-4 w-4" />}
                  className="gap-2 whitespace-nowrap text-secondaryWord bg-gray-100 hover:bg-gray-200 ease-linear duration-100 py-2 rounded-md cursor-pointer outline-none select-none"
                >
                  {columnTitles[selectedFilterKey] || "Filter"}
                </TextButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="font-sans bg-white text-secondaryWord">
                <DropdownMenuCheckboxItem
                  key="all"
                  checked={selectedFilterKey === ""}
                  onClick={(checked) => {
                    handleFilterChange(colFilterInput, "");
                  }}
                  className="cursor-pointer hover:bg-gray-100 ease-linear duration-100"
                >
                  All columns
                </DropdownMenuCheckboxItem>
                {filterKeys.map((key) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={selectedFilterKey === key}
                    onClick={(checked) => {
                      handleFilterChange(colFilterInput, key);
                    }}
                    className="cursor-pointer hover:bg-gray-100 ease-linear duration-100"
                  >
                    {columnTitles[key]}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {config.alternativeSearchInput}
        <div className="flex flex-row items-center gap-2">
          {config.onDeleteRowsBtnClick !== undefined &&
          table.getSelectedRowModel().rows.length > 0 ? (
            <TextButton
              className="bg-red-500 text-white"
              disabled={isDeletingCodes}
              onClick={() => {
                setIsDeletingCodes(true);
                config!.onDeleteRowsBtnClick!(
                  table.getSelectedRowModel().rows.map((row) => row.original)
                )
                  .then(() => table.toggleAllRowsSelected(false))
                  .finally(() => setIsDeletingCodes(false));
              }}
            >
              Delete{isDeletingCodes ? <LoadingIcon /> : null}
            </TextButton>
          ) : null}
          {buttons}
          {config.onImportExcelBtnClick !== undefined ? (
            <TextButton
              className="gap-2 bg-green-500 text-white"
              onClick={() => {
                config!.onImportExcelBtnClick!(table);
              }}
            >
              <FileUp className="h-4 w-4" />
              <span className="max-xl:hidden max-md:visible">Import</span>
            </TextButton>
          ) : null}
          {config.onExportExcelBtnClick !== undefined ? (
            <TextButton
              className="gap-2 bg-green-500 text-white"
              onClick={() => {
                config!.onExportExcelBtnClick!(table);
              }}
            >
              <FileDown size={16} />
              <span className="max-xl:hidden max-md:visible">Export</span>
            </TextButton>
          ) : null}

          {config.showDataTableViewOptions ? (
            <DataTableViewOptions
              title="Columns"
              table={table}
              columnHeaders={columnTitles}
            />
          ) : null}
        </div>
      </div>

      <CustomDataTableContent
        columns={columns}
        table={table}
        tableContainerRef={tableContainerRef}
        infoTabs={infoTabs}
        showRowSelectedCounter={!!config.showRowSelectedCounter}
        rowColorDependence={config.rowColorDependence}
      />
    </div>
  );
}

export const DefaultInformationCellDataTable = ({
  title,
  value,
}: {
  title: string;
  value: string | number | boolean;
}) => {
  return (
    <div className="mb-2 flex flex-row border-b font-medium">
      <p className="w-[120px] font-normal">{title}</p>
      <p>{value}</p>
    </div>
  );
};
