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
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
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
import { showErrorToast, showSuccessToast } from "@/components/toast";
import { FoodDetail } from "../food_detail";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  ConfirmDialog,
  ConfirmDialogType,
  useConfirmDialog,
} from "../confirm_dialog";
import { Food, FoodSize } from "@/models/Food";
import { Cart } from "@/models/Cart";
import CartService from "@/services/cartService";
import { addCartItem } from "@/redux/slices/cart";

const columns = [
  { name: "Product", uid: "product" },
  { name: "Name", uid: "name", sortable: true },
  { name: "Description", uid: "description" },
  { name: "Quantity", uid: "quantity", sortable: true },
  { name: "Price", uid: "price", sortable: true },
  { name: "Total", uid: "total", sortable: true },
  { name: "Status", uid: "status" },
  { name: "Create Date", uid: "createDate", sortable: true },
];

type OrderItem = {
  id: string;
  idOrder: number;
  idItems: number;
  name: string;
  description: string;
  image: string[];
  quantity: number;
  price: number;
  total: number;
  status: string;
  createDate: Date;
  items: Cart[];
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
  const [selectedFood, setSelectedFood] = useState<OrderItem | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set<any>([]));
  const rowsPerPage = 3;
  const [page, setPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const {
    isOpen: isOpenConfirm,
    setOpen,
    content,
    title,
    type,
    setConfirmDialog,
  } = useConfirmDialog();

  enum OrderStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    DELIVERED = "DELIVERED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED",
  }

  const statusColorMapping = {
    [OrderStatus.PENDING]: "text-yellow-400",
    [OrderStatus.ACCEPTED]: "text-green-400",
    [OrderStatus.DELIVERED]: "text-blue-400",
    [OrderStatus.REJECTED]: "text-red-400",
    [OrderStatus.CANCELLED]: "text-orange-400",
  };

  const onStatusChange = async (id: number, status: OrderStatus) => {
    await OrderService.UpdateOrder(id, status)
      .then((res) => {
        const updatedOrder = OrderToReceive(res.data);
        const newData = data.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
        dispatch(setOrders(newData));
      })
      .catch((err) => {
        showErrorToast(err.message);
      });
  };

  const previousImage = () => {
    if (currentImageIndex === 0) {
      setCurrentImageIndex(selectedFood?.image?.length ?? -1);
    } else {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < (selectedFood?.image?.length ?? 0) - 1 ? prevIndex + 1 : 0
    );
  };

  const onRowClick = (item: any) => {
    setSelectedFood(item);
    setCurrentImageIndex(0);
    onOpen();
  };

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const orderItems: OrderItem[] = data.flatMap((order) => {
    return order.items.map((item) => ({
      id: `${order.id}-${item.id}`,
      idOrder: order.id,
      idItems: item.id,
      name: item.food.name,
      description: item.food.description,
      image: item.food.images,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
      status: order.status,
      createDate: order.createdAt,
      items: order.items,
    }));
  });
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
          console.log("data:", data);
          dispatch(setOrders(data));
        })
        .catch((err) => {
          showErrorToast(err.message);
        });
      dispatch(disablePreloader());
    };
    fetchData();
  }, [dispatch]);

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

    const nextImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % order.image.length);
    };

    const previousImage = () => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? order.image.length - 1 : prevIndex - 1
      );
    };

    useEffect(() => {
      const timer = setInterval(nextImage, 3000);
      return () => clearInterval(timer);
    }, [order.image]);

    return (
      <div className="flex flex-row h-[220px] w-[220px]">
        {order.image.length > 1 && (
          <button onClick={previousImage}>
            <ChevronLeftIcon />
          </button>
        )}
        <div className="w-150 h-150 flex justify-center items-center relative">
          <Image
            src={order.image[currentImageIndex]}
            alt={`${order.name}-${currentImageIndex}`}
            width={150}
            height={150}
          />
          <div className="absolute bottom-0 left-12 flex justify-center mt-2">
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
        {order.image.length > 1 && (
          <button onClick={nextImage}>
            <ChevronRightIcon />
          </button>
        )}
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
      case "createDate":
        return (
          <div className="flex flex-col">
            <span>{new Date(cellValue).toLocaleDateString("vi-VN")}</span>
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
          {(item) => {
            return (
              <TableRow key={item.id} onDoubleClick={() => onRowClick(item)}>
                {(columnKey) => {
                  return <TableCell>{renderCell(item, columnKey)}</TableCell>;
                }}
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        className="min-h-[700px] min-w-[800px]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-primaryWord" />
              <ModalBody>
                <div className="flex flex-row text-primaryWord">
                  <div className="flex flex-row h-[600px] w-[400px]">
                    {selectedFood?.image && selectedFood.image.length > 1 && (
                      <button onClick={previousImage}>
                        <ChevronLeftIcon />
                      </button>
                    )}
                    <div className="w-350 h-600 flex justify-center items-center relative">
                      <Image
                        src={selectedFood?.image[currentImageIndex]}
                        alt={selectedFood?.name}
                        width={350}
                        height={350}
                        className="border-2 border-black"
                      />
                      <div className="absolute bottom-0 left-18 flex justify-center mt-2">
                        {selectedFood &&
                          selectedFood.image &&
                          selectedFood.image.length > 1 &&
                          selectedFood.image.map((_: any, index: number) => (
                            <div
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`h-2 w-2 rounded-full ${
                                currentImageIndex === index
                                  ? "bg-blue-500"
                                  : "bg-gray-500"
                              } ml-1 cursor-pointer`}
                            />
                          ))}
                      </div>
                    </div>
                    {selectedFood?.image && selectedFood.image.length > 1 && (
                      <button onClick={nextImage}>
                        <ChevronLeftIcon />
                      </button>
                    )}
                  </div>
                  <div className="ml-4 min-h-full flex flex-col justify-between">
                    <div>
                      <div className="font-sans font-semibold text-3xl">
                        {selectedFood?.name}
                      </div>
                      <div className="font-sans font-semibold text-xl text-orange-600 mt-4">
                        Price:{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(selectedFood?.price || 0)}
                      </div>
                      <div className="font-sans font-normal text-xl mt-4">
                        Description: {selectedFood?.description}
                      </div>
                      <div className="font-sans font-normal text-xl mt-4">
                        Quantity: {selectedFood?.quantity}
                      </div>
                      <div className="font-sans font-normal text-xl mt-4">
                        Status:{" "}
                        {selectedFood?.status && (
                          <span
                            className={` ${
                              statusColorMapping[
                                selectedFood.status as keyof typeof statusColorMapping
                              ]
                            }`}
                          >
                            {selectedFood.status}
                          </span>
                        )}
                      </div>
                      <div className="font-sans font-normal text-xl mt-4">
                        Create Date:{" "}
                        {new Date(
                          selectedFood?.createDate ?? ""
                        ).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                    <div className="font-sans font-semibold text-2xl text-orange-600 mt-4">
                      Total:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(
                        (selectedFood?.price || 0) *
                          (selectedFood?.quantity || 0)
                      )}
                    </div>
                    {selectedFood?.status === OrderStatus.PENDING && (
                      <Button
                        color="warning"
                        size="md"
                        onClick={() => {
                          setConfirmDialog(
                            "Cancel Order",
                            "Are you sure you want to cancel this order?",
                            "warning" as ConfirmDialogType
                          );
                          setOpen(true);
                        }}
                        className="font-sans font-semibold text-xl"
                      >
                        Cancel Order
                      </Button>
                    )}
                    <ConfirmDialog
                      isOpen={isOpenConfirm}
                      onOpenChange={setOpen}
                      title={title}
                      content={content}
                      onAccept={() => {
                        setOpen(false);
                        onStatusChange(
                          selectedFood?.idOrder ?? 0,
                          OrderStatus.CANCELLED
                        );
                        onClose();
                      }}
                    />
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
