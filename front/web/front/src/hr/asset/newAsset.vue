<script>
    import cfg from './cfg'
    export default {
        props: ['show'],
        data() {
            return {
                tabConfig: {
                    select: '',
                    tabBarData: [{
                        id: 'tab1',
                        name: '领用记录',
                        icon: 'icon-teamwork'
                    }]
                },
                flowCfg:{
                    data:[{
                        no:'1',
                        name:'新增固定资产',
                        time:'',
                        filed:'',
                        user:'',
                        flag:true,
                    },{
                        no:'2',
                        name:'财务做账',
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
                warnConfig: {
                    show: false,
                    type: 'success',
                    content: '操作成功'
                },
                dateCfg:{
                    format: 'YYYY-MM-DD',
                    clear:false
                },
                depCfg:{
                    show:false,
                    data:{},
                    param:{}
                },
                epCfg:{
                    show:false,
                },
                userEpCfg:{
                    show:false,
                },
                scCfg:{
                    show:false,
                },
                newParam:{
                    assetCategoryCode: '',
                    assetCategoryName: '',
                    assetCode: '',
                    assetName: '',
                    assetTypeCode: '',
                    assetTypeName: '',
                    departmentCode: '',
                    departmentName: '',
                    depreciationMethodCode: '',
                    depreciationMethodName: '',
                    employeeCode: '',
                    employeeName: '',
                    originCode: '',
                    originName: '',
                    purchaseDate: '',
                    purchasePrice: 0,
                    remark: '',
                    snNumber: '',
                    spec: '',
                    supplierCode: '',
                    supplierName: '',
                    usePeriod: 0,
                    userCode: '',
                    userName: '',
                },
                allAssetType:{},
                allOrigin:{}
            }
        },
        methods: {
            cancel(){
                this.show = false;
            },
            openDep(){
                this.depCfg.show=true;
            },
            openEp(){
                this.epCfg.show=true;
            },
            openUserEp(){
                this.userEpCfg.show=true;
            },
            openSc(){
                this.scCfg.show=true;
            },
            cdSure(item){
                this.newParam.departmentCode=item.departmentCode;
                this.newParam.departmentName=item.departmentName;
                this.newParam.date = item;
            },
            epSure(item){
                this.newParam.employeeCode=item.employeeCode;
                this.newParam.employeeName=item.employeeName;
            },
            userEpSure(item){
                this.newParam.userCode=item.employeeCode;
                this.newParam.userName=item.employeeName;
            },
            scSure(item){
                this.newParam.supplierCode=item.supplierCode;
                this.newParam.supplierName=item.supplierName;
            },
            originBingName(){
                for(let i=0;i<this.allOrigin.length;i++){
                    if(this.allOrigin[i].originCode == this.newParam.originCode){
                        this.newParam.originName = this.allOrigin[i].originName
                    }
                }
            },
            typeBingName(){
                for(let i=0;i<this.allAssetType.length;i++){
                    if(this.allAssetType[i].assetTypeCode == this.newParam.assetTypeCode){
                        this.newParam.assetTypeName = this.allAssetType[i].assetTypeName
                        this.newParam.assetCategoryCode = this.allAssetType[i].assetCategoryCode
                        this.newParam.assetCategoryName = this.allAssetType[i].assetCategoryName
                        this.newParam.depreciationMethodCode = this.allAssetType[i].depreciationMethodCode
                        this.newParam.depreciationMethodName = this.allAssetType[i].depreciationMethodName
                    }
                }
            },
            saveAsset(){
                this.$http.post(__URL.hr + 'asset/insert', this.newParam).then(
                    (res) => {
                        if(res.data.success){
                            this.show=false;
                            this.$emit('refresh', '新增成功')
                        }else{
                            this.warnConfig.show=true
                            this.warnConfig.content=res.data.errMsg
                        }
                    }
                )
            }
        },
        ready(){
            this.$http.post(__URL.hr+'asset/type/list',{}).then(
                res => {
                    if (res.data.success) {
                        this.allAssetType = res.data.data
                    } else {
                        this.warnConfig.show = true
                        this.warnConfig.content = res.data.errMsg
                    }
                }
            )
            this.$http.post(__URL.hr+'asset/origin/list',{}).then(
                res => {
                    if (res.data.success) {
                        this.allOrigin = res.data.data
                    } else {
                        this.warnConfig.show = true
                        this.warnConfig.content = res.data.errMsg
                    }
                }
            )

        }
    }
</script>
<template>
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 class="tag">固定资产档案</h2>

            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label><span class="must-point">*</span>资产编号:</label>
                    <!-- 如果要加验证请加外层dom -->
                    <input type='text' maxlength='20' placeholder='请输入资产编号' v-model='newParam.assetCode'>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>资产类别:</label>
                    <select v-model='newParam.assetTypeCode' @change="typeBingName">
                        <option :value='item.assetTypeCode' v-for='item in allAssetType'>{{item.assetTypeName}}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>资产名称:</label>
                    <input type="text" maxlength='16' placeholder='请输入资产名称' v-model='newParam.assetName'>
                </div>
                <div class="form-group">
                    <label>规格型号:</label>
                    <input type="text" maxlength='16' placeholder='请输入规格型号' v-model='newParam.spec'>
                </div>
                <div class="form-group">
                    <label>SN号:</label>
                    <input type="text" maxlength='20' placeholder='请输入SN号' v-model='newParam.snNumber'>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>购入日期:</label>
                    <date-picker :config='dateCfg'  :date.sync='newParam.purchaseDate'></date-picker>
                </div>
                <div class="form-group">
                    <label>金额:</label>
                    <input type="text" maxlength='32' placeholder='请输入原始采购金额' v-model='newParam.purchasePrice'>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>监管部门:</label>
                    <div class="s-input ic2">
                        <input type="text" readonly placeholder='请选择' v-model='newParam.departmentName'>
                        <i @click='openDep' class="icon-search r1"></i>
                    </div>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>监管人:</label>
                    <div class="s-input ic2">
                        <input type="text" readonly placeholder='请选择' v-model='newParam.employeeName'>
                        <i @click='openEp' class="icon-search r1"></i>
                    </div>
                </div>
                <div class="form-group">
                    <label>使用期限(月):</label>
                    <input type="text" maxlength='16' placeholder='请输入使用期限' v-model='newParam.usePeriod'>
                </div>
                <div class="form-group">
                    <label>供应商:</label>
                    <div class="s-input ic2">
                        <input type="text" readonly placeholder='请选择' v-model='newParam.supplierName'>
                        <i @click='openSc' class="icon-search r1"></i>
                    </div>
                </div>
                <div class="form-group">
                    <label>使用人:</label>
                    <div class="s-input ic2">
                        <input type="text" readonly placeholder='请选择' v-model='newParam.userName'>
                        <i @click='openUserEp' class="icon-search r1"></i>
                    </div>
                </div>
                <div class="form-group">
                    <label>来源:</label>
                    <select v-model='newParam.originCode' @change="originBingName">
                        <option :value='item.originCode' v-for='item in allOrigin'>{{item.originName}}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>备注:</label>
                    <input type="text" maxlength='16' placeholder='请输入备注' v-model='newParam.remark'>
                </div>
            </div>

            <div class="inner-item">
                <tab-bar :config.sync='tabConfig'></tab-bar>
                <tab-container :active.sync='tabConfig.select'>
                    <tab-item id='tab1'>
                        <table class='inner-table mt-15'>
                            <thead>
                            <tr>
                                <th style='width:100%'>敬请期待</th>
                            </tr>
                            </thead>
                        </table>
                    </tab-item>
                </tab-container>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click='cancel'>取消</button>
        <ajax-button class="btn-xl-imp" @click='saveAsset'>保存</ajax-button>
    </div>
    <warning :config="warnConfig" ></warning>
    <refer-department :config="depCfg" @cb="cdSure"></refer-department>
    <refer-employee :config="epCfg" @cb="epSure"></refer-employee>
    <refer-employee :config="userEpCfg" @cb="userEpSure"></refer-employee>
    <refer-supplier :config="scCfg" @cb="scSure"></refer-supplier>
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
    .must-point {
        color: #FF0700;
    }
</style>
