<template>
    <div class="sheet padding-10mm">
        <header-component ref="header" :title="page.title"/>
        <block-component
            v-for="(block, idx) in page.blocks"
            :block="block"
            :key="idx"
            :ref="setBlockRefs"/>
        <footer-component
            ref="footer"
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
            const header = ref<typeof HeaderComponent | null>(null)
            const footer = ref<typeof FooterComponent | null>(null)
            const blockRefs: any[]= []
            return {
                header,
                footer,
                setBlockRefs(el: any) {
                    blockRefs.push(el)
                },
                isOverflowed(): boolean {
                    const lastBlockEl = blockRefs[blockRefs.length - 1]?.$el
                    const footerEl = footer?.value?.$el
                    if (props.page.blocks.length === 0 || lastBlockEl == null || footerEl == null) {
                        return false
                    }
                    return lastBlockEl.offsetTop + lastBlockEl.offsetHeight > footerEl.offsetTop
                },
                getPagedBlockMap(): number[] {
                    const headerEl = header?.value?.$el
                    const footerEl = footer?.value?.$el
                    const result: number[] = []
                    if (headerEl == null || footerEl == null) {
                        return result
                    }
                    let blockCursor = 0
                    let availableSpace = footerEl.offsetTop - (headerEl.offsetTop + headerEl.offsetHeight)
                    let pageRemainSpace = availableSpace
                    let count = 0
                    do {
                        const blockEl = blockRefs[blockCursor]?.$el
                        pageRemainSpace -= blockEl.offsetHeight
                        if (pageRemainSpace < 0) {
                            result.push(count)
                            count = 0
                            pageRemainSpace = availableSpace
                            continue
                        }
                        count++
                        blockCursor++
                    } while (blockCursor < blockRefs.length)
                    result.push(count)
                    return result
                }
            }
        }
    })
</script>
<style lang="scss">

</style>
