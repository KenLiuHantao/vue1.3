<script>
import process from 'nb/refer/process.vue'

import cfg from './cfg.js'

export default {
    props: {
        'data': {
            type: Object,
            default () {
                return new Object
            }
        },
        'type': {
            type: Number,
            default () {
                return 1
            }
        },
        'fromsale':{
            default(){
                return false
            }
        },
        'docstatus':{
            default(){
                return 1
            }
        }
    },
    data() {
        return {
            initData: cfg.initBoxData,
            mount: 0,
            numMount: 0
        }
    },
    watch: {
        data: {
            handler(val) {
                this.mount = 0
                this.getWorkPrice(val)
                this.mount = (this.mount).toFixed(2);
                if(undefined != this.data.processVo){
                    var manuQuantity = undefined != this.data.processVo.manuQuantity ? this.data.processVo.manuQuantity : 0;
                    if(manuQuantity > 0){
                        this.numMount = (this.mount / manuQuantity).toFixed(2)
                    }else{
                        this.numMount = 0;
                    }
                }
            },
            deep: true
        }
    },
    components: {
    },
    methods: {
        add(a, b) {
            let na = Number(a) * Math.pow(10, 6),
                nb = Number(b) * Math.pow(10, 6)
            return (na + nb) / Math.pow(10, 6)
        },
        getWorkPrice(item) {
            if (this.hasProcess(item)) {
                //在计算含税成本的时候不计算自制件的加工价格
                if(item.attributeCode!='2'){
                    this.mount = this.add(this.mount, item.processVo.workAmount)
                }
            }

            if (this.hasChildren(item)) {
                for (let i = 0; i < item.children.length; i++) {
                    this.mount = this.add(this.mount, item.children[i].supplierAmount)

                    if (this.hasChildBom(item.children[i])) {
                        this.getWorkPrice(item.children[i].childBom)
                    }
                }
            }
        },
        hasProcess(obj) {
            let isTrue = false
            if (obj.processVo != undefined && obj.processVo != null) {
                isTrue = true
            }
            return isTrue
        },
        hasChildren(obj) {
            let isTrue = false
            if (obj.children != null || (obj.children && obj.children.length)) {
                isTrue = true
            }
            return isTrue
        },
        hasChildBom(obj) {
            let isTrue = false
            if (obj.childBom != undefined && obj.childBom != null && Object.keys(obj.childBom).length != 0) {
                isTrue = true
            }
            return isTrue
        }
    },
    computed: {
        isEdit() {
            if(this.docstatus==-1 && this.fromsale){
                return false
            }
            let i = this.type == 1
            return !i
        }
    },
    ready(){
        this.mount = 0
        this.getWorkPrice(this.data);
        this.mount = (this.mount).toFixed(2);
        if(undefined != this.data.processVo){
            var manuQuantity = undefined != this.data.processVo.manuQuantity ? this.data.processVo.manuQuantity : 0;
            if(manuQuantity > 0){
                this.numMount = (this.mount / manuQuantity).toFixed(2)
            }else{
                this.numMount = 0;
            }
        }
    }
}

</script>
<template>
    <div class="treeTable">
        <tret :data.sync='data' :edit='isEdit' :fromsale='fromsale'></tret>
    </div>
    <div v-show='!fromsale' class="form-group tt_foot">
        <label>单位含税成本:</label>
        <p>{{ numMount }}</p>
        <label>订单含税成本:</label>
        <p>{{mount}}</p>
    </div>
</template>
<style lang='less' >
    @import '../../../public/css/variable.less';
    .double{
        label{
            width: 40%;
            height: 24px;
            line-height: 24px;
            margin: 0 0 5px 0;
            display:inline-block;
        }
        input[type='text']{
            width: 60% !important;
            height: 24px;
            line-height: 24px;
            margin: 0 0 5px 0;
        } 
    }
    .fileGroup{
        float: left;
        label{
            margin-left: 10px;
        }
        .up-wrap{
            display: inline-block;
        }
    }
    .wd1 {
        display: flex;
        flex-wrap: wrap;
        width: 20%;
        justify-content: center;
        > * {
            width: 100%;
            margin: 5px 0;
            text-align: center;
        }
        > span {
            width: 100% !important;
        }
        > input {
            text-align: left;
        }
        > a {
            text-align: center;
        }
        &.cnt {
            /*text-align: center;*/
            padding: 0 20px;
        }
    }

    .tt_foot {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin: 15px 0;
        font-size: 14px;
        color: #757575;
        p {
            padding-right: 20px;
        }
    }

    .ser {
        width: 53px;
        position: relative;
        .icon-select:after {
            display: inline-block;
            transform: rotate(-90deg);
            transition: all .2s linear;
        }
        .open {
            &:after {
                color: @link-color !important;
                transform: rotate(0deg);
            }
            &:before {
                content: '';
                display: inline-block;
                position: absolute;
                width: 10px;
                height: 40px;
                background-color: transparent;
                border-left: 1px solid #7ED321;
                border-bottom: 1px solid #7ED321;
                top: 67px;
                left: -4px;
            }
        }
    }

    .itemGroup {
        width: 100%;
        align-items: center;
    }

    .treeTable {
        width: 100%;
        border-bottom: 1px solid @border-color;
        ul > ul {
            padding-left: 15px;
            border-bottom: 1px solid @border-color;
        }
        .table-ul>li {
            display: flex;
            align-items: center;
            flex-wrap: nowrap;
            height: 46px;
            border-bottom: 1px solid @border-color;
            font-size: 12px;
            color: @gray-sub;
            &.head {
                padding: 0 15px;
                background-color: #EBF7FD;
                border-left: 2px solid @link-color;
                color:#37474f;
                height: 66px;
            }
            &.child {
                border-left-color: #7ED321
            }
            input[type='text'] {
                width: 100%;
            }
            .addItem {
                width: 30%;
                text-align: right;
                .sql{
                    display: flex;
                    float: left;
                    label{
                        margin-top: 20px;
                        height: 33px;
                    }
                }
                >a{
                    /*margin-top: 20px;*/
                    display: inline-block;
                }
            }
            .infoItem {
                display: flex;
                align-items: center;
                width: 70%;
            }
            &.bodyHead {
                height: 33px;
                background-color: #f7f8fc;
                .bdhead {
                    color: #757575;
                }
            }
            &.bodyCnt {
                height: 142px;
                color: #212121 !important;
                &:last-of-type {
                    border-bottom: none;
                }
            }
        }
    }
    .icon-add {
        display: inline-block;
        padding: 2px;
        border: 2px solid;
        border-radius: 50%;
        transform: scale(.8);
    }
</style>
