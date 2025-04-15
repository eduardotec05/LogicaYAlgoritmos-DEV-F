function findMax(arr) {
  // Condición del caso base
  if (arr.length === 1) {
    const valor = arr[0];
    return valor;
  }

  // Divide el arreglo en dos mitades
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  // Llama recursivamente a la función para ambas mitades
  const leftMax = findMax(left);
  const rightMax = findMax(right);

  // Combina las soluciones comparando los máximos
  return Math.max(leftMax, rightMax);
}
// Ejemplo de entrada
const numbers = [3,22, 8, 2, 10, 5, 7, 15];
console.log(findMax(numbers));
