<script>
import dev from './item_dev'
import purchase from './item_purchase'
import sale from './item_sale'
import unit from 'nb/unit/app'
import cfg from './cfg.js'
export default {
    components: {
        dev,
        sale,
        purchase,
        unit,
    },
    ready() {
        if (this.edit === 0) {
            this.codeInitItem = JSON.parse(JSON.stringify(cfg.codeInitItem))
        }
        if (this.edit === 1 || this.edit === 2) {
            this.codeInitItem = this.data
        }
        this.$http.post(__URL.arc + 'warehouse/find/ref', {}).then(
            (res) => {
                this.wareData = res.data.data.dataList;
            }
        )
        // if(this.tab != 'tab3' && this.edit!=0){
        //     this.initInventoryCategory();
        // }
    },
    props: ['tab','data', 'edit', 'other', 'type'],
    data() {
        return {
            tabConfig: cfg.tabConfig,
            codeInitItem: JSON.parse(JSON.stringify(cfg.codeInitItem)),
            typeData: [{
                inventoryTypeName: '成品',
                inventoryTypeCode: '001'
            }, {
                inventoryTypeName: '半成品',
                inventoryTypeCode: '002'
            }, {
                inventoryTypeName: '原料',
                inventoryTypeCode: '003'
            }],
            developmentVo:{
                "departmentCode": "",
                "departmentEmployeeCode": "",
                "departmentEmployeeName": "",
                "departmentName": "",
                "employeeCode": "",
                "employeeName": "",
                "lossRate": 0,
                "minPackQty": "",
                "processCode": "",
                "processName": ""
            },
            importation:[{code:1,name:'是'},{code:0,name:'否'}],
            attributeName: [{
                key: 0,
                value: '采购件'
            }, {
                key: 1,
                value: '自制件'
            }, {
                key: 2,
                value: '委外加工件'
            //}, {
            //    key: 3,
            //    value: '虚拟件'
            }],
            wCfg: {
                show: false,
                content: '',
                type: 'success'
            },
            alertCfg: {
                show: false,
                type: 'failure',
                sAutoClose: false,
                msg: '确定删除此货品？删除后不可找回！'
            },
            wareData:[],
            inventoryCfg:{
                show:false
            }
        }
    },
    methods: {
        initInventoryCategory(){
            this.$http.post(__URL.arc+'inventory/category/findName',{name:this.codeInitItem.secondInventoryCategoryName}).then(
                (res) => {
                    let item = res.data.data;
                    this.codeInitItem.firstIndustryCategoryCode=item.firstIndustryCategoryCode
                    this.codeInitItem.firstIndustryCategoryName=item.firstIndustryCategoryName
                    this.codeInitItem.secondIndustryCategoryCode=item.secondIndustryCategoryCode
                    this.codeInitItem.secondIndustryCategoryName=item.secondIndustryCategoryName
                    this.codeInitItem.firstInventoryCategoryCode=item.firstInventoryCategoryCode
                    this.codeInitItem.firstInventoryCategoryName=item.firstInventoryCategoryName
                    this.codeInitItem.secondInventoryCategoryCode=item.secondInventoryCategoryCode
                    this.codeInitItem.secondInventoryCategoryName=item.secondInventoryCategoryName
                    this.codeInitItem.inventoryTypeCode=item.inventoryTypeCode
                    this.codeInitItem.inventoryTypeName=item.inventoryTypeName
                    console.log(res.data.data);
                }
            )
        },
        getDefaultware(){
            this.$http.post(__URL.arc+"inventory/category/rule/findOne",{inventoryCategoryCode:this.codeInitItem.firstInventoryCategoryCode,ruleItem:'默认仓库'}).then(
                (res) => {
                    this.codeInitItem.warehouseCode = res.data.data.ruleDefinitionCode;
                    this.codeInitItem.warehouseName = res.data.data.ruleDefinition;
                }
            )
        },
        copyParam(base, target) {
            let tk = Object.keys(target)

            for (let i in base) {
                if (tk.indexOf(i) != -1) {
                    target[i] = base[i]
                }
            }
        },
        openInvent(){
            this.inventoryCfg.show=true
        },
        /* 货品分类操作 */
        getInvent(item) {
            this.codeInitItem.firstIndustryCategoryCode=item.firstIndustryCategoryCode
            this.codeInitItem.firstIndustryCategoryName=item.firstIndustryCategoryName
            this.codeInitItem.secondIndustryCategoryCode=item.secondIndustryCategoryCode
            this.codeInitItem.secondIndustryCategoryName=item.secondIndustryCategoryName
            this.codeInitItem.firstInventoryCategoryCode=item.firstInventoryCategoryCode
            this.codeInitItem.firstInventoryCategoryName=item.firstInventoryCategoryName
            this.codeInitItem.secondInventoryCategoryCode=item.secondInventoryCategoryCode
            this.codeInitItem.secondInventoryCategoryName=item.secondInventoryCategoryName
            this.codeInitItem.inventoryTypeCode=item.inventoryTypeCode
            this.codeInitItem.inventoryTypeName=item.inventoryTypeName
            this.getDefaultware();
            // this.copyParam(item, this.codeInitItem)
        },
        clearInvent(){
            this.codeInitItem.firstIndustryCategoryCode=''
            this.codeInitItem.firstIndustryCategoryName=''
            this.codeInitItem.secondIndustryCategoryCode=''
            this.codeInitItem.secondIndustryCategoryName=''
            this.codeInitItem.firstInventoryCategoryCode=''
            this.codeInitItem.firstInventoryCategoryName=''
            this.codeInitItem.secondInventoryCategoryCode=''
            this.codeInitItem.secondInventoryCategoryName=''
            this.codeInitItem.inventoryTypeCode=''
            this.codeInitItem.inventoryTypeName=''
        },
        /* 上传附件回调 */
        getFile(item) {
            this.codeInitItem.files.push(item)
        },
        getImg(item) {
            this.codeInitItem.images.push(item)
        },
        downFile(item) {
            let url = __URl.v1 + 'file/url?fileId=' + item.fileId + '&fileName=' + item.fileName

            this.$http.get(url).then(
                (res) => {
                    console.log(res.data)
                }
            )
        },
        /* 仓库操作 */
        getWare(obj, msg) {
            this.copyParam(obj, this.codeInitItem)
        },
        /* 币种操作 */
        getUnit(item) {
            this.copyParam(item, this.codeInitItem)
        },
        setDevelopment(){
            console.log(this.codeInitItem);
            this.codeInitItem.departmentCode = this.check(this.codeInitItem.developmentVo.departmentCode);
            this.codeInitItem.departmentEmployeeCode = this.check(this.codeInitItem.developmentVo.departmentEmployeeCode);
            this.codeInitItem.departmentEmployeeName = this.check(this.codeInitItem.developmentVo.departmentEmployeeName);
            this.codeInitItem.departmentName = this.check(this.codeInitItem.developmentVo.departmentName);
            this.codeInitItem.employeeCode = this.check(this.codeInitItem.developmentVo.employeeCode);
            this.codeInitItem.employeeName = this.check(this.codeInitItem.developmentVo.employeeName);
            this.codeInitItem.lossRate = this.check(this.codeInitItem.developmentVo.lossRate);
            this.codeInitItem.minPackQty = this.check(this.codeInitItem.developmentVo.minPackQty);
            this.codeInitItem.processCode = this.check(this.codeInitItem.developmentVo.processCode);
            this.codeInitItem.processName = this.check(this.codeInitItem.developmentVo.processName);
        },
        setDevelopmentVo(){
            this.codeInitItem.developmentVo = this.developmentVo;
            this.codeInitItem.developmentVo.departmentCode = this.check(this.codeInitItem.departmentCode);
            this.codeInitItem.developmentVo.departmentEmployeeCode = this.check(this.codeInitItem.departmentEmployeeCode);
            this.codeInitItem.developmentVo.departmentEmployeeName = this.check(this.codeInitItem.departmentEmployeeName);
            this.codeInitItem.developmentVo.departmentName = this.check(this.codeInitItem.departmentName);
            this.codeInitItem.developmentVo.employeeCode = this.check(this.codeInitItem.employeeCode);
            this.codeInitItem.developmentVo.employeeName = this.check(this.codeInitItem.employeeName);
            this.codeInitItem.developmentVo.lossRate = this.check(this.codeInitItem.lossRate);
            this.codeInitItem.developmentVo.minPackQty = this.check(this.codeInitItem.minPackQty);
            this.codeInitItem.developmentVo.processCode = this.check(this.codeInitItem.processCode);
            this.codeInitItem.developmentVo.processName = this.check(this.codeInitItem.processName);
        },
        check(val){
            return Boolean(val)?val:'';
        },
        saveInvToDraft(){
            let url = ''
            if (this.edit === 0) { //新增
                this.getWarehouseName()
                if(Boolean(this.codeInitItem.developmentVo)){
                    this.setDevelopment();
                }
                url = __URL.osiu + 'import/inventory/insert'
                this.saveAjax(url)
            }
            if (this.edit === 2) { //修改
                this.getWarehouseName()
                url = __URL.osiu + 'import/inventory/update'
                this.saveAjax(url)
            }
            if (this.edit === 1) { //查看
                this.edit = 2
            }
        },
        saveInv() {
            let url = '';
            if (this.edit === 0 || this.edit === 2) { //新增
                this.getWarehouseName()
                if(this.edit == 2 && this.tab != 'tab3'){
                    this.codeInitItem.inventoryId = this.codeInitItem.id
                    if(this.codeInitItem.attributeCode != 0){
                        this.setDevelopmentVo();
                    }
                }
                if(this.edit == 2){
                    url = __URL.dev + 'inventory/update'
                } else {
                    url = __URL.dev + 'inventory/add'
                }
                this.saveAjax(url)
            }
            if (this.edit === 1) { //查看
                this.edit = 2
            }
        },
        getWarehouseName(){
            for(var i=0;i<this.wareData.length;i++){
                if(this.codeInitItem.warehouseCode==this.wareData[i].warehouseCode){
                    this.codeInitItem.warehouseName=this.wareData[i].warehouseName
                }
            }
        },
        saveAjax(url) {
            //新增和编辑的数据结构不一样！
            if(this.codeInitItem.developmentVo){
                if(this.codeInitItem.developmentVo.employeeCode==''){
                    this.warnMod(true,'开发工程师不能为空', 'failure')
                    return
                }
            }else{
                if(this.codeInitItem.employeeCode==''){
                    this.warnMod(true,'开发工程师不能为空', 'failure')
                    return
                }
            }
            this.$http.post(url, this.codeInitItem).then(
                (res) => {
                    if (res.data.success) {
                        this.warnMod(true, '保存成功！')
                        this.$emit('cb')
                    } else {
                        this.warnMod(true, res.data.errMsg, 'failure')
                    }
                }
            )
        },
        quite() {
            if (this.edit === 1) {
                this.alertCfg.show = true
            } else {
                this.$emit('cb')
            }
        },
        sureDel() {
            this.$http.get(__URL.dev + 'inventory/delete/' + this.data.inventoryId).then(
                res => {
                    if (res.data.success) {
                        this.warnMod(true, '删除成功！');
                        this.$emit('cb');
                    } else {
                        this.warnMod(true, res.data.errMsg, 'failure')
                    }
                }
            )
        },
        // warning弹框公用方法
        warnMod(bol, ctx, type) {
            type ? this.wCfg.type = type : this.wCfg.type = 'success'
            this.wCfg.content = ctx
            this.wCfg.show = bol
        },
        disable(){
            this.$http.get(__URL.dev + 'inventory/disable/' + this.codeInitItem.inventoryId).then(
                res => {
                    if (res.data.success) {
                        this.warnMod(true, '停用成功！');
                        this.$emit('cb');
                    } else {
                        this.warnMod(true, res.data.errMsg, 'failure')
                    }
                }
            );
        },
        enable(){
            this.$http.get(__URL.dev + 'inventory/enable/' + this.codeInitItem.inventoryId).then(
                res => {
                    if (res.data.success) {
                        this.warnMod(true, '启用成功！');
                        this.$emit('cb');
                    } else {
                        this.warnMod(true, res.data.errMsg, 'failure')
                    }
                }
            );
        },
        cancel:function(){
            this.$emit('cb');
            // this.$emit('refresh')
        },
        changeInventoryType(){
            if(this.codeInitItem.inventoryTypeCode=='001'){
                this.codeInitItem.inventoryTypeName='成品'
            }else if(this.codeInitItem.inventoryTypeCode=='002'){
                this.codeInitItem.inventoryTypeName='半成品'
            }else if(this.codeInitItem.inventoryTypeCode=='003'){
                this.codeInitItem.inventoryTypeName='原料'
            }
        }
    },
    filters: {
        getAttr: {
            twoWay: true,
            read(val) {
                if(val!==-1){
                    this.codeInitItem.attributeName = this.attributeName[val].value;
                }
                return val
            },
            write(val, oldval) {
                return val
            }
        }
    },
    computed: {
        isEdit() {
            return this.edit !== 1
        },
        add() {
            return this.edit == 0
        },
        getDevelopment(){
            if(this.edit == 2){
                return this.tab!='tab3'?this.codeInitItem:this.codeInitItem.developmentVo;
            }
            if(this.edit != 2){
                return this.codeInitItem.developmentVo;
            }
        }
    }
}
</script>
<template>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag">货品档案信息</h2>
            <div class="block">
                <div class="form-box inner-item">
                    <!-- <pre class="rr">{{codeInitItem | json}}</pre> -->
                    <div class="form-group">
                        <label><span v-if="edit !== 1" class="must-point">*</span>货品编码:</label>
                        <input v-if='edit !== 1' maxlength='128' type="text" v-model='codeInitItem.inventoryCode'>
                        <p v-else>{{codeInitItem.inventoryCode}}</p>
                    </div>
                    <div class="form-group">
                        <label><span v-if="edit !== 1" class="must-point">*</span>货品名称:</label>
                        <input v-if='edit !== 1' maxlength='128' type="text" v-model='codeInitItem.inventoryName'>
                        <p v-else>{{codeInitItem.inventoryName}}</p>
                    </div>
                    <div class="form-group">
                        <label>规格型号:</label>
                        <input v-if='edit !== 1' type="text" v-model='codeInitItem.inventorySpec'>
                        <p v-else>{{codeInitItem.inventorySpec}}</p>
                    </div>
                    <div class="form-group">
                        <label><span v-if="edit !== 1" class="must-point">*</span>货品分类:</label>
                        <!-- :data.sync='codeInitItem.secondInventoryCategoryName' -->
                        <div class="s-input ic2"  v-if='edit !== 1'>
                            <input placeholder='请选择'  readonly type="text" v-model='codeInitItem.secondInventoryCategoryName'>
                            <i @click='clearInvent' v-show='codeInitItem.secondInventoryCategoryName' class="icon-close__round r2" ></i>
                            <i @click='openInvent' class="icon-search r1"></i>
                        </div>

                        <p v-else>{{codeInitItem.secondInventoryCategoryName}}</p>
                    </div>
                    <div class="form-group">
                        <label><span v-if="edit !== 1" class="must-point">*</span>货品属性:</label>
                        <select v-if='edit !== 1' v-model='codeInitItem.attributeCode | getAttr'>
                            <option v-for='attr in attributeName' :value='attr.key'>{{attr.value}}</option>
                        </select>
                        <p v-else>{{codeInitItem.attributeName}}</p>
                    </div>
                    <div class="form-group">
                        <label><span v-if="edit !== 1" class="must-point">*</span>计量单位:</label>
                        <unit v-if='edit !== 1' :data='codeInitItem.unitName' @cb='getUnit'></unit>
                        <p v-else>{{codeInitItem.unitName}}</p>
                    </div>
                    <div class="form-group">
                        <label><span v-if="edit !== 1" class="must-point">*</span>存货类别:</label>
                        <select v-if='edit !== 1' @change='changeInventoryType' v-model="codeInitItem.inventoryTypeCode" placeholder="请选择类别">
                            <option v-for="item in typeData" :value="item.inventoryTypeCode">{{item.inventoryTypeName}}</option>
                        </select>
                        <p v-else>{{codeInitItem.inventoryTypeName}}</p>
                    </div>
                    <div class="form-group">
                        <label><span v-if="edit !== 1" class="must-point">*</span>默认仓库:</label>
                        <select v-if='edit !== 1' v-model='codeInitItem.warehouseCode'>
                            <option v-for='item in wareData' :value='item.warehouseCode'>{{item.warehouseName}}</option>
                        </select>
                        <p v-else>{{codeInitItem.warehouseName}}</p>
                    </div>
                    <div class="form-group">
                        <label>进口物料:</label>
                        <select v-if='edit !== 1' v-model="codeInitItem.importation">
                            <option v-for="item in importation" :value="item.code">{{item.name}}</option>
                        </select>
                        <p v-else>{{codeInitItem.importation=='1'?'是':'否'}}</p>
                    </div>
                </div>
                <div class="uploadBox inner-item">
                    <div class="form-group wd-100">
                        <label>上传附件:</label>
                        <upfile-group :data='codeInitItem.files' :edit="isEdit || add"></upfile-group>
                    </div>
                    <div class="form-group wd-100">
                        <label>上传图片:</label>
                        <upfile-group :data='codeInitItem.images' :edit="isEdit || add"></upfile-group>
                    </div>
                    <div class="form-group">
                        <label>备注:</label>
                        <input v-if='edit !== 1' type="text" v-model='codeInitItem.remark'>
                        <p v-else>{{codeInitItem.remark}}</p>
                    </div>
                </div>
                <div class="tabBox inner-item">
                    <tab-bar :config.sync='tabConfig'></tab-bar>
                    <tab-container :active.sync='tabConfig.select'>
                        <tab-item id='tab1'>
                            <dev :data.sync='getDevelopment' :edit='edit !== 1'></dev>
                        </tab-item>
                        <tab-item id='tab2'>
                            <sale :data.sync='codeInitItem.customerVos' :edit='edit !==1'></sale>
                        </tab-item>
                        <tab-item id='tab3'>
                            <purchase :data.sync='codeInitItem.supplierVos' :edit='edit !==1'></purchase>
                        </tab-item>
                    </tab-container>
                </div>
            </div>
        </div>
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" @click='cancel'>取消</button>
        <button class="btn-xl-imp" v-if="edit == 1" @click='saveInv'>编辑</button>
        <ajax-button class="btn-xl-imp" v-if="edit !== 1 && tab != 'tab3'" @click='saveInvToDraft'>保存草稿</ajax-button>
        <ajax-button class="btn-xl-imp" v-if="edit !== 1" @click='saveInv'>保存</ajax-button>
        <!--<button v-if="!(edit !== 1)" class="btn-xl-def" @click='cancel'>关闭</button>
        <button v-else class="btn-xl-def" @click='cancel'>取消</button>
        <button class="btn-xl-danger" v-if="codeInitItem.inventoryId && type == 1 " @click='disable'>停用</button>
        <button class="btn-xl-imp" v-if="codeInitItem.inventoryId && type == 2 " @click='enable'>启用</button>
        <button class="btn-xl-imp" v-if="!other && type == 1" @click='saveInv'>{{edit === 1 ? '编辑' : '保存'}}</button>-->
    </div>
    <category-inventory :config='inventoryCfg'  @cb='getInvent'></category-inventory>
    <warning :config='wCfg'></warning>
    <alert :config='alertCfg' @cb='sureDel'></alert>
</template>
<style lang='less' scoped>
@import '../../../../../public/css/variable.less';
.inner-wrapper {
    background-color: @gray-dark;
}
</style>
