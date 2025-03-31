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
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]">
      <div className="bg-modern-bg p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4 text-modern-text">
          대시보드 선택
        </h2>
        <ul className="flex flex-col gap-1">
          {dashboardList.map((dashboard) => (
            <li
              key={dashboard.id}
              onClick={() => setSelectedDashboard(dashboard.id)}
              className={`cursor-pointer p-2 rounded ${
                selectedDashboard === dashboard.id
                  ? "bg-modern-btn text-white"
                  : "hover:bg-modern-bg1 text-modern-text_disable"
              }`}
            >
              {dashboard.label}
            </li>
          ))}
        </ul>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              setIsCloneModalOpen(false);
              setSelectedDashboard(null);
            }}
            className="mr-2 px-4 py-2 bg-modern-bg2 rounded text-modern-text hover:bg-modern-btn"
          >
            취소
          </button>
          <button
            onClick={confirmClone}
            disabled={!selectedDashboard}
            className={`px-4 py-2 rounded text-modern-text ${
              selectedDashboard
                ? "bg-modern-btn hover:bg-modern-btn_pressed"
                : "bg-modern-btn opacity-80"
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
