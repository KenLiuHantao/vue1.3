/**
 * Created by SkyeTang on 2017/2/28.
 */
export default {
    props: {
        data:Object,
        config:{
            type:Object,
            default(){
                return {
                    key:'employeeName',
                    code:'employeeCode',
                    refer:['employeeName','employeeCode'],
                    item:['employeeName','employeeCode'],
                    del:['employeeName','employeeCode'],
                }
            }
        }
    },
    data() {
        return {
            //请求参数
            param: {
                "customerCategoryCode": "",
                "customerContact": "",
                "customerName": this.data[this.config.key],
                "employeeCode": "",
                "employeeName": "",
                "keyWord": "",
                "pageIndex": 0,
                "pageSize": 0
            },
            //下列展示数据
            blurData: [],
            //下拉配置
            bCfg: {
                show: false,
                key: this.config.key
            },
            //客户参照config
            referCfg:{
                show:false,
                addNew:this.config.addNew
            },
            //input配置
            iCfg:{
                icon:'icon-reference'
            },
            clickEvent: true,
            //判断数据是否来自参照，如果来自参照，则不再走模糊匹配获取值的判断
            dataFromRefer:false
        }
    },
    ready(){
        window.addEventListener('click', () => {
            this.clickEvent = true
        })
    },
    methods: {
        //当数据改变时触发
        dataChanged(val) {
            if(this.dataFromRefer) return
            this.clearData()
            this.clickEvent ? this.bCfg.show = false : this.bCfg.show = true
            this.setParam(val)
            this.getList()
        },
        //设置查询参数
        setParam(val){
            this.param[this.config.key] = this.data[this.config.key] = val
            this.param.keyword = this.data[this.config.key] = val
        },
        //获取值
        getItem(obj) {
            this.setItem(obj)
            this.clickEvent = true
        },
        //设置值
        setItem(val){
            let h = this.data
            this.config.item.forEach((key,index)=>{
                h[key] = val[this.config.refer[index]]
            })
            this.$emit('cb',this.data,val)
        },
        //匹配当前字段在模糊列表数据中是否能匹配上，匹配上则自动赋值
        findItem(arr,key){
            let info = _.find(arr,(item)=>{
                return item[this.config.key] == key
            })
            if(info != undefined)this.setItem(info)
        },
        //获取模糊查询数据的列表
        getList() {
            this.$http.post(__URL.arc + 'customer/ref', this.param).then(
                (res) => {
                    if(res.data.success){
                        this.blurData = res.data.data.dataList
                        if(this.blurData.length) this.findItem(this.blurData,this.param[this.config.key])
                    }
                }
            )
        },
        inFocus() {
            this.clickEvent = false
            //设置数据来自参照为false
            this.dataFromRefer = false
        },
        //失去焦点时，如果没有正确的值，则清空数据
        outBlur(){
            if(this.data[this.config.code] == '') this.clearData()
        },
        //重置数据
        clearData(){
            let  h= this.data
            this.config.del.forEach(key=>{
                h[key] = ''
            })
            this.$emit('clear',this.data)
        },
        getData(val){
            this.referCfg.show = false
            this.setItem(val)
        },
        //选择客户参照
        checkModal(){
            this.referCfg.show = true
            //设置数据来自参照为true
            this.dataFromRefer = true
        },
    }
}