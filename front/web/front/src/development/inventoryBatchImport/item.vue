<script>
import unit from 'nb/unit/app'
export default {
    components: {
        unit,
    },
    props: ['config', 'data'],
    watch: {
        config: {
            deep: true,
            handler(val, old) {
                this.modalCfg.show = val.show
            }
        },
        modalCfg: {
            deep: true,
            handler(val, old) {
                this.config.show = val.show
            }
        }
    },
    ready() {
        let params = {
            "pageIndex": 0,
            "pageSize": 0
        }
        this.$http.post(__URL.arc + 'warehouse/find/ref', params).then(
            (res) => {
                this.wareData = res.data.data.dataList;
            }
        )
    },
    data() {
        return {
            modalCfg: {
                show: false,
                header: '货品信息',
                width: '450px',
                height: '550px',
                btn:[{
                    name:'关闭',
                    emit:'quite'
                },{
                    name:'确定',
                    emit:'sure'
                }]
            },
            msgCfg: {
                show: false,
                type: 'success',
                content: ''
            },
            attributeGroup: [{
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
            typeGroup: [{
                key: '001',
                value: '成品'
            }, {
                key: '002',
                value: '半成品'
            }, {
                key: '003',
                value: '原料'
            }],
            empMod: {
                show: false
            },
            proMod: {
                show: false
            },
            deptMod:{
                show:false
            },
            deptEmpMod:{
                show:false
            },
            inventoryCategoryCfg:{
                show:false
            }
        }
    },
    methods: {
        copyParam(base, target) {
            let tk = Object.keys(target)

            for (let i in base) {
                if (tk.indexOf(i) != -1) {
                    target[i] = base[i]
                }
            }
        },
        saveItem() {
            this.$http.post(__URL.osiu + 'import/inventory/update', this.data).then(
                res => {
                    if (res.data.success) {
                        this.msgCfg.type = 'success'
                        this.msgCfg.content = res.data.data
                        this.config.show = false;
                        this.$parent.refresh();
                    } else {
                        this.msgCfg.type = 'failure';
                        this.msgCfg.content = res.data.errMsg;
                    }
                    this.msgCfg.show = true;
                }
            )
        },
        quite() {
            this.config.show = false;
            //this.$parent.refresh();
        },
        /* 币种操作 */
        getUnit(item) {
            this.copyParam(item, this.data)
        },
        getEmployee(item) {
            this.empMod.show = false
            this.copyParam(item, this.data)
        },
        getDepartmentEmployee(item) {
            this.empMod.show = false
            this.data.departmentEmployeeCode = item.employeeCode;
            this.data.departmentEmployeeName = item.employeeName;
        },
        getProcess(item) {
            this.proMod.show = false
            this.copyParam(item, this.data)
        },
        getDepartment(item) {
            this.deptMod.show = false
            this.copyParam(item, this.data)
        },
        openEmp(ind) {
            this.empMod.show = true
        },
        openDeptEmp(ind) {
            this.deptEmpMod.show = true
        },
        openPro(ind) {
            this.proMod.show = true
        },
        clearDepartment(){
            this.data.departmentName='';
            this.data.departmentCode='';
        },
        clearDepartmentEmployee(){
            this.data.departmentEmployeeName='';
            this.data.departmentEmployeeCode='';
        },
        clearEmployee(){
            this.data.employeeName='';
            this.data.employeeCode='';
        },
        clearProcess(){
            this.data.processName='';
            this.data.processCode='';
        },
        openDept(){
            this.deptMod.show=true;
        },
        openDeptEmp(){
            this.deptEmpMod.show = true;
        },
        getInventoryCategory(item) {
            this.data.firstIndustryCategoryCode=item.firstIndustryCategoryCode
            this.data.firstIndustryCategoryName=item.firstIndustryCategoryName
            this.data.secondIndustryCategoryCode=item.secondIndustryCategoryCode
            this.data.secondIndustryCategoryName=item.secondIndustryCategoryName
            this.data.firstInventoryCategoryCode=item.firstInventoryCategoryCode
            this.data.firstInventoryCategoryName=item.firstInventoryCategoryName
            this.data.secondInventoryCategoryCode=item.secondInventoryCategoryCode
            this.data.secondInventoryCategoryName=item.secondInventoryCategoryName
            this.data.inventoryTypeCode=item.inventoryTypeCode
            this.data.inventoryTypeName=item.inventoryTypeName
        },
        clearInventoryCategory(){
            this.data.firstIndustryCategoryCode=''
            this.data.firstIndustryCategoryName=''
            this.data.secondIndustryCategoryCode=''
            this.data.secondIndustryCategoryName=''
            this.data.firstInventoryCategoryCode=''
            this.data.firstInventoryCategoryName=''
            this.data.secondInventoryCategoryCode=''
            this.data.secondInventoryCategoryName=''
            this.data.inventoryTypeCode=''
            this.data.inventoryTypeName=''
        },
        changeWarehouse(){
            for(var i=0;i<this.wareData.length;i++){
                if(this.data.warehouseCode==this.wareData[i].warehouseCode){
                    this.data.warehouseName=this.wareData[i].warehouseName;
                }
            }
        }
    },
    filters: {
        getAttr: {
            twoWay: true,
            read(val) {
                return val
            },
            write(val, oldval) {
                return val
            }
        },
        getType:{
            twoWay: true,
            read(val) {
                return val
            },
            write(val, oldval) {
                return val
            }
        }
    }
}
</script>
<template>
    <modal :config.sync='modalCfg' @sure='saveItem' @quite='quite'>
        <div class="cont">
            <div class="form-group">
                <label><span class="must-point">*</span>货品分类:</label>
                <div class="s-input">
                    <input placeholder='请选择货品分类'  readonly type="text" v-model='data.secondInventoryCategoryName'>
                    <i @click='clearInventoryCategory' v-show='data.secondInventoryCategoryName' class="icon-close__round r2" ></i>
                    <i @click='inventoryCategoryCfg.show=true' class="icon-search r1"></i>
                </div>
            </div>
            <div class="form-group">
                <label><span class="must-point">*</span>货品编码:</label>
                <div class="s-input">
                    <input type="text" placeholder='请输入货品编码' v-model='data.inventoryCode' maxlength="40">
                </div>
            </div>
            <div class="form-group">
                <label><span class="must-point">*</span>货品名称:</label>
                <div class="s-input">
                    <input type="text" placeholder='请输入货品名称' v-model='data.inventoryName' maxlength="60">
                </div>
            </div>
            <div class="form-group">
                <label><span class="must-point">*</span>规格型号:</label>
                <div class="s-input">
                    <input type="text" placeholder='请输入规格型号' v-model='data.inventorySpec' maxlength="80">
                </div>
            </div>
            <div class="form-group">
                <label><span class="must-point">*</span>货品类别:</label>
                <div class="s-input">
                    <select v-model='data.inventoryTypeName | getType'>
                        <option v-for='type in typeGroup' :value='type.value'>{{type.value}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label><span class="must-point">*</span>计量单位:</label>
                <unit :data='data.unitName' @cb='getUnit'></unit>
            </div>
            <div class="form-group">
                <label><span class="must-point">*</span>货品属性:</label>
                <div class="s-input">
                    <select v-model='data.attributeName | getAttr'>
                        <option v-for='attr in attributeGroup' :value='attr.value'>{{attr.value}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label><span class="must-point">*</span>默认仓库:</label>
                <div class="s-input">
                    <select v-model='data.warehouseCode' @change='changeWarehouse'>
                        <option v-for='item in wareData' :value='item.warehouseCode'>{{item.warehouseName}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>开发工程师:</label>
                <div class="s-input">
                    <input type="text" placeholder="请选择开发工程师" readonly v-model='data.employeeName'>
                    <i @click='clearEmployee' v-show='data.employeeName' class="icon-close__round r2" ></i>
                    <i class="icon-search r1" @click='openEmp'></i>
                </div>
            </div>
            <div class="form-group">
                <label>工序:</label>
                <div class="s-input">
                    <input readonly placeholder='请选择工序' type="text" v-model='data.processName'>
                    <i @click='clearProcess' v-show='data.processName' class="icon-close__round r2" ></i>
                    <i class="icon-search r1" @click='openPro'></i>
                </div>
            </div>
            <div class="form-group">
                <label>损耗率(%):</label>
                <div class="s-input">
                    <input type="text" v-model='data.lossRate' maxlength="5" onkeyup="value=value.replace(/[^\d\.]/g,'')">
                </div>
            </div>
            <div class="form-group">
                <label>生产班组:</label>
                <div class="s-input">
                    <input placeholder='请选择生产班组'  readonly type="text" v-model='data.departmentName'>
                    <i @click='clearDepartment' v-show='data.departmentName' class="icon-close__round r2" ></i>
                    <i @click='openDept' class="icon-search r1"></i>
                </div>
            </div>
            <div class="form-group">
                <label>班组负责人:</label>
                <div class="s-input">
                    <input placeholder='请选择班组负责人' readonly type="text" v-model='data.departmentEmployeeName'>
                    <i @click='clearDepartmentEmployee' v-show='data.departmentEmployeeName' class="icon-close__round r2" ></i>
                    <i class="icon-search r1" @click='openDeptEmp'></i>
                </div>
            </div>
            <div class="form-group">
                <label>最小包装量:</label>
                <div class="s-input">
                    <input type="text" onkeyup="value=value.replace(/[^\d\.]/g,'')" v-model='data.minPackQty' maxlength="10">
                </div>
            </div>
        </div>
    </modal>
    <warning :config='msgCfg'></warning>
    <refer-employee :config.sync='empMod' @cb='getEmployee'></refer-employee>
    <refer-employee :config.sync='deptEmpMod' @cb='getDepartmentEmployee'></refer-employee>
    <refer-process :config.sync='proMod' @cb='getProcess'></refer-process>
    <refer-department :config.sync='deptMod' @cb='getDepartment'></refer-department>
    <category-inventory :config='inventoryCategoryCfg'  @cb='getInventoryCategory'></inventory-category>
</template>
<style lang='less' scoped>

.cont {
    height: 440px;
    padding: 15px 0;
    overflow-y: scroll;
}
</style>
