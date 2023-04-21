import React, { useState, useRef } from 'react'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'

const DeleteTopic = (props) => {
    const toast = useRef(null)

    const accept = () => {
        toast.current.show({
            severity: 'info',
            summary: 'Confirmed',
            detail: 'You have accepted',
            life: 3000,
        })
    }

    const reject = () => {
        toast.current.show({
            severity: 'warn',
            summary: 'Rejected',
            detail: 'You have rejected',
            life: 3000,
        })
    }

    const confirm2 = () => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept,
            reject,
        })
    }

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
        </>
    )
}

export default DeleteTopic
