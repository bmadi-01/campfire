import { useState } from "react";
import MembersPanel from "./membersPanel";

interface Props {
    group: any;
    refresh: () => void;
}

function GroupCard({ group, refresh }: Props) {
    const [openMembers, setOpenMembers] = useState(false);
    const [editing, setEditing] = useState(false);
    const [nom, setNom] = useState(group.nom);
    const [description, setDescription] = useState(group.description);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");
    const isOrganisateur = group.level === "ORGANISATEUR";

    // -------------------------
    // UPDATE GROUPE
    // -------------------------
    const updateGroup = async () => {
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `http://localhost:4000/groupes/${group.id_groupe}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ nom, description }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
                return;
            }

            setEditing(false);
            refresh();
        } catch {
            setError("Erreur serveur.");
        } finally {
            setLoading(false);
        }
    };

    // -------------------------
    // DELETE GROUPE
    // -------------------------
    const deleteGroup = async () => {
        if (!window.confirm("Supprimer ce groupe ?")) return;

        setLoading(true);

        try {
            const response = await fetch(
                `http://localhost:4000/groupes/${group.id_groupe}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) refresh();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="groupCard">

            {/* -------- HEADER -------- */}
            <div className="groupHeader">
                <h3>{group.nom}</h3>

                <span
                    className={`roleBadge ${
                        isOrganisateur ? "organisateur" : "membre"
                    }`}
                >
          {group.level}
        </span>
            </div>

            {/* -------- CONTENT -------- */}
            {editing ? (
                <div className="groupEdit">
                    {error && <div className="errorText">{error}</div>}

                    <input
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                    />

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div className="groupActions">
                        <button onClick={updateGroup} disabled={loading}>
                            Sauvegarder
                        </button>
                        <button
                            className="secondaryBtn"
                            onClick={() => setEditing(false)}
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <p>{group.description}</p>

                    {/* -------- ACTIONS -------- */}
                    <div className="groupActions">
                        <button onClick={() => setOpenMembers(!openMembers)}>
                            {openMembers ? "Fermer membres" : "Voir membres"}
                        </button>

                        {isOrganisateur && (
                            <>
                                <button onClick={() => setEditing(true)}>
                                    Modifier
                                </button>

                                <button
                                    className="dangerBtn"
                                    onClick={deleteGroup}
                                    disabled={loading}
                                >
                                    Supprimer
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}

            {/* -------- MEMBERS PANEL -------- */}
            {openMembers && (
                <MembersPanel
                    groupId={group.id_groupe}
                    isOrganisateur={isOrganisateur}
                />
            )}
        </div>
    );
}

export default GroupCard;