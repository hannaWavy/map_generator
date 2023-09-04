export class MapColorScheme {
  HEIGHT_COLORS: readonly number[] = Object.freeze([
    0x0c84c7,
    0x3dbee5,
    0x8ed3f0,
    0xcfe2ef,
    0x7ba64f,
    0xf5e696,
    0xf6a14d,
    0xb87b33,
    0xff0000 //0x8e502d
  ])
  minHeight: number = 0
  maxHeight: number = 0
  step: number = 0

  constructor(props: { minHeight: number; maxHeight: number }) {
    this.minHeight = props.minHeight
    this.maxHeight = props.maxHeight
    this.step = (props.maxHeight - props.minHeight) / this.HEIGHT_COLORS.length
  }

  colorHeight(height?: number): number {
    if (height === undefined || height < this.minHeight) return this.HEIGHT_COLORS[0]
    if (height >= this.maxHeight) return this.HEIGHT_COLORS[this.HEIGHT_COLORS.length - 1]
    return this.HEIGHT_COLORS[Math.floor((height - this.minHeight) / this.step)]
  }
}
