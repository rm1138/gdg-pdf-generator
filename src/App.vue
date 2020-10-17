<template>
  <div>
    <div
      v-if="ready.value && loadedImageCount.size === imageCount.value"
      id="content-ready"
    />
    <div class="tool-bar">
      <label for="demoMode">Demo Mode:</label>
      <input
        id="demoMode"
        v-model="demoMode.value"
        false-value="no"
        true-value="yes"
        type="checkbox"
      />
      <label for="blocksCount">Blocks Count:</label>
      <input
        id="blocksCount"
        v-model.number="blocksCount.value"
        step="10"
        type="number"
      />
      <label for="paperFormats">Paper Formats:</label>
      <select id="paperFormats" v-model="paperFormats.value">
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
      </select>
      <label for="waitMode">UI sync mode:</label>
      <select id="waitMode" v-model="waitMode.value">
        <option value="animation">requestAnimationFrame</option>
        <option value="0ms">setTimeout 0ms</option>
        <option value="500ms">setTimeout 500ms</option>
      </select>
      <!--      <label for="renderFlow">Layout Algorithm:</label>-->
      <!--      <select id="renderFlow" v-model="renderFlow.value" title="Pre-calculate: calculate the height of each block and fit them into pages. Linear: render a block into a page the check the page is overflow or not.">-->
      <!--        <option value="pre-calculate">Pre-calculate</option>-->
      <!--        <option value="linear">Linear</option>-->
      <!--      </select>-->
      <button @click="renderPage">Rerender</button>
      <p>
        Total time: {{ renderTime.total }}ms, Time per page:
        {{ renderTime.perPage }}ms, Time per block: {{ renderTime.perBlock }}ms
      </p>
      <a href="https://github.com/rm1138/gdg-pdf-generator">Source Code</a>
    </div>
    <div
      :class="{ show: ready.value || demoMode.value === 'yes' }"
      class="wrapper"
    >
      <page-component
        v-for="page in pages"
        :key="page"
        ref="currentPage"
        :class="{ 'demo-mode': demoMode.value === 'yes' }"
        :page="page"
        @image-loaded="imageLoaded"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import PageComponent from '@/components/Page.vue'
import { LoremIpsum } from 'lorem-ipsum'
import { IPrng } from 'lorem-ipsum/types/src/lib/generator'

let seed = 2

const seededRandom: IPrng = () => {
  const max = 1
  const min = 0

  seed = (seed * 9301 + 49297) % 233280
  const rnd = seed / 233280

  return min + rnd * (max - min)
}

const short = new LoremIpsum({
  sentencesPerParagraph: {
    min: 1,
    max: 1,
  },
  wordsPerSentence: {
    min: 3,
    max: 8,
  },
  random: seededRandom,
})

const long = new LoremIpsum({
  sentencesPerParagraph: {
    min: 5,
    max: 10,
  },
  wordsPerSentence: {
    min: 5,
    max: 10,
  },
  random: seededRandom,
})

const genDummyTable: (row: number, col: number) => string[][] = (
  row: number,
  col: number,
) => {
  return Array.from(Array(row).keys()).map((_, idx) => {
    return [
      (idx + 1).toString(),
      ...Array.from(Array(col).keys()).map(() => short.generateWords(1)),
    ]
  })
}

const rawData: (blocksCount: number) => Data = (blocksCount) => {
  let lastType: 'h2' | 'image' | 'p' | 'table' | null = null
  return {
    blocks: Array.from(Array(blocksCount).keys())
      .map((idx) => idx + 1)
      .map((idx) => {
        const random = seededRandom()
        if (idx === 1 || (lastType !== 'h2' && random > 0.7)) {
          lastType = 'h2'
          return {
            blockType: 'paragraph',
            content: `${short.generateSentences()}`,
            typography: 'h2',
          } as DummyParagraph
        } else if (lastType === 'p' && random > 0.6) {
          const row = Math.floor(seededRandom() * 10 + 50)
          const col = Math.floor(seededRandom() * 3 + 5)
          lastType = 'table'
          return {
            blockType: 'table',
            data: genDummyTable(row, col),
            titles: [
              'Row No',
              ...Array.from(Array(col).keys()).map(() =>
                short.generateWords(1),
              ),
            ],
            caption: `${idx}. ${short.generateSentences(1)}`,
          } as DummyTable
        } else if (lastType === 'p' && random > 0.5) {
          const width = 300 // Math.floor(Math.random() * 200) + 300
          const height = 200 // Math.floor(Math.random() * 100) + 100

          lastType = 'image'
          return {
            blockType: 'image',
            url: `https://picsum.photos/seed/${seededRandom()}/${width}/${height}`,
            caption: `${short.generateSentences(1)}`,
            width,
            height,
          } as DummyImage
        } else {
          lastType = 'p'
          return {
            blockType: 'paragraph',
            content: `${long.generateParagraphs(1)}`,
            typography: 'p',
          } as DummyParagraph
        }
      })
      .map((it) => it as Block),
  }
}

type PaperFormats =
  | 'A3'
  | 'A4'
  | 'A5'
  | 'letter'
  | 'legel'
  | 'A3 landscape'
  | 'A4 landscape'
  | 'A5 landscape'
  | 'letter landscape'
  | 'legel landscape'

export default defineComponent({
  setup() {
    const blocksCount = reactive({ value: 50 })
    const data = reactive(rawData(blocksCount.value))
    const pages = reactive<PageData[]>([])
    const currentPage = ref<typeof PageComponent | null>(null)
    const demoMode = reactive<{ value: 'yes' | 'no' }>({ value: 'no' })
    const paperFormats = reactive<{ value: PaperFormats }>({ value: 'A4' })
    const renderTime = reactive({ total: 0, perPage: 0, perBlock: 0 })
    const renderFlow = reactive<{ value: 'linear' | 'pre-calculate' }>({
      value: 'pre-calculate',
    })
    const waitMode = reactive<{ value: 'animation' | '0ms' | '500ms' }>({
      value: 'animation',
    })
    const ready = reactive({ value: false })
    const loadedImageCount = reactive<Set<string>>(new Set())
    const imageCount = reactive({ value: -1 })
    let start = Date.now()

    watch(paperFormats, (newVal) => {
      document.body.className = newVal.value
    })

    watch(blocksCount, (newValue) => {
      data.blocks = rawData(newValue.value).blocks
      pages.length = 0
    })

    const newPage = () => {
      pages.push({
        blocks: [],
        title: 'GDG Hong Kong DevFest 2020 Demo',
        pageNo: pages.length + 1,
        totalPage: 0,
        footerMsg: 'Dummy footer message.',
      })
    }

    const syncUI = async () => {
      if (waitMode.value === '500ms') {
        return new Promise((resolve) => setTimeout(resolve, 500))
      } else if (waitMode.value === '0ms') {
        return new Promise((resolve) => setTimeout(resolve, 0))
      } else if (waitMode.value === 'animation') {
        return new Promise((resolve) => requestAnimationFrame(resolve))
      }
    }

    const renderPage = async () => {
      preRender()
      if (renderFlow.value === 'pre-calculate') {
        await preCalculateRender()
      } else {
        // await linearRender()
      }
      postRender()
    }

    const preRender = () => {
      renderTime.perBlock = 0
      renderTime.perPage = 0
      renderTime.total = 0
      ready.value = false
      loadedImageCount.clear()
      start = Date.now()
      imageCount.value = data.blocks.filter(
        (it) => it.blockType === 'image',
      ).length
      pages.length = 0
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

    // const linearRender = async () => {
    //   newPage()
    //   do {
    //     let currentBlock
    //     const lastPage = pages[pages.length - 1]
    //     if (currentPage?.value?.isOverflowed()) {
    //       currentBlock = lastPage.blocks.pop()
    //       newPage()
    //     } else {
    //       if (data.blocks.length === 0) {
    //         break
    //       }
    //       currentBlock = data.blocks.shift()!!
    //     }
    //     pages[pages.length - 1].blocks.push(currentBlock!!)
    //     await syncUI()
    //   } while (data.blocks.length >= 0)
    // }

    const preCalculateRender = async () => {
      newPage()
      pages[0].blocks = JSON.parse(JSON.stringify(data.blocks))
      await syncUI()
      const firstPageRef = currentPage.value
      const pageAvailableSpace: number = firstPageRef!!.getPageAvailableSpace()
      const blocksWithMeasurement: Block[] = firstPageRef!!.getMeasuredBlocks() as Block[]
      let currentPageUsedSpace = 0
      newPage()
      do {
        const currentPage = pages[pages.length - 1]
        const currentBlock = blocksWithMeasurement.shift()!!
        const currentBlockHeight = currentBlock.heightMap!!.reduce(
          (acc, curr) => acc + curr,
          0,
        )
        currentPageUsedSpace += currentBlockHeight
        if (currentPageUsedSpace > pageAvailableSpace) {
          if (currentBlock.heightMap!!.length > 1) {
            if (currentBlock.blockType === 'table') {
              currentPageUsedSpace -= currentBlockHeight
              const [headerHeight, ...rowHeight] = currentBlock.heightMap!!
              // make sure the remain space able to fit the header and at least 1 row
              currentPageUsedSpace += headerHeight
              let rowToKeep = 0
              while (currentPageUsedSpace <= pageAvailableSpace) {
                currentPageUsedSpace += rowHeight[rowToKeep]
                rowToKeep++
              }
              if (rowToKeep > 1) {
                currentPage.blocks.push({
                  ...currentBlock,
                  splited: true,
                  data: (currentBlock as DummyTable).data.splice(
                    0,
                    rowToKeep - 1,
                  ),
                } as any)
                currentBlock.heightMap!!.splice(1, rowToKeep - 1)
              }
            }
            // handle other splittable block here
          }
          blocksWithMeasurement.unshift(currentBlock)
          const lastBlock = currentPage.blocks[currentPage.blocks.length - 1]
          // prevent header at the end of the page
          if (
            lastBlock.blockType === 'paragraph' &&
            (lastBlock as DummyParagraph).typography !== 'p'
          ) {
            blocksWithMeasurement.unshift(currentPage.blocks.pop()!!)
          }
          currentPageUsedSpace = 0
          newPage()
          continue
        }
        currentPage.blocks.push(currentBlock)
        if (demoMode.value === 'yes') {
          await syncUI()
        }
      } while (blocksWithMeasurement.length > 0)

      // remove the first page, as it is only for the first measurement
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
      waitMode,
      imageCount,
      loadedImageCount,
      imageLoaded(src: string) {
        loadedImageCount.add(src)
      },
    }
  },
  components: { PageComponent },
})
</script>

<style lang="scss">
@import '~paper-css/paper.css';
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

@media screen {
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
}
</style>
