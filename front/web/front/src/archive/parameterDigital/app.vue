<script>



import cfg from './cfg.js'

export default {
    ready() {

    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listCfg,
            tableData: [],
            radioObj: {},
            modifyConfig:{
                show: false,
                width: '410px',
                height: 'auto',
                header: '修改数据格式',
                btn: [{
                    name: '取消',
                    emit: 'close',
                }, {
                    name: '确定',
                    emit: 'sure',
                }],
            },
            dataList:[],
            dig:{
              "code": "",
              "name": "",
              "decimal": '',
              "length": '',
              "decFormatter": "",
              "recordVersion": 0
            },
            way:[
                {format:"zero",method:"不足位补零",selected:false},
                {format:"zeroless",method:"不足位去零",selected:false}
            ],
            warCfg:{
                show:false,
                //success|failure|warning   三选一必填
                type:'failure',
                //根据内容自定   必填
                content:'',
                //显示时间，以毫秒为单位 选填
                showTime:'2000'
            }
        }
    },
    methods: {
        assign(base, target) {
            let tk = Object.keys(target)

            for (let i in base) {
                if (tk.indexOf(i) != -1) {
                    target[i] = base[i]
                }
            }
        },
        initListObj(obj) {
            let init = {
                 "code":obj.code
            }
            return init
        },
        href(item, type) {
            if(type == 'operate'){
                //修改
                this.assign(item,this.dig);
                this.modifyConfig.show=true;
            }
        },
        /* 数据请求 */
        getList(item,obj) {
            this.tableData=[];
            this.$http.post(__URL.arc + 'parameter/digital/list').then(
                (res) => {
                    this.dataList = res.data.data.dataList;
                    for(let index in res.data.data.dataList){
                        if(res.data.data.dataList[index].code == obj.code){
                            this.tableData.push(res.data.data.dataList[index]);
                        }
                    }
                }
            )
        },
        doUpdate(){
            this.$http.post(__URL.arc + 'parameter/digital/update',this.dig).then(
                (res) => {
                    if(res.data.success){
                        this.modifyConfig.show=false
                        this.warCfg.type="success"
                        this.warCfg.show=true
                        this.warCfg.content=res.data.data
                        this.refresh();
                    }else{
                        this.warCfg.type="failure"
                        this.warCfg.show=true
                        this.warCfg.content=res.data.errMsg
                    }
                }
            )
        },
        doClose(){
            this.modifyConfig.show=false;
            this.refresh();
        },
        change(item){
            this.dig = this.dataList[item.currentTarget.selectedIndex];
        },
        refresh(){
            this.$broadcast('_RESETLIST');
        },
        clearTable(uid,obj){
            this.tableData = []
        }
    },
    computed: {
        //参数获取
        tableUrl() {
            //return cfg.table.baseParams.url
        },
        tableCfg() {
            return cfg.tableCfg
        }
    }
}





</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <div class="left_item">
                    <new-app :config='leftItemCfg' @tab='clearTable' @cb='getList'></new-app>
                </div>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                </div>
                <div class="item_body">
                    <vtable :radio.sync='radioObj' :config='tableCfg' :data='tableData' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>

    <!-- 新增弹框系列 -->
    <modal :config.sync='modifyConfig' @sure='doUpdate' @close='doClose'>
        <div class='form-group wd-100'>
            <label>数据类型:</label>
            <p>{{dig.name}}</p>
        </div>
        <div class='form-group wd-100'>
            <label>数据总长度:</label>
            <div class="s-input">
                <input type='text' maxlength="2" v-model='dig.length'
                       onkeyup="value=value.replace(/[^\d]/g,'')" placeholder='请输入数据总长度'>
            </div>
        </div>
        <div class='form-group wd-100'>
            <label>小数位长度:</label>
            <div class="s-input">
                <input type='text' maxlength="2" v-model='dig.decimal'
                       onkeyup="value=value.replace(/[^\d]/g,'')" placeholder='请输入小数位长度'>
            </div>
        </div>
        <div class='form-group wd-100'>
            <label>小数位处理方式:</label>
            <div class="s-input">
                <select v-model='dig.decFormatter'>
                    <option :value='item.format' :selected=""
                            v-for='item in way'>{{item.method}}</option>
                </select>
            </div>
        </div>
    </modal>

    <!--警告-->
    <warning :config="warCfg"></warning>

</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
    .form-group {
        >label{
             width: 95px;
         }
        .s-input {
            @labelWidth: 125px;
            width: calc(~"100% - @{labelWidth}") !important;
        }
    }
</style>
