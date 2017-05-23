<script>
    import cfg from './cfg'
    export default {
        props: ['show','isEdit','status','code'],
        data() {
            return {
                tabConfig: {
                    type:'page',
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
                uCfg:{
                    limit:6,
                    maxwidth:240
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
                detailParam:{
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
                this.detailParam.departmentCode=item.departmentCode;
                this.detailParam.departmentName=item.departmentName;
                this.detailParam.date = item;
            },
            epSure(item){
                this.detailParam.employeeCode=item.employeeCode;
                this.detailParam.employeeName=item.employeeName;
            },
            userEpSure(item){
                this.detailParam.userCode=item.employeeCode;
                this.detailParam.userName=item.employeeName;
            },
            scSure(item){
                this.detailParam.supplierCode=item.supplierCode;
                this.detailParam.supplierName=item.supplierName;
            },
            getDetail(){
                this.$http.get(__URL.hr+'asset/detail/'+this.code).then(
                    res => {
                        if (res.data.success) {
                            this.detailParam = res.data.data
                        } else {
                            this.warnConfig.show = true
                            this.warnConfig.content = res.data.errMsg
                        }
                    }
                )
            },
            originBingName(){
                for(let i=0;i<this.allOrigin.length;i++){
                    if(this.allOrigin[i].originCode == this.detailParam.originCode){
                        this.detailParam.originName = this.allOrigin[i].originName
                    }
                }
            },
            typeBingName(){
                for(let i=0;i<this.allAssetType.length;i++){
                    if(this.allAssetType[i].assetTypeCode == this.detailParam.assetTypeCode){
                        this.detailParam.assetTypeName = this.allAssetType[i].assetTypeName
                        this.detailParam.assetCategoryCode = this.allAssetType[i].assetCategoryCode
                        this.detailParam.assetCategoryName = this.allAssetType[i].assetCategoryName
                        this.detailParam.depreciationMethodCode = this.allAssetType[i].depreciationMethodCode
                        this.detailParam.depreciationMethodName = this.allAssetType[i].depreciationMethodName
                    }
                }
            },
            saveAsset(){
                this.$http.post(__URL.hr + 'asset/update', this.detailParam).then(
                    (res) => {
                        if(res.data.success){
                            this.show=false;
                            this.$emit('refresh', '修改成功')
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
            this.getDetail();
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
                    <p v-if="!isEdit">{{detailParam.assetCode}}</p>
                    <div class="s-input" v-else>
                        <input type='text' maxlength='20' placeholder='请输入资产编号' v-model='detailParam.assetCode'>
                    </div>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>资产类别:</label>
                    <p v-if="!isEdit">{{detailParam.assetTypeName}}</p>
                    <div class="s-input" v-else>
                        <select v-model='detailParam.assetTypeCode' @change="typeBingName">
                            <option :value='item.assetTypeCode' v-for='item in allAssetType'>{{item.assetTypeName}}</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>资产名称:</label>
                    <p v-if="!isEdit">{{detailParam.assetName}}</p>
                    <div class="s-input" v-else>
                        <input type="text" maxlength='16' placeholder='请输入资产名称' v-model='detailParam.assetName'>
                    </div>
                </div>
                <div class="form-group">
                    <label>规格型号:</label>
                    <p v-if="!isEdit">{{detailParam.spec}}</p>
                    <div class="s-input" v-else>
                        <input type="text" maxlength='16' placeholder='请输入规格型号' v-model='detailParam.spec'>
                    </div>
                </div>
                <div class="form-group">
                    <label>SN号:</label>
                    <p v-if="!isEdit">{{detailParam.snNumber}}</p>
                    <div class="s-input" v-else>
                        <input type="text" maxlength='20' placeholder='请输入SN号' v-model='detailParam.snNumber'>
                    </div>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>购入日期:</label>
                    <p v-if="!isEdit">{{detailParam.purchaseDate}}</p>
                    <div class="s-input" v-else>
                        <date-picker :config='dateCfg'  :date.sync='detailParam.purchaseDate'></date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label>金额:</label>
                    <p v-if="!isEdit">{{detailParam.purchasePrice}}</p>
                    <div class="s-input" v-else>
                        <input type="text" maxlength='32' placeholder='请输入原始采购金额' v-model='detailParam.purchasePrice'>
                    </div>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>监管部门:</label>
                    <p v-if="!isEdit">{{detailParam.departmentName}}</p>
                    <div class="s-input" v-else>
                        <input type="text" readonly placeholder='请选择' v-model='detailParam.departmentName'>
                        <i @click='openDep' class="icon-search r1"></i>
                    </div>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>监管人:</label>
                    <p v-if="!isEdit">{{detailParam.employeeName}}</p>
                    <div class="s-input" v-else>
                        <input type="text" readonly placeholder='请选择' v-model='detailParam.employeeName'>
                        <i @click='openEp' class="icon-search r1"></i>
                    </div>
                </div>
                <div class="form-group">
                    <label>使用期限(月):</label>
                    <p v-if="!isEdit">{{detailParam.usePeriod}}</p>
                    <div class="s-input" v-else>
                        <input type="text" maxlength='16' placeholder='请输入使用期限' v-model='detailParam.usePeriod'>
                    </div>
                </div>
                <div class="form-group">
                    <label>供应商:</label>
                    <p v-if="!isEdit">{{detailParam.supplierName}}</p>
                    <div class="s-input" v-else>
                        <input type="text" readonly placeholder='请选择' v-model='detailParam.supplierName'>
                        <i @click='openSc' class="icon-search r1"></i>
                    </div>
                </div>
                <div class="form-group">
                    <label>使用人:</label>
                    <p v-if="!isEdit">{{detailParam.userName}}</p>
                    <div class="s-input" v-else>
                        <input type="text" readonly placeholder='请选择' v-model='detailParam.userName'>
                        <i @click='openUserEp' class="icon-search r1"></i>
                    </div>
                </div>
                <div class="form-group">
                    <label>来源:</label>
                    <p v-if="!isEdit">{{detailParam.originName}}</p>
                    <div class="s-input" v-else>
                        <select v-model='detailParam.originCode' @change="originBingName">
                            <option :value='item.originCode' v-for='item in allOrigin'>{{item.originName}}</option>
                        </select>
                    </div>
                </div>
                <div class="form-group" v-if="status == 1">
                    <label>折旧方式:</label>
                    <p>{{detailParam.originName}}</p>
                </div>
                <div class="form-group">
                    <label>备注:</label>
                    <p v-if="!isEdit">{{detailParam.remark}}</p>
                    <div class="s-input" v-else>
                        <input type="text" maxlength='16' placeholder='请输入备注' v-model='detailParam.remark'>
                    </div>
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
        <button class="btn-xl-def" @click='cancel' v-if="!isEdit">关闭</button>
        <button class="btn-xl-def" @click='cancel' v-if="isEdit">取消</button>
        <ajax-button class="btn-xl-imp" @click='saveAsset' v-if="isEdit">保存</ajax-button>
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
