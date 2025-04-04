function findLongestWord(text) {

  const words = text.split(" ");  //divide el texto en un arreglo de palabras
  let longestWord = ""; //inicializa la variable longestWord como una cadena vacía

  for (let i = 0; i < words.length; i++) { //recorre el arreglo de palabras
    if (words[i].length > longestWord.length) {
      longestWord = words[i]; //actualiza la palabra más larga
    }
  }
  return longestWord; //devuelve la palabra más larga
}

const text = "La desoxirribonucleasa es una enzima extraordinariamente compleja que cataliza la despolimerización del ácido desoxirribonucleico en condiciones fisiológicas óptimas";

console.log(findLongestWord(text)); // Output: "desoxirribonucleasa"
