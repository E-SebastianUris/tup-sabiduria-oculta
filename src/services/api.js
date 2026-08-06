import { auth } from "../firebase";

const API_URL = "https://tup-sabiduria-oculta-backend.onrender.com/api";
const OPENTDB_URL = "https://opentdb.com";

async function getAuthHeader() {
  const token = await auth.currentUser.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

export async function getCategoriesFromApi() {
  const response = await fetch(`${API_URL}/categories`);

  if (!response.ok) {
    throw new Error("No se pudieron obtener las categorías");
  }

  const data = await response.json();

  const categories = await Promise.all(
    data.map(async (categoria) => {
      const countResponse = await fetch(
        `${OPENTDB_URL}/api_count.php?category=${categoria.id}`,
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

export async function createCategory(name) {
  const authHeader = await getAuthHeader();

  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify({ id: Date.now(), name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "No se pudo crear la categoría");
  }

  return response.json();
}

export async function updateCategory(id, name) {
  const authHeader = await getAuthHeader();

  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "No se pudo actualizar la categoría");
  }

  return response.json();
}

export async function deleteCategory(id) {
  const authHeader = await getAuthHeader();

  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    headers: authHeader,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "No se pudo eliminar la categoría");
  }

  return response.json();
}
