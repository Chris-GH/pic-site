<template>
    <div>
        <div class="space-works">
                <scard v-for="item,index in lists" :key="index" :info=item></scard>
        </div>
    </div>
</template>

<script>
import scard from "../../components/card";

export default {
    components:{scard},
    props:{
        lists: {
            type: Array,
            default: () => []
        },
    },
}
</script>
<style lang="stylus">
.space-works
    width 710px!important
    height 500px
    display flex
    flex-wrap wrap
    justify-content space-between
</style>