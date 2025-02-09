// Mostrar productos
let productos = [];
let listaProductos = document.getElementById("listaProductos");
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

async function cargarProductos() {
    try {
        const response = await fetch("../db/data.json");

        if (response.ok) {
            const data = await response.json();
            productos = data;

        data.forEach(producto => {
            const card = document.createElement("div");
            card.innerHTML = `
                <h3>${producto.nombre}</h3>
                <img class="imagenes-productos" src="${producto.imagen}" alt="${producto.nombre}" />
                <p>Precio: $${producto.precio}</p>
                <button class="agregarProducto" id="${producto.id}">Agregar al carrito</button>`;
                
            listaProductos.appendChild(card);
        });
        agregarAlCarrito(); 
        }else{
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error("Hubo un error al cargar los productos:", error);
        Swal.fire({
            title: "Error",
            text: "No se pudieron cargar los productos. Por favor intenta nuevamente en unos minutos.",
            icon: "error",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "darksalmon",
            customClass: {
                title: 'alert-title',
                htmlContainer: 'alert-text'
            }
        });
    } finally {
        console.log("Proceso de carga de productos finalizado.");
    }
}
cargarProductos();


// Agregar al carrito 
function agregarAlCarrito() {
let addButton = document.querySelectorAll(".agregarProducto");
addButton.forEach((button) => {
button.onclick = (e) => {
const productoId = e.currentTarget.id;
const productoSeleccionado = productos.find(
(producto) => producto.id == productoId
);
const productoExistente = carrito.find(
(item) => item.id === productoSeleccionado.id
);
if (productoExistente) {
productoExistente.cantidad += 1;
} else {
productoSeleccionado.cantidad = 1;
carrito.push(productoSeleccionado);
}
localStorage.setItem("carrito", JSON.stringify(carrito));

Toastify({
    text: "Agregado al carrito!",
    duration: 1500,
    close: false,
    gravity: "top", 
    position: "right", 
    stopOnFocus: true, 
    style: {
    background: "linear-gradient(to right, #E9967A, #FFFAF0)",
    },
onClick: function(){
}
}).showToast();
};
});
}















