import Vue from 'vue'
import MessageBox from './../components/dashang.vue'

const _dsMessageBox = Vue.extend(MessageBox);
let nId = 1;
const dsMessageBox = (options) => {
    return new Promise((resolve,reject) => {
        let id = 'messageBox-' + nId++
        const MessageBoxInstance = new _dsMessageBox({
            data: {
                options: options
            },
            methods: {
                cancle(params) {
                    reject(params);
                },
                confirm(params) {
                    resolve(params)
                }
            }
        })
        
        MessageBoxInstance.id = id;
        MessageBoxInstance.vm = MessageBoxInstance.$mount();
        MessageBoxInstance.vm.visible = true;
        MessageBoxInstance.dom = MessageBoxInstance.vm.$el;
        document.body.appendChild(MessageBoxInstance.dom);
        MessageBoxInstance.dom.style.zIndex = nId + 1001;
    });
}

export default {
    install: Vue => {
        Vue.prototype.$dsMessageBox = dsMessageBox;
    }
}