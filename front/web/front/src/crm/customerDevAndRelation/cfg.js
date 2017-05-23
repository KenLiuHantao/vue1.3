export default {
    leftItemCfg: {
        headCfg: {
            add: false,
            filter: false
        },
        /* 
         * tab 配置
         */
        tabCfg: {
            select: '',
            tabBarData: [{
                id: 'tab1',
                name: '未合作',
                icon: '',
                params: {
                    main: {
                        key: 'regionCategoryCode',
                        url: __URL.crm + 'customer/regionLocation/list',
                        words: {
                            title: ['regionCategoryName'],
                            right: 'count',
                            sub: []
                        },
                        param: {
                            "customerContact": "",
                            "customerName": "",
                            "customerStatusCode": "BU0230001",
                            "importanceRatingCode": "",
                            "regionCategoryCode": "",
                            "employeeName": "",
                            "phone": "",
                            "keyWord": "",
                            "pageIndex": 0,
                            "pageSize": 0
                        }
                    },
                    sub: {
                        key: 'importanceRatingCode',
                        url: __URL.crm + 'customer/importanceRating/list',
                        words: {
                            title: ['importanceRatingName'],
                            right: 'count',
                            sub: []
                        },
                        param: {
                            "customerContact": "",
                            "customerName": "",
                            "customerStatusCode": "BU0230001",
                            "regionCategoryCode": "",
                            "importanceRatingCode": "",
                            "employeeName": "",
                            "phone": "",
                            "keyWord": "",
                            "pageIndex": 0,
                            "pageSize": 0
                        }
                    }
                }
            }, {
                id: 'tab2',
                name: '合作中',
                icon: '',
                params: {
                    main: {
                        key: 'regionCategoryCode',
                        url: __URL.crm + 'customer/regionLocation/list',
                        words: {
                            title: ['regionCategoryName'],
                            right: 'count',
                            sub: []
                        },
                        param: {
                            "customerContact": "",
                            "customerName": "",
                            "customerStatusCode": "BU0230002",
                            "importanceRatingCode": "",
                            "regionCategoryCode": "",
                            "employeeName": "",
                            "phone": "",
                            "keyWord": "",
                            "pageIndex": 0,
                            "pageSize": 0
                        }
                    },
                    sub: {
                        key: 'importanceRatingCode',
                        url: __URL.crm + 'customer/importanceRating/list',
                        words: {
                            title: ['importanceRatingName'],
                            right: 'count',
                            sub: []
                        },
                        param: {
                            "customerContact": "",
                            "customerName": "",
                            "customerStatusCode": "BU0230002",
                            "regionCategoryCode": "",
                            "importanceRatingCode": "",
                            "employeeName": "",
                            "phone": "",
                            "keyWord": "",
                            "pageIndex": 0,
                            "pageSize": 0
                        }
                    }
                }
            }, {
                id: 'tab3',
                name: '有风险',
                icon: '',
                params: {
                    main: {
                        key: 'regionCategoryCode',
                        url: __URL.crm + 'customer/regionLocation/list',
                        words: {
                            title: ['regionCategoryName'],
                            right: 'count',
                            sub: []
                        },
                        param: {
                            "customerContact": "",
                            "customerName": "",
                            "customerStatusCode": "BU0230003",
                            "importanceRatingCode": "",
                            "regionCategoryCode": "",
                            "employeeName": "",
                            "phone": "",
                            "keyWord": "",
                            "pageIndex": 0,
                            "pageSize": 0
                        }
                    },
                    sub: {
                        key: 'importanceRatingCode',
                        url: __URL.crm + 'customer/importanceRating/list',
                        words: {
                            title: ['importanceRatingName'],
                            right: 'count',
                            sub: []
                        },
                        param: {
                            "customerContact": "",
                            "customerName": "",
                            "customerStatusCode": "BU0230003",
                            "regionCategoryCode": "",
                            "importanceRatingCode": "",
                            "employeeName": "",
                            "phone": "",
                            "keyWord": "",
                            "pageIndex": 0,
                            "pageSize": 0
                        }
                    }
                }
            }, {
                id: 'tab4',
                name: '已终止',
                icon: '',
                params: {
                    main: {
                        key: 'regionCategoryCode',
                        url: __URL.crm + 'customer/regionLocation/list',
                        words: {
                            title: ['regionCategoryName'],
                            right: 'count',
                            sub: []
                        },
                        param: {
                            "customerContact": "",
                            "customerName": "",
                            "customerStatusCode": "BU0230004",
                            "importanceRatingCode": "",
                            "regionCategoryCode": "",
                            "employeeName": "",
                            "phone": "",
                            "keyWord": "",
                            "pageIndex": 0,
                            "pageSize": 0
                        }
                    },
                    sub: {
                        key: 'importanceRatingCode',
                        url: __URL.crm + 'customer/importanceRating/list',
                        words: {
                            title: ['importanceRatingName'],
                            right: 'count',
                            sub: []
                        },
                        param: {
                            "customerContact": "",
                            "customerName": "",
                            "customerStatusCode": "BU0230004",
                            "regionCategoryCode": "",
                            "importanceRatingCode": "",
                            "employeeName": "",
                            "phone": "",
                            "keyWord": "",
                            "pageIndex": 0,
                            "pageSize": 0
                        }
                    }
                }
            }]
        },
        /* 
         * list 配置
         */
        listCfg: {
            hasNub: false,
            hasChild: true,
        },
        /* 
         * filter 配置
         */
        filterCfg: [{
            label: '客户名称:',
            key: 'customerName',
            value: '',
            type: 'text',
            placeholder: '请输入客户名称'
        }, {
            label: '业务员:',
            key: 'employeeName',
            value: '',
            type: 'text',
            placeholder: '请输入业务员'
        }, {
            label: '联系人:',
            key: 'customerContact',
            value: '',
            type: 'text',
            placeholder: '请输入联系人'
        }, {
            label: '联系电话:',
            key: 'phone',
            value: '',
            type: 'text',
            placeholder: '请输入联系电话'
        },]
    },
    /* 
     * table 配置
     */
    /*tableCfg: {
        serial: true,
        width: [3, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            {key: 'customerName', href: true},
            'establishmentDate',
            'industryName',
            'createTime',
            'updateTime'
        ],
        head: ['客户名称', '成立时间', '行业分类', '建档时间', '档案更新时间'],
    },*/
    tableCfg1: {
        serial: true,
        width: [3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            {key: 'customerName', href: true},
            'establishmentDate',
            'industryName',
            'updateTime',
            function (val) {
                return val.recordStatus == '0' ? `<span style="color: #757575">已停用</span>` : '';
            }
        ],
        head: ['客户名称', '成立时间', '行业分类', '档案更新时间', '状态'],
    },
    tableCfg2: {
        serial: true,
        width: [3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            {key: 'customerName', href: true},
            'establishmentDate',
            'industryName',
            'createTime',
            function (val) {
                return val.recordStatus == '0' ? `<span style="color: #757575">已停用</span>` : '';
            }
        ],
        head: ['客户名称', '成立时间', '行业分类', '建档时间', '状态'],
    },

    /* 
     * 新增客户档案 配置
     */
    customerCfg: {
        "addresses": [/*{
            "addressCode": "",
            "address": "",
            "customerCode": "",
            "isDefault": "on"
        }*/
        ],
        // "address": "",//地址 没了
        "attachments": [//附件
            // {
            //   "downloadUrl": "",//附件地址
            //   "fileId": "",//附件id
            //   "fileName": ""//附件名字
            // }
            // {
            //   eTag:'',
            //   ext:'',
            //   fileId:'',
            //   fileName:'',
            //   fileSize:'',
            //   mimeType:'',
            //   url:''
            // }
        ],
        // "code": "",//不管
        "contacts": [
            /*{
                "contactCode": "",
                "contactName": "",
                "duty": "",
                "address": "",
                "phone": "",
                "email": "",
                "businessLiaisonCode": "",
                "businessLiaisonName": "",
                "remark": "",
                "customerCode": "",
            }*/
        ],//联系人
        // "currencyList": [//货币列表 没了
        // {
        // "code": "",//币种code  必填
        // "createTime": "",//不管x
        // "creator": "",//不管
        // "entCode": "",//不管
        // "id": 0,//不管
        // "name": "",//名称 必填
        // "recordId": "",// 不管
        // "recordStatus": 0,//不管
        // "recordVersion": 0,//不管
        // "symbol": "",//不管
        // "updateTime": "",//不管
        // "updator": ""//不管
        // }
        // ],
        // "currencyStr": "",//所有币种用／连起来的字符串 没了
        "customerName": "",
        "currencyCode": "",
        "currencyName": "",
        "regionCategoryCode": "",
        "regionCategoryName": "",
        "regionLocationCode": "",
        "regionLocationName": "",
        "majorIndustryCode":"",
        "majorIndustryName":"",
        "industryCode": "",
        "industryName": "",
        "employeeCode": "",// 跟单员 code
        "employeeName": "",//跟单员 名称
        "paymentCode": "",
        "paymentName": "",
        "recAgreementCode": "",
        "recAgreementName": "",
        "dispatchModelCode": "",
        "dispatchModelName": "",
        "transportCode": "",
        "transportName": "",
        "customerDeclaration": "",
        "remark": "",//备注
        "importanceRatingCode": "BU0220003",
        "importanceRatingName": "",
        "creditRatingCode": "BU0240002",
        "creditRatingName": "",
        "customerStatusCode": "",
        "customerStatusName": "",
        "cooperativeStateAssessment": "",
        "establishmentDate": "",
        "registeredCapital": "",
        "corporateRepresentative": "",
    },
    /* 
     * 附件 配置
     */
    upfileCfg: {
        extensions: 'txt, doc, docx, xls, xlsx, ppt, pptx, wps, rtf, pdf, xmind, rp,rar, zip, gz, z, 7z,bmp, gif, jpg, jpeg, pic, png, tif,ai, psd, cdr,svg',
        max: 6
    },
}
