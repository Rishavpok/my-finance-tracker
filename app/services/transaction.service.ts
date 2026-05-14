import api from "../api/api";


export const createTransaction = (data : any ) => api.post("/transaction/create", data)

export const getTransactions = () => api.get("/transaction/all")