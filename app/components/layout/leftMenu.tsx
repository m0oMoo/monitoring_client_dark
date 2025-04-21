"use client";

import { LayoutGrid, FileText, Database } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const MENU = [
  // { id: 1, title: "Dashboard", icon: LayoutGrid, link: "/dashboard" },
  { id: 5, title: "Dashboard", icon: LayoutGrid, link: "/" },
  // { id: 2, title: "Reports", icon: FileText, link: "/reports" },
  {
    id: 3,
    title: "Data Source",
    icon: Database,
    link: "/connection/dataSource",
  },
  // {
  //   id: 4,
  //   title: "Create Dashboard",
  //   icon: LayoutGrid,
  //   link: "/d",
  // },
];

const LeftMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleMenuClick = (link: string) => {
    router.push(link);
  };

  // Logic to check if "Dashboard" item should be active
  const isDashboardActive =
    pathname.includes("/d") ||
    pathname.includes("/") ||
    pathname.includes("/detail");

  return (
    <nav
      className="w-60  p-4 shadow-xl h-full flex flex-col space-y-4
    border-r border-0.5 border-modern-border"
    >
      <div className="flex items-center space-x-2">
        <span className="mb-6 text-title_sm text-ivory-text">Menu</span>
      </div>
      <div className="flex flex-col space-y-4 text-base">
        {MENU.map((item) => (
          <div
            key={item.id}
            className={`flex items-center space-x-2 cursor-pointer pl-4 
              ${
                item.id === 5
                  ? isDashboardActive
                    ? "text-modern-primary border-l-2 border-modern-border text-bold_lg"
                    : "text-lg1 text-modern-text_disable"
                  : pathname.includes(item.link)
                  ? "text-modern-primary border-l-2 border-modern-border text-bold_lg"
                  : "text-lg1 text-modern-text_disable"
              } 
              hover:text-modern-text`}
            onClick={() => handleMenuClick(item.link)}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default LeftMenu;
