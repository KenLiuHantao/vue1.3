<script>
/**
 * listdata(参数配置)
 */
export default {
    props: ['data', 'config','filter'],
    data() {
        return {
            activeTab: 0,
            openCode: '',
            ckdCode: '',
            msgconfig: {

            },
            listData: this.data,
            totalCount:0
        }
    },
    computed:{
    	hasMore:function(){
    		if(this.totalCount>this.config.list.first.param.params.pageSize && this.config.list.first.param.params.pageIndex<(this.totalCount/this.config.list.first.param.params.pageSize)){
    			return true
    		}else{
    			return false
    		}
    	}
    },
    methods: {
        //切换tab
        chiceTab(item, index) {
            this.activeTab = index;
            //切换清空
            this.openCode = ''
            this.ckdCode = ''
            this.getFirst('refresh')
            this.$emit('changetab', item, index)
        },
        //获取一级菜单
        getFirst(type) {
        	//tab参数
            this.config.list.first.param.params[this.config.list.first.changeParam] = this.activeTab;
            //filter参数
            for(var i=0;i<this.filter.length;i++){
            	this.config.list.first.param.params[this.filter[i].key]=this.filter[i].value;
            }
            //type判断刷新data或者加载更多
            if(type=='add'){
            	this.config.list.first.param.params.pageIndex++;
            }
            this.$http.post(this.config.list.first.url, this.config.list.first.param).then(
                (res) => {
                    if (res.data.success) {
                        //type判断刷新data或者加载更多
                        if (type == 'refresh') {
                            //清空不了
                            // this.listData[this.activeTab]=[];
                            //可行但是麻烦
                            this.listData[this.activeTab].splice(0, this.listData[this.activeTab].length);
                            //简单处理
                            // this.listData[this.activeTab].length=0;
                        }
                        this.totalCount=res.data.data.totalCount;
                        for (var i = 0; i < res.data.data.dataList.length; i++) {
                            this.listData[this.activeTab].push({
                                'code': res.data.data.dataList[i][this.config.list.first.code],
                                'firstTitle': res.data.data.dataList[i][this.config.list.first.showConfig.firstTitle],
                                'firstLabel': this.config.list.first.showConfig.firstLabel,
                                'secContent': res.data.data.dataList[i][this.config.list.first.showConfig.secContent],
                                'secLabel': this.config.list.first.showConfig.secLabel,
                                'thrContent': res.data.data.dataList[i][this.config.list.first.showConfig.thrContent],
                                'thrLabel': this.config.list.first.showConfig.thrLabel,
                                'rightContent':res.data.data.dataList[i][this.config.list.first.showConfig.rightContent],
                                'hasNumber':this.config.list.first.hasNumber,
                                'fulldata': res.data.data.dataList[i],
                                'secList': []
                            })
                        }
                    } else {
                        this.msgconfig.content = res.data.errMsg
                        this.msgconfig.show = true
                    }
                },
                (err) => {

                }
            )
        },
        //点击一级
        openFirst(item, index) {
            //选中事件
            this.ckdCode = item.code;
            //展开事件
            if (this.openCode == item.code) {
                this.openCode = ''
            } else {
                this.openCode = item.code
            }
            //放入tab的参数
            item.fulldata[this.config.list.first.changeParam] = this.activeTab;
            this.$emit('choice', item.fulldata)
            if (this.config.list.first.hasSecond) {
                this.getSecond(item, index)
            }
        },
        //获取二级菜单
        getSecond(item, index) {
            //根据配置数组参数赋值
            if (this.config.list.second.tabParam) {
                this.config.list.second.param.params[this.config.list.second.tabParam] = this.activeTab;
            }
            this.config.list.second.param.params[this.config.list.second.changeParam] = item.fulldata[this.config.list.second.searchParam];
            //filter参数
            for(var i=0;i<this.filter.length;i++){
            	this.config.list.second.param.params[this.filter[i].key]=this.filter[i].value;
            }
            this.$http.post(this.config.list.second.url, this.config.list.second.param).then(
                (res) => {
                    if (res.data.success) {
                        //二级菜单没有异步加载，直接刷
                        if (true) {
                            //清空不了
                            // this.listData[this.activeTab]=[];
                            //可行但是麻烦
                            // this.listData[this.activeTab].splice(0,this.listData[this.activeTab].length);
                            //简单处理
                            if (!this.listData[this.activeTab][index]['secList']) {
                                this.listData[this.activeTab][index]['secList'] = []
                            } else {
                                this.listData[this.activeTab][index]['secList'].length = 0;
                            }
                        }
                        for (var i = 0; i < res.data.data.length; i++) {
                            this.listData[this.activeTab][index]['secList'].push({
                                'code': res.data.data[i][this.config.list.second.code],
                                'firstTitle': res.data.data[i][this.config.list.second.showConfig.firstTitle],
                                'firstLabel': this.config.list.second.showConfig.firstLabel,
                                'secContent': res.data.data[i][this.config.list.second.showConfig.secContent],
                                'secLabel': this.config.list.second.showConfig.secLabel,
                                'thrContent': res.data.data[i][this.config.list.second.showConfig.thrContent],
                                'thrLabel': this.config.list.second.showConfig.thrLabel,
                                'rightContent': res.data.data[i][this.config.list.second.showConfig.rightContent],
                                'fulldata': res.data.data[i],
                            })
                        }
                    } else {
                        this.msgconfig.content = res.data.errMsg
                        this.msgconfig.show = true
                    }
                },
                (err) => {

                }
            )
        },
        //点击二级
        choiceSec(first, sec) {
            this.ckdCode = first.code.toString() + sec.code.toString();
            //放入tab的参数
            sec.fulldata[this.config.list.second.tabParam] = this.activeTab;
            this.$emit('choice', sec.fulldata)
        },
        //加载更多
        loadMore(){
        	this.getFirst('add')
        }
        //点击左侧按钮
        // leftBtn() {
        //     this.$emit('leftbtn')
        // },
        //点击右侧按钮
        // rightBtn() {
        //     this.$emit('rightbtn')
        // }
    },
    ready() {
        this.getFirst('refresh')
    },
    events:{
    	filterList(){
    		this.openCode = ''
            this.ckdCode = ''
            this.getFirst('refresh')
    	}
    }
}
</script>
<template>
    <div class='list_div'>
        <div class='list_tab' v-if='config.tab'>
            <a href="javascript:;" v-for='(index,item) in config.tab' @click='chiceTab(item,index)' :class="{ckd:index==activeTab}">
                <div v-if='item.tips' class='redtips'></div>
                {{item.name}}
            </a>
        </div>
        <div class='list_content'>
            <template v-for='(index,item) in listData'>
                <ul v-show='activeTab==index' class='listbox'>
                    <li class='first_li' v-for='(index,firstLv) in item'>
                        <a :class='{ckd:firstLv.code==ckdCode}' @click='openFirst(firstLv,index)' href="javascript:;">
                        	<i v-show='config.list.first.hasSecond && firstLv.code!=openCode' class='icon-arrow-right'></i>
                        	<i v-show='config.list.first.hasSecond && firstLv.code==openCode' class='icon-arrow-down' :class='{childchoice:firstLv.code!=ckdCode&&firstLv.code==openCode}'></i>
                            <p :class='{childchoice:firstLv.code!=ckdCode&&firstLv.code==openCode}' class='main'>{{firstLv.firstLabel}}{{firstLv.firstTitle}}</p>
                            <p v-show='firstLv.secContent' :class='{mt16:!firstLv.thrContent}' class='minor'>{{firstLv.secLabel}}{{firstLv.secContent}}</p>
                            <p v-show='firstLv.thrContent' :class='{mt16:firstLv.secContent}' class='minor'>{{firstLv.thrLabel}}{{firstLv.thrContent}}</p>
                            <span class='tip_number'>{{firstLv.rightContent}}</span>
                        </a>
                        <ul v-if='config.list.first.hasSecond' v-show='firstLv.code==openCode' class='sec_ul'>
                            <li @click.stop='choiceSec(firstLv,secLv)' class='sec_li' :class='{hasnumber:firstLv.hasNumber,ckd:firstLv.code.toString()+secLv.code.toString()==ckdCode}' v-for='(index,secLv) in firstLv.secList'>
                                <div v-if='firstLv.hasNumber' class='number-title'>{{index+1}}</div>
                                <p class='main'>{{secLv.firstLabel}}{{secLv.firstTitle}}</p>
                                <p v-show='secLv.secContent' :class='{mt16:!secLv.thrContent}' class='minor'>{{secLv.secLabel}}{{secLv.secContent}}
                                </p>
                                <p v-show='secLv.thrContent' :class='{mt16:secLv.secContent}' class='minor'>{{secLv.thrLabel}}{{secLv.thrContent}}</p>
                                <span class='tip_number'>{{secLv.rightContent}}</span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </template>
        </div>
        <div class='list_loadmore' v-show='hasMore' @click='loadMore'>
        	加载更多...
        </div>
    </div>
</template>
<style lang='less' scoped>
@import '../../../public/css/variable.less';
.list_div {
    width: 383px;
    line-height: 1;
    .leftbtn {
        display: inline-block;
        float: left;
        margin-left: 30px;
        height: 46px;
        line-height: 46px;
        position: relative;
    }
    .rightbtn {
        display: inline-block;
        float: right;
        margin-right: 15px;
        height: 46px;
        line-height: 46px;
        position: relative;
    }
    p {
        font-size: 14px;
        color: #212121;
        margin: 0;
    }
    p:hover {
        cursor: pointer;
        color: #008AF5
    }
    .list_tab {
        display: flex;
        font-size: 0;
        border-bottom: 1px solid @border-color;
        a {
            display: inline-block;
            padding: 18px 0;
            width: 50%;
            text-align: center;
            font-size: 14px;
            color: #212121;
            margin-top: -1px;
            margin-bottom: -1px;
            border-bottom: 2px solid transparent;
            text-decoration: none;
            position: relative;
            .redtips {
                display: inline-block;
                width: 4px;
                height: 4px;
                background: red;
                border-radius: 2px;
                position: absolute;
                top: 22px;
                margin-left: -8px;
            }
        }
        .ckd {
            border-color: #008af4;
        }
    }
    .list_content {
        ul {
            list-style: none;
            padding: 0;
            margin: 0;
            font-size: 0;
        }
        a {
            text-decoration: none;
            position: relative;
            p,
            span {
                color: #212121;
            }
        }
        .listbox {
            position: absolute;
    		width: 100%;
    		top: 51px;
    		bottom: 0;
    		overflow: scroll;
    		overflow-x: hidden;
            text-align: left;
            font-size: 0;
            .first_li {
                position: relative;
                width: 100%;
                >a {
                    display: inline-block;
                    width: 328px;
                    padding: 0 20px 0 32px;
                    font-size: 0;
                    border-left: 3px solid transparent;
                    border-bottom: 1px solid @border-color;
                    >i{
                    	font-size: 12px;
                    	position: absolute;
                    	top: 18px;
                    	left: 10px;
                    	color: #212121;
                    }
                    .main {
                        display: inline-block;
                        max-width: 230px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        word-break: break-all;
                        overflow: hidden;
                        font-size: 14px;
                        color: #212121;
                        margin: 16px 0;
                    }
                    .minor {
                        max-width: 328px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        word-break: break-all;
                        overflow: hidden;
                        font-size: 12px;
                        color: #757575;
                        margin: 0 0 8px 0;
                    }
                    .tip_number {
                        position: absolute;
                        display: inline-block;
                        right: 20px;
                        top: 16px;
                        font-size: 14px;
                        color: #212121;
                        max-width: 80px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        word-break: break-all;
                        overflow: hidden;
                    }
                    .mt16 {
                        margin-bottom: 16px;
                    }
                }
                .childchoice{
                	color: #008AF5 !important;
                }
                >a:hover {
                    background: #f0f9fd;
                }
                >.sec_ul {
                    font-size: 0;
                    >.sec_li {
                        /*width: 328px;*/
                        padding: 0 20px 0 42px;
                        font-size: 0;
                        border-left: 3px solid transparent;
                        border-bottom: 1px solid @border-color;
                        background: #FAFAFA;
                        position: relative;
                        height: 100%;
                        .main {
                            display: inline-block;
                            max-width: 230px;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            word-break: break-all;
                            overflow: hidden;
                            font-size: 14px;
                            color: #212121;
                            margin: 16px 0;
                        }
                        .minor {
                            max-width: 328px;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            word-break: break-all;
                            overflow: hidden;
                            font-size: 12px;
                            color: #757575;
                            margin: 0 0 8px 0;
                        }
                        .tip_number {
                            position: absolute;
                            display: inline-block;
                            right: 20px;
                            top: 16px;
                            font-size: 14px;
                            color: #212121;
                            max-width: 80px;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            word-break: break-all;
                            overflow: hidden;
                        }
                        .mt16 {
                            margin-bottom: 16px;
                        }
                        .number-title {
                            display: inline-block;
                            position: absolute;
                            /*height: 14px;*/
                            min-width: 15px;
                            border: 1px #212121 solid;
                            line-height: 14px;
                            border-radius: 2px;
                            text-align: center;
                            left: 35px;
                            top: 15px;
                            transition: all .2s ease;
                            color: #212121;
                            font-size: 12px;
                            transform: scale(.9)
                        }
                    }
                    >.sec_li:hover {
                        cursor: pointer;
                        background: #f0f9fd;
                    }
                    .hasnumber {
                        /*width: 300px;*/
                        padding-left: 60px;
                        .main {
                            max-width: 205px;
                        }
                        .minor {
                            max-width: 300px;
                        }
                    }
                }
            }
        }
        .ckd {
            border-left: 3px #03a9f4 solid !important;
            background: #f0f9fd !important;
            >p {
                color: #008AF5 !important;
            }
            >.number-title{
            	color: #008AF5 !important;
            	border-color: #008AF5 !important;
            }
            i{
            	color: #008AF5 !important;
            }
        }
    }
    .list_loadmore{
    	height: 46px;
    	text-align: center;
    	position: absolute;
    	width: 100%;
    	bottom: 0;
    	font-size: 14px;
    	padding: 16px 0;
    	border-bottom: 1px solid @border-color;
    	border-top: 1px solid @border-color;
    	background: white;
    }
    .list_loadmore:hover{
    	cursor: pointer;
    }
}
</style>
