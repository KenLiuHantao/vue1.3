export  default {
    computed:{
        indexPath(){
            let path = [this.index]
            let parent = this.$parent
            while(parent.$options.componentName !== 'ecMenu'){
                if(parent.index){
                    path.unshift(parent.index)
                }
                parent = parent.$parent
            }
            return path
        },
        rootMenu(){
            let parent = this.$parent
            while(parent && parent.$options.componentName !== 'ecMenu'){
                parent = parent.$parent
            }
            return parent
        },
        parentMenu(){
            let parent = this.$parent
            while(parent && ['ecMenu','ecSubmenut'].indexOf(parent.$options.componentName) === -1){
                parent = parent.$parent
            }
            return parent
        }
    }
}