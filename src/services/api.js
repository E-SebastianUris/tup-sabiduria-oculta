import { auth } from "../firebase";

const API_URL = "https://tup-sabiduria-oculta-backend.onrender.com/api";

async function getAuthHeader() {
  const token = await auth.currentUser.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

export async function getCategoriesFromApi() {
  const authHeader = await getAuthHeader();

  const response = await fetch(`${API_URL}/categories`, {
    headers: authHeader,
  });

  if (!response.ok) {
    throw new Error("No se pudieron obtener las categorías");
  }

  return response.json();
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
