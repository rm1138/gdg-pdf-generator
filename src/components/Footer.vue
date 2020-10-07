<template>
    <div class="footer block">
        <div class="page-no">Page {{pageNo}} of {{totalPage}}</div>
        <p>{{footerMsg}}</p>
        <div class="the-10mm-box"><span>This box is <span class="bold">exactly</span> 100mm x 20mm</span></div>
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
        margin: 10mm 10mm;
        vertical-align: center;
    }
    .page-no {
        position: absolute;
        bottom: 0mm;
        right: 1mm;
    }
    .the-10mm-box {
        box-sizing: border-box;
        width: 100mm;
        height: 20mm;
        border: pxToMm(1) #000000 solid;
        display: flex;
        align-items: center;
        justify-content: center;
        .bold {
            font-weight: bold;
        }
      }
</style>
