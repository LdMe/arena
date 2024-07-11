import { useState } from "react";
import { login, register } from "../../utils/fetch";
import './Register.css'
import { saveToken } from "../../utils/local";
const Register = ({ onSubmit }) => {
    const [data, setData] = useState({
        username: '',
        password: '',
        saveSession: false
    })
    const [isRegistering, setIsRegistering] = useState(false)
    const [error, setError] = useState(null)
    const handleChange = (e) => {
        if (e.target.name === 'saveSession') {
            setData({ ...data, [e.target.name]: e.target.checked })
            return;
        }
        setData({ ...data, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!data.username) {
            setError('Por favor, ingresa un nombre de usuario')
            return
        }
        if (!data.password) {
            setError('Por favor, ingresa una contraseña')
            return
        }
        let result;
        if (isRegistering) {
            result = await register(data.username, data.password)
        } else {
            result = await login(data.username, data.password)
        }
        if (result.error) {
            setError(result.error)
            return
        }
        if (data.saveSession) {
            localStorage.setItem('username', data.username)
            saveToken(result.token)
        }
        else{
            localStorage.removeItem('username')
        }
        const isNew = isRegistering;
        onSubmit({ user: result.user, isNew })
    }
    const handleChangeStatus = () => {
        setIsRegistering(!isRegistering)
        setError(null)
    }
    return (
        <section className="register-section">
            <section className="register-form">
                {isRegistering ?
                    <h2>Registrarse en el Coliseo</h2>
                    :
                    <h2>Entrar al Coliseo </h2>
                }
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Nombre de tu personaje:</label>
                    <input type="text" name="username" value={data.username} onChange={handleChange} />
                    <label htmlFor='password'>Contraseña:</label>
                    <input type="password" name="password" value={data.password} onChange={handleChange} />
                    <label htmlFor="saveSession">Guardar sesión</label>
                    <input type="checkbox" name="saveSession" checked={data.saveSession} onChange={handleChange} />
                    <section className="register-buttons">
                        <button type="submit">{isRegistering ? 'Registrarse' : 'Entrar'}</button>
                        <p>{isRegistering ? "¿Ya tienes tu gladiador?" : "¿No tienes gladiador?"}</p>
                        <button type="button" onClick={handleChangeStatus}>{isRegistering ? 'Entrar' : 'Registrarse'}</button>
                    </section>
                </form>
            </section>
        </section>
    )
}

export default Register