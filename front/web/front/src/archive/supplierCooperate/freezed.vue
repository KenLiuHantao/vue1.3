<script>
    import cfg from './cfg.js'
    export default {
        data() {
        return {
            flowCfg: {
                data: [{
                    no: '1',
                    name: '新增',
                    time: '',
                    filed: '',
                    user: '',
                    flag: true
                }, {
                    no: '2',
                    name: '审核',
                    time: '',
                    filed: '',
                    user: '',
                    flag: false
                }]
            },
            supplierUpdateDate:{
                supplierStatus:'-1',
                supplierCode:'',
                recordVersion:'',
            },
            tableData: [],
            valiVal: '',
            //解除冻结
            releaseFreezeCfg:{
                title:'解除冻结提示',
                show:false,
                type:'warning',
                msg:'是否解除冻结？',
                subMsg:''
            },
            //终止合作
            suspendCfg:{
                title:'终止合作提示',
                show:false,
                type:'warning',
                msg:'',
                sure:false,
                subMsg:''
            },
            //终止合作2
            suspendSuccessCfg:{
                title:'终止合作提示',
                show:false,
                type:'warning',
                msg:'确定要终止与该供应商的合作吗？终止合作后，与该供应商相关的所有系统操作将不能进行！',
                subMsg:''
            },
            msgconfig:{
                type:'warning',
                show:false,
                content:''
            },
            tabConfig: {
                type:'page',
                select: '',
                tabBarData: [{
                    id: 'tab1',
                    name: '联系人',
                    icon: 'icon-contacts'
                }]
            },
            valiShow: {
                industryName:false,
                supplierCategoryName: false,
                supplierName: false,
                employeeName:false,
                currency:false,
                taxRate:false
            },
            upfileCfg:cfg.upfileCfg,
            supplierCategoryConfig:{
                searchKey:'',
                showKey:'',
                url: __URL.arc+'supplier/category/tree' ,
                width:210
            },
            allCurrency:[],
            agreementList:[],
            paymentList:[],
            taxRateList:[],
            ajaxlock:true,
            //供应商分类弹框显示和隐藏
            supplierShow:{
                show: false,
                width: '600px',
                height: 'auto',
                header: '请选择供应商分类',
                btn: []
            },
            supplierCategoryCode:'',
            supplierCategoryName:'',
            //业务员弹框
            codeModal: {
                show: false,
                width: '800px',
                height: '400px',
                header: '请选择业务员',
                btn: [{
                    name: '取消',
                    emit: 'codeclose'
                }, {
                    name: '确认',
                    emit: 'codesure'
                }]
            },
            refresh(text){
            alert(4);
            // this.tableData=[];
            // this.getList()
            if(text){
                this.dCfg.msg=text;
                this.dCfg.show=true;
            }
            this.$broadcast('_RESETLIST')
            this.tableData=[]
        },
        rdCfg:{
            show:false,
                    msg:'',
                    subMsg:'',
                    type:'success',
                    quite:false
        },
            //行业分类弹框
            industryCfg:{
                show:false,
                data:{},
                notChoiceFirst: true
            },
            pickedname:'',
            pickedcode:'',
            //msg
            msgconfig:{
                type:'warning',
                show:false,
                content:''
            },
            wCfg:{
                show:false,
                content:'修改成功',
                type:'success'
            },
            dCfg:{
                show:false,
                msg:'确定是否删除所选择的行记录吗？',
                subMsg:'删除后不可以恢复！',
                type:'failure',
                index:''
            },
            cdCfg:{
                show:false,
                msg:'确定是否删除？',
                subMsg:'',
                type:'failure'
            },
            edit:false,
            uCfg: {
                limit: 6,
            },
        }
    },
    props:['detail'],
            methods: {
        //解除冻结
        ensureReleaseFreeze(){
            this.supplierUpdateDate.supplierStatus = 1;
            this.releaseFreezeCfg.show =true;
        },
        //终止合作
        ensureSuspend(){
            this.supplierUpdateDate.supplierStatus = 3;
            //查询将要被终止的供应商的使用情况
            this.$http.post(__URL.arc + 'supplier/findSupplierUsed',this.supplierUpdateDate).then(
                    (res) => {
                if(res.data.success){
                    this.suspendSuccessCfg.show = true;
                }else{
                    this.suspendCfg.msg ="该供应商尚有未完成的'"+res.data.errMsg+"'需处理完未完成的'"+res.data.errMsg+"'，才能终止合作"
                    this.suspendCfg.show = true;

                }
            }
        )
//            this.suspendCfg.show =true;
        },
        suspend(){
            this.$http.post(__URL.arc + 'supplier/updateSupplierStatus',this.supplierUpdateDate).then(
                    (res) => {
                if(res.data.success){
                    this.suspendCfg.show=false;
                    this.suspendSuccessCfg.show=false;
                    this.$emit("refresh","终止合作成功")
                }else{
                    this.msgconfig.show=true
                    this.msgconfig.content=res.data.errMsg
                }
            }
        )
        },
         releaseFreeze(){
            this.$http.post(__URL.arc + 'supplier/updateSupplierStatus',this.supplierUpdateDate).then(
                    (res) => {
                if(res.data.success){
                    this.releaseFreezeCfg.show=false;
                    this.$emit("refresh","解除冻结成功")
                }else{
                    this.msgconfig.show=true
                    this.msgconfig.content=res.data.errMsg
                }
            }
        )
        },
        closeFreeze(){
            this.ensureFreezeCfg.show = false;
        },
        //放弃修改
        cancelEdit(){
            this.$emit('refresh')
            // this.refreshDetail();
            // this.edit=false;
        },
        //刷新内页数据
        refreshDetail(){
            this.$http.get(__URL.arc+'supplier/detail/'+this.newSupplier.supplierCode).then(
                    (res) => {
                        this.detail=res.data.data;
                    }
            )
        }
    },
    ready(){
        this.supplierUpdateDate.recordVersion = this.detail.recordVersion;
        this.supplierUpdateDate.supplierCode = this.detail.supplierCode;
        this.supplierUpdateDate.supplierStatus = 0;
        //初始化时拿到币种列表
        this.$http.post(__URL.arc+'currency/local',{}).then(
                (res) => {
                    if(res.data.success){
                        this.allCurrency=res.data.data;
                        for(var i=0;i<this.allCurrency.length;i++){
                            if(this.allCurrency[i].localCurrency=='是'){
                                this.allCurrency[i].localCurrency='true'
                            }
                        }
                    }
                },
                (err) => {
                    console.log('初始化未能拿到币种数据')
                }
        )
        //初始化拿到付款条件
        this.$http.post(__URL.arc+'pay/agreement/list',{}).then(
                (res) => {
                    if(res.data.success){
                        this.agreementList=res.data.data;
                    }
                },
                (err) => {
                    console.log('初始化未能拿到付款数据')
                }
        )
        //初始化拿到结算方式
        this.$http.post(__URL.arc+'payment/list',{}).then(
                (res) => {
                    if(res.data.success){
                        this.paymentList=res.data.data.dataList;
                    }
                },
                (err) => {
                    console.log('初始化未能拿到结算数据')
                }
        )
        //初始化拿到增值税率
        this.$http.post(__URL.arc+'taxrate/list',{}).then(
                (res) => {
                    if(res.data.success){
                        this.taxRateList=res.data.data.dataList;
                    }
                },
                (err) => {
                    console.log('初始化未能拿到税率数据')
                }
        )

    },
    computed:{
        newSupplier:function(){
            console.log(this.detail);
            return this.detail
        }
    }
    }
</script>
<template>
    <div class="inner-wrapper">

        <warning :config="wCfg"></warning>

        <!-- 只读状态 -->

        <div class="inner-content" v-show='true'>

            <h2 class="tag">供应商档案信息</h2>

            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">

                <div class="form-group">
                    <label><!-- <span class="must-point">*</span> -->供应商名称:</label>
                    <p>{{newSupplier.supplierName}}</p>
                </div>
                <div class="form-group">
                    <label><!-- <span class="must-point">*</span> -->供应商分类:</label>
                    <p>{{newSupplier.supplierCategoryName}}</p>
                </div>
                <div class="form-group">
                    <label>供应商行业:</label>
                    <p>{{newSupplier.firstIndustryCategoryName}}</p>
                </div>
                <div class="form-group">
                    <label><!-- <span class="must-point">*</span> -->采购员:</label>
                    <p>{{newSupplier.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label><!-- <span class="must-point">*</span> -->默认币种:</label>
                    <p>{{newSupplier.currencyName}}</p>
                </div>
                <div class="form-group">
                    <label><!-- <span class="must-point">*</span> -->税率(%):</label>
                    <p>{{newSupplier.taxRate}}</p>
                </div>
                <div class="form-group">
                    <label>付款条件:</label>
                    <p>{{newSupplier.payAgreementName}}</p>
                </div>
                <div class="form-group">
                    <label>结算方式:</label>
                    <p>{{newSupplier.paymentName}}</p>
                </div>
            </div>
            <div class="inner-item mt-15">
                <div class="form-group wd-100">
                    <label>附件:</label>
                    <div class='annexBox'>
                        <upfile-group :config='uCfg' :edit=false :data="newSupplier.attachments"></upfile-group>
                    </div>

                </div>
                <div class="form-group wd-100 align-items__baseline">
                    <label>备注:</label>
                    <!-- <input type="text" maxlength='120' v-model='newCustomer.remark'> -->
                    <p class="lh-20">{{newSupplier.remark}}</p>
                </div>
            </div>

            <div class="inner-item">
                <tab-bar :config.sync='tabConfig'></tab-bar>
                <tab-container :active.sync='tabConfig.select'>
                    <tab-item id='tab1'>
                        <table class='inner-table mt-15'>
                            <thead>
                            <tr>
                                <th style='width:50px'>序号</th>
                                <th style='width:120px'>联系人</th>
                                <th style='width:150px'>职务</th>
                                <th style='width:170px'>联系电话</th>
                                <th style='width:200px'>E-mail</th>
                                <th style='width:270px'>地址</th>
                                <th style='width:50px'>默认订单联系人</th>
                                <!-- <td>操作</td> -->
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for='item in newSupplier.contacts'>
                                <td>{{$index+1}}</td>
                                <td>
                                    <p>{{item.contactName}}</p>
                                </td>
                                <td>
                                    <p>{{item.duty}}</p>
                                </td>
                                <td>
                                    <p>{{item.phone}}</p>
                                </td>
                                <td>
                                    <p>{{item.email}}</p>
                                </td>
                                <td>
                                    <p>{{item.address}}</p>
                                </td>

                                <td>
                                    <p v-show='item.major==true'>是</p>
                                    <p v-show='item.major==false'>否</p>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                    </tab-item>
                </tab-container>
            </div>
        </div>
    </div>
    </div>
    <div class="inner-footer">
        <button  @click='cancelEdit' class="btn-xl-def">取消</button>
        <button  @click='ensureReleaseFreeze' class="btn-xl-imp">解除冻结</button>
        <button  @click='ensureSuspend' class="btn-xl-imp">终止合作</button>


    </div>
    <refer-employee :config='codeModal' @cb='pickPerson' ></refer-employee>
    <!--供应商解冻弹框-->
    <alert :config='releaseFreezeCfg' @cb='releaseFreeze' ></alert>
    <!--供应商终止弹框-->
    <alert :config='suspendCfg' @cb='suspend' ></alert>
    <alert :config='suspendSuccessCfg' @cb='suspend'></alert>

    </modal>
    <!-- </modal> -->
    <!-- 业务员弹框 end -->
    <!-- 供应商分类弹框 start -->
    <modal :config.sync='supplierShow'>
        <category-supplier  @cb='supplierSure'></category-supplier>
    </modal>
    <!-- 供应商分类弹框 end -->
    <!-- 行业分类弹框 start -->
    <category-industry :config='industryCfg' @cb='industrySure'></category-industry>
    <!-- 行业分类弹框 end -->
    <warning :config="msgconfig" ></warning>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
    /* 此处为自己定义的样式 */
    .inner_body{
        width: 1140px;
        margin: 0 auto;
        padding-top: 20px;
        background: white;
        margin-top: 20px;
        border: 1px solid #F2F3F3;
    }
    .cont{
        padding: 0 20px;
    }
    .error {
        font-style: normal;
        position: absolute;
        margin-top: 4px;
        left: 100px;
        top: 28px;
        width: 210px;
        color: @danger;
        font-size: @font-size-small;
    }
    .inner-wrapper{
        background: #fbfbfb;
    }
</style>
