import { useDashboardStore } from "@/store/useDashboardStore";
import { useRouter, useSearchParams } from "next/navigation";

interface AddChartBarProps {
  isEdit: boolean;
  onCreateClick: () => void;
  onEditClick?: () => void;
  onSaveClick?: () => void;
  gridCols?: number;
  onGridChange?: (change: number) => void;
  gridVisible?: boolean;
  modifiable?: boolean;
}

const DarkAddChartBar = ({
  isEdit,
  onCreateClick,
  onEditClick,
  onSaveClick,
  gridCols,
  onGridChange,
  gridVisible = false,
  modifiable = false,
}: AddChartBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dashboardId = searchParams.get("id") || undefined;

  // `dashboardId`에 해당하는 대시보드 찾기
  const dashboard = useDashboardStore((state) =>
    state.dashboardList.find((d) => d.id === dashboardId)
  );

  const handleGoBack = () => {
    router.push("/dashboard6");
  };

  return (
    <div
      className={`flex justify-between items-center mt-[44px] bg-modern-bg
      border-b border-modern-border border-0.5 py-1.5`}
    >
      {/* breadcrumb 표시 */}
      <span className=" ml-4 text-lg1 text-modern-text_disable">
        <span
          className="text-text1 cursor-pointer hover:underline"
          onClick={handleGoBack}
        >
          Dashboard
        </span>
        &nbsp; {">"}
        <span className="text-modern-text text-bold_lg">
          &nbsp; {dashboard ? dashboard.label : "Unknown Dashboard"}
        </span>
      </span>
      <div className="flex flex-row gap-5 mr-4">
        <div className="flex flex-row gap-2 text-sm1">
          {modifiable && (
            <button
              className="hover:bg-modern-point_20 bg-modern-point_10
        px-2 py-0.5 text-modern-point border-modern-point"
              onClick={onEditClick}
            >
              {isEdit ? "Save" : "Edit"}
            </button>
          )}

          <button
            className="border hover:bg-modern-point_20 bg-modern-point_10
        px-2 py-1 text-modern-point border-modern-point"
            onClick={onCreateClick}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default DarkAddChartBar;
