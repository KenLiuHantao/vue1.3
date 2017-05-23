<script>
import inp from 'nc/input/app'
import inv from 'nb/refer/inventory.vue'
import pro from 'nb/refer/supplier'
import cfg from './cfg.js'

export default {
    components: {
        inp,
        inv,
        pro
    },
    props: ['data', 'ind', 'edit', 'manu'],
    data() {
        return {
            openLast: false,
            children: {},
            invCfg: {
                show: false
            },
            proCfg: {
                show: false
            },
            invType: 0,
            alertCfg: {
                show: false,
                msg: '是否删除当前这条信息，删除后将无法找回！'
            },
            msgCfg: {
                show: true,
                msg: '删除成功！'
            },
            delCfg:{
                type: 'failure',
                show: false,
                msg: '是否删除当前这条数据，删除后将无法找回！'
            },
        }
    },
    methods: {
        isType(type) {
            return function(obj) {
                return toString.call(obj) == '[object ' + type + ']';
            }
        },
        copy(from, to) {
            let arr = Object.keys(to),
                fromArr = Object.keys(from)
            fromArr.forEach((item) => {
                if (item !== 'recordVersion' && item !== 'recordStatus' && item != 'recordId' && !this.isType('Object')(to[item]) && !this.isType('Array')(to[item])) {
                    if (arr.indexOf(item)) {
                        to[item] = from[item]
                    }
                }
            })
            if(from.inventoryId){
                to.inventoryId=from.inventoryId
            }
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
        deepCopy(from, to) {
            let arr = Object.keys(to)
            arr.forEach((item) => {
                if (!this.isType('Object')(to[item]) && !this.isType('Array')(to[item])) {
                    to[item] = from[item]
                }
            })
        },
        getChild() {
            let item = this.data
            if (this.data.childBom == null) {
                if (this.openLast) {
                    this.openLast = false
                }
            } else {
                this.openLast = !this.openLast
            }

        },
        openInv(type) {
            this.invType = type
            this.invCfg.show = true
        },
        openPro() {
            this.proCfg.show = true
        },
        getInv(item) {
            let inv = this.data;
            this.copy(item, inv);
            //先去除之前的子集
            this.data.last=false;
            this.openLast = false;
            this.data.childBom=null;
            //再判断新增的产品有没有bom
            inv.attributeCode = item.attributeCode;
            //如果是自制件或委外加工件则去获取是否存在bom,有则拿过来
            if("1" == item.attributeCode || "2" == item.attributeCode){
                this.$http.get(__URL.dev + 'product/bom/get/exist/1/'+item.inventoryId).then(
                    (res) => {
                        if(null != res.data.data){
                            this.data.last = true;
                            this.data.childBom = res.data.data
                            this.openLast = true
                        }
                    }
                )
            }
        },
        getPro(item) {
            this.proCfg.show = false
            let inv = this.data
            this.copy(item, inv)
        },
        addProBox() {
            this.data.childBom = JSON.parse(JSON.stringify(cfg.initBoxData))
            this.data.childBom.processVo.manuQuantity = this.data.manuPlanQuantity
            //拿到货品属性 判断新增的工序能否编辑
            this.data.childBom.attributeCode=this.data.attributeCode;
            this.data.childBom.attributeName=this.data.attributeName;
            //如果是委外件 加工单价要带出来
            if(this.data.childBom.attributeCode==2){
                this.data.childBom.processVo.workPrice=this.data.supplierAmount
                this.data.childBom.processVo.workAmount=(this.data.supplierAmount*this.data.manuPlanQuantity).toFixed(2)
            }
            this.data.last = true
            this.openLast = true
        },
        delItem() {
            this.delCfg.show=true;
        },
        sureDel(){
            this.$emit('del')
        },
        sure() {
        }
    },
    filters: {
        quantity(val) {
            let manu = 0,
                rate = this.multi(this.data.lossRate, Math.pow(10, -2))

            manu = this.data.manuQuantity = this.multi(val, this.manu)
            this.data.manuPlanQuantity = (manu*1000000 + this.multi(manu, rate)*1000000)/1000000

            return val
        },
        getAmout(val) {
            this.data.supplierAmount = this.multi(val, this.data.manuPlanQuantity).toFixed(2)
            return val
        },
        setManu(val) {
            if (this.data.childBom != null && Object.keys(this.data.childBom).length) {
                this.data.childBom.processVo.manuQuantity = parseFloat(val).toFixed(2)
            }
            return parseFloat(val).toFixed(2)
        },
        lossRate:{
            twoWay: true,
            write(val){
                var reg=/^\d{1,2}(\.\d{1,2})?$/
                if(reg.test(val)){
                    return val
                }else{
                    return 0
                }
            }
        }
    },
    computed: {
        hasChild() {
            return this.data.last
        },
        proVo() {
            return {
                "departmentCode": '',
                "departmentEmployeeCode": "",
                "departmentEmployeeName": "",
                "departmentName": '',
                "docNo": "",
                "docVersion": 0,
                "manuQuantity": this.data.manuPlanQuantity == undefined ? 0 :this.data.manuPlanQuantity,
                "processCode": '',
                "processName": '',
                "recordId": "",
                "recordVersion": 0,
                "workAmount": 0,
                "workPrice": 0
            }
        }
    },
    
}

</script>
<template>
    <li class='bodyCnt'>
        <div class='ser'>
            <i @click='getChild' v-show='hasChild' class="icon-select_caret" :class='{"open":openLast}'></i> {{ind + 1}}
        </div>
        <div class='wd1'>
            <div v-if='edit' class='s-input'>
                <input type='text' placeholder='编码' v-model='data.inventoryCode'>
                <i class='icon-search r1' @click='openInv(0)'></i>
            </div>
            <p v-if='!edit'>{{data.inventoryCode}}</p>
            <div v-if='edit' class='s-input'>
                <input type='text' placeholder='名称' v-model='data.inventoryName'>
                <i class='icon-search r1' @click='openInv(1)'></i>
            </div>
            <p v-if='!edit'>{{data.inventoryName}}</p>
            <div class='itemGroup'>
                <label v-if='edit'>属性:{{data.attributeName}}</label>
                <p v-if='!edit'>属性:{{data.attributeName}}</p>
            </div>
            <div class='itemGroup'>
                <label v-if='edit'>规格型号:{{data.inventorySpec}}</label>
                <p v-if='!edit'>规格型号:{{data.inventorySpec}}</p>
            </div>
        </div>
        <div class='wd1'>{{data.unitName}}</div>
        <div class='wd1'>
            <template v-if='data.attributeName != ""'>
                <inp v-if='edit' key='quantity' :code.sync='data.quantity | quantity' placeholder='单位用量'></inp>
            </template>
            <p v-if='!edit'>{{data.quantity}}</p>
        </div>
        <div class='wd1'>{{data.manuQuantity}}</div>
        <div class='wd1'>
            <input v-if='edit' type='text' placeholder='损耗率' v-model='data.lossRate | lossRate'>
            <p v-if='!edit'>{{data.lossRate}}</p>
        </div>
        <div class='wd1'>{{data.manuPlanQuantity | setManu}}</div>
        <div class='wd1' v-show='data.attributeCode==1'></div>
        <div class='wd1' v-show='data.attributeCode!=1'>
            <div v-if='edit' class='s-input'>
                <input v-model='data.supplierName' type='text' placeholder='供应商'>
                <i class='icon-search r1' @click='openPro'></i>
            </div>
            <p v-if='!edit'>{{data.supplierName}}</p>
            <inp v-if='edit' key='price' :code.sync='data.supplierPrice | getAmout' placeholder='单价'></inp>
            <p v-if='!edit'>{{data.supplierPrice}}</p>
            <div class='itemGroup'>
                <label v-if='edit'>金额:{{data.supplierAmount}}</label>
                <p v-if='!edit'>金额:{{data.supplierAmount}}</p>
            </div>
        </div>
        <div class='wd1 cnt'>
            <a v-if='edit && !hasChild && (data.attributeCode ==1)' href="javascript:;"
               @click='addProBox'>新增工序</a>
             <a v-if='edit && !hasChild && (data.attributeCode ==2)' href="javascript:;"
               @click='addProBox'>新增子件</a>
            <a v-if='!hasChild && edit' href='javascript:;' @click='delItem' class="delete">删除</a>
        </div>
    </li>
    <template v-if='hasChild && openLast'>
        <tret1 :data.sync='data.childBom' :edit='edit'></tret1>
    </template>
    <alert :config='alertCfg' @cb='sure'></alert>
    <alert :config='delCfg' @cb='sureDel'></alert>
    <message :config='msgCfg'></message>
    <inv :config='invCfg' @cb='getInv'></inv>
    <pro :config='proCfg' @cb='getPro'></pro>
</template>
<style lang='less' scoped>
    .ser {
        .icon-select_caret:after {
            display: inline-block;
            transform: rotate(-90deg);
            transition: all .2s linear;
            color: #757575;
            cursor: pointer;
        }
        .open:after {
            transform: rotate(0deg);
        }
    }

    .wd1 p {
        text-align: center;
    }

    a.delete:hover {
         color: #ff0700;
     }
</style>
