<script>
    /*
     title:岗位授权参照

     配置:
     config:{
         show:false, //弹框显示 true|false 必填
         },
     data:[],       //已选择的数据
     roleCode:''    //当有该值时，会根据该值获取职能参考

     回调：
     cb(val)

     */
    import Vue from 'vue'
    import Menu from 'nc/menu/menu.vue'
    import Submenu from 'nc/menu/submenu.vue'
    import MenuItem from 'nc/menu/menuItem.vue'
    export default{
        props:{
            config: {
                type:Object,
                required:true
            },
            data: {
                type:Array,
                default(){
                    return []
                }
            },
            roleCode: {
                type:String
            }
        },
        components:{
            Menu,Submenu,MenuItem
        },
        data(){
            return {
                modalCfg:{
                    show: this.config.show || false,
                    width: this.roleCode == undefined ? '770px' :'990px',
                    height: 'auto',
                    header: '岗位授权',
                    btn: [{
                        name: '取消',
                        emit: 'quite'
                    }, {
                        name: '确定',
                        emit: 'sure'
                    }],
                },
                //一级分类数据
                firstCateData:[],
                //二级分类数据
                secondCateData:[],
                //职能列表
                functionalList:[],
                //已经选中【code集合】
                checkedData:[],
                //已经选中【详情集合】
                checkedList:[],
                //原数据备份
                checkedListBak:[],
                //网位参考职能列表
                referPostList:[],
                //全选状态
                all:false

            }
        },
        ready(){
            //默认获取一级分类
            this.getFirstCateList()
            //将传入的初始值赋给【详情集合】
            if(this.data && this.data.length>0){
                this.checkedList = [].concat(this.data)
                this.checkedListBak = [].concat(this.data)
            }
            //当存在post时，获取岗位职能参考并显示
            if(this.roleCode){
                this.getReferPost(this.roleCode)
            }
        },
        methods:{
            getFirstCateList(){
                this.$http.post(__URL.service+'post/search/level/1').then(
                    res=>{
                        if(res.data.success){
                            this.firstCateData = res.data.data
                        }
                    }
                )
            },
            getSecond(val){
                this.$http.post(__URL.service+'post/search/level/2','',{params:{'departmentTemplateCode':val.code}}).then(
                    res=>{
                        if(res.data.success){
                            Vue.set(val,'children',res.data.data)
                        }
                    }
                )
            },
            getFunctionalList(val){
                this.$http.post(__URL.service+'post/search/roleTemplateCode','',{params:{'roleTemplateCode':val.code}}).then(
                    res=>{
                        if(res.data.success){
                            this.functionalList = res.data.data
                        }
                    }
                )
            },
            getReferPost(val){
                this.$http.post(__URL.service+'post/search/refer/role','',{params:{'roleCode':val}}).then(
                    res=>{
                        if(res.data.success){
                            this.referPostList = res.data.data
                            console.log(this.referPostList)
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
                    this.functionalList.forEach(item=>{
                        let i = this.checkedData.indexOf(item.code)
                        if(i>-1){
                            this.checkedList = this.checkedList.filter(val=>{
                                return val.code != item.code
                            })
                        }
                    })
                }else{
                    this.functionalList.forEach(item=>{
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
                let c = true,fl = this.functionalList
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
                //清空职能权限列表，将已选择职能权限还原
                this.functionalList = []
                this.checkedList = [].concat(this.checkedListBak)
                this.config.show = false
            },
            sure(){
                //清空职能权限与已选择职能权限
                this.functionalList = []
                this.config.show = false
                this.$emit('cb',this.checkedList)
                this.checkedList = []
            },
        },
        watch:{
            roleCode:{
                handler(val){
                    if(this.roleCode){
                        this.getReferPost(this.roleCode)
                        this.modalCfg.width = '990px'
                    }
                },
                deep:true
            },
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
            functionalList:{
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

    }
</script>
<template>
    <modal :config="modalCfg" @quite="quite" @sure="sure">
        <div class="functional-wrap">
            <div v-if="roleCode != undefined" class="item item-cate">
                <div class="item-head">
                    岗位职能授权参考
                </div>
                <ul class="item-list">
                    <li v-for="item in referPostList">{{item.name}}</li>
                </ul>
            </div>
            <div class="item item-cate">
                <div class="item-head">
                    IERP职能项
                </div>
                <menu>
                    <submenu @cb="getSecond(item)"
                             v-for="item in firstCateData"
                             :index="item.code"
                             :value="item">
                            <template slot="title">
                                {{item.name}}
                            </template>
                                <menu-item @cb="getFunctionalList(info)"
                                           v-for="info in item.children"
                                           :index="item.code+'-'+info.code">
                                    {{info.name}}
                                </menu-item>
                    </submenu>
                </menu>
            </div>
            <div class="item item-rights">
                <div class="item-head" @click="checkAll">
                    <input type="checkbox"  :checked="all">职能权限
                </div>
                <ul class="item-list list-rights">
                    <li v-for="item in functionalList" @click.stop="checkThisItem(item)">
                        <input type="checkbox" v-model="checkedData" :value="item.code">
                        {{item.name}}
                    </li>
                </ul>

            </div>
            <div class="item item-checked">
                <div class="item-head">
                    已选职能权限列表
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
    .functional-wrap{
        display: flex;
        flex-direction: row;
        height: 500px;
        border-bottom: 1px solid @border-color;
        font-size: 12px;

        .item{
            display: flex;
            flex-direction: column;
            border-right: 1px solid @border-color;
            flex-shrink: 0!important;

            &:last-of-type{
                border-right: none;
            }

            .item-head{
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
            .item-list{
                overflow: auto;
                li{
                    height: 42px;
                    width: 100%;
                    border-bottom: 1px solid @border-color;
                    display: flex;
                    flex-grow: 1;
                    flex-shrink: 0;
                    align-items: center;
                    justify-content: flex-start;
                    padding:0 15px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
        .item-cate{
            width: 220px;
        }
        .item-rights{
            width: 300px;
            input{
                margin-right: 15px;
            }
            li{
                cursor: pointer;
            }
        }
        .item-checked{
            width: 250px;


            .checked-remove{
                display: flex!important;
                justify-content: space-between!important;

            }
        }

    }
</style>