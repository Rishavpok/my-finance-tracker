
import api from "../api/api";

export const singUp = ( data : any ) => api.post("/auth/register", data)
export const login = (data:any) => api.post("/auth/login", data)

