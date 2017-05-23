/**
 * Created by liuht on 16/10/26.
 */
import Vue from 'vue'
export default Vue.extend({
    template:"<li v-bind:class='{activeItem:(activestatus || checked)}'>" +
    "<div class='treecontent' v-on:click='choose(model)'>" +
    "<span v-on:click.stop='toggle'  class='button' v-bind:class='{treeopen:open,treeclose:!open}' v-if='haschild'></span>" +
    "<input v-if='model.edit' @keyup.enter='savedata' class='editinput' v-model='editname' type='text' :maxlength='model.editlength'>" +
    "<span v-if='model.edit' @click='savedata' class='leftsave icon-ierp'></span>" +
    "<span v-if='model.edit' @click='cancelchange' class='leftcancel icon-close__round'></span>" +
    "<input v-if='treeconfig.leftradio && !haschild' @click='choiceradio' type='radio' class='leftradio' name='radio'>" +
    "<span v-on:click.stop='choose(model)'  class='treename' v-bind:class='{activeItem:(activestatus || checked)}'  v-show='!model.edit'>{{model.industryName}}</span>" +
    "<input v-if='treeconfig.rightcheckbox' type='checkbox' class='rightchoicebox' @click='clickcheckbox' v-model='checked'>" +
    "<input v-if='model.config' type='radio' class='rightchoicebox' name='radio'>" +
    "<span @click='removedata' v-if='treeconfig.rightremove && !haschild && !model.edit' class='rightremove icon-close__round'></span>" +
    // "<span @click='adddata' v-if='treeconfig.rightadd && !model.edit' class='rightadd icon-add'></span>" +
    "<span @click='editdata' v-if='treeconfig.rightedit && !model.edit' class='rightedit icon-documentary'></span>" +
    "<span @click='deletedata' v-if='treeconfig.rightdelete && !haschild && !model.edit' class='rightdelete icon-out-library'></span>" +
    "<span @click='choicedata' v-if='treeconfig.rightchoicebutton && !haschild && !model.edit' class='btn-md-imp rightchoicebutton'>选择</span>" +
    "<span class='righttext' v-if='treeconfig.righttext'>{{model[treeconfig.righttextkey]}}</span>"+
    "</div>" +
    "<ul v-if='haschild' v-show='open'>" +
    "<cli v-for='item in model.children' :treeconfig='treeconfig' :activecode='activecode' :model='item'><cli>" +
    "</ul>" +
    "</li>" ,
    name: 'cli',
    props: ['model','activecode','treeconfig'],
    data:function() {
        return {
            open:true,
            checked:false,
            editname:''
        }
    },
    watch:{
        checked(val) {
            //右侧checkbox选中的时候将选中数据上传
            this.choicecheckboxdata(this.model,this.checked)
            // // //如果父节点未选中也选中
            if(this.checked && this.model.parentCode){
                this.$parent.checked=true;
            }
            // //取消时如果有子节点一起取消
            if(this.haschild && !this.checked){
                for(var i=0;i<this.$children.length;i++){
                    this.$children[i].checked=false;
                }
            }
            // //取消时如果所有兄弟节点都已经取消则父节点取消
            if(this.model.parentCode && !this.checked){
                var allFalse=true;
                for(var i=0;i<this.$parent.$children.length;i++){
                    if(this.$parent.$children[i].checked){
                        allFalse=false;
                        break;
                    }
                }
                if(allFalse){
                    this.$parent.checked=false;
                }
            }
        },
    },
    computed: {
        //是否还有子节点
        haschild:function(){
            if(this.model.children.length>0){
                return true
            }else{
                return false
            }
        },
        //是否激活
        activestatus:function(){
            //如果有右侧选择按钮就不允许激活
            if(this.treeconfig.rightcheckbox){
                return false
            }
            if(this.model.industryCode===this.activecode){
                return true
            }else{
                return false
            }
        }
    },
    ready(){
        if(this.treeconfig.open!=undefined){
            this.open=this.treeconfig.open;
        }
        if(this.model.open==true){
            this.open=true;
        }
        if(this.model.editname!==undefined){
            this.editname=this.model.editname
        }else{
            this.editname=''
        }
    },
    methods:{
        //点击checkbox事件
        clickcheckbox:function(){
            if(this.checked){
                this.checked=false
            }else{
                this.checked=true
                this.checkchild();
            }
        },
        checkchild:function(){
            if(this.haschild && this.checked){
                for(var i=0;i<this.$children.length;i++){
                    this.$children[i].clickcheckbox();
                }
            }
        },
        //切换子节点展开和关闭的样式
        toggle:function(){
            if(this.open){
                this.open=false;
                if(this.model.open){
                    this.$dispatch('closeTree',this.model.industryCode)
                }
            }else{
                this.open=true
            }
        },
        //选中名字
        choose:function(data){
            if(this.$parent.choose){
                this.$parent.choose(data)
            }else{
                this.$dispatch('search',data)
            }
        },
        //选择checkbox触发
        choicecheckboxdata:function(data,type){
            if(this.$parent.choicecheckboxdata){
                this.$parent.choicecheckboxdata(data,type)
            }else{
                this.$dispatch('checkboxdata',data,type)
            }
        },
        //点击移除x触发,直接冒泡到页面vue组件级
        removedata:function(){
            this.$dispatch('removedata',this.model)
        },
        //点击增改删按钮触发冒泡事件
        deletedata:function(){
            this.$dispatch('deletedata',this.model)
        },
        editdata:function(){
            this.$dispatch('editdata',this.model)
        },
        adddata:function(){
            this.$dispatch('adddata',this.model)
        },
        savedata:function(){
            this.$dispatch('savedata',this.model,this.editname)
        },
        cancelchange:function(){
            this.$dispatch('cancelchange',this.model)
        },
        //点击选择按钮
        choicedata:function(){
            this.$dispatch('choicedata',this.model)
        },
        choiceradio:function(){
            this.$dispatch('choiceradio',this.model)
        }
    }
})


