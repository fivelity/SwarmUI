export const API_BASE = './API'; // Relative to the web root

export async function getInstallStatus() {
  try {
    const response = await fetch(`${API_BASE}/Util/GetInstallStatus`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error('Failed to fetch install status:', e);
    // Assume not installed if status check fails, to show the installer
    return { is_installed: false };
  }
}

export async function getNewSession(): Promise<{ session_id?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/GetNewSession`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error('Failed to get session:', e);
    return { error: 'failed' };
  }
}

export async function getModels() {
  try {
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      throw new Error('No session ID available');
    }
    
    const response = await fetch(`${API_BASE}/ListModels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        session_id: sessionId,
        path: '',
        depth: 3,
        subtype: 'Stable-Diffusion',
        sortBy: 'Name',
        allowRemote: true,
        sortReverse: false
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.models || [];
  } catch (e) {
    console.error('Failed to fetch models:', e);
    return [];
  }
}

export async function getParams() {
  try {
    const response = await fetch(`${API_BASE}/Util/ListAllT2IParams`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error('Failed to fetch params:', e);
    return [];
  }
}

export async function getThemes() {
  try {
    const response = await fetch(`${API_BASE}/Util/ListThemes`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error('Failed to fetch themes:', e);
    return [];
  }
}

export async function tokenize(text: string) {
  try {
    const response = await fetch(`${API_BASE}/Util/Tokenize?text=${encodeURIComponent(text)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error('Failed to tokenize text:', e);
    return [];
  }
}

export async function listExtensions() {
  try {
    const response = await fetch(`${API_BASE}/Extensions/List`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error('Failed to list extensions:', e);
    return { installed: [], available: [] };
  }
}

export async function installExtension(name: string) {
  try {
    const response = await fetch(`${API_BASE}/Extensions/Install?name=${encodeURIComponent(name)}`, { method: 'POST' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error('Failed to install extension:', e);
    throw e;
  }
}

export async function uninstallExtension(name: string) {
  try {
    const response = await fetch(`${API_BASE}/Extensions/Uninstall?name=${encodeURIComponent(name)}`, { method: 'POST' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error('Failed to uninstall extension:', e);
    throw e;
  }
}

export async function updateExtension(name: string) {
  try {
    const response = await fetch(`${API_BASE}/Extensions/Update?name=${encodeURIComponent(name)}`, { method: 'POST' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error('Failed to update extension:', e);
    throw e;
  }
}

export async function startDownload(url: string, modelType: string, saveAs: string) {
  try {
    const response = await fetch(`${API_BASE}/Downloader/StartDownload?url=${encodeURIComponent(url)}&model_type=${encodeURIComponent(modelType)}&save_as=${encodeURIComponent(saveAs)}`, { method: 'POST' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error('Failed to start download:', e);
    throw e;
  }
}

export async function getDownloadStatus(downloadId: string) {
  try {
    const response = await fetch(`${API_BASE}/Downloader/GetDownloadStatus?download_id=${encodeURIComponent(downloadId)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error('Failed to get download status:', e);
    return null;
  }
}

export async function checkForUpdates() {
  try {
    const response = await fetch(`${API_BASE}/Admin/CheckForUpdates`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error('Failed to check for updates:', e);
    throw e;
  }
}

export async function getLogs(level: string, filter: string) {
  try {
    const response = await fetch(`${API_BASE}/Admin/GetLogs?level=${level}&filter=${filter}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error('Failed to fetch logs:', e);
    return [];
  }
}

export async function submitLogsToPastebin(payload: { logs: string }) {
    try {
        const response = await fetch(`${API_BASE}/Admin/SubmitLogsToPastebin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        console.error('Failed to submit logs:', e);
        throw e;
    }
}

export async function getCurrentStatus() {
  try {
    const response = await fetch(`${API_BASE}/Admin/GetCurrentStatus`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error('Failed to fetch status:', e);
    return null;
  }
}

export async function getServerInfo() {
  try {
    const response = await fetch(`${API_BASE}/Admin/GetServerInfo`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error('Failed to fetch server info:', e);
    return null;
  }
}

export async function generate(params: any) {
  try {
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      throw new Error('No session ID available');
    }
    
    // Extract the number of images to generate (default to 1)
    const images = params.images || params.batchsize || 1;
    
    // For the legacy API system, we need to structure the call differently
    // The rawInput should contain all the generation parameters
    const requestBody = {
      session_id: sessionId,
      images: images,
      rawInput: {
        session_id: sessionId,
        ...params
      }
    };
    
    const response = await fetch(`${API_BASE}/GenerateText2Image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const result = await response.json();
    return result.images || result; // Return the images array or the full result
  } catch (e) {
    console.error('Failed to generate image:', e);
    throw e; // Re-throw to let the caller handle it
  }
}

export async function shutdown() {
    try {
        const response = await fetch(`${API_BASE}/Admin/Shutdown`, { method: 'POST' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        console.error('Failed to shutdown server:', e);
        throw e;
    }
}

export async function restart() {
    try {
        const response = await fetch(`${API_BASE}/Admin/Restart`, { method: 'POST' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        console.error('Failed to restart server:', e);
        throw e;
    }
}

export async function clearVRAM() {
    try {
        const response = await fetch(`${API_BASE}/Admin/ClearVRAM`, { method: 'POST' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        console.error('Failed to clear VRAM:', e);
        throw e;
    }
}

export async function clearSysRAM() {
    try {
        const response = await fetch(`${API_BASE}/Admin/ClearSysRAM`, { method: 'POST' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        console.error('Failed to clear system RAM:', e);
        throw e;
    }
}

export async function listPresets() {
    try {
        const response = await fetch(`${API_BASE}/Util/ListPresets`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        console.error('Failed to fetch presets:', e);
        return [];
    }
}

export async function savePreset(name: string, params: any) {
    try {
        const response = await fetch(`${API_BASE}/Util/SavePreset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, params }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        console.error('Failed to save preset:', e);
        throw e;
    }
}

export async function listWildcards() {
    try {
        const response = await fetch(`${API_BASE}/Util/ListWildcards`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        console.error('Failed to fetch wildcards:', e);
        return {};
    }
}

export async function saveWildcard(filename: string, content: string) {
    try {
        const response = await fetch(`${API_BASE}/Util/SaveWildcard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename, content }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        console.error('Failed to save wildcard:', e);
        throw e;
    }
}

// User Management
export async function listUsers() {
    return fetch(`${API_BASE}/Admin/ListUsers`).then(res => res.json());
}

export async function addUser(username: string, password: string) {
    return fetch(`${API_BASE}/Admin/AddUser?username=${username}&password=${password}`, { method: 'POST' }).then(res => res.json());
}

export async function deleteUser(id: string) {
    return fetch(`${API_BASE}/Admin/DeleteUser?id=${id}`, { method: 'POST' }).then(res => res.json());
}

export async function updateUserRoles(id: string, roles_csv: string) {
    return fetch(`${API_BASE}/Admin/UpdateUserRoles?id=${id}&roles_csv=${roles_csv}`, { method: 'POST' }).then(res => res.json());
}

export async function changeUserPassword(id: string, new_password: string) {
    return fetch(`${API_BASE}/Admin/ChangeUserPassword?id=${id}&new_password=${new_password}`, { method: 'POST' }).then(res => res.json());
}

// Role Management
export async function listRoles() {
    return fetch(`${API_BASE}/Admin/ListRoles`).then(res => res.json());
}

export async function addRole(id: string, name: string) {
    return fetch(`${API_BASE}/Admin/AddRole?id=${id}&name=${name}`, { method: 'POST' }).then(res => res.json());
}

export async function deleteRole(id: string) {
    return fetch(`${API_BASE}/Admin/DeleteRole?id=${id}`, { method: 'POST' }).then(res => res.json());
}

export async function updateRolePermissions(id: string, permissions_csv: string) {
    return fetch(`${API_BASE}/Admin/UpdateRolePermissions?id=${id}&permissions_csv=${permissions_csv}`, { method: 'POST' }).then(res => res.json());
}

export async function listPermissions() {
    return fetch(`${API_BASE}/Admin/ListPermissions`).then(res => res.json());
}

export async function resetAllMetadata() {
    return fetch(`${API_BASE}/Util/ResetAllMetadata`, { method: 'POST' }).then(res => res.json());
}

// Backend Management
export async function listBackends() {
    return fetch(`${API_BASE}/Backend/ListBackends`).then(res => res.json());
}

export async function toggleBackend(id: number, enabled: boolean) {
    return fetch(`${API_BASE}/Backend/ToggleBackend?backend_id=${id}&enabled=${enabled}`, { method: 'POST' });
}

export async function restartAllBackends() {
    return fetch(`${API_BASE}/Backend/RestartBackends`, { method: 'POST' });
}
