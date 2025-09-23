const API_BASE = './API'; // Relative to the web root

export async function getModels() {
  try {
    const response = await fetch(`${API_BASE}/T2IAPI/ListModels`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const models = await response.json();
    return models;
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
    const response = await fetch(`${API_BASE}/T2IAPI/GenerateText2Image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.images; // Assuming the API returns { images: [...] }
  } catch (e) {
    console.error('Failed to generate image:', e);
    return null;
  }
}