import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import BoardApi from '../api/BoardApi'
import KanBan from '../components/common/ KanBan'

const Board = (props) => {
    const { boardId } = useParams()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [topicId, setTopicId] = useState('')
    const [lists, setLists] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const getBoard = async () => {
            try {
                const res = await BoardApi.getOne(boardId)
                setTitle(res.data.data.board_title)
                setDescription(res.data.data.board_description)
                setTopicId(res.data.data.topic_id)
            } catch (error) {
                navigate('/')
            }
        }

        const getTasks = async () => {
            try {
                const res2 = await BoardApi.getTasks(boardId)
                setLists(res2.data.tasks)
            } catch (error) {}
        }

        getBoard()
        getTasks()
    }, [boardId, navigate])

    return (
        <div>
            <KanBan
                socket={props.socket}
                data={lists}
                boardId={boardId}
                title={title}
                description={description}
                topicId={topicId}
                key={boardId + 1}
            />
        </div>
    )
}

export default Board
