import React from 'react'
import { Skeleton } from 'primereact/skeleton'

const TreeSkeleton = () => {
    return (
        <div className=" w-full flex flex-col gap-2 mt-[28px]">
            <Skeleton height="1.25rem" className=" p-2 w-full"></Skeleton>
            <Skeleton height="1.25rem" className=" p-2 w-full"></Skeleton>
            <Skeleton height="1.25rem" className=" p-2 w-full"></Skeleton>
            <Skeleton height="1.25rem" className=" p-2 w-full"></Skeleton>
            <Skeleton height="1.25rem" className=" p-2 w-full"></Skeleton>
        </div>
    )
}

export default TreeSkeleton
