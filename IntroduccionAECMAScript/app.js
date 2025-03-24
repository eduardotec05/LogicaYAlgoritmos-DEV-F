import { registrarDestino, mostrarItinerario } from './viajes.js';

// Iniciar la aplicación
const iniciarApp = () => {
    // Ejemplo de cómo registrar destinos
    registrarDestino("Paris", "2024-06-15", "Avión", 2);
    registrarDestino("Londres", "2024-07-01", "Tren", 5);
    registrarDestino("New York", "2024-08-10", "Barco", 1);
    registrarDestino("Ciudad de Mexico", "2024-09-20", "Avión", 7);

    // Mostrar el itinerario de los viajes
    mostrarItinerario();
};

// Ejecutar la aplicación
iniciarApp();