/* global require */

const express = require("express");

const categoriesRoutes = require("./routes/categoriesRoutes");
const { loadCategories } = require("./controllers/categoriesController");


const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api", categoriesRoutes);

app.get("/", (req, res) => {
  res.send("Backend de Sabiduría Oculta funcionando");
});
loadCategories();



app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
