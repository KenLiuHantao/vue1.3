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
                name: '业务员',
                icon: '',
                params: {
                    main: {
                        key: 'employeeCode',
                        url: __URL.arc + 'customer/employee',
                        words: {
                            title: ['employeeName']
                        },
                        param: {
                            "customerContact": "",
                            "customerName": "",
                            "employeeName": "",
                            "keyWord": "",
                            "pageIndex": 0,
                            "pageSize": 0
                        },
                    }
                }
            }, {
                id: 'tab2',
                name: '客户分类',
                icon: '',
                params: {
                    main: {
                        key: 'customerCategoryCode',
                        url: __URL.arc + 'customer/category',
                        words: {
                            title: ['customerCategoryName']
                        },
                        param: {
                            'customerCategoryCode':'',
                            "customerContact": "",
                            "customerName": "",
                            "employeeName": "",
                            "keyWord": "",
                            "pageIndex": 0,
                            "pageSize": 0
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
            label: '客户名称:',
            key: 'customerName',
            value: '',
            type: 'text',
            placeholder: '请输入客户名称'
        },{
            label: '客户分类:',
            key: 'customerCategoryName',
            value: '',
            type: 'text',
            placeholder: '请输入客户分类'
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
        }, ]
    },
    /* 
     * table 配置
     */
    tableCfg: {
        // checkbox: [true, 'inventoryId'],
        // operating: [true, { type: 0 }],
        // radio: [true, 'docNo'],
        //checkbox:[true,'customerCode'],
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
        serial:true,
        width: [3, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            { key:'customerName',href:true},
            'employeeName',
            'contact',
            'duty',
            'phone'
        ],
        head: ['名称', '业务员', '联系人', '职务', '联系电话'],
    },

    /* 
     * 新增客户档案 配置
     */
    customerCfg:{
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
            // {
                // "address": "string",
                // "contactCode": "string",
                // "contactName": "string",
                // "duty": "string",
                // "email": "string",
                // "major": true,
                // "phone": "string",
                // "recordVersion": 0
            // }
        ],//联系人
        // "currencyList": [//货币列表 没了
          // {
            // "code": "",//币种code  必填
            // "createTime": "",//不管
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
        "customerCategoryCode": "",//客户分类code  必填
        // "customerCategoryId": "",//客户分类id 必填 没了
        "customerCategoryName": "",//客户分类名称 必填
        // "customerId": "",//新增不管 修改必填 没了
        "currencyCode": "",//默认币种 code必填
        "currencyName": "",//默认币种名称 必填
        // "email": "",//邮件 没了
        "employeeCode": "",// 跟单员 code 必填
        "employeeName": "",//跟单员 名称 必填
        "entCode": "",//不管
        "customerName": "",//客户名称 必填
        // "phone": "",//电话 没了
        // "recordVersion": 0,
        // "regionCode": "",//地区末级code
        // "regionName": "",//地区不管
        "remark": "",//备注
        "taxRate": "",//增值税率
        // "ucloudFileIds": "",//附件id ,连接
        "recAgreementCode": "",//收款协议code
        "recAgreementName": "",//收款协议name
        "paymentCode": "",//结算方式code
        "paymentName": "",//结算方式name
        "industryCode":"",//行业分类code
        "industryName":"",//行业分类name
        "dispatchModelCode":"",//交货方式code
        "dispatchModelName":""//交货方式name
    },
    /* 
     * 附件 配置
     */
    upfileCfg:{
        extensions: 'txt, doc, docx, xls, xlsx, ppt, pptx, wps, rtf, pdf, xmind, rp,rar, zip, gz, z, 7z,bmp, gif, jpg, jpeg, pic, png, tif,ai, psd, cdr,svg',
        max:6
    },
}
