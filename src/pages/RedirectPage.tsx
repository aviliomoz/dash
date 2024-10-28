import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const RedirectPage = () => {
  const { usuario, checking } = useAuth(); // Simulacion de auth

  if (!usuario && !checking) return <Navigate to={"/login"} />;

  return <Navigate to={"/dashboard"} />;
};
