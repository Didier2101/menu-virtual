// mesas.ts
export interface Mesa {
    id: string;
    nombre: string;
    disponible: boolean;
}

export const mesasDisponibles: Mesa[] = [
    { id: "mesa1", nombre: "Mesa 1", disponible: true },
    { id: "mesa2", nombre: "Mesa 2", disponible: true },
    { id: "mesa3", nombre: "Mesa 3", disponible: true },
    { id: "mesa4", nombre: "Mesa 4", disponible: true },
    { id: "mesa5", nombre: "Mesa 5", disponible: true },
    { id: "barra", nombre: "Barra", disponible: true },
    { id: "hold", nombre: "Hold", disponible: true },
    { id: "sala", nombre: "Sala", disponible: true },
    { id: "terraza1", nombre: "Terraza 1", disponible: true },
    { id: "terraza2", nombre: "Terraza 2", disponible: true },
    { id: "privada", nombre: "Sala Privada", disponible: false }, // Ejemplo de mesa no disponible
];