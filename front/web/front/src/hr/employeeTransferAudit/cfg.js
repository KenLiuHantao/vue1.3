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
        "transferDateStart": "",
        "trnasferDateEnd": "",
        "departmentCode": "",
        "transferStatus": "1",
        "rejectStatus": "0"
    },
    tableCfg: {
        serial:true,
        operating: [true, 'config-operate', [
            {
                type: 0,
                btn: 5,
                text: '审核处理',
            },
        ]],
        width: [3, 3, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            'jobNumber',
            { key: 'empName', href: true },
            'deptName',
            'roleName',
            function (x) {
                if (x.applyType === 0) {
                    return '调岗'
                } else {
                    return '兼岗'
                }
            },
            'transferDate',
        ],
        head: ['工号', '姓名', '部门' ,'岗位', '申请类别', '申请生效日期',],
    },
    lookTableCfg: {
        serial:true,
        operating: [true, 'config-operate', [
            {
                type: 0,
                btn: 5,
                text: '查看详情',
            },
        ]],
        width: [3, 3, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            'jobNumber',
            { key: 'empName', href: true },
            'deptName',
            'roleName',
            function (x) {
                if (x.applyType === 0) {
                    return '调岗'
                } else {
                    return '兼岗'
                }
            },
            'transferDate',
        ],
        head: ['工号', '姓名', '部门' ,'岗位', '申请类别', '申请生效日期',],
    }
}
