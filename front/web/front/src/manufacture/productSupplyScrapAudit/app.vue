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
                console.log(item)
                this.docNo = item.docNo;
                if (item.docType === 1) {
                    this.scrapDetailCfg.show = true;
                }
                if (item.docType === 2) {
                    this.supplyDetailCfg.show = true;
                }
            },

            getFilter(item, obj) {
                if (obj && obj.departmentCode) {
                    item.departmentCode = obj.departmentCode;
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
            closeDetail(tips){
                this.supplyDetailCfg.show = false;
                this.scrapDetailCfg.show = false;
                this.refresh(tips)
            },

            refresh(tips){
                if (tips !== undefined && tips !== null) {
                    this.tipsCfg.content = tips;
                    this.tipsCfg.show = true;
                }
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
                let myCfg = cfg.unauditCfg;
                switch (this.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        myCfg = cfg.unauditCfg;
                        break;
                    case 'tab2':
                        myCfg = cfg.auditCfg;
                        break;
                }
                return myCfg;
            },
        }
    }

</script>
<template>
    <warning :config="tipsCfg"></warning>
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
