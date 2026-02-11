import { useNavigate } from "react-router-dom";
import NavBar from "../components/navBar.tsx";
import FireFlies from "../components/fireFlies.tsx";

import "../css/global.css";
import "../css/homePage.css";

function HomePage() {
    const navigate = useNavigate();

    const login = () => navigate("/login");
    const register = () => navigate("/register");

    return (
        <>
            <NavBar />

            <main className="homeWrapper">

                {/* HERO SECTION */}
                <section className="heroSection">
                    <FireFlies />

                    <div className="hero">
                        <h1>
                            Bienvenue sur <span className="feu">Campfire 🔥</span>
                            <br />
                            <span className="organisez">Organisez</span> vos événements de groupe facilement.
                        </h1>

                        <p>
                            Gérez vos activités, planifiez vos événements et collaborez
                            en toute simplicité.
                        </p>

                        <div className="buttons">
                            <button className="primaryBtn" onClick={login}>
                                Se connecter
                            </button>

                            <button className="secondaryBtn" onClick={register}>
                                S'inscrire
                            </button>
                        </div>
                    </div>
                </section>

                {/* INFO SECTION */}
                <section className="infoSection">
                    <div className="infoCard">
                        <h5>📅 Planning du jour</h5>
                    </div>

                    <div className="infoCard">
                        <h5>👥 Événement de cette semaine</h5>
                    </div>
                </section>

            </main>
        </>
    );
}

export default HomePage;
