import dynamic from "next/dynamic";

const ChartSection = dynamic(() => import("./chartSection"), {
  ssr: false,
});
const RightSection = dynamic(() => import("./rightSection"), {
  ssr: false,
});

const View = () => {
  return (
    <div className="relative min-h-screen bg-modern-bg">
      <ChartSection />
      <RightSection />
    </div>
  );
};

export default View;
