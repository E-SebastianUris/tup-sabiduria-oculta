import { useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import categoriesInfo from "../data/categoriesInfo";

function Jugar() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("nombre");

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const guardadas =
          localStorage.getItem("categorias");

        if (guardadas) {
          setCategorias(JSON.parse(guardadas));
          setLoading(false);
          return;
        }

        const response = await fetch(
          "https://opentdb.com/api_category.php"
        );

        const data = await response.json();

        const categoriasConCantidad =
          await Promise.all(
            data.trivia_categories.map(
              async (categoria) => {
                const countResponse =
                  await fetch(
                    `https://opentdb.com/api_count.php?category=${categoria.id}`
                  );

                const countData =
                  await countResponse.json();

                return {
                  ...categoria,
                  totalPreguntas:
                    countData
                      .category_question_count
                      .total_question_count,
                };
              }
            )
          );

        setCategorias(categoriasConCantidad);

        localStorage.setItem(
          "categorias",
          JSON.stringify(
            categoriasConCantidad
          )
        );

        setLoading(false);
      } catch (error) {
        console.error(error);
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
  (
    categoriesInfo[categoria.id]?.displayName ||
    categoria.name
  )
    .toLowerCase()
    .includes(busqueda.toLowerCase())
);

  const categoriasOrdenadas = [
    ...categoriasFiltradas,
  ];

  if (orden === "nombre") {
    categoriasOrdenadas.sort((a, b) =>
      (
        categoriesInfo[a.id]
          ?.displayName || a.name
      ).localeCompare(
        categoriesInfo[b.id]
          ?.displayName || b.name
      )
    );
  }

  if (orden === "preguntas") {
    categoriasOrdenadas.sort(
      (a, b) =>
        b.totalPreguntas -
        a.totalPreguntas
    );
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
        <p>
          Cargando categorías...
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Sabiduría Oculta</h1>

      <p>
        Seleccioná una categoría para
        comenzar tu aventura.
      </p>

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
          placeholder="Buscar categoría..."
          value={busqueda}
          onChange={(e) =>
            setBusqueda(
              e.target.value
            )
          }
        />

        <select
          value={orden}
          onChange={(e) =>
            setOrden(
              e.target.value
            )
          }
        >
          <option value="nombre">
            Nombre A-Z
          </option>

          <option value="preguntas">
            Más preguntas
          </option>
        </select>
      </div>

      <div className="categories-grid">
        {categoriasOrdenadas.map(
          (categoria) => (
            <div
              key={categoria.id}
              className="category-card"
            >
              <img
                src={
                  categoriesInfo[
                    categoria.id
                  ]?.image
                }
                alt={
                  categoriesInfo[
                    categoria.id
                  ]?.displayName ||
                  categoria.name
                }
                className="category-image"
              />

              <h3>
                {categoriesInfo[
                  categoria.id
                ]?.displayName ||
                  categoria.name}
              </h3>

              <p>
                {categoriesInfo[
                  categoria.id
                ]?.description ||
                  "Descripción no disponible"}
              </p>

              <p className="question-count">
                {
                  categoria.totalPreguntas
                }{" "}
                preguntas
              </p>

              <button className="play-btn">
                Jugar
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Jugar;