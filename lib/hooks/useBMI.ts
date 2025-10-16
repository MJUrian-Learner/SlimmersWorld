import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface BMIRecord {
  id: string;
  weight: string;
  height: string;
  bmiValue: string;
  recordedAt: Date;
  category: string;
}

interface SaveBMIParams {
  weight: number;
  height: number;
  bmiValue: number;
}

// Fetch BMI history
export function useBMIHistory() {
  return useQuery({
    queryKey: ["bmi-history"],
    queryFn: async (): Promise<BMIRecord[]> => {
      const response = await fetch("/api/bmi-history");
      if (!response.ok) {
        throw new Error("Failed to fetch BMI history");
      }
      const data = await response.json();
      return data.data;
    },
  });
}

// Save BMI record
export function useSaveBMI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SaveBMIParams): Promise<BMIRecord> => {
      const response = await fetch("/api/bmi-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save BMI record");
      }

      const data = await response.json();
      return data.data;
    },
    onSuccess: () => {
      // Invalidate and refetch BMI history
      queryClient.invalidateQueries({ queryKey: ["bmi-history"] });
    },
  });
}

// Delete BMI record
export function useDeleteBMI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recordId: string): Promise<void> => {
      const response = await fetch("/api/bmi-history", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recordId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete BMI record");
      }
    },
    onSuccess: () => {
      // Invalidate and refetch BMI history
      queryClient.invalidateQueries({ queryKey: ["bmi-history"] });
    },
  });
}
