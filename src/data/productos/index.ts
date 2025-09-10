import { perros } from "./perros";
import { hamburguesas } from "./hamburguesas";
import { salchipapas } from "./salchipapas";
import { arepas } from "./arepas";
import { sandwich } from "./sandwich";
import { otros } from "./otros";
import { servicios_mini } from "./servicios_mini";
import { bebidas } from "./bebidas";
import { matador } from "./matador";

// Combinar todos los productos
export const products = [
    ...perros,
    ...hamburguesas,
    ...salchipapas,
    ...arepas,
    ...sandwich,
    ...otros,
    ...servicios_mini,
    ...bebidas,
    ...matador
];

// Exportar categorías
export const categories = [
    "Todos",
    "Perros Calientes",
    "Hamburguesas",
    "Salchipapas",
    "Arepas",
    "Sándwich",
    "Bebidas",
    "Servicios (Mini)",
    "Matador",
    "Otros",
];

// Exportar íconos de categorías
export const categoryIcons: Record<string, string> = {
    "Todos": "🍽️",
    "Perros Calientes": "🌭",
    "Hamburguesas": "🍔",
    "Salchipapas": "🍟",
    "Arepas": "🫓",
    "Sándwich": "🥪",
    "Otros": "➕",
    "Servicios (Mini)": "🥣",
    "Bebidas": "🥤",
    "Matador": "🔥"
};