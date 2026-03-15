import { useNavigate } from "react-router-dom";

function PublicFooter() {
  const navigate = useNavigate();

  return (
    <footer className="bg-blue-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Logo e Información */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Play Land Park"
                className="h-24 w-auto"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-yellow-400">Dirección</h3>
                <p className="mt-2 text-sm leading-6">
                  Av. Universitaria con Av. Jamaica<br />
                  (Parque Zonal Sinchi Roca)<br />
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-yellow-400">Teléfono</h3>
                <p className="mt-2 text-sm">
                  +51 929 935 514
                </p>
              </div>
            </div>
          </div>

          {/* Acerca de */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-cyan-400 border-b-2 border-cyan-400 pb-2">
              Acerca de
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="transition hover:text-yellow-400"
                >
                  Quiénes Somos
                </button>
              </li>
              <li>
                <button className="transition hover:text-yellow-400">
                  Historia
                </button>
              </li>
              <li>
                <button className="transition hover:text-yellow-400">
                  Organigrama
                </button>
              </li>
              <li>
                <button className="transition hover:text-yellow-400">
                  Objetivos Estratégicos
                </button>
              </li>
              <li>
                <button className="transition hover:text-yellow-400">
                  Presupuesto
                </button>
              </li>
              <li>
                <button className="transition hover:text-yellow-400">
                  Transparencia
                </button>
              </li>
            </ul>
          </div>

          {/* Enlaces de Interés */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-red-500 border-b-2 border-red-500 pb-2">
              Enlaces de Interés
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate("/productos")} className="transition hover:text-yellow-400">
                  Productos
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/promociones")} className="transition hover:text-yellow-400">
                  Promociones
                </button>
              </li>
              <li>
                <button className="transition hover:text-yellow-400">
                  Horarios
                </button>
              </li>
              <li>
                <button className="transition hover:text-yellow-400">
                  Tarifas
                </button>
              </li>
              <li>
                <button className="transition hover:text-yellow-400">
                  Grupos y eventos
                </button>
              </li>
              <li>
                <button className="transition hover:text-yellow-400">
                  Contacto
                </button>
              </li>
              <li>
                <button className="transition hover:text-yellow-400">
                  Términos y condiciones
                </button>
              </li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-yellow-400 border-b-2 border-yellow-400 pb-2">
              Redes Sociales
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://www.facebook.com/playlandparkperuinternacional?mibextid=ZbWKwL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition hover:text-yellow-400"
                >
                  <img
                    src="/facebook-svgrepo-com.svg"
                    alt="Facebook"
                    className="h-5 w-5"
                    style={{ filter: 'brightness(0) saturate(100%) invert(72%) sepia(68%) saturate(516%) hue-rotate(172deg) brightness(99%) contrast(99%)' }}
                  />
                  Play Land Park
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/playlandpark.peruintl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition hover:text-yellow-400"
                >
                  <img
                    src="/instagram-svgrepo-com.svg"
                    alt="Instagram"
                    className="h-5 w-5"
                    style={{ filter: 'brightness(0) saturate(100%) invert(72%) sepia(68%) saturate(516%) hue-rotate(172deg) brightness(99%) contrast(99%)' }}
                  />
                  @playlandpark.peruintl
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/51929935514"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition hover:text-yellow-400"
                >
                  <img
                    src="/whatsapp-svgrepo-com.svg"
                    alt="WhatsApp"
                    className="h-5 w-5"
                    style={{ filter: 'brightness(0) saturate(100%) invert(72%) sepia(68%) saturate(516%) hue-rotate(172deg) brightness(99%) contrast(99%)' }}
                  />
                  +51 929 935 514
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/playlandparkper?t=Pyq6USKp1pQP8AtQuWuVrg&s=08"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition hover:text-yellow-400"
                >
                  <img
                    src="/Twitter-X--Streamline-Bootstrap.svg"
                    alt="Twitter"
                    className="h-5 w-5"
                    style={{ filter: 'brightness(0) saturate(100%) invert(72%) sepia(68%) saturate(516%) hue-rotate(172deg) brightness(99%) contrast(99%)' }}
                  />
                  @playlandparkper
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@playlandpark.peruintl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition hover:text-yellow-400"
                >
                  <img
                    src="/tiktok-svgrepo-com.svg"
                    alt="TikTok"
                    className="h-5 w-5"
                    style={{ filter: 'brightness(0) saturate(100%) invert(72%) sepia(68%) saturate(516%) hue-rotate(172deg) brightness(99%) contrast(99%)' }}
                  />
                  @playlandpark.peruintl
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-white/20"></div>

        {/* Copyright */}
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            &copy; 2024 Play Land Park. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;

