/* global module */

let categories = [];

async function loadCategories() {
  const response = await fetch("https://opentdb.com/api_category.php");
  const data = await response.json();

  categories = data.trivia_categories;
}

function getAll(req, res) {
  res.json(categories);
}

function getById(req, res) {
  const id = Number(req.params.id);

  const category = categories.find((item) => item.id === id);

  if (!category) {
    return res.status(404).json({ error: "Categoría no encontrada" });
  }

  res.json(category);
}

function create(req, res) {
  const newCategory = {
    id: Date.now(),
    ...req.body,
  };

  categories.push(newCategory);

  res.status(201).json(newCategory);
}

function update(req, res) {
  const id = Number(req.params.id);

  const index = categories.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Categoría no encontrada" });
  }

  categories[index] = req.body;

  res.json(categories[index]);
}

function patch(req, res) {
  const id = Number(req.params.id);

  const category = categories.find((item) => item.id === id);

  if (!category) {
    return res.status(404).json({ error: "Categoría no encontrada" });
  }

  Object.assign(category, req.body);

  res.json(category);
}

function remove(req, res) {
  const id = Number(req.params.id);

  categories = categories.filter((item) => item.id !== id);

  res.json({ message: "Categoría eliminada" });
}

module.exports = {
  loadCategories,
  getAll,
  getById,
  create,
  update,
  patch,
  remove,
};