declare type Block = (Paragraph | Image | Table<any>) & {
    blockType: 'paragraph' | 'image' | 'table'
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

declare type Paragraph = {
    content: string
    typography: Typography
    blockType: 'paragraph'
}

declare type Image = {
    url: string
    width?: number
    height?: number
    blockType: 'image'
}

declare type TableColumnFormatter<T> = {
    label: string
    key?: keyof T
    formatter?: () => string
    align: 'left' | 'right'
}

declare type Table<T> = {
    columnFormatters: TableColumnFormatter<T>[]
    data: T[]
    blockType: 'table'
}
