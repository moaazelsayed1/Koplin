import React, { useState, useEffect, useRef } from 'react'
import Input from '../components/common/Input'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { Link, useNavigate } from 'react-router-dom'
import authAPI from '../api/AuthAPI'
import { Messages } from 'primereact/messages'

const Login = () => {
    const navigate = useNavigate()
    const msgs = useRef(null)

    const [username, setUsername] = useState('')
    const [usernameError, setUsernameError] = useState('')

    const [password, setPassword] = useState('')
    const [passwordError, setpasswordError] = useState('')

    const [validForm, setValidForm] = useState(true)

    const usernameHandler = (e) => {
        setUsername(e.target.value)
    }

    const [value, setValue] = useState('')
    const [error, seterr] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (usernameError || passwordError || !username || !password) {
            setValidForm(true)
        } else {
            setValidForm(false)
        }
    }, [username, password, usernameError, passwordError])

    const SubmitHandler = async (e) => {
        e.preventDefault()
        const data = new FormData(e.target)
        const email = data.get('email')?.trim()
        const password = data.get('password')?.trim()
        setLoading(true)

        try {
            const res = await authAPI.login({ email, password })
            setLoading(false)
            localStorage.setItem('token', res.token)
            navigate('/')
        } catch (err) {
            setLoading(false)
            seterr(err.data.message) // change this line
            const addMessages = () => {
                msgs.current.show([
                    {
                        severity: 'error',
                        summary: '',
                        detail: `${err.data.message}`,
                        sticky: true,
                        life: 3000,
                    },
                ])
            }
            const clearMessages = () => {
                msgs.current.clear()
            }
            setTimeout(() => {
                clearMessages()
            }, 4000) // 4 seconds delay before calling xyz function

            addMessages()
        }
    }

    return (
        <>
            <div className="h3 mt-8">Login</div>

            <form
                className="mt-12 w-96 grid grid-col justify-stretch gap-8"
                onSubmit={SubmitHandler}
            >
                <Messages ref={msgs} />

                <Input
                    name="email"
                    type="text"
                    label="Username"
                    Htmlfor="username"
                    id="email"
                    aria="username-help"
                    value={username}
                    onChange={usernameHandler}
                    error={usernameError}
                    help={usernameError ? usernameError : null}
                />

                <div>
                    <span className="p-float-label">
                        <Password
                            name="password"
                            className={`inputpw ${error ? 'p-invalid' : ''}`}
                            inputId="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            feedback={false}
                        />
                        <label htmlFor="password">Password</label>
                    </span>
                    {passwordError && (
                        <small id="Password-help">{passwordError}</small>
                    )}
                </div>

                <Button
                    type="submit"
                    className="Bg-orange-600"
                    label="Login"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    loading={loading}
                    disabled={validForm}
                />
            </form>

            <span className="mt-8">
                Don't have an account?{' '}
                <Link
                    className="text-orange-600 underline underline-offset-2"
                    to="/signup"
                >
                    Signup
                </Link>
            </span>
        </>
    )
}

export default Login
