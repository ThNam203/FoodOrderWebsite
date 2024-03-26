import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Image,
  Input,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Pagination,
  SortDescriptor,
} from "@nextui-org/react";
import { SearchIcon } from "./search_icon";
import { useCallback, useMemo, useState } from "react";
import { Selection } from "@nextui-org/react";
import { ChevronDownIcon } from "./chevron_down_icon";
const columns = [
  { name: "Id", uid: "id", sortable: true },
  { name: "Product", uid: "product" },
  { name: "Name", uid: "name", sortable: true },
  { name: "Description", uid: "description" },
  { name: "Quantity", uid: "quantity", sortable: true },
  { name: "Price", uid: "price", sortable: true },
  { name: "Total", uid: "total", sortable: true },
  { name: "Status", uid: "status" },
  { name: "Create Date", uid: "createdate", sortable: true },
];

type OrderItem = {
  id: number;
  name: string;
  description: string;
  image: string;
  quantity: number;
  price: number;
  total: number;
  status: string;
  createDate: string;
};

const orderItems = [
  {
    id: 1,
    name: "Product 1",
    description: "Description 1",
    image: "https://via.placeholder.com/150",
    quantity: 1,
    price: 100,
    total: 100,
    status: "Completed",
    createDate: "2021-10-10",
  },
  {
    id: 2,
    name: "Product 2",
    description: "Description 2",
    image: "https://via.placeholder.com/150",
    quantity: 2,
    price: 102,
    total: 102,
    status: "Completed",
    createDate: "2021-10-10",
  },
  {
    id: 3,
    name: "Product 3",
    description: "Description 3",
    image: "https://via.placeholder.com/150",
    quantity: 3,
    price: 103,
    total: 103,
    status: "Completed",
    createDate: "2021-10-10",
  },
  {
    id: 4,
    name: "Product 4",
    description: "Description 4",
    image: "https://via.placeholder.com/150",
    quantity: 19,
    price: 1009,
    total: 1009,
    status: "Completed",
    createDate: "2021-10-10",
  },
  {
    id: 5,
    name: "Product 5",
    description: "Description 5",
    image: "https://via.placeholder.com/150",
    quantity: 1,
    price: 1090,
    total: 1090,
    status: "Completed",
    createDate: "2021-10-10",
  },
  {
    id: 6,
    name: "Product 6",
    description: "Description 6",
    image: "https://via.placeholder.com/150",
    quantity: 15,
    price: 100,
    total: 1007,
    status: "Completed",
    createDate: "2021-10-10",
  },
];

export default function OrderHistoryTable() {
  const INITIAL_VISIBLE_COLUMNS = [
    "product",
    "name",
    "description",
    "quantity",
    "price",
    "total",
  ];

  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set<any>([]));
  const rowsPerPage = 3;
  const [page, setPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredData = useMemo(() => {
    let filteredData = [...orderItems];
    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredData;
  }, [hasSearchFilter, filterValue]);

  const handleSelectionChange = (keys: Selection) => {
    setSelectedKeys(new Set(Object.values(keys)));
  };

  const pages = Math.ceil(orderItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredData.slice(start, end);
  }, [page, filteredData, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof typeof a];
      const second = b[sortDescriptor.column as keyof typeof b];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onSearchChange = useCallback((value: any) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const renderCell = useCallback((order: any, columnKey: any) => {
    const cellValue = order[columnKey];

    switch (columnKey) {
      case "product":
        return (
          <div className="flex flex-col">
            <Image
              src={order.image}
              alt={order.name}
              width={150}
              height={150}
            />
          </div>
        );
      case "name":
        return (
          <div className="flex flex-col">
            <span>{cellValue}</span>
          </div>
        );
      case "description":
        return (
          <div className="flex flex-col">
            <span>{cellValue}</span>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-row w-full gap-4">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[70%]",
            inputWrapper: "border-1",
          }}
          placeholder="Search by product name"
          size="sm"
          startContent={<SearchIcon className="font-sans text-primaryWord" />}
          variant="bordered"
          onClear={onClear}
          value={filterValue}
          onValueChange={onSearchChange}
        />
        <Dropdown className="ml-4">
          <DropdownTrigger className="hidden sm:flex">
            <Button
              endContent={<ChevronDownIcon className="text-primaryWord" />}
              variant="flat"
              size="sm"
            >
              Columns
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Table Columns"
            closeOnSelect={false}
            selectedKeys={visibleColumns}
            selectionMode="multiple"
            onSelectionChange={(keys) => setVisibleColumns(keys as Set<string>)}
          >
            {columns.map((column) => (
              <DropdownItem
                key={column.uid}
                className="text-primaryWord font-sans"
              >
                {column.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }, [filterValue, onClear, onSearchChange, visibleColumns]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex px-2 py-2 justify-center items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    );
  }, [page, pages]);
  return (
    <div className="w-full h-full flex flex-col">
      <Table
        className="w-full mt-2"
        isHeaderSticky
        classNames={{ wrapper: "max-h-[580px]" }}
        bottomContent={bottomContent}
        topContent={topContent}
        selectedKeys={selectedKeys}
        selectionMode="none"
        sortDescriptor={sortDescriptor}
        topContentPlacement="outside"
        bottomContentPlacement="outside"
        onSelectionChange={handleSelectionChange}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align="start"
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={<div className="text-center">No data found</div>}
          items={sortedItems}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
