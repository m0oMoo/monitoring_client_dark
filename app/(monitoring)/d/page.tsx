"use client";

import { ChartOptionsProvider } from "@/context/chartOptionContext";
import { SelectedSectionProvider } from "@/context/selectedSectionContext";
import { WidgetOptionsProvider } from "@/context/widgetOptionContext";
import React, { Suspense } from "react";
import View from "./content/veiw";

const DashboardDetailPage = () => {
  return (
    <ChartOptionsProvider>
      <SelectedSectionProvider>
        <WidgetOptionsProvider>
          <Suspense>
            <View />
          </Suspense>
        </WidgetOptionsProvider>
      </SelectedSectionProvider>
    </ChartOptionsProvider>
  );
};

export default DashboardDetailPage;
