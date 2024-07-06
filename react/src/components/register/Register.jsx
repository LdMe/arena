import { useState } from "react";
import { login } from "../../utils/fetch";
import './Register.css'
import { saveToken } from "../../utils/local";
const Register = ({onSubmit}) => {
    const [data, setData] = useState({
        username: '',
        password: ''
    })
    const [error, setError] = useState(null)
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    const handleSubmit = async(e) => {
        e.preventDefault()
        if(!data.username){
            setError('Por favor, ingresa un nombre de usuario')
            return
        }
        if(!data.password){
            setError('Por favor, ingresa una contraseña')
            return
        }

        const result = await login(data.username, data.password);
        if(result.error){
            setError(result.error)
            return
        }

        saveToken(result.token)
        onSubmit(result.user)
    }
    return (
        <section className="register-form">
            <h2>Coliseo </h2>
            {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Nombre de tu personaje:</label>
            <input type="text" name="username" value={data.username} onChange={handleChange} />
            <label htmlFor='password'>Contraseña:</label>
            <input type="password" name="password" value={data.password} onChange={handleChange}/>
            <button type="submit">Entrar</button>
        </form>
        </section>
    )
}

export default Register