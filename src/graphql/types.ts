/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DestroyStackMutation
// ====================================================

export interface DestroyStackMutation {
  destroyStack: boolean;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: VSCodeKPDSubscription
// ====================================================

export interface VSCodeKPDSubscription_events {
  __typename: "KpdInstanceEvent_imageBuildCreated" | "KpdInstanceEvent_imageBuildStateChanged" | "KpdInstanceEvent_imageBuildFinalized" | "KpdInstanceEvent_stackStatusChanged" | "KpdInstanceEvent_registryImageUpdated" | "KpdInstanceEvent_syncTargetAdded" | "KpdInstanceEvent_syncTargetRemoved" | "KpdInstanceEvent_syncStarted" | "KpdInstanceEvent_syncCompleted" | "KpdInstanceEvent_syncError" | "KpdInstanceEvent_stackResourceAdded" | "KpdInstanceEvent_stackResourceModified" | "KpdInstanceEvent_stackResourceDeleted" | "KpdInstanceEvent_containerRestarting" | "KpdInstanceEvent_containerRestarted" | "KpdInstanceEvent_instanceRecreated" | "KpdInstanceEvent_instanceDisposed" | "KpdInstanceEvent_gitBusyStatusChanged";
}

export interface VSCodeKPDSubscription {
  events: VSCodeKPDSubscription_events;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: VSCodeKPDQuery
// ====================================================

export interface VSCodeKPDQuery_images_registryImage {
  __typename: "RegistryImage";
  size: number;
}

export interface VSCodeKPDQuery_images {
  __typename: "Image";
  name: string;
  registryImage: VSCodeKPDQuery_images_registryImage | null;
}

export interface VSCodeKPDQuery_instance {
  __typename: "KpdInstance";
  id: string;
  cliPath: string;
}

export interface VSCodeKPDQuery_kubernetes {
  __typename: "KubernetesContext";
  configPath: string;
  server: string;
  context: string;
  namespace: string;
}

export interface VSCodeKPDQuery_stackDeployment {
  __typename: "StackDeployment";
  status: KpdStackStatus;
}

export interface VSCodeKPDQuery_stackEndpoints_component {
  __typename: "Component";
  name: string;
}

export interface VSCodeKPDQuery_stackEndpoints {
  __typename: "StackEndpoint";
  source: string;
  uri: string;
  serviceName: string;
  component: VSCodeKPDQuery_stackEndpoints_component;
}

export interface VSCodeKPDQuery_components_pods_containers_status_state {
  __typename: "ContainerStateRunning" | "ContainerStateTerminated" | "ContainerStateWaiting";
  name: string;
}

export interface VSCodeKPDQuery_components_pods_containers_status {
  __typename: "ContainerStatus";
  ready: boolean | null;
  state: VSCodeKPDQuery_components_pods_containers_status_state | null;
}

export interface VSCodeKPDQuery_components_pods_containers_resources_requests {
  __typename: "ContainerResourceValues";
  memory: string | null;
  memoryBytes: number | null;
  cpu: string | null;
  cpuNano: number | null;
}

export interface VSCodeKPDQuery_components_pods_containers_resources_limits {
  __typename: "ContainerResourceValues";
  memory: string | null;
  memoryBytes: number | null;
  cpu: string | null;
  cpuNano: number | null;
}

export interface VSCodeKPDQuery_components_pods_containers_resources {
  __typename: "ContainerResources";
  requests: VSCodeKPDQuery_components_pods_containers_resources_requests;
  limits: VSCodeKPDQuery_components_pods_containers_resources_limits;
}

export interface VSCodeKPDQuery_components_pods_containers_syncTargets_pendingSync {
  __typename: "Sync";
  type: SyncType | null;
  error: string | null;
}

export interface VSCodeKPDQuery_components_pods_containers_syncTargets_activeSync {
  __typename: "Sync";
  type: SyncType | null;
  error: string | null;
}

export interface VSCodeKPDQuery_components_pods_containers_syncTargets_previousSync {
  __typename: "Sync";
  type: SyncType | null;
  error: string | null;
}

export interface VSCodeKPDQuery_components_pods_containers_syncTargets {
  __typename: "SyncTarget";
  localPath: string | null;
  containerPath: string | null;
  hasBeenSynced: boolean | null;
  pendingSync: VSCodeKPDQuery_components_pods_containers_syncTargets_pendingSync | null;
  activeSync: VSCodeKPDQuery_components_pods_containers_syncTargets_activeSync | null;
  previousSync: VSCodeKPDQuery_components_pods_containers_syncTargets_previousSync | null;
}

export interface VSCodeKPDQuery_components_pods_containers_shellCommands {
  __typename: "ContainerShellCommands";
  name: string;
  shell: string;
  command: string | null;
}

export interface VSCodeKPDQuery_components_pods_containers {
  __typename: "Container";
  name: string;
  isRestarting: boolean;
  status: VSCodeKPDQuery_components_pods_containers_status | null;
  resources: VSCodeKPDQuery_components_pods_containers_resources;
  syncTargets: VSCodeKPDQuery_components_pods_containers_syncTargets[];
  shellCommands: VSCodeKPDQuery_components_pods_containers_shellCommands[];
  debugConfigJSON: string | null;
}

export interface VSCodeKPDQuery_components_pods {
  __typename: "Pod";
  name: string;
  phase: string | null;
  containers: VSCodeKPDQuery_components_pods_containers[];
}

export interface VSCodeKPDQuery_components {
  __typename: "Component";
  name: string;
  debugConfigJSON: string | null;
  pods: VSCodeKPDQuery_components_pods[];
}

export interface VSCodeKPDQuery {
  images: VSCodeKPDQuery_images[];
  instance: VSCodeKPDQuery_instance | null;
  kubernetes: VSCodeKPDQuery_kubernetes;
  stackDeployment: VSCodeKPDQuery_stackDeployment;
  stackEndpoints: VSCodeKPDQuery_stackEndpoints[];
  components: VSCodeKPDQuery_components[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreatePodTunnelMutation
// ====================================================

export interface CreatePodTunnelMutation_createPodTunnel {
  __typename: "PodTunnel";
  localPort: number;
}

export interface CreatePodTunnelMutation {
  createPodTunnel: CreatePodTunnelMutation_createPodTunnel | null;
}

export interface CreatePodTunnelMutationVariables {
  podName: string;
  containerPort: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeletePodsMutation
// ====================================================

export interface DeletePodsMutation_deletePods_deleted {
  __typename: "Pod";
  name: string;
}

export interface DeletePodsMutation_deletePods {
  __typename: "DeletePodsMutationResponse";
  deleted: DeletePodsMutation_deletePods_deleted[];
}

export interface DeletePodsMutation {
  deletePods: DeletePodsMutation_deletePods;
}

export interface DeletePodsMutationVariables {
  componentName?: string | null;
  podName?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: BuildMutation
// ====================================================

export interface BuildMutation_build_images {
  __typename: "BuildMutationResponseImage";
  name: string;
  status: BuildMutationResponseImageStatus;
}

export interface BuildMutation_build {
  __typename: "BuildMutationResponse";
  images: BuildMutation_build_images[];
}

export interface BuildMutation {
  build: BuildMutation_build;
}

export interface BuildMutationVariables {
  images?: string[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeployStackMutation
// ====================================================

export interface DeployStackMutation {
  deployStack: boolean;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum BuildMutationResponseImageStatus {
  AlreadyQueued = "AlreadyQueued",
  Queued = "Queued",
  UnknownImage = "UnknownImage",
}

export enum KpdStackStatus {
  ABORTING = "ABORTING",
  DEPLOYED = "DEPLOYED",
  DEPLOYING = "DEPLOYING",
  DESTROYING = "DESTROYING",
  ERROR = "ERROR",
  FETCHING_STATUS = "FETCHING_STATUS",
  INITIALIZING = "INITIALIZING",
  NOT_DEPLOYED = "NOT_DEPLOYED",
  UNKNOWN = "UNKNOWN",
}

export enum SyncType {
  Full = "Full",
  Partial = "Partial",
}

//==============================================================
// END Enums and Input Objects
//==============================================================
