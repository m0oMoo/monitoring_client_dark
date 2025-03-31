"use client";

import React, { Suspense } from "react";
import SnapshotDetailSection from "./content/detailSection";

const SnapshotDetailPage = () => {
  return (
    <Suspense>
      <SnapshotDetailSection />
    </Suspense>
  );
};

export default SnapshotDetailPage;
