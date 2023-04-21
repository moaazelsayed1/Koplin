import { useEffect, useState, useRef } from 'react'
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
import TopicEdit from './modals/TopicEdit'
import DeleteTopic from './modals/DeleteTheTopic'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import { ConfirmPopup } from 'primereact/confirmpopup' // To use <ConfirmPopup> tag
import { confirmPopup } from 'primereact/confirmpopup' // To use confirmPopup method
import AddNewBoard from './modals/AddNewBoard'

const SideBar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.value)
    const topics = useSelector((state) => state.topic.value)
    const boards = useSelector((state) => state.board.value)

    const [nodes, setNodes] = useState([])
    const [selectedKey, setSelectedKey] = useState('')

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
            try {
                const res = await TopicApi.getAll()
                const finres = res.data.data.sort(
                    (a, b) => a.topic_id - b.topic_id
                )
                dispatch(setTopics(finres))
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
                console.log(mappedNodes)
                setNodes(mappedNodes)
            }
        }

        if (topics.length && boards.length) {
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
        console.log('logout')
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
            console.log('here1', index)
            if (index !== -1) {
                const updatedTopic = { ...prevData[index], label: title }
                const newData = [...prevData]
                newData[index] = updatedTopic
                return newData
            } else {
                return prevData
            }
        })
        console.log('here2', nodes)
    }

    // Delete Topic
    const [deleteTopicId, setDeleteTopicId] = useState('')
    console.log('deleteTopicId', deleteTopicId)

    const toast = useRef(null)

    const confirm2 = (event, key) => {
        console.log('key', key)
        const accept = async () => {
            try {
                console.log('key start', key)
                const res = await TopicApi.deleteTopic(key)
                console.log(res)
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
            message: 'Do you want to delete this record?',
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

    return (
        <>
            {' '}
            <Toast ref={toast} />
            <AddNewBoard
                visible={NewBoardModal}
                onVisble={AddBoardVisible}
                topicId={addBoardtoTopic}
                key={+addBoardtoTopic + 6}
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
            <AddNewTopic visible={NewTopicModal} onVisble={modalVisible} />
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
                            onClick={createTopicHandler}
                            className=" text-stone-700 w-full py-2 rounded-lg bg-white border border-1 "
                        >
                            Create a topic
                        </button>

                        <div className=" flex justify-content-center">
                            <Tree
                                onSelect={onSelect}
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
