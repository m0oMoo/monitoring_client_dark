import { Suspense } from "react";
import MainSection from "./content/mainSection";

const DetailDashboard = () => {
  return (
    <Suspense>
      <MainSection />
    </Suspense>
  );
};

export default DetailDashboard;
