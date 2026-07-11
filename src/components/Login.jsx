import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import ReactGA from "react-ga4";
import * as Sentry from "@sentry/react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleLogin = async () => {
  try {
    setLoading(true);
    const result = await signInWithPopup(auth, googleProvider);
    ReactGA.event("login", { user_email: result.user.email });
    
    try {
      throw new Error("Error forzado después del login");
    } catch (err) {
      console.log("Forzando error con email:", result.user.email);
      Sentry.captureException(err, {
        extra: { user_email: result.user.email },
      });
    }

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
        backgroundColor: "#f4f6f8"
      }}
    >
      <Card style={{ width: "25rem" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: "1.5rem"
          }}
        >
          <img
            src="/logo.png"
            alt="Sabiduría Oculta"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "contain",
              marginBottom: "10px"
            }}
          />

          <h2
            style={{
              color: "#3b82f6",
              margin: 0
            }}
          >
            Sabiduría Oculta
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center"
          }}
        >
          {loading ? (
            <ProgressSpinner
              style={{
                width: "40px",
                height: "40px"
              }}
            />
          ) : (
            <Button
              label="Iniciar sesión con Google"
              icon="pi pi-google"
              onClick={handleLogin}
              style={{
                backgroundColor: "#3b82f6",
                borderColor: "#3b82f6"
              }}
            />
          )}
        </div>
      </Card>
    </div>
  );
}