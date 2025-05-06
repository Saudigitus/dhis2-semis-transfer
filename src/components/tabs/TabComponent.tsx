import React from "react";
import { TabBar, Tab } from "@dhis2/ui";
import { type TabBarProps } from "../../types/tabs/TabsTypes";
import { WithPadding } from "dhis2-semis-components";
import styles from './TabComponent.module.css'

const tabsElements = [
  { name: "Outgoing transfer", value: "outgoing" },
  { name: "Incoming transfer", value: "incoming" }
];

function TabComponent(props: TabBarProps): React.ReactElement {
  const { selectedValue, setSelectedValue } = props;

  return (
    <TabBar className={styles.tab} fixed>
      {tabsElements.map((element, i) => (
        <Tab
          key={i}
          selected={selectedValue.value === element.value}
          onClick={() => {
            setSelectedValue(element);
          }}
        >
          <WithPadding p="7px">{element.name} </WithPadding>
        </Tab>
      ))}
    </TabBar>
  );
}

export default TabComponent;
