import {TreeItemCollapsibleState} from 'vscode'
import {VSCodeKPDQuery_components} from '../../graphql/types'
import {TreeDataComponent} from '../TreeDataComponent'
import {Pod} from './Pod'

export class Component extends TreeDataComponent<VSCodeKPDQuery_components> {
  get label() {
    return this.data.name
  }

  id = `Component:${this.data.name}`
  iconPath = Component.iconRef('component/default.svg', true)

  collapsibleState = TreeItemCollapsibleState.Expanded

  public getChildren() {
    return this.data.pods.map(data => new Pod(data, this.controller))
  }
}
