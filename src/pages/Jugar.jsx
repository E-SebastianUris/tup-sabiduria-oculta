import { useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { useTranslation } from "react-i18next";
import categoriesInfo from "../data/categoriesInfo";
import ReactGA from "react-ga4";
import { getCategoriesStore } from "../services/categoriesStore";

function Jugar() {
  const { t } = useTranslation();

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("nombre");

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const categorias = await getCategoriesStore();
        setCategorias(categorias);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarCategorias();
  }, []);

  const listaCategorias = Array.isArray(categorias?.categories)
    ? categorias.categories
    : Array.isArray(categorias)
      ? categorias
      : [];

  const categoriasFiltradas = listaCategorias.filter((categoria) =>
    (categoriesInfo[categoria.id]?.displayName || categoria.name)
      .toLowerCase()
      .includes(busqueda.toLowerCase()),
  );

  const categoriasOrdenadas = [...categoriasFiltradas];

  if (orden === "nombre") {
    categoriasOrdenadas.sort((a, b) =>
      (categoriesInfo[a.id]?.displayName || a.name).localeCompare(
        categoriesInfo[b.id]?.displayName || b.name,
      ),
    );
  }

  if (orden === "preguntas") {
    categoriasOrdenadas.sort((a, b) => b.totalPreguntas - a.totalPreguntas);
  }

  if (loading) {
    return (
      <div
        className="loading-container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "100px",
        }}
      >
        <ProgressSpinner />
        <p>{t("loadingCategories")}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{t("appName")}</h1>

      <p>{t("selectCategory")}</p>

      <div
        className="controls"
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder={t("searchCategory")}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select value={orden} onChange={(e) => setOrden(e.target.value)}>
          <option value="nombre">{t("sortByName")}</option>

          <option value="preguntas">{t("sortByQuestions")}</option>
        </select>
      </div>

      <div className="categories-grid">
        {categoriasOrdenadas.map((categoria) => (
          <div key={categoria.id} className="category-card">
            <img
              src={categoriesInfo[categoria.id]?.image}
              alt={categoriesInfo[categoria.id]?.displayName || categoria.name}
              className="category-image"
            />

            <h3>
              {categoriesInfo[categoria.id]?.displayName || categoria.name}
            </h3>

            <p>
              {categoriesInfo[categoria.id]?.description || t("noDescription")}
            </p>

            <p className="question-count">
              {categoria.totalPreguntas} {t("questions")}
            </p>

            <button
              className="play-btn"
              onClick={() => {
                ReactGA.event("section_click", {
                  section:
                    categoriesInfo[categoria.id]?.displayName || categoria.name,
                });
              }}
            >
              {t("play")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jugar;
