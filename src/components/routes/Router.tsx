import React from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import { TransferExecute } from "../../pages";
import { FullLayout } from "../../layout";

export default function Router() {
  return (
      <Routes>
        <Route path="/" element={<FullLayout />}>
          <Route
            key={"transfer-execute"}
            path={"/"}
            element={<TransferExecute />}
          />
        </Route>
      </Routes>
  );
}
