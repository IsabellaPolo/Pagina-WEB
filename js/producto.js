// producto.js - Versión mejorada para manejo de imágenes

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    // Elementos del DOM
    const productImage = document.getElementById('producto-imagen');
    const productName = document.getElementById('producto-nombre');
    const productDescription = document.getElementById('producto-descripcion');
    const productSpecs = document.getElementById('producto-especificaciones');
    
    // Función mejorada para normalizar nombres de imágenes
    function normalizeImageName(name) {
        if (!name) return 'default-product';
        
        return name.toLowerCase()
            .replace(/[áàäâã]/g, 'a')
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöôõ]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/ñ/g, 'n')
            .replace(/\s+/g, '-')  // Reemplaza espacios con guiones
            .replace(/[^a-z0-9-]/g, '') // Elimina caracteres especiales
            .replace(/-+/g, '-')  // Elimina guiones múltiples
            .replace(/^-|-$/g, ''); // Elimina guiones al inicio/final
    }

    // Función para buscar imagen alternativa si la principal no existe
    async function loadProductImage(productName, productId) {
        const basePaths = [
            `img/${normalizeImageName(productName)}.png`,
            `img/${normalizeImageName(productName)}.jpg`,
            `img/${productId}.png`,
            `img/${productId}.jpg`,
            'img/default-product.png'
        ];
        
        // Verificar cada posible ruta hasta encontrar una imagen válida
        for (const path of basePaths) {
            try {
                const exists = await checkImageExists(path);
                if (exists) return path;
            } catch (error) {
                console.warn(`No se pudo cargar imagen: ${path}`);
            }
        }
        
        return 'img/default-product.png';
    }
    
    // Función para verificar si una imagen existe
    function checkImageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    // Cargar datos del producto
    fetch('productos.json')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar productos');
            return response.json();
        })
        .then(async data => {
            let productFound = null;
            let productCategory = '';
            
            // Buscar producto por ID
            for (const category in data.productos) {
                const found = data.productos[category].find(p => p.id === productId);
                if (found) {
                    productFound = found;
                    productCategory = category;
                    break;
                }
            }
            
            if (!productFound) throw new Error('Producto no encontrado');
            
            // Actualizar información del producto
            document.title = `${productFound.nombre} | Todo Plásticos`;
            productName.textContent = productFound.nombre;
            productDescription.textContent = productFound.descripcion;
            
            // Limpiar y llenar especificaciones
            productSpecs.innerHTML = '';
            if (productFound.color) {
                productSpecs.innerHTML += `<li><strong>Color:</strong> ${productFound.color}</li>`;
            }
            if (productFound.tamanos?.length > 0) {
                productSpecs.innerHTML += `<li><strong>Tamaños:</strong> ${productFound.tamanos.join(', ')}</li>`;
            }
            if (productFound.variaciones?.length > 0) {
                productSpecs.innerHTML += `<li><strong>Variaciones:</strong> ${productFound.variaciones.join(', ')}</li>`;
            }
            
            // Cargar imagen: primero usa la del JSON si está, si no, usa respaldo
            let imagePath;
            if (productFound.imagen && productFound.imagen.trim() !== '') {
                const manualPath = `img/${productFound.imagen.trim()}`;
                const exists = await checkImageExists(manualPath);
                imagePath = exists ? manualPath : await loadProductImage(productFound.nombre, productId);
            } else {
                imagePath = await loadProductImage(productFound.nombre, productId);
            }
            productImage.src = imagePath;
            productImage.alt = productFound.nombre;
        })
        .catch(error => {
            console.error('Error:', error);
            productImage.src = 'img/default-product.png';
            productName.textContent = 'Producto no encontrado';
            productDescription.textContent = 'Lo sentimos, no pudimos cargar la información de este producto.';
        });
});
