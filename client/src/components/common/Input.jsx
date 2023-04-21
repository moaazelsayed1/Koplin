import React, { useState } from 'react'
import { InputText } from 'primereact/inputtext'

const Input = (props) => {
    return (
        <div className="grow flex flex-col gap-1 w-full">
            <span className="p-float-label">
                <InputText
                    name={props.id}
                    type={props.type}
                    className={`h-10 drop-shadow-sm	 ${
                        props.error ? 'p-invalid' : ''
                    }`}
                    aria-describedby={props.aria}
                    id={props.id}
                    disabled={props.disabled}
                    // placeholder={
                    //     props.disabled
                    //         ? 'Disabled'
                    //         : `Enter your ${props.label} `
                    // }
                    value={props.value}
                    onChange={props.onChange}
                    onBlur={props.onBlur}
                />
                <label htmlFor="username">{props.label}</label>
            </span>

            {props.help && (
                <small className="text-neutral-500" id={props.aria}>
                    {props.help}
                </small>
            )}
        </div>
    )
}

export default Input
