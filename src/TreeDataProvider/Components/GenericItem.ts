import {TreeItem, TreeItemCollapsibleState} from 'vscode'

export class GenericItem extends TreeItem {
  getChildren: () => TreeItem[] = () => []

  constructor(params: {
    label?: string
    description?: string
    id: string
    iconPath?: string | {light: string; dark: string}
    collapsed?: boolean
    tooltip?: string
    getChildren?: () => TreeItem[]
  }) {
    super(params.label || '')
    this.label = params.label
    this.description = params.description
    if (params.collapsed === true) {
      this.collapsibleState = TreeItemCollapsibleState.Collapsed
    } else if (params.collapsed === false) {
      this.collapsibleState = TreeItemCollapsibleState.Expanded
    } else {
      this.collapsibleState = TreeItemCollapsibleState.None
    }

    this.iconPath = params.iconPath
    this.tooltip = params.tooltip || ''

    if (params.getChildren) {
      this.getChildren = params.getChildren
    }
  }
}
