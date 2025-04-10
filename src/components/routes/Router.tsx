import React from "react";
import { Routes, Route, Outlet, HashRouter } from "react-router-dom";
import { HeaderBarLayout, SemisHeader } from "dhis2-semis-components";
import { TransferExecute } from "../../pages";

export default function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HeaderBarLayout
              header={
                <SemisHeader
                  headerItems={{
                    academicYears: {
                      options: [
                        {
                          label: "2024",
                          value: "2024",
                        },
                        {
                          label: "2023",
                          value: "2023",
                        },
                        {
                          label: "2022",
                          value: "2022",
                        },
                        {
                          label: "2021",
                          value: "2021",
                        },
                        {
                          label: "2020",
                          value: "2020",
                        },
                      ],
                    },
                    orgunits: {
                      options: [],
                    },
                  }}
                />
              }
            >
              <Outlet />
            </HeaderBarLayout>
          }
        >
          <Route key={"enrollments"} path={"/"} element={<TransferExecute />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
