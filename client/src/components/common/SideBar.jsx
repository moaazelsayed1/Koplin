import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Avatar } from 'primereact/avatar'
import { FileUpload } from 'primereact/fileupload'
import { OverlayPanel } from 'primereact/overlaypanel'

import { fullLogo } from '../../assets'
import { Button } from 'primereact/button'
import AddNewTopic from './modals/AddNewTopic'
import TopicApi from '../../api/TopicApi'
import BoardApi from '../../api/BoardApi'
import { setTopics } from '../../redux/features/topicSlice'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Tree } from 'primereact/tree'
import { setBoards } from '../../redux/features/boardSlice'
import TopicEdit from './modals/TopicEdit'
import { Toast } from 'primereact/toast'
import { ConfirmPopup } from 'primereact/confirmpopup' // To use <ConfirmPopup> tag
import { confirmPopup } from 'primereact/confirmpopup' // To use confirmPopup method
import AddNewBoard from './modals/AddNewBoard'
import UserApi from '../../api/userApi'
import { setUser } from '../../redux/features/userSlice'
import TreeSkeleton from '../Skeletons/TreeSkeleton'
const SideBar = (props) => {
    const op = useRef(null)
    const { boardId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.value)
    const topics = useSelector((state) => state.topic.value)
    const boards = useSelector((state) => state.board.value)
    const [nodes, setNodes] = useState([])
    const [selectedKey, setSelectedKey] = useState(`${boardId}-1`)
    const [expandedKeys, setExpandedKeys] = useState({})

    useEffect(() => {
        if (!boardId) {
            setSelectedKey('')
        }
    }, [navigate])

    const onSelect = (event) => {
        if (event.node.url === undefined) return
        navigate(`${event.node.url}`)
    }

    const [NewTopicModal, setNewTopicModal] = useState(false)
    const [editTopic, setEditTopic] = useState(false)

    const [NewBoardModal, setNewBoardModal] = useState(false)
    const [addBoardtoTopic, setaddBoardtoTopic] = useState(false)

    let mappedNodes = []

    // Getting Topics and Boards
    useEffect(() => {
        const getTopics = async () => {
            let retries = 1
            let success = false
            while (retries > 0 && !success) {
                try {
                    const res = await TopicApi.getAll()
                    const finres = res.data.topics
                        .filter((topic) => topic !== null)
                        .sort((a, b) => a.topic_id - b.topic_id)
                    let boardsHere = []

                    for (let item of finres) {
                        let topic_id = item.topic_id
                        const thisTopic = await getBoards(topic_id)
                        boardsHere = [...boardsHere, ...thisTopic]
                    }
                    dispatch(setBoards(boardsHere))
                    dispatch(setTopics(finres))
                    success = true
                } catch (error) {
                    retries--
                }
            }
        }

        const getBoards = async (topicid) => {
            try {
                const res = await BoardApi.getTopicBoard(topicid)

                const boardsres = res.data.boards.sort(
                    (a, b) => a.board_id - b.board_id
                )
                return boardsres
            } catch (error) {}
        }

        getTopics()
        getBoards()
    }, [navigate])
    // Map Topics and Boards to Tree form to use the UI
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
                        description: topic.topic_description,
                        children: relatedBoards.map((board) => {
                            return {
                                key:
                                    board.board_id.toString() +
                                    `-${topic.topic_id}`,
                                label: board.board_title,
                                description: board.board_description,
                                url: `/boards/${board.board_id}`,
                            }
                        }),
                    }
                })
            } finally {
                setNodes(mappedNodes)
            }
        }

        if (topics.length || boards.length) {
            fillData()
        }
    }, [topics, boards, navigate])

    const AddBoardVisible = () => {
        setNewBoardModal(false)
    }

    const createBoardHandler = (boardKey) => {
        setaddBoardtoTopic(boardKey)
        setNewBoardModal(true)
    }

    const modalVisible = () => {
        setNewTopicModal(false)
    }

    const EditTopicModal = () => {
        setEditTopic(false)
    }

    const createTopicHandler = () => {
        setNewTopicModal(true)
    }

    const logOut = async () => {
        //WIP
        try {
            const res = await UserApi.LogOut()
            dispatch(setUser(null))
            dispatch(setTopics([]))
            dispatch(setBoards([]))
            localStorage.removeItem('token')
            dispatch(setBoards([]))
            dispatch(setTopics([]))

            navigate('/login')
        } catch (error) {}
    }
    const [editTpicId, setEditTpicId] = useState('')
    const [EditTopicName, setEditTopicName] = useState('')
    const [EditTopicDescription, setEditTopicDescription] = useState('')

    const editTopicHandler = (id, name, description) => {
        setEditTpicId(id)
        setEditTopicName(name)
        setEditTopicDescription(description)
        setEditTopic(true)
    }

    const EditTheTopic = (id, title) => {
        setNodes((prevData) => {
            const index = prevData.findIndex((topic) => topic.key === id)
            if (index !== -1) {
                const updatedTopic = { ...prevData[index], label: title }
                const newData = [...prevData]
                newData[index] = updatedTopic
                return newData
            } else {
                return prevData
            }
        })
    }

    // Delete Topic
    const [deleteTopicId, setDeleteTopicId] = useState('')

    const toast = useRef(null)

    const confirm2 = (event, key) => {
        const accept = async () => {
            try {
                const res = await TopicApi.deleteTopic(key)
                const deleteTopicFe = (topicId) => {
                    setNodes((prevData) => {
                        const newData = prevData.filter(
                            (topic) => topic.key !== topicId
                        )
                        return newData
                    })
                }
                deleteTopicFe(key)
            } catch (error) {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Rejected',
                    detail: 'We could not delete this topic',
                    life: 3000,
                })
            }
        }

        const reject = () => {}

        confirmPopup({
            target: event.currentTarget,
            message: 'Do you want to delete this topic?',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept,
            reject,
        })
    }

    const nodeTemplate = (node, options) => {
        let label = (
            <div className="group label-xb grow flex flex-row justify-between items-center">
                <p className="grow mr-2 font-medium text-sm	 ">{node.label}</p>
                <i
                    className="pi pi-plus
                    hover:bg-green-200 p-1 rounded-md hidden group-hover:block"
                    onClick={() =>
                        createBoardHandler(
                            node.key,
                            node.label,
                            node.description
                        )
                    }
                    style={{ fontSize: '0.8rem', color: '#2F9461' }}
                ></i>
                <i
                    className="pi pi-trash
                    hover:bg-red-200 p-1 rounded-md hidden group-hover:block"
                    onClick={(e) => confirm2(e, node.key)}
                    style={{ fontSize: '0.8rem', color: '#CD3636' }}
                ></i>
                <i
                    className="gear-topic pi pi-cog hover:bg-gray-200 p-1 rounded-md hidden group-hover:block"
                    onClick={() =>
                        editTopicHandler(node.key, node.label, node.description)
                    }
                    style={{ fontSize: '0.8rem' }}
                ></i>
            </div>
        )

        if (node.url) {
            label = (
                <div className="flex flex-row">
                    <p
                        // href={node.url}
                        className="text-primary hover:underline font-semibold"
                    >
                        {node.label}
                    </p>
                    <p></p>
                </div>
            )
        }

        return node.url ? (
            <Link to={node.url} className={options.className}>
                {label}
            </Link>
        ) : (
            label
        )
    }

    const AddTheNewTopic = (topic) => {
        const newParent = {
            key: topic.topic_id,
            label: topic.topic_title,
            description: topic.topic_description,
            children: [],
        }
        setNodes([...nodes, newParent])
    }

    const addChildToParent = (parentKey, children) => {
        setNodes((nodes) => {
            // find the parent node to add children to
            const parentNodeIndex = nodes.findIndex(
                (node) => node.key === parentKey
            )

            if (parentNodeIndex === -1) {
                // parent not found, return original state
                return nodes
            }

            // add the children to the parent node
            const parentNode = nodes[parentNodeIndex]
            const newParentNode = {
                ...parentNode,
                children: [...parentNode.children, ...children],
            }

            // create a new array of nodes with the updated parent node
            const newNodes = [...nodes]
            newNodes[parentNodeIndex] = newParentNode

            // return the updated nodes state
            return newNodes
        })
    }

    return (
        <>
            {' '}
            <Toast ref={toast} />
            <AddNewBoard
                visible={NewBoardModal}
                onVisble={AddBoardVisible}
                topicId={addBoardtoTopic}
                key={+addBoardtoTopic + 6}
                onFinis={addChildToParent}
            />
            <ConfirmPopup />
            <TopicEdit
                visible={editTopic}
                onVisble={EditTopicModal}
                onFinis={EditTheTopic}
                key={+editTpicId + 1}
                id={editTpicId}
                name={EditTopicName}
                description={EditTopicDescription}
            />
            <AddNewTopic
                visible={NewTopicModal}
                onVisble={modalVisible}
                onFinis={AddTheNewTopic}
            />
            <div className="flex flex-col h-screen sticky top-0 w-64 bg-white border-r px-4">
                <div className="flex justify-between items-center  h-14  mt-2 mb-4 ">
                    <img src={fullLogo} alt="logo" className="h-[32px]" />
                    <div className="card flex justify-content-center">
                        <Button
                            rounded
                            outlined
                            size="small"
                            className="!w-2 !h-9"
                            type="button"
                            icon="pi pi-bell"
                            onClick={(e) => op.current.toggle(e)}
                        />
                        <OverlayPanel ref={op}>
                            <div className="flex gap-0 w-64  mb-4">
                                <p className=" w-auto text-sm font-semibold">
                                    Notifications
                                </p>
                            </div>
                            <div className=" border-b pl-2 pr-6 py-4">
                                <p>Mohamed added you to this boards</p>
                            </div>
                        </OverlayPanel>
                    </div>
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
                            onClick={createTopicHandler}
                            className=" text-stone-700 w-full py-2 rounded-lg bg-white border border-1 "
                        >
                            Create a topic
                        </button>

                        <div className=" flex justify-content-center">
                            {!nodes || !topics.length ? (
                                <TreeSkeleton />
                            ) : (
                                <Tree
                                    onSelect={onSelect}
                                    selectionMode="single"
                                    selectionKeys={selectedKey}
                                    expandedKeys={expandedKeys}
                                    onSelectionChange={(e) =>
                                        setSelectedKey(e.value)
                                    }
                                    value={nodes ? nodes : []}
                                    nodeTemplate={nodeTemplate}
                                    className="w-full md:w-30rem"
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex flex-row items-center justify-between pb-6 pt-3 border-t ">
                        <Link to="/account">
                            <div className="flex flex-row gap-2 items-center">
                                <Avatar
                                    className="rounded-lg overflow-hidden"
                                    image={user.photo}
                                />

                                <h3 className="text-base font-normal text-slate-700	">
                                    {user?.username}
                                </h3>
                            </div>
                        </Link>
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
