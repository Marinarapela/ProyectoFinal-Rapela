let contenedorCarrito = document.getElementById("items-carrito");
let carritoStorage = JSON.parse(localStorage.getItem("carrito")) || [];

// Mostrar items en carrito
function listarCarrito(itemsCarrito) {
    contenedorCarrito.innerHTML = ""; 

    itemsCarrito.forEach((producto, index) => {
        let cart = document.createElement("div");
        cart.innerHTML = `
            <h2>${producto.nombre}</h2>
            <img class="img-carrito" src="${producto.imagen}" alt="${producto.nombre}" />
            <p>Precio: ${producto.precio}</p>
            <p>Cantidad: <span id="cantidad${index}">${producto.cantidad}</span></p>
            <p>Total: <span id="total${index}">${producto.precio * producto.cantidad}</span></p>
            <div class= "botones-modificar"><button class="boton-agregar" data-index="${index}">+</button>
            <button class="boton-restar" data-index="${index}">-</button>
            <button class="boton-eliminar" data-index="${index}">Eliminar producto</button>
            </div>`;

        contenedorCarrito.appendChild(cart);
    });

    modificarCantidad();
}

// Actualizar la cantidad
function actualizarCantidad(index) {
    document.getElementById(`cantidad${index}`).innerText = carritoStorage[index].cantidad;
    document.getElementById(`total${index}`).innerText = carritoStorage[index].precio * carritoStorage[index].cantidad;
}

// Actualizar localStorage
function actualizarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carritoStorage));
}

// Agregar y restar productos del carrito
function modificarCantidad() {
    document.querySelectorAll(".boton-agregar").forEach(boton => {
        boton.addEventListener("click", () => {
            const index = boton.dataset.index;
            carritoStorage[index].cantidad++;
            actualizarCarrito();
            actualizarCantidad(index);
        });
    });

    document.querySelectorAll(".boton-restar").forEach(boton => {
        boton.addEventListener("click", () => {
            const index = boton.dataset.index;
            if (carritoStorage[index].cantidad > 1) {
                carritoStorage[index].cantidad--;
                actualizarCarrito();
                actualizarCantidad(index);
            } else {
                carritoStorage.splice(index, 1); 
                actualizarCarrito();
                listarCarrito(carritoStorage);
            }
        });
    });
    document.querySelectorAll(".boton-eliminar").forEach(boton => {
        boton.addEventListener("click", () => {
            const index = boton.dataset.index;
            Swal.fire({
                text: "Al confirmar, se eliminará el producto del carrito",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "darksalmon",
                cancelButtonColor: "darksalmon",
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar",
                customClass: {
                    title: 'alert-title',
                    htmlContainer: 'alert-text'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    carritoStorage.splice(index, 1); 
                    actualizarCarrito();
                    listarCarrito(carritoStorage);
                    Swal.fire({
                        title: "Producto eliminado",
                        text: "El producto ha sido eliminado del carrito.",
                        icon: "success",
                        confirmButtonColor: "darksalmon",
                        customClass: {
                            title: 'alert-title',
                            htmlContainer: 'alert-text'
                        }
                });
                }
            });
        });
    });
}

listarCarrito(carritoStorage);


// Vaciar el carrito
    function vaciarCarrito() {
            if (carritoStorage.length === 0) {
                Swal.fire({
                    title: "¡Ups!",
                    text: "Tu carrito ya está vacío.",
                    icon: "info",
                    confirmButtonText: "OK",
                    confirmButtonColor: "darksalmon",
                    customClass: {
                        title: 'alert-title',
                        htmlContainer: 'alert-text'
                    }
                });
                return; 
            }
        Swal.fire({
            title: "¿Estás seguro que querés vaciar el carrito?",
            text: "Al confirmar quedará tu carrito vacío!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "darksalmon",
            cancelButtonColor: "darksalmon",
            confirmButtonText: "Sí, vaciar",
            cancelButtonText: "Cancelar",
            customClass: {
                title: 'alert-title',
                htmlContainer: 'alert-text'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                carritoStorage = [];
                localStorage.removeItem("carrito"); 
                contenedorCarrito.innerHTML = `<p>Tu carrito está vacío!</p>`;
                mostrarTotal();
                Swal.fire({
                text:  "Tu carrito ha sido eliminado",
                icon: "success",
                confirmButtonColor: "darksalmon",
                customClass: {
                    title: 'alert-title',
                    htmlContainer: 'alert-text'
                }
            });
            }
        });
    }
    
let botonVaciarCarrito = document.getElementById("vaciar-carrito");
botonVaciarCarrito.addEventListener("click", vaciarCarrito);
    

// Calcular total del carrito
let calculoTotal = document.getElementById("total-compra");

function mostrarTotal() {
let total = 0;
for (let producto of carritoStorage) {
total += producto.precio * producto.cantidad;
}
calculoTotal.innerHTML = `<h3>Total de la compra: $${total}</h3>`;
}

function actualizarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carritoStorage));
    listarCarrito(carritoStorage);
    mostrarTotal(); 
}
mostrarTotal()



// Finalizar la compra
let botonFinalizarCompra = document.getElementById("finalizar-compra");

function procesarCompra() {
    if (carritoStorage.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Ups!",
            text: "Tu carrito está vacío. No se puede procesar la compra.",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "darksalmon",
            customClass: {
                title: 'alert-title',
                htmlContainer: 'alert-text'
            }
        });
        return;
    }

    Swal.fire({
        title: "¿Querés confirmar tu compra?",
        text: "Una vez confirmada, podrás elegir el método de pago.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, confirmar",
        confirmButtonColor: "darksalmon",
        cancelButtonText: "Cancelar",
        cancelButtonColor: "darksalmon",
        customClass: {
            title: 'alert-title',
            htmlContainer: 'alert-text'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Formulario de método de pago
            Swal.fire({
                title: "Selecciona tu método de pago",
                input: "select",
                inputOptions: {
                    "tarjeta": "Tarjeta de Crédito/Débito",
                    "efectivo": "Efectivo"
                },
                inputPlaceholder: "Selecciona un método",
                showCancelButton: true,
                confirmButtonText: "Continuar",
                confirmButtonColor: "darksalmon",
                cancelButtonText: "Cancelar",
                cancelButtonColor: "darksalmon",
                customClass: {
                    title: 'alert-title',
                    htmlContainer: 'alert-text'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    let metodoSeleccionado = result.value;

                    let formularioCliente = `
                        <input type="text" id="nombre" class="datos-input" placeholder="Nombre">
                        <input type="text" id="apellido" class="datos-input" placeholder="Apellido">
                        <input type="text" id="email" class="datos-input" placeholder="Email">
                        <input type="text" id="dni" class="datos-input" placeholder="DNI (solo números)" maxlength="8">
                        <input type="text" id="direccion" class="datos-input" placeholder="Dirección">`;

                    if (metodoSeleccionado === "tarjeta") {
                        formularioCliente += `
                            <input type="text" id="numeroTarjeta" class="datos-input" placeholder="Número de Tarjeta" maxlength="16">
                            <input type="text" id="nombreTarjeta" class="datos-input" placeholder="Nombre en la Tarjeta">
                            <input type="text" id="cvv" class="datos-input" placeholder="CVV" maxlength="3">
                            <input type="text" id="vencimiento" class="datos-input" placeholder="Vencimiento (MM/YY)" maxlength="5">`;
                    }

                    Swal.fire({
                        title: "Completa tus datos",
                        html: formularioCliente,
                        showCancelButton: true,
                        confirmButtonText: "Finalizar Compra",
                        confirmButtonColor: "darksalmon",
                        cancelButtonText: "Cancelar",
                        cancelButtonColor: "darksalmon",
                        customClass: {
                            title: 'alert-title',
                            htmlContainer: 'alert-text'
                        },
                        preConfirm: () => {
                            let nombre = document.getElementById("nombre").value;
                            let apellido = document.getElementById("apellido").value;
                            let email = document.getElementById("email").value;
                            let dni = document.getElementById("dni").value;
                            let direccion = document.getElementById("direccion").value;

                            if (!nombre || !apellido || !email || !dni || !direccion) {
                                Swal.showValidationMessage("Todos los campos son obligatorios");
                                return false;
                            }
                            if (isNaN(dni)) {
                                Swal.showValidationMessage("El DNI debe contener solo números");
                                return false;
                            }
                            if (dni.length < 7 || dni.length > 8) {
                                Swal.showValidationMessage("El DNI debe tener 7 u 8 dígitos");
                                return false;
                            }
                            let datosTarjeta = null;

                            if (metodoSeleccionado === "tarjeta") {
                                let numeroTarjeta = document.getElementById("numeroTarjeta").value;
                                let nombreTarjeta = document.getElementById("nombreTarjeta").value;
                                let cvv = document.getElementById("cvv").value;
                                let vencimiento = document.getElementById("vencimiento").value;
                            
                                if (numeroTarjeta.length !== 16) {
                                    Swal.showValidationMessage("El número de tarjeta debe tener 16 dígitos");
                                    return false;
                                }
                            
                                if (!nombreTarjeta || !numeroTarjeta || !cvv || !vencimiento) {
                                    Swal.showValidationMessage("Todos los campos son obligatorios");
                                    return false;
                                }
                            
                                if (cvv.length !== 3) {
                                    Swal.showValidationMessage("El CVV debe tener 3 dígitos");
                                    return false;
                                }
                            
                                let partes = vencimiento.split("/");
                                if (partes.length !== 2) {
                                    Swal.showValidationMessage("El vencimiento debe tener el formato MM/YY");
                                    return false;
                                }
                            
                                let mes = parseInt(partes[0], 10);
                                let año = parseInt(partes[1], 10);
                            
                                if (isNaN(mes) || isNaN(año) || mes < 1 || mes > 12 || partes[0].length !== 2 || partes[1].length !== 2) {
                                    Swal.showValidationMessage("El vencimiento debe tener el formato MM/YY");
                                    return false;
                                }
                            
                                let añoActual = new Date().getFullYear() % 100;
                                let mesActual = new Date().getMonth() + 1;
                            
                                if (año < añoActual || (año === añoActual && mes < mesActual)) {
                                    Swal.showValidationMessage("Tu tarjeta está vencida");
                                    return false;
                                }
                            
                                if ([...nombreTarjeta].some(char => !isNaN(char) && char !== " ")) {
                                    Swal.showValidationMessage("El nombre en la tarjeta solo puede contener letras y espacios");
                                    return false;
                                }
                            
                                datosTarjeta = { numeroTarjeta, nombreTarjeta, cvv, vencimiento };
                            }
                            
                            return { nombre, apellido, email, dni, direccion, metodoSeleccionado, datosTarjeta };
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            let datosCliente = result.value;
                            let numeroPedido = localStorage.getItem("numeroPedido"); 

                            if (numeroPedido) {
                                numeroPedido = parseInt(numeroPedido) + 1; 
                            } else {
                                numeroPedido = 1; 
                            }
                            localStorage.setItem("numeroPedido", numeroPedido); 

                            let mensajeConfirmacion = `<h4>Número de Pedido: #${numeroPedido}</h4>`;
                                mensajeConfirmacion += `<p><strong>Nombre:</strong> ${datosCliente.nombre}</p>
                                <p><strong>Apellido:</strong> ${datosCliente.apellido}</p>
                                <p><strong>DNI:</strong> ${datosCliente.dni}</p>
                                <p><strong>Dirección:</strong> ${datosCliente.direccion}</p>
                                <p><strong>Método de Pago:</strong> ${datosCliente.metodoSeleccionado}</p>`;

                            if (datosCliente.metodoSeleccionado === "tarjeta") {
                                mensajeConfirmacion += `
                                    <p><strong>Nombre en Tarjeta:</strong> ${datosCliente.datosTarjeta.nombreTarjeta}</p>
                                    <p><strong>Vencimiento:</strong> ${datosCliente.datosTarjeta.vencimiento}</p>`;
                            }
                            mensajeConfirmacion += `<h3>Resumen de tu compra:</h3>`;
                            let totalCompra = 0;
                    
                            carritoStorage.forEach(producto => {
                                let subtotal = producto.precio * producto.cantidad;
                                totalCompra += subtotal;
                                mensajeConfirmacion += `<ul><li>${producto.nombre} - ${producto.cantidad} x $${producto.precio} = $${subtotal}</li></ul>`;
                            });
                    
                            mensajeConfirmacion += `<h3>Total: $${totalCompra}</h3>`;
                            mensajeConfirmacion += `<p> Muchas gracias por tu compra! 🎉</p>`;

                            Swal.fire({
                                icon: "success",
                                title: "Tu compra ha sido confirmada!",
                                html: mensajeConfirmacion,
                                confirmButtonText: "Finalizar",
                                confirmButtonColor: "darksalmon",
                                customClass: {
                                    title: 'alert-title',
                                    htmlContainer: 'alert-text'
                                }
                            });

                            carritoStorage = [];
                            localStorage.removeItem("carrito");
                            listarCarrito(carritoStorage);
                            mostrarTotal();
                        }
                    });
                }
            });
        }
    });
}

botonFinalizarCompra.addEventListener("click", procesarCompra);

