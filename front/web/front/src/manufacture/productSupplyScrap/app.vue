<script>

    import cfg from './cfg.js'
    import supply from './supply.vue'
    import scrap from './scrap.vue'

    export default {
        components: {
            supply,
            scrap
        },
        ready() {

        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableData: [],
                docNo: '',
                supplyDetailCfg: {
                    show: false,
                    title: "补料申请单",
                },
                scrapDetailCfg: {
                    show: false,
                    title: "报废申请单",
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
                if (item.docType === 1) {
                    this.scrapDetailCfg.show = true;
                }
                if (item.docType === 2) {
                    this.supplyDetailCfg.show = true;
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
                this.$http.post(__URL.manufacture + 'production/material/list', obj).then(
                    (res) => {
                        if (res.data.success) {
                            this.tableData = res.data.data.dataList;
                        }
                    }
                )
            },

            clearTable(uid, obj){
                this.tableData = []
            },

            //关闭详情页面
            closeDetail(){
                this.supplyDetailCfg.show = false;
                this.scrapDetailCfg.show = false;
                this.refresh()
            },

            refresh(){
                this.$broadcast('_RESETLIST');
            },

        },
        computed: {
            /* 参数获取 */
            tableUrl() {
                return cfg.table.baseParams.url
            },
            tableCfg() {
                this.tableData = [];
                return cfg.tableCfg;
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

    <!-- 补料申请详情内页-->
    <inner :config='supplyDetailCfg'>
        <supply :doc-no="docNo" @refresh='closeDetail'></supply>
    </inner>

    <!-- 报废申请详情内页-->
    <inner :config='scrapDetailCfg'>
        <scrap :doc-no="docNo" @refresh='closeDetail'></scrap>
    </inner>

</template>
