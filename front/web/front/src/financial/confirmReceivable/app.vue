<script>


    import detail from './confirmRecDetail'
    import cfg from './cfg.js'
    import viewDispatch from 'sale/dispatchStatusAudit/dispatchDocDetail'
    import viewDispatchReturn from 'sale/salesReturn/returnDocDetail'

    export default {
        components: {
            detail,
            viewDispatch,
            viewDispatchReturn
        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableData: [],
                recConfig: {
                    show: false,
                    title: '应收款确认单'
                },
                docNo: '',
                status: 0,
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                }, viewDispatchConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '发货单'
                }, viewDispatchReturnConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '退货单'
                },
            }
        },
        methods: {
            /* 公用方法 */
            assign(base, target) {
                let tk = Object.keys(target)

                for (let i in base) {
                    if (tk.indexOf(i) != -1) {
                        target[i] = base[i]
                    }
                }
            },
            /* 重置对象 */
            initListObj(obj) {
                let init = {}
                return init
            },

            operate(type, item) {
                this.docNo = item.docNo
                this.recConfig.show = true
            },
            closeDetail(){
                //刷新页面
                this.tableData = []
                this.$broadcast('_RESETLIST')
                this.recConfig.show = false
            },

            getFilter(item, obj) {
                if (obj && obj.yearWeek != undefined) {
                    item.yearWeek = obj.yearWeek;
                }
                if (obj && obj.customerCode != undefined) {
                    item.customerCode = obj.customerCode;
                }
                this.getList(item)
            },
            /* 数据请求 */
            getList(obj) {
                if (this.status == 0) {
                    this.$http.post(__URL.financial + 'confirm/receivable/wait/list', obj).then(
                        (res) => {
                            this.tableData = res.data.data.dataList
                        })
                } else {
                    this.$http.post(__URL.financial + 'confirm/receivable/confirm/list', obj).then(
                        (res) => {
                            this.tableData = res.data.data.dataList
                        })
                }

            },
            href(item, type) {
                if (type == 'docNo' && item.dispatch) {
                    this.docNo = item.docNo;
                    this.viewDispatchConfig.show = true;
                } else if (type == "docNo" && !item.dispatch) {
                    this.docNo = item.docNo;
                    this.viewDispatchReturnConfig.show = true;
                }
            },
            clearTable(uid, obj){
                this.tableData = []
            }
        },

        computed: {
            tableCfg() {
                this.tableData = [];
                var myCfg = cfg.waitTableCfg;
                switch (cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        myCfg = cfg.waitTableCfg;
                        this.status = 0
                        break;
                    case 'tab2':
                        myCfg = cfg.confirmTableCfg;
                        this.status = 1
                        break;
                }
                return myCfg;
            },
        }
    }
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @add='addNew'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                </div>
                <div class="item_body">
                    <vtable :config='tableCfg' :data='tableData' @op='operate' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>
    <inner :config='recConfig'>
        <detail :show="recConfig.show" :doc-no="docNo" :status="status" @refresh='closeDetail'></detail>
    </inner>

    <!-- 查看发货单内页-->
    <inner :config='viewDispatchConfig'>
        <view-dispatch :docno.sync="docNo" :show.sync="viewDispatchConfig.show"></view-dispatch>
    </inner>

    <!-- 查看退货单内页-->
    <inner :config='viewDispatchReturnConfig'>
        <view-dispatch-return :docno.sync="docNo" :show.sync="viewDispatchReturnConfig.show"></view-dispatch-return>
    </inner>

    <warning :config="wCfg"></warning>
</template>
