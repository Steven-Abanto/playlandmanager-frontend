import api from "../../../../api/axios";

export async function getOrCreateActiveCart({ idUsuario, tipoCompra }) {
  const response = await api.post("/api/core/carrito/active", {
    idUsuario,
    tipoCompra,
  });

  return response.data;
}

export async function getCartById(idCarrito) {
  const response = await api.get(`/api/core/carrito/${idCarrito}`);
  return response.data;
}

export async function addCartItem({ idCarrito, idProducto, cantidad }) {
  const response = await api.post("/api/core/carrito/items", {
    idCarrito,
    idProducto,
    cantidad,
  });

  return response.data;
}

export async function updateCartItem({ idCarrito, idProducto, cantidad }) {
  const response = await api.put("/api/core/carrito/items", {
    idCarrito,
    idProducto,
    cantidad,
  });

  return response.data;
}

export async function removeCartItem(idCarrito, idProducto) {
  const response = await api.delete(`/api/core/carrito/${idCarrito}/items/${idProducto}`);
  return response.data;
}

export async function applyCartPromotion(idCarrito, codigoPromocion) {
  const response = await api.post(`/api/core/carrito/${idCarrito}/promotion`, {
    codigoPromocion,
  });

  return response.data;
}

export async function removeCartPromotion(idCarrito) {
  const response = await api.delete(`/api/core/carrito/${idCarrito}/promotion`);
  return response.data;
}

export async function recalculateCart(idCarrito) {
  const response = await api.post(`/api/core/carrito/${idCarrito}/recalculate`);
  return response.data;
}