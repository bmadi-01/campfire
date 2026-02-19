import { useEffect, useState } from "react";
import NavBarConnecte from "../components/navBarConnecte";
import GroupCard from "../components/groupes/groupCard";
import "../css/groupePage.css";

function Groupes() {
    const [groups, setGroups] = useState<any[]>([]);
    const [identites, setIdentites] = useState<any[]>([]);
    const [error, setError] = useState("");

    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [selectedIdentite, setSelectedIdentite] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchGroups();
        fetchIdentites();
    }, []);

    // -------------------------
    // FETCH GROUPES
    // -------------------------
    const fetchGroups = async () => {
        const response = await fetch("http://localhost:4000/groupes", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
            setGroups(data.groupes || []);
        }
    };

    // -------------------------
    // FETCH IDENTITES
    // -------------------------
    const fetchIdentites = async () => {
        const response = await fetch("http://localhost:4000/identites/me", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
            setIdentites(data.identites || []);
        }
    };

    // -------------------------
    // CREATE GROUPE
    // -------------------------
    const createGroup = async () => {
        setError("");

        if (!nom || !selectedIdentite) {
            setError("Veuillez remplir tous les champs.");
            return;
        }

        const response = await fetch("http://localhost:4000/groupes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                nom,
                description,
                id_identite: Number(selectedIdentite),
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.error);
            return;
        }

        setNom("");
        setDescription("");
        setSelectedIdentite("");
        fetchGroups();
    };

    return (
        <>
            <NavBarConnecte />

            <div className="groupesContainer">
                <h1>Gestion des Groupes 🔥</h1>

                {/* ---------------- CREATION ---------------- */}
                <div className="createGroupCard">
                    <h3>Créer un groupe</h3>

                    {error && <div className="errorText">{error}</div>}

                    <input
                        placeholder="Nom du groupe"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                    />

                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <select
                        value={selectedIdentite}
                        onChange={(e) => setSelectedIdentite(e.target.value)}
                    >
                        <option value="">Choisir une identité</option>
                        {identites.map((id) => (
                            <option key={id.id_identite} value={id.id_identite}>
                                {id.nom} {id.assigned ? "(Assignée)" : ""}
                            </option>
                        ))}
                    </select>

                    <button onClick={createGroup}>
                        ➕ Créer
                    </button>
                </div>

                {/* ---------------- LISTE GROUPES ---------------- */}
                <div className="groupesGrid">
                    {groups.map((group) => (
                        <GroupCard
                            key={group.id_groupe}
                            group={group}
                            refresh={fetchGroups}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default Groupes;