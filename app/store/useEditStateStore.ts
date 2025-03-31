import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface EditState {
  [dashboardId: string]: boolean;
}

/**
 * @param editStates 대시보드 ID를 키로 가지는 객체로, 각 대시보드의 edit 상태를 저장.
 * @param setEditState 특정 대시보드의 edit 상태를 설정.
 * @param clearEditState 특정 대시보드의 상태를 제거 (예: 페이지 이동 시 상태 초기화).
 * @param resetAllEditStates 모든 대시보드의 상태를 초기화
 */
export interface EditStateStore {
  editStates: EditState;
  setEditState: (dashboardId: string, isEditing: boolean) => void;
  clearEditState: (dashboardId: string) => void;
  resetAllEditStates: () => void;
}

export const useEditStateStore = create<EditStateStore>()(
  devtools(
    persist(
      (set) => ({
        editStates: {},
        setEditState: (dashboardId, isEditing) =>
          set((state: EditStateStore) => ({
            editStates: {
              ...state.editStates,
              [dashboardId]: isEditing,
            },
          })),
        clearEditState: (dashboardId) =>
          set((state: EditStateStore) => {
            const newStates = { ...state.editStates };
            delete newStates[dashboardId];
            return { editStates: newStates };
          }),
        resetAllEditStates: () =>
          set((state: EditStateStore) => {
            const resetStates: EditState = Object.keys(state.editStates).reduce(
              (acc, key) => {
                acc[key] = false;
                return acc;
              },
              {} as EditState
            );
            return { editStates: resetStates };
          }),
      }),
      {
        name: "edit-state-storage",
      }
    ),
    { name: "EditStateStore" }
  )
);
