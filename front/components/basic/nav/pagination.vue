<script>
/**
 * 翻页组件
 * @param {Number} total - 数据总条数
 * @param {Function} change - 点击切换时触发的方法，父组件定义，该方法能接收到params参数
 * @param {Object} config  - 配置参数
 *  config:{
 *       'pageSize': Number 每页展示数量
 *       'pageIndexName': String 回传参数时的'当前页数'字段名字,默认为'pageIndex'
 *       'pageSizeName': String 回传参数时的'每页长度'字段名字,默认为 'pageSize'
 *       'jump':Boolean 是否添加跳转到指定页面功能
 *  }
 *
 */
    export default {
        props:{
            total:Number,
            config:Object
        },
        data(){
            return {
                 //所要展示的页码列表
                 pageList:[1],
                 //当前选中的页面
                 pageCurrent:1,
                 //页码的最大值与最小值
                 pageArea:{
                    min:'1',
                    max:'10'
                 },
                 //指定跳转页时的数据
                 searchPage:'',
                 //左右小略号的显示控制
                 leftDot:false,
                 rightDot:false,
                 optionDefault:{
                    'total':0,
                    'pageSize':50,
                    'pageIndexName':'pageIndex',
                    'pageSizeName':'pageSize',
                    'jump':false
                }
            }
        },
        ready(){
            /**
             * 将传入进来的config值，与默认的optionDefautl合并,并赋给新的optionDefault
             */
            if(this.config){
                this.copyData(this.optionDefault,this.config)
            }
            if(this.total){
                this.optionDefault.total=this.total
            }
            this.initPageList();
        },
        watch: {
            config:{
                handler(val){
                     this.copyData(this.optionDefault,this.config)
                     this.initPageList();
                },
                deep:true
            },
            total:{
                handler(val){
                    this.optionDefault.total=this.total;
                    this.initPageList();
                },
                deep:true
            }
        },
        methods:{
            copyData(origin,target){
                Object.keys(target).forEach(key=>{
                    origin[key] = target[key]
                })
            },
            /**
             * 初始化菜单列表
             * 根据传入的 total 和 pageSize 向上取整计算出最大页数 pageArea.max
             */
            initPageList(){
                this.pageArea.max = Math.ceil(this.optionDefault.total/this.optionDefault.pageSize)
                this.pageCurrent=1;
                this.pageListRefresh();
            },
            /**
             * 设置当前页数
             * @param {Number} pageNumber
             */
            setCurrentPage(pageNumber){
                this.pageCurrent = pageNumber;
                this.pageListRefresh();
                this.getData();
            },
            /**
             * 跳转到指定页面
             */
            jump(){
               if(!this.searchPage.trim() == '' && this.searchPage.trim() <= this.pageArea.max){
                this.pageCurrent = this.searchPage;
                this.pageListRefresh();
                this.getData();
               }
            },
            /**
             * 获取数据
             * 根据config设置的参数名，组装好请求数据所需要的参数param
             * 触发父组件传入的change事件
             */
            getData(){
                let param = {
                    [this.optionDefault.pageIndexName]:this.pageCurrent,
                    [this.optionDefault.pageSizeName]:this.optionDefault.pageSize
                };
                this.$emit('cb',param);
            },
            /**
             * 获取上一页
             */
            prev(){
                if(this.pageCurrent == 1){
                    return
                }
                this.pageCurrent > this.pageArea.min ? this.pageCurrent-- : this.pageCurrent = 1;
                this.pageListRefresh();
                this.getData();
            },
            /**
             * 获取下一页
             */
            next(){
                if(this.pageCurrent == this.pageArea.max){
                    return
                }
                this.pageCurrent < this.pageArea.max ? this.pageCurrent++ : this.pageCurrent = thia.pageArea.max;
                this.pageListRefresh();
                this.getData();
            },
            /**
             * 刷新需要显示的页码
             */
            pageListRefresh(){
                let arr = [];
                /**
                 * 默认有第一页，和最后一页
                 * 循环的数组当中不添加第一项和最后一项
                 */
                for(let i=2;i<=this.pageArea.max-1;i++){
                    arr.push(i)
                }
                /**
                 * 当最大页数为2时
                 * 则只已有的第一页，最后一页
                 */
                if(this.pageArea.max == 2){
                    arr.length = 1;
                    this.pageList = arr;
                    return;
                }
                /**
                 * 当最大页小于10时
                 * 显示所有页码
                 */
                if (this.pageArea.max < 10) {
                    this.pageList = arr.slice(0, this.pageArea.max)
                    return
                }
                /**
                 * 当最大页数大于等于10时，则部分显示
                 * 1.当前页数小于5时，显示前五个，以及右省略号
                 * 2.当前页数及最大页数的差小于5时，显示后五个，以及左省略号
                 * 3.当前页数处于中间时，显示当前页前后两页，同时左右略号均显示
                 */
                if (this.pageCurrent < 6) {
                    this.pageList = arr.slice(0, 6)
                    this.rightDot = true
                    this.leftDot = false
                } else if (this.pageArea.max - this.pageCurrent < 6) {
                    this.pageList = arr.slice(-6)
                    this.leftDot = true
                    this.rightDot = false
                } else {
                    let start = this.pageCurrent - 4;
                    this.pageList = arr.slice(start, start + 5)
                    this.leftDot = true
                    this.rightDot = true
                }
            }
        }
    }


</script>
<template>
    <ul class="pagination" v-if="pageList.length > 0">
        <li class="prev" :class="{disable: pageCurrent == 1}" @click="prev">
            <span> 上一页</span>
        </li>
        <li :class="{'active':1 == pageCurrent}" @click="setCurrentPage(1)">
            <span>1</span>
        </li>
        <p v-show="leftDot">
            <span>...</span>
        </p>
        <template v-for="item in pageList">
            <li  v-if="item" :class="{'active':item == pageCurrent}" @click="setCurrentPage(item)">
                <span>{{item}}</span>
            </li>
        </template>
        <p v-show="rightDot">
            <span>...</span>
        </p>
        <li :class="{'active':pageArea.max == pageCurrent}" @click="setCurrentPage(pageArea.max)">
            <span>{{pageArea.max}}</span>
        </li>
        <li class="next" :class="{disable: pageCurrent == pageArea.max}" @click="next">
            <span>下一页 </span>
        </li>

        <div v-if="optionDefault.jump" class="jump-wrap">
            <p class="jump-text">共{{optionDefault.total}}条 到第</p>
            <input class="jump-num" type="number" min="1" v-model="searchPage" >
            <p class="jump-text">页</p>
            <a class="btn large" href="javascript:;" @click="jump()">确定</a>
        </div>
    </ul>
</template>
<style lang="less">
    @import "../../../public/css/variable.less";

    .pagination {
        display: flex;
        justify-content: center;
        height: 28px;;
        font-size: 12px;
        flex-direction: row;
        -moz-user-select: none;
        -khtml-user-select: none;
        user-select: none;

        .disable{
            opacity: 0.5;

            &:hover{
                border-color: @btn-def-bg;
                cursor: not-allowed;

                span{
                    color: @gray;
                }
            }
        }
        p{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 35px;
            height: 100%;
            text-align: center;
            margin-left: -1px;

        }
        li {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 28px;
            height: 100%;
            margin: 0 5px;
            cursor: pointer;
            text-align: center;
            border: 1px solid @border-color;
            border-radius:2px;

            &:hover {
                border-color: @base-light;
                background-color: @base-light;
                span{
                    color:white;
                }
            }

            &.prev, &.next {
                width: 80px;
            }

            &.active {
                background-color: @base-light;
                border-color: @base-light;

                span {
                    color: white;
                }

            }
        }
        .jump-wrap{
            margin: 0 5px;
            display: flex;
            height: 100%;
            align-items: center;
            .jump-num{
                box-sizing: border-box;
                text-align: center;
                padding: 0;
                width:38px;
                height: 24px;
                margin: 0 6px;

                &:focus{
                    border-color: @base-light;
                }
            }
            .jump-text{
                display: flex;
                height: 100%;
                width: auto;
                align-items: center;
                color: @gray-sub;

            }
            .btn{
                display: flex;
                align-items: center;
                justify-content: center;
                width: 38px;
                height: 24px;
                margin: 0 6px;
                border:1px solid @border-color;
                border-radius: 2px;
                color: #212121;
                cursor: pointer;
                margin-left: 6px;
            }
            .btn:hover{
                border-color: @base-light;
                background-color: @base-light;
                color:white;
            }
        }
    }
</style>