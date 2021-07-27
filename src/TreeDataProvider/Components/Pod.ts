import {TreeItemCollapsibleState} from 'vscode'

import {VSCodeKPDQuery_components_pods} from '../../graphql/types'
import {TreeDataComponent} from '../TreeDataComponent'
import {Container} from './Container'

export class Pod extends TreeDataComponent<VSCodeKPDQuery_components_pods> {
  get label() {
    return this.data.name
  }

  id = `Component:${this.data.name}`

  get iconPath() {
    switch (this.data.phase) {
      case 'Pending':
        return Pod.iconRef('pod/yellow.svg', true)
      case 'Running':
        return Pod.iconRef('pod/green.svg', true)
      case 'Completed':
      case 'Succeeded':
        return Pod.iconRef('pod/blue.svg', true)
      case 'CrashLoopBackOff':
      case 'Failed':
        return Pod.iconRef('pod/red.svg', true)
      case 'Unknown':
        return Pod.iconRef('pod/grey.svg', true)
    }
  }

  collapsibleState = TreeItemCollapsibleState.Expanded

  public getChildren() {
    return [
      ...this.data.containers.map(data => new Container(data, this.controller)),
    ]
  }
}
