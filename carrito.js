document.addEventListener('DOMContentLoaded', () => {

    // Variables

    //let baseDeDatos = [];

    let carrito = [];
    const DOMitems = document.getElementById('items');
    const DOMcarrito = document.getElementById('carrito');
    const DOMtotal = document.getElementById('total');
    const DOMbotonVaciar = document.getElementById('boton-vaciar');
    const DOMinputBuscador = document.getElementById('buscar-pal');
    const DOMbotonCompra = document.getElementById('boton-compra');
    const DOMmostrarCarrito = document.getElementById('mostrar-carrito');

    const arayproductos = [{
            nombre: "Iphone 13",
            img: "img/Productos celulares/IPHONE 13.jpg",
            alt: "iphone",
            moneda: 1105,
            id: 1,
        },
        {
            nombre: "Iphone 13 Mini",
            img: "img/Productos celulares/IPHONE 13 MINI.jpg",
            alt: "iphone",
            moneda: 945,
            id: 2,
        },
        {
            nombre: "Iphone 13 Pro Max",
            img: "img/Productos celulares/IPHONE 13 PRO MAX.jpg",
            alt: "iphone",
            moneda: 1475,
            id: 3,
        },
        {
            nombre: "Iphone 12",
            img: "img/Productos celulares/IPHONE 12.jpg",
            alt: "iphone",
            moneda: 910,
            id: 4,
        },

        {
            nombre: "Iphone 11",
            img: "img/Productos celulares/IPHONE 11.jpg",
            alt: "iphone",
            moneda: 645,
            id: 5,
        },

        {
            nombre: "Macbook air 13",
            img: "img/Productos Laptops/macbook air 13.jpg",
            alt: "macbook",
            moneda: 925,
            id: 6,
        },

        {
            nombre: "Macbook Pro 13",
            img: "img/Productos Laptops/mcbook pro 13.jpg",
            alt: "Macbook",
            moneda: 1210,
            id: 7,
        },

        {
            nombre: "Mac Air Custom",
            img: "img/Productos Laptops/mac air custom.jpg",
            alt: "Macbook",
            moneda: 1400,
            id: 8,
        },

        {
            nombre: "Laptop hp",
            img: "img/Productos Laptops/laptop hp.jpg",
            alt: "hp",
            moneda: 740,
            id: 9,
        },

        {
            nombre: "Laptop Lenovo",
            img: "img/Productos Laptops/laptop lenovo.jpg",
            alt: "lenovo",
            moneda: 740,
            id: 10,
        },
        {
            nombre: "Laptop dell",
            img: "img/Productos Laptops/laptop dell.jpg",
            alt: "dell",
            moneda: 740,
            id: 11,
        },

    ];

    /**
     * Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
     */
    function renderizarProductos() {
        DOMitems.innerHTML = '';
        arayproductos.forEach((info) => {
            // Estructura
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4', );
            // Body
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            // Titulo
            const miNodoTitle = document.createElement('h3');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.innerText = info.nombre;
            // Precio
            const miNodoPrecio = document.createElement('h5');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.innerText = `$${info.moneda}`;
            //Imagen
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('image');
            miNodoImagen.setAttribute('src', info.img);
            // Boton 
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.innerText = '+';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
            // Insertamos
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.append(miNodoTitle);
            miNodoCardBody.append(miNodoPrecio);
            //miNodoCardBody.append(miNodoImagen)
            miNodoCardBody.append(miNodoBoton);
            miNodo.append(miNodoCardBody);
            DOMitems.append(miNodo);
        });
    }

    /**
     * Evento para añadir un producto al carrito de la compra
     */
    function anyadirProductoAlCarrito(e) {
        // Anyadimos el Nodo a nuestro carrito
        carrito.push(e.target.getAttribute('marcador'))
        arayproductos[e.target.getAttribute('marcador') - 1];
        renderizarProductos();
        // Actualizamos el carrito 
        renderizarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();
        $.jGrowl("¡Agregado al carrito!", {
            life: 1000
        });
    }
    /**
     * Dibuja todos los productos guardados en el carrito
     */
    function renderizarCarrito() {
        // Vaciamos todo el html
        DOMcarrito.innerText = '';
        // Quitamos los duplicados
        const carritoSinDuplicados = [...new Set(carrito)];
        // Generamos los Nodos a partir de carrito
        carritoSinDuplicados.forEach((item) => {
            // Obtenemos el item que necesitamos de la variable base de datos
            const miItem = arayproductos.filter((itemBaseDatos) => {
                // ¿Coincide las id? Solo puede existir un caso
                return itemBaseDatos.id === parseInt(item);
            });
            // Cuenta el número de veces que se repite el producto
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                return itemId === item ? total += 1 : total;
            }, 0);
            // Creamos el nodo del item del carrito
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right');
            miNodo.innerText = `${numeroUnidadesItem} x ${miItem[0].nombre} - $${miItem[0].moneda}`;
            // Boton de borrar
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger');
            miBoton.innerText = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            // Mezclamos nodos
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
        // Renderizamos el precio total en el HTML
        DOMtotal.innerText = calcularTotal();
    }

    /**
     * Evento para borrar un elemento del carrito
     */
    function borrarItemCarrito(e) {
        // Obtenemos el producto ID que hay en el boton pulsado
        const id = e.target.dataset.item;
        // Borramos todos los productos
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        // volvemos a renderizar
        renderizarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();
        $.jGrowl("¡Elemento eliminado!", {
            life: 1000,
            theme: 'test'
        });

    }

    /**
     * Calcula el precio total teniendo en cuenta los productos repetidos
     */
    function calcularTotal() {
        // Recorremos el array del carrito 
        return carrito.reduce((total, item) => {
            // De cada elemento obtenemos su precio
            const miItem = arayproductos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            // Los sumamos al total
            return total + miItem[0].moneda;
        }, 0).toFixed(2);
    }

    /**
     * Varia el carrito y vuelve a dibujarlo
     */
    function vaciarCarrito() {
        // Limpiamos los productos guardados
        carrito = [];
        // Renderizamos los cambios
        renderizarCarrito();
        // Borra LocalStorage
        localStorage.removeItem('carrito');
        $.jGrowl("¡Carrito vaciado!", {
            life: 1000,
            theme: 'test'
        });

    }

    function guardarCarritoEnLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage() {
        // ¿Existe un carrito previo guardado en LocalStorage?
        if (localStorage.getItem('carrito') !== null) {
            // Carga la información
            carrito = JSON.parse(localStorage.getItem('carrito'));
        }
    }

    function filtrarProductos() {
        const Productos = Array.from(document.querySelectorAll('#items .card .card-body .card-title'));
        Productos.forEach(producto => {
            let productoStyle = producto.parentElement.parentElement.style;
            if (producto.innerText.toLowerCase().includes(DOMinputBuscador.value.toLowerCase()) || DOMinputBuscador.value == '') {
                productoStyle.display = "initial";
                setTimeout(() => {
                    productoStyle.transform = 'scale(100%)'
                }, 300)

            } else {
                productoStyle.transform = 'scale(0%)';
                setTimeout(() => {
                    productoStyle.display = 'none'
                }, 300)
            }
        })
    }

    function alertaCompra() {
        Swal.fire({
            icon: 'question',
            title: 'Deseas confirmar tu compra?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Si',
            denyButtonText: `Cancelar compra`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    title: 'Gracias por tu compra,nos estaremos comunicando por email.',
                    input: 'email',
                    inputLabel: 'Ingrese su Email',
                    inputPlaceholder: 'Ingrese su Email'
                })
            } else if (result.isDenied) {
                Swal.fire('Su compra fue cancelada.', '', 'info');

            }
        })
    }

    function mostrarCarrito() {
        let elemento = document.getElementById("carri");
        let elem = document.getElementById("mostrar-carrito");
        if (elemento.className == "col-sm-4 ocult") {
            elemento.className = "col-sm-4 show";
            elem.innerText = "Cerrar carrito";
        } else {
            elemento.className = "col-sm-4 ocult";
            /*aca me gustaria que se ponga denuevo la imagen del carrito pero no me sale
            elem.innerImg="img/carrito.jpg" */
            elem.innerText= "carrito";
        }
    }


    // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    DOMinputBuscador.addEventListener('keyup', filtrarProductos);
    DOMbotonCompra.addEventListener('click', alertaCompra);
    DOMmostrarCarrito.addEventListener('click', mostrarCarrito);








    // Inicio
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();


});