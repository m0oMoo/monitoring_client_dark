import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

// 대시보드 정보 타입 정의
interface DashboardContextType {
  isEdit: boolean;
  dashboardId: string | null;
  title: string;
  description: string;
  panels: any[];
  setIsEdit: (isEdit: boolean) => void;
  setDashboardId: (id: string) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setPanels: (panels: any[]) => void;
  addPanel: (panel: any) => void;
  removePanel: (panelId: string) => void;
  resetDashboardState: () => void;
}

// 초기 상태 설정
const defaultContext: DashboardContextType = {
  isEdit: false,
  dashboardId: null,
  title: "",
  description: "",
  panels: [],
  setIsEdit: () => {},
  setPanels: () => {},
  setDashboardId: () => {},
  setTitle: () => {},
  setDescription: () => {},
  addPanel: () => {},
  removePanel: () => {},
  resetDashboardState: () => {},
};

// Context 생성
const DashboardContext = createContext<DashboardContextType>(defaultContext);

// Provider 컴포넌트 정의
export const DashboardProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [dashboardId, setDashboardId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [panels, setPanels] = useState<any[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // 패널 추가 함수
  const addPanel = useCallback((panel: any) => {
    setPanels((prevPanels) => [...prevPanels, panel]);
  }, []);

  // 패널 삭제 함수
  const removePanel = useCallback((panelId: string) => {
    setPanels((prevPanels) =>
      prevPanels.filter((panel) => panel.pannelId !== panelId)
    );
  }, []);

  // 대시보드 정보 초기화 함수
  const resetDashboardState = useCallback(() => {
    setDashboardId(null);
    setTitle("");
    setDescription("");
    setPanels([]);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        isEdit,
        setIsEdit,
        dashboardId,
        title,
        description,
        panels,
        setDashboardId,
        setTitle,
        setDescription,
        addPanel,
        setPanels,
        removePanel,
        resetDashboardState,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// Context 사용 훅
export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider"
    );
  }
  return context;
};
