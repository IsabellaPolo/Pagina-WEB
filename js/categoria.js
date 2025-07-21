document.addEventListener('DOMContentLoaded', async () => {
  console.log('Script categoria.js cargado'); // Debug

  // Detectar categoría por nombre del archivo
    const path = window.location.pathname;
    const categoria = path.split('/').pop().replace('.html', '');
  console.log('Categoría detectada:', categoria); // Debug

    const container = document.getElementById(`${categoria}-container`);
    if (!container) {
    console.error('Contenedor no encontrado para:', categoria);
    return;
    }

    try {
    console.log('Intentando cargar productos.json...'); // Debug
    const response = await fetch('/productos.json'); // Cambiado a ruta absoluta
    
    if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Datos cargados:', data); // Debug
    
    const productos = data.productos[categoria];
    console.log('Productos encontrados:', productos); // Debug

    if (!productos || productos.length === 0) {
        container.innerHTML = '<p class="no-products">No hay productos en esta categoría.</p>';
    return;
    }

    const html = await Promise.all(
        productos.map(async (producto) => {
        const imagenNombre = producto.imagen ? producto.imagen.trim() : '';
        let imagePath = '/img/default-product.png'; // Ruta absoluta por defecto
        
        if (imagenNombre) {
            const imgUrl = `/img/${imagenNombre}`;
            const exists = await checkImageExists(imgUrl);
            imagePath = exists ? imgUrl : await getFallbackImage(producto.nombre, producto.id);
        } else {
            imagePath = await getFallbackImage(producto.nombre, producto.id);
        }

        return `
            <div class="producto">
            <img src="${imagePath}" alt="${producto.nombre}" loading="lazy">
            <h4>${producto.nombre}</h4>
            <p>${producto.descripcion}</p>
            <a href="/producto.html?id=${producto.id}" class="btn-ver-mas">Ver más</a>
            </div>
        `;
        })
    );

    container.innerHTML = html.join('');
    console.log('Productos cargados correctamente'); // Debug
    } catch (error) {
    console.error('Error al cargar productos:', error);
    container.innerHTML = `
        <div class="error">
        <p>Error al cargar los productos.</p>
        <p class="error-detail">${error.message}</p>
        </div>
    `;
    }
});


// Normalización y fallback de imagen
function normalizeImageName(name) {
    return name.toLowerCase()
    .replace(/[áàäâã]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöôõ]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function checkImageExists(url) {
    return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    });
}

async function getFallbackImage(nombre, id) {
    const rutas = [
        `../img/${normalizeImageName(nombre)}.png`,
        `../img/${normalizeImageName(nombre)}.jpg`,
        `../img/${id}.png`,
        `../img/${id}.jpg`,
        '../img/default-product.png'
    ];

    for (const ruta of rutas) {
    const existe = await checkImageExists(ruta);
    if (existe) return ruta;
    }

    return '../img/default-product.png';
}
