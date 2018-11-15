var red={
    template:`<div>红色</div>`
};
var yellow={
    template:`<div>黄色</div>`
};
var blue={
    template:`<div>蓝色</div>`
};
// 注册组件的名字
Vue.component("one",{
    props:["username"],
    data(){
        return {
            str:"不要躺着，不要趴着，不要靠着，不要说话"
        }
    },
    template:`
            <div>one{{username}}{{str}}</div>
        `
})
// 注册组件的名字
Vue.component("two",{
    template:`
            <div>two</div>
        `
})

