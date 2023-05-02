import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

import UserApi from '../api/userApi'
const AccountSettings = () => {
    const user = useSelector((state) => state.user.value)
    console.log(user)
    const [loading, setloading] = useState(false)
    const [image, setimage] = useState([user.photo])
    const [name, setName] = useState(user.username)
    const [email, setEmail] = useState(user.email)
    console.log(name)
    const onImageChange = async (e) => {
        setimage(URL.createObjectURL(e.target.files[0]))
    }

    const postPohot = async () => {
        setloading(true)
        const formData = new FormData()

        formData.append('photo', image)
        if (name !== user.username) {
            formData.append('username', name)
        }
        if (email !== user.email) {
            formData.append('email', email)
        }
        try {
            const res = await UserApi.update(formData)
            setloading(false)
            window.location.reload()
        } catch (err) {
            setloading(false)
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

            <div className="pl-8 pt-6">
                <div className="mt-4 flex flex-col w-96 gap-2">
                    <div className="flex w-full justify-between items-center flex-row">
                        <img
                            className=" h-20 w-20 rounded-md"
                            src={image}
                            alt=""
                        />
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onImageChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className=" cursor-pointer inline-block px-6 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-[#ec4a0a] rounded-md shadow-md hover:bg-orange-600 focus:outline-none focus:shadow-outline-orange active:bg-orange-800"
                            >
                                Choose an Image
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-col w-full pt-4">
                        <div className="flex w-full  flex-col gap-2">
                            <label htmlFor="username">Username</label>
                            <InputText
                                className="w-full"
                                value={name}
                                id="username"
                                aria-describedby="username-help"
                                onChange={(e) => {
                                    setName(e.target.value)
                                }}
                            />
                            <small id="username-help"></small>
                        </div>
                        <div className="flex w-full  flex-col gap-2">
                            <label htmlFor="username">Email</label>
                            <InputText
                                type="email"
                                value={email}
                                className="w-full"
                                id="email"
                                aria-describedby="username-help"
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                            />
                            <small id="username-help"></small>
                        </div>
                    </div>
                </div>
                <Button
                    loading={loading}
                    className=" mt-4 h-9 shadow-btn"
                    label="Update"
                    size="small"
                    onClick={postPohot}
                />
            </div>
        </div>
    )
}

export default AccountSettings
