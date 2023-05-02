import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { InputText } from 'primereact/inputtext'

import UserApi from '../api/userApi'
const AccountSettings = () => {
    const user = useSelector((state) => state.user.value)

    const [image, setimage] = useState([])
    const [name, setName] = useState('')
    console.log(name)
    const onImageChange = async (e) => {
        setimage(e.target.files[0])
    }

    const postPohot = async () => {
        const formData = new FormData()
        formData.append('photo', image)
        formData.append('username', name)
        try {
            const res = await UserApi.update(formData)
            console.log(res)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className=" bg-gray-50 w-full ">
            <div className="py-5 px-6 flex flex-row items-center justify-between bg-slate-50 border-b">
                <div className="flex flex-row items-center">
                    <p className="text-2xl font-semibold text-stone-900 mr-3">
                        AccountSettings
                    </p>
                </div>
            </div>

            <div>
                <div className="flex  flex-col max-w-fit gap-2">
                    <label htmlFor="username">Username</label>
                    <InputText
                        id="username"
                        aria-describedby="username-help"
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                    />
                    <small id="username-help">
                        Enter your username to reset your password.
                    </small>
                </div>

                <img src={user.photo} alt="" />
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={onImageChange}
                />
                <button onClick={postPohot}>dsd</button>
            </div>
        </div>
    )
}

export default AccountSettings
