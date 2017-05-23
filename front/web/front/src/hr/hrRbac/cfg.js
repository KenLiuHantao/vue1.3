export default {
    leftItemCfg: {
        headCfg: {
            add: true,
            filter: false
        },
    },
    /* 
     * table 配置
     */
    tableCfg1: {
        // checkbox: [true, 'inventoryId'],
        operating: [true, 'config-operate',
            [{
                type: 'black',
                btn: 'edit',
                text: '编辑岗位'
            },{
                type: 'black',
                btn: 'remove',
                text: '移除岗位'
            },{
                type: 'red',
                btn: 'stop',
                text: '停用岗位'
            }]
        ],
        serial:true,
        // radio: [true, 'docNo'],
        width: [20], //排除序号，多选，单选，操作栏
        match: [
            {href:true,key:'name'}
        ],
        head: ['岗位名称'],
    },
    tableCfg2: {
        // checkbox: [true, 'inventoryId'],
        // operating: [true, 'default',{ type: 0 }],
        serial:true,
        // radio: [true, 'docNo'],
        width: [3, 3, 3, 4], //排除序号，多选，单选，操作栏
        match: [
            'name',
            'disableUserName',
            'disableTime',
            'disableReason'
        ],
        head: ['部门', '停用人', '停用时间','停用原因'],
    },
    tableCfg3: {
        // checkbox: [true, 'inventoryId'],
        serial:true,
        // radio: [true, 'docNo'],
        width: [3,4,4,4,5], //排除序号，多选，单选，操作栏
        match: [
            'roleName',
            'departmentName',
            'disableUserName',
            'disableTime',
            'disableReason'
        ],
        head: ['岗位', '所属部门', '停用人', '停用时间', '停用原因'],
    },
}
