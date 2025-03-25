const listaDeCompras = [];

agregarProducto = (producto) => {
  const productoMinusculas = producto.toLowerCase();

  if (listaDeCompras.some((p) => p.toLowerCase() === productoMinusculas)) {
    console.log(`Ya existe el producto "${producto}" en la lista de compras`);
    return;
  }

  console.log(`Agregando ${producto} a la lista de compras`);
  listaDeCompras.push(producto);
};

eliminarProducto = (producto) => {
  const productoMinusculas = producto.toLowerCase();

  let index = listaDeCompras.findIndex(
    (p) => p.toLowerCase() === productoMinusculas);

  if (index > -1) {
    listaDeCompras.splice(index, 1);
    console.log(`Eliminando el producto ${producto} de la lista de compras`);
    return;
  }

  console.log(`El producto "${producto}" no existe en la lista de compras`);
};

mostrarLista = () => {
  console.log("Mostrando la lista de compras:");
  for (producto of listaDeCompras) {
    console.log(`- ${producto}`);
  }
};


agregarProducto("Leche");
agregarProducto("yogurt");
agregarProducto("Pan");
agregarProducto("LECHE");
agregarProducto("Huevos");
console.log("");
eliminarProducto("pan");
console.log("");
mostrarLista();
