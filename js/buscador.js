document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const resultsList = document.getElementById('search-results');
  let productos = [];

  // Detecta la ruta correcta para productos.json
  let productosJsonPath = "productos.json";
  if (window.location.pathname.includes("/productos/")) {
    productosJsonPath = "../productos.json";
  }

  fetch(productosJsonPath)
    .then(res => res.json())
    .then(data => {
      for (const categoria in data.productos) {
        data.productos[categoria].forEach(p => productos.push(p));
      }
    });

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    resultsList.innerHTML = '';

    if (query.length < 2) return;

    const resultados = productos.filter(p =>
      p.nombre.toLowerCase().includes(query)
    ).slice(0, 10);

    resultados.forEach(producto => {
      const li = document.createElement('li');
      li.textContent = producto.nombre;
      li.onclick = () => {
        // Ajusta la ruta según la ubicación
        let productoHref = "producto.html?id=" + producto.id;
        if (window.location.pathname.includes("/productos/")) {
          productoHref = "../producto.html?id=" + producto.id;
        }
        window.location.href = productoHref;
      };
      resultsList.appendChild(li);
    });
  });

  // Oculta los resultados si se hace clic fuera
  document.addEventListener('click', e => {
    if (!document.querySelector('.search-container').contains(e.target)) {
      resultsList.innerHTML = '';
    }
  });
});