import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { Dashboard, DashboardPannel } from "@/types/dashboard";

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
  addPannelToDraft: (pannel: DashboardPannel, isEdit: boolean) => void;
  updateDraftDashboard: (updatedDraftDashboard: DraftDashboard) => void;
  cancelDraftDashboard: () => void;
  deleteDraftDashboard: () => void;
  resetDraftDashboard: () => void;
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

  addPannelToDraft: (pannel, isEdit = false) => {
    set((state) => {
      if (!state.draftDashboard) {
        console.warn("Cannot add panel: No draft dashboard started");
        return state;
      }

      if (isEdit) {
        const updatedPannels = state.draftDashboard.pannels.map(
          (existingPannel) =>
            existingPannel.pannelId === pannel.pannelId
              ? { ...existingPannel, ...pannel }
              : existingPannel
        );

        return {
          draftDashboard: {
            ...state.draftDashboard,
            pannels: updatedPannels,
          },
        };
      }

      return {
        draftDashboard: {
          ...state.draftDashboard,
          pannels: [
            ...state.draftDashboard.pannels,
            {
              ...pannel,
              pannelId: uuidv4(),
            },
          ],
        },
      };
    });
  },

  updateDraftDashboard: (updatedDraftDashboard: DraftDashboard) => {
    if (!get().draftDashboard) {
      console.warn("No draft dashboard to update");
      return;
    }
    set({ draftDashboard: updatedDraftDashboard });
  },

  cancelDraftDashboard: () => {
    set({ draftDashboard: null });
  },

  deleteDraftDashboard: () => {
    set({ draftDashboard: null });
  },

  resetDraftDashboard: () => {
    set({ draftDashboard: null });
  },
}));
