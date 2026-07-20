const API_URL = "https://opentdb.com";

export async function getCategoriesFromApi() {
  const response = await fetch(`${API_URL}/api_category.php`);

  if (!response.ok) {
    throw new Error("No se pudieron obtener las categorías");
  }

  const data = await response.json();

  const categories = await Promise.all(
    data.trivia_categories.map(async (categoria) => {
      const countResponse = await fetch(
        `${API_URL}/api_count.php?category=${categoria.id}`,
      );

      if (!countResponse.ok) {
        throw new Error("No se pudo obtener la cantidad de preguntas");
      }

      const countData = await countResponse.json();

      return {
        ...categoria,
        totalPreguntas: countData.category_question_count.total_question_count,
      };
    }),
  );

  return categories;
}
