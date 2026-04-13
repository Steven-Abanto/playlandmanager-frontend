import { Routes, Route } from "react-router-dom";
import PublicLayout from "../../layout/public/PublicLayout";
import HomePage from "../../modules/public/home/pages/HomePage";
import ProductsPage from "../../modules/public/productos/pages/ProductsPage";
import PromotionsPage from "../../modules/public/promociones/pages/PromotionsPage";
import LoginPage from "../../modules/public/auth/pages/LoginPage";
import RegisterPage from "../../modules/public/auth/pages/RegisterPage";

import ProfilePage from "../../modules/private/profile/pages/ProfilePage";
import EmpleadoPanelPage from "../../modules/private/empleado/pages/EmpleadoPanelPage";
import AdminPanelPage from "../../modules/private/admin/pages/AdminPanelPage";
import AdminUsuariosPage from "../../modules/private/admin/pages/AdminUsuariosPage";

import PrivateRoute from "../../auth/PrivateRoute.jsx";

function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/promociones" element={<PromotionsPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/empleado/panel"
        element={
          <PrivateRoute roles={["EMPLEADO", "ADMIN"]}>
            <EmpleadoPanelPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/panel"
        element={
          <PrivateRoute roles={["ADMIN"]}>
            <AdminPanelPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/usuarios"
        element={
          <PrivateRoute roles={["ADMIN"]}>
            <AdminUsuariosPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default AppRouter;