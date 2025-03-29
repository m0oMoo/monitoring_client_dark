"use client";

import React, { Suspense } from "react";
import SnapshotMainSection from "./content/mainSection";

const SnapshotPage = () => {
  return (
    <Suspense>
      <SnapshotMainSection />
    </Suspense>
  );
};

export default SnapshotPage;
