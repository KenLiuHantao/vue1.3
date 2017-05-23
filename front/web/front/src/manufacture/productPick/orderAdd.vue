<script>

    export default{
        data(){
            return{
                show: {
                  default: false
                },
                submit:true,
                params:{
                    productDocNo:this.taskno,
                    processCode:this.processcode
                },
                orders:'',
                warCfg:{
                    show:false,
                    //success|failure|warning   三选一必填
                    type:'failure',
                    //根据内容自定   必填
                    content:'',
                    //显示时间，以毫秒为单位 选填
                    showTime:'2000'
                }
            }
        },
        props:['docNo','addConfig'],
        components:{
        },
        ready() {
            this.$http.post(__URL.manufacture + 'prepare/detail/'+ this.docNo).then(
                (res) => {
                    this.orders = res.data.data;
                }
            )
        },
        methods:{
             /*下单*/
            saveOrder(){
                for(let idx in this.orders.dataList){
                    this.orders.dataList[idx].rowNum = parseInt(idx) + 1;
                    let qty = this.orders.dataList[idx].currencyPickQty;
                    if(!qty || qty==='' || parseFloat(qty) <= 0){
                        this.submit = false
                        this.warCfg.show = true;
                        this.warCfg.content="第"+this.orders.dataList[idx].rowNum+"行领料数量不能为空且必须大于0";
                        return;
                    }
                }
                if(this.submit){
                    this.submit = false
                    this.$http.post(__URL.manufacture+"add/pickRecord",this.orders).then(
                        (res) => {
                            if(res.data.success){
                                this.$emit('refresh', '领料成功');
                                this.submit=true
                            }else{
                                this.warCfg.show = true;
                                this.warCfg.type = "failure"
                                this.warCfg.content=res.data.errMsg;
                                this.submit=true
                            }
                        }
                    )
                }
            },
            /*取消下单*/
            cancelOrder(){
                this.addConfig.show=false;
            }
        },
        watch:{
        }
    }

</script>
<template :config="addConfig">
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag">生产领料</h2>
            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label>生产车间:</label>
                    <p class="orderData">{{orders.header.departmentName}}</p>
                </div>
                <div class="form-group">
                    <label>仓库:</label>
                    <p class="orderData">{{orders.header.warehouseName}}</p>
                </div>
                <div class="form-group">
                    <label>领料日期:</label>
                    <p class="orderData">{{orders.header.pickDate}}</p>
                </div>
                <div class="form-group">
                    <label>领料员:</label>
                    <p class="orderData">{{orders.header.pickEmployeeName}}</p>
                </div>
                <div class="form-group">
                    <label>仓管员:</label>
                    <p class="orderData">{{orders.header.warehouseEmployeeName}}</p>
                </div>
                <div class="form-group">
                    <label>备料单号:</label>
                    <p class="orderData">{{docNo}}</p>
                </div>
            </div>

            <div class="inner-item">
                <table class="inner-table mt-15">
                    <thead>
                        <tr>
                            <th width="30px">序号</th>
                            <th width="15%">货品信息</th>
                            <th width="15%">单位</th>
                            <th width="10%">备料数量</th>
                            <th width="10%">已领数量</th>
                            <th width="10%">本次领料</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for='item in orders.dataList'>
                            <td>{{$index + 1}}</td>
                            <td>
                                <div class="show-wrap">
                                    <p>{{item.inventoryCode}}</p>
                                    <p>{{item.inventoryName}}</p>
                                    <p>{{item.inventorySpec}}</p>
                                </div>
                            </td>
                            <td>
                                <div class="show-wrap">
                                    <p>{{item.unitName}}</p>
                                </div>
                            </td>
                            <td>
                                <div class="show-wrap">
                                    <p>{{item.prepareQty}}</p>
                                </div>
                            </td>
                            <td>
                                <div class="show-wrap">
                                    <p>{{item.alreadyPickedQty}}</p>
                                </div>
                            </td>
                            <td>
                                <div class="show-wrap">
                                    <p>
                                        <input-number  style='width:115px' placeholder="领料数量"
                                            :code.sync='item.currencyPickQty'></input-number>
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button @click='cancelOrder' class="btn-xl-def">取消</button>
        <button @click='saveOrder' class="btn-xl-imp">确认领料</button>
    </div>

    <!--警告-->
    <warning :config="warCfg"></warning>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>
