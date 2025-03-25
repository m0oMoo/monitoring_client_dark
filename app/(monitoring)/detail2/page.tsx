"use client";

import React, { Suspense } from "react";
import DetailDashboard from "./content/detailDashboard";
import { DashboardProvider } from "@/context/dashboardContext";

const DashboardDetailPage = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DashboardProvider>
        <DetailDashboard />
      </DashboardProvider>
    </Suspense>
  );
};

export default DashboardDetailPage;
