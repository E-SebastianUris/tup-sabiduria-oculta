import { getCategoriesFromApi } from "./api";
import { getCategories, saveCategories } from "./storage";

export async function getCategoriesStore() {
  const storedCategories = getCategories();

  if (storedCategories) {
    return storedCategories;
  }

  const apiCategories = await getCategoriesFromApi();

  saveCategories(apiCategories);

  return apiCategories;
}
