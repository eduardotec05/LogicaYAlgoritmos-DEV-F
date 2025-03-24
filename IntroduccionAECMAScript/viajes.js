// Array para guardar los destinos
const destinos = [];

// Función para registrar un destino de viaje
const registrarDestino = (destino, fecha, transporte, numPersonas = 1) => {
    const nuevoViaje = {
        destino,
        fecha,
        transporte,
        numPersonas,
        costo: calcularCosto(destino, transporte, numPersonas)
    };

    destinos.push(nuevoViaje);
};

// Función para calcular el costo del viaje
const calcularCosto = (destino, transporte, numPersonas) => {
    let costoBase = 0;

    // Costo base por destino
    switch (destino) {
        case "Paris":
            costoBase = 500;
            break;
        case "Londres":
            costoBase = 400;
            break;
        case "New York":
            costoBase = 600;
            break;
        case "Ciudad de Mexico":
            costoBase = 800;
            break;
        default:
            costoBase = 0;
    }

    // Costo adicional por tipo de transporte
    switch (transporte) {
        case "Avión":
            costoBase += 200;
            break;
        case "Tren":
            costoBase += 100;
            break;
        case "Barco":
            costoBase += 300;
            break;
        default:
            costoBase += 0;
    }

    // Aplicar descuento por número de personas
    if (numPersonas > 4) {
        costoBase *= 0.9; // 10% de descuento
    }

    return costoBase * numPersonas;
};

// Función para mostrar el itinerario de los viajes registrados
const mostrarItinerario = () => {
    destinos.forEach((viaje) => {
        console.log("Destino: " + viaje.destino);
        console.log("Fecha: " + viaje.fecha);
        console.log("Transporte: " + viaje.transporte);
        console.log("Número de personas: " + viaje.numPersonas);
        console.log("Costo: $" + viaje.costo);
        console.log("---------------------------");
    });
};

// Exportar las funciones para su uso en otros módulos
export { registrarDestino, mostrarItinerario };