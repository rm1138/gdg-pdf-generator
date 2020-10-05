<template>
    <div>

    <input type="checkbox" :checked="demoMode" @input="demoMode = !demoMode"/>
    <page-component
            :class="{ 'demo-mode': demoMode }"
            :key="page"
            :page="page"
            ref="currentPage"
            v-for="(page) in pages"/>
    </div>

</template>

<script lang="ts">
    import {defineComponent, onMounted, reactive, ref} from 'vue'
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

    const rawData: Data = {
        blocks: Array.from(Array(100).keys())
            .map(idx => {
                if (idx === 0 || Math.random() > 0.9) {
                    return {
                        blockType: 'paragraph',
                        content: short.generateSentences(),
                        typography: 'h2',
                    }
                } else {
                    return {
                        blockType: 'paragraph',
                        content: long.generateParagraphs(1),
                        typography: 'p',
                    }
                }
            })
    }

    async function waitUI() {
        return new Promise(resolve => requestAnimationFrame(resolve))
    }

    export default defineComponent({
        setup() {
            const data = reactive(rawData)
            const pages = reactive<PageData[]>([])
            const currentPage = ref<typeof PageComponent | null>(null)
            const demoMode = reactive({ value: true })
            const newPage = () => {
                pages.push({
                    blocks: [],
                    title: 'GDG Hong Kong DevFest 2020 Demo',
                    pageNo: pages.length + 1,
                    totalPage: 0,
                    footerMsg: 'Dummy footer message.'
                })
            }

            onMounted(async () => {
                newPage()
                await waitUI()
                do {
                    let currentBlock
                    const lastPage = pages[pages.length - 1]
                    if (currentPage?.value?.isOverflowed()) {
                        currentBlock = lastPage.blocks.pop()
                        newPage()
                        await waitUI()
                    } else {
                        if (data.blocks.length === 0) {
                            break
                        }
                        currentBlock = data.blocks.shift()!!
                    }
                    pages[pages.length - 1].blocks.push(currentBlock!!)
                    await waitUI()
                } while (data.blocks.length >= 0)

                const totalPage = pages.length
                pages.forEach(page => page.totalPage = totalPage)
            })
            return {
                data,
                pages,
                newPage,
                currentPage,
                demoMode
            }
        },
        components: {PageComponent}
    })
</script>

<style lang="scss">
    @import "~paper-css/paper.css";

    .demo-mode{
        .block {
            border: pxToMm(1) #555555 dashed;
        }
    }
</style>
