<script>
    import cfg from './cfg.js'

    export default {
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableData: [],
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

            getFilter(item, obj) {
                console.log(item,obj)
                if (obj && obj.code) {
                    item.code = obj.code;
                }
                switch (cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        this.getList(item)
                        break;
                    case 'tab2':
                        this.getInventory(item)
                        break;
                    case 'tab3':
                        this.getList(item)
                        break;
                }
            },
            /* 数据请求 */
            getList(obj) {
                this.$http.post(__URL.crm + 'customer/attribute/category/list', obj).then(
                    (res) => {
                        this.tableData = res.data.data.dataList
                    }
                )
            },

            getInventory(obj) {
                this.$http.post(__URL.crm + 'customer/attribute/industry/list', obj).then(
                    (res) => {
                        this.tableData = res.data.data.dataList
                    }
                )
            },

            clearTable(uid, obj){
                this.tableData = []
            }
        },

        computed: {
            tableCfg() {
                return cfg.tableCfg
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
                    <vtable :config='tableCfg' :data='tableData'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>
</template>
