import React from "react";
import { TabBar, Tab } from "@dhis2/ui";
import { type TabBarProps } from "../../types/tabs/TabsTypes";
import { WithPadding } from "dhis2-semis-components";
import styles from './TabComponent.module.css'

const tabsElements = [
  { name: "Incoming transfer", value: "incoming" },
  { name: "Outgoing transfer", value: "outgoing" }
];

function TabComponent(props: TabBarProps): React.ReactElement {
  const { selectedValue, setSelectedValue } = props;

  return (
    <TabBar className={styles.tab} fixed>
      {tabsElements.map((element, i) => (
        <Tab
          key={i}
          selected={selectedValue === element.value}
          onClick={() => {
            setSelectedValue(element.value);
          }}
        >
          <WithPadding p="7px">{element.name} </WithPadding>
        </Tab>
      ))}
    </TabBar>
  );
}

export default TabComponent;
