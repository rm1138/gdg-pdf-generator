<template>
    <div class="sheet padding-10mm">
        <header-component ref="header" :title="page.title"/>
        <block-component
                v-for="(block, idx) in page.blocks"
                :block="block"
                :key="idx"
                ref="lastBlock"/>
        <footer-component ref="footer"
                          :footer-msg="page.footerMsg"
                          :page-no="page.pageNo"
                          :total-page="page.totalPage"/>
    </div>
</template>
<script lang="ts">
    import {defineComponent, PropType, ref} from 'vue'
    import BlockComponent from './Block.vue'
    import HeaderComponent from './Header.vue'
    import FooterComponent from './Footer.vue'

    export default defineComponent({
        props: {
            page: {type: Object as PropType<PageData>, required: true},
        },
        components: {BlockComponent, HeaderComponent, FooterComponent},
        setup(props) {
            const lastBlock = ref<typeof BlockComponent | null>(null)
            const footer = ref<typeof FooterComponent | null>(null)
            return {
                lastBlock,
                footer,
                isOverflowed(): boolean {
                    const lastBlockEl = lastBlock?.value?.$el
                    const footerEl = footer?.value?.$el
                    if (props.page.blocks.length === 0 || lastBlockEl == null || footerEl == null) {
                        return false
                    }
                    return lastBlockEl.offsetTop + lastBlockEl.offsetHeight > footerEl.offsetTop
                }
            }
        }
    })
</script>
<style lang="scss">

</style>
