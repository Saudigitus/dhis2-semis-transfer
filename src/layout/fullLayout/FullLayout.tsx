import React from "react";
import style from "../Layout.module.css";
import { SemisHeader } from "dhis2-semis-components";
import { Outlet } from "react-router-dom";

export default function FullLayout() {

  return (
    <div className={style.LayoutContainer}>
      <div className={style.FullLayoutContainer}>
        <SemisHeader
          headerItems={{
            orgunits: {
              options: [],
            },
          }}
        />
        <main className={style.MainContentContainer}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
