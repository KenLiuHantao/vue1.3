<script>



import cfg from './cfg.js'
import info from './infoAndEdit'

export default {
    components: {
        info
    },
    ready() {
    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            tableData: [],
            orderCfg:{
                show:false,
                title:'销售订单'
            },
            actItem:'',
            alertCfg:{
                show:false,
                header:'跟单备注',
                width:'500px',
                btn:[{
                    name:'取消',
                    emit:'quite'
                },{
                    name:'确定',
                    emit:'sure'
                }]
            },
            remarkList:'',
            remarkContent:'',
        }
    },
    methods: {
        //请求数据
        getList(param,subParam) {
            if(this.leftItemCfg.tabCfg.select == 'week'){
                if(subParam && subParam.customerCode){
                    param.customerCode = subParam.customerCode
                }
            }else{
                if(subParam && subParam.yearWeek){
                    param.yearWeek = subParam.yearWeek
                }
            }
            this.$http.post(__URL.sale + 'salesOrderFollowing/salesNonCompletionOrder/findList',param).then(
                res=>{
                    if(res.data.success){
                        res.data.data.dataList.forEach(item=>{
                            item.feRemark = '备注'
                        })
                        this.tableData = res.data.data.dataList
                    }
                }
            )
        },
        /* 数据请求 */
        openInfo(item,key){
            if(key == "feRemark"){
                this.remarkContent = ''
                this.alertCfg.show = true
                this.actItem = item
                this.getRemarkList(item)
            }else{
                this.actItem = item
                this.orderCfg.show = true
            }
        },
        //表求备注列表
        getRemarkList(item){
            let param ={
                  "docNo": item.docNo,
                  "docRecordId":item.recordId,
                  "pageIndex": 0,
                  "pageSize": 0
                }
            this.$http.post(__URL.doc+'sale/findList',param).then(
                res=>{
                    if(res.data.success){
                        this.remarkList = res.data.data.dataList
                    }
                }
            )
        },
        //添加请求
        sendRemark(){
            let param = {
                  "attachments":'',
                  "content":  this.remarkContent,
                  "docRecordId": this.actItem.recordId,
                  "docNo": this.actItem.docNo,
                }
            this.$http.post(__URL.doc+'sale/addRemark',param).then(
                res=>{
                    if(res.data.success){
                        this.alertCfg.show = false
                    }
                }
            )
        },
        quiteRemark(){
            this.alertCfg.show = false
            this.remarkList = []
        },
        addOrder(){
            this.actItem = ''
            this.orderCfg.show = true
        },
        clearTable(uid,obj){
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
                <new-app :config='leftItemCfg' @tab='clearTable'  @cb='getList'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">

                </div>
                <div class="item_body">
                    <vtable  :config='tableCfg' :data='tableData' @link="openInfo"></vtable>
                </div>
            </div>
        </div>
        <inner :config="orderCfg">
                <info :item="actItem" :config="orderCfg"></info>
        </inner>
        <modal :config="alertCfg" @sure="sendRemark" @quite="quiteRemark">
            <div class="remark-wrap">
                <div class="remark-list">
                    <p v-for="item in remarkList">
                        {{item.createUser}}:{{item.content}}
                    </p>
                </div>
                <textarea class="remark-text" v-model="remarkContent" placeholder="请输入备注"></textarea>
            </div>
        </modal>
    </container>
</template>
<style lang="less" scoped>
    @import '../../../../../public/css/variable.less';
    .remark-wrap{
        padding: 15px;
    }
    .remark-list{
        width: 100%;
        height: 200px;
        overflow: auto;
        margin-bottom: 20px;

        p{
            text-align: left;
            font-size: 12px;
            line-height: 1.2;
            margin-bottom: 10px;
        }
    }
    .remark-text{
        width: 100%;
        height: 108px;
        border: 1px solid @border-color;
    }
</style>
