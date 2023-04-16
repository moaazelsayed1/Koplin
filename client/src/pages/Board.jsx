import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import BoardApi from '../api/BoardApi'
import KanBan from '../components/common/ KanBan'
const Board = () => {
    const { boardId } = useParams()
    console.log('boardId', boardId)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [lists, setLists] = useState([])
    const [icon, setIcon] = useState('')

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
    }, [])

    return (
        <div>
            <KanBan data={lists} boardId={boardId} />
        </div>
    )
}

export default Board
