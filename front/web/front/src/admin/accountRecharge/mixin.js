export default {
    methods: {
        /*
         * 获取类型  1 为充值  0 为消费
         * */
        getType(val){
            if (val == 1) {
                return '充值'
            } else if (val == 0) {
                return '消费'
            }
        },
        fixedNumber(val){
            return (val / 100).toFixed(2)
        }
    }
}