import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

const DragSpace = (props) => {
    const title = props.title
    const label = props.label
    const [data, setdata] = useState('')

    useEffect(() => {
        setdata(props.data)
    }, [])

    return (
        <div className="w-[300px]">
            <Droppable id={label} key={label} droppableId={label.toString()}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className=" w-[300px] p-3 mr-3"
                    >
                        <div className=" flex items-center justify-between mb-3">
                            <h3 className="grow h3">{title}</h3>
                            <button
                                onClick={() => props.createTaskHandler(label)}
                            >
                                <i className="pi pi-plus"></i>
                            </button>
                        </div>
                        {data &&
                            data
                                .filter((task) => task.label === { label })
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
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <h2>{task.task_title}</h2>
                                                <h4>{task.label}</h4>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}

export default DragSpace
