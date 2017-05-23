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
                name: '待正式导入',
                params: {
                    main: {
                        key: 'departmentName',
                        url: __URL.osiu + 'import/init/process/dept',
                        words: {
                            title: ['departmentName'],
                            right: 'count'
                        },
                        param: {
                            "departmentName": "",
                            "entCode": "",
                            "departmentCode": "",
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
                        key: 'departmentName',
                        url: __URL.osiu + 'import/init/process/dept',
                        words: {
                            title: ['departmentName'],
                            right: 'count'
                        },
                        param: {
                            "departmentCode": "",
                            "departmentName": "",
                            "entCode": "",
                            "tabIndex": 1,
                            "pageIndex": 1,
                            "pageSize": 50,
                        },
                    }
                }
            }, {
                id: 'tab3',
                name: '已导入',
                params: {
                    main: {
                        key: 'departmentCode',
                        url: __URL.osiu + 'import/init/process/dept',
                        words: {
                            title: ['departmentName'],
                            right: 'count'
                        },
                        param: {
                            "departmentName": "",
                            "entCode": "",
                            "departmentCode": "",
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
            hasNub: false,
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
        serial:true,
        checkbox:[true,'id'],
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'edit',
                text: '编辑'
            }, {
                type: 'danger',
                btn: 'delete',
                text: '删除'
            }]
        ],
        statusControl:[true,{
            'test': function (val) {
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
        width: [2,10], //排除序号，多选，单选，操作栏
        match: [
            'processName',
            'departmentName',
        ],
        head: ['工序名称', '生产班组', ],
    },
    tableCfg2: {
        serial:true,
        operating: [true, 'config-operate',
            [{
                type: 'blue',
                btn: 'edit',
                text: '编辑'
            }]
        ],
        statusControl:[true,{
            'test': function (val) {
                return true
            },
            'title':'分析状态',
            'success':'已导入',
            'successStyle':{color:"#61BA5B"},
            'fail':'未导入',
            'failStyle':{color:"red"}
        }],
        width: [2,10], //排除序号，多选，单选，操作栏
        match: [
            'processName',
            'departmentName',
        ],
        head: ['工序名称', '生产班组', ],
    },
    /* 
     * 附件 配置
     */
    upfileCfg:{
        extensions: 'txt, doc, docx, xls, xlsx, ppt, pptx, wps, rtf, pdf, xmind, rp,rar, zip, gz, z, 7z,bmp, gif, jpg, jpeg, pic, png, tif,ai, psd, cdr,svg',
        max:6
    },
}
