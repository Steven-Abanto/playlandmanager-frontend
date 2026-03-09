function InfoSection() {
  return (
    <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
      <div>
        <h2 className="mb-4 text-4xl font-bold">Información</h2>
        <p className="text-xl leading-9">
          Bienvenido a Play Land Manager. Aquí podrás revisar productos,
          promociones y novedades de nuestro parque. Esta primera versión de la
          página mostrará información principal para clientes y acceso rápido a
          las promociones destacadas.
        </p>
      </div>

      <div className="flex h-72 items-center justify-center border-2 border-black bg-white text-4xl font-bold">
        Foto
      </div>
    </div>
  );
}

export default InfoSection;