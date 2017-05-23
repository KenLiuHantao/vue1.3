<script>
import tree from './tree/vtree'
export default {
    components: {
        tree
    },
    data:function(){
        return {
            leftloadingShow:true,
            lefttreeData:[],
            leftTreeConfig:{
                rightcheckbox:true,
                open:false
            },
            filterword:'',
            tofilter:'',
            treeShow:true
        }
    },
    ready(){
        var paramData = {
        }
        this.$http.post(__URL.arc + 'industry/category/remote', paramData).then(
            (res) => {
                this.lefttreeData = res.data.data;
                this.leftloadingShow = false;
            },
            (err) => {
                console.log('初始化未能拿到tree数据')
            }
        )
    },
    methods:{
        filter:function(){
            this.tofilter=this.filterword
        },
        toggleTree:function(){
            this.treeShow = !this.treeShow
        },
    }
}
</script>
<template>
    <div class="cate-wrap">
        <div class='left_tree'>
            <div style='position:relative'>
                <input class='searchinput' type='text' placeholder='搜索行业分类' v-model='filterword' @keyup.enter='filter'>
                <i class='icon-search search'></i>
            </div>
            <div class="loading" v-show="leftloadingShow">数据加载中...</div>
            <div class="mini-head-modal" v-show="!leftloadingShow">
                <div>
                    <span :class="{'icon-contract':treeShow,'icon-deploy':!treeShow}" @click="toggleTree"></span></span>行业分类
                </div>
            </div>
            <tree v-show='treeShow' :data='lefttreeData'  :config='leftTreeConfig' :keyword='tofilter'></tree>
        </div>
    </div>
</template>
<style lang="less" scoped>
@import '../../../../../public/css/variable.less';
.tree-head-modal{
    height: 44px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /*background-color: @gray-dark;*/
    /*border-bottom: 1px solid @border-color;*/
    span{
        margin-right: 10px;
    }
}
.cate-wrap{
    width: 100%;
    height: 570px;
    padding: 10px;
    border: 1px solid #dde6ef;
    /*border-radius: 4px;*/
    box-sizing: border-box;
    position: relative;
    .mini-head-modal{
        margin-top: 10px;
        font-size: 12px;
        padding-left: 5px;
        span{
            margin-right: 5px;
        }
    }
}
.left_tree{
    padding: 10px;
    display: inline-block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    /*border-right: 1px solid #dde6ef;*/
    border-radius: 4px;
    border: 1px solid #dde6ef;
    input.searchinput{
        padding-left: 25px;
        border: none !important;
        background: #f5f5f5;
        color: #757575;
        border-radius: 2px;
        font-size: 12px;
        width: 100%;
    }
    .search{
        font-size: 14px;
        position: absolute;
        left: 7px;
        top: 7px;
    }
    .treediv{
        height: 450px;
        overflow: auto;
    }
    .loading{
        font-size: 12px;
        display: flex;
        width: 100%;
        height:100%;
        align-items: center;
        justify-content: center;
    }
}
</style>
