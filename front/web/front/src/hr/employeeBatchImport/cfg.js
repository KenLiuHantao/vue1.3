export default {
    leftItemCfg: {
        headCfg: {
            add: [true, '上传草稿'],
            filter: false
        },
        /* 
         * tab 配置
         */
        tabCfg: {
            select: '',
            tabBarData: [{
                id: 'tab1',
                name: '草稿箱',
                params: {
                    main: {
                        key: 'departmentCode',
                        url: __URL.osiu + 'import/employee/department',
                        words: {
                            title: ['departmentName'],
                            right: 'count'
                        },
                        param: {
                            "departmentCode":"",
                            "departmentName": "",
                            "tabIndex": 0,
                            "pageIndex": 1,
                            "pageSize": 50,
                        },
                    }
                }
            }, {
                id: 'tab2',
                name: '有异常',
                params: {
                    main: {
                        key: 'departmentCode',
                        url: __URL.osiu + 'import/employee/department',
                        words: {
                            title: ['departmentName'],
                            right: 'count'
                        },
                        param: {
                            "departmentCode":"",
                            "departmentName": "",
                            "tabIndex": 1,
                            "pageIndex": 1,
                            "pageSize": 50,
                        },
                    }
                }
            }, {
                id: 'tab3',
                name: '已核准',
                params: {
                    main: {
                        key: 'departmentCode',
                        url: __URL.osiu + 'import/employee/department',
                        words: {
                            title: ['departmentName'],
                            right: 'count'
                        },
                        param: {
                            "departmentCode":"",
                            "departmentName": "",
                            "tabIndex": 2,
                            "pageIndex": 1,
                            "pageSize": 50,
                        },
                    }
                }
            }]
        },
        /* 
         * list 配置
         */
        listCfg: {
            hasNub: true,
            hasChild: false,
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
            placeholder: '请输入姓名'
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
            type: 'select',
            option: []
        }, {
            label: '岗位:',
            key: 'roleName',
            value: '',
            type: 'select',
            option:[]
        }, {
            label: '入职日期:',
            key: 'startDate',
            value: '',
            type: 'date',
            config:{
                placeholder:'请输入入职时间起止',
                format: 'YYYY-MM-DD',
            }
        }, {
            label: '至',
            key: 'endDate',
            value: '',
            type: 'date',
            config:{
                placeholder:'请输入入职时间起止',
                format: 'YYYY-MM-DD',
            }
        }, ]
    },
    /* 
     * table 配置
     */
    tableCfg1: {
        statusControl:[true,{
            'test': function(val) {
                if (val.status === 0) {
                    return false
                } else if (val.status === 1) {
                    return true
                }
            },
            'title':'分析状态',
            'success':'正常',
            'successStyle':{color:"#61BA5B"},
            'fail':'异常',
            'failStyle':{color:"red"}
        }],
        checkbox:[true,'id'],
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'edit',
                text: '查看详情'
            }]
        ],
        width: [3, 3, 2, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            'jobNumber',
            'employeeName',
            'sex',
            'roleName',
            'phone',
            'enterDate'
        ],
        head: ['工号', '姓名', '性别', '岗位', '手机号','入职日期'],
    },
    tableCfg2: {
        serial:true,
        statusControl:[true,{
            'test': function (val) {
                if (val.authStatus === 0) {
                    return false
                } else if (val.authStatus === 1) {
                    return true
                }
            },
            'title':'分析状态',
            'success':'已授权',
            'successStyle':{color:"#61BA5B"},
            'fail':'待授权',
            'failStyle':{color:"red"}
        }],
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'edit',
                text: '查看详情'
            }]
        ],
        width: [3, 3, 2, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            'jobNumber',
            'employeeName',
            'sex',
            'roleName',
            'phone',
            'enterDate'
        ],
        head: ['工号', '姓名', '性别', '岗位', '手机号','入职日期'],
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
    /* 
     * 附件 配置
     */
    upfileCfg:{
        extensions: 'txt, doc, docx, xls, xlsx, ppt, pptx, wps, rtf, pdf, xmind, rp,rar, zip, gz, z, 7z,bmp, gif, jpg, jpeg, pic, png, tif,ai, psd, cdr,svg',
        max:6
    },
}
