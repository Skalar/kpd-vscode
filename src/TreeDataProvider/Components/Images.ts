import {TreeItemCollapsibleState} from 'vscode'
import {VSCodeKPDQuery_images} from '../../graphql/types'
import {TreeDataComponent} from '../TreeDataComponent'
import {Image} from './Image'

export class Images extends TreeDataComponent<VSCodeKPDQuery_images[]> {
  label = 'Docker images'
  id = `images`
  // tooltip = 'tooltip'
  // iconPath = Images.iconRef('docker2.svg', true)
  collapsibleState = TreeItemCollapsibleState.Expanded

  public getChildren() {
    return this.data.map(image => new Image(image, this.controller))
  }
}
