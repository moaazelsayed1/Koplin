import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import BoardApi from '../api/BoardApi'
import KanBan from '../components/common/ KanBan'

const Board = () => {
    const { boardId } = useParams()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [lists, setLists] = useState([])
    const [icon, setIcon] = useState('')
    const navigate = useNavigate()
    useEffect(() => {
        const getBoard = async () => {
            try {
                const res = await BoardApi.getOne(boardId)
                setTitle(res.data.data.board_title)
                setDescription(res.data.data.board_description)
            } catch (error) {
                alert(error)
            }
        }

        const getTasks = async () => {
            try {
                const res2 = await BoardApi.getTasks(boardId)
                setLists(res2.data.tasks)
            } catch (error) {
                alert(error)
            }
        }
        getBoard()
        getTasks()
    }, [navigate])

    return (
        <div>
            <KanBan data={lists} boardId={boardId} title={title} />
        </div>
    )
}

export default Board
