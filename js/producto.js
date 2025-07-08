// producto.js - Controlador para la página de detalle de producto

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el ID del producto de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    // Elementos del DOM que vamos a actualizar
    const productImage = document.getElementById('product-image');
    const productName = document.getElementById('product-name');
    const productDescription = document.getElementById('product-description');
    const productMaterial = document.getElementById('product-material');
    const productSizes = document.getElementById('product-sizes');
    const productVariations = document.getElementById('product-variations');
    const variationsRow = document.getElementById('variations-row');
    const productContainer = document.getElementById('product-container');
    
    // Función para mostrar mensaje de error
    function showError(message) {
        productContainer.innerHTML = `
            <div class="error-message">
                <h2>Error al cargar el producto</h2>
                <p>${message}</p>
                <a href="productos.html" class="btn-primary">Volver a la lista de productos</a>
            </div>
        `;
    }
    
    // Validar que tenemos un ID de producto
    if (!productId) {
        showError('No se ha especificado un producto.');
        return;
    }
    
    // Cargar el archivo JSON de productos
    fetch('productos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar la información de productos.');
            }
            return response.json();
        })
        .then(data => {
            // Buscar el producto en todas las categorías
            let productFound = null;
            let productCategory = '';
            
            for (const category in data.productos) {
                const found = data.productos[category].find(p => p.id === productId);
                if (found) {
                    productFound = found;
                    productCategory = category;
                    break;
                }
            }
            
            if (productFound) {
                // Actualizar el título de la página
                document.title = `${productFound.nombre} | Todo Plásticos`;
                
                // Rellenar los datos del producto
                productName.textContent = productFound.nombre;
                productDescription.textContent = productFound.descripcion;
                
                // Mostrar material si existe
                if (productFound.material) {
                    productMaterial.textContent = productFound.material;
                } else {
                    productMaterial.textContent = 'No especificado';
                }
                
                // Mostrar tamaños si existen
                if (productFound.tamanos && productFound.tamanos.length > 0) {
                    productSizes.innerHTML = productFound.tamanos.map(size => 
                        `<li>${size}</li>`
                    ).join('');
                } else {
                    productSizes.innerHTML = '<li>No especificado</li>';
                }
                
                // Mostrar variaciones si existen
                if (productFound.variaciones && productFound.variaciones.length > 0) {
                    variationsRow.style.display = '';
                    productVariations.innerHTML = productFound.variaciones.map(variation => 
                        `<li>${variation}</li>`
                    ).join('');
                } else {
                    variationsRow.style.display = 'none';
                }
                
                // Cargar imagen del producto (asumiendo que las imágenes tienen el mismo nombre que el ID)
                const imagePath = `img/${productId}.png`;
                productImage.src = imagePath;
                productImage.alt = productFound.nombre;
                
                // Manejar error si la imagen no carga
                productImage.onerror = function() {
                    this.src = 'img/default-product.png';
                };
                
                // Mostrar categoría como breadcrumb
                const breadcrumb = document.createElement('div');
                breadcrumb.className = 'breadcrumb';
                breadcrumb.innerHTML = `
                    <a href="index.html">Inicio</a> > 
                    <a href="productos.html">Productos</a> > 
                    <a href="productos.html?category=${productCategory}">${productCategory.charAt(0).toUpperCase() + productCategory.slice(1)}</a> > 
                    <span>${productFound.nombre}</span>
                `;
                productContainer.insertBefore(breadcrumb, productContainer.firstChild);
                
            } else {
                showError('El producto solicitado no existe.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError(error.message);
        });
        
    // Función para compartir producto
    document.getElementById('share-btn')?.addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: productName.textContent,
                url: window.location.href
            }).catch(err => {
                console.error('Error al compartir:', err);
            });
        } else {
            // Fallback para navegadores que no soportan la API de compartir
            const shareUrl = `whatsapp://send?text=Mira este producto: ${document.title} - ${window.location.href}`;
            window.open(shareUrl, '_blank');
        }
    });
});