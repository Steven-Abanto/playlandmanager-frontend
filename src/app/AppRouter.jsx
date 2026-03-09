import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layout/public/PublicLayout";
import HomePage from "../layout/public/home/pages/HomePage";

function ProductosPage() {
  return <div className="p-10 text-3xl">Página de Productos</div>;
}

function PromocionesPage() {
  return <div className="p-10 text-3xl">Página de Promociones</div>;
}

function LoginPage() {
  return <div className="p-10 text-3xl">Página de Login</div>;
}

function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/promociones" element={<PromocionesPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default AppRouter;