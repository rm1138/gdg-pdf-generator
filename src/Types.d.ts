declare type Block = {
  blockType: 'paragraph' | 'image' | 'table'
  heightMap?: number[]
  splited?: booleamn
}

declare type Data = {
  blocks: Block[]
}

declare type PageData = {
  blocks: Block[]
  pageNo: number
  totalPage: number
  title: string
  footerMsg: string
}

declare type Typography = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'

declare type DummyParagraph = {
  content: string
  typography: Typography
  blockType: 'paragraph'
}

declare type DummyImage = {
  url: string
  caption?: string
  width?: number
  height?: number
  blockType: 'image'
}

declare type DummyTable = {
  titles: string[]
  data: string[][]
  caption: string
  blockType: 'table'
}
