<template>
  <page
          v-for="(page) in pages"
          :key="page"
          ref="currentPage"
          :blocks="page.blocks"/>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Page from '@/components/Page.vue'
import { Data, PageData} from './Types'

const data: Data = {
  blocks: [{
    content: 'Test',
    typography: 'h1',
    blockType: 'paragraph',
  }, {
    content: 'Test 2',
    typography: 'p',
    blockType: 'paragraph'
  }, {
    content: 'Test 2',
    typography: 'p',
    blockType: 'paragraph'
  }, {
    content: 'Test 2',
    typography: 'p',
    blockType: 'paragraph'
  }, {
    content: 'Test 2',
    typography: 'p',
    blockType: 'paragraph'
  }, {
    content: 'Test 2',
    typography: 'p',
    blockType: 'paragraph'
  }, {
    content: 'Test 2',
    typography: 'p',
    blockType: 'paragraph'
  }, {
    content: 'Test 2',
    typography: 'p',
    blockType: 'paragraph'
  }, {
    content: 'Test 2',
    typography: 'p',
    blockType: 'paragraph'
  }, {
    content: 'Test 2',
    typography: 'p',
    blockType: 'paragraph'
  }, {
    content: 'Test 2',
    typography: 'p',
    blockType: 'paragraph'
  }, {
    content: 'Test 2',
    typography: 'p',
    blockType: 'paragraph'
  }, {
    content: 'Test 2',
    typography: 'p',
    blockType: 'paragraph'
  }, {
    content: 'Test 2',
    typography: 'p',
    blockType: 'paragraph'
  }, {
    content: 'Test 2',
    typography: 'p',
    blockType: 'paragraph'
  }
  ]
}

async function waitUI() {
  return new Promise(resolve => requestAnimationFrame(resolve))
}

export default defineComponent({
  data(): { pages: PageData[], data: Data } {
    return {
      pages: [],
      data: data
    }
  },
  async mounted() {
    do {
      const currentBlock = this.data.blocks.shift()!!
      if (!this.$refs.currentPage || (this.$refs.currentPage as typeof Page).isOverflowed()) {
        this.pages.push({
          blocks: [currentBlock],
          title: 'test',
          pageNo: 1,
          footerMsg: ''
        })
      } else {
        this.pages[this.pages.length - 1].blocks.push(currentBlock)
      }
      await waitUI()
    } while (this.data.blocks.length > 0)

  },
  components: { Page }
})
</script>

<style lang="scss">
@import "~paper-css/paper.css";
@import "./scss/_function.scss";
</style>
