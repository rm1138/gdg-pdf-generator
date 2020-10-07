<template>
  <div>
    <div class="tool-bar">
      <label for="demoMode">Demo Mode:</label>
      <input id="demoMode" type="checkbox" v-model="demoMode.value" true-value="yes" false-value="no"/>
      <label for="blocksCount">Blocks Count:</label>
      <input id="blocksCount" type="number" step="10" v-model.number="blocksCount.value"/>
      <label for="paperFormats">Paper Formats:</label>
      <select id="paperFormats" v-model="paperFormats.value">
        <option value="A3">A3</option>
        <option value="A4">A4</option>
        <option value="A5">A5</option>
        <option value="letter">Letter</option>
        <option value="legal">Legal</option>
        <option value="A3-l">A3 Landscape</option>
        <option value="A4-l">A4 Landscape</option>
        <option value="A5-l">A5 Landscape</option>
        <option value="letter-l">Letter Landscape</option>
        <option value="legal-l">Legal Landscape</option>
      </select>
      <label for="renderFlow">Layout Algorithm:</label>
      <select id="renderFlow" v-model="renderFlow.value" title="Smart: calculate the height of each block and fit them into pages. Dummy: render a block into a page the check the page is overflow or not.">
        <option value="pre-calculate">Pre-calculate</option>
        <option value="linear">Linear</option>
      </select>
      <label for="waitMode">UI sync mode:</label>
      <select id="waitMode" v-model="waitMode.value">
        <option value="animation">requestAnimationFrame</option>
        <option value="0ms">setTimeout 0ms</option>
        <option value="500ms">setTimeout 500ms</option>
      </select>
      <button @click="renderPage">Rerender</button>
      <p>Total time: {{ renderTime.total }}ms, Time per page: {{ renderTime.perPage }}ms, Time per block: {{ renderTime.perBlock }}ms</p>
      <br/>
      <a href="https://github.com/rm1138/gdg-pdf-generator">Source Code</a>
    </div>
    <div class="wrapper" :class="{show: ready.value || demoMode.value === 'yes'}">
      <page-component
          :class="{ 'demo-mode': demoMode.value === 'yes' }"
          :key="page"
          :page="page"
          ref="currentPage"
          v-for="(page) in pages"/>
    </div>
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

const rawData: (blocksCount: number) => Data = (blocksCount) => {
  let lastType: 'h2' | 'image' | 'p' | null = null
  return {
    blocks: Array.from(Array(blocksCount).keys())
            .map(idx => idx + 1)
            .map(idx => {
              const random = Math.random()
              if (idx === 1 || (lastType !== 'h2' && random > 0.7)) {
                lastType = 'h2'
                return {
                  blockType: 'paragraph',
                  content: `${idx}. ${short.generateSentences()}`,
                  typography: 'h2',
                }
              } else if (lastType === 'p' && random > 0.5) {
                const width = 300 // Math.floor(Math.random() * 200) + 300
                const height = 200 // Math.floor(Math.random() * 100) + 100

                lastType = 'image'
                return {
                  blockType: 'image',
                  url: `https://picsum.photos/${width}/${height}?t=${Math.random()}`,
                  caption: `${idx}. ${short.generateSentences(1)}`,
                  width,
                  height
                }
              } else {
                lastType = 'p'
                return {
                  blockType: 'paragraph',
                  content: `${idx}. ${long.generateParagraphs(1)}`,
                  typography: 'p',
                }
              }
            })
  }
}



type PaperFormats = 'A3' | 'A4' | 'A5' | 'letter' | 'legel' |
        'A3-l' | 'A4-l' | 'A5-l' | 'letter-l' | 'legel-l'

export default defineComponent({
  setup() {
    const blocksCount = reactive({value:50})
    const data = reactive(rawData(blocksCount.value))
    const pages = reactive<PageData[]>([])
    const currentPage = ref<typeof PageComponent | null>(null)
    const demoMode = reactive<{value: 'yes'|'no'}>({value: 'no'})
    const paperFormats = reactive<{value: PaperFormats}>({value: 'A4'})
    const renderTime = reactive({total: 0, perPage: 0, perBlock: 0})
    const renderFlow = reactive<{value: 'linear'|'pre-calculate'}>({value: 'linear'})
    const waitMode = reactive<{value: 'animation' | '0ms' | '500ms'}>({value: 'animation'})
    const ready = reactive({value: false})
    let start = Date.now()

    watch(paperFormats, (newVal) => {
      document.body.className = newVal.value
    })

    watch(blocksCount,(newValue) => {
      data.blocks = rawData(newValue.value).blocks
      pages.length = 0
    })

    const newPage = () => {
      pages.push({
        blocks: [],
        title: 'GDG Hong Kong DevFest 2020 Demo',
        pageNo: pages.length + 1,
        totalPage: 0,
        footerMsg: 'Dummy footer message.'
      })
    }

    const syncUI = async () => {
      if (waitMode.value === '500ms') {
        return new Promise(resolve => setTimeout(resolve, 500))
      } else if (waitMode.value === '0ms') {
        return new Promise(resolve => setTimeout(resolve, 0))
      } else if (waitMode.value === 'animation') {
        return new Promise(resolve => requestAnimationFrame(resolve))
      }
    }

    const renderPage = async () => {
      preRender()
      if (renderFlow.value === 'pre-calculate') {
        await preCalculateRender()
      } else {
        await linearRender()
      }
      postRender()
    }

    const preRender = () => {
      renderTime.perBlock = 0
      renderTime.perPage = 0
      renderTime.total = 0
      ready.value = false
      start = Date.now()
      // recycle the data blocks
      if (pages.length > 0) {
        data.blocks = [...data.blocks, ...pages.map(it => it.blocks)
            .reduce((acc, curr) => [...acc, ...curr], [])]
        // clear the pages array
        pages.length = 0
      }
    }

    const postRender = () => {
      const totalPage = pages.length
      // update page number and total page number
      pages.forEach((page, idx) => {
        page.totalPage = totalPage
        page.pageNo = idx + 1
      })

      // update benchmark stats
      const now = Date.now()
      renderTime.total = Math.round(now - start)
      renderTime.perPage = Math.round((now - start) / totalPage)
      renderTime.perBlock = Math.round((now - start) / blocksCount.value)
      ready.value = true
    }

    const linearRender = async () => {
      newPage()
      do {
        let currentBlock
        const lastPage = pages[pages.length - 1]
        if (currentPage?.value?.isOverflowed()) {
          currentBlock = lastPage.blocks.pop()
          newPage()
        } else {
          if (data.blocks.length === 0) {
            break
          }
          currentBlock = data.blocks.shift()!!
        }
        pages[pages.length - 1].blocks.push(currentBlock!!)
        await syncUI()
      } while (data.blocks.length >= 0)
    }

    const preCalculateRender = async () => {
      newPage()
      const firstPage = pages[0]
      firstPage.blocks = data.blocks
      data.blocks = []
      await syncUI()

      const firstPageRef = currentPage.value

      // use the first page to measure the blocks size
      let blockCountMap = firstPageRef!!.getPagedBlockMap()
      for (const count of blockCountMap) {
        newPage()
        const lastPage = pages[pages.length - 1]
        lastPage.blocks = firstPage.blocks.splice(0, count)
      }

      // remove the first page, as it is empty now
      pages.shift()
    }

    onMounted(renderPage)

    return {
      data,
      pages,
      currentPage,
      demoMode,
      renderPage,
      paperFormats,
      blocksCount,
      renderTime,
      ready,
      renderFlow,
      waitMode
    }
  },
  components: {PageComponent}
})
</script>

<style lang="scss">
@import "~paper-css/paper.css";
  // compensate the demo border
  .block {
    border: 1px rgba(0, 0, 0, 0) dashed;
  }
  .demo-mode {
    .block {
      border: 1px #555555 dashed;
    }
  }
  .tool-bar {
    margin: 20px;
  }
  @media print {
    .tool-bar {
      display: none;
    }
  }
  .wrapper.show {
    visibility: visible;
    height: auto;
  }
  .wrapper {
    height: 0;
    overflow-y: hidden;
    visibility: hidden;
    text-align: center;
  }
  .sheet {
    display: inline-block;
    margin: 5mm;
    text-align: left;
    content-visibility: auto;
  }
</style>
