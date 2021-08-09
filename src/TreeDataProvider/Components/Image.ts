import {TreeItemCollapsibleState} from 'vscode'
import {VSCodeKPDQuery_images} from '../../graphql/types'
import {TreeDataComponent} from '../TreeDataComponent'
import byteSize from 'byte-size'

export class Image extends TreeDataComponent<VSCodeKPDQuery_images> {
  get label() {
    return this.data.name
  }

  get id() {
    return `Image:${this.data.name}`
  }

  get description() {
    if (this.data.registryImage?.size) {
      const {value, unit} = byteSize(this.data.registryImage?.size, {
        units: 'iec',
      })
      return `${value} ${unit}`
    } else {
      return `?`
    }
  }

  // iconPath = Image.iconRef('docker-image.svg', true)

  // tooltip = 'tooltip'
  collapsibleState = TreeItemCollapsibleState.None
}
