import { getToken } from "./local";

const API_URL = import.meta.env.VITE_BACKEND_HOST

const fetchData = async(route,method,inputData=null)=>{
    const url = new URL(API_URL + route);
    const fetchOptions = {
        method:method,
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        }
    }
    if(inputData){
        if(method === "get"){
            Object.keys(inputData).forEach(key=>{
                url.searchParams.append(key,inputData[key]);
            })
        }
        else if(method === "post" || method === "put" || method === "patch"){
            fetchOptions.body = JSON.stringify(inputData);
        }
    }
    try {
        const result = await fetch(url.toString(),fetchOptions);
        const data  = await result.json();
        return data;
    } catch (error) {
        console.error(error);
        return ({error:error.message})
    }
}

const login = async (username, password) => {
    const data = { username, password };
    const result = await fetchData("/login","post",data);
    return result;
}
const getBlocks = async () => {
    const result = await fetchData("/blocks","get");
    return result;
}
const updateBlocks = async (blocks) => {
    console.log("updateBlocks",blocks)
    const result = await fetchData("/blocks","put",blocks);
    return result;
}

export { fetchData, login, getBlocks, updateBlocks }