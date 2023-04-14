import React from 'react'

const Container = (props) => {
    return (
        <div className=" flex flex-col justify-center items-center	mt-28">
            {props.children}
        </div>
    )
}

export default Container
