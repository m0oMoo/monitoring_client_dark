import { Dataset } from "@/types/dashboard";

export const convertToTable = (datasets: Dataset[]) => {
  if (!datasets || datasets.length === 0) return { headers: [], rows: [] };

  const headers = ["항목", ...datasets.map((dataset) => dataset.label)];

  const rows = datasets[0].data.map((_, index) => ({
    name: `Point ${index + 1}`,
    ...datasets.reduce((acc, dataset) => {
      acc[dataset.label] = dataset.data[index];
      return acc;
    }, {} as Record<string, any>),
  }));

  return { headers, rows };
};
