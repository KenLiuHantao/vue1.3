<script>
import cfg from './cfg'
import approvalTable from 'nb/approvalTable/app.vue'

export default {
    components: {
        approvalTable
    },
    data() {
        return {
            flowCfg: {
                data: [{
                    no: '1',
                    name: '离职登记',
                    time: '',
                    filed: '',
                    user: '',
                    flag: true
                }, {
                    no: '2',
                    name: '人事主管审批',
                    time: '',
                    filed: '',
                    user: '',
                    flag: true
                }, {
                    no: '3',
                    name: '完成',
                    time: '',
                    filed: '',
                    user: '',
                    flag: false
                }]
            },
            fileCfg: cfg.fileCfg,
            newEmployeeLeave: JSON.parse(JSON.stringify(cfg.employeeLeaveCfg)),
            tipsCfg: {
                type: 'success',
                show: false,
                content: ''
            },
            isEdit:false,
            buttonStatus :1,
            repeatSubmit: false,
            leaveTypes: [{
                key: 0,
                value: '主动离职'
            }, {
                key: 1,
                value: '被动离职'
//            }, {
//                key: 2,
//                value: '试用终止'
            }],
            leaveDateConfig: {
                placeholder: '请选择离职日期',
                format: 'YYYY-MM-DD'
            },
            approveLogs: []
        }
    },
    methods: {
        changeButtonStatus(){
          this.buttonStatus=2;
          this.isEdit=true;
        },
        saveEmployeeLeave() {
            if (this.repeatSubmit) return;
            this.repeatSubmit = true;
            var url = __URL.hr + 'employee/dimission/register/edit';
            this.$http.post(url, this.newEmployeeLeave).then(
                (res) => {
                    if (res.data.success) {
                        this.closeRefresh(res.data.data);
                    } else {
                        this.tipsCfg.type = "failure";
                        this.tipsCfg.show = true;
                        this.tipsCfg.content = res.data.errMsg;
                    }
                    this.repeatSubmit = false;
                }
            );
        },
        // 上传组件回调成功事件
        fileUploadSuccess(val) {
            let files = this.newEmployeeLeave.files;
            let imgItem = {
                fileId: val.fileId,
                fileName: val.fileName
            };
            if (files && files.length >= 6) {
                this.tipsCfg.show = true;
                this.tipsCfg.type = "warning";
                this.tipsCfg.content = '附件最多上传6个';
                return;
            }
            files.push(imgItem);
        },
        // 组件删除事件
        fileDelete(index) {
            this.newEmployeeLeave.files.splice(index, 1);
        },
        closeRefresh(val) {
            this.$emit('refresh', val);
        },
        cancel(){
            this.$emit('refresh', '');
        }
    },
    ready(){
        var url = __URL.doc + 'approve/log/'+this.newEmployeeLeave.recordId;
        this.$http.get(url).then(
            (res) => {
                if (res.data.success) {
                    this.approveLogs = res.data.data.dataList;
                } else {
                    this.tipsCfg.type = "failure";
                    this.tipsCfg.show = true;
                    this.tipsCfg.content = res.data.errMsg;
                }
                this.repeatSubmit = false;
            }
        );
    }
}

</script>
<template>
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 class="tag">离职登记</h2>

            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label>离职员工:</label>
                    <!-- 如果要加验证请加外层dom -->
                    <p>{{newEmployeeLeave.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label>部门:</label>
                    <p>{{newEmployeeLeave.departmentName}}</p>
                </div>
                <div class="form-group">

                    <label><span v-if="isEdit" class="must-point">*</span>离职类型:</label>
                    <p v-if="!isEdit">{{newEmployeeLeave.leaveType}}</p>
                    <select v-else v-model='newEmployeeLeave.leaveType'>
                        <option v-for='item in leaveTypes' :value='item.key'>{{item.value}}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>工号:</label>
                    <p>{{newEmployeeLeave.jobNumber}}</p>
                </div>
                <div class="form-group">
                    <label>岗位:</label>
                    <p>{{newEmployeeLeave.roleName}}</p>
                </div>
                <div class="form-group">
                    <label><span v-if="isEdit" class="must-point">*</span>离职日期:</label>
                    <p v-if="!isEdit">{{newEmployeeLeave.leaveDate}}</p>
                    <div v-else>
                        <date-picker :date.sync='newEmployeeLeave.leaveDate' :config="leaveDateConfig"></date-picker>
                    </div>
                </div>
                <div class="form-group">
                    <label><span v-if="isEdit" class="must-point">*</span>离职原因:</label>
                    <p v-if="!isEdit">{{newEmployeeLeave.leaveReason}}</p>
                    <div v-else>
                      <input type="text" maxlength='120' placeholder='请输入离职原因' v-model='newEmployeeLeave.leaveReason'>
                    </div>
                </div>
            </div>
            <div class="inner-item mt-15">
                <div class="form-group">
                    <label>附件:</label>
                    <upfile-group :data="newEmployeeLeave.files" edit='isEdit'></upfile-group>
                </div>
            </div>

            <h2 class="tag">审批记录</h2>

            <div class="inner-item">
                <approval-table :table-data="approveLogs"></approval-table>
            </div>
        </div>
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" @click='cancel' v-if="buttonStatus==1" >取消</button>
        <button class="btn-xl-imp" @click='changeButtonStatus' v-if="buttonStatus==1" >编辑</button>
        <button class="btn-xl-def" @click='cancel' v-if="buttonStatus==2" >取消</button>
        <ajax-button class="btn-xl-imp" @click='saveEmployeeLeave' v-if="buttonStatus==2">保存登记</ajax-button>
    </div>
    <warning :config="tipsCfg"></warning>
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';

    .searchBox {
        display: flex;
        flex-wrap: wrap;
    }

    .wait {
        width: 100%;
        height: 300px;
        text-align: center;
        img {
            width: 140px;
            margin-top: 80px;
        }
    }

</style>
