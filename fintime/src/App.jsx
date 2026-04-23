import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import Accounts from "./components/Accounts/Accounts.jsx";
import AccountView from "./components/AccountView/AccountView.jsx";
import AllTransactions from "./components/AccountView/AllTransactions.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import AccountLayout from "./components/AccountView/AccountLayout.jsx";
export default function App() {
  return (
    <Routes>
      {/* Публичные страницы */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Защищённые страницы */}
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/accounts" element={<Accounts />} />

        <Route path="/accounts/:id" element={<AccountLayout />}>
          <Route index element={<AccountView />} />
          <Route path="transactions" element={<AllTransactions />} />
        </Route>
      </Route>

      {/* Редирект */}
      <Route path="*" element={<Navigate to="/accounts" replace />} />
    </Routes>
  );
}