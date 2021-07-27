declare module 'byte-size' {
  export function byteSize(
    v: number,
    opts?: unknown
  ): {value: string; unit: string}
}
