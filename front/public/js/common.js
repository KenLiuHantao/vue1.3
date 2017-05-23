export default {
    type: true,
    initObj(base, target) {
        let keys = Object.keys(base),
            TYPE_OBJ = '[object Object]',
            TYPE_ARRAY = '[object Array]'

        for (let i = 0; i < keys.length; i++) {
            let type = Object.prototype.toString(base[keys[i]]),
                ntype = typeof base[keys[i]],
                val = base[keys[i]]

            if (val == undefined || val == '') {
                if (ntype == 'string') {
                    target[keys[i]] = ''
                }

                if (ntype == 'number') {
                    target[keys[i]] = -1
                }

                if (ntype == 'object') {
                    if (type == TYPE_OBJ) {
                        target[keys[i]] = {}
                    }
                    if (type == TYPE_ARRAY) {
                        target[keys[i]] = []
                    }
                }
            } else {
                if (ntype == 'object') {
                    if (type == TYPE_OBJ) {
                        target[keys[i]] = new Object
                        this.initObj(val, target[keys[i]])
                    }
                    if (type == TYPE_ARRAY) {
                        target[keys[i]] = new Array
                        this.copyArray(val, target[keys[i]])
                    }
                } else {
                    target[keys[i]] = val
                }
            }
        }

        return target
    },
    copyArray(base, target) {
        target.length = 0
        for (let i = 0; i < base.length; i++) {
            target.push(base[i])
        }
    }
}
