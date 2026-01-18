import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isAuth, loading } = useContext(AuthContext);

  if (loading) return <div style={{ padding: 40 }}>Загрузка...</div>;

  if (!isAuth) return <Navigate to="/login" replace />;

  return children ? children : <Outlet />;
}
