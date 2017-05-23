<script>
    import tree from './tree/vtree'
    export default{
        data(){
            return{
                ajaxlock:true,
            	loadingShow:true,
            	treeShow:true,
            	topTreeConfig:{
            		rightadd: true,
                	rightedit: true,
                	rightdelete: true,
            		classmode:'table',
            		open:false
            	},
            	topTreeData:[],
            	msgconfig: {
            	    type:'warning',
            	    show: false,
            	    showtime: 2000,
            	    content: '提示消息'
            	},
                delConfig:{
                    show: false 
                },
                deldata:''
            }
        },
        components:{
        	tree
        },
        methods:{
            setTree:function(){
                for(var i=0;i<this.topTreeData.length;i++){
                    this.topTreeData[i].code=this.topTreeData[i].supplierCategoryCode;
                    this.topTreeData[i].name=this.topTreeData[i].supplierCategoryName;
                    this.topTreeData[i].parentCode=''
                }
            },
        	getInitData:function(data){
        		this.$http.get(__URL.arc + 'supplier/category/list').then(
        		    (res) => {
        		        this.topTreeData = res.data.data;
                        this.setTree()
        		        this.loadingShow = false
        		        if(data){
        		        	this.openTree(data.parentCode)
        		        }
        		    },
        		    (err) => {
        		        console.log('初始化未能拿到tree数据')
        		    }
        		)
        	},
        	toggleTree:function(){
        		this.treeShow = !this.treeShow
        	},
        	addChild:function(){
                this.treeShow=true;
                //保证同时只能有一个input添加
                for(var i=0;i<this.topTreeData.length;i++){
                    if(this.topTreeData[i].edit==true){
                        this.msgconfig.type='warning'
                        this.msgconfig.content = '请保存或取消当前修改后再试'
                        this.msgconfig.show = true
                        return
                    }
                }
        		this.topTreeData.unshift({
    				"name" : "",
    				"parentCode" : '',
    				'edit': true,
                    'editlength':10
        		})
        	},
        	openTree:function(code){
        		for(var i=0;i<this.topTreeData.length;i++){
        			if(this.topTreeData[i].code==code){
        				this.topTreeData[i].open=true;
        				if(this.topTreeData[i].parentCode!=''){
        					this.openTree(this.topTreeData[i].parentCode)
        				}
        			}
        		}
        	},
            delThisBill:function(){
                if(!this.ajaxlock){
                    return
                }
                this.ajaxlock=false;
                this.$http.get(__URL.arc + 'supplier/category/delete/'+this.deldata.code).then(
                    (res) => {
                        this.ajaxlock=true;
                        if(!res.data.data){
                            this.msgconfig.type='warning'
                            this.msgconfig.content = res.data.errMsg
                            this.msgconfig.show = true
                        }else{
                            this.msgconfig.type='success'
                            this.delConfig.show=false;
                            this.msgconfig.content='删除成功'
                            this.msgconfig.show=true;
                            this.topTreeData = res.data.data;
                            this.setTree();
                            this.openTree(this.deldata.parentCode)
                        }
                    },
                    (err) => {
                        this.ajaxlock=true;
                        this.msgconfig.type='warning'
                        this.msgconfig.content = '请求失败'
                        this.msgconfig.show = true
                    }
                )
            }
        },
        ready:function(){
        	this.getInitData()
        },
        events:{
        	//删除末级节点，不允许一次删除多个
        	deletedata:function(data){
                this.deldata=data;
                this.delConfig.show=true;
        	},
        	//在当前节点下新增子节点的input(一个)
        	adddata:function(data){
        		this.openTree(data.code)
        		//保证同时只能有一个input添加
        		for(var i=0;i<this.topTreeData.length;i++){
        			if(this.topTreeData[i].edit==true){
        			    this.msgconfig.type='warning'
        				this.msgconfig.content = '请保存或取消当前修改后再试'
                		this.msgconfig.show = true
                		return
        			}
        		}
                //定位父元素位置，保证新增input在第一行
                var side=0;
                for(var i=0;i<this.topTreeData.length;i++){
                    if(this.topTreeData[i].code==data.code){
                        side=i;
                        break
                    }
                }
                this.topTreeData.splice(side+1,0,{
                    "name" : "",
                    "parentCode" : data.code,
                    'edit': true,
                    'editlength':10
                })
        	},
        	//保存新增或修改的子节点
        	savedata:function(data,name){
                if(!this.ajaxlock){
                    return
                }
                //name为空是新增节点,不为空是修改节点
                if(data.name==''){
                    var paramData = {
                        "entCode": "",
                        "params":{
                            'parentCode':data.parentCode,
                            'name':name
                        },
                        "userCode": ""
                    }
                    this.ajaxlock=false;
                    this.$http.get(__URL.arc + 'supplier/category/insert/'+name).then(
                        (res) => {
                            this.ajaxlock=true;
                            if(!res.data.data){
                                this.msgconfig.type='warning'
                                this.msgconfig.content = res.data.errMsg
                                this.msgconfig.show = true
                            }else{
                                this.msgconfig.type='success'
                                this.msgconfig.content='新增成功'
                                this.msgconfig.show=true;
                                this.topTreeData = res.data.data;
                                this.setTree();
                                this.openTree(data.parentCode)
                            }
                        },
                        (err) => {
                            this.ajaxlock=true;
                            this.msgconfig.type='warning'
                            this.msgconfig.content = '请求失败'
                            this.msgconfig.show = true
                        }
                    )
                }else{
                    var paramData={
                        "supplierCategoryCode": data.code,
                        "supplierCategoryName": name
                    }
                    //如果不修改直接保存就刷新，避免无用的请求
                    if(data.name===name){
                        this.getInitData(data);
                        return
                    }
                    this.ajaxlock=false;
                    this.$http.post(__URL.arc + 'supplier/category/update', paramData).then(
                        (res) => {
                            this.ajaxlock=true;
                            if(!res.data.data){
                                this.msgconfig.type='warning'
                                this.msgconfig.content = res.data.errMsg
                                this.msgconfig.show = true
                            }else{
                                this.msgconfig.type='success'
                                this.msgconfig.content='修改成功'
                                this.msgconfig.show=true;
                                this.topTreeData = res.data.data;
                                this.setTree();
                                this.openTree(data.parentCode)
                            }
                        },
                        (err) => {
                            this.ajaxlock=true;
                            this.msgconfig.type='warning'
                            this.msgconfig.content = '请求失败'
                            this.msgconfig.show = true
                        }
                    )
                }
        	},
        	//取消新增节点
        	cancelchange:function(data){
        		this.getInitData(data);
        	},
        	editdata:function(data){
        		this.openTree(data.parentCode)
        		//保证同时只能有一个input添加
        		for(var i=0;i<this.topTreeData.length;i++){
        			if(this.topTreeData[i].edit==true){
        			    this.msgconfig.type='warning'
        				this.msgconfig.content = '请保存或取消当前修改后再试'
                		this.msgconfig.show = true
                		return
        			}
        		}
        		for(var i=0;i<this.topTreeData.length;i++){
        			if(this.topTreeData[i].code==data.code){
        				this.topTreeData[i].edit=true;
                        this.topTreeData[i].editlength=10;
                        this.topTreeData[i].editname=this.topTreeData[i].name;
        				this.topTreeData.push({
    						"name" : "",
    						"parentCode" : data.code
        				})
        				this.topTreeData.pop();
        				break
        			}
        		}
        	},
        	//关闭树的展开
        	closeTree:function(code){
        		for(var i=0;i<this.topTreeData.length;i++){
        			if(this.topTreeData[i].code==code){
        				this.topTreeData[i].open=false;
        			}
        		}
        	}
        }
    }
</script>

<template>
    <div class="tree-wrap">
        <div class="tree-head" :class="{'border-none':!treeShow}">
    	    <div>
    	        <span :class="{'icon-contract':treeShow,'icon-deploy':!treeShow}" @click="toggleTree"></span>供应商分类
    	    </div>
    	    <div>
    	        <span class="icon-add" @click="addChild"></span>
    	    </div>
    	</div>
    	<div class="loading" v-if="loadingShow">数据加载中...</div>
    	<tree v-show="treeShow" :data='topTreeData'  :config='topTreeConfig'></tree>
    	<div class='blank' v-show='topTreeData.length==0 && !loadingShow'>
    		<!-- <img src="../../../../public/images/blank.png"> -->
    		<p>无供应商分类内容，请<a href='javascript:;' @click='addChild'>新增</a></p>
    	</div>
    </div>
    <warning :config="msgconfig" ></warning>
    <alert :config="delConfig" @cb="delThisBill">您将删除当前供应商分类，删除后该数据将无法再找回。</alert>
</template>
<style lang="less" scoped>
@import '../../../../../public/css/variable.less';
    .tree-wrap{
        border: 1px solid #dde6ef;
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

