import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import authAPI from '../../api/AuthAPI'

import { Sidebar } from 'primereact/sidebar'

import { fullLogo } from '../../assets'
import { Button } from 'primereact/button'
import AddNewTopic from './modals/AddNewTopic'
import TopicApi from '../../api/TopicApi'
import BoardApi from '../../api/BoardApi'
import { setTopics } from '../../redux/features/topicSlice'
import { Link, useNavigate } from 'react-router-dom'
import { Tree } from 'primereact/tree'
// import { NodeService } from '../../service/NodeService'
import { setBoards } from '../../redux/features/boardSlice'
const SideBar = () => {
    const navigate = useNavigate()
    const [nodes, setNodes] = useState([])
    const [selectedNodeKey, setSelectedNodeKey] = useState('')

    const onExpand = (event) => {
        console.log('onExpand')
    }

    const onCollapse = (event) => {
        console.log('onCollapse')
    }

    const onSelect = (event) => {
        navigate(`/boards/${event.node.key}`)
    }

    const onUnselect = (event) => {
        console.log('onUnselect')
    }

    const [NewBoardModal, setNewBoardModal] = useState(false)

    const dispatch = useDispatch()

    const user = useSelector((state) => state.user.value)
    const topics = useSelector((state) => state.topic.value)
    const boards = useSelector((state) => state.board.value)

    let result = []

    useEffect(() => {
        NodeService.getTreeNodes().then((data) => setNodes(data))
    }, [boards])

    const transformData = (data) => {
        // iterate through the array of objects
        data.forEach((obj, index) => {
            // transform each object into the desired format
            let transformedObj = {
                key: obj.board_id.toString(),
                label: obj.board_title,
                description: obj.board_description,
                children: [],
            }

            // add the transformed object to the result array
            result.push(transformedObj)
        })

        return result
    }

    transformData(boards)
    console.log(result)

    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        // const getBoards = async () => {
        //     try {
        //         const res = await TopicApi.getAll()
        //         dispatch(setTopics(res))
        //     } catch (error) {
        //         alert(error)
        //     }
        // }
        // getBoards()

        const getBoards = async () => {
            try {
                const res = await BoardApi.getAll()
                dispatch(setBoards(res.data.data))
            } catch (error) {
                alert(error)
            }
        }
        getBoards()
    }, [])

    // useEffect(() => {
    //     updateActiveBoard(topics.data.data)
    // }, [topics])

    // const updateActiveBoard = (listBoard) => {
    //     const activeItem = listBoard.findIndex((e) => e.id === topic_id)
    //     setActiveIndex(activeItem)
    //     console.log(activeItem)
    // }

    const modalVisible = () => {
        setNewBoardModal(false)
    }

    const createTopicHandler = () => {
        setNewBoardModal(true)
    }

    const logOut = async () => {
        console.log('logout')
    }

    const NodeService = {
        async getTreeNodesData() {
            return result
        },

        getTreeTableNodes() {
            return Promise.resolve(this.getTreeTableNodesData())
        },

        getTreeNodes() {
            return Promise.resolve(this.getTreeNodesData())
        },
    }

    console.log(NodeService)
    return (
        <>
            {' '}
            <AddNewTopic visible={NewBoardModal} onVisble={modalVisible} />
            <div className="flex flex-col h-screen sticky top-0 w-64 bg-white border-r px-4">
                <div className="flex items-center justify-start h-14  mt-2 mb-4 ">
                    <img src={fullLogo} alt="logo" className="h-[32px]" />
                </div>
                <div className="flex flex-col justify-between h-full min-h-max">
                    <div className="grow">
                        <Link
                            to="/"
                            className="flex items-center text-stone-700 w-full py-2 rounded-lg bg-slate-100 px-4 mb-2 gap-2"
                        >
                            <i
                                className="pi pi-home"
                                style={{ fontSize: '1rem' }}
                            ></i>
                            <p>Home</p>
                        </Link>
                        <button
                            on
                            onClick={createTopicHandler}
                            className=" text-stone-700 w-full py-2 rounded-lg bg-white border border-1 "
                        >
                            Create a topic
                        </button>

                        <div className=" flex justify-content-center">
                            <Tree
                                value={nodes}
                                selectionMode="single"
                                selectionKeys={selectedNodeKey}
                                onSelectionChange={(e) =>
                                    setSelectedNodeKey(e.value)
                                }
                                onExpand={onExpand}
                                onCollapse={onCollapse}
                                onSelect={onSelect}
                                onUnselect={onUnselect}
                                className="w-full p-0 m-0 border-0"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row items-center justify-between pb-6 pt-3 border-t ">
                        <h3 className="text-base font-normal text-slate-700	">
                            {user?.username}
                        </h3>
                        <Button
                            onClick={logOut}
                            className="w-8"
                            style={{ color: '#708090', fontSize: '0.5rem' }}
                            icon="pi pi-sign-out"
                            rounded
                            text
                            severity="secondary"
                            aria-label="LogOut"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SideBar
