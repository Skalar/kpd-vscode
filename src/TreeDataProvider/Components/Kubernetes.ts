import {TreeItemCollapsibleState} from 'vscode'
import {VSCodeKPDQuery_kubernetes} from '../../graphql/types'
import {TreeDataComponent} from '../TreeDataComponent'

export class Kubernetes extends TreeDataComponent<VSCodeKPDQuery_kubernetes> {
  label = 'Kubernetes'
  id = `Kubernetes`

  get description() {
    return `${this.data.context} (namespace: ${this.data.namespace})`
  }

  get tooltip() {
    return `config: ${this.data.configPath}\nserver: ${this.data.server}`
  }

  collapsibleState = TreeItemCollapsibleState.None

  // public getChildren() {
  //   return [
  //     new GenericItem({
  //       label: 'id',
  //       description: this.data.instance.id,
  //       id: 'Instance:id',
  //     }),

  //     new GenericItem({
  //       label: 'Kubernetes',
  //       id: 'Kubernetes',
  //       iconPath: Instance.iconRef('kubernetes.svg', true),
  //       collapsed: false,
  //       getChildren: () => {
  //         return [
  //           new GenericItem({
  //             label: 'namespace',
  //             description: this.data.kubernetes.namespace,
  //             id: 'Instance:Kubernetes:Namespace',
  //           }),
  //           new GenericItem({
  //             label: 'config path',
  //             description: this.data.kubernetes.context,
  //             id: 'Instance:Kubernetes:ConfigPath',
  //           }),
  //           new GenericItem({
  //             label: 'context',
  //             description: this.data.kubernetes.context,
  //             id: 'Instance:Kubernetes:Context',
  //           }),
  //         ]
  //       },
  //     }),
  //   ]
  // }
}
