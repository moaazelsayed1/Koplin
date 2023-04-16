import React, { useState, useRef, useEffect } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import Input from '../Input'
import { Toast } from 'primereact/toast'

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

    console.log('newTask', newTask)
    const createTask = async (labelId) => {
        console.log('labelId', labelId)
        try {
            const task = await TaskApi.create(boardId, { sectionId })
            //   const newData = [...data]
            //   const index = newData.findIndex(e => e.id === sectionId)
            //   newData[index].tasks.unshift(task)
            //   setData(newData)
        } catch (err) {
            alert(err)
        }
    }

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
            console.log('ressss', res)
            console.log('success')
        } catch (err) {
            setLoading(false)
            const show = () => {
                toast.current.show({
                    severity: 'info',
                    summary: 'Info',
                    detail: `${err?.data.error}`,
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
                    <Input
                        name="topicdescription"
                        type="text"
                        label="topic description"
                        Htmlfor="topicdescription"
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
                        error={false}
                        help={false}
                    />
                    <Input
                        name="topicdescription"
                        type="date"
                        label="topic description"
                        Htmlfor="topicdescription"
                        id="email"
                        aria="topicdescription-help"
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
                    <Input
                        name="topicdescription"
                        type="number"
                        label="topic description"
                        Htmlfor="topicdescription"
                        id="email"
                        aria="topicdescription-help"
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

export default AddNewTask
