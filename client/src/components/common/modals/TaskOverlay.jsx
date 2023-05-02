import React from 'react'
import { useEffect, useState } from 'react'
import { Sidebar } from 'primereact/sidebar'
import { InputText } from 'primereact/inputtext'
import { Editor } from 'primereact/editor'
import { Calendar } from 'primereact/calendar'

import TaskApi from '../../../api/TaskApi'

const TaskOverlay = (props) => {
    console.log('task', props.task)
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

    const [task, setTask] = useState({})

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [assignee, setAssignee] = useState('')
    const [due, setDue] = useState('')

    const [priority, setpriority] = useState('')
    useEffect(() => {
        const targetDate = new Date(props.task.due_date) // Replace with your target date
        const timeDiff = targetDate.getTime() - Date.now()
        const daysDiff = timeDiff / (1000 * 3600 * 24) // Convert timeDiff to days

        if (daysDiff <= 2) {
            setpriority(1)
        } else if (daysDiff <= 7) {
            setpriority(2)
        } else {
            setpriority(3)
        }
        setTask(props.task)
        setTitle(props.task.task_title)
        setDescription(props.task.task_description)
        setAssignee(props.task.assignee)
        setDue(props.task.due_date)
    }, [props.task])

    const SubmitHandler = async () => {
        try {
            const res = await TaskApi.updateTask(props.boardId, task.task_id, {
                position: `${task.position}`,
                task_title: `${title}`,
                task_description: `${description}`,
                due_date: `${due}`,
                label: `${task.label}`,
                board_id: `${task.board_id}`,
                assignee_id: `${task.assignee_id}`,
            })

            props.onFinis(task.task_id, res.data.data)
        } catch (err) {}
    }

    const onHide = () => {
        if (
            title !== props.task.task_title ||
            description !== props.task.task_description
        ) {
            SubmitHandler()
            props.onFinis()
        }
        props.onHide()
    }

    const deleteTheTask = async () => {
        try {
            props.onDelete(props.task.task_id)
            props.onHide()
            res = TaskApi.delete(props.task.board_id, props.task.task_id)
        } catch {}
    }

    return (
        <Sidebar
            className=" w-screen"
            visible={props.visible}
            position="right"
            onHide={onHide}
        >
            <div className="flex flex-col justify-between h-full">
                <div>
                    <InputText
                        className="transition-all text-xl py-2 mb-4 border-1 border-white hover:border focus:border "
                        value={title}
                        type="text"
                        placeholder="Normal"
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={SubmitHandler}
                    />
                    <div className="pl-4 flex flex-row items-center pb-8">
                        <p className=" text-slate-600 text-base font-medium mr-3">
                            Priority :
                        </p>
                        {priority === 3 && (
                            <p className="text-lime-700 max-w-fit text-sm font-normal py-1 px-2 rounded-md bg-lime-200 ">
                                low
                            </p>
                        )}
                        {priority === 2 && (
                            <p className="text-orange-700 max-w-fit text-sm font-normal py-1 px-2 rounded-md bg-orange-200 ">
                                Medium
                            </p>
                        )}
                        {priority === 1 && (
                            <p className=" text-red-700 max-w-fit text-sm font-normal py-1 px-2 rounded-md bg-red-200 ">
                                High
                            </p>
                        )}
                    </div>
                    <Editor
                        value={description}
                        onTextChange={(e) => setDescription(e.htmlValue)}
                        headerTemplate={header}
                        style={{ height: '320px' }}
                        onBlur={SubmitHandler}
                    />
                    <div className="flex mt-6 items-center">
                        <p className=" w-28 text-zinc-600">Due date: </p>
                        <InputText
                            className="transition-all text-xl py-2 border-1 border-white hover:border focus:border "
                            value={
                                due
                                    ? new Date(due).toISOString().slice(0, 10)
                                    : ''
                            }
                            type="date"
                            placeholder={due}
                            onChange={(e) => setDue(e.target.value)}
                            onBlur={SubmitHandler}
                        />
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center">
                    <i
                        onClick={deleteTheTask}
                        className="pi pi-trash
                    hover:bg-red-200 p-2 rounded-md cursor-pointer"
                        style={{ fontSize: '1.4rem', color: '#CD3636' }}
                    ></i>
                </div>
            </div>
        </Sidebar>
    )
}

export default TaskOverlay
