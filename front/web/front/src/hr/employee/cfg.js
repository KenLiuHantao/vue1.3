export default {
    leftItemCfg: {
        headCfg: {
            add: true,
            filter: false
        },
        /* 
         * tab 配置
         */
        tabCfg: {
            select: '',
            tabBarData: [{
                id: 'tab1',
                name: '在职',
                icon: '',
                params: {
                    main: {
                        key: 'departmentCode',
                        url: __URL.hr + 'employee/find/department/list',
                        words: {
                            title: [ 'departmentName'],
                            // sub: [
                            //     ['二级菜单:', 'weekBeginDate'],
                            //     ['三级菜单:', 'weekEndDate'],
                            // ]
                            right:'employeeSumQty'
                        },
                        param: {
                            "departmentCode": '',
                            "departmentName":'',
                            "employeeName": '',
                            "endDate": '',
                            "jobNumber": '',
                            "pageIndex": 0,
                            "pageSize": 0,
                            "phone": '',
                            "roleName": '',
                            "startDate": '',
                            "working": 1
                        }

                    },
                    sub: {
                        key: 'departmentCode',
                        url: __URL.hr + 'employee/find/department/list/by/depcode',
                        words: {
                            title: ['departmentName'],
                        },
                        param: {
                            "departmentCode": '',
                            "departmentName":'',
                            "employeeName": '',
                            "endDate": '',
                            "jobNumber": '',
                            "pageIndex": 0,
                            "pageSize": 0,
                            "phone": '',
                            "roleName": '',
                            "startDate": '',
                            "working": 1
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '离职',
                icon: '',
                params: {
                    main: {
                        key: 'code',
                        url: __URL.hr + 'employee/find/department/list',
                        words: {
                            title: ['departmentName'],
                            // sub: [
                            //     ['二级菜单:', 'weekBeginDate'],
                            //     ['三级菜单:', 'weekEndDate'],
                            // ]
                        },param:{
                            "departmentCode": '',
                            "departmentName":'',
                            "employeeName": '',
                            "endDate": '',
                            "jobNumber": '',
                            "pageIndex": 0,
                            "pageSize": 0,
                            "phone": '',
                            "roleName": '',
                            "startDate": '',
                            "working": 0
                        },
                    },
                    sub: {
                        key: 'code',
                        url: __URL.hr + 'employee/find/department/list/by/depcode',
                        words: {
                            title: ['departmentName']
                        },
                        param: {
                            "departmentCode": '',
                            "departmentName":'',
                            "employeeName": '',
                            "endDate": '',
                            "jobNumber": '',
                            "pageIndex": 0,
                            "pageSize": 0,
                            "phone": '',
                            "roleName": '',
                            "startDate": '',
                            "working": 0
                        }
                    }
                }
            }]
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
            label: '手机号:',
            key: 'phone',
            value: '',
            type: 'text',
            placeholder: '请输入手机号'
        }, {
            label: '部门:',
            key: 'departmentName',
            value: '',
            type: 'search',
            emit: 'department',
            placeholder: '请选择部门'
        }, {
            label: '岗位:',
            key: 'roleName',
            value: '',
            type: 'select',
            option:[]
        }, {
            label: '入职时间开始:',
            key: 'startDate',
            value: '',
            type: 'date',
            config:{
                placeholder:'请输入入职时间(开始)',
                format: 'YYYY-MM-DD',
            } 
        },{
            label: '入职时间结束:',
            key: 'endDate',
            value: '',
            type: 'date',
            config: {
                placeholder:'请输入入职时间(结束)',
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
    tableCfg: {
        // checkbox: [true, 'inventoryId'],
        // operating: [true, 'default',{ type: 0 }],
        serial:true,
        // radio: [true, 'docNo'],
        width: [3, 3, 4, 4, 3,3], //排除序号，多选，单选，操作栏
        match: [
            'jobNumber',
            { key: 'name', href: true },
            'roleName','phone','enterDate',
            function(item){
                let text = ''
                if(item.accountStatus == 0){
                    text = '<span class="state-wait">未启用</span>'
                }else if(item.accountStatus == 1){
                    text = '<span class="state-done">已启用</span>'
                }else if(item.accountStatus == -1){
                    text = '<span class="state-stop">已停用</span>'
                }
                return text
            }
        ],
        head: ['工号', '姓名', '岗位', '手机号', '入职时间','账号状态'],
    },
    /* 
     * 新增人员 配置
     */
    employeeCfg:{
        "departmentCode": "",
        "departmentName": "",
        "email": "",
        "enterDate": "",
        "confirmationDate": "",//转正日期
        "idCard": "",
        "jobNumber": "",
        "name": "",
        "phone": "",
        "roleCode": "",
        "roleName": "",
        "sex": "",
        "officeForm":1, //聘用形式 0非正式 1正式
        "employeeContract": {
            "beginDate": "",//合同开始时间
            "contractPeriod": '',//合同期限 写死 0 6个月 1 12个月 2 24个月 3 36个月 4 无期限 5 其它
            "contractStatus": '',//隐藏状态 新增不管
            "createTime": "",//创建时间 不显示
            "creator": "",//创建人 不显示
            "employeeCode": "",//人员编码
            "employeeForm": "",//合同类别 写死 0 劳动 1 劳务 2 临时
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
