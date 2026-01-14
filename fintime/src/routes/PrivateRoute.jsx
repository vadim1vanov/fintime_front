import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isAuth, loading } = useContext(AuthContext);

  if (loading) return null;
  if (!isAuth) return <Navigate to="/login" />;

  return children;
}
