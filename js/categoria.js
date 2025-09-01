document.addEventListener("DOMContentLoaded", async () => {
  const contenedoresContainer = document.querySelector(".productos-grid");

  try {
    // ✅ Se carga productos.json desde la raíz
    const response = await fetch("productos.json");
    if (!response.ok) throw new Error("No se pudo cargar productos.json");

    const productos = await response.json();

    // Detectar la categoría actual a partir del nombre del archivo
    const categoriaActual = window.location.pathname
      .split("/")
      .pop()
      .replace(".html", "");

    // Filtrar productos por categoría
    const productosFiltrados = productos.filter(
      (p) => p.categoria.toLowerCase() === categoriaActual
    );

    contenedoresContainer.innerHTML = "";

    if (productosFiltrados.length > 0) {
      productosFiltrados.forEach((producto) => {
        const card = document.createElement("div");
        card.classList.add("producto-card");
        card.innerHTML = `
          <a href="../producto.html?id=${producto.id}">
            <img src="../img/${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
          </a>
        `;
        contenedoresContainer.appendChild(card);
      });
    } else {
      contenedoresContainer.innerHTML = `
        <p>No hay productos disponibles en esta categoría.</p>
      `;
    }
  } catch (error) {
    console.error("Error cargando productos:", error);
    contenedoresContainer.innerHTML =
      "<p>Error al cargar los productos.</p>";
  }
});
