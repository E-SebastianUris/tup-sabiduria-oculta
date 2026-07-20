import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";

import Login from "./components/Login";
import Layout from "./components/Layout";

import Play from "./pages/Play";
import Settings from "./pages/Settings";

import "./App.css";

function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
      }
    );

    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return <div>Cargando...</div>;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? <Navigate to="/" /> : <Login />
        }
      />

      <Route
        element={
          user ? (
            <Layout />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route
          path="/"
          element={<Play />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;