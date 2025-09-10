import type { Product } from "../../types";

// SÁNDWICH
export const sandwich: Product[] = [
    {
        id: "sw1",
        categoria: "Sándwich",
        nombre: "Sándwich Sencillo",
        descripcionCorta: "Sándwich básico.",
        descripcionLarga: "Sándwich con BBQ, Mayonesa, Mostaza, Salsa De Tomate, Showy, Maíz, Salsa De Ajo, lechuga, tomate, cebolla, jamón y queso.",
        precio: 7000,
        imagen: "/assets/sandwichs/sencillo.webp",
    },
    {
        id: "sw2",
        categoria: "Sándwich",
        nombre: "Sándwich de Pollo",
        descripcionCorta: "Sándwich de pollo.",
        descripcionLarga: "Sándwich con BBQ, Mayonesa, Mostaza, Salsa De Tomate, Showy, Maíz, Salsa De Ajo, lechuga, tomate y cebolla.",
        precio: 11000,
        imagen: "/assets/sandwichs/pollo.webp",
    }
];
