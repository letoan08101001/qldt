window.ExamStorage = (() => {
  const serverMode = location.protocol === 'http:' || location.protocol === 'https:';
  let warned = false;

  function showStorageWarning(message) {
    if (warned) return;
    warned = true;
    setTimeout(() => {
      alert(`${message}\n\nDữ liệu chung chỉ hoạt động khi chạy qua server/API.`);
    }, 0);
  }

  function request(method, path, body) {
    if (!serverMode) {
      throw new Error('Ứng dụng đang mở trực tiếp bằng file, không có server dữ liệu chung.');
    }
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
    try {
      const raw = request('GET', '/api/data');
      return raw && raw !== 'null' ? raw : null;
    } catch (error) {
      showStorageWarning(error.message);
      return null;
    }
  }

  function save(data) {
    try {
      request('PUT', '/api/data', data);
    } catch (error) {
      showStorageWarning(error.message);
    }
  }

  function clear() {
    try {
      request('DELETE', '/api/data');
    } catch (error) {
      showStorageWarning(error.message);
    }
  }

  function getItem() {
    return null;
  }

  function setItem() {}

  return { load, save, clear, getItem, setItem };
})();
