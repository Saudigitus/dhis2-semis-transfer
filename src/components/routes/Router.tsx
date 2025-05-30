import React from "react";
import { Transfer } from "../../pages";
import { Routes, Route } from "react-router-dom";
import WithHeaderBarLayout from "../../layout/WithHeaderBarLayout";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<WithHeaderBarLayout />}>
        <Route
          path={"/"} key={"transfer-execute"} element={< Transfer />}
        />
      </Route>
    </Routes>
  );
}