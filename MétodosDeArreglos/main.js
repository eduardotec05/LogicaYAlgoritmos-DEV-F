//arreglo de objetos con al menos 5 productos, cada uno con las propiedades nombre, precio y categoría.
const productos = [
    { nombre: "Camiseta", precio: 15, categoria: "Ropa" },
    { nombre: "Laptop", precio: 800, categoria: "Electrónica" },
    { nombre: "Libro", precio: 12, categoria: "Educación" },
    { nombre: "Zapatos", precio: 50, categoria: "Ropa" },
    { nombre: "Celular", precio: 600, categoria: "Electrónica" },
    { nombre: "Xbox", precio: 1100, categoria: "Electrónica" },
    { nombre: "Cámara", precio: 300, categoria: "Electrónica" },
    { nombre: "Libretas", precio: 30, categoria: "Educación" }, 
];

//productos que cuestan menos de 100 euros
const filtrado = productos.filter((producto) => producto.precio < 100);
//ordenar por orden alfabético
const ordenado = productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
//mapear solo los nombres de los productos
const nombres = productos.map((producto) => producto.nombre);
//usar reduce para sumar los precios de los productos
const precios = productos.reduce((acumulador, producto) => acumulador + producto.precio, 0);
//usar some para encontrar un producto por su nombre
const existe = productos.some((producto) => producto.nombre === "Laptop");
//usar every para encontrar un producto por su nombre
const todosExisten = productos.every((producto) => producto.nombre === "Laptop");

//mostrar los productos menores de $100 en la consola
console.log("Productos menores de $100: ");
console.log(filtrado);
console.log("\nProductos ordenados alfabéticamente: ");
console.log(ordenado);
console.log("\nNombres de los productos: ");
console.log(nombres);
console.log("\nPrecios de todos los productos: ");
console.log(precios);
console.log("\nExiste un producto con el nombre Laptop: ");
console.log(existe);
console.log("\nTodos los productos tienen el nombre Laptop: ");
console.log(todosExisten);