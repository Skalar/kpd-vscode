import open from 'open'
import * as vscode from 'vscode'
import Controller from './Controller'

type KpdAction = any

export function buildActionList(controller: Controller): Array<KpdAction> {
  const list: KpdAction[] = [
    {
      label: 'Show extension output',
      fn: () => {
        controller.output.show()
      },
    },
  ]

  if (!controller.connected) {
    return list
  }

  list.unshift({
    label: 'Show KPD server logs',
    fn: () => controller.showKpdServerLogs(),
  })

  if (!controller.data) {
    return list
  }

  list.push({label: 'Deploy stack', fn: () => controller.deployStack()})
  list.push({label: 'Destroy stack', fn: () => controller.destroyStack()})

  list.push({
    label: 'View logs: ALL components',
    fn: () =>
      controller.runKpdCliCommand('logs', {name: 'Logs: ALL components'}),
  })

  list.push({
    label: 'Build: ALL',
    fn: () => {
      controller.buildImages()
      controller.showKpdServerLogs()
    },
  })

  list.push({
    label: 'Debug: ALL',
    fn: () => {
      for (const component of controller.data!.components) {
        if (component.debugConfigJSON) {
          controller.debugComponent(component.name, component.debugConfigJSON)
        }

        for (const pod of component.pods) {
          for (const container of pod.containers) {
            if (container.debugConfigJSON) {
              controller.debugContainer(
                pod.name,
                container.name,
                container.debugConfigJSON
              )
            }
          }
        }
      }
    },
  })

  list.push({
    label: `Delete pods: ALL`,
    fn: () => controller.deletePods(),
  })

  for (const image of controller.data.images) {
    list.push({
      label: `Build: ${image.name}`,
      fn: () => controller.buildImages([image.name]),
    })
  }

  for (const component of controller.data.components) {
    list.push({
      label: `View logs: ${component.name}`,
      fn: () =>
        controller.runKpdCliCommand(`logs ${component.name}`, {
          name: `Logs: ${component.name}`,
        }),
    })

    list.push({
      label: `Restart containers: ${component.name}`,
      fn: () => {
        controller.runKpdCliCommand(`restart ${component.name}`, {
          name: `Restart containers: ${component.name}`,
        })
      },
    })

    if (component.debugConfigJSON) {
      list.push({
        label: `Debug: ${component.name}`,
        fn: async () => {
          await controller.debugComponent(
            component.name,
            component.debugConfigJSON!
          )
        },
      })
    }

    list.push({
      label: `Delete pods: ${component.name}`,
      fn: () => controller.deletePods(component.name),
    })

    for (const pod of component.pods) {
      let debugIndex = 0

      for (const container of pod.containers) {
        let shellIndex = 0

        if (container.debugConfigJSON) {
          debugIndex++
          list.push({
            label: `Debug: ${component.name} › ${container.name}${
              debugIndex > 1 ? ` [#${debugIndex}]` : ''
            }`,
            detail: `${pod.name}`,
            fn: async () => {
              controller.debugContainer(
                pod.name,
                container.name,
                container.debugConfigJSON!
              )
            },
          })
        }

        for (const shellCommand of container.shellCommands) {
          const terminalName = `${container.name}:${shellCommand.name} @ ${pod.name}`
          for (const terminal of vscode.window.terminals) {
            if (terminal.name !== terminalName) {
              continue
            }

            shellIndex++

            list.push({
              label: `Show shell: ${component.name} - ${shellCommand.name} [#${shellIndex}]`,
              detail: `${pod.name} › ${container.name}`,
              fn: () => {
                terminal.show()
              },
            })
          }

          list.push({
            label: `Start new shell: ${component.name} - ${shellCommand.name}`,
            detail: `${pod.name} › ${container.name}`,
            fn: async () => {
              await controller.runKpdCliCommand(
                `shell ${component.name} -c ${container.name} -p ${pod.name} ${shellCommand.name}`,
                {
                  name: terminalName,
                  reuse: false,
                }
              )
            },
          })
        }
      }
    }
  }

  for (const endpoint of controller.data.stackEndpoints) {
    list.push({
      label: `Open ${endpoint.component.name} [${endpoint.source}] ${endpoint.uri}`,
      fn: async () => {
        await open(endpoint.uri)
      },
    })
  }

  return list
}
