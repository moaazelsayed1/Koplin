import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fullLogo } from '../../assets'
import { Button } from 'primereact/button'
import AddNewTopic from './modals/AddNewTopic'
import TopicApi from '../../api/TopicApi'
import BoardApi from '../../api/BoardApi'
import { setTopics } from '../../redux/features/topicSlice'
import { Link, useNavigate } from 'react-router-dom'
import { Tree } from 'primereact/tree'
import { setBoards } from '../../redux/features/boardSlice'

const SideBar = () => {
    const navigate = useNavigate()
    const [nodes, setNodes] = useState([])
    const [selectedKey, setSelectedKey] = useState('')

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

    // transformData(boards)
    console.log(result)

    const [activeIndex, setActiveIndex] = useState(0)
    let mappedNodes = []

    useEffect(() => {
        const getTopics = async () => {
            try {
                const res = await TopicApi.getAll()
                dispatch(setTopics(res.data.data))
                console.log(res.data.data)
            } catch (error) {
                alert(error)
            }
        }

        const getBoards = async () => {
            try {
                const res = await BoardApi.getAll()
                dispatch(setBoards(res.data.data))
                console.log(res.data.data)
            } catch (error) {
                alert(error)
            }
        }

        getTopics()
        getBoards()
    }, [])

    useEffect(() => {
        const fillData = async () => {
            try {
                mappedNodes = await topics.map((topic) => {
                    const relatedBoards = boards.filter(
                        (board) => board.topic_id === topic.topic_id
                    )

                    return {
                        key: topic.topic_id.toString(),
                        label: topic.topic_title,
                        children: relatedBoards.map((board) => {
                            return {
                                key:
                                    board.board_id.toString() +
                                    `-${topic.topic_id}`,
                                label: board.board_title,
                                url: `/boards/${board.board_id}`,
                            }
                        }),
                    }
                })
            } finally {
                console.log(mappedNodes)
                setNodes(mappedNodes)
            }
        }

        if (topics.length && boards.length) {
            fillData()
        }
    }, [topics, boards])

    const modalVisible = () => {
        setNewBoardModal(false)
    }

    const createTopicHandler = () => {
        setNewBoardModal(true)
    }

    const logOut = async () => {
        console.log('logout')
    }

    const nodeTemplate = (node, options) => {
        let label = <b>{node.label}</b>

        if (node.url) {
            label = (
                <a
                    href={node.url}
                    className="text-primary hover:underline font-semibold"
                >
                    {node.label}
                </a>
            )
        }

        return <span className={options.className}>{label} </span>
    }

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
                                selectionMode="single"
                                selectionKeys={selectedKey}
                                onSelectionChange={(e) =>
                                    setSelectedKey(e.value)
                                }
                                value={nodes ? nodes : []}
                                nodeTemplate={nodeTemplate}
                                className="w-full md:w-30rem"
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
