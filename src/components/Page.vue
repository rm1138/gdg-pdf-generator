<template>
    <div class="sheet padding-10mm">
        <header-component ref="header" :title="page.title"/>
        <block-component
                v-for="(block, idx) in page.blocks"
                :block="block"
                :key="idx"
                :ref="setBlockRefs"/>
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
                getPagedBlock(): Block[] {
                    const footerEl = footer?.value?.$el
                    if (footerEl == null) {
                        return []
                    }
                    let idx = 0
                    do {
                        if (!blockRefs[idx]) {
                            break
                        }
                        const blockEl = blockRefs[idx]?.$el
                        if (blockEl.offsetTop + blockEl.offsetHeight > footerEl.offsetTop) {
                            break
                        }
                        idx++
                    } while (props.page.blocks.length > 0)
                    blockRefs.length = 0
                    // eslint-disable-next-line vue/no-mutating-props
                    return props.page.blocks.splice(0, idx)
                }
            }
        }
    })
</script>
<style lang="scss">

</style>
