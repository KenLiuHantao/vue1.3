<script>
import cfg from './cfg'
import bom from 'nb/treeTableForProduct/app'
import moment from 'moment'
export default {
    components: {
        bom,
    },
    props:['bomdetail','type','tab'],
    data() {
        return {
            valiVal: '',
            flowCfg:{
                data:[{
                    no:'1',
                    name:'新增BOM',
                    time:'',
                    filed:'',
                    user:'',
                    flag:true,
                },{
                    no:'2',
                    name:'审核BOM',
                    time:'',
                    filed:'',
                    user:'',
                    flag:true,
                },{
                    no:'3',
                    name:'完成',
                    time:'',
                    filed:'',
                    user:'',
                    flag:cfg.leftItemCfg.tabCfg.select=='tab4',
                }]
            },
            newBomDetail:this.bomdetail,
            ajaxlock:true,
            msgconfig:{
                type:'warning',
                show:false,
                content:''
            },
            tType:this.type,
            productCfg:{
                show:false
            },
            personCfg:{
                show: false,
                width: '800px',
                height: '400px',
                header: '请选择开发工程师',
                btn: [{
                    name: '关闭',
                    emit: 'codeclose'
                }, {
                    name: '确认',
                    emit: 'codesure'
                }]
            },
            unitTaxCost:'',
            oldstatus:''
        }
    },
    methods: {
        // 上传组件回调成功事件
        success(val) {
            let ucloud = this.newBomDetail.files;
            if(ucloud.length>=6){
                this.msgconfig.show=true
                this.msgconfig.content='附件最多上传6个'
                return
            }
            ucloud.push(val)
        },
        // 组件删除事件
        deleteImg(index) {
            this.newBomDetail.files.splice(index, 1)
        },
        //删除产品
        clearProduct(){
            this.newBomDetail=JSON.parse(JSON.stringify(cfg.bomCfg))
            this.tType=1;
        },
        searchProduct(){
            this.productCfg.show=true;
        },
        choiceProduct(obj){
            this.productCfg.show=false;
            // 将货品属性带入bom
            for(var key in obj){
                this.newBomDetail[key]=obj[key]
            }
            //修改下方表格状态
            this.tType=0;
            //获取当前时间作为版本时间
            this.newBomDetail.docVersionTime=moment(Date.parse(new Date)).format('YYYY-MM-DD HH:mm:ss');
            //获取suppliername作为workprice
            this.newBomDetail.processVo.workPrice=obj.supplierPrice;
            //添加工序和乱七八糟的属性
            this.newBomDetail.processVo.processCode=obj.processCode;
            this.newBomDetail.processVo.processName=obj.processName;
            this.newBomDetail.processVo.departmentCode=obj.departmentCode;
            this.newBomDetail.processVo.departmentName=obj.departmentName;
            this.newBomDetail.processVo.departmentEmployeeCode=obj.departmentEmployeeCode;
            this.newBomDetail.processVo.departmentEmployeeName=obj.departmentEmployeeName;
        },
        //删除开发工程师
        clearEmployee(){
            this.newBomDetail.employeeCode='';
            this.newBomDetail.employeeName='';
        },
        searchEmployee(){
            this.personCfg.show=true;
        },
        pickPerson(obj){
            this.personCfg.show=false;
            this.newBomDetail.employeeCode=obj.employeeCode;
            this.newBomDetail.employeeName=obj.employeeName;
        },
        cancel:function(){
            this.$emit('refresh')
        },
        //保存草稿和审核的区别在于isAudit  已驳回也是在这判断
        save:function(){
            let param=this.newBomDetail;
            this.oldstatus=this.newBomDetail.workFlowStatus;
            if(cfg.leftItemCfg.tabCfg.select=='tab1'){
                param.workFlowStatus=10;
            }else if(cfg.leftItemCfg.tabCfg.select=='tab3'){
                param.workFlowStatus=40;
            }
            this.$http.post(__URL.dev+'product/bom/update',param).then(
                (res) =>{
                    if(res.data.success){
                        this.$emit('refresh','保存成功')
                    }else{
                        this.newBomDetail.workFlowStatus=this.oldstatus
                        this.msgconfig.show=true;
                        this.msgconfig.content=res.data.errMsg;
                    }
                }
            )
        },
        audit:function(){
            let param=this.newBomDetail;
            this.oldstatus=this.newBomDetail.workFlowStatus;
            param.workFlowStatus=20;
            this.$http.post(__URL.dev+'product/bom/update',param).then(
                (res) =>{
                    if(res.data.success){
                        this.$emit('refresh','成功提交审核')
                    }else{
                        this.newBomDetail.workFlowStatus=this.oldstatus
                        this.msgconfig.show=true;
                        this.msgconfig.content=res.data.errMsg;
                    }
                }
            )
        },
        getTaxCost:function(docNo){
            //TODO 去掉了之前从后台获取的逻辑,直接从接口里面取值,暂时未实现
        }
    },
    ready(){
        this.getTaxCost(this.bomdetail.docNo)
    }
}
</script>
<template>
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">
            <h2 class="tag two-tag">
                <p>BOM信息</p>
                <p class='bomNo'>BOM单号:<span>{{newBomDetail.docNo}}</span></p>
            </h2>
            <div class="block">
                <!-- 根据type判断表单属性是可修改或只读 -->
                <div class="inner-item form-box" v-if='type==2'>
                    <div class="form-group">
                        <label>货品编码:</label>
                        <!-- 如果要加验证请加外层dom -->
                        <div class="s-input ic2">
                            <input v-model='newBomDetail.inventoryCode' readonly type="text">
                            <i class="icon-close__round r2" v-show='newBomDetail.inventoryCode' @click='clearProduct'></i>
                            <i @click='searchProduct' class="icon-search r1"></i>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>货品名称:</label>
                        <div class="s-input ic2">
                            <input v-model='newBomDetail.inventoryName' readonly type="text">
                            <i class="icon-close__round r2" v-show='newBomDetail.inventoryName' @click='clearProduct'></i>
                            <i @click='searchProduct' class="icon-search r1"></i>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>规格型号:</label>
                        <p>{{newBomDetail.inventorySpec}}</p>
                    </div>
                    <div class="form-group">
                        <label>开发工程师:</label>
                        <div class="s-input ic2">
                            <input v-model='newBomDetail.employeeName' readonly type="text">
                            <i class="icon-close__round r2"  v-show='newBomDetail.employeeName' @click='clearEmployee'></i>
                            <i @click='searchEmployee' class="icon-search r1"></i>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>版本:</label>
                        <p>{{newBomDetail.docVersion}}</p>
                    </div>
                    <div class="form-group">
                        <label>版本时间:</label>
                        <p>{{newBomDetail.docVersionTime}}</p>
                    </div>
                </div>

                <div class="inner-item form-box" v-if='type==1'>
                    <div class="form-group">
                        <label>货品编码:</label>
                        <p>{{newBomDetail.inventoryCode}}</p>
                    </div>
                    <div class="form-group">
                        <label>货品名称:</label>
                        <p>{{newBomDetail.inventoryName}}</p>
                    </div>
                    <div class="form-group">
                        <label>规格型号:</label>
                        <p>{{newBomDetail.inventorySpec}}</p>
                    </div>
                    <div class="form-group">
                        <label>开发工程师:</label>
                        <p>{{newBomDetail.employeeName}}</p>
                    </div>
                    <div class="form-group">
                        <label>版本:</label>
                        <p>{{newBomDetail.docVersion}}</p>
                    </div>
                    <div class="form-group">
                        <label>版本日期:</label>
                        <p>{{newBomDetail.docVersionTime}}</p>
                    </div>
                </div>

                <div class=" inner-item" v-if='type==2'>
                    <div class="form-group wd-100">
                        <label>附件:</label>
                        <div class='annexBox'>
                            <upfile-group :data='newBomDetail.files' :edit="true"></upfile-group>
                        </div>
                    </div>
                    <div class="form-group wd-100">
                        <label>备注:</label>
                        <input type="text" maxlength='120' v-model='newBomDetail.remark'>
                    </div>
                </div>

                <div class="inner-item" v-if='type==1'>
                    <div class="form-group wd-100">
                        <label>附件:</label>
                        <div class='annexBox'>
                            <upfile-group :data='newBomDetail.files' :edit="false"></upfile-group>
                        </div>
                    </div>
                    <div class="form-group wd-100 align-items__baseline">
                        <label>备注:</label>
                        <p class="lh-20">{{newBomDetail.remark}}</p>
                    </div>
                </div>

                <div class='bomTree'>   
                    <bom :data.sync='newBomDetail' :type='tType'></bom>
                </div>
                <!-- <div class='bomBottom'>
                    <p>{{unitTaxCost}}</p>
                    <label>单位含税成本:</label>
                </div> -->
            </div>
        </div>
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" v-if='type==2' @click='cancel'>取消</button>
        <button class="btn-xl-def" v-else @click='cancel'>关闭</button>
        <ajax-button class="btn-xl-imp" v-if='type==2' @click='save'>保存</ajax-button>
        <ajax-button class="btn-xl-imp" v-if='type==2' @click='audit'>提交审核</ajax-button>
    </div>
    <warning :config="msgconfig" ></warning>
    <refer-inventory :config='productCfg' @cb='choiceProduct'></refer-inventory>
    <refer-employee :config='personCfg' @cb='pickPerson' ></refer-employee>
</template>
<style lang='less' scoped>
/* 此处为自己定义的样式 */
@import '../../../../../public/css/variable.less';
.bomTree{
    margin-top: 20px;
}
</style>
