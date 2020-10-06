<template>
  <div>
    <div class="tool-bar">
      <label for="demoMode">Demo</label>
      <input id="demoMode" type="checkbox" v-model="demoMode.value" true-value="yes" false-value="no"/>
      <button @click="renderPage">Render</button>
      <select v-model="paperFormats.value">
        <option value="A3">A3</option>
        <option value="A4">A4</option>
        <option value="A5">A5</option>
        <option value="letter">Letter</option>
        <option value="legal">Legal</option>
        <option value="A3 landscape">A3 Landscape</option>
        <option value="A4 landscape">A4 Landscape</option>
        <option value="A5 landscape">A5 Landscape</option>
        <option value="letter landscape">Letter Landscape</option>
        <option value="legal landscape">Legal Landscape</option>
      </select><br/>
      <a href="https://github.com/rm1138/gdg-pdf-generator">Source Code</a>
    </div>
    <page-component
        :class="{ 'demo-mode': demoMode.value === 'yes' }"
        :key="page"
        :page="page"
        ref="currentPage"
        v-for="(page) in pages"/>
  </div>

</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, watch} from 'vue'
import PageComponent from '@/components/Page.vue'
import {LoremIpsum} from "lorem-ipsum"

const short = new LoremIpsum({
  sentencesPerParagraph: {
    min: 1,
    max: 1
  },
  wordsPerSentence: {
    min: 3,
    max: 8
  }
})

const long = new LoremIpsum({
  sentencesPerParagraph: {
    min: 5,
    max: 10
  },
  wordsPerSentence: {
    min: 5,
    max: 10
  }
})

let lastType: 'h2' | 'image' | 'p' | null = null
const rawData: () => Data = () => {
  return {
    blocks: Array.from(Array(50).keys())
            .map(idx => {
              const random = Math.random()
              if (idx === 0 || (lastType !== 'h2' && random > 0.7)) {
                lastType = 'h2'
                return {
                  blockType: 'paragraph',
                  content: short.generateSentences(),
                  typography: 'h2',
                }
              } else if (lastType === 'p' && random > 0.5) {
                const width = 300 // Math.floor(Math.random() * 200) + 300
                const height = 200 // Math.floor(Math.random() * 100) + 100

                lastType = 'image'
                return {
                  blockType: 'image',
                  url: `https://picsum.photos/${width}/${height}?t=${Math.random()}`,
                  caption: short.generateSentences(1),
                  width,
                  height
                }
              } else {
                lastType = 'p'
                return {
                  blockType: 'paragraph',
                  content: long.generateParagraphs(1),
                  typography: 'p',
                }
              }
            })
  }
}

async function waitUI(demoMode: 'yes' | 'no' = 'no') {
  if (demoMode === 'yes') {
    return new Promise(resolve => setTimeout(resolve, 500))
  } else {
    return new Promise(resolve => requestAnimationFrame(resolve))
  }
}

type PaperFormats = 'A3' | 'A4' | 'A5' | 'letter' | 'legel' |
        'A3 landscape' | 'A4 landscape' | 'A5 landscape' | 'letter landscape' | 'legel landscape'

export default defineComponent({
  setup() {
    const data = reactive(rawData())
    const pages = reactive<PageData[]>([])
    const currentPage = ref<typeof PageComponent | null>(null)
    const demoMode = reactive<{value: 'yes'|'no'}>({value: 'no'})
    const paperFormats = reactive<{value: PaperFormats}>({value: 'A4'})
    const newPage = () => {
      pages.push({
        blocks: [],
        title: 'GDG Hong Kong DevFest 2020 Demo',
        pageNo: pages.length + 1,
        totalPage: 0,
        footerMsg: 'Dummy footer message.'
      })
    }

    watch(paperFormats, (newVal) => {
      document.body.className = newVal.value
      renderPage()
    })

    const renderPage = async () => {
      // recycle the data blocks
      if (pages.length > 0) {
        data.blocks = pages.map(it => it.blocks)
                .reduce((acc, curr) => {
                  return [...acc, ...curr]
                }, [])
        pages.length = 0 // clear the pages array
      }
      newPage()
      await waitUI(demoMode.value)
      do {
        let currentBlock
        const lastPage = pages[pages.length - 1]
        if (currentPage?.value?.isOverflowed()) {
          currentBlock = lastPage.blocks.pop()
          newPage()
          await waitUI(demoMode.value)
        } else {
          if (data.blocks.length === 0) {
            break
          }
          currentBlock = data.blocks.shift()!!
        }
        pages[pages.length - 1].blocks.push(currentBlock!!)
        await waitUI(demoMode.value)
      } while (data.blocks.length >= 0)

      const totalPage = pages.length
      pages.forEach(page => page.totalPage = totalPage)
    }

    onMounted(async () => {
      await renderPage()
    })
    return {
      data,
      pages,
      currentPage,
      demoMode,
      renderPage,
      paperFormats
    }
  },
  components: {PageComponent}
})
</script>

<style lang="scss">
@import "~paper-css/paper.css";

// compensate the demo border
.block {
  border: 1px #ffffff dashed;
}
.demo-mode {
  .block {
    border: 1px #555555 dashed;
  }
}
  .tool-bar {
    margin: 20px;
  }
</style>
