<template>
    <div class="footer block">
        <div class="page-no">P.{{pageNo}}/{{totalPage}}</div>
        <h6>{{footerMsg}}</h6>
    </div>
</template>

<script lang="ts">
    import {defineComponent} from 'vue'

    export default defineComponent({
        props: {
            footerMsg: {type: String, required: true},
            pageNo: { type: Number, required: true},
            totalPage: { type: Number, required: true}
        },
    })
</script>

<style lang="scss">
    .footer {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        margin: pxToMm(80);
        vertical-align: center;
    }
    .page-no {
        position: absolute;
        bottom: 0;
        right: 0;
    }
</style>
