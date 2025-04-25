import React from "react";
import { Routes, Route, Outlet, HashRouter } from "react-router-dom";
import { TransferExecute } from "../../pages";
import { FullLayout } from "../../layout";
import { Transfer } from "../../pages";
import { Table } from "../../pages";
import { Lists } from "../../pages";

export default function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<FullLayout />}>
          <Route key={"transfer"} path={"/"} element={<Transfer />} />
          <Route path="transfer/orgunit" element={<Lists />} />
          <Route path="transfer-execute" element={<TransferExecute />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
