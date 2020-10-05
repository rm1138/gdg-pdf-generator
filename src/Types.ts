export type Block = (Paragraph | Image | Table<any>) & {
    blockType: 'paragraph' | 'image' | 'table'
}

export type Data = {
    blocks: Block[]
}

export type PageData = {
    blocks: Block[]
    pageNo: number
    title: string
    footerMsg: string
}

export type Paragraph = {
    content: string
    typography: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'
    blockType: 'paragraph'
}

export type Image = {
    url: string
    width?: number
    height?: number
    blockType: 'image'
}

export type TableColumnFormatter<T> = {
    label: string
    key?: keyof T
    formatter?: () => string
    align: 'left' | 'right'
}

export type Table<T> = {
    columnFormatters: TableColumnFormatter<T>[]
    data: T[]
    blockType: 'table'
}