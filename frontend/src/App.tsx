import "./App.css";
import { useNavigate } from "react-router-dom";
import CampfireLogo from "./assets/logoCampfire.png";
import { motion } from "framer-motion";
import { useEffect } from "react";

const STORAGE_KEY = "campfire_has_visited";

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        const hasVisited = localStorage.getItem(STORAGE_KEY);

        // Si l'utilisateur est déjà venu → redirection immédiate
        if (hasVisited) {
            navigate("/home", { replace: true });
            return;
        }

        // Première visite → redirection automatique après quelques secondes
        const timer = setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, "true");
            navigate("/home");
        }, 6000); // 3 secondes (UX recommandée)

        return () => clearTimeout(timer);
    }, [navigate]);

    const handleFirstVisit = () => {
        localStorage.setItem(STORAGE_KEY, "true");
        navigate("/home");
    };

    return (
        <motion.div
            className="card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
        >
            <motion.img
                src={CampfireLogo}
                alt="Logo Campfire"
                className="campfire_logo"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                whileHover={{ scale: 1.08 }}
                onClick={handleFirstVisit}
                style={{ cursor: "pointer" }}
            />
        </motion.div>
    );
}

export default App;