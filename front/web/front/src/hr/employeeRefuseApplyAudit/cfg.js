export default {
    leftItemCfg: {
        headCfg: {
            add: false,
            filter: false
        },
        /*
         * list 配置
         */
        listCfg: {
            hasNub: true,
            hasChild: true,
        },
        /*
         * filter 配置
         */
        filterCfg: [{
            label: '工号:',
            key: 'jobNumber',
            value: '',
            type: 'text',
            placeholder: '请输入工号'
        }, {
            label: '姓名:',
            key: 'employeeName',
            value: '',
            type: 'text',
            placeholder: '请输入员工姓名'
        }, {
            label: '入职日期:',
            key: 'enterDateStart',
            value: '',
            type: 'date',
            config:{
                placeholder:'请输入入职日期'
            }
        },{
            label: '入职日期:',
            key: 'enterDateEnd',
            value: '',
            type: 'date',
            config:{
                placeholder:'请输入入职日期'
            }
        },{
            label: '离职申请日期:',
            key: 'applicationDateStart',
            value: '',
            type: 'date',
            config:{
                placeholder:'请输入离职申请日期'
            }
        },{
            label: '离职申请日期:',
            key: 'applicationDateEnd',
            value: '',
            type: 'date',
            config: {
                placeholder:'请输入离职申请日期'
            }
        },]
    },
    /*
     * table 配置
     */
    listParam: {
        "pageIndex": 0,
        "pageSize": 0,
        "jobNumber": "",
        "employeeName": "",
        "enterDateStart": "",
        "enterDateEnd": "",
        "applicationDateStart": "",
        "applicationDateEnd": "",
        "departmentCode": "",
        "applicationStatus": "1",
        "rejectStatus": "0"
    },
    tableCfg: {
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'approval',
                text: '审批处理',
            }],
        ],
        serial:true,
        width: [3, 3, 4, 4, 4, 2], //排除序号，多选，单选，操作栏
        match: [
            'jobNumber',
            { key: 'employeeName', href: true },
            'roleName',
            'enterDate',
            'applicationDate',
        ],
        head: ['工号', '姓名', '岗位', '入职日期', '申请辞退日期'],
    },
    lookTableCfg: {
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'edit',
                text: '查看申请',
            }],
        ],
        serial:true,
        width: [3, 3, 4, 4, 4, 2], //排除序号，多选，单选，操作栏
        match: [
            'jobNumber',
            { key: 'employeeName', href: true },
            'roleName',
            'enterDate',
            'applicationDate',
        ],
        head: ['工号', '姓名', '岗位', '入职日期', '申请辞退日期'],
    }
}
