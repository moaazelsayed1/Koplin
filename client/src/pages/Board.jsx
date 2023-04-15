import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import BoardApi from '../api/BoardApi'
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
                console.log('Boar')
                setTitle(res.data.data.board_title)
                setDescription(res.data.data.board_description)
            } catch (error) {
                alert(error)
            }
        }

        const getTasks = async () => {
            try {
                const res2 = await BoardApi.getTasks(boardId)
                console.log('Tasks')
                console.log('Boar', res2)
            } catch (error) {
                alert(error)
            }
        }
        getTasks()
        getBoard()
    }, [])

    return <div>Board</div>
}

export default Board
