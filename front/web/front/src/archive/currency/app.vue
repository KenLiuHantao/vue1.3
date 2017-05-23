<script>
import cfg from './cfg.js'
export default {
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            checkboxArray: [],
            currencyConfig:{
                show: false,
                width: '700px',
                height: '500px',
                header: '币种设置',
                btn: [{
                    name: '关闭',
                    emit: 'codeclose'
                }, {
                    name: '确认',
                    emit: 'codesure'
                }]
            },
            //提示消息
            msgCfg: {
                show: false,
                type: 'success',
                content: '提示消息'
            },
            exchangeRateConfig:{
                show: false,
                width: '320px',
                height: 'auto',
                header: '汇率维护',
                btn: [{
                    name: '取消',
                    emit: 'close',
                }, {
                    name: '确定',
                    emit: 'sure',
                }]
            },
            exchangeRateData:{
                accYear:"",
                accMonth:"",
                rate:"",
                startDate:"",
                endDate:"",
                currencyCode:"",
                recordVersion:""
            },
            checkedCurrency:[],
            tableData: [],
            yearList:[],
            operate:"",
            accYear:"",
            currencyCode:"",
        }
    },
    ready(){
        this.$http.post(__URL.arc + 'accountingPeriod/year').then(
            (res) => {
                this.yearList = res.data.data
                this.accYear=this.yearList[0]
            }
        )
    },
    methods: {
        /* 重置对象 */
        initListObj(obj) {
            let init = {
                "currencyCode": "",
                "accYear": ""
            }
            return init
        },
        href(item, type) {
            if(type == 'opt'){
                this.openExchangeRate(item);
            }

        },
        getFilter(item,obj) {
            this.getList(item)
        },
        /* 数据请求 */
        getList(item) {
            if(item.currencyCode){
                this.currencyCode=item.currencyCode;
                 var param = {"accYear":this.accYear,"currencyCode":item.currencyCode};
                 this.$http.post(__URL.arc + 'exchangeRate/list', param).then(
                    (res) => {
                        this.tableData = res.data.data;
                    }
                )
            }
        },
        openExchangeRate(item){
            this.exchangeRateData.accYear=this.accYear;
            this.exchangeRateData.accMonth=item.accMonth;
            this.exchangeRateData.startDate=item.startDate,
            this.exchangeRateData.recordVersion=item.recordVersion;
            this.exchangeRateData.currencyCode=item.currencyCode;
            this.exchangeRateData.rate = item.rate;
            this.exchangeRateConfig.show=true;
        },
        updateRate(){
            this.$http.post(__URL.arc + 'exchangeRate/update', this.exchangeRateData).then( (res) => {
                    console.log(res.data.success);
                    this.msgCfg.content=res.data.errMsg;
                    this.msgCfg.type = 'failure';
                    this.msgCfg.show=true;
                    if(res.data.success){
                        this.msgCfg.content="保存成功";
                        this.msgCfg.type = 'success';
                        this.msgCfg.show=true;
                        this.closeExchange();
                    }
                }
            )
        },
        closeExchange(){
            this.exchangeRateConfig.show=false;
            this.refresh()
        },
        refresh(){
            this.$broadcast('_RESETLIST');
        },
        openCurrency(){
            this.currencyConfig.show=true;
        },
        currencyCb(obj){
            this.checkedCurrency=[];
            for(var i=0;i<obj.length;i++){
                this.checkedCurrency.push(obj[i].currencyCode);
            }
            this.$http.post(__URL.arc + 'currency/save', {"codes":this.checkedCurrency}).then( (res) => {
                    console.log(res.data.success);
                    if(res.data.success){
                        this.msgCfg.content="保存成功";
                        this.msgCfg.type = 'success';
                        this.msgCfg.show=true;
                    }else{
                        this.msgCfg.content=res.data.errMsg;
                        this.msgCfg.type = 'failure';
                        this.msgCfg.show=true;
                    }
                    this.refresh();
                }
            )
        },
        clearTable(uid,obj){
            this.tableData = []
        }
    },
    computed: {
        /* 参数获取 */
        tableUrl() {
            return cfg.table.baseParams.url
        },
        tableCfg() {
           this.tableData=[];
           return cfg.tableCfg;
        },
        tableParams() {
            let param = {
                "currencyCode": "",
                "accYear": "",
            }
            return param
        }
    }
}

</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @add="openCurrency"></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                    <select v-model="accYear" @change="getList" v-for="year in yearList">
                        <option value="{{year}}">{{year}}</option>
                    </select>
                </div>
                <div class="item_body">
                    <vtable  :config='tableCfg' :data='tableData'  @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>

    <!-- 币种-->
    <refer-currency :config='currencyConfig'  @cb='currencyCb'></refer-currency>

    <!-- 汇率弹框系列 -->
    <modal :config.sync='exchangeRateConfig' @sure='updateRate' @close='closeExchange'>
            <div class='form-group wd-100'>
                <label>起始日期:</label><p>{{exchangeRateData.startDate}}</p>
            </div>
            <div class='form-group wd-100'>
                <label><span class="must-point">*</span>汇率:</label>
                <input-number :code.sync="exchangeRateData.rate" key="exchangeRate"  placeholder="请输入汇率" ></input-number>
            </div>
    </modal>
    <warning :config="msgCfg" ></warning>
</template>
<style lang="less" scoped>
    @import '../../../../../public/css/variable.less';
</style>