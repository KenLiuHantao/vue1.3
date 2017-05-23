<script>
    /*
     title:职能授权参照

     配置:
     config:{
         show:false, //弹框显示 true|false 必填
         },
     data:[],       //已选择的数据

     回调：
     cb(val)

     */
    import Vue from 'vue'
    import Menu from 'nc/menu/menu.vue'
    import Submenu from 'nc/menu/submenu.vue'
    import MenuItem from 'nc/menu/menuItem.vue'
    export default{
        components:{
            Menu,Submenu,MenuItem
        },
        props: {
            'config': {
                type: Object,
                required: true
            },
            'data':{
                type:Array,
                default(){
                    return []
                }
            }
        },
        data(){
            return {
                modalCfg: {
                    show: this.config.show || false,
                    width: '870px',
                    height: 'auto',
                    header: '职能授权',
                    btn: [{
                        name: '取消',
                        emit: 'quite'
                    }, {
                        name: '确定',
                        emit: 'sure'
                    }],
                },
                //部门列表
                departmentList:[],
                //岗位列表
                rolesList:[],
                //已经选中【code集合】
                checkedData:[],
                //已经选中【详情集合】
                checkedList:[],
                //原数据备份
                checkedListBak:[],
                all:false
            }
        },
        ready(){
            this.getDepartmentList()
            //将传入的初始值赋给【详情集合】
            if(this.data && this.data.length>0){
                this.checkedList = [].concat(this.data)
                this.checkedListBak = [].concat(this.data)
            }
        },
        methods:{
            getDepartmentList(){
                this.$http.post(__URL.service+'department/enabled-list').then(
                    res=>{
                        if(res.data.success){
                            this.departmentList = res.data.data
                        }
                    }
                )
            },
            getRoleList(val){
                this.$http.get(__URL.service+'role/search/departmentCode',{params:{'departmentCode':val.code}}).then(
                    res=>{
                        if(res.data.success){
                            this.rolesList = res.data.data
                        }
                    }
                )
            },
            checkThisItem(item){
                for(let i=0;i<this.checkedList.length;i++){
                    if(this.checkedList[i].code == item.code){
                        this.checkedList.splice(i,1)
                        return
                    }
                }
                this.checkedList.push(item)
            },
            removeChecked(item){
                this.checkedList = this.checkedList.filter(t=> t.code != item.code)
            },
            /*
             * 点击全选按键触发的事件
             * */
            checkAll(){
                if(this.all){
                    this.rolesList.forEach(item=>{
                        let i = this.checkedData.indexOf(item.code)
                        if(i>-1){
                            this.checkedList = this.checkedList.filter(val=>{
                                return val.code != item.code
                            })
                        }
                    })
                }else{
                    this.rolesList.forEach(item=>{
                        let i = this.checkedData.indexOf(item.code)
                        if(i<0){
                            this.checkedList.push(item)
                        }
                    })
                }
                this.all = !this.all
            },
            /*
             * 根据当前列表的所有选项是否已被选中，返回全选状态
             * */
            haveAllCheck(){
                let c = true,fl = this.rolesList
                if(fl.length > 0){
                    for(let i=0;i<fl.length;i++){
                        if(this.checkedData.indexOf(fl[i].code) < 0){
                            c = false
                            return
                        }
                    }
                }else{
                    c = false
                }
                return c
            },
            quite(){
                this.rolesList = []
                this.checkedList = [].concat(this.checkedListBak)
                this.config.show = false
            },
            sure(){
                this.rolesList = []
                this.config.show = false
                this.$emit('cb',this.checkedList)
            },
        },
        watch:{
            config:{
                handler (val, oldVal) {
                    this.modalCfg.show = val.show
                },
                deep: true
            },
            modalCfg:{
                handler (val, oldVal) {
                    this.config.show = val.show
                },
                deep: true
            },
            data:{
                handler (val, oldVal){
                    this.checkedList = [].concat(val)
                    this.checkedListBak = [].concat(val)
                },
                deep:true
            },
            /*
             * 列表数据改变后，检测全选状态
             * */
            rolesList:{
                handler (val, oldval){
                    if(this.haveAllCheck()){
                        this.all = true
                    }else{
                        this.all = false
                    }
                }
            },
            /*
             * 通过已选择【详情集合】的变化，改变已选择【code集合】
             * 检测全选状态的改变
             * */
            checkedList:{
                handler (val, oldVal){
                    this.checkedData = []
                    val.forEach(item=>{
                        this.checkedData.push(item.code)
                    })
                    if(this.haveAllCheck()){
                        this.all = true
                    }else{
                        this.all = false
                    }
                },
                deep:true
            }
        },
        beforeDestroy(){
        },
    }
</script>
<template>
    <modal :config="modalCfg" @quite="quite" @sure="sure">
        <div class="functional-wrap">
            <div class="item item-cate">
                <div class="item-head">
                    部门列表
                </div>
                <menu>
                    <submenu v-for="item in departmentList" :index="item.code" @cb="getRoleList(item)" :has-children="item.children.length>0">
                        <template slot="title">
                            {{item.name}}
                        </template>
                        <menu-item v-for="info in item.children" :index="info.code" @cb="getRoleList(info)">
                            {{info.name}}
                        </menu-item>
                    </submenu>

                </menu>
            </div>
            <div class="item item-container">
                <div class="item-head">
                    <div class="head-item" @click="checkAll" >
                        <input type="checkbox" :checked="all">岗位列表
                    </div>
                    <div class="head-item">
                        已授权职能
                    </div>
                </div>
                <ul class="container-wrap">
                    <li class="container-list" v-for="item in rolesList">
                        <div class="list list-left" @click="checkThisItem(item)">
                            <input type="checkbox" :value="item.code" v-model="checkedData">
                            <span class="role-title">{{item.name}}</span>
                        </div>
                        <div class="list list-right">
                            <ul>
                                <li v-for="info in item.relatedPostList">{{info.name}}</li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="item item-checked">
                <div class="item-head">
                    已选岗位列表
                </div>
                <ul class="item-list list-checked">
                    <li class="checked-remove" v-for="item in checkedList">
                        <span>{{item.name}}</span>
                        <button class="button-primary" @click="removeChecked(item)">移除</button>
                    </li>
                </ul>
            </div>
        </div>
    </modal>
</template>
<style lang="less" scoped>
    @import '../../../public/css/variable.less';
    .only-item{
        background-color: white!important;
    }
    .functional-wrap {
        display: flex;
        flex-direction: row;
        height: 500px;
        font-size: 12px;
        border-bottom: 1px solid @border-color;

        .item {
            display: flex;
            flex-direction: column;
            border-right: 1px solid @border-color;
            flex-shrink: 0 !important;

            &:last-of-type {
                border-right: none;
            }

            .item-head {
                height: 42px;
                border-bottom: 1px solid @border-color;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                padding-left: 15px;
                flex-shrink: 0;
                color: @gray-sub;
                cursor: pointer;
            }
            .item-list {
                overflow: auto;
                li {
                    height: 42px;
                    width: 100%;
                    border-bottom: 1px solid @border-color;
                    display: flex;
                    flex-grow: 1;
                    flex-shrink: 0;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 0 15px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
        .item-cate {
            width: 220px;
        }
        .item-container {
            width: 400px;

            .head-item{
                display: flex;
                flex: 1;
            }
            .container-wrap{
                overflow: auto;
            }
            .container-list{
                display: flex;
                flex-direction: row;
                align-items: center;
                border-bottom: 9px solid #F9F9F9;
                padding: 5px 0;
                .role-title{
                    display: flex;
                    align-items: center;
                    height: 22px;
                    padding: 0 8px;
                    background-color: #7ED321;
                    color: white;
                    border-radius: 22px;
                }
                .list{
                    display: flex;
                    flex: 1;
                    align-items: center;
                }
                .list-left{
                    height: 40px;
                    padding-left: 15px;
                    border-right: 1px solid @border-color;
                    cursor: pointer;
                }
                .list-right{
                    padding:0 10px;

                    li{
                        margin: 10px 0;
                    }
                }
            }
            input {
                margin-right: 15px;
            }
        }
        .item-checked {
            width: 250px;

            .checked-remove {
                display: flex !important;
                justify-content: space-between !important;

            }
        }

    }
</style>