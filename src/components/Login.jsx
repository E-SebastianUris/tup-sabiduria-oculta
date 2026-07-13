import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useTranslation } from "react-i18next";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async () => {
    try {
      setLoading(true);

      await signInWithPopup(auth, googleProvider);

      navigate("/");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Card style={{ width: "25rem" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          <img
            src="/logo.png"
            alt={t("appName")}
            style={{
              width: "150px",
              objectFit: "contain",
              marginBottom: "10px",
            }}
          />

          <h2
            style={{
              color: "#3b82f6",
              margin: 0,
            }}
          >
            {t("appName")}
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <ProgressSpinner
              style={{
                width: "40px",
                height: "40px",
              }}
            />
          ) : (
            <Button
              label={t("login")}
              icon="pi pi-google"
              onClick={handleLogin}
              style={{
                backgroundColor: "#3b82f6",
                borderColor: "#3b82f6",
              }}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
