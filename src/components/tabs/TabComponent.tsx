import React from "react";
import { useUrlParams } from "dhis2-semis-functions";
import { TabComponent } from "dhis2-semis-components";
import { TabPosistion } from "../../types/tabs/TabsTypes";

const tabsElements = [
  { name: "Incoming transfer", value: TabPosistion.INCOMING },
  { name: "Outgoing transfer", value: TabPosistion.OUTGOING }
];

function Tab(): React.ReactElement {
  const { add, useQuery } = useUrlParams()
  const selectedTab = useQuery().get('position') || TabPosistion.INCOMING;

  return (
    <TabComponent
      selectedTab={selectedTab!}
      tabsElements={tabsElements}
      onTabClick={(value) => add("position", value.value)}
    />
  );
}

export default Tab;