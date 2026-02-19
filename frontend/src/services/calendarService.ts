import axios from "axios"

const API = import.meta.env.VITE_API_URL

export const advanceTime = async (
    id: number,
    delta: { minutes?: number; heures?: number; jours?: number }
) => {
    const res = await axios.post(
        `${API}/plannings/${id}/calendar/advance`,
        delta,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    )
    return res.data.state
}
