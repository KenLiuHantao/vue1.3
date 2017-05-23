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
        width: [3, 3, 3, 3, 3, 3, 2], //排除序号，多选，单选，操作栏
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
            { key: '编辑', href: true, func (x) {
                if (x.applyType === 0) {
                    return `<button class="button-primary">调岗</button>`
                } else {
                    return `<button class="button-primary">兼岗</button>`
                }
            }},
        ],
        head: ['工号', '姓名', '部门' ,'岗位', '申请类别', '申请生效日期', '操作'],
    },
    lookTableCfg: {
        serial:true,
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
        head: ['工号', '姓名', '部门' ,'岗位', '申请类别', '申请生效日期']
    }
}
