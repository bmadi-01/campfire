import { useState } from "react";
import "../../css/createGroupModal.css";

interface Props {
    onClose: () => void;
    onGroupCreated: () => void;
}

function CreateGroupModal({ onClose, onGroupCreated }: Props) {

    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!nom.trim()) return;

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
                    description
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error);
                setLoading(false);
                return;
            }

            onGroupCreated();

        } catch (error) {
            console.error("Erreur création groupe :", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modalOverlay">
            <div className="modalContainer">

                <div className="modalClose" onClick={onClose}>
                    ✕
                </div>

                <h2>Créer un Groupe 🔥</h2>

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
