import { ref } from "vue";
import { defineStore } from "pinia";
import { request } from "../utils/http.util";

const resource = "reports/ghp";

export const useReportStore = defineStore(resource, () => {
  const isLoading = ref(false);

  const getReportGhp = async (start, end) => {
    isLoading.value = true;
    const res = await request.get(resource, {
      params: {
        start,
        end,
      },
    });
    isLoading.value = false;
    return res.data;
  };

  return {
    isLoading,
    getReportGhp,
  };
});
