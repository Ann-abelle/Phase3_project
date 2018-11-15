<template>
    <div>
        <div class="takeComment">
            <textarea name="textarea" v-model.trim="context" class="takeTextField" id="tijiaoText"></textarea>
            <div class="takeSbmComment">
                <input type="button" class="inputs" value="" @click="addWeibo" />
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "take-comment",
        data(){
            return{
                context:""
            }
        },
        methods:{
            addWeibo(){
                this.$http.post("http://127.0.0.1/addweibo",{
                    context:this.context
                }).then(({data}) => {
                    if( data.ok === 1 ){
                        console.log( data );
                        this.$emit( "getContextList" );
                    }else{
                        alert( data.msg );
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
