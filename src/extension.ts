import * as fs from 'fs'
import {sep} from 'path'
import * as vscode from 'vscode'
import Controller from './Controller'

let kpdController: Controller | undefined

function findConfigFilePath(cwd: string) {
  const pathParts = cwd.split(sep)
  while (pathParts.length) {
    for (const ext of ['yaml', 'yml']) {
      const path = [...pathParts, `kpd.${ext}`].join(sep)

      try {
        fs.accessSync(path)
        return path
      } catch (error) {
        //
      }
    }
    pathParts.pop()
  }
}

export async function activate(context: vscode.ExtensionContext) {
  let configFilePath: string | undefined

  for (const folder of vscode.workspace.workspaceFolders || []) {
    configFilePath = findConfigFilePath(folder.uri.fsPath)

    if (configFilePath) {
      break
    }
  }

  if (!configFilePath) {
    console.log('Did not find a kpd.yaml config')
    return
  }

  console.log(`Found config at ${configFilePath} - activating extension`)

  vscode.commands.executeCommand('setContext', 'kpdActivated', true)

  const socketPath = configFilePath.replace(/kpd\.ya?ml$/, 'kpd.sock')

  try {
    kpdController = new Controller(context, socketPath)
  } catch (error) {
    vscode.window.showErrorMessage(error.toString())
    return
  }

  kpdController.fetchData()
}

export function deactivate() {
  if (kpdController) {
    // kpdController.stop()
  }
}
