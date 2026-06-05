const dataStore = window.ExamStorage;
    const trialDurationMs = 5 * 24 * 60 * 60 * 1000;
    const trialStartKey = 'exam_manager_trial_start';
    const trialEndKey = 'exam_manager_trial_end';
    let trialTimer = null;
    let sessionUserId = null;
    let activeModule = null;
    const defaultSettings = {
      totalExams: 10,
      selectedExamNo: 1,
      currentUserId: null
    };

    const defaultAccounts = [
      {
        id: 'admin',
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        fullName: 'Quản trị hệ thống',
        birthDate: '',
        rank: '',
        position: 'Quản trị viên',
        unit: 'Ban quản trị'
      }
    ];

    const defaultTextStyles = {
      headerLeft: { font: 'Times New Roman', size: 14, bold: true, align: 'center' },
      headerCenter: { font: 'Times New Roman', size: 14, bold: true, align: 'center' },
      headerRight: { font: 'Times New Roman', size: 14, bold: true, align: 'center' },
      title: { font: 'Times New Roman', size: 14, bold: true, align: 'center' },
      subject: { font: 'Times New Roman', size: 14, bold: false, align: 'center' },
      duration: { font: 'Times New Roman', size: 14, bold: false, align: 'center' },
      instruction: { font: 'Times New Roman', size: 14, bold: false, align: 'center' },
      question: { font: 'Times New Roman', size: 14, bold: false, align: 'left' }
    };

    const defaultTemplate = {
      leftHeader: 'TRƯỜNG TCKT CÔNG BINH\nHỘI ĐỒNG THI CẤP CHỨNG CHỈ\nRÀ PHÁ BOM MÌN, VẬT NỔ\n---------\nNăm 2026',
      centerHeader: '',
      rightHeader: 'ĐỀ THI CẤP CHỨNG CHỈ RPBN, VN\nMÔN THI: THỰC HÀNH TỔNG HỢP\nĐỐI TƯỢNG: KỸ THUẬT VIÊN RPBM, VN',
      title: 'ĐỀ THI SỐ',
      subject: 'MÔN THI: THỰC HÀNH TỔNG HỢP',
      duration: 'Thời gian thi: 40 phút',
      code: '',
      studentLine: '',
      instruction: 'Hình thức thi: Vấn đáp + thực hành',
      numberStyle: 'Câu',
      answerSpace: 'none',
      examGapLines: 10,
      textStyles: structuredClone(defaultTextStyles),
      templateVersion: 4
    };

    const diplomaFields = [
      ['title', 'Tiêu đề'],
      ['fullName', 'Họ và tên'],
      ['birthDate', 'Ngày sinh'],
      ['rank', 'Cấp bậc'],
      ['position', 'Chức vụ'],
      ['unit', 'Đơn vị'],
      ['startDate', 'Ngày nhập học'],
      ['graduationDate', 'Ngày tốt nghiệp'],
      ['diplomaType', 'Loại bằng'],
      ['photo', 'Ảnh học viên']
    ];

    const defaultDiplomaTemplate = {
      paperSize: 'A4',
      orientation: 'landscape',
      customWidth: 29.7,
      customHeight: 21,
      borderWidth: 4,
      borderColor: '#0f7a66',
      backgroundImage: '',
      logoImage: '',
      fields: {
        title: { label: 'VĂN BẰNG', x: 50, y: 22, size: 30, font: 'Times New Roman', color: '#0f513f', bold: true, spacing: 2, visible: true },
        fullName: { label: '{fullName}', x: 50, y: 42, size: 24, font: 'Times New Roman', color: '#111111', bold: true, spacing: 0, visible: true },
        birthDate: { label: 'Ngày sinh: {birthDate}', x: 50, y: 50, size: 14, font: 'Times New Roman', color: '#111111', bold: false, spacing: 0, visible: true },
        rank: { label: 'Cấp bậc: {rank}', x: 32, y: 58, size: 14, font: 'Times New Roman', color: '#111111', bold: false, spacing: 0, visible: true },
        position: { label: 'Chức vụ: {position}', x: 68, y: 58, size: 14, font: 'Times New Roman', color: '#111111', bold: false, spacing: 0, visible: true },
        unit: { label: 'Đơn vị: {unit}', x: 50, y: 66, size: 14, font: 'Times New Roman', color: '#111111', bold: false, spacing: 0, visible: true },
        startDate: { label: 'Ngày nhập học: {startDate}', x: 32, y: 74, size: 13, font: 'Times New Roman', color: '#111111', bold: false, spacing: 0, visible: true },
        graduationDate: { label: 'Ngày tốt nghiệp: {graduationDate}', x: 68, y: 74, size: 13, font: 'Times New Roman', color: '#111111', bold: false, spacing: 0, visible: true },
        diplomaType: { label: 'Loại bằng: {diplomaType}', x: 50, y: 82, size: 15, font: 'Times New Roman', color: '#111111', bold: true, spacing: 0, visible: true },
        photo: { label: '', x: 16, y: 28, size: 80, font: 'Times New Roman', color: '#111111', bold: false, spacing: 0, visible: true }
      },
      templateVersion: 1
    };

    const sampleData = {
      categories: [
        { id: crypto.randomUUID(), name: 'Lý thuyết' },
        { id: crypto.randomUUID(), name: 'Bài tập' },
        { id: crypto.randomUUID(), name: 'Vận dụng' }
      ],
      questions: [],
      specs: [],
      template: { ...defaultTemplate },
      settings: { ...defaultSettings },
      accounts: structuredClone(defaultAccounts),
      currentExam: [],
      savedExams: {},
      diplomaStudents: [],
      diplomaTemplate: structuredClone(defaultDiplomaTemplate)
    };
    sampleData.questions = [
      { id: crypto.randomUUID(), categoryId: sampleData.categories[0].id, text: 'Trình bày khái niệm và vai trò của nội dung đã học.', answer: '', points: 1 },
      { id: crypto.randomUUID(), categoryId: sampleData.categories[0].id, text: 'Nêu các đặc điểm chính của chủ đề trong bài học.', answer: '', points: 1 },
      { id: crypto.randomUUID(), categoryId: sampleData.categories[1].id, text: 'Giải bài tập theo dữ liệu giáo viên cung cấp và trình bày các bước thực hiện.', answer: '', points: 2 },
      { id: crypto.randomUUID(), categoryId: sampleData.categories[1].id, text: 'Phân tích tình huống và đưa ra kết quả tính toán phù hợp.', answer: '', points: 2 },
      { id: crypto.randomUUID(), categoryId: sampleData.categories[2].id, text: 'Vận dụng kiến thức để xử lý một trường hợp thực tế.', answer: '', points: 3 }
    ];
    sampleData.specs = [
      { categoryId: sampleData.categories[0].id, count: 1 },
      { categoryId: sampleData.categories[1].id, count: 1 }
    ];

    let state = loadState();

    const $ = (id) => document.getElementById(id);
    const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));
    const lineBreaks = (value) => escapeHtml(value).replace(/\n/g, '<br>');

    function loadState() {
      const raw = dataStore.load();
      if (!raw) return structuredClone(sampleData);
      try {
        const parsed = JSON.parse(raw);
        const template = normalizeTemplate(parsed.template);
        const settings = normalizeSettings(parsed.settings);
        return {
          categories: parsed.categories?.length ? parsed.categories : structuredClone(sampleData.categories),
          questions: normalizeQuestions(parsed.questions || []),
          specs: parsed.specs || [],
          template,
          settings,
          accounts: normalizeAccounts(parsed.accounts),
          currentExam: parsed.currentExam || [],
          savedExams: normalizeSavedExams(parsed.savedExams),
          diplomaStudents: normalizeDiplomaStudents(parsed.diplomaStudents),
          diplomaTemplate: normalizeDiplomaTemplate(parsed.diplomaTemplate)
        };
      } catch {
        return structuredClone(sampleData);
      }
    }

    function saveState() {
      const currentUserId = state.settings.currentUserId;
      state.settings.currentUserId = null;
      dataStore.save(state);
      state.settings.currentUserId = currentUserId;
    }

    function normalizeAccounts(accounts = []) {
      const list = accounts.length ? accounts : structuredClone(defaultAccounts);
      return list.map((account) => ({
        id: account.id || crypto.randomUUID(),
        username: account.username || '',
        password: account.password || '',
        role: account.role === 'admin' ? 'admin' : 'user',
        fullName: account.fullName || account.username || '',
        birthDate: account.birthDate || '',
        rank: account.rank || '',
        position: account.position || '',
        unit: account.unit || ''
      }));
    }

    function currentUser() {
      return state.accounts.find((account) => account.id === sessionUserId) || null;
    }

    function isAdmin() {
      return currentUser()?.role === 'admin';
    }

    function requireAdmin() {
      if (isAdmin()) return true;
      alert('Bạn cần quyền quản trị để thực hiện thao tác này.');
      return false;
    }

    function getTrialEndTime() {
      const existingEnd = Number(dataStore.getItem(trialEndKey));
      if (Number.isFinite(existingEnd) && existingEnd > 0) return existingEnd;
      const start = Date.now();
      const end = start + trialDurationMs;
      dataStore.setItem(trialStartKey, String(start));
      dataStore.setItem(trialEndKey, String(end));
      return end;
    }

    function formatCountdown(ms) {
      const totalSeconds = Math.max(0, Math.floor(ms / 1000));
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    }

    function setTrialExpired() {
      $('trialPopup').classList.remove('hidden');
      document.querySelector('.trial-modal').classList.add('expired');
      $('trialTitle').textContent = 'Trial expired';
      $('trialMessage').textContent = 'Your trial period has ended. Please pay $99 to continue using our service.';
      $('trialCountdown').textContent = 'Expired';
      $('trialOkBtn').classList.add('hidden');
      $('loginScreen').classList.add('hidden');
      document.querySelector('.app-shell').classList.add('hidden');
    }

    function updateTrialPopup() {
      const remaining = getTrialEndTime() - Date.now();
      if (remaining <= 0) {
        if (trialTimer) clearInterval(trialTimer);
        setTrialExpired();
        return;
      }
      document.querySelector('.trial-modal').classList.remove('expired');
      $('trialTitle').textContent = 'Free trial notice';
      $('trialMessage').textContent = 'Only 5 days left for the free trial, pay $99 now to unlock permanently.';
      $('trialCountdown').textContent = `Time remaining: ${formatCountdown(remaining)}`;
    }

    function initTrial() {
      updateTrialPopup();
      trialTimer = setInterval(updateTrialPopup, 1000);
    }

    function normalizeTemplate(template = {}) {
      const canKeepText = Number(template.templateVersion || 0) >= 3;
      if (!canKeepText) return structuredClone(defaultTemplate);
      const oldMeta = template.textStyles?.meta || {};
      return {
        ...defaultTemplate,
        ...template,
        examGapLines: Math.min(10, Math.max(1, Number(template.examGapLines || defaultTemplate.examGapLines))),
        textStyles: {
          ...structuredClone(defaultTextStyles),
          subject: { ...defaultTextStyles.subject, ...oldMeta, ...(template.textStyles?.subject || {}) },
          duration: { ...defaultTextStyles.duration, ...oldMeta, ...(template.textStyles?.duration || {}) },
          instruction: { ...defaultTextStyles.instruction, ...oldMeta, ...(template.textStyles?.instruction || {}) },
          ...(template.textStyles || {})
        },
        templateVersion: 4
      };
    }

    function normalizeSettings(settings = {}) {
      const totalExams = Math.max(1, Number(settings.totalExams || defaultSettings.totalExams));
      const selectedExamNo = Math.min(totalExams, Math.max(1, Number(settings.selectedExamNo || defaultSettings.selectedExamNo)));
      return { totalExams, selectedExamNo, currentUserId: null };
    }

    function normalizeQuestions(questions) {
      return questions.map((question) => ({
        ...question,
        examNo: undefined
      }));
    }

    function normalizeSavedExams(savedExams = {}) {
      return Object.fromEntries(Object.entries(savedExams || {}).map(([examNo, questions]) => [
        String(Math.max(1, Number(examNo || 1))),
        Array.isArray(questions) ? questions.map((q) => ({ ...q, examNo: undefined })) : []
      ]));
    }

    function normalizeDiplomaStudents(students = []) {
      return Array.isArray(students) ? students.map((student) => ({
        id: student.id || crypto.randomUUID(),
        fullName: student.fullName || '',
        birthDate: student.birthDate || '',
        rank: student.rank || '',
        position: student.position || '',
        unit: student.unit || '',
        startDate: student.startDate || '',
        graduationDate: student.graduationDate || '',
        diplomaType: student.diplomaType || '',
        photo: student.photo || ''
      })) : [];
    }

    function normalizeDiplomaTemplate(template = {}) {
      const merged = {
        ...structuredClone(defaultDiplomaTemplate),
        ...(template || {}),
        fields: {
          ...structuredClone(defaultDiplomaTemplate.fields),
          ...((template || {}).fields || {})
        },
        templateVersion: 1
      };
      diplomaFields.forEach(([key]) => {
        merged.fields[key] = {
          ...structuredClone(defaultDiplomaTemplate.fields[key]),
          ...(merged.fields[key] || {}),
          visible: merged.fields[key]?.visible !== false
        };
      });
      return merged;
    }

    function examNumberOptions(selected) {
      const total = Math.max(1, Number(state.settings?.totalExams || defaultSettings.totalExams));
      return Array.from({ length: total }, (_, index) => {
        const number = index + 1;
        return `<option value="${number}" ${Number(selected) === number ? 'selected' : ''}>Đề số ${formatExamNo(number)}</option>`;
      }).join('');
    }

    function formatExamNo(examNo) {
      const number = Number(examNo);
      const safeNumber = Number.isFinite(number) && number > 0 ? number : 1;
      return String(Math.trunc(safeNumber)).padStart(2, '0');
    }

    function examKey(examNo) {
      return String(Math.max(1, Math.trunc(Number(examNo || 1))));
    }

    function getSavedExam(examNo) {
      state.savedExams = normalizeSavedExams(state.savedExams);
      return state.savedExams[examKey(examNo)] || [];
    }

    function setSavedExam(examNo, questions) {
      state.savedExams = normalizeSavedExams(state.savedExams);
      state.savedExams[examKey(examNo)] = questions.map((q) => ({ ...q, examNo: undefined }));
    }

    function examForPreview(examNo) {
      const saved = getSavedExam(examNo);
      return saved.map((q) => ({ ...q, examNo: Number(examNo), categoryName: q.categoryName || categoryName(q.categoryId) }));
    }

    function examTitle(title, examNo) {
      const base = String(title || 'DE THI SO').replace(/\s*\d+\s*$/, '').replace(/\s*[:：]\s*$/, '');
      return `${base}: ${formatExamNo(examNo)}`;
    }

    function getTextStyle(key) {
      state.template.textStyles = {
        ...structuredClone(defaultTextStyles),
        ...(state.template.textStyles || {})
      };
      return state.template.textStyles[key] || defaultTextStyles[key];
    }

    function styleAttr(key) {
      const style = getTextStyle(key);
      return [
        `font-family: '${style.font}', serif`,
        `font-size: ${Number(style.size || 14)}pt`,
        `font-weight: ${style.bold ? '700' : '400'}`,
        `text-align: ${style.align || 'left'}`
      ].join('; ');
    }

    function categoryName(id) {
      return state.categories.find((cat) => cat.id === id)?.name || 'Chưa có mục';
    }

    function renderAll() {
      const preservedFilter = $('filterCategory')?.value || '';
      const preservedQuery = $('searchQuestion')?.value || '';
      renderAuthState();
      renderDashboard();
      renderAccounts();
      renderCategoryOptions();
      if ($('filterCategory')) $('filterCategory').value = preservedFilter;
      if ($('searchQuestion')) $('searchQuestion').value = preservedQuery;
      renderExamControls();
      renderQuestions();
      renderCategories();
      renderSpecs();
      fillTemplateForm();
      renderExamPreview();
      renderDiplomaAll();
      saveState();
    }

    function renderAuthState() {
      const user = currentUser();
      const loggedIn = Boolean(user);
      $('loginScreen').classList.toggle('hidden', loggedIn);
      $('moduleScreen').classList.toggle('hidden', !loggedIn || Boolean(activeModule));
      document.querySelector('.app-shell').classList.toggle('hidden', !loggedIn || activeModule !== 'exam');
      $('diplomaShell').classList.toggle('hidden', !loggedIn || activeModule !== 'diploma');
      if (!loggedIn) return;
      $('moduleUserName').textContent = user.fullName || user.username;
      $('currentUserName').textContent = user.fullName || user.username;
      $('diplomaUserName').textContent = user.fullName || user.username;
      $('currentUserRole').textContent = user.role === 'admin' ? 'Quyền: Quản trị' : 'Quyền: Người dùng';
      document.querySelectorAll('[data-admin-only]').forEach((el) => el.classList.toggle('hidden', !isAdmin()));
    }

    function renderDashboard() {
      if (!$('statCategories')) return;
      $('statCategories').textContent = state.categories.length;
      $('statQuestions').textContent = state.questions.length;
      $('statExams').textContent = state.settings.totalExams;
      $('statAccounts').textContent = state.accounts.length;
      const user = currentUser();
      $('profileSummary').innerHTML = user ? `
        <div class="row-item">
          <div class="row-title"><strong>${escapeHtml(user.fullName)}</strong><span class="pill">${user.role === 'admin' ? 'Quản trị' : 'Người dùng'}</span></div>
          <div class="meta">Ngày sinh: ${escapeHtml(user.birthDate || 'Chưa cập nhật')}</div>
          <div class="meta">Cấp bậc: ${escapeHtml(user.rank || 'Chưa cập nhật')}</div>
          <div class="meta">Chức vụ: ${escapeHtml(user.position || 'Chưa cập nhật')}</div>
          <div class="meta">Đơn vị: ${escapeHtml(user.unit || 'Chưa cập nhật')}</div>
        </div>
      ` : '';
      $('categorySummary').innerHTML = state.categories.map((cat) => {
        const count = state.questions.filter((q) => q.categoryId === cat.id).length;
        return `<div class="row-item"><div class="row-title"><strong>${escapeHtml(cat.name)}</strong><span class="pill">${count} câu</span></div></div>`;
      }).join('') || '<div class="empty">Chưa có mục câu hỏi.</div>';
    }

    function renderAccounts() {
      if (!$('accountList')) return;
      $('accountList').innerHTML = state.accounts.map((account) => `
        <div class="row-item">
          <div class="row-title">
            <strong>${escapeHtml(account.fullName || account.username)}</strong>
            <span class="actions">
              <button class="secondary icon" title="Sửa" onclick="editAccount('${account.id}')">✎</button>
              <button class="danger icon" title="Xóa" onclick="deleteAccount('${account.id}')">×</button>
            </span>
          </div>
          <div class="meta">
            <span class="pill">${escapeHtml(account.username)}</span>
            <span class="pill">${account.role === 'admin' ? 'Quản trị' : 'Người dùng'}</span>
          </div>
          <div class="meta">${escapeHtml([account.rank, account.position, account.unit].filter(Boolean).join(' - ') || 'Chưa cập nhật thông tin')}</div>
        </div>
      `).join('');
    }

    function renderCategoryOptions() {
      const options = state.categories.map((cat) => `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`).join('');
      $('questionCategory').innerHTML = options;
      $('filterCategory').innerHTML = `<option value="">Tất cả mục</option>${options}`;
    }

    function renderExamControls() {
      state.settings = normalizeSettings(state.settings);
      $('totalExamCount').value = state.settings.totalExams;
      $('selectedExamNo').innerHTML = examNumberOptions(state.settings.selectedExamNo);
    }

    function renderQuestions() {
      const filter = $('filterCategory').value;
      const query = $('searchQuestion').value.trim().toLowerCase();
      const questions = state.questions.filter((q) => {
        const byCategory = !filter || q.categoryId === filter;
        const byText = !query || q.text.toLowerCase().includes(query) || categoryName(q.categoryId).toLowerCase().includes(query);
        return byCategory && byText;
      });

      $('questionList').innerHTML = questions.length ? questions.map((q) => `
        <div class="row-item">
          <div class="row-title">
            <strong>${escapeHtml(q.text)}</strong>
            <span class="actions">
              <button class="secondary icon" title="Sửa" onclick="editQuestion('${q.id}')">✎</button>
              <button class="danger icon" title="Xóa" onclick="deleteQuestion('${q.id}')">×</button>
            </span>
          </div>
          <div class="meta">
            <span class="pill">${escapeHtml(categoryName(q.categoryId))}</span>
            <span class="pill">${Number(q.points || 0)} điểm</span>
          </div>
          ${q.answer ? `<div class="meta">Đáp án: ${escapeHtml(q.answer)}</div>` : ''}
        </div>
      `).join('') : '<div class="empty">Chưa có câu hỏi nào phù hợp.</div>';
    }

    function renderCategories() {
      $('categoryList').innerHTML = state.categories.map((cat) => {
        const count = state.questions.filter((q) => q.categoryId === cat.id).length;
        return `
          <div class="row-item">
            <div class="row-title">
              <strong>${escapeHtml(cat.name)}</strong>
              <span class="actions">
                <button class="secondary icon" title="Đổi tên" onclick="renameCategory('${cat.id}')">✎</button>
                <button class="danger icon" title="Xóa" onclick="deleteCategory('${cat.id}')">×</button>
              </span>
            </div>
            <div class="meta">${count} câu hỏi</div>
          </div>
        `;
      }).join('');
    }

    function renderSpecs() {
      if (!state.specs.length && state.categories.length) {
        state.specs.push({ categoryId: state.categories[0].id, count: 1 });
      }
      $('specList').innerHTML = state.specs.map((spec, index) => {
        const options = state.categories.map((cat) => `<option value="${cat.id}" ${cat.id === spec.categoryId ? 'selected' : ''}>${escapeHtml(cat.name)}</option>`).join('');
        return `
          <div class="spec-row">
            <label>Mục
              <select onchange="updateSpec(${index}, 'categoryId', this.value)">${options}</select>
            </label>
            <label>Số câu
              <input type="number" min="0" value="${Number(spec.count || 0)}" onchange="updateSpec(${index}, 'count', this.value)">
            </label>
            <button class="danger icon" title="Xóa mục" onclick="removeSpec(${index})">×</button>
          </div>
        `;
      }).join('');
      const total = state.specs.reduce((sum, spec) => sum + Number(spec.count || 0), 0);
      $('generatorHint').textContent = `Đang tạo đề số ${formatExamNo(state.settings.selectedExamNo)}. Tổng số câu sẽ lấy: ${total}. Phần mềm lấy ngẫu nhiên từ ngân hàng câu hỏi chung theo từng mục.`;
    }

    function syncPreviewCopies() {
      const exam = $('examPreview');
      const template = $('templatePreview');
      if (exam && template) template.innerHTML = exam.innerHTML;
    }

    function fitPreviewHeaders() {
      document.querySelectorAll('#examPreview .exam-head > div, #templatePreview .exam-head > div').forEach((el) => {
        const original = Number.parseFloat(el.style.fontSize) || 14;
        let size = original;
        el.style.fontSize = `${size}pt`;
        while (el.scrollWidth > el.clientWidth && size > 10) {
          size -= 0.5;
          el.style.fontSize = `${size}pt`;
        }
      });
    }

    function fillTemplateForm() {
      const t = state.template;
      $('tplLeftHeader').value = t.leftHeader;
      $('tplCenterHeader').value = t.centerHeader;
      $('tplRightHeader').value = t.rightHeader;
      $('tplTitle').value = t.title;
      $('tplSubject').value = t.subject;
      $('tplDuration').value = t.duration;
      $('tplCode').value = t.code;
      $('tplStudentLine').value = t.studentLine;
      $('tplInstruction').value = t.instruction;
      $('tplNumberStyle').value = t.numberStyle;
      $('tplAnswerSpace').value = t.answerSpace;
      $('tplExamGapLines').value = t.examGapLines;
      fillStyleControls();
    }

    function readTemplateForm() {
      state.template = {
        ...state.template,
        leftHeader: $('tplLeftHeader').value,
        centerHeader: $('tplCenterHeader').value,
        rightHeader: $('tplRightHeader').value,
        title: $('tplTitle').value,
        subject: $('tplSubject').value,
        duration: $('tplDuration').value,
        code: $('tplCode').value,
        studentLine: $('tplStudentLine').value,
        instruction: $('tplInstruction').value,
        numberStyle: $('tplNumberStyle').value,
        answerSpace: $('tplAnswerSpace').value,
        examGapLines: Math.min(10, Math.max(1, Number($('tplExamGapLines').value || defaultTemplate.examGapLines))),
        textStyles: {
          ...structuredClone(defaultTextStyles),
          ...(state.template.textStyles || {})
        },
        templateVersion: 4
      };
      saveState();
      renderExamPreview();
    }

    function fillStyleControls() {
      const key = $('styleTarget')?.value || 'headerLeft';
      const style = getTextStyle(key);
      $('styleFont').value = style.font;
      $('styleSize').value = Number(style.size || 14);
      $('styleAlign').value = style.align || 'left';
      $('styleBold').checked = Boolean(style.bold);
    }

    function readStyleControls() {
      const key = $('styleTarget').value;
      state.template.textStyles = {
        ...structuredClone(defaultTextStyles),
        ...(state.template.textStyles || {}),
        [key]: {
          font: $('styleFont').value,
          size: Math.max(8, Math.min(28, Number($('styleSize').value || 14))),
          bold: $('styleBold').checked,
          align: $('styleAlign').value
        }
      };
      readTemplateForm();
    }

    function renderExamPreview() {
      const selectedExamNo = state.settings?.selectedExamNo || 1;
      const firstExamNo = Math.floor((selectedExamNo - 1) / 2) * 2 + 1;
      const halves = [firstExamNo, firstExamNo + 1].map((examNo) => {
        if (examNo > state.settings.totalExams) return '<div class="exam-half empty-half"></div>';
        const questions = examNo === selectedExamNo && state.currentExam.length
          ? state.currentExam
          : examForPreview(examNo);
        return `<div class="exam-half">${buildExamHtml(examNo, buildQuestionsHtml(questions), examWarnings(examNo))}</div>`;
      });

      $('examPreview').innerHTML = halves.join('');
      syncPreviewCopies();
      fitPreviewHeaders();
    }

    function examWarnings(examNo) {
      const warnings = [];
      state.specs.forEach((spec) => {
        const available = state.questions.filter((q) => q.categoryId === spec.categoryId).length;
        if (Number(spec.count) > available) {
          warnings.push(`Đề số ${formatExamNo(examNo)}, mục "${categoryName(spec.categoryId)}" chỉ có ${available}/${spec.count} câu hỏi.`);
        }
      });
      return warnings;
    }

    function buildQuestionsHtml(grouped) {
      const t = state.template;
      return grouped.length ? grouped.map((item, index) => {
        const prefix = t.numberStyle ? `${escapeHtml(t.numberStyle)} ${index + 1}.` : `${index + 1}.`;
        const spaceStyle = t.answerSpace === 'long' ? 'height:120px' : t.answerSpace === 'short' ? 'height:48px' : '';
        const pointText = Number(item.points || 0) > 0 ? ` (${Number(item.points)} điểm)` : '';
        return `
          <div class="question" style="${styleAttr('question')}">
            <strong>${prefix}</strong> ${lineBreaks(item.text)}${escapeHtml(pointText)}
            ${t.answerSpace !== 'none' ? `<div class="answer-space" style="${spaceStyle}"></div>` : ''}
          </div>
        `;
      }).join('') : '<p><em>Chưa tạo đề. Hãy chọn cấu hình và bấm Tạo đề.</em></p>';
    }

    function buildExamHtml(examNo, questionsHtml, warnings = []) {
      const t = state.template;
      return `
        <div class="exam-head ${String(t.centerHeader || '').trim() ? 'three-col' : 'two-col'}">
          <div style="${styleAttr('headerLeft')}">${lineBreaks(t.leftHeader)}</div>
          ${String(t.centerHeader || '').trim() ? `<div class="center-col" style="${styleAttr('headerCenter')}">${lineBreaks(t.centerHeader)}</div>` : ''}
          <div style="${styleAttr('headerRight')}">${lineBreaks(t.rightHeader)}</div>
        </div>
        <div class="exam-title">
          <h1 style="${styleAttr('title')}">${escapeHtml(examTitle(t.title, examNo))}</h1>
          <div style="${styleAttr('subject')}">${escapeHtml(t.subject)}</div>
          <div style="${styleAttr('duration')}">${escapeHtml(t.duration)}</div>
          ${t.instruction ? `<div style="${styleAttr('instruction')}">${lineBreaks(t.instruction)}</div>` : ''}
          ${t.code ? `<div style="${styleAttr('duration')}">${escapeHtml(t.code)}</div>` : ''}
        </div>
        ${t.studentLine ? `<div class="exam-info">${lineBreaks(t.studentLine)}</div>` : ''}
        ${warnings.length ? `<p style="color:#a83636"><strong>Lưu ý:</strong> ${warnings.map(escapeHtml).join(' ')}</p>` : ''}
        ${questionsHtml}
      `;
    }

    function buildExamWordHtml(examNo, questionsHtml, warnings = []) {
      const t = state.template;
      const center = String(t.centerHeader || '').trim();
      const headerCells = center
        ? `
          <td style="width:39%; ${styleAttr('headerLeft')}">${lineBreaks(t.leftHeader)}</td>
          <td style="width:10%; ${styleAttr('headerCenter')}">${lineBreaks(t.centerHeader)}</td>
          <td style="width:51%; ${styleAttr('headerRight')}">${lineBreaks(t.rightHeader)}</td>
        `
        : `
          <td style="width:50%; ${styleAttr('headerLeft')}">${lineBreaks(t.leftHeader)}</td>
          <td style="width:50%; ${styleAttr('headerRight')}">${lineBreaks(t.rightHeader)}</td>
        `;
      return `
        <table class="word-header-table">
          <tr>${headerCells}</tr>
        </table>
        <div class="exam-title">
          <h1 style="${styleAttr('title')}">${escapeHtml(examTitle(t.title, examNo))}</h1>
          <div style="${styleAttr('subject')}">${escapeHtml(t.subject)}</div>
          <div style="${styleAttr('duration')}">${escapeHtml(t.duration)}</div>
          ${t.instruction ? `<div style="${styleAttr('instruction')}">${lineBreaks(t.instruction)}</div>` : ''}
          ${t.code ? `<div style="${styleAttr('duration')}">${escapeHtml(t.code)}</div>` : ''}
        </div>
        ${t.studentLine ? `<div class="exam-info">${lineBreaks(t.studentLine)}</div>` : ''}
        ${warnings.length ? `<p style="color:#a83636"><strong>Lưu ý:</strong> ${warnings.map(escapeHtml).join(' ')}</p>` : ''}
        ${questionsHtml}
      `;
    }

    function shuffle(items) {
      const copy = [...items];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }

    function generateExam() {
      const selectedExamNo = state.settings.selectedExamNo;
      const selected = buildExamQuestions(selectedExamNo);
      state.currentExam = selected.map((q) => ({ ...q, categoryName: categoryName(q.categoryId) }));
      setSavedExam(selectedExamNo, state.currentExam);
      saveState();
      renderExamPreview();
    }

    function saveGeneratedExam() {
      const selectedExamNo = state.settings.selectedExamNo;
      if (!state.currentExam.length) return alert('Chưa có đề để lưu. Hãy bấm Tạo đề trước.');
      setSavedExam(selectedExamNo, state.currentExam);
      saveState();
      renderExamPreview();
      alert(`Đã lưu đề số ${formatExamNo(selectedExamNo)}.`);
    }

    function buildExamQuestions(examNo) {
      const selected = [];
      state.specs.forEach((spec) => {
        const pool = state.questions.filter((q) => q.categoryId === spec.categoryId);
        selected.push(...shuffle(pool).slice(0, Number(spec.count || 0)));
      });
      return selected.map((q) => ({ ...q, examNo: Number(examNo), categoryName: categoryName(q.categoryId) }));
    }

    function buildAllExamPages() {
      const halves = Array.from({ length: state.settings.totalExams }, (_, index) => {
        const examNo = index + 1;
        const questions = buildExamQuestions(examNo);
        const warnings = [];
        state.specs.forEach((spec) => {
          const available = state.questions.filter((q) => q.categoryId === spec.categoryId).length;
          if (Number(spec.count) > available) {
            warnings.push(`Đề số ${formatExamNo(examNo)}, mục "${categoryName(spec.categoryId)}" chỉ có ${available}/${spec.count} câu hỏi.`);
          }
        });
        return `<div class="exam-half">${buildExamHtml(examNo, buildQuestionsHtml(questions), warnings)}</div>`;
      });
      const pages = [];
      for (let i = 0; i < halves.length; i += 2) {
        pages.push(`<div class="exam-paper${i + 2 < halves.length ? ' exam-page-break' : ''}">${halves[i]}${halves[i + 1] || '<div class="exam-half empty-half"></div>'}</div>`);
      }
      return pages.join('');
    }

    function buildAllExamWordPages() {
      const parts = [];
      for (let index = 0; index < state.settings.totalExams; index++) {
        const examNo = index + 1;
        const savedQuestions = examForPreview(examNo);
        const questions = savedQuestions.length ? savedQuestions : buildExamQuestions(examNo);
        const warnings = [];
        state.specs.forEach((spec) => {
          const available = state.questions.filter((q) => q.categoryId === spec.categoryId).length;
          if (Number(spec.count) > available) {
            warnings.push(`Đề số ${formatExamNo(examNo)}, mục "${categoryName(spec.categoryId)}" chỉ có ${available}/${spec.count} câu hỏi.`);
          }
        });
        parts.push(`<div class="word-exam">${buildExamWordHtml(examNo, buildQuestionsHtml(questions), warnings)}</div>`);
        if (examNo < state.settings.totalExams) {
          parts.push(buildWordExamGap());
          if (examNo % 2 === 0) parts.push('<div class="exam-page-break"></div>');
        }
      }
      return parts.join('');
    }

    function buildWordExamGap() {
      const lines = Math.min(10, Math.max(1, Number(state.template.examGapLines || defaultTemplate.examGapLines)));
      return Array.from({ length: lines }, () => `
        <p class="MsoNormal word-gap-line">
          <span style="font-size:14.0pt;mso-fareast-font-family:&quot;Times New Roman&quot;"><o:p>&nbsp;</o:p></span>
        </p>
      `).join('');
    }

    function exportWord() {
      renderExamPreview();
      const content = `<div class="word-exam">${buildExamWordHtml(state.settings.selectedExamNo, buildQuestionsHtml(state.currentExam), [])}</div>`;
      downloadWordDocument(content, `de-thi-${formatExamNo(state.settings.selectedExamNo)}-${new Date().toISOString().slice(0,10)}.doc`);
    }

    function exportAllWord() {
      downloadWordDocument(buildAllExamWordPages(), `tat-ca-de-thi-${new Date().toISOString().slice(0,10)}.doc`);
    }

    function downloadWordDocument(content, filename) {
      const html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8"><title>Đề thi</title>
        <style>
          @page WordSection1 { size: 595.3pt 841.9pt; margin: 14.2pt 38.3pt 32.6pt 38.3pt; }
          div.WordSection1 { page: WordSection1; }
          body { font-family: "Times New Roman", serif; font-size: 14pt; line-height: 1.3; }
          .word-exam { margin: 0; }
          .word-gap-line { margin: 0; font-size: 14pt; line-height: 1.3; }
          .word-header-table { width: 100%; border-collapse: collapse; table-layout: fixed; margin-bottom: 30pt; border: none; }
          .word-header-table td { border: none; vertical-align: top; padding: 0 10pt; white-space: nowrap; }
          .exam-head { display: table; width: 100%; font-weight: bold; text-align: center; margin-bottom: 30pt; font-size: 14pt; }
          .exam-head > div { display: table-cell; vertical-align: top; white-space: nowrap; text-align: center; }
          .exam-head.two-col > div { width: 50%; }
          .exam-head.three-col > div:first-child { width: 39%; }
          .exam-head.three-col > div:nth-child(2) { width: 10%; }
          .exam-head.three-col > div:last-child { width: 51%; }
          .exam-head .center-col { vertical-align: bottom; }
          .exam-title { text-align: center; margin: 0 0 13pt; font-size: 14pt; }
          .exam-title h1 { font-size: 14pt; margin: 0 0 5pt; text-transform: uppercase; }
          .question { margin: 6pt 0; page-break-inside: avoid; font-size: 14pt; }
          .exam-page-break { page-break-after: always; height: 0; line-height: 0; font-size: 0; }
          .answer-space { height: 70px; border-bottom: 1px dotted #888; margin-top: 8px; }
        </style></head><body><div class="WordSection1">${content}</div></body></html>
      `;
      downloadBlob(html, filename, 'application/msword;charset=utf-8');
    }

    function printAllExams() {
      const original = $('examPreview').innerHTML;
      $('examPreview').innerHTML = buildAllExamPages();
      syncPreviewCopies();
      window.print();
      setTimeout(() => {
        $('examPreview').innerHTML = original;
        syncPreviewCopies();
      }, 300);
    }

    function downloadBlob(content, filename, type) {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }

    function clearQuestionForm() {
      $('questionId').value = '';
      $('questionText').value = '';
      $('questionAnswer').value = '';
      $('questionPoints').value = 1;
      $('questionFormTitle').textContent = 'Thêm câu hỏi';
    }

    window.editQuestion = (id) => {
      const q = state.questions.find((item) => item.id === id);
      if (!q) return;
      $('questionId').value = q.id;
      $('questionCategory').value = q.categoryId;
      $('questionText').value = q.text;
      $('questionAnswer').value = q.answer || '';
      $('questionPoints').value = q.points || 1;
      $('questionFormTitle').textContent = 'Sửa câu hỏi';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.deleteQuestion = (id) => {
      if (!confirm('Xóa câu hỏi này?')) return;
      state.questions = state.questions.filter((q) => q.id !== id);
      state.currentExam = state.currentExam.filter((q) => q.id !== id);
      Object.keys(state.savedExams || {}).forEach((examNo) => {
        state.savedExams[examNo] = state.savedExams[examNo].filter((q) => q.id !== id);
      });
      renderAll();
    };

    window.renameCategory = (id) => {
      const cat = state.categories.find((item) => item.id === id);
      if (!cat) return;
      const name = prompt('Nhập tên mục mới:', cat.name);
      if (!name?.trim()) return;
      cat.name = name.trim();
      renderAll();
    };

    window.deleteCategory = (id) => {
      const used = state.questions.some((q) => q.categoryId === id);
      if (used && !confirm('Mục này đang có câu hỏi. Xóa mục sẽ xóa luôn các câu hỏi trong mục. Bạn chắc chắn?')) return;
      state.categories = state.categories.filter((cat) => cat.id !== id);
      state.questions = state.questions.filter((q) => q.categoryId !== id);
      state.specs = state.specs.filter((spec) => spec.categoryId !== id);
      Object.keys(state.savedExams || {}).forEach((examNo) => {
        state.savedExams[examNo] = state.savedExams[examNo].filter((q) => q.categoryId !== id);
      });
      renderAll();
    };

    window.updateSpec = (index, key, value) => {
      state.specs[index][key] = key === 'count' ? Math.max(0, Number(value || 0)) : value;
      renderSpecs();
      saveState();
      renderExamPreview();
    };

    window.removeSpec = (index) => {
      state.specs.splice(index, 1);
      renderSpecs();
      saveState();
      renderExamPreview();
    };

    function clearAccountForm() {
      $('accountId').value = '';
      $('accountUsername').value = '';
      $('accountPassword').value = '';
      $('accountRole').value = 'user';
      $('accountFullName').value = '';
      $('accountBirthDate').value = '';
      $('accountRank').value = '';
      $('accountPosition').value = '';
      $('accountUnit').value = '';
      $('accountFormTitle').textContent = 'Thêm tài khoản';
    }

    function formatDisplayDate(value) {
      if (!value) return '';
      const [year, month, day] = String(value).split('-');
      return year && month && day ? `${day}/${month}/${year}` : value;
    }

    function diplomaPaperSize(template = state.diplomaTemplate) {
      const sizes = {
        A0: [84.1, 118.9],
        A3: [29.7, 42],
        A4: [21, 29.7],
        A5: [14.8, 21]
      };
      let [width, height] = template.paperSize === 'custom'
        ? [Number(template.customWidth || 29.7), Number(template.customHeight || 21)]
        : sizes[template.paperSize] || sizes.A4;
      if (template.orientation === 'landscape' && width < height) [width, height] = [height, width];
      if (template.orientation === 'portrait' && width > height) [width, height] = [height, width];
      return { width, height };
    }

    function diplomaStudentValue(student, key) {
      if (key === 'birthDate' || key === 'startDate' || key === 'graduationDate') return formatDisplayDate(student?.[key]);
      return student?.[key] || '';
    }

    function renderDiplomaText(text, student) {
      return escapeHtml(String(text || '').replace(/\{(\w+)\}/g, (_, key) => diplomaStudentValue(student || {}, key)));
    }

    function renderDiplomaCertificate(student = state.diplomaStudents[0] || {}, elementId = '') {
      const template = normalizeDiplomaTemplate(state.diplomaTemplate);
      const paper = diplomaPaperSize(template);
      const fields = diplomaFields.map(([key]) => {
        const field = template.fields[key];
        if (!field?.visible) return '';
        if (key === 'photo') {
          return student.photo ? `<img class="diploma-student-photo" src="${student.photo}" alt="" style="left:${field.x}%; top:${field.y}%; width:${field.size}px;">` : '';
        }
        return `<div class="diploma-field" style="left:${field.x}%; top:${field.y}%; font-family:'${field.font}', serif; font-size:${field.size}pt; color:${field.color}; font-weight:${field.bold ? 700 : 400}; letter-spacing:${Number(field.spacing || 0)}px;">${renderDiplomaText(field.label, student)}</div>`;
      }).join('');
      return `
        <div ${elementId ? `id="${elementId}"` : ''} class="diploma-certificate" style="--paper-width:${paper.width}cm; --paper-height:${paper.height}cm; --border-width:${Number(template.borderWidth || 0)}px; --border-color:${escapeHtml(template.borderColor || '#0f7a66')}">
          ${template.backgroundImage ? `<img class="diploma-bg" src="${template.backgroundImage}" alt="">` : ''}
          ${template.logoImage ? `<img class="diploma-logo" src="${template.logoImage}" alt="">` : ''}
          ${fields}
        </div>
      `;
    }

    function renderDiplomaStudents() {
      $('diplomaStudentList').innerHTML = state.diplomaStudents.map((student) => `
        <div class="row-item">
          <div class="row-title">
            <strong>${escapeHtml(student.fullName || 'Chưa có tên')}</strong>
            <span class="actions">
              <button class="secondary icon" title="Sửa" onclick="editDiplomaStudent('${student.id}')">✎</button>
              <button class="danger icon" title="Xóa" onclick="deleteDiplomaStudent('${student.id}')">×</button>
            </span>
          </div>
          <div class="meta">
            <span class="pill">${escapeHtml(student.rank || 'Chưa cấp bậc')}</span>
            <span class="pill">${escapeHtml(student.diplomaType || 'Chưa loại bằng')}</span>
            <span class="pill">TN: ${escapeHtml(formatDisplayDate(student.graduationDate) || 'Chưa có')}</span>
          </div>
          <div class="meta">${escapeHtml([student.position, student.unit].filter(Boolean).join(' - ') || 'Chưa cập nhật đơn vị')}</div>
        </div>
      `).join('') || '<div class="empty">Chưa có học viên.</div>';
    }

    function clearDiplomaStudentForm() {
      ['diplomaStudentId', 'diplomaFullName', 'diplomaBirthDate', 'diplomaRank', 'diplomaPosition', 'diplomaUnit', 'diplomaStartDate', 'diplomaGraduationDate', 'diplomaType', 'diplomaPhotoData', 'diplomaPhotoFile'].forEach((id) => { $(id).value = ''; });
      $('diplomaStudentFormTitle').textContent = 'Thêm học viên';
    }

    window.editDiplomaStudent = (id) => {
      const student = state.diplomaStudents.find((item) => item.id === id);
      if (!student) return;
      $('diplomaStudentId').value = student.id;
      $('diplomaFullName').value = student.fullName;
      $('diplomaBirthDate').value = student.birthDate;
      $('diplomaRank').value = student.rank;
      $('diplomaPosition').value = student.position;
      $('diplomaUnit').value = student.unit;
      $('diplomaStartDate').value = student.startDate;
      $('diplomaGraduationDate').value = student.graduationDate;
      $('diplomaType').value = student.diplomaType;
      $('diplomaPhotoData').value = student.photo || '';
      $('diplomaStudentFormTitle').textContent = 'Sửa học viên';
    };

    window.deleteDiplomaStudent = (id) => {
      if (!confirm('Xóa học viên này?')) return;
      state.diplomaStudents = state.diplomaStudents.filter((student) => student.id !== id);
      renderDiplomaAll();
      saveState();
    };

    function fillDiplomaTemplateForm() {
      const template = normalizeDiplomaTemplate(state.diplomaTemplate);
      $('diplomaPaperSize').value = template.paperSize;
      $('diplomaOrientation').value = template.orientation;
      $('diplomaCustomWidth').value = template.customWidth;
      $('diplomaCustomHeight').value = template.customHeight;
      $('diplomaBorderWidth').value = template.borderWidth;
      $('diplomaBorderColor').value = template.borderColor;
      $('diplomaFieldTarget').innerHTML = diplomaFields.map(([key, label]) => `<option value="${key}">${label}</option>`).join('');
      fillDiplomaFieldControls();
    }

    function readDiplomaTemplateForm() {
      state.diplomaTemplate = normalizeDiplomaTemplate({
        ...state.diplomaTemplate,
        paperSize: $('diplomaPaperSize').value,
        orientation: $('diplomaOrientation').value,
        customWidth: Math.max(1, Number($('diplomaCustomWidth').value || 29.7)),
        customHeight: Math.max(1, Number($('diplomaCustomHeight').value || 21)),
        borderWidth: Math.max(0, Number($('diplomaBorderWidth').value || 0)),
        borderColor: $('diplomaBorderColor').value
      });
    }

    function fillDiplomaFieldControls() {
      const key = $('diplomaFieldTarget').value || 'title';
      const field = normalizeDiplomaTemplate(state.diplomaTemplate).fields[key];
      $('diplomaFieldSize').max = key === 'photo' ? 500 : 96;
      $('diplomaFieldLabel').value = field.label;
      $('diplomaFieldX').value = field.x;
      $('diplomaFieldY').value = field.y;
      $('diplomaFieldSize').value = field.size;
      $('diplomaFieldSpacing').value = field.spacing;
      $('diplomaFieldFont').value = field.font;
      $('diplomaFieldColor').value = field.color;
      $('diplomaFieldBold').checked = Boolean(field.bold);
      $('diplomaFieldVisible').checked = field.visible !== false;
    }

    function readDiplomaFieldControls() {
      const key = $('diplomaFieldTarget').value || 'title';
      readDiplomaTemplateForm();
      state.diplomaTemplate.fields[key] = {
        ...state.diplomaTemplate.fields[key],
        label: $('diplomaFieldLabel').value,
        x: Math.min(100, Math.max(0, Number($('diplomaFieldX').value || 0))),
        y: Math.min(100, Math.max(0, Number($('diplomaFieldY').value || 0))),
        size: Math.max(6, Math.min(key === 'photo' ? 500 : 96, Number($('diplomaFieldSize').value || 14))),
        spacing: Math.max(0, Math.min(20, Number($('diplomaFieldSpacing').value || 0))),
        font: $('diplomaFieldFont').value,
        color: $('diplomaFieldColor').value,
        bold: $('diplomaFieldBold').checked,
        visible: $('diplomaFieldVisible').checked
      };
      renderDiplomaPreview();
    }

    function renderDiplomaPreview() {
      $('diplomaPreview').outerHTML = renderDiplomaCertificate(state.diplomaStudents[0] || {}, 'diplomaPreview');
    }

    function renderDiplomaAll() {
      state.diplomaStudents = normalizeDiplomaStudents(state.diplomaStudents);
      state.diplomaTemplate = normalizeDiplomaTemplate(state.diplomaTemplate);
      renderDiplomaStudents();
      fillDiplomaTemplateForm();
      renderDiplomaPreview();
    }

    function switchDiplomaView(view) {
      document.querySelectorAll('[data-diploma-view]').forEach((btn) => btn.classList.toggle('active', btn.dataset.diplomaView === view));
      document.querySelectorAll('[id^="diploma-view-"]').forEach((section) => section.classList.add('hidden'));
      $(`diploma-view-${view}`).classList.remove('hidden');
      renderDiplomaPreview();
    }

    function readImageFile(input, callback) {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => callback(reader.result);
      reader.readAsDataURL(file);
    }

    function printAllDiplomas() {
      if (!state.diplomaStudents.length) return alert('Chưa có học viên để in.');
      const paper = diplomaPaperSize(state.diplomaTemplate);
      const pages = state.diplomaStudents.map((student) => `<div class="diploma-print-page">${renderDiplomaCertificate(student)}</div>`).join('');
      const popup = window.open('', '_blank');
      if (!popup) return alert('Trình duyệt đang chặn cửa sổ in.');
      popup.document.write(`
        <html><head><meta charset="utf-8"><title>In văn bằng</title>
        <style>
          @page { size: ${paper.width}cm ${paper.height}cm; margin: 0; }
          body { margin: 0; font-family: "Times New Roman", serif; background: #fff; }
          .diploma-print-page { width: ${paper.width}cm; height: ${paper.height}cm; page-break-after: always; display: grid; place-items: center; }
          .diploma-print-page:last-child { page-break-after: auto; }
          .diploma-certificate { position: relative; width: var(--paper-width); height: var(--paper-height); border: var(--border-width) solid var(--border-color); overflow: hidden; box-sizing: border-box; }
          .diploma-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .9; }
          .diploma-logo { position: absolute; left: 50%; top: 8%; width: 10%; transform: translate(-50%, -50%); object-fit: contain; }
          .diploma-student-photo { position: absolute; transform: translate(-50%, -50%); aspect-ratio: 3 / 4; object-fit: cover; border: 1px solid rgba(0,0,0,.35); background: #fff; }
          .diploma-field { position: absolute; transform: translate(-50%, -50%); white-space: pre-wrap; text-align: center; line-height: 1.2; overflow-wrap: anywhere; }
        </style></head><body>${pages}<script>window.onload=()=>{window.print();};<\/script></body></html>
      `);
      popup.document.close();
    }

    window.editAccount = (id) => {
      if (!requireAdmin()) return;
      const account = state.accounts.find((item) => item.id === id);
      if (!account) return;
      $('accountId').value = account.id;
      $('accountUsername').value = account.username;
      $('accountPassword').value = account.password;
      $('accountRole').value = account.role;
      $('accountFullName').value = account.fullName;
      $('accountBirthDate').value = account.birthDate;
      $('accountRank').value = account.rank;
      $('accountPosition').value = account.position;
      $('accountUnit').value = account.unit;
      $('accountFormTitle').textContent = 'Sửa tài khoản';
    };

    window.deleteAccount = (id) => {
      if (!requireAdmin()) return;
      if (state.accounts.length <= 1) return alert('Phải giữ lại ít nhất một tài khoản.');
      if (id === sessionUserId) return alert('Không thể xóa tài khoản đang đăng nhập.');
      if (!confirm('Xóa tài khoản này?')) return;
      state.accounts = state.accounts.filter((account) => account.id !== id);
      renderAll();
    };

    function switchView(view) {
      if (view === 'accounts' && !isAdmin()) view = 'dashboard';
      document.querySelectorAll('.nav button[data-view]').forEach((btn) => btn.classList.toggle('active', btn.dataset.view === view));
      document.querySelectorAll('main > section').forEach((section) => section.classList.add('hidden'));
      $(`view-${view}`).classList.remove('hidden');
      renderExamPreview();
    }

    function updateTotalExams(value) {
      const totalExams = Math.max(1, Number(value || 1));
      state.settings.totalExams = totalExams;
      state.settings.selectedExamNo = Math.min(totalExams, Math.max(1, Number(state.settings.selectedExamNo || 1)));
      state.questions = normalizeQuestions(state.questions);
      Object.keys(state.savedExams || {}).forEach((examNo) => {
        if (Number(examNo) > totalExams) delete state.savedExams[examNo];
      });
      state.currentExam = examForPreview(state.settings.selectedExamNo);
      renderAll();
    }

    function updateSelectedExamNo(value) {
      state.settings.selectedExamNo = Math.min(state.settings.totalExams, Math.max(1, Number(value || 1)));
      state.currentExam = examForPreview(state.settings.selectedExamNo);
      renderExamControls();
      renderSpecs();
      saveState();
      renderExamPreview();
    }

    document.querySelectorAll('.nav button[data-view]').forEach((button) => {
      button.addEventListener('click', () => {
        switchView(button.dataset.view);
      });
    });

    $('loginForm').addEventListener('submit', (event) => {
      event.preventDefault();
      if (getTrialEndTime() <= Date.now()) {
        setTrialExpired();
        return;
      }
      const username = $('loginUsername').value.trim();
      const password = $('loginPassword').value;
      const account = state.accounts.find((item) => item.username === username && item.password === password);
      if (!account) {
        $('loginError').textContent = 'Tên đăng nhập hoặc mật khẩu không đúng.';
        return;
      }
      $('loginError').textContent = '';
      sessionUserId = account.id;
      activeModule = null;
      renderAll();
    });

    $('trialOkBtn').addEventListener('click', () => {
      if (getTrialEndTime() <= Date.now()) {
        setTrialExpired();
        return;
      }
      $('trialPopup').classList.add('hidden');
    });

    $('logoutBtn').addEventListener('click', () => {
      sessionUserId = null;
      activeModule = null;
      renderAuthState();
    });

    $('moduleLogoutBtn').addEventListener('click', () => {
      sessionUserId = null;
      activeModule = null;
      renderAuthState();
    });

    $('openExamManager').addEventListener('click', () => {
      activeModule = 'exam';
      renderAuthState();
      switchView('dashboard');
    });

    $('openDiplomaManager').addEventListener('click', () => {
      activeModule = 'diploma';
      renderAuthState();
      switchDiplomaView('students');
    });

    $('backToModules').addEventListener('click', () => {
      activeModule = null;
      renderAuthState();
    });

    $('backToModulesFromDiploma').addEventListener('click', () => {
      activeModule = null;
      renderAuthState();
    });

    $('diplomaLogoutBtn').addEventListener('click', () => {
      sessionUserId = null;
      activeModule = null;
      renderAuthState();
    });

    document.querySelectorAll('[data-diploma-view]').forEach((button) => {
      button.addEventListener('click', () => switchDiplomaView(button.dataset.diplomaView));
    });

    $('diplomaStudentForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const payload = {
        id: $('diplomaStudentId').value || crypto.randomUUID(),
        fullName: $('diplomaFullName').value.trim(),
        birthDate: $('diplomaBirthDate').value,
        rank: $('diplomaRank').value.trim(),
        position: $('diplomaPosition').value.trim(),
        unit: $('diplomaUnit').value.trim(),
        startDate: $('diplomaStartDate').value,
        graduationDate: $('diplomaGraduationDate').value,
        diplomaType: $('diplomaType').value.trim(),
        photo: $('diplomaPhotoData').value
      };
      if (!payload.fullName) return;
      const index = state.diplomaStudents.findIndex((student) => student.id === payload.id);
      if (index >= 0) state.diplomaStudents[index] = payload;
      else state.diplomaStudents.push(payload);
      clearDiplomaStudentForm();
      renderDiplomaAll();
      saveState();
    });
    $('clearDiplomaStudentForm').addEventListener('click', clearDiplomaStudentForm);
    $('cancelEditDiplomaStudent').addEventListener('click', clearDiplomaStudentForm);
    $('diplomaPhotoFile').addEventListener('change', (event) => readImageFile(event.target, (dataUrl) => {
      $('diplomaPhotoData').value = dataUrl;
    }));

    $('saveDiplomaTemplate').addEventListener('click', () => {
      readDiplomaFieldControls();
      saveState();
      alert('Đã lưu mẫu văn bằng.');
    });

    ['diplomaPaperSize', 'diplomaOrientation', 'diplomaCustomWidth', 'diplomaCustomHeight', 'diplomaBorderWidth', 'diplomaBorderColor'].forEach((id) => {
      $(id).addEventListener('input', () => { readDiplomaTemplateForm(); renderDiplomaPreview(); });
      $(id).addEventListener('change', () => { readDiplomaTemplateForm(); renderDiplomaPreview(); });
    });
    $('diplomaFieldTarget').addEventListener('change', fillDiplomaFieldControls);
    ['diplomaFieldLabel', 'diplomaFieldX', 'diplomaFieldY', 'diplomaFieldSize', 'diplomaFieldSpacing', 'diplomaFieldFont', 'diplomaFieldColor', 'diplomaFieldBold', 'diplomaFieldVisible'].forEach((id) => {
      $(id).addEventListener('input', readDiplomaFieldControls);
      $(id).addEventListener('change', readDiplomaFieldControls);
    });
    $('diplomaBgFile').addEventListener('change', (event) => readImageFile(event.target, (dataUrl) => {
      state.diplomaTemplate.backgroundImage = dataUrl;
      renderDiplomaPreview();
      saveState();
    }));
    $('diplomaLogoFile').addEventListener('change', (event) => readImageFile(event.target, (dataUrl) => {
      state.diplomaTemplate.logoImage = dataUrl;
      renderDiplomaPreview();
      saveState();
    }));
    $('printAllDiplomas').addEventListener('click', printAllDiplomas);

    $('questionForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const payload = {
        id: $('questionId').value || crypto.randomUUID(),
        categoryId: $('questionCategory').value,
        text: $('questionText').value.trim(),
        answer: $('questionAnswer').value.trim(),
        points: Number($('questionPoints').value || 0)
      };
      if (!payload.text) return;
      const existing = state.questions.findIndex((q) => q.id === payload.id);
      if (existing >= 0) state.questions[existing] = payload;
      else state.questions.push(payload);
      clearQuestionForm();
      renderAll();
    });

    $('clearQuestionForm').addEventListener('click', clearQuestionForm);
    $('cancelEditQuestion').addEventListener('click', clearQuestionForm);
    $('filterCategory').addEventListener('change', renderQuestions);
    $('searchQuestion').addEventListener('input', renderQuestions);
    $('totalExamCount').addEventListener('change', (event) => updateTotalExams(event.target.value));
    $('selectedExamNo').addEventListener('change', (event) => updateSelectedExamNo(event.target.value));

    $('categoryForm').addEventListener('submit', (event) => {
      event.preventDefault();
      if (!requireAdmin()) return;
      const name = $('categoryName').value.trim();
      if (!name) return;
      state.categories.push({ id: crypto.randomUUID(), name });
      $('categoryName').value = '';
      renderAll();
    });

    $('addSpec').addEventListener('click', () => {
      if (!state.categories.length) return alert('Hãy thêm ít nhất một mục câu hỏi trước.');
      state.specs.push({ categoryId: state.categories[0].id, count: 1 });
      renderSpecs();
      saveState();
    });

    $('generateExam').addEventListener('click', generateExam);
    $('saveGeneratedExam').addEventListener('click', saveGeneratedExam);
    $('exportWord').addEventListener('click', exportWord);
    $('exportAllWord').addEventListener('click', exportAllWord);
    $('printExam').addEventListener('click', () => {
      renderExamPreview();
      window.print();
    });
    $('printAllExam').addEventListener('click', printAllExams);
    $('saveTemplate').addEventListener('click', () => {
      readTemplateForm();
      alert('Đã lưu form đề thi.');
    });
    $('resetTemplate').addEventListener('click', () => {
      if (!requireAdmin()) return;
      state.template = { ...defaultTemplate };
      renderAll();
    });

    $('accountForm').addEventListener('submit', (event) => {
      event.preventDefault();
      if (!requireAdmin()) return;
      const id = $('accountId').value || crypto.randomUUID();
      const username = $('accountUsername').value.trim();
      const duplicate = state.accounts.some((account) => account.username === username && account.id !== id);
      if (duplicate) return alert('Tên đăng nhập đã tồn tại.');
      const payload = {
        id,
        username,
        password: $('accountPassword').value,
        role: $('accountRole').value,
        fullName: $('accountFullName').value.trim(),
        birthDate: $('accountBirthDate').value,
        rank: $('accountRank').value.trim(),
        position: $('accountPosition').value.trim(),
        unit: $('accountUnit').value.trim()
      };
      const index = state.accounts.findIndex((account) => account.id === id);
      if (index >= 0) state.accounts[index] = payload;
      else state.accounts.push(payload);
      clearAccountForm();
      renderAll();
    });
    $('clearAccountForm').addEventListener('click', clearAccountForm);
    $('cancelEditAccount').addEventListener('click', clearAccountForm);

    $('backupData').addEventListener('click', () => {
      downloadBlob(JSON.stringify(state, null, 2), `sao-luu-de-thi-${new Date().toISOString().slice(0,10)}.json`, 'application/json;charset=utf-8');
    });

    $('restoreData').addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const imported = JSON.parse(reader.result);
          state = {
            categories: imported.categories || [],
            questions: normalizeQuestions(imported.questions || []),
            specs: imported.specs || [],
            template: normalizeTemplate(imported.template),
            settings: normalizeSettings(imported.settings),
            accounts: normalizeAccounts(imported.accounts),
            currentExam: imported.currentExam || [],
            savedExams: normalizeSavedExams(imported.savedExams),
            diplomaStudents: normalizeDiplomaStudents(imported.diplomaStudents),
            diplomaTemplate: normalizeDiplomaTemplate(imported.diplomaTemplate)
          };
          renderAll();
          alert('Đã khôi phục dữ liệu.');
        } catch {
          alert('File sao lưu không hợp lệ.');
        }
      };
      reader.readAsText(file);
    });

    $('resetAll').addEventListener('click', () => {
      if (!requireAdmin()) return;
      if (!confirm('Xóa tất cả dữ liệu và quay về dữ liệu mẫu?')) return;
      dataStore.clear();
      state = structuredClone(sampleData);
      renderAll();
    });

    $('styleTarget').addEventListener('change', fillStyleControls);
    ['styleFont', 'styleSize', 'styleAlign', 'styleBold'].forEach((id) => {
      $(id).addEventListener('input', readStyleControls);
      $(id).addEventListener('change', readStyleControls);
    });

    initTrial();
    renderAll();


