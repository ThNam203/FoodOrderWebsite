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
import { useCallback, useEffect, useMemo, useState } from "react";
import { Selection } from "@nextui-org/react";
import { ChevronDownIcon } from "./chevron_down_icon";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Order } from "@/models/Order";
import { disablePreloader, showPreloader } from "@/redux/slices/preloader";
import OrderService from "@/services/orderService";
import { setOrders } from "@/redux/slices/order";
import { OrderToReceive } from "@/convertor/orderConvertor";
import { showErrorToast } from "@/components/toast";

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
  idOrder: string;
  idItems: number;
  name: string;
  description: string;
  image: string[];
  quantity: number;
  price: number;
  total: number;
  status: string;
  createDate: Date;
};
interface OrderHistoryTableProps {
  status: string;
}

export default function OrderHistoryTable({ status }: OrderHistoryTableProps) {
  const dispatch = useAppDispatch();
  const data: Order[] = useAppSelector((state) => state.order.orders);
  const INITIAL_VISIBLE_COLUMNS = [
    "product",
    "name",
    "description",
    "quantity",
    "price",
    "total",
    "status",
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
  const orderItems: OrderItem[] = data.flatMap((order) =>
    order.items.map((item) => ({
      idOrder: `${order.id}-${item.id}`,
      idItems: item.id,
      name: item.food.name,
      description: item.food.description,
      image: item.food.images,
      quantity: item.quantity,
      price: item.price,
      total: order.total,
      status: order.status,
      createDate: order.createdAt,
    }))
  );

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showPreloader());
      await OrderService.GetAllOrders()
        .then((res) => {
          const data = res.data.map((order: any) => OrderToReceive(order));
          dispatch(setOrders(data));
        })
        .catch((err) => {
          showErrorToast(err.message);
        });
      dispatch(disablePreloader());
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    let filteredData = [...orderItems];
    if (status !== "All Orders") {
      filteredData = filteredData.filter(
        (item) => item.status === status.toUpperCase()
      );
    }
    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredData;
  }, [orderItems, status, hasSearchFilter, filterValue]);

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
  const ProductCell = ({ order }: any) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % order.image.length
        );
      }, 3000);
      return () => clearInterval(timer);
    }, [order.image]);

    return (
      <div className="flex flex-col w-[220px] h-[220px]">
        <Image
          src={order.image[currentImageIndex]}
          alt={`${order.name}-${currentImageIndex}`}
          width={150}
          height={150}
        />
        <div className="absolute bottom-0  left-12 flex justify-center mt-2">
          {order.image.length > 1 &&
            order.image.map((_: any, index: number) => (
              <div
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-2 w-2 rounded-full ${
                  currentImageIndex === index ? "bg-blue-500" : "bg-gray-500"
                } ml-1 cursor-pointer`}
              />
            ))}
        </div>
      </div>
    );
  };

  const renderCell = useCallback((order: any, columnKey: any) => {
    const cellValue = order[columnKey];
    switch (columnKey) {
      case "product":
        return <ProductCell order={order} />;
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
            <TableRow key={item.idOrder}>
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
