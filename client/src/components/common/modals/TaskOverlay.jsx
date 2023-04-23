import React from 'react'
import { useEffect, useState } from 'react'
import { Sidebar } from 'primereact/sidebar'
import { InputText } from 'primereact/inputtext'
import { Editor } from 'primereact/editor'
import TaskApi from '../../../api/TaskApi'

const TaskOverlay = (props) => {
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
    useEffect(() => {
        setTask(props.task)
        setTitle(props.task.task_title)
        setDescription(props.task.task_description)
        setAssignee(props.task.assignee)
        const formattedDate = new Date(props.task.due_date).toLocaleDateString(
            'en-US',
            {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }
        )
        setDue(formattedDate)
    }, [props.task])

    const SubmitHandler = async () => {
        try {
            const res = await TaskApi.updateTask(task.task_id, {
                position: `${task.position}`,
                task_title: `${title}`,
                task_description: `${description}`,
                due_date: `${task.due_date}`,
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
            res = TaskApi.delete(props.task.task_id)
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
                    <Editor
                        value={description}
                        onTextChange={(e) => setDescription(e.htmlValue)}
                        headerTemplate={header}
                        style={{ height: '320px' }}
                        onBlur={SubmitHandler}
                    />
                </div>
                <div>
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
