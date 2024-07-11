import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import user from "../models/user.js";

const getUserByUsername = async (username) => {
    try {

        return await user.findOne({ username });
    }
    catch (e) {
        console.error(e);
        return { error: e }
    }
}
const getById = async (id) => {
    try {
        return await user.findById(id);
    }
    catch (e) {
        console.error(e);
        return { error: e }
    }
}
const createUser = async (userData) => {
    try {
        return await user.create(userData);
    }
    catch (e) {
        console.error(e);
        return { error: e }
    }
}
const login = async (userData) => {
    try {
        console.log("userData", userData)
        if (!userData.password) {
            return { error: "Contraseña requerida", status: 400 }
        }
        const user = await getUserByUsername(userData.username);
        console.log("user", user)
        if (!user) {
            return { error: "Usuario no encontrado", status: 404 }
        }
        if (user.error) {
            return { error: user.error , status: 500 }
        }
        const match = await bcrypt.compare(userData.password, user.password);
        if (match) {
            const token = jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })
            return { user, token };
        }
        else {
            return { error: "Contraseña incorrecta", status: 401 }
        }
    }
    catch (e) {
        console.error(e);
        return { error: e, status: 500 }
    }
}
const register = async (userData) => {
    try {
        const user = await getUserByUsername(userData.username);
        if (user) {
            return { error: "El usuario ya existe", status: 409 }
        }
        const newUser = await createUser(userData);
        const token = jwt.sign({ _id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24})
            return { user: newUser, token };
        }
    catch (e) {
        console.error(e);
        return { error: e, status: 500 }
    }
}


const updateUser = async (username, userData) => {
    try {

        return await user.updateOne({ username }, userData);
    }
    catch (e) {
        console.error(e);
        return { error: e }
    }
}
const getBlocks = async (username) => {
    try {
        const dbUser = await user.findOne({ username });
        if (dbUser) {
            return dbUser.blocks;
        }
        return { error: "User not found", status: 404 }
    }
    catch (e) {
        console.error(e);
        return { error: e, status: 500 }
    }
}
const updateBlocks = async (username, blocks) => {

    try {
        
        await user.updateOne({ username }, { blocks });
        const newUser = await user.findOne({ username });
        return  newUser.blocks;
    }
    catch (e) {
        console.error(e);
        return { error: e, status: 500 }
    }
}

const deleteUser = async (username) => {
    try {
        return await user.deleteOne({ username });
    }
    catch (e) {
        console.error(e);
        return { error: e }
    }
}
const getTopScores = async () => {
    try {
        return await user.find({
            $or: [
                { wins: { $gt: 0 } },
                { draws: { $gt: 0 } },
                { losses: { $gt: 0 } }
            ]
        }).sort({ wins: -1, draws: -1, losses: 1 }).limit(10).select({ username: 1, wins: 1, draws: 1, losses: 1 });
    }
    catch (e) {
        console.error(e);
        return { error: e }
    }
}
const functions = {
    getUserByUsername,
    getById,
    createUser,
    login,
    updateUser,
    deleteUser,
    getBlocks,
    updateBlocks,
    register,
    getTopScores
}
export default functions
