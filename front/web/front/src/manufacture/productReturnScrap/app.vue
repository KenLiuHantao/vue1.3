<script>

    import cfg from './cfg.js'
    import waitreturn from './waitReturn.vue'
    import alreadyreturn from './alreadyReturn.vue'

    export default {
        components: {
            waitreturn,
            alreadyreturn
        },
        ready() {

        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableData: [],
                docNo: '',
                sourceType: '',
                returnDetailCfg: {
                    show: false,
                    title: "生产退料单",
                },
                alreadyDetailCfg: {
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
                switch (cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        this.sourceType = item.sourceType;
                        this.returnDetailCfg.show = true;
                        break;
                    case 'tab2':
                        this.alreadyDetailCfg.show = true;
                        break;
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
                        }
                    }
                )
            },

            clearTable(uid, obj){
                this.tableData = []
            },

            //关闭详情页面
            closeDetail(tips){
                this.returnDetailCfg.show = false;
                this.alreadyDetailCfg.show = false;
                this.refresh(tips)
            },

            refresh(tips){
                if (tips && tips != null) {
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

    <!-- 待退料详情内页-->
    <inner :config='returnDetailCfg'>
        <waitreturn :doc-no="docNo" :source-type="sourceType" @refresh='closeDetail'></waitreturn>
    </inner>

    <!-- 已退料详情内页-->
    <inner :config='alreadyDetailCfg'>
        <alreadyreturn :doc-no="docNo" @refresh='closeDetail'></alreadyreturn>
    </inner>

</template>
