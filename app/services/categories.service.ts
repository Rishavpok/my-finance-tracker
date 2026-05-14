import api from "../api/api";
export const getCategory = () => api.get("/category")

export const createCategory = (data:any) => api.post("/category", data)

export const deleteCategory = (id : string) => api.delete(`category/${id}`)