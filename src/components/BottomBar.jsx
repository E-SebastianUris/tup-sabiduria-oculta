import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function BottomBar() {
  const { t } = useTranslation();

  return (
    <nav className="bottom-bar">
      <Link to="/">{t("play")}</Link>

      <Link to="/Settings">{t("settings")}</Link>
    </nav>
  );
}

export default BottomBar;
