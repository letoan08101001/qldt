window.ExamStorage = (() => {
  const key = 'exam_manager_v1';
  const serverMode = location.protocol === 'http:' || location.protocol === 'https:';
  let apiAvailable = serverMode;

  function request(method, path, body) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, path, false);
    if (body !== undefined) xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    xhr.send(body === undefined ? null : JSON.stringify(body));
    if (xhr.status < 200 || xhr.status >= 300) {
      throw new Error(`Storage request failed: ${method} ${path} (${xhr.status})`);
    }
    return xhr.responseText;
  }

  function useLocalStorage(method, data) {
    if (method === 'load') return localStorage.getItem(key);
    if (method === 'save') localStorage.setItem(key, JSON.stringify(data));
    if (method === 'clear') localStorage.removeItem(key);
    return null;
  }

  function load() {
    if (!apiAvailable) return useLocalStorage('load');
    try {
      const raw = request('GET', '/api/data');
      return raw && raw !== 'null' ? raw : useLocalStorage('load');
    } catch {
      apiAvailable = false;
      return useLocalStorage('load');
    }
  }

  function save(data) {
    if (!apiAvailable) {
      useLocalStorage('save', data);
      return;
    }
    try {
      request('PUT', '/api/data', data);
    } catch {
      apiAvailable = false;
      useLocalStorage('save', data);
    }
  }

  function clear() {
    if (!apiAvailable) {
      useLocalStorage('clear');
      return;
    }
    try {
      request('DELETE', '/api/data');
    } catch {
      apiAvailable = false;
      useLocalStorage('clear');
    }
  }

  function getItem(name) {
    return localStorage.getItem(name);
  }

  function setItem(name, value) {
    localStorage.setItem(name, value);
  }

  return { key, load, save, clear, getItem, setItem };
})();
