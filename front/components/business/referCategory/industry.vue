<script>
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
                    header: '行业分类',
                    btn: [{
                        name: '取消',
                        emit: 'quite'
                    }, {
                        name: '确定',
                        emit: 'sure'
                    }],
                    notChoiceFirst:false
                },
            }
        },
        ready(){
            this.getInitData()
        },
        methods:{
            //获取初始数据
            getInitData() {
                this.$http.post(__URL.arc+'industry/category/local', {}).then(
                    (res) => {
                        this.listData = res.data.data;
                        if(this.listData.length>0){
                            var newdata = JSON.parse(JSON.stringify(this.listData))
                            this.listData=this.toTreeData(newdata)
                        }
                    }
                )
            },
            toTreeData: function(data) {
                var pos = {};
                var tree = [];
                var i = 0;
                var maxTimes = 0;
                while (data.length != 0) {
                    if (maxTimes > 1000000) {
                        console.debug('数据出错')
                        return
                    }
                    if (data[i].parentCode == '') {
                        let c = {children:[]}
                        Object.keys(data[i]).forEach((key)=>{
                            c[key] = data[i][key]
                        })
                        tree.push(c);
                        pos[data[i].industryCode] = [tree.length - 1];
                        data.splice(i, 1);
                        i--;
                        maxTimes++;
                    } else {
                        var posArr = pos[data[i].parentCode];
                        if (posArr != undefined) {
                            var obj = tree[posArr[0]];
                            for (var j = 1; j < posArr.length; j++) {
                                obj = obj.children[posArr[j]];
                            }
                            let c = {children:[]}
                            Object.keys(data[i]).forEach((key)=>{
                                c[key] = data[i][key]
                            })
                            obj.children.push(c);
                            pos[data[i].industryCode] = posArr.concat([obj.children.length - 1]);
                            data.splice(i, 1);
                            i--;
                        }
                    }
                    i++;
                    if (i > data.length - 1) {
                        i = 0;
                    }
                    maxTimes++
                }
                return tree
            },
            //选中当前列
            checkThisLink(val){
                if(this.currentIndex == val){
                    this.currentIndex = -1
                }else{
                    this.currentIndex = val
                }
            },
            sure() {
                this.listData.forEach(item=>{
                     if(item.industryCode == this.chooseArr){
                        this.chooseInfo = item
                     }else if(item.children.length > 0){
                        item.children.forEach(it=>{
                            if(it.industryCode == this.chooseArr){
                                this.chooseInfo = it
                            }
                        })
                     }
                })
                //根据小行业分类查询大行业分类
                if(this.chooseInfo.parentCode != ''){
                    var parent={}
                    this.listData.forEach(item => {
                        if(item.industryCode == this.chooseInfo.parentCode){
                            parent=item
                        }
                    })
                }
                this.config.show = false
                this.$emit('cb',this.chooseInfo,parent)
            },
            quite() {
                this.config.show = false
            },
            checkThisLine(item){
                this.chooseArr = item.industryCode
            }
        },
        watch:{
            config:{
                 handler: function (val, oldVal) {
                    this.modalCfg.show = val.show
                    this.modalCfg.notChoiceFirst=val.notChoiceFirst
                    if(val.show == true && this.config && this.config.data){
                            this.chooseArr = this.config.data.industryCode
                    }
                 },
                 deep: true
            }
        }
    }
</script>
<template>
    <modal :config="modalCfg" @quite="quite" @sure="sure">
        <div class="dep-wrap">
            <div class="dep-content">
                <ul class="dep-list">
                    <li v-for="item in listData" :class="{'active':currentIndex == $index}" @click="checkThisLink($index)">
                        <div class="li-content">
                            <div>
                                <span class="icon" :class="{'icon-arrow__right':item.children.length >0}"></span>
                                <span>{{item.industryName}}</span>
                            </div>
                            <input v-if='!modalCfg.notChoiceFirst'  @click.stop="" type="radio" :value="item.industryCode" v-model="chooseArr">
                        </div>
                        <ul v-if="item.children.length >0" >
                            <li v-for="item in item.children" @click.stop='checkThisLine(item)'>
                                <div class="li-inner">
                                    <span>{{item.industryName}}</span>
                                    <input type="radio" :value="item.industryCode" v-model="chooseArr">
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

