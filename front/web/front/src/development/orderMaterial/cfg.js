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
                name: '待处理',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.sale + 'salesOrderBom/findWaitOperatorListForWeek',
                        words: {
                            title: ['weekShowName'],
                            // sub: [
                            //     ['二级菜单:', 'weekBeginDate'],
                            //     ['三级菜单:', 'weekEndDate'],
                            // ],
                            right: 'orderQuantity'
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "customerOrderDocNo": "",
                            "docNo": "",
                            "employeeName": "",
                            "endDeliveryDate": "",
                            "endDocDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDeliveryDate": "",
                            "startDocDate": "",
                            "yearMonth": 0,
                            "yearWeek": 0
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesOrderBom/findWaitOperatorListForCustomer',
                        words: {
                            title: ['customerName'],
                            // sub: [
                            //     ['入库数量:', 'sumRecordRows'],
                            //     ['入库价格:', 'sumQcSampleQty']
                            // ],
                            right: 'orderQuantity'
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "customerOrderDocNo": "",
                            "docNo": "",
                            "employeeName": "",
                            "endDeliveryDate": "",
                            "endDocDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDeliveryDate": "",
                            "startDocDate": "",
                            "yearMonth": 0,
                            "yearWeek": 0
                        }
                    }
                }
            },{
                id: 'tab2',
                name: '暂存箱',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.sale + 'salesOrderBom/findTempStorageListForWeek',
                        words: {
                            title: ['weekShowName'],
                            right: 'orderQuantity'
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "customerOrderDocNo": "",
                            "docNo": "",
                            "employeeName": "",
                            "endDeliveryDate": "",
                            "endDocDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDeliveryDate": "",
                            "startDocDate": "",
                            "yearMonth": 0,
                            "yearWeek": 0
                        },
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesOrderBom/findTempStorageListForCustomer',
                        words: {
                            title: ['customerName'],
                            right: 'orderQuantity'
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "customerOrderDocNo": "",
                            "docNo": "",
                            "employeeName": "",
                            "endDeliveryDate": "",
                            "endDocDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDeliveryDate": "",
                            "startDocDate": "",
                            "yearMonth": 0,
                            "yearWeek": 0
                        }
                    }
                }
            },{
                id: 'tab3',
                name: '未审核',
                icon: '',
                params: {
                    main: {
                        key: 'yearWeek',
                        url: __URL.sale + 'salesOrderBom/findUnauditListForWeek',
                        words: {
                            title: ['weekShowName'],
                            // sub: [
                            //     ['二级菜单:', 'weekBeginDate'],
                            //     ['三级菜单:', 'weekEndDate'],
                            // ],
                            // right: 'yearWeek'
                            right: 'orderQuantity'
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "customerOrderDocNo": "",
                            "docNo": "",
                            "employeeName": "",
                            "endDeliveryDate": "",
                            "endDocDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDeliveryDate": "",
                            "startDocDate": "",
                            "yearMonth": 0,
                            "yearWeek": 0
                        }
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesOrderBom/findUnauditListForCustomer',
                        words: {
                            title: ['customerName'],
                            // sub: [
                            //     ['入库数量:', 'sumRecordRows'],
                            //     ['入库价格:', 'sumQcSampleQty']
                            // ]
                            right: 'orderQuantity'
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "customerOrderDocNo": "",
                            "docNo": "",
                            "employeeName": "",
                            "endDeliveryDate": "",
                            "endDocDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDeliveryDate": "",
                            "startDocDate": "",
                            "yearMonth": 0,
                            "yearWeek": 0
                        }
                    }
                }
            },{
                id: 'tab4',
                name: '已审核',
                icon: '',
                params: {
                    main: {
                        key: 'yearMonth',
                        url: __URL.sale + 'salesOrderBom/findDoneAuditListForMonth',
                        words: {
                            title: ['monthShowName'],
                            // sub: [
                            //     ['二级菜单:', 'weekBeginDate'],
                            //     ['三级菜单:', 'weekEndDate'],
                            // ],
                            right: 'orderQuantity'
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "customerOrderDocNo": "",
                            "docNo": "",
                            "employeeName": "",
                            "endDeliveryDate": "",
                            "endDocDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDeliveryDate": "",
                            "startDocDate": "",
                            "yearMonth": 0,
                            "yearWeek": 0
                        }
                    },
                    sub: {
                        key: 'customerCode',
                        url: __URL.sale + 'salesOrderBom/findDoneAuditListForCustomer',
                        words: {
                            title: ['customerName'],
                            // sub: [
                            //     ['入库数量:', 'sumRecordRows'],
                            //     ['入库价格:', 'sumQcSampleQty']
                            // ]
                            right: 'orderQuantity'
                        },
                        param: {
                            "customerCode": "",
                            "customerName": "",
                            "customerOrderDocNo": "",
                            "docNo": "",
                            "employeeName": "",
                            "endDeliveryDate": "",
                            "endDocDate": "",
                            "inventoryCode": "",
                            "inventoryName": "",
                            "inventorySpec": "",
                            "pageIndex": 0,
                            "pageSize": 0,
                            "startDeliveryDate": "",
                            "startDocDate": "",
                            "yearMonth": 0,
                            "yearWeek": 0
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
            placeholder: '请输入业务员名称'
        }, {
            label: '销售单据号:',
            key: 'docNo',
            value: '',
            type: 'text',
            placeholder: '请输入销售单据号'
        }, {
            label: '客户订单号:',
            key: 'customerOrderDocNo',
            value: '',
            type: 'text',
            placeholder: '请输入客户订单号'
        }, {
            label: '货品code:',
            key: 'inventoryCode',
            value: '',
            type: 'text',
            placeholder: '请输入货品code'
        }, {
            label: '货品名称:',
            key: 'inventoryName',
            value: '',
            type: 'text',
            placeholder: '请输入货品名称'
        }, {
            label: '货品规格型号:',
            key: 'inventorySpec',
            value: '',
            type: 'text',
            placeholder: '请输入货品规格型号'
        }, ]
    },
    /* 
     * table 配置
     */
    tableCfg: {
        // checkbox: [true, 'inventoryId'],
        // operating: [true, { type: 0 }],
        // radio: [true, 'docNo'],
        serial:true,
        width: [3, 3, 5, 3, 3, 3], //排除序号，多选，单选，操作栏
        match: [
            { key: 'docNo', href:true },
            'employeeName',
            function(item){
                return item.inventoryCode + '<br/>' + item.inventoryName 
            },
            'quantity', 
            'deliveryDate',
            'remark'
        ],
        head: ['销售单号', '业务员', '货品信息', '数量', '交货日期','备注'],
        newline: [0],
    },
}
