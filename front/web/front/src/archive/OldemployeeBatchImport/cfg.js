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
                name: '部门',
                // icon: 'icon-teamwork',
                params: {
                    main: {
                        key: 'departmentName',
                        url: __URL.arc + 'employee/upload/group/department',
                        words: {
                            title: ['departmentName'],
                            right: 'employeeCount'
                        },
                        param: {
                            "departmentName": "",
                            "employeeName": "",
                            "endDate": "",
                            "flag": 0,
                            "jobNumber": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "phone": "",
                            "roleName": "",
                            "startDate": ""
                        },
                    }
                }
            }, {
                id: 'tab2',
                name: '岗位',
                // icon: 'icon-teamwork',
                params: {
                    main: {
                        key: 'roleName',
                        url: __URL.arc + 'employee/upload/group/role',
                        words: {
                            title: ['roleName'],
                            right: 'employeeCount'
                        },
                        param: {
                            "departmentName": "",
                            "employeeName": "",
                            "endDate": "",
                            "flag": 0,
                            "jobNumber": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "phone": "",
                            "roleName": "",
                            "startDate": ""
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
        serial:true,
        checkbox:[true,'idCard'],
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
        width: [3, 3, 2, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            'name',
            'jobNumber',
            'sex',
            'roleName',
            'phone',
            'enterDate',
            function(val){
                if(val.status == 0){
                    return '<span style="color:red">未通过</span>'
                }else if(val.status == 1){
                    return '<span style="color:#61BA5B">已通过</span>'
                }
            }
        ],
        head: ['姓名', '工号', '性别', '岗位', '手机号','入职日期','分析状态'],
    },
    tableCfg2: {
        serial:true,
        checkbox:[true,'idCard'],
        /* 替换了 operating 保证table1 / table2 中的成员都有操作按钮 */
        //operating: [true,'importEmployeeOperate'],
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
        width: [3, 3, 2, 3, 3, 3,3], //排除序号，多选，单选，操作栏
        match: [
            'name',
            'jobNumber',
            'sex',
            'departmentName',
            'phone',
            'enterDate',
            function(val){
                if(val.status == 0){
                    return '<span style="color:red">未通过</span>'
                }else if(val.status == 1){
                    return '<span style="color:#61BA5B">已通过</span>'
                }
            }
        ],
        head: ['姓名', '工号', '性别', '部门', '手机号','入职日期','分析状态'],
    },
    /* 
     * 附件 配置
     */
    upfileCfg:{
        extensions: 'txt, doc, docx, xls, xlsx, ppt, pptx, wps, rtf, pdf, xmind, rp,rar, zip, gz, z, 7z,bmp, gif, jpg, jpeg, pic, png, tif,ai, psd, cdr,svg',
        max:6
    },
}
