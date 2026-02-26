import {Routes, Route} from "react-router-dom" ;
import {AnimatePresence} from "framer-motion";
import HomePage from "../pages/homePage";
import RegisterPage from "../pages/registerPage";
import LoginPage from "../pages/loginPage";
import GroupePage from "../pages/groupePage";
import PlanningPage from "../pages/planningPage.tsx"
import PrivateRoute from "./privateRoute";
import Dashboard from "../pages/dashboard"
import Profile from "../pages/profile.tsx";

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
                <Route path="/planning/:id" element={<PlanningPage />} />

                {/* TODO : Page pour le dashboard */}
                <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Dashboard/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    }
                />

                {/* TODO : Page de l'administrateur */}
                {/*<Route path="/admin" element={*/}
                {/*    <PrivateRoute requiredRole="ADMIN">*/}
                {/*        <AdminPage />*/}
                {/*    </PrivateRoute>*/}
                {/*    }*/}
                {/*/>*/}

            </Routes>
        </AnimatePresence>
    )
}