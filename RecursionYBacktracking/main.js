// Lista de regalos
const gifts = ["Muñeca", "Carro de juguete", "Rompecabezas", "Lego", "Pelota", "Peluche", "Libro de cuentos", "Juego de té", "Camión de bomberos", "Juguete educativo"];

// Función recursiva para encontrar un regalo en la lista
function findGift(gifts, giftName, index = 0) {
    // Caso base: Si llegamos al final de la lista
    if (index === gifts.length) {
        return `${giftName} no está en la lista.`;
    }
    // Caso recursivo: Si el regalo está en la lista
    if (gifts[index] === giftName) {
        return `${giftName} está en la posición ${index+1}.`;
    }
    // Llamada recursiva para la siguiente posición
    return findGift(gifts, giftName, index + 1);
}
  
// Casos de ejemplo:
console.log(findGift(gifts, "Muñeca"));
console.log(findGift(gifts, "Carro de juguete"));
console.log(findGift(gifts, "Tablet"));
console.log(findGift(gifts, "Lego"));
console.log(findGift(gifts, "Camión"));
console.log(findGift(gifts, "Pelota"));
console.log(findGift(gifts, "Juego de té"));