<script>
    /*
     title:货品分类参照

      配置:
     config:{
        show:false, //弹框显示 true|false 必填
        data:[],   //已选择的数据
     },

     回调：
     cb(val)

    * */
    import Vue from 'vue'
    export default {
        props:{
            config:{
                type:Object
            }
        },
        data(){
            return {
                listData:[],
                //是否全选
                all:false,
                currentIndex:-1,

                //选中的全部信息
                chooseInfo:[],
                chooseArr:'',

                //弹框配置
                modalCfg: {
                    show: this.config.show || false,
                    width: '400px',
                    height: 'auto',
                    header: '货品分类',
                    btn: [{
                        name: '取消',
                        emit: 'quite'
                    }, {
                        name: '确定',
                        emit: 'sure'
                    }],
                },
            }
        },
        ready(){
            this.getInitData()
        },
        methods:{
            //获取初始数据
            getInitData() {
                this.$http.post(__URL.development+'inventory/category/children', {}).then(
                    (res) => {
                        if(res.data.success){
                            this.listData = res.data.data;
                        }else{
                            console.log(res.data.errMsg)
                        }
                    }
                )
            },
            sure() {
                this.listData.forEach(item=>{
                    item.children.forEach(it=>{
                        if(it.code == this.chooseArr){
                            this.chooseInfo = it
                        }
                    })
                })
                for(let i=0;i<this.listData.length;i++){
                }
                this.config.show = false
                this.$emit('cb',this.chooseInfo)
            },
            quite() {
                this.config.show = false
            },
            checkThisLine(val,index){
                //当有子级时，会选中当前级打开，且不会有选中值
                if(val.children.length>0) {
                    if(this.currentIndex == index){
                        this.currentIndex = -1
                    }else{
                        this.currentIndex = index
                    }
                    return
                }
                this.chooseArr = val.code
            }
        },
        watch:{
            config:{
                 handler: function (val, oldVal) {
                    this.modalCfg.show = val.show
                    if(val.show == true && this.config && this.config.data){
                            this.chooseArr = this.config.data.industryCode
                    }
                 },
                 deep: true
            },
            modalCfg:{
                handler: function (val, oldVal) {
                    this.config.show = val.show
                },
                deep: true
            },
        }
    }
</script>
<template>
    <modal :config="modalCfg" @quite="quite" @sure="sure">
        <div class="dep-wrap">
            <div class="dep-content">
                <ul class="dep-list">
                    <li v-for="item in listData" @click="checkThisLine(item,$index)" :class="{'active':currentIndex == $index}">
                        <div class="li-content">
                            <div>
                                <i v-if="item.children.length>0" class="icon icon-arrow__right" ></i>
                                <span>{{item.name}}</span>
                            </div>
                            <input v-if="item.children.length <= 0" type="radio" :value="item.code" v-model="chooseArr">
                        </div>
                        <ul @click.stop="">
                            <li v-for="item in item.children" @click="checkThisLine(item,$index)" >
                                <div class="li-inner">
                                    <span>{{item.name}}</span>
                                    <input type="radio" :value="item.code" v-model="chooseArr">
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </modal>
</template>
<style lang="less">
    @import '../../../public/css/variable.less';
    .dep-wrap{
        font-size: 12px;

        .check-all{
            height: 30px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-right: 17px;
            margin-bottom: 20px;

            input{
                margin-right: 10px;
            }
        }
        .dep-content{
            overflow-y: scroll;
            height: 450px;
            border:1px solid @border-color;

            .dep-list{
                width: 100%;
                overflow: auto;
                .icon{
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    margin-right: 0;
                }

                li{
                    border-bottom: 1px solid @border-color;
                    cursor: pointer;

                    ul{
                        border-top: 1px solid @border-color;
                        display: none;

                        li:last-child{
                            border: none;
                        }
                    }

                    .li-content,.li-inner{
                        height: 44px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 20px 0 20px;

                        &:hover{
                            background-color: @info-hover;
                        }
                    }
                    .li-content + ul {
                        background-color: #fafafa;
                    }
                    .li-inner{
                        padding-left: 40px;
                        span{
                            margin-left: 10px;
                        }
                    }
                }

                .active {
                    ul{
                        display: block;
                    }
                    .icon-arrow__right{
                        transform: rotate(90deg);
                        display: inline-block;
                    }
                }
            }

        }

    }
</style>

