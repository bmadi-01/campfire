import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import CampfireLogo from "../assets/logoCampfireNavbar.png";
import "../css/navbarConnecte.css";

function NavBarConnecte() {
    const navigate = useNavigate();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [soundEnabled, setSoundEnabled] = useState(false);

    const storedUser = localStorage.getItem("utilisateur");
    const user = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        if (soundEnabled && audioRef.current) {
            audioRef.current.volume = 0.15;
            audioRef.current.play().catch(() => {});
        }
    }, [soundEnabled]);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("utilisateur");
        navigate("/home");
    };

    return (
        <>
            <audio ref={audioRef} src="/assets/sounds/campfire-soft.mp3" />

            <motion.nav
                className="navBar"
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                {/* LOGO */}
                <div className="navBar__logo">
                    <Link to="/dashboard">
                        <img src={CampfireLogo} alt="Campfire Logo" />
                    </Link>
                </div>

                {/* MENU */}
                <div className="navBar__menu">
                    <Link to="/planning">Planning</Link>
                    <Link to="/groupe">Groupes</Link>
                    <Link to="/dashboard">Accueil</Link>

                    {/* Badge rôle */}
                    {user && (
                        <button
                            className={`roleBadge ${user.role.toLowerCase()}`}
                            onClick={() => navigate("/profile")}
                        >
                            {user.role}
                        </button>
                    )}

                    {/* Bouton son */}
                    <button
                        className={`sound-toggler ${soundEnabled ? "active" : ""}`}
                        type="button"
                        onClick={() => setSoundEnabled(!soundEnabled)}
                    >
                        🔥
                    </button>

                    {/* Logout */}
                    <button className="logoutButton" onClick={logout}>
                        Déconnexion
                    </button>
                </div>
            </motion.nav>
        </>
    );
}

export default NavBarConnecte;
