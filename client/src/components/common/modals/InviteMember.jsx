import React, { useState, useRef } from 'react'
import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast'
import { Chips } from 'primereact/chips'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import UserApi from '../../../api/userApi'
import TopicApi from '../../../api/TopicApi'

const InviteMember = (props) => {
    const userId = useSelector((state) => state.user.value)

    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState([])
    const [valueError, setValueError] = useState(false)

    const toast = useRef(null)

    const navigate = useNavigate()

    const SubmitHandler = async (e) => {
        e.preventDefault()

        setLoading(true)
        if (value.length === 0) {
            setValueError(true)
            setLoading(false)
            return
        }

        const inviteUser = (value) => {
            value.forEach(async (item) => {
                try {
                    const res = await UserApi.getOne(item)
                    const thisUser = res
                    if (thisUser.results === 0) {
                        const suc = `${item} is not a user`
                        setLoading(false)
                        const show = () => {
                            toast.current.show({
                                severity: 'warn',
                                summary: 'Warning',
                                detail: `${suc}`,
                                life: 3000,
                            })
                        }
                        show()
                        return
                    } else {
                        try {
                            props.socket.emit(
                                'invite',
                                props.boardId,
                                thisUser.user.user_id,
                                userId.user_id
                            )

                            const res = await TopicApi.addMemeber(
                                props.boardId,
                                thisUser.user.user_id
                            )
                        } catch (err) {}
                    }
                    setLoading(false)

                    const suc = 'user added successfully'
                    const show = () => {
                        toast.current.show({
                            severity: 'success',
                            summary: 'Success',
                            detail: `${suc}`,
                            life: 3000,
                        })
                    }
                    show()
                    setValue([])
                    props.onVisble()
                } catch (err) {
                    setLoading(false)
                    const show = () => {
                        toast.current.show({
                            severity: 'warn',
                            summary: 'Info',
                            detail: `Can't add "${item}" to this board`,
                            life: 4000,
                        })
                    }
                    show()
                }
            })
        }

        inviteUser(value)
    }

    return (
        <>
            <Toast ref={toast} />
            <Dialog
                header="Invite members"
                visible={props.visible}
                onHide={() => props.onVisble()}
                style={{ width: '500px' }}
                breakpoints={{ '960px': '75vw', '641px': '100vw' }}
            >
                <form
                    className="flex flex-col gap-9 pt-7"
                    onSubmit={SubmitHandler}
                >
                    <span className="w-full p-float-label">
                        <Chips
                            className={`grow w-full ${
                                valueError ? 'p-invalid' : ''
                            }`}
                            id="username"
                            value={value}
                            separator=","
                            onChange={(e) => setValue(e.value)}
                        />
                        <label htmlFor="username">Username</label>
                    </span>
                    <span className="flex flow-col w-full justify-between items-center">
                        <span className="text-sm text-stone-400">
                            <p className=" ">
                                use comma (,) to seperate between usernames
                            </p>
                            <p>Note: Member will be added to the topic</p>
                        </span>
                        <Button
                            type="submit"
                            className="Bg-orange-600"
                            label="Add"
                            icon="pi pi-plus"
                            iconPos="right"
                            loading={loading}
                            // disabled={!newBoardName}
                            disabled={false}
                        />
                    </span>
                </form>
            </Dialog>
        </>
    )
}

export default InviteMember
