import { useState } from "react";
import './Register.css'

const Register = ({onSubmit}) => {
    const [data, setData] = useState({
        username: '',
        email: ''
    })
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        if(!data.username){
            alert('Por favor, ingresa un nombre de usuario')
            return
        }
        onSubmit(data)
    }
    return (
        <section className="register-form">
            <h2>Registro</h2>
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Nombre de tu personaje:</label>
            <input type="text" name="username" value={data.username} onChange={handleChange} />
            <label htmlFor='email'>Email <br/>(opcional, para enviar notificaciones):</label>
            <input type="email" name="email" value={data.email} onChange={handleChange}/>
            <button type="submit">Crear Estraregia</button>
        </form>
        </section>
    )
}

export default Register