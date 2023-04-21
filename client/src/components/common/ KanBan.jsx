// REACT
import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'

//DRAG AND DROP
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
//APIS
import TaskApi from '../../api/TaskApi'
//MODALS
import AddNewTask from './modals/AddNewTask'
import { useNavigate } from 'react-router-dom'

const KanBan = (props) => {
    const navigate = useNavigate()
    const boardId = props.boardId
    const [data, setData] = useState('')

    useEffect(() => {
        setData(props.data)
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
            await TaskApi.updateTask(removed.task_id, {
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
    return (
        <div className=" flex flex-col h-screen">
            <AddNewTask
                visible={NewBoardModal}
                onVisble={modalVisible}
                boardId={boardId}
                labelId={newTaskLabel}
                onFinis={AddTheNewTask}
                key={newTaskLabel + boardId}
            />
            <div className="py-5 pl-6 flex flex-row items-center bg-slate-50 border-b">
                <p className="text-2xl font-semibold text-stone-900 mr-3">
                    {props.title}
                </p>
                <Button
                    className=" h-9 shadow-btn"
                    label="New Task"
                    icon="pi pi-plus"
                    size="small"
                    onClick={() => createTaskHandler('1')}
                />
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
                                                                className={`px-4 py-3 mb-3 shadow-card bg-white rounded-lg ${
                                                                    snapshot.isDragging
                                                                        ? 'cursor-grab'
                                                                        : 'cursor-default	'
                                                                }`}
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <h2 className=" text-base font-medium text-neutral-900">
                                                                    {
                                                                        task.task_title
                                                                    }
                                                                </h2>
                                                                <p className="carddescription text-base font-medium text-[#7A7493]">
                                                                    {
                                                                        task.task_description
                                                                    }
                                                                </p>
                                                                <h4>
                                                                    {task.label}
                                                                </h4>
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
                                                                className={`px-4 py-3 mb-3 shadow-card bg-white rounded-lg ${
                                                                    snapshot.isDragging
                                                                        ? 'cursor-grab'
                                                                        : 'cursor-default	'
                                                                }`}
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <h2 className=" text-base font-medium text-neutral-900">
                                                                    {
                                                                        task.task_title
                                                                    }
                                                                </h2>
                                                                <p className="carddescription text-base font-medium text-[#7A7493]">
                                                                    {
                                                                        task.task_description
                                                                    }
                                                                </p>
                                                                <h4>
                                                                    {task.label}
                                                                </h4>
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
                                                                className={`px-4 py-3 mb-3 shadow-card bg-white rounded-lg ${
                                                                    snapshot.isDragging
                                                                        ? 'cursor-grab'
                                                                        : 'cursor-default	'
                                                                }`}
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <h2 className=" text-base font-medium text-neutral-900">
                                                                    {
                                                                        task.task_title
                                                                    }
                                                                </h2>
                                                                <p className="carddescription text-base font-medium text-[#7A7493]">
                                                                    {
                                                                        task.task_description
                                                                    }
                                                                </p>
                                                                <h4>
                                                                    {task.label}
                                                                </h4>
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
                                                                className={`px-4 py-3 mb-3 shadow-card bg-white rounded-lg ${
                                                                    snapshot.isDragging
                                                                        ? 'cursor-grab'
                                                                        : 'cursor-default	'
                                                                }`}
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <h2 className=" text-base font-medium text-neutral-900">
                                                                    {
                                                                        task.task_title
                                                                    }
                                                                </h2>
                                                                <p className="carddescription text-base font-medium text-[#7A7493]">
                                                                    {
                                                                        task.task_description
                                                                    }
                                                                </p>
                                                                <h4>
                                                                    {task.label}
                                                                </h4>
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
        </div>
    )
}

export default KanBan
