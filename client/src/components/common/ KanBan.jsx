// REACT
import React, { useEffect, useState, useRef } from 'react'
import { setCashs } from '../../redux/features/cashSlice'
import { useSelector, useDispatch } from 'react-redux'

import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Tooltip } from 'primereact/tooltip'
import { Menu } from 'primereact/menu'
import { ConfirmDialog } from 'primereact/confirmdialog' // For <ConfirmDialog /> component
import { confirmDialog } from 'primereact/confirmdialog' // For confirmDialog method
import { Avatar } from 'primereact/avatar'

//DRAG AND DROP
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { setTopics } from '../../redux/features/topicSlice'

//APIS
import TaskApi from '../../api/TaskApi'
//MODALS
import AddNewTask from './modals/AddNewTask'
import { useNavigate, useParams } from 'react-router-dom'
import BoardApi from '../../api/BoardApi'
import InviteMember from './modals/InviteMember'
import AssigneeLabel from './AssigneeLabel'
import TaskOverlay from './modals/TaskOverlay'
import TopicApi from '../../api/TopicApi'

const KanBan = (props) => {
    const thisBoardId = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const menu = useRef(null)
    const [data, setData] = useState('')
    const [boardId, setboardId] = useState('')

    const [editing, setediting] = useState(false)
    const [newBoardName, setnewBoardName] = useState(`${props.title}`)
    const cashes = useSelector((state) => state.cash.value)
    console.log('cashe', cashes)
    const [inviteMemberModal, setInviteMemberModal] = useState(false)
    const [visibleRight, setVisibleRight] = useState(false)
    const deletetheboard = (event) => {
        const accept = async () => {
            try {
                const res = await BoardApi.delete(boardId)

                navigate('/')
            } catch (error) {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Rejected',
                    detail: 'We could not delete this board',
                    life: 3000,
                })
            }
        }

        const reject = () => {}

        confirmDialog({
            target: event.currentTarget,
            header: 'Delete Confirmation',
            message: 'Do you want to delete this board?',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept,
            reject,
        })
    }

    const items = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Invite members',
                    icon: 'pi  pi-user-plus',
                    command: () => {
                        setInviteMemberModal(true)
                    },
                },
                {
                    label: 'Delete board',
                    icon: 'pi pi-trash',
                    command: (e) => deletetheboard(e),
                },
            ],
        },
    ]

    const parser = new DOMParser()

    useEffect(() => {
        setData(props.data)
        setboardId(props.boardId)
        setnewBoardName(props.title)

        const getUsers = async () => {
            try {
                const res = await TopicApi.getAllusers(props.topicId)
                const newObjects = res.data.users.map((obj) => ({
                    id: obj.user_id,
                    name: obj.username,
                    photo: obj.photo,
                }))
                dispatch(setCashs([...newObjects]))
            } catch (err) {}
        }
        if (props.topicId) {
            getUsers()
        }
    }, [props.boardId, props.title, thisBoardId, props.data, navigate])

    // Drag and drop position changer functions
    function updateData(data, sourceTasks, newLabel) {
        // Remove objects in data that have the same task_id as objects in sourceTasks
        data = data.filter(
            (d) => !sourceTasks.some((s) => s.task_id === d.task_id)
        )

        // Update the label of objects in sourceTasks
        sourceTasks.forEach((s) => (s.label = newLabel))

        // Concatenate the two arrays
        data = data
            .concat(sourceTasks)
            .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))

        return data
    }

    const onDragEnd = async ({ source, destination }) => {
        setVisibleRight(false)
        if (!destination) return
        const sourceColIndex = source.droppableId

        const destinationColIndex = destination.droppableId

        console.log(source)
        const sourceCol = data.filter(
            (task) => task.label === `${sourceColIndex}`
        )
        const destinationCol = data.filter(
            (task) => task.label === `${destinationColIndex}`
        )

        const sourceTasks = [...sourceCol]
        const destinationTasks = [...destinationCol]

        let [removed] = []
        if (source.droppableId !== destination.droppableId) {
            ;[removed] = sourceTasks.splice(source.index, 1)
            destinationTasks.splice(destination.index, 0, removed)

            // updates(removed.task_id, destinationColIndex, destination.index)

            updateData(data, sourceTasks, sourceColIndex)
            updateData(data, destinationTasks, destinationColIndex)
        } else {
            ;[removed] = destinationTasks.splice(source.index, 1)
            destinationTasks.splice(destination.index, 0, removed)

            // updates(removed.task_id, destinationColIndex, destination.index)

            updateData(data, destinationTasks, destinationColIndex)
        }
        try {
            const res = await TaskApi.updateTask(
                removed.board_id,
                removed.task_id,
                {
                    ...removed,
                    label: destinationColIndex,
                }
            )
        } catch (error) {}
    }

    // MODAL UTILS
    const [NewBoardModal, setNewBoardModal] = useState(false)
    const [newTaskLabel, setnewTaskLabel] = useState('')

    const modalVisible = () => {
        setNewBoardModal(false)
    }

    const createTaskHandler = (label) => {
        setnewTaskLabel(label)
        setNewBoardModal(true)
    }

    const AddTheNewTask = (newTask) => {
        setData((prevData) => {
            const newData = [...prevData, newTask]
            return newData
        })
    }

    const updateBoardName = async () => {
        try {
            const res = await BoardApi.Update(boardId, {
                board_title: newBoardName,
                description: props.description,
                topicId: props.topicId,
            })
            setediting(false)
        } catch (err) {}
    }
    const [taskShown, settaskShown] = useState({})
    const overlayTaskHandler = (task) => {
        settaskShown(task)
        setVisibleRight(true)
    }

    const onEditTaskHandler = (id, updatedTask) => {
        const taskIndex = data.findIndex((task) => task.task_id === id)
        if (taskIndex !== -1) {
            const newData = [...data]
            newData[taskIndex] = updatedTask
            setData(newData)
        }
    }

    const onDeleteTaskHandler = (id) => {
        const taskIndex = data.findIndex((task) => task.task_id === id)
        if (taskIndex !== -1) {
            const newData = [...data]
            newData.splice(taskIndex, 1)
            setData(newData)
        }
    }

    return (
        <div key={boardId} className=" flex flex-col h-screen">
            <ConfirmDialog />

            <InviteMember
                visible={inviteMemberModal}
                onVisble={() => setInviteMemberModal(false)}
                topicId={props.topicId}
                boardId={boardId}
            />
            <AddNewTask
                visible={NewBoardModal}
                onVisble={modalVisible}
                boardId={boardId}
                topicId={props.topicId}
                labelId={newTaskLabel}
                onFinis={AddTheNewTask}
                key={newTaskLabel + boardId}
            />
            <div className="py-5 px-6 flex flex-row items-center justify-between bg-slate-50 border-b">
                <div className="flex flex-row items-center">
                    {!editing ? (
                        <>
                            <p className="text-2xl font-semibold text-stone-900 mr-3">
                                {newBoardName}
                            </p>
                            <Tooltip target=".pi-pencil" />
                            <i
                                className="transition-all pi pi-pencil mr-4 rounded-md hover:bg-slate-300 p-2"
                                style={{
                                    fontSize: '1rem',
                                    color: '#708090',
                                    cursor: 'pointer',
                                }}
                                onClick={() => setediting(true)}
                                data-pr-tooltip="Edit board name"
                                data-pr-position="top"
                                data-pr-at="right-16 bottom+24"
                                data-pr-my="center center"
                            ></i>
                            <Button
                                className=" h-9 shadow-btn"
                                label="New Task"
                                icon="pi pi-plus"
                                size="small"
                                onClick={() => createTaskHandler('1')}
                            />
                        </>
                    ) : (
                        <>
                            <InputText
                                value={newBoardName}
                                onChange={(e) =>
                                    setnewBoardName(e.target.value)
                                }
                                type="text"
                                className="p-inputtext-sm h-9 mr-3"
                                placeholder="Small"
                            />

                            <i
                                onClick={updateBoardName}
                                className="pi pi-check mr-2 hover:bg-green-200 p-1 rounded-md"
                                style={{
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    color: '#2F9461',
                                }}
                            ></i>
                            <i
                                className="pi pi-times hover:bg-red-200 p-1 rounded-md"
                                style={{
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    color: '#CD3636',
                                }}
                                onClick={() => setediting(false)}
                            ></i>
                        </>
                    )}
                </div>
                <div className="flex flex-row items-center">
                    <div className=" flex flex-row mr-6 ">
                        {cashes.map((item) => (
                            <div className=" mr-[-12px]" key={item.id}>
                                <Avatar image={item.photo} shape="circle" />
                            </div>
                        ))}
                    </div>
                    <Menu className="" model={items} popup ref={menu} />
                    <Button
                        className=" h-9 "
                        size="small"
                        // outlined
                        text
                        severity="help"
                        label=""
                        icon="pi pi-bars"
                        onClick={(e) => menu.current.toggle(e)}
                    />
                </div>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex justify-items-start w-[calc(100vw-16rem)] overflow-x-auto overflow-y-hidden pl-6 pt-6 bg-[#F6F6F8] h-full">
                    <div className=" secparent">
                        <Droppable id="1" key="1" droppableId="1">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="  sectionspace"
                                >
                                    <div className=" flex items-center justify-between mb-6">
                                        <h3 className="grow sectionTitle">
                                            TO DO
                                        </h3>
                                        <button
                                            className="transition-all bg-gray-100 w-8 h-8 rounded-full border border-gray-300 shadow-sm flex items-center justify-center hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-orange-500"
                                            onClick={() =>
                                                createTaskHandler('1')
                                            }
                                        >
                                            <i className="pi pi-plus"></i>
                                        </button>
                                    </div>
                                    <div className=" overflow-y-auto  h-full pb-20 ">
                                        {data &&
                                            data
                                                .filter(
                                                    (task) => task.label === '1'
                                                )

                                                .map((task, index) => (
                                                    <Draggable
                                                        key={task.task_id}
                                                        draggableId={task.task_id.toString()}
                                                        index={index}
                                                    >
                                                        {(
                                                            provided,
                                                            snapshot
                                                        ) => (
                                                            <div
                                                                onClick={() =>
                                                                    overlayTaskHandler(
                                                                        task
                                                                    )
                                                                }
                                                                className={` max-w-sm px-4 py-3 mb-3 shadow-card bg-white rounded-lg ${
                                                                    snapshot.isDragging
                                                                        ? 'cursor-grab'
                                                                        : 'cursor-pointer'
                                                                }`}
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <h2 className=" task-title text-base font-medium text-neutral-900">
                                                                    {
                                                                        task.task_title
                                                                    }
                                                                </h2>
                                                                <p className="carddescription text-base font-medium text-[#7A7493]">
                                                                    {
                                                                        parser
                                                                            ?.parseFromString(
                                                                                task.task_description,
                                                                                'text/html'
                                                                            )
                                                                            .querySelector(
                                                                                'p'
                                                                            )
                                                                            ?.innerText
                                                                    }
                                                                </p>
                                                                <div className="flex flex-row items-center justify-between">
                                                                    <AssigneeLabel
                                                                        id={
                                                                            task.assignee_id
                                                                        }
                                                                        due={
                                                                            task.due_date
                                                                        }
                                                                        key={
                                                                            task.due_date
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                    </div>
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>

                    {/* ----- 2 ----- */}

                    <div className=" secparent">
                        <Droppable id="2" key="2" droppableId="2">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="  sectionspace "
                                >
                                    <div className=" flex items-center justify-between mb-6">
                                        <h3 className="grow sectionTitle">
                                            Inprogress
                                        </h3>
                                        <button
                                            className="transition-all bg-gray-100 w-8 h-8 rounded-full border border-gray-300 shadow-sm flex items-center justify-center hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-orange-500"
                                            onClick={() =>
                                                createTaskHandler('2')
                                            }
                                        >
                                            <i className="pi pi-plus"></i>
                                        </button>
                                    </div>
                                    <div className=" overflow-y-auto  h-full pb-20 ">
                                        {data &&
                                            data
                                                .filter(
                                                    (task) => task.label === '2'
                                                )
                                                .map((task, index) => (
                                                    <Draggable
                                                        key={task.task_id}
                                                        draggableId={task.task_id.toString()}
                                                        index={index}
                                                    >
                                                        {(
                                                            provided,
                                                            snapshot
                                                        ) => (
                                                            <div
                                                                onClick={() =>
                                                                    overlayTaskHandler(
                                                                        task
                                                                    )
                                                                }
                                                                className={` max-w-sm px-4 py-3 mb-3 shadow-card bg-white rounded-lg ${
                                                                    snapshot.isDragging
                                                                        ? 'cursor-grab'
                                                                        : 'cursor-pointer'
                                                                }`}
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <h2 className="task-title text-base font-medium text-neutral-900">
                                                                    {
                                                                        task.task_title
                                                                    }
                                                                </h2>
                                                                <p className="carddescription text-base font-medium text-[#7A7493]">
                                                                    {
                                                                        parser
                                                                            ?.parseFromString(
                                                                                task.task_description,
                                                                                'text/html'
                                                                            )
                                                                            .querySelector(
                                                                                'p'
                                                                            )
                                                                            ?.textContent
                                                                    }
                                                                </p>
                                                                <div className="flex flex-row items-center justify-between">
                                                                    <AssigneeLabel
                                                                        id={
                                                                            task.assignee_id
                                                                        }
                                                                        due={
                                                                            task.due_date
                                                                        }
                                                                        key={
                                                                            task.due_date
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                    </div>
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>

                    {/* ----- 3 ----- */}

                    {/* ----- 2 ----- */}

                    <div className=" secparent">
                        <Droppable id="3" key="3" droppableId="3">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className=" sectionspace"
                                >
                                    <div className=" flex items-center justify-between mb-6">
                                        <h3 className="grow sectionTitle">
                                            Inreview
                                        </h3>
                                        <button
                                            className="transition-all bg-gray-100 w-8 h-8 rounded-full border border-gray-300 shadow-sm flex items-center justify-center hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-orange-500"
                                            onClick={() =>
                                                createTaskHandler('3')
                                            }
                                        >
                                            <i className="pi pi-plus"></i>
                                        </button>
                                    </div>
                                    <div className=" overflow-y-auto  h-full pb-20 ">
                                        {data &&
                                            data
                                                .filter(
                                                    (task) => task.label === '3'
                                                )
                                                .map((task, index) => (
                                                    <Draggable
                                                        key={task.task_id}
                                                        draggableId={task.task_id.toString()}
                                                        index={index}
                                                    >
                                                        {(
                                                            provided,
                                                            snapshot
                                                        ) => (
                                                            <div
                                                                onClick={() =>
                                                                    overlayTaskHandler(
                                                                        task
                                                                    )
                                                                }
                                                                className={`max-w-sm px-4 py-3 mb-3 shadow-card bg-white rounded-lg ${
                                                                    snapshot.isDragging
                                                                        ? 'cursor-grab'
                                                                        : 'cursor-pointer	'
                                                                }`}
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <h2 className="task-title text-base font-medium text-neutral-900">
                                                                    {
                                                                        task.task_title
                                                                    }
                                                                </h2>
                                                                <p className="carddescription text-base font-medium text-[#7A7493]">
                                                                    {
                                                                        parser
                                                                            ?.parseFromString(
                                                                                task.task_description,
                                                                                'text/html'
                                                                            )
                                                                            .querySelector(
                                                                                'p'
                                                                            )
                                                                            ?.textContent
                                                                    }
                                                                </p>
                                                                <div className="flex flex-row items-center justify-between">
                                                                    <AssigneeLabel
                                                                        id={
                                                                            task.assignee_id
                                                                        }
                                                                        due={
                                                                            task.due_date
                                                                        }
                                                                        key={
                                                                            task.due_date
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                    </div>
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>

                    {/* ----- 3 ----- */}

                    {/* ----- 2 ----- */}

                    <div className=" secparent">
                        <Droppable id="4" key="4" droppableId="4">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="  sectionspace"
                                >
                                    <div className=" flex items-center justify-between mb-6">
                                        <h3 className="grow sectionTitle">
                                            Completed
                                        </h3>
                                        <button
                                            className="transition-all bg-gray-100 w-8 h-8 rounded-full border border-gray-300 shadow-sm flex items-center justify-center hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-orange-500"
                                            onClick={() =>
                                                createTaskHandler('4')
                                            }
                                        >
                                            <i className="pi pi-plus"></i>
                                        </button>
                                    </div>
                                    <div className=" overflow-y-auto  h-full pb-20 ">
                                        {data &&
                                            data
                                                .filter(
                                                    (task) => task.label === '4'
                                                )
                                                .map((task, index) => (
                                                    <Draggable
                                                        key={task.task_id}
                                                        draggableId={task.task_id.toString()}
                                                        index={index}
                                                    >
                                                        {(
                                                            provided,
                                                            snapshot
                                                        ) => (
                                                            <div
                                                                onClick={() =>
                                                                    overlayTaskHandler(
                                                                        task
                                                                    )
                                                                }
                                                                className={`max-w-sm px-4 py-3 mb-3 shadow-card bg-white rounded-lg  ${
                                                                    snapshot.isDragging
                                                                        ? 'cursor-grab'
                                                                        : 'cursor-pointer'
                                                                }`}
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <h2 className="task-title text-base font-medium text-neutral-900">
                                                                    {
                                                                        task.task_title
                                                                    }
                                                                </h2>
                                                                <p className="carddescription text-base font-medium text-[#7A7493]">
                                                                    {
                                                                        parser
                                                                            ?.parseFromString(
                                                                                task.task_description,
                                                                                'text/html'
                                                                            )
                                                                            .querySelector(
                                                                                'p'
                                                                            )
                                                                            ?.textContent
                                                                    }
                                                                </p>
                                                                <div className="flex flex-row items-center justify-between">
                                                                    <AssigneeLabel
                                                                        id={
                                                                            task.assignee_id
                                                                        }
                                                                        due={
                                                                            task.due_date
                                                                        }
                                                                        key={
                                                                            task.due_date
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                    </div>
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>

                    {/* ----- 3 ----- */}
                </div>
            </DragDropContext>
            <TaskOverlay
                boardId={boardId}
                visible={visibleRight}
                onHide={() => setVisibleRight(false)}
                task={taskShown}
                onDelete={onDeleteTaskHandler}
                onFinis={onEditTaskHandler}
            />
        </div>
    )
}

export default KanBan
