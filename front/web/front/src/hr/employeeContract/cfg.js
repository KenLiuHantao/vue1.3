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
            label: '合同开始时间:',
            key: 'beginDateStart',
            value: '',
            type: 'date',
            config:{
                placeholder:'请输入合同开始时间',
                format: 'YYYY-MM-DD',
            } 
        },{
            label: '至:',
            key: 'beginDateEnd',
            value: '',
            type: 'date',
            config: {
                placeholder:'请输入合同开始时间',
                format: 'YYYY-MM-DD',
            } 
        },{
            label: '合同结束时间:',
            key: 'endDateStart',
            value: '',
            type: 'date',
            config: {
                placeholder:'请输入合同结束时间',
                format: 'YYYY-MM-DD',
            } 
        },{
            label: '至:',
            key: 'endDateEnd',
            value: '',
            type: 'date',
            config: {
                placeholder:'请输入合同结束时间',
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
      "endDate": "",
      "jobNumber": "",
      "pageIndex": 0,
      "pageSize": 0,
      "phone": "",
      "roleCode": "",
      "startDate": "",
      "working": "1"
    },
    tableCfg0: {
        // checkbox: [true, 'inventoryId'],
        serial:true,
        operating: [true, 'config-operate', [
            {
                type: 0,
                btn: '续约',
                text: '续约',
            },
        ]],
        // radio: [true, 'docNo'],
        width: [3, 3, 3, 4, 4, 3,3], //排除序号，多选，单选，操作栏
        match: [
            'jobNumber',
            { key: 'name', href: true },
            'employeeFormName',
            'contractPeriodName',
            'beginDate',
            'endDate',
        ],
        head: ['工号', '姓名', '合同类别', '合同期限', '开始日期', '结束日期',],
    },
    tableCfg1: {
        // checkbox: [true, 'inventoryId'],
        serial:true,
        operating: [true, 'config-operate', [
            {
                type: 0,
                btn:'编辑',
                text: '编辑',
            },
        ]],
        // radio: [true, 'docNo'],
        width: [3, 3, 3, 4, 4, 3,3], //排除序号，多选，单选，操作栏
        match: [
            'jobNumber',
            { key: 'name', href: true },
            'employeeFormName',
            'contractPeriodName',
            'beginDate',
            'endDate',
        ],
        head: ['工号', '姓名', '合同类别', '合同期限', '开始日期', '结束日期',],
    },
    tableCfg2: {
        // checkbox: [true, 'inventoryId'],
        serial:true,
        // radio: [true, 'docNo'],
        width: [3, 3, 3, 4, 4, 3,3], //排除序号，多选，单选，操作栏
        match: [
            'jobNumber',
            { key: 'name', href: true },
            'employeeFormName',
            'contractPeriodName',
            'beginDate',
            'endDate',
            ''
        ],
        head: ['工号', '姓名', '合同类别', '合同期限', '开始日期', '结束日期',''],
    },
    /* 
     * 新增人员 配置
     */
    employeeCfg:{
        "departmentCode": "",
        "departmentName": "",
        "email": "",
        "enterDate": "",
        "idCard": "",
        "jobNumber": "",
        "name": "",
        "phone": "",
        "roleCode": "",
        "roleName": "",
        "sex": "",
        "employeeContract": {
            "beginDate": "",//合同开始时间
            "confirmationDate": "",//转正日期
            "contractPeriod": '',//合同期限 写死 0 6个月 1 12个月 2 24个月 3 36个月 4 无期限 5 其它
            "contractStatus": '',//隐藏状态 新增不管
            "createTime": "",//创建时间 不显示
            "creator": "",//创建人 不显示
            "employeeCode": "",//人员编码
            "employeeForm": "",//聘用形式 写死 0 劳动 1 劳务 2 临时 
            "endDate": "", //合同结束时间
            "entCode": "",// 不管
            "files": [ //附件
              // {
              //   "eTag": "string",
              //   "ext": "string",
              //   "fileId": "string",
              //   "fileName": "string",
              //   "fileSize": 0,
              //   "mimeType": "string",
              //   "url": "string"
              // }
            ],
            "id": '', //不管
            "recordId": "", //不管
            "recordStatus": '',  // 不管
            "recordVersion": '', //不管
            "remark": "", //备注
            "updateTime": "",//不管
            "updator": ""//不管
        },
    },
    //人事档案任职履历(不会直接引入，只是看看)
    forchange:{
        "employeeResumes": [
            {
              "createTime": "2017-02-20T05:30:36.578Z",
              "creator": "string",
              "employeeCode": "string",//员工编码
              "entCode": "string",
              "id": 0,
              "recordStatus": 0,
              "recordVersion": 0,
              "remark": "string",//说明
              "resume": 0,//履历状态 0入职 1转正 2调岗 3离职
              "resumeDate": "2017-02-20T05:30:36.578Z",//时间
              "roleCode": "string",//岗位编码
              "roleName": "string",//岗位名称
              "updateTime": "2017-02-20T05:30:36.578Z",
              "updator": "string"
            }
        ]
    }
}
