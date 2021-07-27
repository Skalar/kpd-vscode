import * as vscode from 'vscode'
import Controller from '../Controller'
import {Components} from './Components/Components'
import {Images} from './Components/Images'
import {Instance} from './Components/Instance'
import {Kubernetes} from './Components/Kubernetes'

import {GenericItem} from './Components/GenericItem'
import {TreeDataComponent} from './TreeDataComponent'

// export interface TreeDataComponent {
//   data: any
//   context: any
// }

export class TreeDataProvider
  implements vscode.TreeDataProvider<TreeDataComponent>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    TreeDataComponent | undefined
  > = new vscode.EventEmitter<TreeDataComponent | undefined>()
  readonly onDidChangeTreeData: vscode.Event<TreeDataComponent | undefined> =
    this._onDidChangeTreeData.event

  constructor(private controller: Controller) {
    //
  }

  refresh(thing?: any): void {
    // console.log('refresh', thing)
    this._onDidChangeTreeData.fire(thing)
  }

  getTreeItem(element: TreeDataComponent) {
    // console.log('getTreeItem')
    return element as any
  }

  getChildren(element?: TreeDataComponent): Promise<any[]> {
    const {data} = this.controller

    if (!data?.instance) {
      return Promise.resolve([])
    }

    // payload, context
    if (typeof element === 'undefined') {
      let rootComponents: any[] = []

      if (this.controller.connected) {
        rootComponents.push(new Instance(data.instance, this.controller))

        rootComponents = [
          ...rootComponents,
          new Kubernetes(data.kubernetes, this.controller),
          new GenericItem({
            id: 'StackDeployment',
            label: 'Stack status',
            description:
              data && data.stackDeployment ? data.stackDeployment.status : '',
          }),
          new GenericItem({id: 'spacer1'}),
          new Images(data.images, this.controller),
          new GenericItem({id: 'spacer2'}),
          ...new Components(data.components, this.controller)
            .getChildren()
            .reduce((items, child) => {
              return [...items, ...child.getChildren()]
            }, [] as any[]),
        ]
      }

      return Promise.resolve(rootComponents)
    } else {
      if (element && element.getChildren) {
        const children = element.getChildren()
        return Promise.resolve(children)
      }
      // console.log('element', element)
      // if (element.id === 'images') {
      //   return Promise.resolve(new components.Images(element))
      // }
      return Promise.resolve([])
    }
    console.log('element', element)

    // if (
    //   ![KpdInstanceState.Running, KpdInstanceState.Starting].includes(
    //     this.controller.kpd.state
    //   )
    // ) {
    //   return Promise.resolve([])
    // }
    // if (element) {
    //   if (element instanceof ComponentItem) {
    //     return this.getComponentChildren(element)
    //   } else if (element instanceof PodItem) {
    //     return this.getPodChildren(element)
    //   } else if (element instanceof ContainerItem) {
    //     return this.getContainerChildren(element)
    //   } else if (element.contextValue === 'pointsOfAccess') {
    //     return this.getComponentServicesChildren((element as any).component)
    //   }
    //   return Promise.resolve([])
    // } else {
    //   return Promise.resolve(
    //     this.controller.components.map(
    //       component => new ComponentItem(component)
    //     )
    //   )
    // }
    // if (!this.workspaceFolder) {
    //   vscode.window.showInformationMessage('No dependency in empty workspace');
    //   return Promise.resolve([]);
    // }
    // if (element) {
    //   return Promise.resolve(
    //     this.getDepsInPackageJson(
    //       path.join(
    //         this.workspaceFolder,
    //         'node_modules',
    //         element.label,
    //         'package.json'
    //       )
    //     )
    //   );
    // } else {
    //   const packageJsonPath = path.join(this.workspaceFolder, 'package.json');
    //   if (this.pathExists(packageJsonPath)) {
    //     return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
    //   } else {
    //     vscode.window.showInformationMessage('Workspace has no package.json');
    //     return Promise.resolve([]);
    //   }
    // }
  }
}
