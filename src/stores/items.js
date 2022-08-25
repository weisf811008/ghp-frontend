import { ref } from "vue";
import { defineStore } from "pinia";
import { request } from "../utils/http.util";

const resource = "items";

export const useItemStore = defineStore(resource, () => {
  const items = ref([]);
  const isLoading = ref(false);

  const getTransferList = () => {
    return items.value.map((item) => ({
      key: item.id,
      label: `[${item.category}]-[${item.no}]-${item.item}`,
    }));
  };

  const getNeedToComment = async (id) => {
    isLoading.value = true;
    const res = await request.get(`${resource}/${id}`);
    isLoading.value = false;
    return res.data.items.value.map((i) => {
      i.needTocomment;
    });
  };

  const getItems = async () => {
    isLoading.value = true;
    const res = await request.get(resource);
    items.value = res.data.items;
    items.value.sort((a, b) => {
      if (a.no > b.no) return 1;
      if (a.no < b.no) return -1;
      return 0;
    });
    isLoading.value = false;
  };

  const createItem = async (data) => {
    isLoading.value = true;
    await request.post(resource, data);
    isLoading.value = false;
    await getItems();
  };

  const updateItem = async (id, data) => {
    isLoading.value = true;
    await request.put(`${resource}/${id}`, data);
    isLoading.value = false;
    await getItems();
  };

  const deleteItem = async (id) => {
    isLoading.value = true;
    await request.delete(`${resource}/${id}`);
    isLoading.value = false;
    await getItems();
  };

  return {
    items,
    isLoading,
    getTransferList,
    getNeedToComment,
    getItems,
    createItem,
    updateItem,
    deleteItem,
  };
});
