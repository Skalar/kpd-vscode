import {TreeItemCollapsibleState} from 'vscode'

import {VSCodeKPDQuery_instance} from '../../graphql/types'
import {TreeDataComponent} from '../TreeDataComponent'

export class Instance extends TreeDataComponent<VSCodeKPDQuery_instance> {
  label = 'Instance'
  id = `instance`

  get description() {
    return this.data.id
  }

  get tooltip() {
    return `Connected to ${this.controller.socketPath}`
  }

  collapsibleState = TreeItemCollapsibleState.None
}
