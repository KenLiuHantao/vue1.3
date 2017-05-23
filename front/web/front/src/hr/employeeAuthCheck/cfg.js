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
        // checkbox: [true, 'inventoryId'],
        // operating: [true, 'default',{ type: 0 }],
        serial:true,
        // radio: [true, 'docNo'],
        width: [4, 4, 4, 4, 4], //排除序号，多选，单选，操作栏
        match: [
            'jobNumber',
            { key: 'employeeName', href: true },
            'postDeptName',
            function (x) {
                if (x.postRoleName) return x.postRoleName
                if (x.viceRoleName) return x.viceRoleName
            },
            'createTime',
        ],
        head: ['工号', '姓名', '部门' ,'岗位', '发起时间'],
    },
    lookTableCfg: {
        // checkbox: [true, 'inventoryId'],
        // operating: [true, 'default',{ type: 0 }],
        serial:true,
        // radio: [true, 'docNo'],
        width: [5,5,5,5], //排除序号，多选，单选，操作栏
        match: [
            'jobNumber',
            { key: 'name', href: true },
            'departmentName',
            'roleName',
        ],
        head: ['工号', '姓名', '部门' ,'岗位']
    }
}
