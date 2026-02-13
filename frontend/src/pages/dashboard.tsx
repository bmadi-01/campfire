import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarConnecte from "../components/navBarConnecte";
import GroupsModal from "../components/dashboard/groupsModal";
import GroupsCard from "../components/dashboard/groupsCard";
import FireFlies from "../components/fireFlies.tsx";

import "../css/dashboard.css";


function Dashboard() {
    const navigate = useNavigate();

    const [isGroupsOpen, setIsGroupsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [planningCount, setPlanningCount] = useState<number>(0);
    const [groupCount, setGroupCount] = useState<number>(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("utilisateur");

        if (!token || !storedUser) {
            navigate("/login");
            return;
        }

        setUser(JSON.parse(storedUser));

        fetchPlanning(token);
        fetchGroupes(token);

    }, []);

    // 🔥 FETCH PLANNING
    const fetchPlanning = async (token: string) => {
        try {
            const response = await fetch("http://localhost:4000/planning", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                logoutAndRedirect();
                return;
            }

            const data = await response.json();
            setPlanningCount(data.length || 0);

        } catch (error) {
            console.error("Erreur planning:", error);
        }
    };

    // 🔥 FETCH GROUPES ADAPTÉ À TON BACKEND
    const fetchGroupes = async (token: string) => {
        try {
            const response = await fetch("http://localhost:4000/groupes", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                logoutAndRedirect();
                return;
            }

            const data = await response.json();

            setGroupCount(data.groupes?.length || 0);

        } catch (error) {
            console.error("Erreur groupes:", error);
        }
    };

    const logoutAndRedirect = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("utilisateur");
        navigate("/login");
    };

    if (!user) return null;

    return (
        <>
            <NavBarConnecte />

            <div className="dashboardContainer">
                <FireFlies />

                <div className="dashboardHeader">
                    <h1>Bienvenue {user.prenom} 🔥</h1>
                    <p>Tableau de bord personnel</p>
                </div>

                <div className="dashboardGrid">

                    {/* Planning */}
                    <div className="dashboardCard">
                        <h3>📅 Planning</h3>
                        <p>{planningCount} événement{planningCount > 1 ? "s" : ""} à venir</p>
                        <button onClick={() => navigate("/planning")}>
                            Voir planning
                        </button>
                    </div>

                    {/* Groupes */}
                    <GroupsCard
                        onOpen={() => setIsGroupsOpen(true)}
                        GroupCount={groupCount}
                    />

                    {/* Profil */}
                    <div className="dashboardCard">
                        <h3>👤 Mon profil</h3>
                        <p>Consulter ou modifier vos informations</p>
                        <button onClick={() => navigate("/profile")}>
                            Voir profil
                        </button>
                    </div>

                    {/* ADMIN PANEL */}
                    {user.role === "ADMIN" && (
                        <div className="dashboardCard adminCard">
                            <h3>🛠 Panneau Administrateur</h3>
                            <p>Gestion globale de l'application</p>
                            <button onClick={() => navigate("/admin")}>
                                Accéder
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {isGroupsOpen && (
                <GroupsModal onClose={() => setIsGroupsOpen(false)} />
            )}
        </>
    );
}

export default Dashboard;
