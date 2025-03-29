import dynamic from "next/dynamic";

const PannelSection = dynamic(() => import("./pannelSection"), {
  ssr: false,
});
const RightSection = dynamic(() => import("./rightSection"), {
  ssr: false,
});

const View = () => {
  return (
    <div className="relative min-h-screen bg-modern-bg">
      <PannelSection />
      <RightSection />
    </div>
  );
};

export default View;
