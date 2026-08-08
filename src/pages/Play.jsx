import { useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { useTranslation } from "react-i18next";
import ReactGA from "react-ga4";
import categoriesInfo from "../data/categoriesInfo";
import { getCategoriesStore } from "../services/categoriesStore";

function Play() {
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const storeCategories = await getCategoriesStore();

        setCategories(storeCategories);

        ReactGA.event("feature_open", {
          feature: "Play",
        });
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const categoriesList = Array.isArray(categories)
    ? categories
    : Array.isArray(categories?.categories)
      ? categories.categories
      : [];

  const filteredCategories = categoriesList.filter((category) =>
    (categoriesInfo[category.id]?.displayName || category.name)
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const sortedCategories = [...filteredCategories];

  if (sortBy === "name") {
    sortedCategories.sort((a, b) =>
      (categoriesInfo[a.id]?.displayName || a.name).localeCompare(
        categoriesInfo[b.id]?.displayName || b.name,
      ),
    );
  }

  if (sortBy === "questions") {
    sortedCategories.sort((a, b) => b.totalPreguntas - a.totalPreguntas);
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
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Name A-Z</option>
          <option value="questions">Most Questions</option>
        </select>
      </div>

      <div className="categories-grid">
        {sortedCategories.map((category) => (
          <div key={category.id} className="category-card">
            <img
              src={categoriesInfo[category.id]?.image}
              alt={categoriesInfo[category.id]?.displayName || category.name}
              className="category-image"
            />

            <h3>{categoriesInfo[category.id]?.displayName || category.name}</h3>

            <p>
              {categoriesInfo[category.id]?.description ||
                "Description not available"}
            </p>

            <p className="question-count">
              {category.totalPreguntas} questions
            </p>

            <button
              className="play-btn"
              onClick={() => {
                ReactGA.event("section_click", {
                  section:
                    categoriesInfo[category.id]?.displayName || category.name,
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

export default Play;
