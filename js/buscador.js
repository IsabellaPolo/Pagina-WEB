document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("search-input");

  input.addEventListener("keypress", async function (e) {
    if (e.key === "Enter") {
      const query = input.value.trim().toLowerCase();
      if (!query) return;

      try {
        const res = await fetch("productos.json");
        const data = await res.json();
        let encontrado = null;

        for (const categoria in data.productos) {
          for (const producto of data.productos[categoria]) {
            const nombre = producto.nombre.toLowerCase();
            if (nombre.includes(query)) {
              encontrado = producto;
              break;
            }
          }
          if (encontrado) break;
        }

        if (encontrado) {
          window.location.href = `producto.html?id=${encontrado.id}`;
        } else {
          alert("Producto no encontrado.");
        }
      } catch (err) {
        console.error("Error en la búsqueda:", err);
        alert("Hubo un error al buscar el producto.");
      }
    }
  });
});
