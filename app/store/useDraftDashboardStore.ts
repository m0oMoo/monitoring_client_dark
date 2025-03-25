import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { Dashboard, DashboardPannel } from "@/types/dashboard";
import { useDashboardStore2 } from "./useDashboard2Store";

interface DraftDashboard {
  id: string;
  label: string;
  description: string;
  pannels: DashboardPannel[];
}

interface DashboardStore {
  draftDashboard: DraftDashboard | null; // 단일 대시보드를 저장
  getDraftDashboardById: () => DraftDashboard | null; // draftDashboard 반환
  startDraftDashboard: (initialData: Partial<DraftDashboard>) => void;
  addPannelToDraft: (pannel: DashboardPannel) => void;
  cancelDraftDashboard: () => void;
  deleteDraftDashboard: () => void;
}

export const useDraftDashboardStore = create<DashboardStore>()((set, get) => ({
  draftDashboard: null, // 단일 대시보드 객체로 초기화

  // draftDashboard가 있을 경우 반환
  getDraftDashboardById: () => get().draftDashboard,

  startDraftDashboard: (initialData) => {
    const newId = uuidv4();
    set({
      draftDashboard: {
        id: initialData.id || newId,
        label: initialData.label || "",
        description: initialData.description || "",
        pannels: [],
      },
    });
  },

  addPannelToDraft: (pannel) => {
    set((state) => {
      if (!state.draftDashboard) {
        console.warn("Cannot add panel: No draft dashboard started");
        return state;
      }
      return {
        draftDashboard: {
          ...state.draftDashboard,
          pannels: [
            ...state.draftDashboard.pannels,
            {
              ...pannel,
              pannelId: uuidv4(), // 각 패널에 고유 ID 부여
            },
          ],
        },
      };
    });
  },

  cancelDraftDashboard: () => {
    set({ draftDashboard: null });
  },

  // 임시 대시보드 삭제 함수 추가
  deleteDraftDashboard: () => {
    set({ draftDashboard: null });
    console.log("임시 대시보드가 삭제되었습니다.");
  },
}));

// 임시 대시보드 삭제 함수 추가
// 대시보드 저장 하지 않았을 경우 삭제
