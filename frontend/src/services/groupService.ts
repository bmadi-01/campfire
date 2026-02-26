import axios from "axios"

const API = import.meta.env.VITE_API_URL

export const getMyGroups = async () => {
    const res = await axios.get(
        `${API}/groupes`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    )

    return res.data.groupes
}