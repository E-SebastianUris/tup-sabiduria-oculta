const KEY = "categorias";
const EXPIRATION = 5 * 60 * 1000; // 5 minutos

export function getCategories() {
  const data = localStorage.getItem(KEY);

  if (!data) {
    return null;
  }

  const parsed = JSON.parse(data);

  if (Date.now() > parsed.expiration) {
    localStorage.removeItem(KEY);
    return null;
  }

  return parsed.categories;
}

export function saveCategories(categories) {
  localStorage.setItem(
    KEY,
    JSON.stringify({
      categories,
      expiration: Date.now() + EXPIRATION,
    }),
  );
}

export function clearCategories() {
  localStorage.removeItem(KEY);
}
