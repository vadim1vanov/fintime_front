import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import Accounts from "./components/Accounts/Accounts.jsx";
import AccountView from "./components/AccountView/AccountView.jsx"; // <-- Добавил импорт (предполагаю путь; скорректируйте, если нужно)
import PrivateRoute from "./routes/PrivateRoute.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/accounts"
          element={
            <PrivateRoute>
              <Accounts />
            </PrivateRoute>
          }
        />
        <Route // <-- Добавил новый маршрут
          path="/account/:id"
          element={
            <PrivateRoute>
              <AccountView />
            </PrivateRoute>
          }
        />
      </Routes>
    </Layout>
  );
}