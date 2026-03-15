import { Routes, Route } from "react-router-dom";
import PublicLayout from "../../layout/public/PublicLayout";
import HomePage from "../../modules/public/home/pages/HomePage";
import ProductsPage from "../../modules/public/productos/pages/ProductsPage";
import PromotionsPage from "../../modules/public/promociones/pages/PromotionsPage";
import LoginPage from "../../modules/public/auth/pages/LoginPage";
import LoginTrabajadoresPage from "../../modules/public/auth/pages/LoginTrabajadoresPage";

function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/promociones" element={<PromotionsPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/login-trabajadores" element={<LoginTrabajadoresPage />} />
    </Routes>
  );
}

export default AppRouter;
