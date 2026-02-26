import { useState } from "react"
import { createPlanning } from "../../services/planningService"
import { useNavigate } from "react-router-dom"

interface Props {
    groups: any[]
    onClose: () => void
}

export default function CreatePlanningModal({ groups, onClose }: Props) {

    const navigate = useNavigate()

    const [nom, setNom] = useState("")
    const [type, setType] = useState<"GREGORIEN" | "DIEGETIQUE">("GREGORIEN")
    const [isGroup, setIsGroup] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState<number | null>(null)

    const handleSubmit = async () => {

        if (!nom.trim()) {
            return alert("Nom requis")
        }

        if (isGroup && !selectedGroup) {
            return alert("Sélectionnez un groupe")
        }

        try {

            const payload = {
                nom,
                public: false, // groupe different de public
                type,
                id_groupe: isGroup ? selectedGroup : null
            }
            const planning = await createPlanning(payload)

            onClose()
            navigate(`/planning/${planning.id_planning}`)

        } catch (err) {
            alert("Erreur création planning")
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal">

                <h2>Créer un planning</h2>

                <input
                    placeholder="Nom du planning"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                />

                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            value="GREGORIEN"
                            checked={type === "GREGORIEN"}
                            onChange={() => setType("GREGORIEN")}
                        />
                        Grégorien
                    </label>

                    <label>
                        <input
                            type="radio"
                            value="DIEGETIQUE"
                            checked={type === "DIEGETIQUE"}
                            onChange={() => setType("DIEGETIQUE")}
                        />
                        Diégétique
                    </label>
                </div>

                {groups.length > 0 && (
                    <>
                        <label>
                            <input
                                type="checkbox"
                                checked={isGroup}
                                onChange={() => setIsGroup(!isGroup)}
                            />
                            Planning de groupe
                        </label>

                        {isGroup && (
                            <select
                                onChange={(e) => setSelectedGroup(Number(e.target.value))}
                            >
                                <option>Choisir un groupe</option>
                                {groups.map((g) => (
                                    <option key={g.id_groupe} value={g.id_groupe}>
                                        {g.nom}
                                    </option>
                                ))}
                            </select>
                        )}
                    </>
                )}

                <div className="modal-actions">
                    <button onClick={handleSubmit}>
                        Créer
                    </button>
                    <button onClick={onClose}>
                        Annuler
                    </button>
                </div>

            </div>
        </div>
    )
}