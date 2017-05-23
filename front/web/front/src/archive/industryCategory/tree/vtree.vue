<script>
import vtreeItem from './vtree-item.js'

/*
 * @Author:ken
 * @功能点:
 * 1.树状节点按层级展示
 * 2.节点的展开、关闭
 * 3.按条件选择其中某个节点或多个节点
 * 4.树形节点中的open属性能让某级节点默认展开
 * @传入的参数:
 * 1.data 需要构建树的数据(必须)
 * 2.keyword  进行过滤的关键字(选填)
 * 3.activecode  默认选择的code(选填)
 * 4.config  树的分支功能的配置，例如增删改查按钮是否添加(选填)
 * 4.1 rightcheckbox 右侧可以选中的checkbox
 * 4.2 rightradio 右侧可以选中的checkbox
 * 4.3 rightremove 右侧可以点击的移除
 * 4.4 classmode 不同的tree样式
 * 4.4.1 defalut 默认样式
 * 4.4.2 simple 简化样式
 * 4.4.3 table 仿表格
 * 4.5 rightadd 右侧可以点击的新增
 * 4.6 rightedit 右侧可以点击的编辑
 * 4.7 rightdelete 右侧可以点击的删除
 * 4.8 rightchoicebutton 右侧可以点击的选择按钮
 * 4.9 open 树是否默认打开
 * @对外可操作功能块含以下几种接口
 * 1.返回当前节点                    getNode
 * 2.返回当前节点的父节点             getParent
 * 3.返回当前节点的兄弟节点(包含自身)  getBrother
 * 4.返回当前节点的子节点             getChild
 * 5.根据关键字过滤树                props['keyword']
 * 6.回调外层函数，返回第一个末级节点   getfirst
 */

export default {
    data: function() {
        return {
            allData:'',
            activeData: '',
            checkboxData:[]
        }
    },
    props: ['data','keyword','activecode','config'],
    watch:{
        data:{
            handler(val){
            },
            deep:true
        },
        keyword(val){
            if(val){
                this.filter(val)
                return val
            }else{
                this.filter('')
                return ''
            }
        }
    },
    methods: {
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
            //每次构建树时
            this.getfirstdata(tree)
            return tree
        },
        getfirstdata:function(data){
            if(data.length>0 && data[0].leaf==true){
                this.$emit('getfirst',data[0])
            }else if(data.length>0 && data[0].leaf==false){
                this.getfirstdata(data[0].children)
            }
        },
        getParentNode: function() {
            if (this.activeData) {
                if (this.activeData.parentCode === '') {
                    return {
                        status: 'error',
                        message: '当前节点为根节点，没有父节点'
                    }
                } else {
                    var parentCode = this.activeData.parentCode;
                    for (var i = 0; i < this.initData.length; i++) {
                        if (this.initData[i].industryCode == parentCode) {
                            return this.initData[i]
                        }
                    };
                }
            } else {
                return {
                    status: 'error',
                    message: '未选中任何节点'
                }
            }
            this.$emit('getParent', this.getParentNode())
        },
        getBrotherNode: function() {
            if (this.activeData) {
                var brotherNode = [];
                for (var i = 0; i < this.initData.length; i++) {
                    if (this.initData[i].parentCode === this.activeData.parentCode) {
                        brotherNode.push(this.initData[i])
                    }
                };
                return brotherNode;
            } else {
                return {
                    status: 'error',
                    message: '未选中任何节点'
                }
            }
            this.$emit('getBrother', this.getBrotherNode())
        },
        getChildNode: function() {
            if (this.activeData) {
                var childNode = [];
                for (var i = 0; i < this.initData.length; i++) {
                    if (this.initData[i].parentCode === this.activeData.industryCode) {
                        childNode.push(this.initData[i])
                    }
                };
                if (childNode.length == 0) {
                    return {
                        status: 'error',
                        message: '当前节点没有子节点'
                    }
                } else {
                    return childNode;
                }
            } else {
                return {
                    status: 'error',
                    message: '未选中任何节点'
                }
            }
            this.$emit('getChild', this.getChildNode())
        },
        getActiveNode: function() {
            if (this.activeData) {
                var selfNode = JSON.parse(JSON.stringify(this.activeData));
                if (selfNode.children.length < 1) {
                    selfNode.hasChildren = false;
                } else {
                    selfNode.hasChildren = true;
                }
                return selfNode
            } else {
                return {
                    status: 'error',
                    message: '未选中任何节点'
                }
            }
            // this.$emit('getNode', this.getActiveNode())
        },
        filter: function(keyword) {
            //任何情况保存一个完整的data
            if(this.allData===''){
                this.allData=JSON.parse(JSON.stringify(this.data));
            }
            //search前初始化treedata
            this.data=this.allData
            if(keyword!=''){
                var result=[];
                //先找到name匹配的节点
                for(var i=0;i<this.initData.length;i++){
                    if(this.initData[i].name.indexOf(keyword)!=-1){
                        result.push(this.initData[i])
                    }
                }
                if(result.length==0){
                    this.data=[]
                }else{
                    //根据一个节点递归遍历父级节点直到root
                    function findfather(data,that){
                        if(data.parentCode!==''){
                            for(var i=0;i<that.initData.length;i++){
                                if(that.initData[i].industryCode===data.parentCode){
                                    result.push(that.initData[i])
                                    findfather(that.initData[i],that)
                                }
                            }    
                        }
                    }
                    //根据一个节点递归遍历子孙级节点直到底层
                    function findchild(data,that){
                        if(data.leaf!=true){
                            for(var j=0;j<that.initData.length;j++){
                                if(that.initData[j].parentCode===data.industryCode){
                                    result.push(that.initData[j])
                                    findchild(that.initData[j],that)
                                }
                            }  
                        }
                    }
                    var length=result.length
                    for(var k=0;k<length;k++){
                        findfather(result[k],this);
                        findchild(result[k],this)
                    }
                    //结果数组除重
                    var lastResult=[];
                    var test={}
                    for(var i=0;i<result.length;i++){
                        if(!test[result[i]['industryCode']]){
                            lastResult.push(result[i])
                            test[result[i]['industryCode']]=1;
                        }
                    }
                    this.data=lastResult;
                }
            }else{
                return
            }
        }
    },
    computed: {
        initData:function(){
            return this.data
        },
        treeData: function() {
            var newdata = JSON.parse(JSON.stringify(this.initData));
            return this.toTreeData(newdata)
        },
        treeConfig:function(){
            //获取树的配置，如果没有配置就默认配置false
            if(!this.config){
                this.config={}
            }
            var treeConfig={
                leftradio:this.config.leftradio ?  this.config.leftradio : false,
                rightcheckbox:this.config.rightcheckbox ? this.config.rightcheckbox : false,
                rightradio:this.config.rightradio ? this.config.rightradio : false,
                rightremove:this.config.rightremove ? this.config.rightremove : false,
                classmode:this.config.classmode ? this.config.classmode : 'default',
                rightadd:this.config.rightadd ? this.config.rightadd : false,
                rightedit:this.config.rightedit ? this.config.rightedit : false,
                rightdelete:this.config.rightdelete ? this.config.rightdelete : false,
                rightchoicebutton:this.config.rightchoicebutton ? this.config.rightchoicebutton : false,
                righttext:this.config.righttext ? this.config.righttext : false,
                righttextkey:this.config.righttextkey ? this.config.righttextkey : '',
                open:this.config.open
            }

            return treeConfig
        }
    },
    components: {
        vtreeItem
    },
    events:{
        search:function(params){
            this.activeData = params;
            this.activecode = params.industryCode;
            this.$dispatch('getNode',this.getActiveNode())
        },
        //子组件checkbox选择冒泡
        checkboxdata:function(data,type){
            if(type){
                this.checkboxData.push(data)
            }else{
                for(var i=0;i<this.checkboxData.length;i++){
                    if(this.checkboxData[i].industryCode==data.industryCode){
                        this.checkboxData.splice(i,1)
                    }
                }
            }
        },
        //外部触发事件，根据当前的checkboxdata组成array并冒泡新事件
        insertdata:function(){
            if(this.config.rightcheckbox){
                var codeArray=[];
                for(var i=0;i<this.checkboxData.length;i++){
                    codeArray.push(this.checkboxData[i].industryCode)
                }
                this.$dispatch('insertcode',codeArray)
            }
        }
    }
}   
</script>
<template>
    <div class='treediv'>
        <input v-model='keyword' type='hidden'>
        <ul class="domtree" v-bind:class="{'normalTree': this.treeConfig.classmode=='default', 'lessTree': this.treeConfig.classmode=='simple' , tableTree:this.treeConfig.classmode=='table' }">
            <vtree-item :model="item" :activecode='activecode' :treeconfig='treeConfig' v-for="item in treeData"></vtree-item>
        </ul>
    </div>
</template>
<style lang='less'>
/*
*正常树的样式
*/
ul.normalTree,
ul.normalTree ul {
    margin: 0;
    padding: 0 0 0 3.3em;
    font-size: 12px;
    color: #212121;
}

ul.normalTree li {
    list-style: none;
    position: relative;
    line-height: 24px;
}

ul.normalTree .treecontent{
    line-height: 24px;
}

ul.normalTree li:first-child {
    margin-top: 3px;
}

ul.normalTree li:before {
    position: absolute;
    content: '';
    top: -0.1em;
    left: -15px;
    width: 12px;
    height: 12px;
    color: #c8d1d6;
    border-style: none none solid solid;
    border-width: 0.05em;
}

ul.normalTree>li:findchild{
    border-style:none; 
}

ul.normalTree li:not(:last-child):after {
    position: absolute;
    content: '';
    top: 0;
    left: -15px;
    bottom: 0;
    color: #dbe5ea;
    border-style: none none none solid;
    border-width: 0.05em;
}

ul.normalTree .button {
    line-height: 0;
    margin: 0;
    height: 16px;
    width: 16px;
    display: inline-block;
    vertical-align: middle;
    border: 0 none;
    cursor: pointer;
    outline: none;
    background-color: transparent;
    background-repeat: no-repeat;
    background-attachment: scroll;
    /*background-image: url("../../public/images/tree.png");*/
}

ul.normalTree .treeopen {
    background-position: -92px -3px;
}

ul.normalTree .treeclose {
    background-position: -74px -21px;
}

ul.normalTree .rightchoicebutton{
    height: 23px!important;
    line-height: 23px!important;
    width: 50px!important;
}
/*
*简易树的样式
*/
ul.lessTree,
ul.lessTree ul{
    margin: 0;
    padding: 0 0 0 2em;
    font-size: 12px;
    color: #212121;
}

ul.lessTree{
    padding: 0;
}

ul.lessTree li {
    list-style: none;
    position: relative;
    line-height: 30px;
}

ul.lessTree .treecontent{
    line-height: 30px;
}

ul.lessTree>li:first-child{
    border-style:none; 
}

ul.lessTree .button{
    font-weight: normal;
    font-style: normal;
    cursor: pointer;
    vertical-align: middle;
    font-size: 14px;
}
ul.lessTree .treeopen:after{
    content: "\E900";
}

ul.lessTree .treeclose:after{
    content: "\E902";
}

ul.lessTree .rightchoicebutton{
    height: 23px!important;
    line-height: 23px!important;
    width: 50px!important;
    margin-top:3px!important;
}
/*
*table树的样式
*/
ul.tableTree,
ul.tableTree ul {
    margin: 0;
    padding: 0 0 0 3.3em;
    font-size: 12px;
    color: #212121;
}

ul.tableTree ul{
    border-top: 1px #dde6ef solid;
    background: white;
}


ul.tableTree li {
    list-style: none;
    position: relative;
    line-height: 40px;
    border-bottom:1px #dde6ef solid;
}

ul.tableTree .treecontent{
    line-height: 40px;
}

ul.tableTree li:last-child{
    border: none;
}

ul.tableTree .activeItem {
    background:#f7fafd;
}

ul.tableTree .activeItem>div>.rightadd{
    display: block;
}

ul.tableTree .activeItem>div>.rightedit{
    display: block;
}

ul.tableTree .activeItem>div>.rightdelete{
    display: block;
}

ul.tableTree .treecontent:hover{
    background:#f7fafd;
    cursor: pointer;
}


ul.tableTree .treecontent:hover>.rightadd{
    display: block;
}

ul.tableTree .treecontent:hover>.rightedit{
    display: block;
}

ul.tableTree .treecontent:hover>.rightdelete{
    display: block;
}

ul.tableTree li:before {
    position: absolute;
    content: '';
    top: -0.1em;
    left: -15px;
    width: 12px;
    height: 20px;
    color: #c8d1d6;
    border-style: none none solid solid;
    border-width: 0.05em;
}

ul.tableTree>li:findchild{
    border-style:none; 
}

ul.tableTree li:not(:last-child):after {
    position: absolute;
    content: '';
    top: 0;
    left: -15px;
    bottom: 0;
    color: #dbe5ea;
    border-style: none none none solid;
    border-width: 0.05em;
}

ul.tableTree .button {
    line-height: 0;
    margin: 0;
    height: 16px;
    width: 16px;
    display: inline-block;
    vertical-align: middle;
    border: 0 none;
    cursor: pointer;
    outline: none;
    background-color: transparent;
    background-repeat: no-repeat;
    background-attachment: scroll;
    /*background-image: url("../../public/images/tree.png");*/
}

ul.tableTree .treeopen {
    background-position: -92px -3px;
}

ul.tableTree .treeclose {
    background-position: -74px -21px;
}

ul.tableTree .rightchoicebutton{
    margin-top: 6px;
    line-height: 23px!important;
    height: 23px!important;
    width: 58px!important;
    font-size: 12px!important;
    margin-top: 8px!important;
}

ul.tableTree .editinput{
    margin-top: 6px;
    margin-left:10px;
}

ul.tableTree .leftsave{
    font-size: 20px;
    display: inline-block;
    margin-left: 20px;
    color:#87d84f;
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border-radius: 2px;
}

ul.tableTree .leftcancel{
    font-size: 20px;
    display: inline-block;
    margin-left: 20px;
    color:#feaf00;
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border-radius: 2px;
}

ul.tableTree .leftsave:hover{
    background: #e0eaf1;
}
ul.tableTree .leftcancel:hover{
    background: #e0eaf1;
}

/*
*树下可选部件的样式和公用样式
*/

ul.domtree .treename {
    margin-left: 5px;
}

ul.domtree .treename:hover {
    cursor: pointer;
}

ul.domtree .activeItem {
    color:#008af5;
}
ul.domtree .rightchoicebox{
    position: absolute;
    top: 3px;
    right: 5px;
}
ul.domtree .rightremove{
    position: absolute;
    top: 3px;
    right: 0;
}
ul.domtree .rightadd{
    float: right;
    margin: 6px 10px 0 0;
    color: #757575;
    display: none;
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border-radius: 2px;
}
ul.domtree .rightadd:hover{
    background: #e0eaf1;
}
ul.domtree .rightedit{
    float: right;
    margin: 6px 10px 0 0;
    color:#03a9f4;
    display: none;
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border-radius: 2px;
}
ul.domtree .rightedit:hover{
    background: #e0eaf1;
}
ul.domtree .rightdelete{
    float: right;
    margin: 6px 10px 0 0;
    color:#fd1200;
    display: none;
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border-radius: 2px;
}
ul.domtree .rightdelete:hover{
    background: #e0eaf1;
}
ul.domtree .rightchoicebutton{
    float: right;
    margin-right: 10px;
    display: none;
    line-height: 28px;
    text-align: center;
    border-radius: 2px;
}
ul.domtree .activeItem>div>.rightchoicebutton{
    display: block;
}
ul.domtree li>div:hover>.rightchoicebutton{
    display: block;
}
ul.domtree .leftradio{
    top:-10px;
}
ul.domtree .righttext{
    position: absolute;
    right: 10px;
    line-height: 24px;
    text-align: center;
}
</style>
