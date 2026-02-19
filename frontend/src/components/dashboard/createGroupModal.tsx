import {useEffect, useState} from "react";
import "../../css/createGroupModal.css";

interface Props {
    onClose: () => void;
    onGroupCreated: () => void;
}

function CreateGroupModal({ onClose, onGroupCreated }: Props) {

    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [identites, setIdentites] = useState<any[]>([]);
    const [selectedIdentite, setSelectedIdentite] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchIdentites();
    }, []);

    const fetchIdentites = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch(
            "http://localhost:4000/identites/me",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();
        setIdentites(data.identites);
    };

    const handleCreate = async () => {
        setError("");

        if (!nom.trim() || !selectedIdentite) {
            setError("Veuillez sélectionner une identité.");
            return;
        }

        const token = localStorage.getItem("token");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:4000/groupes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nom,
                    description,
                    id_identite: Number(selectedIdentite)
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
                setLoading(false);
                return;
            }

            onGroupCreated();
            onClose();

        } catch {
            setError("Erreur serveur.");
            console.error("Erreur création groupe :", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="createModalOverlay">
            <div className="createModalContainer">
                <div className="createModalClose" onClick={onClose}>
                    ✕
                </div>

                <h2>Créer un Groupe 🔥</h2>

                {error && <div className="errorText">{error}</div>}
                <div className="formGroup">
                    <label>Nom du groupe</label>
                    <input
                        type="text"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        placeholder="Ex: Groupe USER"
                    />
                </div>

                <div className="formGroup">
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description du groupe"
                    />
                </div>
                <select
                    value={selectedIdentite}
                    onChange={(e) => setSelectedIdentite(e.target.value)}
                >
                    <option value="">Choisir une identité</option>

                    {identites.map((id) => (
                        <option key={id.id_identite} value={id.id_identite}>
                            {id.nom} {id.assigned ? "(Déjà assignée)" : ""}
                        </option>
                    ))}
                </select>
                <button
                    className="createButton"
                    onClick={handleCreate}
                    disabled={loading}
                >
                    {loading ? "Création..." : "Créer le groupe"}
                </button>

            </div>
        </div>
    );
}

export default CreateGroupModal;
