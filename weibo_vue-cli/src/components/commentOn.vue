<!--已经留言的留言板模块-->
<template>
    <div class="commentOn">
        <div class="noContent" v-show="contextList.length<1">暂无留言</div>
        <div class="messList">
            <div class="reply" v-for="item in contextList">
                <p class="replyContent">{{item.context}}</p>
                <p class="operation">
                    <span class="replyTime">2017.7.30</span>
                    <span class="handle">
                    	<a href="javascript:;" class="top" @click="typeWeibo( item._id ,1)">{{item.topNum}}</a>
                        <a href="javascript:;" class="down_icon" @click="typeWeibo( item._id ,2)">{{item.downNum}}</a>
                        <a href="javascript:;" class="cut" @click="delWeibo( item._id )">删除</a>
                    </span>
                </p>
            </div>
        </div>
        <div class="page">
            <!--<a href="javascript:;" class="active">{{pageIndex}}</a>-->
            <a href="javascript:;"  v-for="(item,i) in pageSum" @click="$emit('getContextList',i+1)">{{item}}</a>
        </div>
    </div>
</template>

<script>
    export default {
        name: "commentOn",
        props:["contextList","pageSum","pageIndex"],
        data(){
            return {

            }
        },
        methods:{
            //删除微博信息
            delWeibo( id ){
                //alert(id);
                this.$http.get("http://127.0.0.1/delweibo?id="+id).then(({data}) => {
                    if( data.ok === 1 ){
                        //console.log( data );
                        this.$emit( "getContextList" );

                    }
                })
            },
            //顶和踩
            typeWeibo( id,type ){
                //alert(type);
                this.$http.get( "http://127.0.0.1/typeweibo?id=" + id +"&typeWeibo=" + type,{
                }).then(({data}) => {
                    if( data.ok === 1 ){
                        //console.log(data);
                        this.$emit( "getContextList" );
                    }
                })
            },
            //分页

        }
    }
</script>

<style scoped>

</style>
