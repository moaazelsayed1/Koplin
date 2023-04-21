import React, { useEffect, useState, useRef } from 'react'
import { InputText } from 'primereact/inputtext'
import Input from '../components/common/Input'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { Link, useNavigate } from 'react-router-dom'
import { Divider } from 'primereact/divider'
import { Messages } from 'primereact/messages'

import authAPI from '../api/AuthAPI'

const Signup = () => {
    const navigate = useNavigate()
    const msgs = useRef(null)

    const [value, setValue] = useState('')
    const [error, seterr] = useState('')
    const [username, setUsername] = useState('')
    const [usernameError, setUsernameError] = useState('')

    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')

    const [password, setPassword] = useState('')
    const [passwordError, setpasswordError] = useState('')

    const [confirmPassword, setConfirmPassword] = useState('')

    const [validForm, setValidForm] = useState(true)

    const [loading, setLoading] = useState(false)

    const usernameHandler = (e) => {
        setUsername(e.target.value)
    }

    const emailHandler = (e) => {
        setEmail(e.target.value)
    }

    const userCheckHandler = () => {
        const emptyRegex = /^\s*$/
        const shortRegex = /^.{1,3}$/
        const invalidRegex = /[^a-zA-Z0-9_-]/

        if (emptyRegex.test(username)) {
            setUsernameError('Username is required.')
        } else if (shortRegex.test(username)) {
            setUsernameError('Username must be at least 4 characters long.')
        } else if (invalidRegex.test(username)) {
            setUsernameError(
                'Username can only contain letters, numbers, underscores, and hyphens.'
            )
        } else {
            setUsernameError('')
        }
    }

    const emailCheckHandler = () => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

        if (!email) {
            setEmailError('Email is required.')
        } else if (!emailRegex.test(email)) {
            setEmailError('Invalid email address.')
        } else {
            setEmailError('')
        }
    }

    const passwordCheckHandler = () => {
        const passwordRegex =
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
        if (password.length === 0) {
            setpasswordError('Password is required.')
        } else if (password.length < 8) {
            setpasswordError('Password must be at least 8 characters long.')
        } else if (!passwordRegex.test(password)) {
            setpasswordError(
                'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
            )
        } else if (password !== confirmPassword) {
            setpasswordError('Passwords do not match.')
        } else {
            setpasswordError('')
        }
    }

    useEffect(() => {
        if (
            usernameError ||
            emailError ||
            passwordError ||
            !username ||
            !email ||
            !password
        ) {
            setValidForm(true)
        } else {
            setValidForm(false)
        }
    }, [
        username,
        email,
        password,
        confirmPassword,
        usernameError,
        emailError,
        passwordError,
    ])

    const header = <div className="font-bold mb-3">Pick a password</div>
    const footer = (
        <>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
            </ul>
        </>
    )

    const SubmitHandler = async (e) => {
        e.preventDefault()

        const data = new FormData(e.target)
        const username = data.get('username').trim()
        const email = data.get('email').trim()
        const password = data.get('password').trim()

        userCheckHandler()
        emailCheckHandler()
        passwordCheckHandler()

        setLoading(true)
        try {
            const res = await authAPI.signup({ username, email, password })
            setLoading(false)
            localStorage.setItem('token', res.token)
            navigate('/')
        } catch (err) {
            setLoading(false)
            seterr(err.response.data.error)
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
            <div className="h3 mt-8">Signup</div>
            <form
                className="mt-12 w-80 grid grid-col justify-stretch gap-8"
                onSubmit={SubmitHandler}
            >
                <Messages ref={msgs} />
                <Input
                    type="text"
                    label="Username"
                    Htmlfor="username"
                    id="username"
                    aria="username-help"
                    value={username}
                    onChange={usernameHandler}
                    onBlur={userCheckHandler}
                    error={usernameError}
                    help={usernameError ? usernameError : null}
                />

                <Input
                    type="email"
                    label="Email"
                    Htmlfor="email"
                    id="email"
                    aria="email-help"
                    value={email}
                    onChange={emailHandler}
                    onBlur={emailCheckHandler}
                    error={emailError}
                    help={emailError ? emailError : null}
                />
                <div>
                    <span className="p-float-label">
                        <Password
                            name="password"
                            className={`inputpw ${
                                error || passwordError ? 'p-invalid' : ''
                            }`}
                            inputId="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={passwordCheckHandler}
                            header={header}
                            footer={footer}
                        />
                        <label htmlFor="password">Password</label>
                    </span>
                    {passwordError && (
                        <small id="Password-help " className="text-neutral-500">
                            {passwordError}
                        </small>
                    )}
                </div>

                <span className="p-float-label">
                    <Password
                        className={`inputpw ${error ? 'p-invalid' : ''}`}
                        inputId="confirmPassword"
                        feedback={false}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={passwordCheckHandler}
                    />
                    <label htmlFor="confirmPassword">
                        Re enter the password
                    </label>
                </span>
                <Button
                    type="submit"
                    label="Sign Up"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    loading={loading}
                    disabled={validForm}
                />
            </form>

            <span className="mt-8">
                have an account?{' '}
                <Link
                    className="text-orange-600 underline underline-offset-2"
                    to="/login"
                >
                    Login
                </Link>
            </span>
        </>
    )
}

export default Signup
