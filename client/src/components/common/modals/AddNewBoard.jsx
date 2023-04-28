import React, { useState, useRef, useEffect } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import Input from '../Input'
import { Toast } from 'primereact/toast'
import { InputTextarea } from 'primereact/inputtextarea'

import { useNavigate } from 'react-router-dom'

import BoardApi from '../../../api/BoardApi'

const AddNewBoard = (props) => {
    const toast = useRef(null)

    const navigate = useNavigate()

    const [newBoardName, setNewBoardName] = useState('')
    const [newBoardNameError, setNewBoardNameError] = useState('')

    const [newBoardDesciption, setNewBoardDesciption] = useState('')
    const [TopicId, setTopicId] = useState('')
    useEffect(() => {
        setTopicId(props.topicId)
    }, [props.topicId])

    const [loading, setLoading] = useState(false)

    const topicNameHandler = (e) => {
        setNewBoardName(e.target.value)
    }
    const topicdescriptionHandler = (e) => {
        setNewBoardDesciption(e.target.value)
    }

    const SubmitHandler = async (e) => {
        e.preventDefault()
        const board_title = newBoardName
        const board_description = newBoardDesciption
        const topic_id = TopicId

        setLoading(true)

        if (!board_title) {
            setNewBoardNameError('Topic name is required')
            setLoading(false)
            return
        }
        try {
            const res = await BoardApi.create(topic_id, {
                board_title,
                board_description,
            })
            setLoading(false)
            setNewBoardName('')
            setNewBoardDesciption('')
            props.onFinis(topic_id, [
                {
                    key: `${res.data.data.board_id}`,
                    label: `${res.data.data.board_title}`,
                    description: `${res.data.data.board_description}`,
                    url: `/boards/${res.data.data.board_id}`,
                },
            ])
        } catch (err) {
            setLoading(false)
            const show = () => {
                toast.current.show({
                    severity: 'info',
                    summary: 'Info',
                    detail: `${err.data.error}`,
                    life: 4000,
                })
            }
            show()
        } finally {
            const suc = 'Board created successfully'
            const show = () => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: `${suc}`,
                    life: 3000,
                })
            }
            show()
            props.onVisble()
        }
    }

    return (
        <>
            <Toast ref={toast} />
            <Dialog
                header="New Board"
                visible={props.visible}
                onHide={() => props.onVisble()}
                style={{ width: '500px' }}
                breakpoints={{ '960px': '75vw', '641px': '100vw' }}
            >
                <form
                    className="flex flex-col gap-9 pt-7"
                    onSubmit={SubmitHandler}
                >
                    <Input
                        name="boardname"
                        type="text"
                        label="Board Name"
                        Htmlfor="BoardName"
                        id="Board"
                        aria-describedby="BoardName-help"
                        value={newBoardName}
                        onChange={topicNameHandler}
                        error={newBoardNameError}
                        help={newBoardNameError ? newBoardNameError : null}
                    />

                    <span className="p-float-label">
                        <InputTextarea
                            className="w-full"
                            name="boarddescription"
                            type="text"
                            label="Board description"
                            id="email"
                            aria-describedby="boarddescription-help"
                            value={newBoardDesciption}
                            onChange={topicdescriptionHandler}
                            rows={5}
                            cols={30}
                        />
                        <label htmlFor="username">Board description</label>
                    </span>

                    <Button
                        type="submit"
                        className="Bg-orange-600"
                        label="Create"
                        icon="pi pi-arrow-right"
                        iconPos="right"
                        loading={loading}
                        // disabled={!newBoardName}
                        disabled={false}
                    />
                </form>
            </Dialog>
        </>
    )
}

export default AddNewBoard
