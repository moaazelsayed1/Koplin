import React, { useState, useRef } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import Input from '../Input'
import { Toast } from 'primereact/toast'
import { InputTextarea } from 'primereact/inputtextarea'

import { useNavigate } from 'react-router-dom'

import TopicApi from '../../../api/TopicApi'

const TopicEdit = (props) => {
    const toast = useRef(null)

    const navigate = useNavigate()

    const [TopicName, setTopicName] = useState(props.name)
    const [newBoardNameError, setNewBoardNameError] = useState('')
    const [TopicDesciption, setTopicDesciption] = useState(props.description)

    const [loading, setLoading] = useState(false)

    const topicNameHandler = (e) => {
        setTopicName(e.target.value)
    }
    const topicdescriptionHandler = (e) => {
        setTopicDesciption(e.target.value)
    }

    const SubmitHandler = async (e) => {
        e.preventDefault()
        const topic_title = TopicName
        const topic_description = TopicDesciption

        setLoading(true)

        if (!topic_title) {
            setNewBoardNameError('Topic name is required')
            setLoading(false)
            return
        }

        try {
            const res = await TopicApi.editTopic(props.id, {
                topic_title,
                topic_description,
            })
            console.log('id', props.id)
            setLoading(false)
            console.log(res)
            props.onFinis(props.id, topic_title, topic_description)
            console.log('success')
            setTopicName('')
            setTopicDesciption('')
            const suc = 'Topic updated successfully'
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
        }
    }

    return (
        <>
            <Toast ref={toast} />
            <Dialog
                header="Edit Topic"
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
                        value={TopicName}
                        onChange={topicNameHandler}
                        error={newBoardNameError}
                        help={newBoardNameError ? newBoardNameError : null}
                    />

                    <span className="p-float-label">
                        <InputTextarea
                            className="w-full"
                            id="TopicDesciption"
                            value={TopicDesciption}
                            onChange={topicdescriptionHandler}
                            rows={5}
                            cols={30}
                        />
                        <label htmlFor="TopicDesciption">
                            Topic Desciption
                        </label>
                    </span>

                    <Button
                        type="submit"
                        className="Bg-orange-600"
                        label="Save"
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

export default TopicEdit
