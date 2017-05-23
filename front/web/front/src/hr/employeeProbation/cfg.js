export default {
    leftItemCfg: {
        headCfg: {
            add: false,
            filter: false
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
            label: '手机号:',
            key: 'phone',
            value: '',
            type: 'text',
            placeholder: '请输入手机号'
        }, {
            label: '开始时间:',
            key: 'startDate',
            value: '',
            type: 'date',
            config: {
                placeholder: '请输入开始时间(入职)',
                format: 'YYYY-MM-DD',
            }
        }, {
            label: '结束时间:',
            key: 'endDate',
            value: '',
            type: 'date',
            config: {
                placeholder: '请输入结束时间(入职)',
                format: 'YYYY-MM-DD',
            }
        },]
    },
    /* 
     * table 配置
     */
    listParam: {
        "departmentCode": "",
        "employeeName": "",
        "jobNumber": "",
        "phone": "",
        "startDate": "",
        "endDate": "",
        "pageIndex": 0,
        "pageSize": 0,
        "type": 0
    },
    probationTableCfg: {
        operating: [true, 'config-operate', [{type: 0, btn: 0, text: '转正'}, {type: 0, btn: 1, text: '试用终止'}]],
        serial: true,
        width: [3, 3, 3, 4, 4, 4], //排除序号，多选，单选，操作栏
        match: [
            'jobNumber',
            {key: 'name', href: true},
            'roleName',
            'phone',
            'enterDate',
            'confirmationDate'
        ],
        head: ['工号', '姓名', '岗位', '手机号', '入职日期', '转正日期']
    },
    alreadyTableCfg: {
        serial: true,
        width: [3, 3, 3, 4, 4, 4], //排除序号，多选，单选，操作栏
        match: [
            'jobNumber',
            {key: 'name', href: true},
            'roleName',
            'phone',
            'enterDate',
            'confirmationDate'
        ],
        head: ['工号', '姓名', '岗位', '手机号', '入职日期', '转正日期']
    },
    employeeProbationCfg: {
        "confirmationDate": "",
        "employeeCode": "",
        "enterDate": "",
        "recordVersion": 0,
        "remark": ""
    }
}
