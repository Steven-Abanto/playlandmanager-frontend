export function calculateCartSummary(detalles = []) {
  const subtotalBruto = detalles.reduce((acc, item) => {
    const precio = Number(item.precio || 0);
    const cantidad = Number(item.cantidad || 0);
    return acc + precio * cantidad;
  }, 0);

  const descuentoTotal = detalles.reduce((acc, item) => {
    return acc + Number(item.descuento || 0);
  }, 0);

  const total = detalles.reduce((acc, item) => {
    return acc + Number(item.subtotal || 0);
  }, 0);

  return {
    subtotalBruto,
    descuentoTotal,
    total,
  };
}

export function formatMoney(value) {
  return `S/ ${Number(value || 0).toFixed(2)}`;
}