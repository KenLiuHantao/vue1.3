<script>
import cfg from './cfg'
export default {
    props:['employeeDetail'],
    data() {
        return {
            valiVal: '',
            tabConfig: {
                type:'page',
                select: '',
                tabBarData: [{
                    id: 'tab1',
                    name: '合同信息',
                    icon: 'icon-contract__msg'
                },{
                    id: 'tab2',
                    name: '任职履历',
                    icon: 'icon-resume'
                }]
            },
//            flowCfg:{
//                data:[{
//                    no:'1',
//                    name:'新增人事档案',
//                    time:'',
//                    filed:'',
//                    user:'',
//                    flag:true,
//                },{
//                    no:'2',
//                    name:'管理员授权',
//                    time:'',
//                    filed:'',
//                    user:'',
//                    flag:false,
//                },{
//                    no:'3',
//                    name:'完成',
//                    time:'',
//                    filed:'',
//                    user:'',
//                    flag:false,
//                }]
//            },
            newEmployee:this.employeeDetail,
            allpost:[],
            ajaxlock:true,
            msgconfig:{
                type:'warning',
                show:false,
                content:''
            },
            uCfg:{
                limit:6,
                maxwidth:240
            },
            dateCfg:{
                format: 'YYYY-MM-DD'
            }
        }
    },
    methods: {
        cancel(){
            this.$emit('refresh')
        }
    },
    ready(){

    }
}
</script>
<template>
    <div class="inner-wrapper">
        <div class="inner-content">

            <h2 class="tag">员工档案</h2>

                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>工号:</label>
                        <!-- 如果要加验证请加外层dom -->
                        <p>{{newEmployee.jobNumber}}</p>
                    </div>
                    <div class="form-group">
                        <label>性别:</label>
                        <p>{{newEmployee.sex}}</p>
                    </div>
                    <div class="form-group">
                        <label>入职时间:</label>
                        <p>{{newEmployee.enterDate}}</p>
                    </div>
                    <div class="form-group">
                        <label>姓名:</label>
                        <p>{{newEmployee.name}}</p>
                    </div>
                    <div class="form-group">
                        <label>身份证号码:</label>
                        <p>{{newEmployee.idCard}}</p>
                    </div>
                    <!--<div class="form-group">-->
                        <!--<label>聘用形式:</label>-->
                        <!--<p v-show='newEmployee.officeForm==0'>非正式</p>-->
                        <!--<p v-show='newEmployee.officeForm==1'>正式</p>-->
                    <!--</div>-->
                    <div class="form-group">
                        <label>转正日期:</label>
                        <p>{{newEmployee.confirmationDate}}</p>
                    </div>
                    <div class="form-group">
                        <label>部门:</label>
                        <p>{{newEmployee.departmentName}}</p>
                    </div>
                    <div class="form-group">
                        <label>手机号码:</label>
                        <p>{{newEmployee.phone}}</p>
                    </div>
                    <div class="form-group">

                    </div>
                    <div class="form-group">
                        <label>岗位:</label>
                        <p>{{newEmployee.roleName}}</p>
                    </div>
                    <div class="form-group">
                        <label>工作邮箱:</label>
                        <p>{{newEmployee.email}}</p>
                    </div>
                    <div class="form-group">
                    </div>
                    <div class="form-group wd-100" v-if="employeeDetail.viceRole.length>0">
                        <label>兼任岗位:</label>
                        <div class="flex">
                            <div v-for="item in employeeDetail.viceRole">
                                <p>{{item.departmentName}}-{{item.roleName}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="inner-item">
                    <tab-bar :config.sync='tabConfig'></tab-bar>
                    <tab-container :active.sync='tabConfig.select'>
                        <tab-item id='tab1'>
                            <table class='inner-table mt-15'>
                                <thead>
                                    <tr>
                                        <th style='width:10%'>合同类别</th>
                                        <th style='width:10%'>合同期限</th>
                                        <th style='width:15%'>合同开始时间</th>
                                        <th style='width:15%'>合同结束时间</th>
                                        <th style='width:20%'>合同文件</th>
                                        <th style='width:10%'>备注</th>
                                        <th style='width:5%'>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr  v-for='item in newEmployee.employeeContracts'>
                                        <td>
                                            <p v-show='item.employeeForm==0'>劳动合同</p>
                                            <p v-show='item.employeeForm==1'>劳务合同</p>
                                            <p v-show='item.employeeForm==2'>临时合同</p>
                                            <p v-show='item.employeeForm==3'>返聘协议</p>
                                            <p v-show='item.employeeForm==4'>实习协议</p>
                                        </td>
                                        <td>
                                            <p v-show='item.contractPeriod==0'>6个月</p>
                                            <p v-show='item.contractPeriod==1'>12个月</p>
                                            <p v-show='item.contractPeriod==2'>24个月</p>
                                            <p v-show='item.contractPeriod==3'>36个月</p>
                                            <p v-show='item.contractPeriod==4'>无固定期限合同</p>
                                            <p v-show='item.contractPeriod==5'>其它</p>
                                        </td>
                                        <td>
                                            <p>{{item.beginDate}}</p>
                                        </td>
                                        <td>
                                            <p>{{item.endDate}}</p>
                                        </td>
                                        <td>
                                            <upfile-group :config ='uCfg' :edit='false' :data="item.files"></upfile-group>
                                        </td>
                                        <td class="text-left">
                                            <p class="lh-20">{{item.remark}}</p>
                                        </td>
                                        <td>
                                            <!-- <a @click='deleteEmployeeContract'>删除</a> -->
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </tab-item>
                        <tab-item id='tab2'>
                            <table class='inner-table mt-15'>
                                <thead>
                                    <tr>
                                        <th style='width:10%'>履历</th>
                                        <th style='width:10%'>时间</th>
                                        <th style='width:10%'>岗位</th>
                                        <th style='width:70%'>说明</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for='item in newEmployee.employeeResumes'>
                                        <td>
                                            <p v-show='item.resume==0'>入职</p>
                                            <p v-show='item.resume==1'>转正</p>
                                            <p v-show='item.resume==2'>调岗</p>
                                            <p v-show='item.resume==3'>离职</p>
                                        </td>
                                        <td>
                                            <p>{{item.resumeDate}}</p>
                                        </td>
                                        <td>
                                            <p>{{item.roleName}}</p>
                                        </td>
                                        <td>
                                            <p>{{item.remark}}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </tab-item>
                    </tab-container>
                </div>
        </div>
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" @click='cancel'>关闭</button>
        <!-- <button class="btn-xl-imp" @click='saveEmployee'>保存</button> -->
    </div>
    <warning :config="msgconfig" ></warning>
</template>
<style lang='less' scoped>
/* 此处为自己定义的样式 */
@import '../../../../../public/css/variable.less';
.flex {
    display: flex;
    flex-wrap: wrap;
    div {
        padding-right: 20px;
        p {
            line-height: 20px;
        }
    }
}
</style>
