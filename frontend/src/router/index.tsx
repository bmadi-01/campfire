import {Routes, Route} from "react-router-dom" ;
import {AnimatePresence} from "framer-motion";
import HomePage from "../pages/homePage";
import RegisterPage from "../pages/registerPage";
import LoginPage from "../pages/loginPage";
import GroupePage from "../pages/groupePage";
import PlanningPage from "../pages/panningPage"

import App from "../App";

export default function AppRouter() {
    return (
        <AnimatePresence mode="wait">
            <Routes>

                {/* TODO : Page par defaut refference du projet */}
                <Route path={"/"} element={ <App /> } />

                {/* TODO : Page Accueil */}
                <Route path={"/home"} element={ <HomePage /> } />

                {/* TODO : Page Inscription */}
                <Route path={"/register"} element={ <RegisterPage /> } />

                {/* TODO : Page connexion */}
                <Route path={"/login"} element={ <LoginPage /> } />

                {/* TODO : Page les groupes */}
                <Route path={"/groupe"} element={ <GroupePage /> } />

                {/* TODO : Page pour le planning */}
                <Route path={"/planning"} element={ <PlanningPage /> } />

            </Routes>
        </AnimatePresence>
    )
}