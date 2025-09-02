document.addEventListener('DOMContentLoaded', () => {
  // Obtén el nombre de la categoría y pásalo a minúsculas
  const categoria = document.title.split('|')[0].trim().toLowerCase();
  const container = document.getElementById(`${categoria}-container`);
  
  // Ruta dinámica para JSON
  const jsonPath = window.location.pathname.includes('/productos/')
    ? '../productos.json'
    : 'productos.json';

  fetch(jsonPath)
    .then(res => res.json())
    .then(data => {
      if (!data.productos[categoria]) {
        container.innerHTML = "<p>No se encontraron productos en esta categoría.</p>";
        return;
      }

      container.innerHTML = "";
      data.productos[categoria].forEach(prod => {
        const div = document.createElement('div');
        div.classList.add('producto'); // Usa la clase de productos destacados
        div.innerHTML = `
          <img src="../img/${prod.imagen}" alt="${prod.nombre}">
          <h4>${prod.nombre}</h4>
          <p>${prod.descripcion ? prod.descripcion : ''}</p>
          <a href="../producto.html?id=${prod.id}" class="btn-ver-mas">Ver más</a>
        `;
        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error("Error al cargar productos:", err);
      container.innerHTML = "<p>Error al cargar los productos.</p>";
    });
});