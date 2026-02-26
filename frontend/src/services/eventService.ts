import axios from "axios"

const API = import.meta.env.VITE_API_URL

export const getEventsByPlanning = async (id: number) => {
    const res = await axios.get(
        `${API}/evenements/planning/${id}`
    )
    return res.data.evenements
}

export const createEvent = async (data: any) => {
    const res = await axios.post(
        `${API}/evenements`,
        data,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    )

    return res.data.evenement
}

export const deleteEvent = async (id: number) => {
    await axios.delete(`${API}/evenements/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
}