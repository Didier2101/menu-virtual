import { bebidas } from "./bebidas";
import { hamburguesas } from "./hamburguesas";
import { perros } from "./perros";
import { pizzas } from "./pizzas";
import { salchipapas } from "./salchipapas";


// Combinar todos los productos
export const products = [
    ...perros,
    ...hamburguesas,
    ...salchipapas,
    ...pizzas,
    ...bebidas
];

// Exportar categorías
export const categories = [
    "Todos",
    "Perros Calientes",
    "Hamburguesas",
    "Salchipapas",
    "Pizzas",
    "Bebidas"
];

// Exportar íconos de categorías
export const categoryIcons: Record<string, string> = {
    "Todos": "🍽️",
    "Perros Calientes": "🌭",
    "Hamburguesas": "🍔",
    "Salchipapas": "🍟",
    "Pizzas": "🍕",
    "Bebidas": "🥤"
};