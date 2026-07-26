import { useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { useTranslation } from "react-i18next";
import ReactGA from "react-ga4";
import categoriesInfo from "../data/categoriesInfo";

function Play() {
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const savedCategories = localStorage.getItem("categories");

        if (savedCategories) {
          setCategories(JSON.parse(savedCategories));
          setLoading(false);
          return;
        }

        const response = await fetch("https://opentdb.com/api_category.php");

        const data = await response.json();

        const categoriesWithCount = await Promise.all(
          data.trivia_categories.map(async (category) => {
            const countResponse = await fetch(
              `https://opentdb.com/api_count.php?category=${category.id}`,
            );

            const countData = await countResponse.json();

            return {
              ...category,
              totalQuestions:
                countData.category_question_count.total_question_count,
            };
          }),
        );

        setCategories(categoriesWithCount);

        ReactGA.event("feature_open", {
          feature: "Play",
        });

        localStorage.setItem("categories", JSON.stringify(categoriesWithCount));
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
    sortedCategories.sort((a, b) => b.totalQuestions - a.totalQuestions);
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
              {category.totalQuestions} questions
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
