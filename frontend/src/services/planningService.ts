import api from "./api"

export const getPlanning = async (id: number) => {
    const res = await api.get(`/plannings/${id}`)
    return res.data.planning
}

export const createPlanning = async (data: any) => {
    const res = await api.post(`/plannings`, data)
    return res.data.planning
}