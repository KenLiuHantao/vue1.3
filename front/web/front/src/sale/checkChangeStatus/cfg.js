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
                name: '未审核',
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
                name: '已驳回',
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
                name: '变更中',
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
                name: '已变更',
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
            hasNub: false,
            hasChild: true,
        },
        /* 
         * filter 配置
         */
        filterCfg: []
    },
    /* 
     * table 配置
     */
    tableCfg: {
        // checkbox: [true, 'inventoryId'],
        // operating: [true, { type: 0 }],
        // radio: [true, 'docNo'],
        serial:true,
        width: [5,15], //排除序号，多选，单选，操作栏
        match: [
            { key: 'docNo', href:true },
            'employeeName'
        ],
        head: ['变更申请单号', '业务员'],
        newline: [0],
    },
}
