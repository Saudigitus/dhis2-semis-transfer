import React from "react";
import { useUrlParams } from "dhis2-semis-functions";
import { TabComponent } from "dhis2-semis-components";
import { TabPosistion } from "../../types/tabs/TabsTypes";
import { D2I18n } from "dhis2-semis-types";


function Tab({ i18n }: { i18n: D2I18n }) {
  const tabsElements = [
    { name: i18n.t("Incoming transfer"), value: TabPosistion.INCOMING },
    { name: i18n.t("Outgoing transfer"), value: TabPosistion.OUTGOING }
  ];
  const { add, useQuery } = useUrlParams()
  const selectedTab = useQuery.get('position') || TabPosistion.INCOMING;

  return (
    <TabComponent
      selectedTab={selectedTab}
      tabsElements={tabsElements}
      onTabClick={(value) => add("position", value?.value)}
    />
  );
}

export default Tab;