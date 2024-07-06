import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import user from "../models/user.js";

const getUserByUsername = async (username) => {
    try{

        return await user.findOne({ username });
    }
    catch(e){
        console.error(e);
        return  {error: e}
    }
}
const getById = async (id) => {
    try{
        return await user.findById(id);
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
const login = async (userData) => {
    const user = await getOrCreateUser(userData);
    if(user.error){
        return user
    }
    console.log("login",userData.password,user.password)
    const match = await bcrypt.compare(userData.password, user.password);
    if(match){
        const token = jwt.sign({_id:user._id,username:user.username},process.env.JWT_SECRET,{expiresIn: 60 * 60 * 24})
        return {user,token};
    }
    else{
        return {error: "Contraseña incorrecta",status: 401}
    }
}
const getOrCreateUser = async (userData) => {
    try{
        const user = await getUserByUsername(userData.username);
        if(user){
            return user;
        }
        return await createUser(userData);
    }
    catch(e){
        console.error(e);
        return  {error: e,status: 500}
    }
}

const updateUser = async (username, userData) => {
    try{
        console.log("userData",userData)
        return await user.updateOne({ username }, userData);
    }
    catch(e){
        console.error(e);
        return  {error: e}
    }
}
const getBlocks = async (username) => {
    try{
        const user =  await user.findOne({ username });
        if(user){
            return user.blocks;
        }
        return {error: "User not found",status: 404}
    }
    catch(e){
        console.error(e);
        return  {error: e,status: 500}
    }
}
const updateBlocks = async (username, blocks) => {
    console.log("updateBlocks",username,blocks)
    try{
        return await user.updateOne({ username }, { blocks });
    }
    catch(e){
        console.error(e);
        return  {error: e,status: 500}
    }
}

const deleteUser = async (username) => {
    try{
        return await user.deleteOne({ username });
    }
    catch(e){
        console.error(e);
        return  {error: e}
    }
}

const functions ={
    getUserByUsername,
    getById,
    createUser,
    getOrCreateUser,
    login,
    updateUser,
    deleteUser,
    getBlocks,
    updateBlocks
}
export default functions
