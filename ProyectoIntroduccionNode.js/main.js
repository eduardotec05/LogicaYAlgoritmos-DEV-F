// Variables globales para mantener el estado
let currentFilter = null;
let currentSort = null;

// Importamos recetas desde un archivo externo simulado
import { getRecipes } from "./services/recipes.js";

// Verificamos que los datos recibidos sean un arreglo
const recetas = Array.isArray(getRecipes()) ? getRecipes() : [];

// Referencias a elementos del DOM
const input = document.getElementById("ingredient-input");
const recipesContainer = document.getElementById("recipes");
const sortSelect = document.getElementById("sort");
const suggestionBtn = document.getElementById("suggestion-btn");

// Variables globales para autocompletado y análisis
let currentSuggestionIndex = -1;
let currentSuggestions = [];
let historialIngredientes = [];

// =============================================
// FUNCIÓN: Mostrar recetas en pantalla
// =============================================
function renderRecetas(lista) {
  recipesContainer.innerHTML = ""; // Limpiamos el contenedor

  lista.forEach((receta) => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
        <img src="${receta.imagen}" alt="${receta.nombre}" />
        <h3>${receta.nombre}</h3>
        <p><strong>Tiempo:</strong> ${receta.tiempo} min</p>
        <p>${receta.pasos}</p>
      `;
    recipesContainer.appendChild(card);
  });
}

// =============================================
// FUNCIÓN: Búsqueda de subcadenas con algoritmo KMP
// =============================================
function busquedaKMP(texto, patron) {
  if (patron.length === 0) return true;
  if (texto.length === 0) return false;

  // Construir la tabla de coincidencias parciales (función de prefijo)
  const lps = Array(patron.length).fill(0);
  let prevLPS = 0;
  let i = 1;

  while (i < patron.length) {
    if (patron[i] === patron[prevLPS]) {
      lps[i] = prevLPS + 1;
      prevLPS++;
      i++;
    } else if (prevLPS === 0) {
      lps[i] = 0;
      i++;
    } else {
      prevLPS = lps[prevLPS - 1];
    }
  }

  // Buscar el patrón en el texto
  let j = 0; // índice para el texto
  i = 0; // índice para el patrón

  while (j < texto.length) {
    if (patron[i] === texto[j]) {
      i++;
      j++;
    }

    if (i === patron.length) {
      return true; // Patrón encontrado
    } else if (j < texto.length && patron[i] !== texto[j]) {
      if (i === 0) {
        j++;
      } else {
        i = lps[i - 1];
      }
    }
  }

  return false;
}

// =============================================
// FUNCIÓN: Filtrar recetas por ingrediente
// =============================================
function filtrarPorIngrediente(ingrediente) {
  const lower = ingrediente.toLowerCase();

  // Implementación manual de búsqueda de subcadenas (KMP) en lugar de .includes()
  return recetas.filter((receta) =>
    receta.ingredientes.some((ing) => busquedaKMP(ing.toLowerCase(), lower))
  );
}

// =============================================
// FUNCIÓN: Actualizar historial y análisis
// =============================================
function actualizarHistorial(ingrediente) {
  historialIngredientes.push(ingrediente);

  // Sliding Window: mantenemos máximo 20 ingredientes
  if (historialIngredientes.length > 20) {
    historialIngredientes.shift();
  }

  // Mostrar en texto cuántos ingredientes únicos se han usado
  document.getElementById("analysis").textContent = `Usaste ${
    new Set(historialIngredientes).size
  } ingrediente${historialIngredientes.length > 1 ? "s" : ""} esta semana.`;

  actualizarSugerenciasRecientes();
}

// =============================================
// FUNCIÓN: Mostrar top ingredientes populares recientes (Sliding Window real)
// =============================================
function actualizarSugerenciasRecientes() {
  // Solo procesar si tenemos suficiente historial
  if (historialIngredientes.length === 0) return;

  // Usar una ventana deslizante de las últimas 5 búsquedas (o menos si no hay suficiente historial)
  const tamañoVentana = Math.min(5, historialIngredientes.length);
  const ingredientesRecientes = historialIngredientes.slice(-tamañoVentana);

  // Contar frecuencia de cada ingrediente
  const frecuencia = {};

  for (const ingrediente of ingredientesRecientes) {
    if (frecuencia[ingrediente]) {
      frecuencia[ingrediente]++;
    } else {
      frecuencia[ingrediente] = 1;
    }
  }

  // Encontrar los 3 ingredientes más frecuentes
  const topIngredientes = Object.keys(frecuencia)
    .sort((a, b) => frecuencia[b] - frecuencia[a])
    .slice(0, 5);

  // Mostrarlos en la interfaz
  const sugerenciasDiv = document.getElementById("recent-suggestions");
  if (sugerenciasDiv) {
    sugerenciasDiv.innerHTML =
      "Ingredientes populares: " +
      (topIngredientes.length > 0
        ? topIngredientes.join(", ")
        : "No hay suficiente historial aún");
  }
}

// =============================================
// FUNCIÓN: Mostrar sugerencias de autocompletado
// =============================================
function autocompletar(valor) {
  const autocompletarDiv = document.getElementById("autocomplete-list");
  autocompletarDiv.innerHTML = "";

  if (!valor) return;

  currentSuggestions = [...new Set(recetas.flatMap((r) => r.ingredientes))]
    .filter((ing) => ing.toLowerCase().startsWith(valor.toLowerCase()))
    .slice(0, 5);

  currentSuggestionIndex = -1;

  currentSuggestions.forEach((sug) => {
    const item = document.createElement("div");
    item.textContent = sug;
    item.classList.add("autocomplete-item");
    item.onclick = () => {
      input.value = sug;
      input.focus();
    };
    autocompletarDiv.appendChild(item);
  });
}

// =============================================
// FUNCIÓN: Buscar recetas y mostrarlas
// =============================================
function buscarYRenderizar() {
  const valor = input.value.trim();
  currentFilter = valor || null;

  let resultados = valor ? filtrarPorIngrediente(valor) : recetas;

  // Aplicar ordenamiento si existe
  if (currentSort) {
    resultados = ordenamientoMerge(
      resultados,
      getComparisonFunction(currentSort)
    );
  }

  actualizarHistorial(valor);
  renderRecetas(resultados);
}

// =============================================
// FUNCIÓN: Implementación de Merge Sort
// =============================================
function ordenamientoMerge(arr, funcionComparacion) {
  // Caso base: arrays con 0 o 1 elemento ya están ordenados
  if (arr.length <= 1) return arr;

  // Dividir el array en dos mitades
  const mitad = Math.floor(arr.length / 2);
  const izquierda = arr.slice(0, mitad);
  const derecha = arr.slice(mitad);

  // Ordenar recursivamente ambas mitades
  return combinar(
    ordenamientoMerge(izquierda, funcionComparacion),
    ordenamientoMerge(derecha, funcionComparacion),
    funcionComparacion
  );
}

// =============================================
// FUNCIÓN: Combinar arrays ordenados (parte de Merge Sort)
// =============================================
function combinar(izquierda, derecha, funcionComparacion) {
  let resultado = [];
  let indiceIzquierda = 0;
  let indiceDerecha = 0;

  // Comparar elementos de ambos arrays y combinarlos en orden
  while (indiceIzquierda < izquierda.length && indiceDerecha < derecha.length) {
    if (
      funcionComparacion(izquierda[indiceIzquierda], derecha[indiceDerecha]) <=
      0
    ) {
      resultado.push(izquierda[indiceIzquierda]);
      indiceIzquierda++;
    } else {
      resultado.push(derecha[indiceDerecha]);
      indiceDerecha++;
    }
  }

  // Añadir elementos restantes
  return resultado
    .concat(izquierda.slice(indiceIzquierda))
    .concat(derecha.slice(indiceDerecha));
}

// =============================================
// FUNCIÓN: Ordenar recetas por nombre o tiempo
// =============================================
function ordenarRecetas(tipo) {
  currentSort = tipo || null;

  // Obtener recetas según filtro actual o todas
  let recetasAOrdenar = currentFilter
    ? filtrarPorIngrediente(currentFilter)
    : [...recetas];

  const ordenadas = ordenamientoMerge(
    recetasAOrdenar,
    getComparisonFunction(tipo)
  );
  renderRecetas(ordenadas);
}

// Función auxiliar para obtener la función de comparación
function getComparisonFunction(tipo) {
  if (tipo === "time") {
    return (a, b) => a.tiempo - b.tiempo;
  } else {
    return (a, b) => {
      if (a.nombre < b.nombre) return -1;
      if (a.nombre > b.nombre) return 1;
      return 0;
    };
  }
}

// =============================================
// FUNCIÓN: Encontrar la receta más rápida (Greedy)
// =============================================
function encontrarRecetaMasRapida(recetas) {
  if (recetas.length === 0) return null;

  let masRapida = recetas[0];

  for (let i = 1; i < recetas.length; i++) {
    if (recetas[i].tiempo < masRapida.tiempo) {
      masRapida = recetas[i];
    }
  }

  return masRapida;
}

// =============================================
// FUNCIÓN: Resaltar sugerencia seleccionada
// =============================================
function highlightSuggestion(items) {
  items.forEach((item, index) => {
    item.classList.toggle("active", index === currentSuggestionIndex);
  });
}

// =============================================
// EVENTO: Cuando el usuario escribe en el input
// =============================================
let searchTimeout;

input.addEventListener("input", (e) => {
  clearTimeout(searchTimeout);
  const value = e.target.value.trim();

  // Mostrar sugerencias de autocompletado inmediatamente
  autocompletar(value);

  // Usar debounce para la búsqueda principal (300ms)
  searchTimeout = setTimeout(() => {
    currentFilter = value || null;

    // Obtener recetas filtradas o todas si está vacío
    let resultados = value ? filtrarPorIngrediente(value) : [...recetas];

    // Aplicar ordenamiento actual si existe
    if (currentSort) {
      resultados = ordenamientoMerge(
        resultados,
        getComparisonFunction(currentSort)
      );
    }

    // Actualizar historial solo si hay valor
    if (value) {
      actualizarHistorial(value);
    }

    renderRecetas(resultados);
  }, 300);
});

// =============================================
// EVENTO: Teclado para navegar sugerencias
// =============================================
input.addEventListener("keydown", (e) => {
  const items = document.querySelectorAll(".autocomplete-item");

  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (currentSuggestionIndex < items.length - 1) {
      currentSuggestionIndex++;
      highlightSuggestion(items);
    }
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (currentSuggestionIndex > 0) {
      currentSuggestionIndex--;
      highlightSuggestion(items);
    }
  } else if (e.key === "Enter") {
    if (currentSuggestionIndex >= 0 && items[currentSuggestionIndex]) {
      input.value = items[currentSuggestionIndex].textContent;
      document.getElementById("autocomplete-list").innerHTML = "";
    }
    buscarYRenderizar(); // Ejecuta búsqueda
  }
});

// =============================================
// EVENTO: Cambiar tipo de ordenamiento
// =============================================
sortSelect.addEventListener("change", (e) => ordenarRecetas(e.target.value));

// =============================================
// EVENTO: Mostrar la receta más rápida
// =============================================
suggestionBtn.addEventListener("click", () => {
  const recetaMasRapida = encontrarRecetaMasRapida(recetas);
  if (recetaMasRapida) {
    renderRecetas([recetaMasRapida]);
  }
});

// =============================================
// Render inicial de todas las recetas
// =============================================
function init() {
  // Establecer el valor del select si hay ordenamiento guardado
  if (currentSort) {
    sortSelect.value = currentSort;
  }

  // Mostrar recetas según estado actual
  if (currentFilter) {
    buscarYRenderizar();
  } else if (currentSort) {
    ordenarRecetas(currentSort);
  } else {
    renderRecetas(recetas);
  }
}

init();
