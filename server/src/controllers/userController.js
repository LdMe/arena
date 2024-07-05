import user from "../models/user.js";

const getUserByUsername = async (username) => {
    try{

        return await user.findOne({ name: username });
    }
    catch(e){
        console.error(e);
        return  {error: e}
    }
}

const createUser = async (userData) => {
    try{
        return await user.create(userData);
    }
    catch(e){
        console.error(e);
        return  {error: e}
    }
}

const updateUser = async (username, userData) => {
    try{
        return await user.updateOne({ name: username }, userData);
    }
    catch(e){
        console.error(e);
        return  {error: e}
    }
}

const deleteUser = async (username) => {
    try{
        return await user.deleteOne({ name: username });
    }
    catch(e){
        console.error(e);
        return  {error: e}
    }
}

const functions ={
    getUserByUsername,
    createUser,
    updateUser,
    deleteUser
}
export default functions
