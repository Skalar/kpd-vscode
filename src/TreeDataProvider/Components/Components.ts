import {TreeItemCollapsibleState} from 'vscode'
import {VSCodeKPDQuery_components} from '../../graphql/types'
import {TreeDataComponent} from '../TreeDataComponent'
import {Component} from './Component'

export class Components extends TreeDataComponent<VSCodeKPDQuery_components[]> {
  label = 'Components'
  id = `Components`

  collapsibleState = TreeItemCollapsibleState.Expanded

  public getChildren() {
    return this.data.map(data => new Component(data, this.controller))
  }
}
