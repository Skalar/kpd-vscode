import {InMemoryCache} from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import {FetchResult, Observable} from 'apollo-link'
import {WebSocketLink} from 'apollo-link-ws'
import debounce from 'debounce-promise'
import gql from 'graphql-tag'
import {SubscriptionClient} from 'subscriptions-transport-ws'
import * as vscode from 'vscode'
import ws from 'ws'
import {TreeDataProvider} from './TreeDataProvider'
import {buildActionList} from './buildActionList'
import {
  buildImagesMutation,
  createPodTunnelMutation,
  deletePodsMutation,
  deployStackMutation,
  mainQuery,
} from './graphql/queries'
import {VSCodeKPDQuery} from './graphql/types'

export default class Controller {
  public output: vscode.OutputChannel
  public connected = false
  private view: vscode.TreeView<any>
  private treeDataProvider: TreeDataProvider
  // private serverLogs?: vscode.Terminal

  public data?: VSCodeKPDQuery

  public graphql: {
    subClient: SubscriptionClient
    cache: InMemoryCache
    client: ApolloClient<any>
    link: WebSocketLink
    subscription: Observable<
      FetchResult<any, Record<string, any>, Record<string, any>>
    >
  }

  protected nodeBinPaths: string[] = []

  constructor(
    private context: vscode.ExtensionContext,
    public socketPath: string
  ) {
    this.output = vscode.window.createOutputChannel('KPD')
    this.output.appendLine(`KPD server socket path: ${this.socketPath}`)
    this.output.append('Initializing KPD VSCode extension...')

    context.subscriptions.push(this.output)

    this.graphql = this.setupGraphQL()
    this.treeDataProvider = new TreeDataProvider(this)
    this.view = this.setupView()
    this.registerVSCodeCommands()

    this.output.appendLine('done.')
  }

  public async showActionPicker() {
    const picked = await vscode.window.showQuickPick(buildActionList(this), {
      placeHolder: 'KPD Commands',
    })

    if (picked && picked.fn) {
      picked.fn()
    }
  }

  public showKpdServerLogs(show = true) {
    this.runKpdCliCommand('server-logs', {
      name: 'KPD server logs',
      ignoreError: true,
      show,
    })
  }

  fetchData = debounce(
    async () => {
      console.log('fetching data!')
      const result = await this.graphql.client.query({
        query: mainQuery,
        fetchPolicy: 'no-cache',
      })

      this.data = result.data

      await this.updateVSCodeContextVars()
      this.treeDataProvider.refresh()
      // setTimeout(() => this.treeDataProvider.refresh(), 1)
    },
    500,
    {leading: true}
  )

  public async runKpdCliCommand(
    args: string,
    params: {
      name: string
      show?: boolean
      reuse?: boolean
      ignoreError?: boolean
    }
  ) {
    const cliPath = this.data?.instance?.cliPath

    if (!cliPath) {
      vscode.window.showErrorMessage(`No cli path provided`)
    }

    const {name, show = true, reuse = true} = params

    let terminal =
      reuse && vscode.window.terminals.find(terminal => terminal.name === name)

    if (!terminal) {
      terminal = vscode.window.createTerminal(name, 'bash', [
        '-c',
        `${cliPath} ${args} || sleep 20`,
      ])
    }

    if (show) {
      terminal.show()
    }
  }

  async getPodTunnel(podName: string, containerPort: number) {
    const result = await this.graphql.client.mutate({
      mutation: createPodTunnelMutation,
      variables: {podName, containerPort},
    })

    if (result.errors) {
      for (const error of result.errors) {
        vscode.window.showErrorMessage(`[debug container] ${error.message}`)
      }

      return
    }

    if (result.data.createPodTunnel.error) {
      vscode.window.showErrorMessage(result.data.createPodtunnel.error)

      return
    }

    return result.data.createPodTunnel
  }

  async mutateWithProgress(params: {
    title: string
    mutation: any
    variables?: any
    cancellable?: boolean
  }) {
    const {title, mutation, variables, cancellable} = params

    return await vscode.window.withProgress(
      {
        title,
        location: vscode.ProgressLocation.Notification,
        cancellable,
      },
      async (progress, cancellationToken) => {
        cancellationToken.onCancellationRequested(() => {
          // stop here
        })

        const result = await this.graphql.client.mutate({
          mutation,
          variables,
        })

        if (result.errors) {
          for (const error of result.errors) {
            vscode.window.showErrorMessage(`${title} ${error.message}`)
          }
        }
      }
    )
  }

  async deployStack() {
    this.showKpdServerLogs()

    await this.mutateWithProgress({
      title: 'Deploying stack',
      mutation: deployStackMutation,
      cancellable: true,
    })
  }

  async destroyStack() {
    vscode.window.withProgress(
      {
        title: 'Destroying stack',
        location: vscode.ProgressLocation.Notification,
        cancellable: true,
      },
      async (progress, cancellationToken) => {
        this.showKpdServerLogs()

        cancellationToken.onCancellationRequested(() => {
          // stop here
        })

        const result = await this.graphql.client.mutate({
          mutation: gql`
            mutation DestroyStackMutation {
              destroyStack
            }
          `,
        })

        if (result.errors) {
          for (const error of result.errors) {
            vscode.window.showErrorMessage(error.message)
          }
        }
      }
    )
  }

  async buildImages(imageNames?: string[]) {
    vscode.window.withProgress(
      {
        title: `Building images: ${(
          imageNames || this.data!.images.map(i => i.name)
        ).join(', ')}`,
        location: vscode.ProgressLocation.Notification,
        cancellable: true,
      },
      async (progress, cancellationToken) => {
        cancellationToken.onCancellationRequested(() => {
          // stop here
        })

        const result = await this.graphql.client.mutate({
          mutation: buildImagesMutation,
          variables: {
            images: imageNames,
          },
        })

        if (result.errors) {
          for (const error of result.errors) {
            vscode.window.showErrorMessage(error.message)
          }
        }

        for (const image of result.data.buildImages.images) {
          if (image.result.error) {
            vscode.window.showErrorMessage(
              `[Build ${image.name}]\n${image.result.error}`
            )
          }
        }
      }
    )
  }

  async debugContainer(
    podName: string,
    containerName: string,
    debugConfigJSON: string
  ) {
    try {
      const debugConfig = JSON.parse(debugConfigJSON)?.vscode

      if (!debugConfig) {
        throw new Error('Container does not have a vscode debug configuration')
      }

      const debugSessionName = `${containerName} (${podName})`
      const tunnel = await this.getPodTunnel(podName, debugConfig.port)

      await vscode.debug.startDebugging(undefined, {
        name: debugSessionName,
        request: 'attach',
        address: '127.0.0.1',
        ...debugConfig,
        port: tunnel.localPort,
      })
    } catch (error) {
      vscode.window.showErrorMessage(
        `Debug container ${podName}/${containerName}: ${error}`
      )
    }
  }

  async debugComponent(componentName: string, debugConfigJSON: string) {
    try {
      const debugConfig = JSON.parse(debugConfigJSON)

      const endpoint = this.data!.stackEndpoints.find(
        ep => ep.component.name === componentName && ep.uri.startsWith('https')
      )

      if (endpoint) {
        await vscode.debug.startDebugging(undefined, {
          name: componentName,
          url: endpoint.uri,
          ...debugConfig,
        })
      }
    } catch (error) {
      vscode.window.showErrorMessage(
        `Debug component ${componentName}: ${error}`
      )
    }
  }

  async deletePods(componentName?: string, podName?: string) {
    await this.mutateWithProgress({
      title: `Delete pods`,
      mutation: deletePodsMutation,
      variables: {
        componentName,
        podName,
      },
      cancellable: false,
    })
  }

  protected async updateVSCodeContextVars() {
    await vscode.commands.executeCommand(
      'setContext',
      'kpdIsConnected',
      this.connected
    )

    await vscode.commands.executeCommand(
      'setContext',
      'kpdStackStatus',
      this.data && this.data.stackDeployment
        ? this.data.stackDeployment.status
        : 'UNKNOWN'
    )
  }

  private handleKpdEvent = async (event: {type: string; args: string}) => {
    let args
    try {
      args = JSON.parse(event.args)
    } catch (error) {
      this.output.append(error.toString())
    }

    switch (event.type) {
      case 'kpdLog': {
        this.output.appendLine(args.message)
      }

      case 'stackResourceAdded':
      case 'stackResourceDeleted':
      case 'stackResourceModified':
      case 'imageBuildStarted':
      case 'imageBuildCompleted':
      case 'imageBuildFailed':
      case 'imageBuildStopped':
      case 'dockerImagesUpdated':
      case 'syncStarted':
      case 'syncCompleted':
      case 'syncError':
      case 'syncTargetAdded':
      case 'syncTargetRemoved':
      case 'stackStatusChanged':
      default: {
        await this.fetchData()

        break
      }
      // default: {
      //   await this.fetchData()
      //   this.treeDataProvider.refresh()
      //   console.log('got data and refreshed')
      // }
      // default: {
      //   this.treeDataProvider.refresh()
      // }
    }
  }

  private setupView() {
    // vscode.window.registerTreeDataProvider(
    //   'extension.kpdComponents',
    //   this.componentsProvider
    // )
    const view = vscode.window.createTreeView('extension.kpdView', {
      treeDataProvider: this.treeDataProvider,
    })

    this.treeDataProvider.refresh()

    return view
  }

  private setupGraphQL() {
    const subClient = new SubscriptionClient(
      `ws+unix://${this.socketPath}:/graphql`,
      {
        reconnect: true,
      },
      ws
    )

    const cache = new InMemoryCache()
    const link = new WebSocketLink(subClient)

    const client = new ApolloClient({
      name: 'kpd-vscode-extension',
      link,
      cache,
    })

    const subscription = client.subscribe({
      query: gql`
        subscription VSCodeKPDSubscription {
          events {
            __typename
          }
        }
      `,
    })

    subscription.subscribe(res => {
      if (res.data && res.data.events) {
        this.handleKpdEvent(res.data.events)
      } else {
        // res.data.events can be null when going to sleep?
        console.log('what happened?', res)
      }
    })

    const subscriptionClientEvents = [
      'connecting',
      'connected',
      'disconnected',
      'reconnecting',
      'reconnected',
      'error',
    ]

    for (const event of subscriptionClientEvents) {
      subClient.on(event, (...args: any[]) =>
        this.handleSubscriptionClientEvent(event, ...args)
      )
    }

    return {subClient, cache, link, client, subscription}
  }

  private handleSubscriptionClientEvent = async (
    event: string,
    ...args: any[]
  ) => {
    this.output.appendLine(`Connection status: ${event}`)
    console.log(`Subscription client event "${event}"`)

    if (event === 'error') {
      console.log(`Subscription client error`, ...args)
      return
    }

    let isConnected

    switch (event) {
      case 'connected':
      case 'reconnected': {
        isConnected = true
        // this.data = undefined
        await this.fetchData()
        this.showKpdServerLogs(false)

        break
      }

      case 'disconnected': {
        this.data = undefined
        isConnected = false
        break
      }

      default: {
        isConnected = false
      }
    }

    this.connected = isConnected

    await this.updateVSCodeContextVars()

    this.treeDataProvider.refresh()
  }

  private registerVSCodeCommands() {
    const commands = [
      'showActions',
      'showActionsUnavailable',
      'connectionDisconnected',
      'connectionConnected',
    ]
    for (const command of commands) {
      this.context.subscriptions.push(
        vscode.commands.registerCommand(`kpd.${command}`, (...args) =>
          this.commandHandler(command, ...args)
        )
      )
    }
  }

  protected async commandHandler(command: string, ...args: any[]) {
    switch (command) {
      case 'showActions':
        return this.showActionPicker()
      case 'showActionsUnavailable':
      case 'connectionDisconnected':
        return this.output.show()
      case 'connectionConnected':
        return this.showKpdServerLogs()
    }
  }
}
