export interface Product {
    id: string | number;
    categoria: string; // 'Perros Calientes' | 'Hamburguesas' | 'Salchipapas' | 'Bebidas'
    nombre: string;
    descripcionCorta: string;
    descripcionLarga: string;
    precio: number; // { "Personal": 12000, "Familiar": 30000 }
    imagen: string; // ruta en /assets/...
}

export interface CartItem {
    product: Product;
    quantity: number;
}