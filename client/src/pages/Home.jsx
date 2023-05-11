// REACT
import React, { useEffect, useState, useRef } from 'react'
import { setCashs } from '../redux/features/cashSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { ConfirmDialog } from 'primereact/confirmdialog' // For <ConfirmDialog /> component
import { confirmDialog } from 'primereact/confirmdialog' // For confirmDialog method

//DRAG AND DROP
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
//APIS
import TaskApi from '../api/TaskApi'
//MODALS
import AddNewTask from '../components/common/modals/AddNewTask'
import BoardApi from '../api/BoardApi'
import InviteMember from '../components/common/modals/InviteMember'
import TaskOverlay from '../components/common/modals/TaskOverlay'
import TopicApi from '../api/TopicApi'
import AssigneeLabel from '../components/common/AssigneeLabel.jsx'

const Home = (props) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [data, setData] = useState('')
    const [boardId, setboardId] = useState('')

    const [newBoardName, setnewBoardName] = useState(`${props.title}`)

    const [inviteMemberModal, setInviteMemberModal] = useState(false)
    const [visibleRight, setVisibleRight] = useState(false)

    const parser = new DOMParser()

    useEffect(() => {
        const getTasks = async () => {
            try {
                const res = await TaskApi.getAllmyTasks()
                setData(res.data.tasks)
            } catch (err) {}
        }
        getTasks()

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
    }, [props.data, navigate])

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

            updateData(data, sourceTasks, sourceColIndex)
            updateData(data, destinationTasks, destinationColIndex)
        } else {
            ;[removed] = destinationTasks.splice(source.index, 1)
            destinationTasks.splice(destination.index, 0, removed)

            updateData(data, destinationTasks, destinationColIndex)
        }
        try {
            await TaskApi.updateTask(removed.board_id, removed.task_id, {
                ...removed,
                label: destinationColIndex,
            })
        } catch (error) {
            alert('avc', error)
        }
    }

    // MODAL UTILS
    const [NewBoardModal, setNewBoardModal] = useState(false)
    const [newTaskLabel, setnewTaskLabel] = useState('')

    const modalVisible = () => {
        setNewBoardModal(false)
    }

    const AddTheNewTask = (newTask) => {
        setData((prevData) => {
            const newData = [...prevData, newTask]
            return newData
        })
    }

    const [taskShown, settaskShown] = useState({})
    const overlayTaskHandler = async (task) => {
        setboardId(task.board_id)

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
        <div className=" flex flex-col h-screen">
            <ConfirmDialog />

            <InviteMember
                visible={inviteMemberModal}
                onVisble={() => setInviteMemberModal(false)}
                topicId={props.topicId}
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
                    <>
                        <p className="text-2xl font-semibold text-stone-900 mr-3">
                            {'My Tasks'}
                        </p>
                    </>
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
                visible={visibleRight}
                onHide={() => setVisibleRight(false)}
                task={taskShown}
                onDelete={onDeleteTaskHandler}
                onFinis={onEditTaskHandler}
                key={boardId + 3}
            />
        </div>
    )
}

export default Home
