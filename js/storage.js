window.ExamStorage = (() => {
  const key = 'exam_manager_v1';
  const serverMode = location.protocol === 'http:' || location.protocol === 'https:';

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

  function load() {
    if (!serverMode) return localStorage.getItem(key);
    const raw = request('GET', '/api/data');
    return raw && raw !== 'null' ? raw : null;
  }

  function save(data) {
    if (!serverMode) {
      localStorage.setItem(key, JSON.stringify(data));
      return;
    }
    request('PUT', '/api/data', data);
  }

  function clear() {
    if (!serverMode) {
      localStorage.removeItem(key);
      return;
    }
    request('DELETE', '/api/data');
  }

  function getItem(name) {
    return localStorage.getItem(name);
  }

  function setItem(name, value) {
    localStorage.setItem(name, value);
  }

  return { key, load, save, clear, getItem, setItem };
})();
