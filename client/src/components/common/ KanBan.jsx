import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import TaskApi from '../../api/TaskApi'
const KanBan = (props) => {
    const boardId = props.boardId
    // const data = props.data
    // console.log('data', data)
    const [data, setData] = useState('')
    console.log(data)

    useEffect(() => {
        setData(props.data)
    }, [props.data])

    function updateData(data, sourceTasks, newLabel) {
        // Remove objects in data that have the same task_id as objects in sourceTasks
        data = data.filter(
            (d) => !sourceTasks.some((s) => s.task_id === d.task_id)
        )

        // Update the label of objects in sourceTasks
        sourceTasks.forEach((s) => (s.label = newLabel))

        // Concatenate the two arrays
        data = data.push(sourceTasks)

        return data
    }

    const onDragEnd = async ({ source, destination }) => {
        if (!destination) return
        const sourceColIndex = source.droppableId

        const destinationColIndex = destination.droppableId

        console.log('sourceColIndex', sourceColIndex)
        console.log('destinationColIndex', destinationColIndex)

        const sourceCol = data.filter(
            (task) => task.label === `${sourceColIndex}`
        )
        const destinationCol = data.filter(
            (task) => task.label === `${destinationColIndex}`
        )

        // const sourceSectionId = sourceCol.id
        // const destinationSectionId = destinationCol.id

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
            console.log('destinationTasks 1', destinationTasks)
            destinationTasks.splice(destination.index, 0, removed)

            console.log('removed', removed)
            console.log('destination.index', destination.index)
            updateData(data, destinationTasks, destinationColIndex)
        }
        console.log('data', removed)
        try {
            await TaskApi.updateTask(removed.task_id, {
                ...removed,
                label: destinationColIndex,
            })
            setData(data)
            console.log('data', data)
        } catch (error) {
            alert(error)
        }
    }

    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex justify-items-start w-[calc(100vw-16rem)] overflow-x-auto bg-slate-300">
                    <div className="w-[300px]">
                        <Droppable key="1" droppableId="1">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className=" w-[300px] p-3 mr-3"
                                >
                                    <div className=" flex items-center justify-between mb-3">
                                        <h3 className="grow h3">To Do</h3>
                                        <i className="pi pi-plus"></i>
                                    </div>
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
                                                    {(provided, snapshot) => (
                                                        <div
                                                            className={`p-8 mb-3${
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
                                                            <h2>
                                                                {
                                                                    task.task_title
                                                                }
                                                            </h2>
                                                            <h4>
                                                                {task.label}
                                                            </h4>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>

                    {/* ----- 2 ----- */}

                    <div className="w-[300px]">
                        <Droppable key="4" droppableId="4">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className=" w-[300px] p-3 mr-3"
                                >
                                    <div className=" flex items-center justify-between mb-3">
                                        <h3 className="grow h3">Completed</h3>
                                        <i className="pi pi-plus"></i>
                                    </div>
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
                                                    {(provided, snapshot) => (
                                                        <div
                                                            className={`p-8 mb-3${
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
                                                            <h2>
                                                                {
                                                                    task.task_title
                                                                }
                                                            </h2>
                                                            <h4>
                                                                {task.label}
                                                            </h4>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
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

{
    /* {data.map((task) => (
                        <div key={task.task_id}>
                            <h2>{task.task_title}</h2>
                            <h4>{task.label}</h4>
                        </div>
                    ))} */
}

// {data
//     .filter((task) => task.label === 'todo')
//     .map((task, index) => (
//         <Draggable
//             key={task.task_id}
//             draggableId={task.task_id}
//             index={index}
//         >
//             {(provided, snapshot) => (
//                 <div>
//                     <h2>
//                         {task.task_title}
//                     </h2>
//                     <h4>{task.label}</h4>
//                 </div>
//             )}
//         </Draggable>
//     ))}

{
    /* {
                        section.tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  padding: '10px',
                                  marginBottom: '10px',
                                  cursor: snapshot.isDragging ? 'grab' : 'pointer!important'
                                }}
                                onClick={() => setSelectedTask(task)}
                              >
                                <Typography>
                                  {task.title === '' ? 'Untitled' : task.title}
                                </Typography>
                              </Card>
                            )}
                          </Draggable>
                        ))
                      } */
}

{
    /* <div className="w-[300px]">
<Droppable key="2" droppableId="Two">
    {(provided) => (
        <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className=" w-[300px] p-3 mr-3"
        >
            <div className=" flex items-center justify-between mb-3">
                <h3 className="grow h3">To Do</h3>
                <i className="pi pi-plus"></i>
            </div>
            {data &&
                data
                    .filter(
                        (task) => task.label === 'todo'
                    )
                    .map((task, index) => (
                        <Draggable
                            key={task.task_id}
                            draggableId={task.task_id}
                            index={index}
                        >
                            {(provided, snapshot) => (
                                <div
                                    className={`p-8 mb-3${
                                        snapshot.isDragging
                                            ? 'cursor-grab'
                                            : 'cursor-default	'
                                    }`}
                                    ref={
                                        provided.innerRef
                                    }
                                    {...provided.dragHandleProps}
                                    {...provided.dragHandleProps}
                                >
                                    <h2>
                                        {
                                            task.task_title
                                        }
                                    </h2>
                                    <h4>
                                        {task.label}
                                    </h4>
                                </div>
                            )}
                        </Draggable>
                    ))}
            {provided.placeholder}
        </div>
    )}
</Droppable>
</div> */
}

// {data &&
//     data
//         .filter(
//             (task) => task.label === 'todo'
//         )
//         .map((task, index) => (
//             <Draggable
//                 key={task.task_id}
//                 draggableId={task.task_id}
//                 index={index}
//             >
//                 {(provided, snapshot) => (
//                     <div
//                         className={`p-8 mb-3${
//                             snapshot.isDragging
//                                 ? 'cursor-grab'
//                                 : 'cursor-default	'
//                         }`}
//                         ref={
//                             provided.innerRef
//                         }
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                     >
//                         <h2>
//                             {
//                                 task.task_title
//                             }
//                         </h2>
//                         <h4>
//                             {task.label}
//                         </h4>
//                     </div>
//                 )}
//             </Draggable>
//         ))}

;<Draggable key="skdksc" draggableId="skdksc" index="1">
    {(provided, snapshot) => (
        <div
            className={`p-8 mb-3${
                snapshot.isDragging ? 'cursor-grab' : 'cursor-default	'
            }`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
        >
            <h2>tt1</h2>
            <h4>label1</h4>
        </div>
    )}
</Draggable>
