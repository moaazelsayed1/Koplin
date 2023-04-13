import React, { useState } from 'react'
import { ProgressSpinner } from 'primereact/progressspinner'
const Loading = (props) => {
    return (
        <div
            className={` w-full flex justify-center items-center ${
                props.fullHeight ? 'h-screen' : 'h-full'
            } `}
        >
            <ProgressSpinner aria-label="Loading" />
        </div>
    )
}

export default Loading
