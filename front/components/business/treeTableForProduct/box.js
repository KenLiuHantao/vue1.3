import Vue from 'vue'
import process from 'nb/refer/process.vue'
import inp from 'nc/input/app'
import list from './item.vue'
import upgroup from 'nb/uploadGroup/app'
import cfg from './cfg.js'

let treeBox = Vue.extend({
    name: 'treetable',
    props: ['data', 'edit'],
    components: {
        process,
        inp,
        list,
        upgroup
    },
    template: "<ul class='table-ul'>" +
        "<li class='head' :class='{\"child\":isChild}'>" +
        "        <div class='infoItem'>" +
        "            <div class='wd1'>" +
        "                <div v-if='edit && data.attributeCode!=2' class='s-input'>" +
        "                    <input type='text' placeholder='工序' v-model='proVo.processName'>" +
        "                    <i class='icon-search r1' @click='openPro'></i>" +
        "                </div>" +
        "                <p v-if='!edit || data.attributeCode==2'>{{proVo.processName}}</p>" +
        "            </div>" +
        "            <div class='wd1 double'>" +
        "                <div style='margin:0' v-if='edit && data.attributeCode!=2' class='s-input'>" +
        "                    <label v-if='edit && data.attributeCode!=2'>生产班组:</label><input type='text' placeholder='生产班组' v-model='proVo.departmentName'>" +
        "                    <i class='icon-search r1' @click='depMod.show=true'></i>" +
        "                </div>" +
        "                <div style='margin:0' v-if='edit && data.attributeCode!=2' class='s-input'>" +
        "                    <label v-if='edit && data.attributeCode!=2'>班组负责人:</label><input type='text' placeholder='班组负责人' v-model='proVo.departmentEmployeeName'>" +
        "                    <i class='icon-search r1' @click='empMod.show=true'></i>" +
        "                </div>" +       
        "                <span v-if='!edit || data.attributeCode==2'>生产班组:{{proVo.departmentName}}</span>" +
        "                <span v-if='!edit || data.attributeCode==2'>班组负责人:{{proVo.departmentEmployeeName}}</span>"  +
        "            </div>" +
        "            <div class='wd1'>" +
        "                <span v-if='edit'>产品数量:{{proVo.manuQuantity}}</span>" +
        "                <p v-if='!edit'>产品数量:{{proVo.manuQuantity}}</p>" +
        "            </div>" +
        "            <div class='wd1 double'>" +
        "                <label v-if='edit'>加工单价:</label><inp v-if='edit'  key='price' placeholder='加工单价' :code.sync='proVo.workPrice | getWorkAmount'></inp>" +
        "                <label v-if='edit'>加工金额:</label><input v-if='edit'  type='text' v-model='proVo.workAmount' disabled>" +
        "                <p v-if='!edit '>加工单价:{{proVo.workPrice}}</p>" +
        "                <p v-if='!edit '>加工金额:{{proVo.workAmount}}</p>" +
        "            </div>" +
        "            <div class='wd1 double'>" +
        "                <label v-if='edit && data.attributeCode!=2'>单位工时:</label><inp v-if='edit && data.attributeCode!=2' key='price' placeholder='单位工时' :code.sync='proVo.unitWorkingHours | getProcessWorkingHours'></inp>" +
        "                <label v-if='edit && data.attributeCode!=2'>加工工时:</label><input v-if='edit && data.attributeCode!=2' type='text' v-model='proVo.processWorkingHours' disabled></input>" +
        "                <p v-if='!edit || data.attributeCode==2'>单位工时:{{proVo.unitWorkingHours}}</p>" +
        "                <p v-if='!edit || data.attributeCode==2'>加工工时:{{proVo.processWorkingHours}}</p>" +
        "            </div>" +
        "        </div>" +
        "        <div class='addItem'>" + 
        "            <a v-if='edit && parentCode' href='javascript:;' @click='addChild'>" +
        "                <i class='icon-add'></i>添加子件" +
        "            </a>" +
        "        </div>" +
        "    </li>" +
        "    <li class='bodyHead'>" +
        "        <div class='ser'></div>" +
        "        <div class='wd1 bdhead' v-for='wd in words' track-by='$index'>{{wd}}</div>" +
        "    </li>" +
        "    <list v-for='item in bomData' :ind='$index' :data.sync='item' :manu='proVo.manuQuantity' :edit='edit' @del='del($index)'></list>" +
        "</ul>" +
        "<process :config.sync='proMod' @cb='getProcess'></process>" +
        "<refer-department :config.sync='depMod' @cb='getDepartment'></refer-department>" +
        "<refer-employee :config.sync='empMod' @cb='getEmployee'></refer-employee>"
        ,
    data() {
        return {
            words: ['货品信息', '单位', '单位用量', '产品用量', '损耗率（%）', '生产计划用量', '供应商信息', ''],
            proMod: {
                show: false
            },
            depMod:{
                show:false
            },
            empMod:{
                show:false
            },
            children: [],
            openLast: false,
            initBox: cfg.initBoxData,
            initItem: cfg.childrenItem,
            uCfg:{
                limit:1,
                maxwidth:240
            },
        }
    },
    methods: {
        /* 公用方法 */
        isType(type) {
            return function(obj) {
                return toString.call(obj) == '[object ' + type + ']';
            }
        },
        copy(from, to) {
            let keys = Object.keys(from)
            keys.forEach((item) => {
                let isType = Object.prototype.toString.call(item) !== '[object Object]' && Object.prototype.toString.call(item) !== '[object Array]'
                // debugger
                if (  isType) {
                    to[item] = from[item]
                }
            })
        },
        multi(a, b) {
            a = (a == null || a == '') ? 0 : a
            b = (b == null || b == '') ? 0 : b
            let adice = a.toString().split('.').length > 1 ? a.toString().split('.')[1].length : 0,
                bdice = b.toString().split('.').length > 1 ? b.toString().split('.')[1].length : 0,
                newa = a * Math.pow(10, adice),
                newb = b * Math.pow(10, bdice)

            return parseInt(newa * newb) / Math.pow(10, adice + bdice)
        },
        /* 业务逻辑 */
        openPro(ind) {
            // this.currentIndex = ind
            this.proMod.show = true
        },
        getProcess(item) {
            this.proMod.show = false
            this.copy(item, this.data.processVo)
        },
        getDepartment(item) {
            this.depMod.show = false
            this.data.processVo.departmentName=item.name
            this.data.processVo.departmentCode=item.code
        },
        getEmployee(item) {
            this.empMod.show = false
            this.data.processVo.departmentEmployeeName=item.employeeName;
            this.data.processVo.departmentEmployeeCode=item.employeeCode;
        },
        addChild() {
            this.data.children.push(JSON.parse(JSON.stringify(this.initItem)))
        },
        del(ind) {
            if (this.data.children.length > 1) {
                this.data.children.splice(ind, 1)
            } else {
                this.data.children.splice(ind, 1)
                this.$parent.data.childBom = null
                this.$parent.data.last = false
                this.$parent.openLast = false
            }
        }
    },
    computed: {
        proVo() {
            return this.data.processVo ? this.data.processVo : false
        },
        bomData() {
            return this.data.children ? this.data.children : []
        },
        workAmount() {
            if (this.proVo) {
                this.proVo.workAmount = this.multi(this.proVo.workPrice, this.proVo.manuQuantity)
                return this.proVo.workAmount
            }
        },
        isChild() {
            let isTrue = false
            if (this.$parent.proVo) {
                isTrue = true
            }
            return isTrue
        },
        parentCode() {
            let isTrue = false
            if (this.$parent.data.attributeCode) {
                let code = this.$parent.data.attributeCode;
                (code == 1 || code == 2) ? isTrue = true: isTrue = false
            }
            return isTrue
        }
    },
    filters: {
        getWorkAmount:function(val){
            if(val){
                this.proVo.workAmount=(val*this.proVo.manuQuantity).toFixed(2)
            }
            return val
        },
        getProcessWorkingHours:function(val){
            if(val){
                this.proVo.processWorkingHours=(val*this.proVo.manuQuantity).toFixed(2)
            }
            return val
        }
    }
})

export default treeBox
