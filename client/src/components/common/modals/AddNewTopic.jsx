import React, { useState, useRef } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import Input from '../Input'
import { Toast } from 'primereact/toast'

import { useNavigate } from 'react-router-dom'

import TopicApi from '../../../api/TopicApi'

const AddNewTopic = (props) => {
    const toast = useRef(null)

    const navigate = useNavigate()

    const [newBoardName, setNewBoardName] = useState('')
    const [newBoardNameError, setNewBoardNameError] = useState('')

    const [newBoardDesciption, setNewBoardDesciption] = useState('')

    const [loading, setLoading] = useState(false)

    const topicNameHandler = (e) => {
        setNewBoardName(e.target.value)
    }
    const topicdescriptionHandler = (e) => {
        setNewBoardDesciption(e.target.value)
    }

    const SubmitHandler = async (e) => {
        e.preventDefault()
        const topic_title = newBoardName
        const topic_description = newBoardDesciption

        setLoading(true)

        if (!topic_title) {
            setNewBoardNameError('Topic name is required')
            setLoading(false)
            return
        }

        try {
            const res = await TopicApi.create({
                topic_title,
                topic_description,
            })
            setLoading(false)
            console.log(res)
            console.log('success')
            navigate('/')
            setNewBoardName('')
            setNewBoardDesciption('')
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
            const suc = 'Topic created successfully'
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
                header="New Topic"
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
                        name="topicname"
                        type="text"
                        label="Topic Name"
                        Htmlfor="topicName"
                        id="email"
                        aria="topicName-help"
                        value={newBoardName}
                        onChange={topicNameHandler}
                        error={newBoardNameError}
                        help={newBoardNameError ? newBoardNameError : null}
                    />
                    <Input
                        name="topicdescription"
                        type="text"
                        label="topic description"
                        Htmlfor="topicdescription"
                        id="email"
                        aria="topicdescription-help"
                        value={newBoardDesciption}
                        onChange={topicdescriptionHandler}
                        error={false}
                        help={false}
                    />
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

export default AddNewTopic
