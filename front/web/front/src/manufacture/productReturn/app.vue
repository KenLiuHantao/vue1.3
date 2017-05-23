<script>

    import cfg from './cfg.js'
    import returnConfirm from './returnConfirm.vue'
    import returnedDetail from './returnedDetail.vue'

    export default {
        components: {
            returnConfirm,
            returnedDetail
        },
        ready() {

        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableData: [],
                docNo: '',
                returnConfirmCfg: {
                    show: false,
                    title: "生产退料单",
                },
                returnedDetailCfg: {
                    show: false,
                    title: "生产退料单",
                },
                tipsCfg: {
                    type: 'success',
                    show: false,
                    content: ''
                },
            }
        },
        methods: {
            /* 公用方法 */
            assign(base, target) {
                let tk = Object.keys(target);

                for (let i in base) {
                    if (tk.indexOf(i) != -1) {
                        target[i] = base[i]
                    }
                }
            },

            href(item) {
                this.docNo = item.docNo;
                if(cfg.leftItemCfg.tabCfg.select == 'tab2'){
                    this.returnedDetailCfg.show=true;
                }else{
                    this.returnConfirmCfg.show = true;
                }
            },

            getFilter(item, obj) {
                if (obj && obj.processCode) {
                    item.processCode = obj.processCode;
                    item.yearWeek = obj.yearWeek;
                }
                this.getList(item)
            },

            /* 数据请求 */
            getList(obj) {
                this.tableData = [];
                this.$http.post(__URL.manufacture + 'production/material/return/orderList', obj).then(
                    (res) => {
                        if (res.data.success) {
                            this.tableData = res.data.data.dataList;
                        } else {
                            this.errTips(res.data.errMsg);
                        }
                    }
                )
            },

            clearTable(uid, obj){
                this.tableData = []
            },

            //关闭详情页面
            closeDetail(){
                this.returnedDetailCfg.show = false;
                this.refresh()
            },

            //关闭操作页面
            closeConfirm(){
                this.returnConfirmCfg.show = false;
                this.refresh()
            },
            refresh(){
                this.$broadcast('_RESETLIST');
            }
        },
        computed: {
            /* 参数获取 */
            tableUrl() {
                return cfg.table.baseParams.url
            },
            tableCfg() {
                this.tableData = [];
                var myCfg = cfg.tableOneCfg;
                switch (cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        myCfg = cfg.tableOneCfg;
                        break;
                    case 'tab2':
                        myCfg = cfg.tableTwoCfg;
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
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">

                </div>
                <div class="item_body">
                    <vtable :config='tableCfg' :data='tableData' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>

    <!-- 退料申请详情内页-->
    <inner :config='returnConfirmCfg'>
        <return-confirm :doc-no="docNo" @refresh='closeConfirm'></return-confirm>
    </inner>

    <!-- 已退料详情内页-->
    <inner :config='returnedDetailCfg'>
        <returned-detail :doc-no="docNo"  @refresh='closeDetail'></returned-detail>
    </inner>

</template>
