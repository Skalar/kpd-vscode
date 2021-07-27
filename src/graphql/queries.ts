import gql from 'graphql-tag'

export const mainQuery = gql`
  query VSCodeKPDQuery {
    images {
      name
      registryImage {
        size
      }
    }

    instance {
      id
      cliPath
    }

    kubernetes {
      configPath
      server
      context
      namespace
    }

    stackDeployment {
      status
    }

    stackEndpoints {
      source
      uri
      serviceName

      component {
        name
      }
    }

    components {
      name
      debugConfigJSON

      pods {
        name
        phase

        containers {
          name

          isRestarting

          status {
            ready
            state {
              name
            }
          }

          resources {
            requests {
              memory
              memoryBytes
              cpu
              cpuNano
            }
            limits {
              memory
              memoryBytes
              cpu
              cpuNano
            }
          }

          syncTargets {
            localPath
            containerPath
            hasBeenSynced
            pendingSync {
              type
              error
            }
            activeSync {
              type
              error
            }
            previousSync {
              type
              error
            }
          }

          shellCommands {
            name
            shell
            command
          }

          debugConfigJSON
        }
      }
    }
  }
`

export const createPodTunnelMutation = gql`
  mutation CreatePodTunnelMutation($podName: String!, $containerPort: Int!) {
    createPodTunnel(
      podName: $podName
      containerPort: $containerPort
      destroyOnIdle: true
    ) {
      localPort
    }
  }
`

export const deletePodsMutation = gql`
  mutation DeletePodsMutation($componentName: String, $podName: String) {
    deletePods(componentName: $componentName, podName: $podName) {
      deleted {
        name
      }
    }
  }
`

export const buildImagesMutation = gql`
  mutation BuildMutation($images: [String!]) {
    build(images: $images) {
      images {
        name
        status
      }
    }
  }
`

export const deployStackMutation = gql`
  mutation DeployStackMutation {
    deployStack
  }
`
