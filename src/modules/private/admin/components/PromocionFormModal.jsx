import { useEffect, useMemo, useState } from "react";

const emptyForm = {
  codigo: "",
  nombre: "",
  descripcion: "",
  porcentaje: "",
  montoMax: "",
  fechaInicio: "",
  fechaFin: "",
  activo: true,
  productosIds: [],
};

function toInputDate(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function porcentajeBackendToView(value) {
  if (value === null || value === undefined) return "";
  return Number(value) * 100;
}

function porcentajeViewToBackend(value) {
  if (value === "" || value === null || value === undefined) return null;
  return Number(value) / 100;
}

export default function PromocionFormModal({
  open,
  onClose,
  onSubmit,
  promocion,
  productos = [],
  loading = false,
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;

    if (promocion) {
      setForm({
        codigo: promocion.codigo ?? "",
        nombre: promocion.nombre ?? "",
        descripcion: promocion.descripcion ?? "",
        porcentaje: porcentajeBackendToView(promocion.porcentaje),
        montoMax: promocion.montoMax ?? "",
        fechaInicio: toInputDate(promocion.fechaInicio),
        fechaFin: toInputDate(promocion.fechaFin),
        activo: promocion.activo ?? true,
        productosIds: promocion.productosIds ?? [],
      });
    } else {
      setForm(emptyForm);
    }

    setErrors({});
  }, [open, promocion]);

  const productosOrdenados = useMemo(() => {
    return [...productos].sort((a, b) =>
      (a.descripcion || "").localeCompare(b.descripcion || "")
    );
  }, [productos]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProductoToggle = (idProducto) => {
    setForm((prev) => {
      const exists = prev.productosIds.includes(idProducto);
      return {
        ...prev,
        productosIds: exists
          ? prev.productosIds.filter((id) => id !== idProducto)
          : [...prev.productosIds, idProducto],
      };
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.codigo.trim()) newErrors.codigo = "El código es obligatorio.";
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";

    if (form.porcentaje === "") {
      newErrors.porcentaje = "El porcentaje es obligatorio.";
    } else if (Number(form.porcentaje) <= 0 || Number(form.porcentaje) > 100) {
      newErrors.porcentaje = "Debe estar entre 0 y 100.";
    }

    if (form.montoMax === "") {
      newErrors.montoMax = "El monto máximo es obligatorio.";
    } else if (Number(form.montoMax) < 0) {
      newErrors.montoMax = "No puede ser negativo.";
    }

    if (!form.fechaInicio) newErrors.fechaInicio = "La fecha inicio es obligatoria.";
    if (!form.fechaFin) newErrors.fechaFin = "La fecha fin es obligatoria.";

    if (form.fechaInicio && form.fechaFin && form.fechaFin < form.fechaInicio) {
      newErrors.fechaFin = "La fecha fin no puede ser menor a la fecha inicio.";
    }

    if (!form.productosIds.length) {
      newErrors.productosIds = "Selecciona al menos un producto.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      codigo: form.codigo.trim(),
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      porcentaje: porcentajeViewToBackend(form.porcentaje),
      montoMax: Number(form.montoMax),
      fechaInicio: form.fechaInicio,
      fechaFin: form.fechaFin,
      activo: Boolean(form.activo),
      productosIds: form.productosIds,
    };

    await onSubmit(payload);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={{ margin: 0 }}>
            {promocion ? "Editar promoción" : "Nueva promoción"}
          </h2>
          <button type="button" onClick={onClose} style={styles.closeButton}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} style={styles.form}>
          <div style={styles.grid2}>
            <div>
              <label style={styles.label}>Código</label>
              <input
                name="codigo"
                value={form.codigo}
                onChange={handleChange}
                style={styles.input}
                placeholder="PROMO10"
              />
              {errors.codigo && <p style={styles.error}>{errors.codigo}</p>}
            </div>

            <div>
              <label style={styles.label}>Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                style={styles.input}
                placeholder="Promo de verano"
              />
              {errors.nombre && <p style={styles.error}>{errors.nombre}</p>}
            </div>
          </div>

          <div>
            <label style={styles.label}>Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Descuento especial por temporada"
            />
          </div>

          <div style={styles.grid2}>
            <div>
              <label style={styles.label}>Porcentaje (%)</label>
              <input
                type="number"
                name="porcentaje"
                value={form.porcentaje}
                onChange={handleChange}
                style={styles.input}
                min="0"
                max="100"
                step="0.01"
                placeholder="20"
              />
              {errors.porcentaje && <p style={styles.error}>{errors.porcentaje}</p>}
            </div>

            <div>
              <label style={styles.label}>Monto máximo</label>
              <input
                type="number"
                name="montoMax"
                value={form.montoMax}
                onChange={handleChange}
                style={styles.input}
                min="0"
                step="0.01"
                placeholder="50.00"
              />
              {errors.montoMax && <p style={styles.error}>{errors.montoMax}</p>}
            </div>
          </div>

          <div style={styles.grid2}>
            <div>
              <label style={styles.label}>Fecha inicio</label>
              <input
                type="date"
                name="fechaInicio"
                value={form.fechaInicio}
                onChange={handleChange}
                style={styles.input}
              />
              {errors.fechaInicio && <p style={styles.error}>{errors.fechaInicio}</p>}
            </div>

            <div>
              <label style={styles.label}>Fecha fin</label>
              <input
                type="date"
                name="fechaFin"
                value={form.fechaFin}
                onChange={handleChange}
                style={styles.input}
              />
              {errors.fechaFin && <p style={styles.error}>{errors.fechaFin}</p>}
            </div>
          </div>

          <div style={styles.checkboxRow}>
            <input
              id="activo"
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleChange}
            />
            <label htmlFor="activo">Promoción activa</label>
          </div>

          <div>
            <label style={styles.label}>Productos asociados</label>
            <div style={styles.productList}>
              {productosOrdenados.map((producto) => (
                <label key={producto.idProducto} style={styles.productItem}>
                  <input
                    type="checkbox"
                    checked={form.productosIds.includes(producto.idProducto)}
                    onChange={() => handleProductoToggle(producto.idProducto)}
                  />
                  <span>
                    {producto.descripcion}{" "}
                    {producto.esServicio ? "(Servicio)" : "(Producto)"}
                  </span>
                </label>
              ))}
            </div>
            {errors.productosIds && <p style={styles.error}>{errors.productosIds}</p>}
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.secondaryButton}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} style={styles.primaryButton}>
              {loading ? "Guardando..." : promocion ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: 16,
  },
  modal: {
    width: "100%",
    maxWidth: 900,
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  closeButton: {
    border: "none",
    background: "transparent",
    fontSize: 20,
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    minHeight: 90,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    resize: "vertical",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  productList: {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 12,
    maxHeight: 250,
    overflowY: "auto",
    display: "grid",
    gap: 8,
  },
  productItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    padding: "10px 16px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "10px 16px",
    border: "1px solid #ccc",
    background: "#fff",
    borderRadius: 8,
    cursor: "pointer",
  },
  error: {
    color: "crimson",
    fontSize: 13,
    marginTop: 6,
    marginBottom: 0,
  },
};