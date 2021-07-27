import {TreeItemCollapsibleState} from 'vscode'
import {VSCodeKPDQuery_components_pods_containers} from '../../graphql/types'
import {TreeDataComponent} from '../TreeDataComponent'
import {GenericItem} from './GenericItem'

export class Container extends TreeDataComponent<VSCodeKPDQuery_components_pods_containers> {
  get label() {
    return this.data.name
  }

  get tooltip() {
    const {requests, limits} = this.data.resources
    return `CPU req: ${requests.cpu || 'none'} limit: ${
      limits.cpu || 'none'
    }\nMEM req: ${requests.memory || 'none'} limit: ${limits.memory || 'none'}`
  }

  id = `Container:${this.data.name}`
  get iconPath() {
    if (this.data.isRestarting) {
      return Container.iconRef('container/yellow.svg', true)
    }

    if (this.data.status?.ready) {
      return Container.iconRef('container/green.svg', true)
    }

    switch (this.data.status?.state?.name) {
      case 'waiting':
        Container.iconRef('container/yellow.svg', true)
      case 'running':
        Container.iconRef('container/blue.svg', true)
      case 'terminated':
        Container.iconRef('container/red.svg', true)
    }

    return Container.iconRef('container/container-blue.svg', true)
  }

  collapsibleState = TreeItemCollapsibleState.Expanded

  public getChildren() {
    // const {requests, limits, usage} = this.data.resources

    // const cpuPercent =
    //   usage.cpuNano &&
    //   (limits.cpuNano || requests.cpuNano) &&
    //   Math.round(
    //     (usage.cpuNano /
    //       (limits.cpuNano ? limits.cpuNano : requests.cpuNano!)) *
    //       100
    //   )

    // const memoryPercent = 100
    // // const memoryPercent =
    // //   usage.memoryBytes &&
    // //   (limits.memoryBytes || requests.memoryBytes) &&
    // //   Math.round(
    // //     (usage.memoryBytes /
    // //       (limits.memoryBytes
    // //         ? parseInt(limits.memoryBytes, 10)
    // //         : parseInt(requests.memoryBytes!, 10))) *
    // //       100
    // //   )

    // const cpuTooltip = `used: ${usage.cpu ||
    //   'unknown'} | reserved: ${requests.cpu || 'none'} | limit: ${limits.cpu ||
    //   'unlimited'}`

    // const memTooltip = `used: ${usage.memory ||
    //   'unknown'} | reserved: ${requests.memory ||
    //   'none'} | limit: ${limits.memory || 'unlimited'}`

    return [
      ...this.data.syncTargets.map((data, i) => {
        return new GenericItem({
          id: `SyncTarget:${this.data.name}:${i}`,
          label: 'sync',
          description: `${data.localPath} → ${data.containerPath}`,
          get tooltip() {
            if (data.activeSync) {
              return 'Syncing...'
            } else if (data.pendingSync || !data.hasBeenSynced) {
              return 'Pending sync'
            } else if (data.previousSync && data.previousSync.error) {
              return data.previousSync.error
            } else {
              return 'Synced'
            }
          },
          get iconPath() {
            if (data.activeSync) {
              return TreeDataComponent.iconRef('sync/syncing.svg', true)
            } else if (data.pendingSync || !data.hasBeenSynced) {
              return TreeDataComponent.iconRef('sync/unknown.svg', true)
            } else if (data.previousSync && data.previousSync.error) {
              return TreeDataComponent.iconRef('sync/error.svg', true)
            } else {
              return TreeDataComponent.iconRef('sync/synced.svg', true)
            }
          },
        })
      }),
    ]
  }
}
