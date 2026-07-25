/* global require, module */



const express = require("express");
const router = express.Router();

const {
  getAll,
  getById,
  create,
  update,
  patch,
  remove,
} = require("../controllers/categoriesController");

router.get("/categories", getAll);

router.get("/categories/:id", getById);

router.post("/categories", create);

router.put("/categories/:id", update);

router.patch("/categories/:id", patch);

router.delete("/categories/:id", remove);

module.exports = router;