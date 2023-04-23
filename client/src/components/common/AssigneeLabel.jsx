import React, { useEffect, useState } from 'react'
import { Chip } from 'primereact/chip'
import UserApi from '../../api/userApi'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setCashs } from '../../redux/features/cashSlice'

const AssigneeLabel = (props) => {
    const navigate = useNavigate()
    console.log('assignee', props.id)
    const [user, setuser] = useState('')
    const [Datew, setDate] = useState('')
    const userx = useSelector((state) => state.cash)
    const dsds = userx.value
    console.log('userx', userx)
    const dispatch = useDispatch()
    useEffect(() => {
        const formattedDate = new Date(props.due).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })

        setDate(formattedDate)

        const getTheUser = async (id) => {
            const result = dsds.find((item) => item.id === props.id)
            if (result) {
                // If result is found, update the state with the name
                setuser(result.name)
            } else {
                // If result is not found, make the API call
                try {
                    const res = await UserApi.getOnebyId(id)
                    const name = res.data.data.username
                    setuser(name)
                    dispatch(setCashs([...dsds, { id: props.id, name }]))
                } catch (err) {
                    console.log(err)
                }
            }
        }

        getTheUser(props.id)
    }, [navigate, props.id])

    return (
        <div className="flex flex-wrap gap-2 mt-3 items-center ">
            {user && <Chip className="text-sm py-0 rounded-lg" label={user} />}
            <p className="text-sm text-zinc-500">{Datew}</p>
        </div>
    )
}

export default AssigneeLabel
