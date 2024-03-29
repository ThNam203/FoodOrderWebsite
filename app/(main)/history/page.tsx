"use client";

import OrderHistoryTable from "@/components/OrderHistoryTable/order_history_table";
import { SearchIcon } from "@/components/OrderHistoryTable/search_icon";
import { Separate } from "@/components/separate";
import { Tab, TabContent } from "@/components/tab";
import { Input } from "@nextui-org/react";
import React, { useState } from "react";

export default function HistoryPage() {
  const [selectedTab, setSelectedTab] = useState("All Orders");

  return (
    <div className="min-h-screen h-screen w-full font-sans p-8 text-primaryWord bg-white">
      <div className="w-full h-full flex flex-col">
        <div className="w-full flex flex-col font-bold text-lg">
          Order History
          <div className="w-full font-normal text-sm mt-2">
            You can see your order history here
          </div>
          <Separate classname="h-[1.5px] mt-4" />
        </div>
        <div className="w-full h-full flex flex-row justify-around">
          <div className="flex flex-col items-center justify-start gap-4 mt-4">
            <Tab
              className="w-[200px]"
              content="All Orders"
              setSelectedTab={setSelectedTab}
              selectedTab={selectedTab}
            />
            <Tab
              className="w-[200px]"
              content="Pending"
              setSelectedTab={setSelectedTab}
              selectedTab={selectedTab}
            />
            <Tab
              className="w-[200px]"
              content="On the Way"
              setSelectedTab={setSelectedTab}
              selectedTab={selectedTab}
            />
            <Tab
              className="w-[200px]"
              content="Completed"
              setSelectedTab={setSelectedTab}
              selectedTab={selectedTab}
            />
            <Tab
              className="w-[200px]"
              content="Cancelled"
              setSelectedTab={setSelectedTab}
              selectedTab={selectedTab}
            />
            <Tab
              className="w-[200px]"
              content="Refunded"
              setSelectedTab={setSelectedTab}
              selectedTab={selectedTab}
            />
          </div>
          <div className="flex-1">
            <TabContent
              className="w-full mt-4 h-full flex flex-col items-center justify-start"
              selectedTab={selectedTab}
              contentFor="All Orders"
              content={
                <div className="items-center justify-start w-full h-full px-10 flex flex-col">
                  <OrderHistoryTable />
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
