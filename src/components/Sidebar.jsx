import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="sidebar">
      <h2>{t("appName")}</h2>

      <Link to="/">{t("play")}</Link>

      <Link to="/Settings">{t("settings")}</Link>
    </aside>
  );
}

export default Sidebar;
