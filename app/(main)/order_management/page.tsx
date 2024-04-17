"use client";
import MenuTable from "@/components/MenuTable/menu_table";
import { NewFoodForm } from "@/components/NewFoodForm/new_food_form";
import { TextButton } from "@/components/buttons";
import { CustomDatatable } from "@/components/datatable/custom_datatable";
import { Food } from "@/models/Food";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setFoods } from "@/redux/slices/food";
import FoodService from "@/services/foodService";
import { use, useEffect, useState } from "react";

import { cn } from "@/utils/cn";
import {
  orderColumnTitles,
  orderDefaultVisibilityState,
  orderTableColumns,
} from "./table_columns";
import { setFoodCategories } from "@/redux/slices/category";
import { disablePreloader, showPreloader } from "@/redux/slices/preloader";
import { showErrorToast } from "@/components/toast";
import { handleFilterColumn } from "@/utils/func";
import { Row } from "@tanstack/react-table";
import { FoodToReceive } from "@/convertor/foodConvertor";
import { Order, OrderStatus } from "@/models/Order";
import OrderService from "@/services/orderService";
import { OrderToReceive } from "@/convertor/orderConvertor";
import { setOrders } from "@/redux/slices/order";

export default function OrderManagement() {
  const dispatch = useAppDispatch();
  const data: Order[] = useAppSelector((state) => state.order.orders);
  const [rowUpdating, setRowUpdating] = useState<number[]>([]);
  const [filteredData, setFilteredData] = useState<Order[]>(data);
  const filterOptionKeys = Object.keys(orderColumnTitles)
    .filter((key) => key !== "images")
    .map((key) => key);

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

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleFilterChange = (filterInput: string, col: string) => {
    console.log(filterInput, col);
    const filteredData = handleFilterColumn(filterInput, col, data);
    setFilteredData(filteredData);
  };

  const onStatusChange = async (id: number, status: OrderStatus) => {
    setRowUpdating([...rowUpdating, id]);
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
      })
      .finally(() => {
        setRowUpdating(rowUpdating.filter((rowId) => rowId !== id));
      });
  };

  return (
    <div className="flex flex-col p-8 text-primaryWord">
      <div className="flex flex-row justify-between mb-4">
        <h1 className="text-4xl font-bold text-primary">Order management</h1>
      </div>
      <CustomDatatable
        data={filteredData}
        columns={orderTableColumns(rowUpdating, onStatusChange)}
        columnTitles={orderColumnTitles}
        infoTabs={[
          {
            render(row, setShowTabs) {
              return <OrderDetailTab row={row} setShowTabs={setShowTabs} />;
            },
            tabName: "Order details",
          },
        ]}
        config={{
          defaultVisibilityState: orderDefaultVisibilityState,
          showFilterButton: true,
          filterOptionKeys: filterOptionKeys,
          showDataTableViewOptions: true,
          onFilterChange: handleFilterChange,
        }}
      />
      {/* {openNewFoodForm && (
        <NewFoodForm
          categories={categories}
          closeForm={() => setOpenNewFoodForm(false)}
          onNewFoodSubmit={(food: Food) => setData([...data, food])}
        />
      )} */}
    </div>
  );
}

const OrderDetailTab = ({
  row,
  setShowTabs,
}: {
  row: Row<Order>;
  setShowTabs: (value: boolean) => any;
}) => {
  const order = row.original;
  return (
    <div className="flex h-[300px] flex-col justify-between gap-4 py-2 pl-8 pr-4">
      Order detail
    </div>
  );
};
