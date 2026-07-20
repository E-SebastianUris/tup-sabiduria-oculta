import { useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import categoriesInfo from "../data/categoriesInfo";
import ReactGA from "react-ga4";

function Play() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const savedCategories =
          localStorage.getItem("categories");

        if (savedCategories) {
          setCategories(
            JSON.parse(savedCategories)
          );
          setLoading(false);
          return;
        }

        const response = await fetch(
          "https://opentdb.com/api_category.php"
        );

        const data = await response.json();

        const categoriesWithCount =
          await Promise.all(
            data.trivia_categories.map(
              async (category) => {
                const countResponse =
                  await fetch(
                    `https://opentdb.com/api_count.php?category=${category.id}`
                  );

                const countData =
                  await countResponse.json();

                return {
                  ...category,
                  totalQuestions:
                    countData
                      .category_question_count
                      .total_question_count,
                };
              }
            )
          );

        setCategories(categoriesWithCount);

        ReactGA.event("feature_open", {
          feature: "Play",
        });

        localStorage.setItem(
          "categories",
          JSON.stringify(
            categoriesWithCount
          )
        );

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const categoriesList =
    Array.isArray(categories?.categories)
      ? categories.categories
      : Array.isArray(categories)
      ? categories
      : [];

  const filteredCategories =
    categoriesList.filter((category) =>
      (
        categoriesInfo[category.id]
          ?.displayName ||
        category.name
      )
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  const sortedCategories = [
    ...filteredCategories,
  ];

  if (sortBy === "name") {
    sortedCategories.sort((a, b) =>
      (
        categoriesInfo[a.id]
          ?.displayName || a.name
      ).localeCompare(
        categoriesInfo[b.id]
          ?.displayName || b.name
      )
    );
  }

  if (sortBy === "questions") {
    sortedCategories.sort(
      (a, b) =>
        b.totalQuestions -
        a.totalQuestions
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
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
        >
          <option value="name">
            Nombre A-Z
          </option>

          <option value="questions">
            Más preguntas
          </option>
        </select>
      </div>

      <div className="categories-grid">
        {sortedCategories.map(
          (category) => (
            <div
              key={category.id}
              className="category-card"
            >
              <img
                src={
                  categoriesInfo[
                    category.id
                  ]?.image
                }
                alt={
                  categoriesInfo[
                    category.id
                  ]?.displayName ||
                  category.name
                }
                className="category-image"
              />

              <h3>
                {categoriesInfo[
                  category.id
                ]?.displayName ||
                  category.name}
              </h3>

              <p>
                {categoriesInfo[
                  category.id
                ]?.description ||
                  "Descripción no disponible"}
              </p>

              <p className="question-count">
                {
                  category.totalQuestions
                }{" "}
                preguntas
              </p>

              <button
                className="play-btn"
                onClick={() => {
                  ReactGA.event(
                    "section_click",
                    {
                      section:
                        categoriesInfo[
                          category.id
                        ]?.displayName ||
                        category.name,
                    }
                  );
                }}
              >
                Jugar
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Play;