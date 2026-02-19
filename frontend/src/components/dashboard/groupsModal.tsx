import { useEffect, useState } from "react";
import CreateGroupModal from "./createGroupModal";
import "../../css/groupsModal.css";

interface Props {
    onClose: () => void;
}

function GroupsModal({ onClose }: Props) {
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:4000/groupes", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error);
                setLoading(false);
                return;
            }

            setGroups(data.groupes || []);
        } catch (error) {
            console.error("Erreur récupération groupes :", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="groupsModalOverlay">
                <div className="groupsModalContainer">

                    {/* Bouton fermeture */}
                    <div className="groupsModalClose" onClick={onClose}>
                        ✕
                    </div>

                    <h2>Mes Groupes 👥</h2>

                    {/* Liste groupes */}
                    {loading ? (
                        <p>Chargement...</p>
                    ) : (
                        <div className="groupsList">
                            {groups.length === 0 ? (
                                <p>Aucun groupe trouvé.</p>
                            ) : (
                                groups.map((group) => (
                                    <div key={group.id_groupe} className="groupItem">
                                        <strong>{group.nom}</strong>
                                        <p>{group.description}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Bouton création */}
                    <div className="createGroupSection">
                        <button onClick={() => setIsCreateOpen(true)}>
                            ➕ Créer un groupe
                        </button>
                    </div>

                </div>
            </div>

            {/* Modéle création (en dehors de la structure principale) */}
            {isCreateOpen && (
                <CreateGroupModal
                    onClose={() => setIsCreateOpen(false)}
                    onGroupCreated={() => {
                        fetchGroups();
                        setIsCreateOpen(false);
                    }}
                />
            )}
        </>
    );
}

export default GroupsModal;
