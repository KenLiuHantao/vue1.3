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
    pendingTableCfg: {
        serial: true,
        operating: [true, 'config-operate', [
            {
                type: 0,
                btn: 'audit',
                text: '审核处理',
            },
        ]],
        width: [2, 3, 3, 4, 4, 3], //排除序号，多选，单选，操作栏
        match: [
            'jobNumber',
            {key: 'name', href: true},
            'enterDate',
            'leaveDate',
            'leaveTypeName',
        ],
        head: ['工号', '姓名', '入职日期', '离职日期', '离职类型',],
    },
    rejectTableCfg:{
        serial:true,
        operating: [true, 'config-operate', [
            {
                type: 0,
                btn: 'look',
                text: '查看详情',
            },
        ]],
        width:[2, 3, 3, 4, 3],
        match: [
            'jobNumber',
            {key: 'name', href: true},
            'enterDate',
            'leaveDate',
        ],
        head: ['工号', '姓名', '入职日期', '离职日期', ],
    },
    processedTableCfg: {
        operating: [true, 'config-operate', [
            {
                type: 0,
                btn: 'look',
                text: '查看详情',
            },
        ]],
        serial: true,
        width: [2, 3, 3, 4, 4, 3], //排除序号，多选，单选，操作栏
        match: [
            'jobNumber',
            {key: 'name', href: true},
            'enterDate',
            'leaveTypeName',
            'leaveDate',
        ],
        head: ['工号', '姓名', '入职日期', '离职类型', '离职日期',],
    },
    /* 
     * 离职登记 配置
     */
    employeeLeaveCfg: {
        "employeeCode": "",
        "employeeName": "",
        "leaveDate": "",
        "leaveReason": "",
        "leaveType": 0,
        "leaveTypeName": "",
        "recordId": "",
        "recordVersion": 1,
        "files": [],
        "auditReason": ""
    },
    fileCfg: {
        extensions: 'txt, doc, docx, xls, xlsx, ppt, pptx, wps, rtf, pdf, xmind, rp,rar, zip, gz, z, 7z,bmp, gif, jpg, jpeg, pic, png, tif,ai, psd, cdr,svg',
    }
}
