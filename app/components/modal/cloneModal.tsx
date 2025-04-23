import { useThemeStore } from "@/store/useThemeStore";

type CloneModalProps = {
  dashboardList: { id: string; label: string }[];
  selectedDashboard: string | null;
  setSelectedDashboard: React.Dispatch<React.SetStateAction<string | null>>;
  setIsCloneModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  confirmClone: () => void;
};

const CloneModal = ({
  dashboardList,
  selectedDashboard,
  setSelectedDashboard,
  setIsCloneModalOpen,
  confirmClone,
}: CloneModalProps) => {
  const { theme } = useThemeStore();

  const bgClass = {
    modern: "bg-modern-bg",
    blue: "bg-blue-bg",
    pink: "bg-pink-bg",
    orange: "bg-orange-bg",
    ivory: "bg-ivory-bg",
  }[theme];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-[100]">
      <div
        className={`${bgClass} p-6 rounded-xl shadow-lg w-96 border border-modern-border`}
      >
        <h2 className="text-lg font-semibold text-modern-text mb-4">
          대시보드 선택
        </h2>

        <ul className="flex flex-col gap-1">
          {dashboardList.map((dashboard) => {
            const isSelected = selectedDashboard === dashboard.id;
            return (
              <li
                key={dashboard.id}
                onClick={() => setSelectedDashboard(dashboard.id)}
                className={`cursor-pointer p-2 rounded-md transition border ${
                  isSelected
                    ? "bg-modern-btn text-point font-semibold border-point"
                    : "text-modern-subtext border-transparent hover:bg-modern-bg1 hover:border-modern-border"
                }`}
              >
                {dashboard.label}
              </li>
            );
          })}
        </ul>

        <div className="flex justify-end mt-5 gap-2">
          <button
            onClick={() => {
              setIsCloneModalOpen(false);
              setSelectedDashboard(null);
            }}
            className="px-4 py-2 text-sm text-modern-text bg-modern-hover rounded-md hover:bg-modern-bg1 transition"
          >
            취소
          </button>

          <button
            onClick={confirmClone}
            disabled={!selectedDashboard}
            className={`px-4 py-2 text-sm rounded-md text-point transition ${
              selectedDashboard
                ? "bg-modern-point_10 hover:bg-point_20"
                : "text-modern-text_disable opacity-60"
            }`}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloneModal;
