import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

interface Snapshot {
  snapshotId: string;
  name: string;
  description: string;
  createdAt: string;

  data: {
    dashboards: any;
    charts: any;
    widgets: any;
    from?: string | null;
    to?: string | null;
  };
}

interface SnapshotStore {
  snapshots: Snapshot[];
  createSnapshot: (
    name: string,
    description: string,
    data: Snapshot["data"],
    from?: string | null,
    to?: string | null
  ) => void;

  deleteSnapshot: (snapshotId: string) => void;
  getSnapshotById: (snapshotId: string) => Snapshot | undefined;
}

export const useSnapshotStore = create<SnapshotStore>()(
  persist(
    (set, get) => ({
      snapshots: [],

      createSnapshot: (name, description, data, from, to) => {
        const newSnapshot: Snapshot = {
          snapshotId: uuidv4(),
          name,
          description,
          createdAt: new Date().toISOString(),
          data,
        };
        set((state) => ({
          snapshots: [...state.snapshots, newSnapshot],
        }));
      },

      deleteSnapshot: (snapshotId) => {
        set((state) => ({
          snapshots: state.snapshots.filter((s) => s.snapshotId !== snapshotId),
        }));
      },

      getSnapshotById: (snapshotId) => {
        return get().snapshots.find((s) => s.snapshotId === snapshotId);
      },
    }),
    {
      name: "dashboard-snapshots",
    }
  )
);
