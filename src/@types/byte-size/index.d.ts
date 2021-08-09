declare module 'byte-size' {
  export default function byteSize(
    v: number,
    opts?: unknown
  ): {value: string; unit: string}
}
