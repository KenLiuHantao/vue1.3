<script>
import cfg from './cfg.js'
import refDept from './departmentMulit.vue'
import vue from 'vue'
export default {
    components:{
        refDept:refDept
    },
    ready() {
        this.choiceTab(1)
        document.addEventListener('click', () => {
            this.currentIndex = -1
        })
    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            tableCfg:cfg.tableCfg,
            recordStatus: 1,
            listDetail:[],
            departmentShow:'',
            ckdCode: '',
            openCode:'',
            deleteParam:{},
            modalConfig: {
                show: false,
                width: '480px',
                height: 'auto',
                header: '新增工序',
                btn: [{
                    name: '取消',
                    emit: 'close',
                }, {
                    name: '确定',
                    emit: 'sure',
                }],
                isEdit: false,
            },
            detailConfig: {
                show: false,
                width: '480px',
                height: 'auto',
                header: '查看工序',
                btn: [{
                    name: '取消',
                    emit: 'close',
                }]
            },
            warnConfig: {
                show: false,
                type: 'warning',
                content: ''
            },
            alertConfig: {
                show: false,
                type: 'warning',
                msg: '停用后该工序在该班组将不能使用？是否停用？',
                subMsg: ''
            },
            //业务员弹框
            codeModal: {
                show: false,
                width: '800px',
                height: '400px',
                header: '请选择负责人',
                btn: [{
                    name: '关闭',
                    emit: 'codeclose'
                }, {
                    name: '确认',
                    emit: 'codesure'
                }]
            },
            listObj: cfg.listParam,
            tableData: [],
            processData: {
                processCode: '',
                processName: '',
                departmentVos:[],
                recordVersion:"",
                attachments:[]
            },
            //记录编辑时，未操作前的旧值
            originData:[],
            departmentVo:{
                parentCode: '',
                parentName: '',
                departmentCode: "",
                departmentName: "",
                departmentEmployeeCode: '',
                departmentEmployeeName: '',
            },
            depCfg:{
                show:false,
                data:[],
                param:{}
            },
            upfileCfg:{
                extensions: 'txt, doc, docx, xls, xlsx, ppt, pptx, wps, rtf, pdf, xmind, rp,rar, zip, gz, z, 7z,bmp, gif, jpg, jpeg, pic, png, tif,ai, psd, cdr,svg',
                limit:6
            },
            displayAreaData: [],
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
        // table返回的操作参数
        operate(type, item) {
            this.processData = JSON.parse(JSON.stringify(item))
            switch (type) {
                case 'modify': // 编辑
                    this.openUpdateModal(item);
                    break;
                case 'delete': // 删除
                    this.alertConfig.show = true;
                    this.deleteParam = item;
                    break;
            }
        },
        href(item){
            this.detailConfig.show = true
            this.departmentShow = '';
            this.displayAreaData = []
            this.getDetail(item);
        },
        getFilter(item, obj) {
            this.getList(item)
        },
        /* 数据请求 */
        getList(obj) {
            var url = __URL.arc + 'process/list';
            this.$http.post(url, obj).then((res) => {
                this.tableData = res.data.data.dataList
            });
        },
        refresh() {
            this.$broadcast('_RESETLIST');
            this.tableData = [];
        },
        openAddModal() {
            this.modalConfig.header = '新增工序';
            this.modalConfig.show = true;
            this.modalConfig.isEdit = false
            this.departmentShow = '';
            this.processData = {
                processCode: '',
                processName: '',
                departmentVos:[],
                recordVersion:'',
                attachments:[]
            }
        },
        openUpdateModal(item) {
            this.departmentShow = '';
            this.getDetail(item);
            this.modalConfig.header = '修改工序';
            this.modalConfig.show = true;
            this.modalConfig.isEdit = true
        },
        showDepartment(item){
            var test={};
            for(var i = 0;i < item.length;i++){
                if(!test[item[i].parentName]){
                    test[item[i].parentName]=[];
                    test[item[i].parentName].push(item[i].departmentName)
                }else{
                    test[item[i].parentName].push(item[i].departmentName)
                }
            }

            for( var j in test){
                this.departmentShow+=j+'/';
                for(var k=0;k<test[j].length;k++){
                    if(k!=test[j].length-1){
                        this.departmentShow+=test[j][k]+'、'
                    }else{
                        this.departmentShow+=test[j][k]+'; '
                    }
                }
            }
        },
        doSave() {
            let url = __URL.arc + 'process/insert';
            if (this.processData.recordVersion) {
                url = __URL.arc + 'process/update';
            }
            this.$http.post(url, this.processData).then((res) => {
                if (res.data.success) {
                    this.warnConfig.content = '保存成功';
                    this.warnConfig.type = 'success';
                    this.warnConfig.show = true;
                    this.modalConfig.show = false;
                } else {
                    this.warnConfig.content = res.data.errMsg;
                    this.warnConfig.type = 'failure';
                    this.warnConfig.show = true;
                }
                this.refresh();
            });
        },
        doDelete() {
            let param ={
                processCode: this.deleteParam.processCode,
                departmentCode: this.deleteParam.departmentCode
            }
            this.$http.post(__URL.arc + 'process/delete', param).then((res) => {
                this.alertConfig.show = false;
                if (res.data.success) {
                    this.warnConfig.content = '停用成功';
                    this.warnConfig.type = 'success';
                    this.warnConfig.show = true;

                } else {
                    this.warnConfig.content = res.data.errMsg;
                    this.warnConfig.type = 'failure';
                    this.warnConfig.show = true;

                }

                this.refresh();
            });
        },
        searchemployee: function () {
            this.codeModal.show = true;
        },
        clearemployeeName(){
            this.processData.departmentEmployeeCode = '';
            this.processData.departmentEmployeeName = '';
        }, 
        pickPerson(data){
            this.codeModal.show = false;
            this.processData.departmentEmployeeCode = data.employeeCode;
            this.processData.departmentEmployeeName = data.employeeName;
        },
        //部门
        openDep(){
            this.depCfg.show=true;
            this.depCfg.data=this.processData.departmentVos;
        },
        clearDep(){
            this.processData.departmentVos=[];
            this.depCfg.data=[];
        },
        pickDep(item){
            this.processData.departmentVos = [];
            for (let i = 0 ;i < item.length;i++){
                let  departmentVo = {
                    code: item[i].code,
                    name: item[i].name,
                    departmentEmployeeCode: item[i].manager,
                    departmentEmployeeName: item[i].managerName,
                }
                this.processData.departmentVos.push(departmentVo)
            }

            this.departmentShow = '';
            this.showDept(item);
            this.depCfg.data = [].concat(this.processData.departmentVos)
        },
        showDept(item){
            var test={};
            for(var i = 0;i < item.length;i++){
                if(!test[item[i].parentName]){
                    test[item[i].parentName]=[];
                    test[item[i].parentName].push(item[i].name)
                }else{
                    test[item[i].parentName].push(item[i].name)
                }
            }

            for( var j in test){
                this.departmentShow+=j+'/';
                for(var k=0;k<test[j].length;k++){
                    if(k!=test[j].length-1){
                        this.departmentShow+=test[j][k]+'、'
                    }else{
                        this.departmentShow+=test[j][k]+'; '
                    }
                }
            }
        },
        // 上传组件回调成功事件
        updateSuccess(val) {
            let ucloud = this.processData.attachments;
            let imgItem = {
                fileId: val.fileId,
                fileName: val.fileName
            }
            if(ucloud.length>=6){
                this.warnConfig.show=true
                this.warnConfig.content='附件最多上传6个'
                return
            }
            ucloud.push(imgItem)
        },// 组件删除事件
        deleteImg(index) {
            this.processData.attachments.splice(index, 1)
        },
        clearTable(uid,obj){
            this.tableData = []
        },


        /* 重置对象 */
        initListObj(obj) {
            let init = {
                "pageIndex": 0,
                "pageSize": 0,
                "code": obj.processCode,
                "departmentCode": obj.departmentCode,
                "recordStatus": this.recordStatus
            }
            return init
        },
        choiceTab(index1){
            this.recordStatus=index1;
            this.openCode = ''
            this.ckdCode = ''
            this.tableData=[]
            this.getFirst('refresh')

            if(index1 == 1){
                this.tableCfg = cfg.tableCfg
            }else{
                this.tableCfg = cfg.tableCfg2
            }
        },
        getDetail(item){
            var param={
                "pageIndex": 0,
                "pageSize": 0,
                "processCode": item.processCode,
                "recordStatus": this.recordStatus
            }
            this.$http.post(__URL.arc + 'process/detail', param).then(
                (res) => {
                    if(res.data.success){
                        this.processData = res.data.data;
                        //记录下未操作前的历史数据
                        this.originData =[].concat(res.data.data.departmentVos);
                        //处理要显示的部门名称
                        this.showDepartment(this.processData.departmentVos);
                        //处理要显示成树状结构的部门列表值
                        this.getDisplayAreaData()
                        //处理要直接保存的数据格式
                        this.evalData(this.processData.departmentVos)
                    }else{
                        this.warnConfig.show=true
                        this.warnConfig.content=res.data.errMsg
                    }
                }
            )
        },
        //处理成保存数据的数据格式
        evalData(val){
            let item = val
            this.processData.departmentVos = []
            for (let i = 0 ;i < item.length;i++){
                let  departmentVo = {
                    code: item[i].departmentCode,
                    name: item[i].departmentName,
                    departmentEmployeeCode: item[i].departmentEmployeeCode,
                    departmentEmployeeName: item[i].departmentEmployeeName,
                }
                this.processData.departmentVos.push(departmentVo)
            }
        },
        // 数据重组，以供modal中班组项的展示
        getDisplayAreaData () {
            const origin = [].concat(this.processData.departmentVos)
            const result = []
            origin.forEach(val => {
                let newValue = Object.assign({},val)
                let i = result.map(val => val.parentCode).indexOf(val.parentCode)
                if (i === -1) {
                    let arr = []
                    arr.push(newValue)
                    val.children = arr
                    vue.set(val, 'show', false)
                    result.push(val)
                } else {
                    result[i].children.push(newValue)
                }
            })
            this.displayAreaData = result
        },
        getTable(item){
            var param=this.initListObj(item)
            this.$http.post(__URL.arc + 'process/list', param).then(
                (res) => {
                    if(res.data.success){
                        var dataList=res.data.data.dataList;
                        this.tableData=dataList
                        this.totalCount=res.data.data.totalCount;
                        this.consoleStatus = param.transferStatus
                    }else{
                        this.warnConfig.show=true
                        this.warnConfig.content=res.data.errMsg
                    }
                }
            )
        },
        getFirst(type){
            var param={
                //"pageIndex": this.pageIndex,
                "pageIndex": 0,
                "pageSize": 0,
                "recordStatus": this.recordStatus,
            }
            this.$http.post(__URL.arc + 'process/department/list', param).then(
                (res) => {
                    if(res.data.success){
                        if (type == 'refresh') {
                            this.listDetail.splice(0, this.listDetail.length);
                        }
                        for(var i=0;i<res.data.data.dataList.length;i++){
                            this.listDetail.push(res.data.data.dataList[i])
                        }
                        this.totalCount=res.data.data.totalCount;
                        if(this.listDetail.length>0){
                            this.openFirst(this.listDetail[0])
                        }
                    }else{
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },
        loadMore(){
            this.getFirst('add')
        },
        //点击一级
        openFirst(item, index) {
            //选中事件
            this.ckdCode = item.departmentCode;
            //展开事件
            if (this.openCode === item.departmentCode) {
                this.openCode = ''
            } else {
                this.openCode = item.departmentCode
            }
            this.getTable(item)
        },
        choiceSec(first,sec) {
            this.ckdCode = first.departmentCode.toString() + sec.departmentCode.toString();
            this.getTable(sec)
        },
        displayAreaFirstSwitch (item) {
            item.show = !item.show
        },
    },
    computed: {
        /* 参数获取 */
        tableUrl() {
            return cfg.table.baseParams.url
        },
        tableParams() {
            let param = {
                'entCode': '',
                'params': {
                    'pageIndex': 0,
                    'pageSize': 0
                },
                'userCode': ''
            }

            return param
        }
    }
}
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <div class="item_head between">
                    <a @click='openAddModal'>
                        <i class="icon-hp_list__add"></i>新增
                    </a>
                    <a href="javascript:;"  @click=''>
                        <!--<i class="icon-filter-two"></i>筛选-->
                    </a>
                </div>
                <div class="item_body">
                    <div class='list_div'>
                        <div class='list_tab' >
                            <a href="javascript:;"  @click='choiceTab(1)' :class="{ckd:1==recordStatus}">
                                启用中
                            </a>
                            <a href="javascript:;"  @click='choiceTab(0)' :class="{ckd:0==recordStatus}">
                                已停用
                            </a>
                        </div>
                        <div class='list_content'>
                            <ul class='listbox'>
                                <li class='first_li' v-for='(index,firstLv) in listDetail'>
                                    <a :class='{ckd:firstLv.departmentCode==ckdCode}' @click='openFirst(firstLv,index)' href="javascript:;">
                                        <i v-show='firstLv.children.length>0 && firstLv.departmentCode!=openCode' class='icon-hp_list__right'></i>
                                        <i v-show='firstLv.children.length>0&& firstLv.departmentCode==openCode' class='icon-hp_list__dropdown' :class='{childchoice:firstLv.departmentCode!=ckdCode&&firstLv.departmentCode==openCode}'></i>
                                        <p :class='{childchoice:firstLv.departmentCode!=ckdCode&&firstLv.departmentCode==openCode}' class='main'>{{firstLv.departmentName}}</p>
                                        <span class='tip_number'>{{firstLv.employeeCount}}</span>
                                    </a>
                                    <ul v-if='firstLv.children.length>0' v-show='firstLv.departmentCode==openCode' class='sec_ul'>
                                        <li @click.stop='choiceSec(firstLv,secLv)' class='sec_li' :class='{hasnumber:firstLv.hasNumber,ckd:firstLv.departmentCode.toString()+secLv.departmentCode.toString()==ckdCode}' v-for='(index,secLv) in firstLv.children'>
                                            <!-- <div v-if='firstLv.hasNumber' class='number-title'>{{index+1}}</div> -->
                                            <p class='main'>{{secLv.departmentName}}</p>
                                            <span class='tip_number'>{{secLv.employeeCount}}</span>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div class='list_loadmore' v-show='hasMore' @click='loadMore'>
                            加载更多...
                        </div>
                    </div>
                </div>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                    <!-- <a href="javascript:;">
                        <i class='icon-hp_list__add'></i>test
                    </a> -->
                </div>
                <div class="item_body">
                    <div>
                        <vtable  :config='tableCfg' :data='tableData' @link='href' @op='operate'></vtable>
                    </div>

                </div>
            </div>
        </div>
    </container>

    <!-- 编辑弹框 -->
    <modal :config.sync='modalConfig' @sure='doSave' @close='modalConfig.show = false;'>
            <div class='form-group wd-100'>
                <label><span v-if="!modalConfig.isEdit" class="must-point">*</span>工序:</label>
                <div class="s-input">
                    <p v-if="modalConfig.isEdit">{{processData.processName}}</p>
                    <input v-if="!modalConfig.isEdit" type='text' v-model='processData.processName' placeholder='请输入工序名称'>
                </div>
            </div>
            <div class='form-group wd-100'>
                <label><span class="must-point">*</span>班组:</label>
                <div class="s-input ic2">
                    <input placeholder='请选择班组'  readonly type="text" v-model='departmentShow'>
                    <i @click='openDep' class="icon-search r1"></i>
                </div>
            </div>
            <div class="form-group wd-100">
                <label>附件:</label>
                <div class='annexBox'>
                    <upfile-group :config ='upfileCfg' :data="processData.attachments" edit="ture"></upfile-group>
                </div>

            </div>
            <div class="form-group wd-100">
                <label>备注:</label>
                <div class="s-input">
                <input type="text" maxlength='120' v-model='processData.remark'>
                </div>
            </div>
    </modal>

    <!-- 详情弹框 -->
    <modal :config.sync='detailConfig' @close='detailConfig.show = false;'>
        <div class='form-group wd-100'>
            <label><span class="must-point">*</span>工序:</label>
            <p>{{processData.processName}}</p>
        </div>
        <div class='form-group wd-100 align_baseline'>
            <label><span class="must-point">*</span>班组:</label>
            <div v-if="displayAreaData.length" class="displayArea">
                <ul class="displayArea-block">
                    <li v-for="item in displayAreaData">
                        <div @click="displayAreaFirstSwitch(item)" class="first">
                            <i :class="{ 'active': item.show }" class="arrow icon-hp_list__right"></i>
                            <div>{{ item.parentName }}
                                    <span v-for="(index, sonItem) in item.children">
                                        {{ sonItem.departmentName }}
                                        <span v-if="index+1 !== item.children.length">/</span>
                                    </span>
                            </div>
                        </div>
                        <ul v-if="item.children.length" v-show="item.show" class="second">
                            <li v-for="sonItem in item.children">
                                <div>{{ sonItem.departmentName }}</div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <div class="form-group wd-100">
            <label>附件:</label>
            <div class='annexBox'>
                <upfile-group :config ='upfileCfg' :data="processData.attachments" :edit="false"></upfile-group>
            </div>
        </div>
        <div class="form-group wd-100">
            <label>备注:</label>
            <p>{{processData.remark}}</p>
        </div>
    </modal>

    <alert :config="alertConfig" @cb="doDelete"></alert>

    <warning :config="warnConfig"></warning>

    <!--<refer-employee :config='codeModal' @cb='pickPerson' ></refer-employee>-->

    <ref-dept :config="depCfg" :origin-data="originData" @cb="pickDep"></ref-dept>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
    .process .box .ckd {
        position: relative;
        background: #f0f9fd !important;

        &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 2px;
            height: 100%;
            background-color: #008af5;
        }
    }
    .item_head:hover{
        cursor: pointer;
    }
    .reset_password{
        text-align: center;
        img{
            width: 50px;
            height:50px;
            margin-top: 20px;
        }
        .main{
            padding: 10px 30px;
            color: #212121;
            font-size: 12px;
        }
        .minor{
            padding:10px;
            padding-bottom: 30px;
            color: #757575;
            font-size: 12px;
        }
    }
    .modal-area {
        .form-group {

            > label {
                margin-left: 25px;
                width: 60px;
            }
        }

        .align_baseline {
            align-items: baseline;
        }
    }
    .displayArea {
        width: 360px;
        height: 160px;
        padding: 10px 15px;
        border: 1px dashed #d3dff6;
        background-color: #fafcff;
        overflow-y: auto;

        .first,
        .second {
            div {
                line-height: 24px;
            }

            span {
                color: #757575;
            }
        }

        .first {
            position: relative;
            padding-left: 20px;
            cursor: pointer;

            .arrow {
                position: absolute;
                left: 0;
                top: 7px;
                transform: rotate(-90deg);
                transition: all .2s;

                &.active {
                    transform: rotate(0);
                }
            }
        }

        .second {
            div {
                padding-left: 35px;
            }
        }
    }
</style>