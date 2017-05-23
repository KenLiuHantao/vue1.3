<script>
    import tree from './tree/vtree'
    import modal from './modal'
    import remote from './remoteModal'
    export default{
        data(){
            return{
            	loadingShow:true,
            	treeShow:true,
            	localTreeConfig:{
                	rightdelete: true,
            		classmode:'table',
            		open:false
            	},
            	localTreeData:[],
            	msgconfig: {
            	    show: false,
            	    showtime: 2000,
            	    content: '提示消息'
            	},
                //新增行业分类弹框
                industryModal:{
                    show: false,
                    width: '520px',
                    height: 'auto',
                    header: '添加行业分类',
                    btn: [{
                        name: '关闭',
                        dispatch: 'codeClose'
                    }, {
                        name: '确认',
                        dispatch: 'codeSure'
                    }]
                },
                //删除确认弹框
                deleteModel:{
                    show:false,
                    width:'340px',
                    height:'auto',
                    header:'提示',
                    btn: [{
                        name: '关闭',
                        dispatch: 'deleteClose'
                    }, {
                        name: '确认',
                        dispatch: 'deleteSure'
                    }]
                },
                deletecode:'',
                //弹框已经点击，暂时阻断
                hasclick:false
            }
        },
        components:{
        	tree,modal,remote
        },
        methods:{
            toggleTree:function(){
                this.treeShow = !this.treeShow
            },
            //添加时弹框
            addChild:function(){
                this.industryModal.show=true
            }
        },
        ready:function(){
        	var paramData = {
            }
            this.$http.post(__URL.arc + 'industry/category/local', paramData).then(
                (res) => {
                    this.localTreeData = res.data.data;
                    this.loadingShow = false
                },
                (err) => {
                    console.log('初始化未能拿到tree数据')
                }
            )
        },
        events:{
        	codeClose:function(){
                this.industryModal.show=false;
            },
            codeSure:function(){
                this.$broadcast('insertdata')
            },
            insertcode:function(codeArray){
                var paramData = {
                    "codes":codeArray
                }
                this.$http.post(__URL.arc + 'industry/category/insert', paramData).then(
                    (res) => {
                        if(res.data.success){
                            this.localTreeData=res.data.data.localData;
                            this.industryModal.show=false;
                            this.msgconfig.content='新增成功';
                            this.msgconfig.show = true
                        }else{
                            this.msgconfig.content = res.data.errMsg;
                            this.msgconfig.show = true
                        }
                    },
                    (err) => {
                        console.log('初始化未能拿到tree数据')
                    }
                )
            },
            //移除数据
            deletedata:function(model){
                this.deletecode=model.industryCode;
                this.deleteModel.show=true;
            },
            deleteClose:function(){
                this.deleteModel.show=false;
            },
            deleteSure:function(){
                if(this.hasclick){
                    return
                }
                this.hasclick=true;
                var paramData = this.deletecode;
                this.$http.get(__URL.arc + 'industry/category/delete/'+this.deletecode).then(
                    (res) => {
                        if(res.data.success){
                            this.localTreeData=res.data.data.localData;
                            this.deleteModel.show=false;
                            this.hasclick=false;
                            this.msgconfig.content='删除成功';
                            this.msgconfig.show = true
                        }else{
                            this.hasclick=false;
                            this.msgconfig.content = res.data.errMsg;
                            this.msgconfig.show = true
                        }
                    },
                    (err) => {
                        console.log('初始化未能拿到tree数据')
                    }
                )
            }
        }
    }
</script>

<template>
    <div class="tree-wrap">
        <div class="tree-head" :class="{'border-none':!treeShow}">
    	    <div>
    	        <span :class="{'icon-contract':treeShow,'icon-deploy':!treeShow}" @click="toggleTree"></span>行业分类
    	    </div>
    	    <div>
    	        <span class="icon-add" @click="addChild"></span>
    	    </div>
    	</div>
    	<div class="loading" v-if="loadingShow">数据加载中...</div>
    	<tree v-show="treeShow" :data='localTreeData'  :config='localTreeConfig'></tree>
    	<div class='blank' v-show='localTreeData.length==0 && !loadingShow'>
    		<!-- <img src="../../../../public/images/blank.png"> -->
    		<p>无行业分类内容，请<a href='javascript:;' @click='addChild'>新增</a></p>
    	</div>
    </div>
    <message :config="msgconfig" ></message>
    <modal :config.sync='industryModal'>
        <remote ></remote>
    </modal>
    <modal :config.sync='deleteModel'>
        <p class='delete-message'>请确认是否删除此行业分类！</p>
    </modal>
</template>
<style lang="less" scoped>
@import '../../../../../public/css/variable.less';
    .tree-wrap{
        border: 1px solid #dde6ef;
    }
    .delete-message{
        font-size: 12px;
        line-height: 80px;
        text-align: center;
    }
    .tree-head{
        height: 44px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: @gray-dark;
        border-bottom: 1px solid @border-color;
        span{
            margin-right: 10px;
        }
        .icon-contract{
            color:#757575;
        }
        .icon-deploy{
            color:#757575;
        }
    }
    .border-none{
        border-bottom: none!important;
    }
    .loading{
        display: flex;
        width: 100%;
        height:600px;
        align-items: center;
        justify-content: center;
    }
    .blank{
		position: absolute;  
        top: 50%; left: 50%;  
        -webkit-transform: translate(-50%,-50%);  
        -ms-transform: translate(-50%,-50%);  
        transform: translate(-50%,-50%);  
		p{
			text-align: center;
			margin-top: 10px;
			font-size: 12px;
			color:#37474f;
		}
	}
</style>

