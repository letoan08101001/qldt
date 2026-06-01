window.ExamStorage = (() => {
  const key = 'exam_manager_v1';

  function load() {
    return localStorage.getItem(key);
  }

  function save(data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function clear() {
    localStorage.removeItem(key);
  }

  function getItem(name) {
    return localStorage.getItem(name);
  }

  function setItem(name, value) {
    localStorage.setItem(name, value);
  }

  return { key, load, save, clear, getItem, setItem };
})();
