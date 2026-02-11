import {Link} from "react-router-dom";
import {motion} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import CampfireLogo from "../assets/logoCampfireNavbar.png";
import "../css/navbar.css";

function NavBar () {
    const audioRef = useRef<HTMLAudioElement | null > (null);
    const [soundEnabled, setSoundEnabled] = useState(false);

    useEffect(() => {
        if(soundEnabled && audioRef.current) {
            audioRef.current.volume = 0.15;
            audioRef.current.play().catch(() =>{});
        }
    }, [soundEnabled]);
    return (
        <>
            {/* Son Léger */}
            <audio ref = {audioRef} src="./assets/sounds/campfire-soft.mp3" />

            <motion.nav className="navBar">
                <motion.div className="navBar__logo">
                    <Link to="/home">
                        <img src={CampfireLogo}
                             alt="Campfire Logo"
                             className="navbar-logo" />
                    </Link>
                </motion.div>
                <motion.div className="navBar__menu">
                    <Link to="planning">Planning</Link>
                    <Link to="groupe">Groupes</Link>
                    <Link to="profile">Profil</Link>

                    {/*Bouton son*/}
                    <button
                        className="sound-toggler"
                        type="button"
                        onClick={() => setSoundEnabled(!soundEnabled)} title="Son">Feu</button>
                </motion.div>
            </motion.nav>
        </>
    )
}
export default NavBar;