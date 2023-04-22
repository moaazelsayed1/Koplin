import React, { useState, useRef, useEffect } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import Input from '../Input'
import { Toast } from 'primereact/toast'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'

import { useNavigate } from 'react-router-dom'

import TaskApi from '../../../api/TaskApi'

import formatDate from '../../../utils/date'

const AddNewTask = (props) => {
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

    useEffect(() => {
        setLabel(props.labelId)
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
                assignee_id: newTask[4],
                label: newTask[5],
                position: newTask[6],
            }
            const res = await TaskApi.create(newtask)

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
            const show = () => {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: `${err ? err.data.error : 'Something went wrong'}`,
                    life: 4000,
                })
            }
            show()
        }
    }
    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' },
    ]
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
                        <InputTextarea
                            className="grow w-full"
                            name="topicdescription"
                            type="text"
                            label="topic description"
                            htmlFor="topicdescription"
                            id="email"
                            aria="topicdescription-help"
                            value={newTask[1]}
                            onChange={(e) =>
                                setnewTask((prevState) => [
                                    prevState[0],
                                    e.target.value,
                                    ...prevState.slice(2),
                                ])
                            }
                            rows={5}
                            cols={30}
                        />{' '}
                        <label htmlFor="topicdescription">
                            topic description
                        </label>
                    </span>
                    <Input
                        name="duedate"
                        type="date"
                        label="Due Date"
                        Htmlfor="duedate"
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
                            type="number"
                            label="Assign this task to"
                            Htmlfor="Assignee"
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
                            options={cities}
                            optionLabel="name"
                            // editable
                            placeholder="Select a member"
                            className="w-full md:w-14rem"
                        />{' '}
                        <label htmlFor="Assignee">Select a Member</label>
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
