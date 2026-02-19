import axios from "axios"

const API = import.meta.env.VITE_API_URL

export const getPlanning = async (id: number) => {
    const res = await axios.get(`${API}/plannings/${id}`)
    return res.data.planning
}
