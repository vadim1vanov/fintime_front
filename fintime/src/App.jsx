import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import Accounts from "./components/Accounts/Accounts.jsx";
import AccountView from "./components/AccountView/AccountView.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";

export default function App() {
  return (
    <Routes>
      {/* Публичные страницы без Layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Защищённые страницы с Layout */}
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/account/:id" element={<AccountView />} />
      </Route>

      {/* Редирект по умолчанию */}
      <Route path="*" element={<Navigate to="/accounts" replace />} />
    </Routes>
  );
}
