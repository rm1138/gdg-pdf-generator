<template>
  <div class="sheet padding-10mm">
    <header-component ref="header" :title="page.title" />
    <div v-for="(block, idx) in page.blocks" :key="idx">
      <paragraph-component
        v-if="block.blockType === 'paragraph'"
        :ref="setBlockRefs"
        :paragraph="block"
      />
      <image-component
        v-if="block.blockType === 'image'"
        :ref="setBlockRefs"
        :image="block"
        @image-loaded="(src) => $emit('image-loaded', src)"
      />
      <table-component
        v-if="block.blockType === 'table'"
        :ref="setBlockRefs"
        :table="block"
      />
    </div>
    <footer-component
      ref="footer"
      :footer-msg="page.footerMsg"
      :page-no="page.pageNo"
      :total-page="page.totalPage"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import HeaderComponent from './Header.vue'
import FooterComponent from './Footer.vue'
import ParagraphComponent from '@/components/Paragraph.vue'
import ImageComponent from '@/components/Image.vue'
import TableComponent from '@/components/Table.vue'

export default defineComponent({
  props: {
    page: { type: Object as PropType<PageData>, required: true },
  },
  components: {
    HeaderComponent,
    FooterComponent,
    ParagraphComponent,
    ImageComponent,
    TableComponent,
  },
  setup(props) {
    const header = ref<typeof HeaderComponent | null>(null)
    const footer = ref<typeof FooterComponent | null>(null)
    const blockRefs: any[] = []
    return {
      header,
      footer,
      setBlockRefs(el: any) {
        blockRefs.push(el)
      },
      isOverflowed(): boolean {
        const lastBlockEl = blockRefs[blockRefs.length - 1]?.$el
        const footerEl = footer?.value?.$el
        if (
          props.page.blocks.length === 0 ||
          lastBlockEl == null ||
          footerEl == null
        ) {
          return false
        }
        return (
          lastBlockEl.offsetTop + lastBlockEl.offsetHeight > footerEl.offsetTop
        )
      },
      getMeasuredBlocks(): Block[] {
        return props.page.blocks.map((block, idx) => {
          return {
            ...block,
            heightMap: blockRefs[idx].getHeightMap(),
          }
        })
      },
      getPageAvailableSpace(): number {
        const headerEl = header?.value?.$el
        const footerEl = footer?.value?.$el
        return footerEl.offsetTop - (headerEl.offsetTop + headerEl.offsetHeight)
      },
    }
  },
})
</script>
<style lang="scss"></style>
