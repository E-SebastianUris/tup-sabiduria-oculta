import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useTranslation } from "react-i18next";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isTauri = !!window.__TAURI__;

  useEffect(() => {
    console.log("Location actual:", window.location.href);
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("Usuario logueado por redirect:", result.user.email);
          navigate("/");
        } else {
          console.log("No hay usuario en redirect");
        }
      })
      .catch((error) => {
        console.error("Error en redirect:", error.code, error.message);
      });
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Usuario logueado por onAuthStateChanged:", user.email);
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    try {
      setLoading(true);

      if (isTauri) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        if (result?.user) {
          console.log("Usuario logueado por popup:", result.user.email);
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error en login:", error.code, error.message);
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
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <img
            src="/logo.png"
            alt={t("appName")}
            style={{
              width: "150px",
              objectFit: "contain",
              marginBottom: "10px",
            }}
          />
          <h2 style={{ color: "#3b82f6", margin: 0 }}>{t("appName")}</h2>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {loading ? (
            <ProgressSpinner style={{ width: "40px", height: "40px" }} />
          ) : (
            <Button
              label={t("login")}
              icon="pi pi-google"
              onClick={handleLogin}
              style={{ backgroundColor: "#3b82f6", borderColor: "#3b82f6" }}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
