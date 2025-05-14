import React from "react";
import { TransferExecute } from "../../pages";
import { Routes, Route, HashRouter } from "react-router-dom";
import WithHeaderBarLayout from "src/layout/WithHeaderBarLayout";

export default function Router() {
  return (
      <Routes>
        <Route path="/" element={<WithHeaderBarLayout />}>
          <Route
            path={"/"} key={"transfer-execute"} element={<TransferExecute />}
          />
        </Route>
      </Routes>
  );
}