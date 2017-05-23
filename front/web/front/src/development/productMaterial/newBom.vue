<script>
import cfg from './cfg'
import bom from 'nb/treeTableForProduct/app'
import moment from 'moment'

export default {
    components: {
        bom,
    },
    props:['type'],
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
                    flag:false,
                },{
                    no:'3',
                    name:'完成',
                    time:'',
                    filed:'',
                    user:'',
                    flag:false,
                }]
            },
            newBomDetail:JSON.parse(JSON.stringify(cfg.bomCfg)),
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
            }
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
            if(obj.attributeName=='采购件'){
                this.productCfg.show=true;
                this.msgconfig.show=true
                this.msgconfig.content='请选择自制件或委外加工件'
                return
            }
            this.productCfg.show=false;
            // 将货品属性带入bom
            for(var key in obj){
                this.newBomDetail[key]=obj[key]
            }
            //修改下方表格状态
            this.tType=0;
            this.setBomDetail(obj);
            //如果是自制件或委外加工件则去获取是否存在bom,有则拿过来
            if("1" == obj.attributeCode || "2" == obj.attributeCode){
                this.$http.get(__URL.dev + 'product/bom/get/exist/1/'+obj.inventoryId).then(
                    (res) => {
                        if(null != res.data.data){
                            this.newBomDetail = res.data.data;
                            this.newBomDetail.upgrade = true;
                            this.newBomDetail.docVersion = res.data.data.docVersion + 10;
                            this.newBomDetail.docVersionTime = moment(Date.parse(new Date)).format('YYYY-MM-DD HH:mm:ss');
                            this.newBomDetail.employeeCode = obj.employeeCode;
                            this.newBomDetail.employeeName = obj.employeeName;
                        }
                    }
                )
            }
        },
        setBomDetail(obj){
            this.newBomDetail.processVo.workPrice=obj.supplierPrice;
            //获取当前时间作为版本时间
            this.newBomDetail.docVersionTime=moment(Date.parse(new Date)).format('YYYY-MM-DD HH:mm:ss');
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
        //保存草稿和审核的区别在于isAudit
        save:function(){
            let param=this.newBomDetail;
            param.workFlowStatus = 10;
            this.$http.post(__URL.dev+'product/bom/add',param).then(
                (res) =>{
                    if(res.data.success){
                        this.$emit('refresh','保存成功')
                    }else{
                        this.msgconfig.show=true;
                        this.msgconfig.content=res.data.errMsg;
                    }
                }
            )
        },
        audit:function(){
            let param=this.newBomDetail;
            param.workFlowStatus = 20;
            this.$http.post(__URL.dev+'product/bom/add',param).then(
                (res) =>{
                    if(res.data.success){
                        this.$emit('refresh','成功提交审核')
                    }else{
                        this.msgconfig.show=true;
                        this.msgconfig.content=res.data.errMsg;
                    }
                }
            )
        }
    },
    ready(){
        // this.getData();
    }
}
</script>
<template>
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">
            <h2 class="tag">BOM信息</h2>
            <!-- <p class='bomNo'>订单BOM单号:<span>{{newBomDetail.docNo}}</span></p> -->
            <div class="block">
                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
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
                        <label>开发工程师</label>
                        <div class="s-input ic2">
                            <input v-model='newBomDetail.employeeName' readonly type="text">
                            <i class="icon-close__round r2" v-show='newBomDetail.employeeName' @click='clearEmployee'></i>
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
                <div class="inner-item">
                    <div class="form-group">
                        <label>附件:</label>
                        <div class='annexBox'>
                            <upfile-group :data='newBomDetail.files' :edit="true"></upfile-group>
                        </div>
                        
                    </div>
                    <div class="form-group">
                        <label>备注:</label>
                        <!-- <input type="text" maxlength='120' v-model='newCustomer.remark'> -->
                        <input type="text" maxlength='120' v-model='newBomDetail.remark'>
                    </div>
                </div>
                <div class='bomTree'>   
                    <bom :data.sync='newBomDetail' :type='tType'></bom>
                </div>
            </div>
        </div>
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" @click='cancel'>取消</button>
        <ajax-button class="btn-xl-imp" @click='save'>保存草稿</ajax-button>
        <ajax-button class="btn-xl-imp" @click='audit'>提交审核</ajax-button>
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
