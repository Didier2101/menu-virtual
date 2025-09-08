import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Props {
    title?: string;
    subtitle?: string;
}

export default function Header({
    title = "Rápido & Rico",
    subtitle = "Menú",
}: Props) {
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 60) {
                // bajando → ocultar
                setVisible(false);
            } else {
                // subiendo → mostrar
                setVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <motion.header
            initial={{ y: 0 }}
            animate={{ y: visible ? 0 : -80 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur z-20 p-3 shadow-sm"
        >
            <div className="max-w-xl mx-auto text-center">
                <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
                <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
        </motion.header>
    );
}
