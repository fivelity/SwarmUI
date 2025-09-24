import { API_BASE } from './api';

export interface ComfyWorkflow {
  name: string;
  workflow: string;
  prompt: string;
  customParams: string;
  paramValues: string;
  image: string;
  description?: string;
  enableInSimple: boolean;
}

export interface SaveWorkflowRequest extends ComfyWorkflow {
  replace?: string;
}

export interface WorkflowListItem {
  name: string;
  description: string;
  image: string;
  enableInSimple: boolean;
}

// Save a ComfyUI workflow
export async function saveWorkflow(workflow: SaveWorkflowRequest): Promise<any> {
  const response = await fetch(`${API_BASE}/ComfyUI/SaveWorkflow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workflow),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save workflow');
  }

  return response.json();
}

// Read a specific ComfyUI workflow
export async function readWorkflow(name: string): Promise<ComfyWorkflow> {
  const response = await fetch(`${API_BASE}/ComfyUI/ReadWorkflow?name=${encodeURIComponent(name)}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to read workflow');
  }

  return response.json();
}

// List all available ComfyUI workflows
export async function listWorkflows(): Promise<WorkflowListItem[]> {
  const response = await fetch(`${API_BASE}/ComfyUI/ListWorkflows`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to list workflows');
  }

  return response.json();
}

// Delete a ComfyUI workflow
export async function deleteWorkflow(name: string): Promise<any> {
  const response = await fetch(`${API_BASE}/ComfyUI/DeleteWorkflow?name=${encodeURIComponent(name)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete workflow');
  }

  return response.json();
}

// Get the generated workflow for current parameters
export async function getGeneratedWorkflow(): Promise<any> {
  const response = await fetch(`${API_BASE}/ComfyUI/GetGeneratedWorkflow`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get generated workflow');
  }

  return response.json();
}

// Ensure ComfyUI backend is refreshable
export async function ensureRefreshable(): Promise<any> {
  const response = await fetch(`${API_BASE}/ComfyUI/EnsureRefreshable`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to ensure refreshable');
  }

  return response.json();
}

// Helper function to communicate with ComfyUI iframe
export function sendMessageToComfyUI(iframe: HTMLIFrameElement, message: any) {
  if (iframe.contentWindow) {
    iframe.contentWindow.postMessage(message, '*');
  }
}

// Helper function to listen for messages from ComfyUI iframe
export function listenToComfyUIMessages(callback: (event: MessageEvent) => void) {
  const handleMessage = (event: MessageEvent) => {
    // Only handle messages from ComfyUI iframe
    if (event.origin === window.location.origin) {
      callback(event);
    }
  };

  window.addEventListener('message', handleMessage);
  
  return () => {
    window.removeEventListener('message', handleMessage);
  };
}
