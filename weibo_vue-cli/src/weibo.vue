<template>
    <div class="jyArea">
        <!--留言-->
        <takeComment @getContextList="getContextList(pageIndex)"></takeComment><!--子向父传事件-->
        <!--已留-->
        <commentOn :contextList="contextList" :pageIndex="pageIndex" :pageSum="pageSum" @getContextList="getContextList"></commentOn><!--进行操作-->
    </div>
</template>

<script>
    import "./assets/style/weibo.css";//引入样式资源
    import commentOn from '@/components/commentOn'
    import takeComment from '@/components/takeComment'
    //var bus = new Vue;
    export default {
        name: "weibo",
        data(){
            return{
                contextList:[],
                pageIndex:1,
                pageSum:[]
            }
        },
        components:{ //引入插件
            commentOn,
            takeComment
        },
        methods:{
            //获取留言板信息
            getContextList( pageIndex ){
                alert(pageIndex);
                this.$http.get("http://127.0.0.1/getweibo?pageIndex=" + pageIndex).then(({data}) => {
                    if( data.ok === 1 ){
                        //console.log( data );
                        this.pageIndex = data.pageIndex;
                        this.pageSum = data.pageSum;
                        this.contextList = data.contextList;
                        console.log( data.contextList );
                    }else{
                        alert( data.msg );
                    }
                })
            }
        },
        mounted(){
            //自动进行初始化
            this.getContextList();
        }
    }
</script>

<style scoped>

</style>
