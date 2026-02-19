import { useEffect, useState } from "react";

interface Props {
    groupId: number;
    isOrganisateur: boolean;
}

function MembersPanel({ groupId, isOrganisateur }: Props) {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await fetch(
                `http://localhost:4000/groupes/${groupId}/members`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
                return;
            }

            setMembers(data.membres || []);
        } catch {
            setError("Erreur récupération membres.");
        } finally {
            setLoading(false);
        }
    };

    const updateRole = async (id_identite: number, id_level: number) => {
        await fetch(
            `http://localhost:4000/groupes/${groupId}/membres/${id_identite}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id_level }),
            }
        );

        fetchMembers();
    };

    const removeMember = async (id_identite: number) => {
        await fetch(
            `http://localhost:4000/groupes/${groupId}/membres/${id_identite}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        fetchMembers();
    };

    if (loading) return <p>Chargement membres...</p>;
    if (error) return <p className="errorText">{error}</p>;

    return (
        <div className="membersPanel">
            {members.map((m) => (
                <div key={m.id_identite} className="memberItem">
                    <div className="memberInfo">
                        <span>{m.identite_nom}</span>
                        <span className="memberRole">{m.niveau}</span>
                    </div>

                    {isOrganisateur && (
                        <div className="memberActions">
                            <button onClick={() => updateRole(m.id_identite, 2)}>
                                Promouvoir
                            </button>
                            <button
                                className="dangerBtn"
                                onClick={() => removeMember(m.id_identite)}
                            >
                                Retirer
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default MembersPanel;