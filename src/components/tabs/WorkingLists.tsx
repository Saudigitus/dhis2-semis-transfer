import React from "react";
import { TabBar, Tab } from "@dhis2/ui";
import { useRecoilState } from "recoil";
import { TabsState } from "../../schemas/tabSchema";

export default function WorkingLists() {
  const [selectedTab, setSelectedTab] = useRecoilState(TabsState);

  return (
    <TabBar>
      <Tab
        selected={selectedTab === "outgoing"}
        onClick={() => setSelectedTab("outgoing")}
      >
        Outgoing transfer
      </Tab>
      <Tab
        selected={selectedTab === "incoming"}
        onClick={() => setSelectedTab("incoming")}
      >
        Incoming transfer
      </Tab>
    </TabBar>
  );
}
