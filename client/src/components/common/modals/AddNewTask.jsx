import React, { useState, useRef, useEffect } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import Input from '../Input'
import { Toast } from 'primereact/toast'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Editor } from 'primereact/editor'

import { useNavigate } from 'react-router-dom'

import TaskApi from '../../../api/TaskApi'

import formatDate from '../../../utils/date'

const AddNewTask = (props) => {
    const renderHeader = () => {
        return (
            <span className="ql-formats">
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button
                    className="ql-underline"
                    aria-label="Underline"
                ></button>
            </span>
        )
    }

    const header = renderHeader()
    const toast = useRef(null)

    const navigate = useNavigate()

    const [newBoardName, setNewBoardName] = useState('')
    const [newBoardNameError, setNewBoardNameError] = useState('')

    const [newBoardDesciption, setNewBoardDesciption] = useState('')

    const [loading, setLoading] = useState(false)

    const [topicMembers, setTopicMembers] = useState([])

    const topicNameHandler = (e) => {
        setNewBoardName(e.target.value)
    }
    const topicdescriptionHandler = (e) => {
        setNewBoardDesciption(e.target.value)
    }
    const [Label, setLabel] = useState(props.labelId)

    const [newTask, setnewTask] = useState([
        '',
        '',
        formatDate(new Date()),
        +props.boardId,
        26,
        Label,
        '7',
    ])
    console.log('new task', newTask)
    useEffect(() => {
        setLabel(props.labelId)
        const members = async () => {
            try {
                const res = await TaskApi.members(props.topicId)
                const topicMembersRes = res.data.users.map((user) => ({
                    name: user.username,
                    code: user.user_id,
                }))
                setTopicMembers(topicMembersRes)

                console.log('members', res.data.users)
            } catch (err) {
                console.log('can not get members')
            }
        }
        members()
    }, [navigate, newTask])

    const SubmitHandler = async (e) => {
        e.preventDefault()

        setLoading(true)

        if (!newTask[0]) {
            setNewBoardNameError('Task name is required')
            setLoading(false)
            return
        }

        try {
            const newtask = {
                task_title: newTask[0],
                task_description: newTask[1],
                due_date: newTask[2],
                board_id: newTask[3],
                assignee_id: newTask[4].code,
                label: newTask[5],
                position: newTask[6],
            }
            const res = await TaskApi.create(newtask)
            console.log('new task', res)
            // const newData = [...newtask]
            props.onFinis({ ...res.data.data })
            setLoading(false)
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
        } catch (err) {
            setLoading(false)
            console.log(err.data)
            const show = () => {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: `${
                        err ? err.data.message : 'Something went wrong'
                    }`,
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
                header="New Task"
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
                        label="Task Name"
                        Htmlfor="topicName"
                        id="email"
                        aria="topicName-help"
                        value={newTask[0]}
                        onChange={(e) =>
                            setnewTask((prevState) => [
                                e.target.value,
                                ...prevState.slice(1),
                            ])
                        }
                        error={newBoardNameError}
                        help={newBoardNameError ? newBoardNameError : null}
                    />

                    <span className=" grow w-full p-float-label">
                        <p className="text-[13px] pl-3 mb-1 text-[#7a7493]">
                            Description
                        </p>
                        <Editor
                            value={newTask[1]}
                            onTextChange={(e) =>
                                setnewTask((prevState) => [
                                    prevState[0],
                                    e.htmlValue,
                                    ...prevState.slice(2),
                                ])
                            }
                            headerTemplate={header}
                            style={{ height: '320px' }}
                        />
                    </span>
                    <Input
                        name="duedate"
                        type="date"
                        label="Due Date"
                        htmlfor="duedate"
                        id="duedate"
                        aria-describedby="duedate-help"
                        value={newTask[2]}
                        onChange={(e) =>
                            setnewTask((prevState) => [
                                prevState[0],
                                prevState[1],
                                e.target.value,
                                prevState[3],
                                prevState[4],
                                prevState[5],
                                prevState[6],
                            ])
                        }
                        error={false}
                        help={false}
                    />

                    <span className="p-float-label">
                        <Dropdown
                            name="Assignee"
                            type="text"
                            label="Assign this task to"
                            htmlFor="Assignee"
                            id="Assignee"
                            aria-describedby="Assignee-help"
                            value={newTask[4]}
                            onChange={(e) =>
                                setnewTask((prevState) => [
                                    prevState[0],
                                    prevState[1],
                                    prevState[2],
                                    prevState[3],
                                    e.target.value,
                                    prevState[5],
                                    prevState[6],
                                ])
                            }
                            options={topicMembers}
                            optionLabel="name"
                            // editable
                            placeholder="Select a member"
                            className="w-full md:w-14rem"
                        />{' '}
                        <label htmlFor="Assignee">Assign this task to</label>
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

export default AddNewTask
