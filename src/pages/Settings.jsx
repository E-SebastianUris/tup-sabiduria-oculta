import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Avatar } from "primereact/avatar";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import { useTranslation } from "react-i18next";

export default function Settings() {
  const navigate = useNavigate();
  const userAgent = navigator.userAgent;
  const user = auth.currentUser;

  const { t, i18n } = useTranslation();

  const cambiarIdioma = (idioma) => {
    i18n.changeLanguage(idioma);
  };

  const handleLogout = () => {
    confirmDialog({
      message: t("logoutMessage"),
      header: t("logoutConfirmation"),
      icon: "pi pi-exclamation-triangle",
      acceptLabel: t("yes"),
      rejectLabel: t("no"),

      accept: async () => {
        try {
          await signOut(auth);
          navigate("/login");
        } catch (error) {
          console.error("Error al cerrar sesión:", error);
        }
      },

      reject: () => {},
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card
        title={t("settings")}
        style={{
          width: "30rem",
          margin: "auto",
        }}
      >
        <div className="p-fluid">
          {/* Perfil */}
          <div
            style={{
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            <Avatar
              image={user?.photoURL}
              size="xlarge"
              shape="circle"
              className="p-mb-3"
            />

            <h3>{user?.displayName}</h3>

            <p>{user?.email}</p>
          </div>

          <Divider />

          {/* Idioma */}
          <div style={{ marginBottom: "1rem" }}>
            <h3>{t("language")}</h3>

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <Button
                label="ES"
                outlined={i18n.language !== "es"}
                onClick={() => cambiarIdioma("es")}
              />

              <Button
                label="EN"
                outlined={i18n.language !== "en"}
                onClick={() => cambiarIdioma("en")}
              />
            </div>
          </div>

          <Divider />

          {/* Información */}
          <div style={{ marginBottom: "1rem" }}>
            <h3>{t("appInfo")}</h3>

            <p>
              <strong>{t("application")}:</strong> {t("appName")}
            </p>

            <p>
              <strong>{t("version")}:</strong> TP 6
            </p>

            <p>
              <strong>{t("userAgent")}:</strong> {userAgent}
            </p>
          </div>

          <Divider />

          <Button
            label={t("logout")}
            icon="pi pi-sign-out"
            severity="danger"
            onClick={handleLogout}
            style={{ marginTop: "1rem" }}
          />

          <ConfirmDialog />
        </div>
      </Card>
    </div>
  );
}
