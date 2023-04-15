export const NodeService = {
    getTreeNodesData() {
        return [
            {
                key: '0',
                label: 'Documents',
                data: 'Documents Folder',
                icon: 'pi pi-fw pi-inbox',
                children: [
                    {
                        key: '0-0',
                        label: 'Work',
                        data: 'Work Folder',
                    },
                    {
                        key: '0-1',
                        label: 'Home',
                        data: 'Home Folder',
                    },
                ],
            },
            {
                key: '1',
                label: 'Events',
                data: 'Events Folder',
                icon: 'pi pi-fw pi-calendar',
                children: [
                    {
                        key: '1-0',
                        label: 'Meeting',
                        data: 'Meeting',
                    },
                    {
                        key: '1-1',
                        label: 'Product Launch',
                        data: 'Product Launch',
                    },
                ],
            },
        ]
    },

    getTreeTableNodes() {
        return Promise.resolve(this.getTreeTableNodesData())
    },

    getTreeNodes() {
        return Promise.resolve(this.getTreeNodesData())
    },
}
