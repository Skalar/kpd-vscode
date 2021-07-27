import {join} from 'path'
import Controller from '../Controller'

export abstract class TreeDataComponent<T = any> {
  static iconRef(relativeIconPath: string, lightAndDark = false) {
    if (lightAndDark) {
      return {
        light: join(
          __filename,
          '..',
          '..',
          '..',
          'images',
          'light',
          relativeIconPath
        ),
        dark: join(
          __filename,
          '..',
          '..',
          '..',
          'images',
          'dark',
          relativeIconPath
        ),
      }
    } else {
      return join(__filename, '..', '..', '..', 'images', relativeIconPath)
    }
  }

  constructor(public data: T, public controller: Controller) {}

  public getChildren?(): any[]
}
