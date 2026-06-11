const dataStore = window.ExamStorage;
    let sessionUserId = null;
    let activeModule = null;
    let questionBankSetSelected = false;
    let diplomaCourseSelected = false;
    let examTemplateSelected = false;
    let answerTemplateSelected = false;
    let examPreviewPage = 1;
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

    const defaultAnswerTextStyles = {
      headerLeft: { font: 'Times New Roman', size: 14, bold: true, align: 'center' },
      headerRight: { font: 'Times New Roman', size: 14, bold: true, align: 'center' },
      title: { font: 'Times New Roman', size: 14, bold: true, align: 'center' },
      question: { font: 'Times New Roman', size: 14, bold: false, align: 'left' }
    };

    const defaultAnswerTemplate = {
      leftHeader: 'TRƯỜNG TCKT CÔNG BINH\nHỘI ĐỒNG THI CẤP CHỨNG CHỈ\nRÀ PHÁ BOM MÌN, VẬT NỔ\n---------\nNăm 2026',
      rightHeader: 'ĐỀ THI CẤP CHỨNG CHỈ RPBN, VN\nMÔN THI: THỰC HÀNH TỔNG HỢP\nĐỐI TƯỢNG: KỸ THUẬT VIÊN RPBM, VN',
      title: 'ĐỀ THI SỐ',
      numberStyle: 'Câu',
      examGapLines: 2,
      textStyles: structuredClone(defaultAnswerTextStyles),
      templateVersion: 1
    };

    const baseDiplomaFields = [
      ['title', 'Tiêu đề'],
      ['fullName', 'Họ và tên'],
      ['birthDate', 'Ngày sinh'],
      ['rank', 'Cấp bậc'],
      ['position', 'Chức vụ'],
      ['unit', 'Đơn vị'],
      ['startDate', 'Ngày nhập học'],
      ['graduationDate', 'Ngày tốt nghiệp'],
      ['diplomaType', 'Loại bằng']
    ];

    const defaultDiplomaTemplate = {
      customWidth: 29.7,
      customHeight: 21,
      pdfData: '',
      pdfName: '',
      fields: {
        title: { label: 'VĂN BẰNG', x: 50, y: 22, size: 30, font: 'Times New Roman', color: '#0f513f', bold: true, spacing: 2, visible: true },
        fullName: { label: '{fullName}', x: 50, y: 42, size: 24, font: 'Times New Roman', color: '#111111', bold: true, spacing: 0, visible: true },
        birthDate: { label: 'Ngày sinh: {birthDate}', x: 50, y: 50, size: 14, font: 'Times New Roman', color: '#111111', bold: false, spacing: 0, visible: true },
        rank: { label: 'Cấp bậc: {rank}', x: 32, y: 58, size: 14, font: 'Times New Roman', color: '#111111', bold: false, spacing: 0, visible: true },
        position: { label: 'Chức vụ: {position}', x: 68, y: 58, size: 14, font: 'Times New Roman', color: '#111111', bold: false, spacing: 0, visible: true },
        unit: { label: 'Đơn vị: {unit}', x: 50, y: 66, size: 14, font: 'Times New Roman', color: '#111111', bold: false, spacing: 0, visible: true },
        startDate: { label: 'Ngày nhập học: {startDate}', x: 32, y: 74, size: 13, font: 'Times New Roman', color: '#111111', bold: false, spacing: 0, visible: true },
        graduationDate: { label: 'Ngày tốt nghiệp: {graduationDate}', x: 68, y: 74, size: 13, font: 'Times New Roman', color: '#111111', bold: false, spacing: 0, visible: true },
        diplomaType: { label: 'Loại bằng: {diplomaType}', x: 50, y: 82, size: 15, font: 'Times New Roman', color: '#111111', bold: true, spacing: 0, visible: true }
      },
      fieldMeta: Object.fromEntries(baseDiplomaFields.map(([key, label]) => [key, { label, builtin: true }])),
      templateVersion: 2
    };

    const diplomaFontSizes = [8, 9, 10, 11, 12, 13, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 44, 48, 56, 64, 72, 84, 96];

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
      activeExamSetId: 'default-set',
      activeExamTemplateId: 'default-template',
      examSets: [],
      examTemplates: [],
      accounts: structuredClone(defaultAccounts),
      currentExam: [],
      savedExams: {},
      answerTemplate: structuredClone(defaultAnswerTemplate),
      diplomaStudents: [],
      diplomaCourses: [{ id: 'default-diploma-course', name: 'Khóa mặc định' }],
      activeDiplomaCourseId: 'default-diploma-course',
      diplomaExportCourseId: 'default-diploma-course',
      diplomaExportStudentIds: [],
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
    sampleData.examSets = [
      {
        id: 'default-set',
        name: 'Bộ đề mặc định',
        specs: structuredClone(sampleData.specs),
        settings: structuredClone(sampleData.settings),
        currentExam: [],
        savedExams: {}
      }
    ];
    sampleData.examTemplates = [
      {
        id: 'default-template',
        name: 'Form mặc định',
        template: structuredClone(sampleData.template)
      }
    ];

    let state = loadState();

    const $ = (id) => document.getElementById(id);
    const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));
    const lineBreaks = (value) => escapeHtml(value).replace(/\n/g, '<br>');

    function loadState() {
      const raw = dataStore.load();
      if (!raw) {
        const fresh = structuredClone(sampleData);
        applyActiveTemplateToState(fresh);
        applyActiveExamSetToState(fresh);
        return fresh;
      }
      try {
        const parsed = JSON.parse(raw);
        const template = normalizeTemplate(parsed.template);
        const settings = normalizeSettings(parsed.settings);
        const loaded = {
          categories: normalizeCategories(parsed.categories?.length ? parsed.categories : structuredClone(sampleData.categories)),
          questions: normalizeQuestions(parsed.questions || []),
          specs: parsed.specs || [],
          template,
          settings,
          activeExamSetId: parsed.activeExamSetId || parsed.examSets?.[0]?.id || 'default-set',
          activeExamTemplateId: parsed.activeExamTemplateId || parsed.examTemplates?.[0]?.id || 'default-template',
          examSets: normalizeExamSets(parsed.examSets, parsed),
          examTemplates: normalizeExamTemplates(parsed.examTemplates, parsed),
          accounts: normalizeAccounts(parsed.accounts),
          currentExam: parsed.currentExam || [],
          savedExams: normalizeSavedExams(parsed.savedExams),
          answerTemplate: normalizeAnswerTemplate(parsed.answerTemplate),
          diplomaCourses: normalizeDiplomaCourses(parsed.diplomaCourses),
          activeDiplomaCourseId: parsed.activeDiplomaCourseId || parsed.diplomaCourses?.[0]?.id || 'default-diploma-course',
          diplomaExportCourseId: parsed.diplomaExportCourseId || parsed.activeDiplomaCourseId || parsed.diplomaCourses?.[0]?.id || 'default-diploma-course',
          diplomaExportStudentIds: Array.isArray(parsed.diplomaExportStudentIds) ? parsed.diplomaExportStudentIds : [],
          diplomaStudents: normalizeDiplomaStudents(parsed.diplomaStudents, parsed.activeDiplomaCourseId || 'default-diploma-course'),
          diplomaTemplate: normalizeDiplomaTemplate(parsed.diplomaTemplate)
        };
        applyActiveTemplateToState(loaded);
        applyActiveExamSetToState(loaded);
        return loaded;
      } catch {
        const fallback = structuredClone(sampleData);
        applyActiveExamSetToState(fallback);
        return fallback;
      }
    }

    function saveState() {
      syncActiveTemplateFromState();
      syncActiveExamSetFromState();
      const currentUserId = state.settings.currentUserId;
      state.settings.currentUserId = null;
      dataStore.save(state);
      state.settings.currentUserId = currentUserId;
    }

    function normalizeExamSets(examSets = [], legacy = {}) {
      const source = Array.isArray(examSets) && examSets.length ? examSets : [{
        id: 'default-set',
        name: 'Bộ đề mặc định',
        specs: legacy.specs || [],
        settings: legacy.settings || defaultSettings,
        currentExam: legacy.currentExam || [],
        savedExams: legacy.savedExams || {}
      }];
      return source.map((set, index) => ({
        id: set.id || crypto.randomUUID(),
        name: set.name || `Bộ đề ${index + 1}`,
        specs: Array.isArray(set.specs) ? set.specs : [],
        settings: normalizeSettings(set.settings || defaultSettings),
        currentExam: Array.isArray(set.currentExam) ? normalizeQuestions(set.currentExam) : [],
        savedExams: normalizeSavedExams(set.savedExams)
      }));
    }

    function normalizeExamTemplates(examTemplates = [], legacy = {}) {
      const source = Array.isArray(examTemplates) && examTemplates.length ? examTemplates : [{
        id: 'default-template',
        name: 'Form mặc định',
        template: legacy.template || defaultTemplate
      }];
      return source.map((item, index) => ({
        id: item.id || crypto.randomUUID(),
        name: item.name || `Form đề thi ${index + 1}`,
        template: normalizeTemplate(item.template || legacy.template || defaultTemplate)
      }));
    }

    function activeExamTemplate(targetState = state) {
      targetState.examTemplates = normalizeExamTemplates(targetState.examTemplates, targetState);
      let item = targetState.examTemplates.find((template) => template.id === targetState.activeExamTemplateId);
      if (!item) {
        item = targetState.examTemplates[0];
        targetState.activeExamTemplateId = item.id;
      }
      return item;
    }

    function applyActiveTemplateToState(targetState = state) {
      const item = activeExamTemplate(targetState);
      targetState.template = normalizeTemplate(item.template || defaultTemplate);
    }

    function syncActiveTemplateFromState() {
      const item = activeExamTemplate();
      item.template = normalizeTemplate(state.template || defaultTemplate);
    }

    function activeExamSet(targetState = state) {
      targetState.examSets = normalizeExamSets(targetState.examSets, targetState);
      let set = targetState.examSets.find((item) => item.id === targetState.activeExamSetId);
      if (!set) {
        set = targetState.examSets[0];
        targetState.activeExamSetId = set.id;
      }
      return set;
    }

    function applyActiveExamSetToState(targetState = state) {
      const set = activeExamSet(targetState);
      targetState.specs = structuredClone(set.specs || []);
      targetState.settings = normalizeSettings(set.settings || defaultSettings);
      targetState.currentExam = normalizeQuestions(set.currentExam || []);
      targetState.savedExams = normalizeSavedExams(set.savedExams);
    }

    function syncActiveExamSetFromState() {
      const set = activeExamSet();
      set.specs = structuredClone(state.specs || []);
      set.settings = normalizeSettings(state.settings || defaultSettings);
      set.currentExam = normalizeQuestions(state.currentExam || []);
      set.savedExams = normalizeSavedExams(state.savedExams);
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

    function normalizeAnswerTemplate(template = {}) {
      return {
        ...structuredClone(defaultAnswerTemplate),
        ...(template || {}),
        examGapLines: Math.min(10, Math.max(1, Number(template.examGapLines || defaultAnswerTemplate.examGapLines))),
        textStyles: {
          ...structuredClone(defaultAnswerTextStyles),
          ...((template || {}).textStyles || {})
        },
        templateVersion: 1
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
        examSetId: question.examSetId || 'default-set',
        examNo: undefined
      }));
    }

    function normalizeCategories(categories = []) {
      return categories.map((category) => ({
        ...category,
        examSetId: category.examSetId || 'default-set'
      }));
    }

    function normalizeSavedExams(savedExams = {}) {
      return Object.fromEntries(Object.entries(savedExams || {}).map(([examNo, questions]) => [
        String(Math.max(1, Number(examNo || 1))),
        Array.isArray(questions) ? questions.map((q) => ({ ...q, examNo: undefined })) : []
      ]));
    }

    function normalizeDiplomaCourses(courses = []) {
      const source = Array.isArray(courses) && courses.length ? courses : [{ id: 'default-diploma-course', name: 'Khóa mặc định' }];
      return source.map((course, index) => ({
        id: course.id || crypto.randomUUID(),
        name: course.name || `Khóa học viên ${index + 1}`
      }));
    }

    function activeDiplomaCourse(targetState = state) {
      targetState.diplomaCourses = normalizeDiplomaCourses(targetState.diplomaCourses);
      let course = targetState.diplomaCourses.find((item) => item.id === targetState.activeDiplomaCourseId);
      if (!course) {
        course = targetState.diplomaCourses[0];
        targetState.activeDiplomaCourseId = course.id;
      }
      return course;
    }

    function diplomaExportCourse(targetState = state) {
      targetState.diplomaCourses = normalizeDiplomaCourses(targetState.diplomaCourses);
      let course = targetState.diplomaCourses.find((item) => item.id === targetState.diplomaExportCourseId);
      if (!course) {
        course = targetState.diplomaCourses[0];
        targetState.diplomaExportCourseId = course.id;
      }
      return course;
    }

    function normalizeDiplomaStudents(students = [], fallbackCourseId = 'default-diploma-course') {
      return Array.isArray(students) ? students.map((student) => ({
        id: student.id || crypto.randomUUID(),
        courseId: student.courseId || fallbackCourseId,
        fullName: student.fullName || '',
        birthDate: student.birthDate || '',
        rank: student.rank || '',
        position: student.position || '',
        unit: student.unit || '',
        startDate: student.startDate || '',
        graduationDate: student.graduationDate || '',
        diplomaType: student.diplomaType || '',
        extraFields: { ...(student.extraFields || {}) },
        extraFieldLabels: { ...(student.extraFieldLabels || {}) }
      })) : [];
    }

    function normalizeDiplomaTemplate(template = {}) {
      const legacyFields = (template || {}).fields || {};
      const fieldMeta = {
        ...structuredClone(defaultDiplomaTemplate.fieldMeta),
        ...((template || {}).fieldMeta || {})
      };
      const merged = {
        ...structuredClone(defaultDiplomaTemplate),
        ...(template || {}),
        customWidth: Math.max(1, Number(template?.customWidth || template?.pdfWidth || defaultDiplomaTemplate.customWidth)),
        customHeight: Math.max(1, Number(template?.customHeight || template?.pdfHeight || defaultDiplomaTemplate.customHeight)),
        pdfData: template?.pdfData || '',
        pdfName: template?.pdfName || '',
        fields: {
          ...structuredClone(defaultDiplomaTemplate.fields),
          ...legacyFields
        },
        fieldMeta,
        templateVersion: 2
      };
      Object.keys(merged.fields).forEach((key) => {
        const fallback = defaultDiplomaTemplate.fields[key] || defaultDiplomaTemplate.fields.fullName;
        merged.fields[key] = {
          ...structuredClone(fallback),
          ...(merged.fields[key] || {}),
          visible: merged.fields[key]?.visible !== false
        };
        merged.fieldMeta[key] = {
          label: merged.fieldMeta[key]?.label || baseDiplomaFields.find(([fieldKey]) => fieldKey === key)?.[1] || key,
          builtin: Boolean(merged.fieldMeta[key]?.builtin || baseDiplomaFields.some(([fieldKey]) => fieldKey === key))
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
      return saved.map((q) => {
        const latest = state.questions.find((item) => item.id === q.id);
        const merged = latest ? { ...q, ...latest } : q;
        return { ...merged, examNo: Number(examNo), categoryName: categoryName(merged.categoryId) };
      });
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

    function getAnswerTextStyle(key) {
      state.answerTemplate = normalizeAnswerTemplate(state.answerTemplate);
      return state.answerTemplate.textStyles[key] || defaultAnswerTextStyles[key];
    }

    function answerStyleAttr(key) {
      const style = getAnswerTextStyle(key);
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

    function currentCategories() {
      const setId = activeExamSet().id;
      return state.categories.filter((cat) => (cat.examSetId || 'default-set') === setId);
    }

    function currentQuestions() {
      const setId = activeExamSet().id;
      return state.questions.filter((question) => (question.examSetId || 'default-set') === setId);
    }

    function renderAll() {
      const preservedFilter = $('filterCategory')?.value || '';
      const preservedQuery = $('searchQuestion')?.value || '';
      renderAuthState();
      renderDashboard();
      renderAccounts();
      renderExamSets();
      renderQuestionExamSetButtons();
      renderExamTemplateButtons();
      renderAnswerTemplateButtons();
      renderCategoryOptions();
      if ($('filterCategory')) $('filterCategory').value = preservedFilter;
      if ($('searchQuestion')) $('searchQuestion').value = preservedQuery;
      renderExamControls();
      renderQuestions();
      renderCategories();
      renderSpecs();
      fillTemplateForm();
      renderExamPreview();
      fillAnswerTemplateForm();
      renderAnswerPreview();
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
      $('accountShell').classList.toggle('hidden', !loggedIn || activeModule !== 'accounts');
      if (!loggedIn) return;
      $('moduleUserName').textContent = user.fullName || user.username;
      $('currentUserName').textContent = user.fullName || user.username;
      $('diplomaUserName').textContent = user.fullName || user.username;
      $('accountUserName').textContent = user.fullName || user.username;
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
      const options = currentCategories().map((cat) => `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`).join('');
      $('questionCategory').innerHTML = options;
      $('filterCategory').innerHTML = `<option value="">Tất cả mục</option>${options}`;
    }

    function renderExamControls() {
      state.settings = normalizeSettings(state.settings);
      $('totalExamCount').value = state.settings.totalExams;
      $('selectedExamNo').innerHTML = examNumberOptions(state.settings.selectedExamNo);
    }

    function renderExamSets() {
      if (!$('examSetSelect')) return;
      state.examSets = normalizeExamSets(state.examSets, state);
      const set = activeExamSet();
      $('examSetSelect').innerHTML = state.examSets.map((item) => `<option value="${item.id}" ${item.id === set.id ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('');
    }

    function renderExamTemplateButtons() {
      if (!$('examTemplateButtons')) return;
      state.examTemplates = normalizeExamTemplates(state.examTemplates, state);
      const activeId = activeExamTemplate().id;
      $('examTemplateButtons').innerHTML = state.examTemplates.map((item) => `
        <button type="button" class="${item.id === activeId && examTemplateSelected ? '' : 'secondary'}" onclick="openExamTemplate('${item.id}')">
          ${escapeHtml(item.name)}
        </button>
      `).join('');
      $('templateEditorPanel').classList.toggle('hidden', !examTemplateSelected);
      $('templateActions').classList.toggle('hidden', !examTemplateSelected);
    }

    function renderAnswerTemplateButtons() {
      if (!$('answerTemplateButtons')) return;
      state.examTemplates = normalizeExamTemplates(state.examTemplates, state);
      const activeId = activeExamTemplate().id;
      $('answerTemplateButtons').innerHTML = state.examTemplates.map((item) => `
        <button type="button" class="${item.id === activeId && answerTemplateSelected ? '' : 'secondary'}" onclick="openAnswerTemplate('${item.id}')">
          ${escapeHtml(item.name)}
        </button>
      `).join('');
      $('answerTemplateEditorPanel').classList.toggle('hidden', !answerTemplateSelected);
      $('answerTemplateActions').classList.toggle('hidden', !answerTemplateSelected);
    }

    function renderQuestionExamSetButtons() {
      if (!$('questionExamSetButtons')) return;
      const activeId = activeExamSet().id;
      $('questionExamSetButtons').innerHTML = state.examSets.map((set) => `
        <button type="button" class="${set.id === activeId && questionBankSetSelected ? '' : 'secondary'}" onclick="openQuestionBankForSet('${set.id}')">
          ${escapeHtml(set.name)}
        </button>
      `).join('');
      $('questionBankPanel').classList.toggle('hidden', !questionBankSetSelected);
    }

    function renderQuestions() {
      const filter = $('filterCategory').value;
      const query = $('searchQuestion').value.trim().toLowerCase();
      const questions = currentQuestions().filter((q) => {
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
      $('categoryList').innerHTML = currentCategories().map((cat) => {
        const count = currentQuestions().filter((q) => q.categoryId === cat.id).length;
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
      const categories = currentCategories();
      if (!state.specs.length && categories.length) {
        state.specs.push({ categoryId: categories[0].id, count: 1 });
      }
      $('specList').innerHTML = state.specs.map((spec, index) => {
        const options = categories.map((cat) => `<option value="${cat.id}" ${cat.id === spec.categoryId ? 'selected' : ''}>${escapeHtml(cat.name)}</option>`).join('');
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
      $('generatorHint').textContent = `Mỗi lần bấm Tạo đề sẽ tạo đủ ${state.settings.totalExams} đề trong "${activeExamSet().name}". Đang xem đề số ${formatExamNo(state.settings.selectedExamNo)}. Mỗi đề sẽ lấy: ${total} câu.`;
    }

    function syncPreviewCopies() {
      const exam = $('examPreview');
      const template = $('templatePreview');
      if (exam && template) template.innerHTML = exam.innerHTML;
    }

    function fitPreviewHeaders() {
      document.querySelectorAll('#examPreview .exam-head > div, #templatePreview .exam-head > div, #answerPreview .answer-head > div').forEach((el) => {
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
      state.template = normalizeTemplate(state.template);
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
      syncActiveTemplateFromState();
      saveState();
      renderExamPreview();
      renderAnswerPreview();
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

    function syncAnswerTemplateFromExamTemplate() {
      state.template = normalizeTemplate(state.template);
      state.answerTemplate = normalizeAnswerTemplate({
        ...state.answerTemplate,
        leftHeader: state.template.leftHeader,
        rightHeader: state.template.rightHeader,
        title: state.template.title
      });
    }

    function fillAnswerTemplateForm() {
      if (!$('ansTplLeftHeader')) return;
      syncAnswerTemplateFromExamTemplate();
      state.answerTemplate = normalizeAnswerTemplate(state.answerTemplate);
      const t = state.answerTemplate;
      $('ansTplLeftHeader').value = t.leftHeader;
      $('ansTplRightHeader').value = t.rightHeader;
      $('ansTplTitle').value = t.title;
      $('ansTplNumberStyle').value = t.numberStyle;
      $('ansTplExamGapLines').value = t.examGapLines;
      fillAnswerStyleControls();
    }

    function readAnswerTemplateForm() {
      syncAnswerTemplateFromExamTemplate();
      state.answerTemplate = normalizeAnswerTemplate({
        ...state.answerTemplate,
        numberStyle: $('ansTplNumberStyle').value,
        examGapLines: Math.min(10, Math.max(1, Number($('ansTplExamGapLines').value || defaultAnswerTemplate.examGapLines))),
        textStyles: {
          ...structuredClone(defaultAnswerTextStyles),
          ...(state.answerTemplate.textStyles || {})
        }
      });
      syncAnswerTemplateFromExamTemplate();
      fillAnswerTemplateForm();
      saveState();
      renderAnswerPreview();
    }

    function fillAnswerStyleControls() {
      if (!$('answerStyleTarget')) return;
      const key = $('answerStyleTarget').value || 'headerLeft';
      const style = getAnswerTextStyle(key);
      $('answerStyleFont').value = style.font;
      $('answerStyleSize').value = Number(style.size || 14);
      $('answerStyleAlign').value = style.align || 'left';
      $('answerStyleBold').checked = Boolean(style.bold);
    }

    function readAnswerStyleControls() {
      const key = $('answerStyleTarget').value;
      state.answerTemplate.textStyles = {
        ...structuredClone(defaultAnswerTextStyles),
        ...(state.answerTemplate.textStyles || {}),
        [key]: {
          font: $('answerStyleFont').value,
          size: Math.max(8, Math.min(28, Number($('answerStyleSize').value || 14))),
          bold: $('answerStyleBold').checked,
          align: $('answerStyleAlign').value
        }
      };
      readAnswerTemplateForm();
    }

    function renderAnswerPreview() {
      if (!$('answerPreview')) return;
      syncAnswerTemplateFromExamTemplate();
      $('answerPreview').innerHTML = buildAllAnswersHtml(false);
      fitPreviewHeaders();
    }

    function renderExamPreview() {
      examPreviewPage = clampExamPreviewPage(examPreviewPage);
      const firstExamNo = (examPreviewPage - 1) * 2 + 1;
      const halves = [firstExamNo, firstExamNo + 1].map((examNo) => {
        if (examNo > state.settings.totalExams) return '<div class="exam-half empty-half"></div>';
        const questions = examForPreview(examNo);
        return `<div class="exam-half">${buildExamHtml(examNo, buildQuestionsHtml(questions), examWarnings(examNo))}</div>`;
      });

      $('examPreview').innerHTML = halves.join('');
      renderExamPreviewPager();
      syncPreviewCopies();
      fitPreviewHeaders();
    }

    function examPreviewTotalPages() {
      return Math.max(1, Math.ceil(Number(state.settings?.totalExams || 1) / 2));
    }

    function clampExamPreviewPage(page) {
      return Math.min(examPreviewTotalPages(), Math.max(1, Number(page || 1)));
    }

    function renderExamPreviewPager() {
      if (!$('previewPageLabel')) return;
      const totalPages = examPreviewTotalPages();
      examPreviewPage = clampExamPreviewPage(examPreviewPage);
      $('previewPageLabel').textContent = `Trang ${examPreviewPage} / ${totalPages}`;
      $('prevPreviewPage').disabled = examPreviewPage <= 1;
      $('nextPreviewPage').disabled = examPreviewPage >= totalPages;
    }

    function changeExamPreviewPage(delta) {
      examPreviewPage = clampExamPreviewPage(examPreviewPage + delta);
      state.settings.selectedExamNo = Math.min(state.settings.totalExams, (examPreviewPage - 1) * 2 + 1);
      state.currentExam = examForPreview(state.settings.selectedExamNo);
      renderExamControls();
      saveState();
      renderExamPreview();
    }

    function examWarnings(examNo) {
      const warnings = [];
      state.specs.forEach((spec) => {
        const available = currentQuestions().filter((q) => q.categoryId === spec.categoryId).length;
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
      generateAllExams();
      saveState();
      renderExamPreview();
      renderAnswerPreview();
      alert(`Đã tạo ${state.settings.totalExams} đề.`);
    }

    function saveGeneratedExam() {
      const selectedExamNo = state.settings.selectedExamNo;
      const hasAnyExam = Object.keys(state.savedExams || {}).some((examNo) => {
        const number = Number(examNo);
        return number >= 1 && number <= state.settings.totalExams && getSavedExam(number).length;
      });
      if (!hasAnyExam) generateAllExams();
      else {
        for (let examNo = 1; examNo <= state.settings.totalExams; examNo++) {
          if (!getSavedExam(examNo).length) setSavedExam(examNo, buildExamQuestions(examNo));
        }
        state.currentExam = examForPreview(selectedExamNo);
      }
      saveState();
      renderExamPreview();
      renderAnswerPreview();
      alert(`Đã lưu ${state.settings.totalExams} đề.`);
    }

    function generateAllExams() {
      for (let examNo = 1; examNo <= state.settings.totalExams; examNo++) {
        setSavedExam(examNo, buildExamQuestions(examNo));
      }
      state.currentExam = examForPreview(state.settings.selectedExamNo);
    }

    function buildExamQuestions(examNo) {
      const selected = [];
      state.specs.forEach((spec) => {
        const pool = currentQuestions().filter((q) => q.categoryId === spec.categoryId);
        selected.push(...shuffle(pool).slice(0, Number(spec.count || 0)));
      });
      return selected.map((q) => ({ ...q, examNo: Number(examNo), categoryName: categoryName(q.categoryId) }));
    }

    function questionsForOutput(examNo) {
      const savedQuestions = examForPreview(examNo);
      if (savedQuestions.length) return savedQuestions;
      const generated = buildExamQuestions(examNo);
      setSavedExam(examNo, generated);
      return generated;
    }

    function buildAllExamPages() {
      const halves = Array.from({ length: state.settings.totalExams }, (_, index) => {
        const examNo = index + 1;
        const questions = questionsForOutput(examNo);
        const warnings = [];
        state.specs.forEach((spec) => {
          const available = currentQuestions().filter((q) => q.categoryId === spec.categoryId).length;
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
        const questions = questionsForOutput(examNo);
        const warnings = [];
        state.specs.forEach((spec) => {
          const available = currentQuestions().filter((q) => q.categoryId === spec.categoryId).length;
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

    function answerTitle(title, examNo) {
      const base = String(title || 'DE THI SO').replace(/\s*\d+\s*$/, '').replace(/\s*[:：]\s*$/, '');
      return `${base}: ${formatExamNo(examNo)}`;
    }

    function buildAnswerQuestionsHtml(questions) {
      const t = state.answerTemplate;
      return questions.length ? questions.map((item, index) => {
        const prefix = t.numberStyle ? `${escapeHtml(t.numberStyle)} ${index + 1}:` : `${index + 1}:`;
        const question = String(item.text || '').trim() || 'Chưa có nội dung câu hỏi';
        const answer = String(item.answer || '').trim() || 'Chưa nhập đáp án';
        return `
          <div class="answer-question" style="${answerStyleAttr('question')}">
            <div><strong>${prefix}</strong> ${lineBreaks(question)}</div>
            <div class="answer-content"><strong>Trả lời:</strong> ${lineBreaks(answer)}</div>
          </div>
        `;
      }).join('') : '<p><em>Chưa có câu hỏi trong đề này.</em></p>';
    }

    function buildAnswerHeaderHtml() {
      const t = state.answerTemplate;
      return `
        <div class="answer-head">
          <div style="${answerStyleAttr('headerLeft')}">${lineBreaks(t.leftHeader)}</div>
          <div style="${answerStyleAttr('headerRight')}">${lineBreaks(t.rightHeader)}</div>
        </div>
      `;
    }

    function buildAnswerExamHtml(examNo, questions) {
      const t = state.answerTemplate;
      return `
        <section class="answer-exam">
          <h1 style="${answerStyleAttr('title')}">${escapeHtml(answerTitle(t.title, examNo))}</h1>
          ${buildAnswerQuestionsHtml(questions)}
        </section>
      `;
    }

    function buildAnswerGap() {
      const lines = Math.min(10, Math.max(1, Number(state.answerTemplate.examGapLines || defaultAnswerTemplate.examGapLines)));
      return Array.from({ length: lines }, () => '<div class="answer-gap">&nbsp;</div>').join('');
    }

    function buildAllAnswersHtml(ensureQuestions = true) {
      syncAnswerTemplateFromExamTemplate();
      state.answerTemplate = normalizeAnswerTemplate(state.answerTemplate);
      const parts = [buildAnswerHeaderHtml()];
      for (let index = 0; index < state.settings.totalExams; index++) {
        const examNo = index + 1;
        const questions = ensureQuestions ? questionsForOutput(examNo) : examForPreview(examNo);
        parts.push(buildAnswerExamHtml(examNo, questions));
        if (examNo < state.settings.totalExams) parts.push(buildAnswerGap());
      }
      return parts.join('');
    }

    function buildAllAnswersWordHtml() {
      syncAnswerTemplateFromExamTemplate();
      const t = state.answerTemplate;
      const header = `
        <table class="word-header-table">
          <tr>
            <td style="width:50%; ${answerStyleAttr('headerLeft')}">${lineBreaks(t.leftHeader)}</td>
            <td style="width:50%; ${answerStyleAttr('headerRight')}">${lineBreaks(t.rightHeader)}</td>
          </tr>
        </table>
      `;
      const parts = [header];
      for (let index = 0; index < state.settings.totalExams; index++) {
        const examNo = index + 1;
        parts.push(buildAnswerExamHtml(examNo, questionsForOutput(examNo)));
        if (examNo < state.settings.totalExams) parts.push(buildAnswerGap());
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
      const content = buildAllExamWordPages();
      saveState();
      downloadWordDocument(content, `tat-ca-de-thi-${new Date().toISOString().slice(0,10)}.doc`);
    }

    function exportAllAnswersWord() {
      const content = buildAllAnswersWordHtml();
      saveState();
      const setName = activeExamSet().name.replace(/[\\/:*?"<>|]+/g, '-').trim() || 'bo-de';
      downloadWordDocument(content, `dap-an-${setName}-${new Date().toISOString().slice(0,10)}.doc`);
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
          .answer-head { display: table; width: 100%; font-weight: bold; text-align: center; margin-bottom: 30pt; font-size: 14pt; }
          .answer-head > div { display: table-cell; width: 50%; vertical-align: top; white-space: nowrap; text-align: center; }
          .answer-exam { margin: 0; page-break-inside: avoid; }
          .answer-exam h1 { font-size: 14pt; margin: 12pt 0 8pt; text-transform: uppercase; }
          .answer-question { margin: 6pt 0; page-break-inside: avoid; font-size: 14pt; }
          .answer-content { margin-top: 3pt; padding-left: 10pt; }
          .answer-gap { height: 12pt; line-height: 12pt; font-size: 12pt; }
          .exam-page-break { page-break-after: always; height: 0; line-height: 0; font-size: 0; }
          .answer-space { height: 70px; border-bottom: 1px dotted #888; margin-top: 8px; }
        </style></head><body><div class="WordSection1">${content}</div></body></html>
      `;
      downloadBlob(html, filename, 'application/msword;charset=utf-8');
    }

    function printAllExams() {
      const original = $('examPreview').innerHTML;
      $('examPreview').innerHTML = buildAllExamPages();
      saveState();
      syncPreviewCopies();
      window.print();
      setTimeout(() => {
        $('examPreview').innerHTML = original;
        syncPreviewCopies();
      }, 300);
    }

    function printAllAnswers() {
      const originalExam = $('examPreview').innerHTML;
      $('examPreview').innerHTML = buildAllAnswersHtml(true);
      saveState();
      window.print();
      setTimeout(() => {
        $('examPreview').innerHTML = originalExam;
        syncPreviewCopies();
        renderAnswerPreview();
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
      state.examSets.forEach((set) => {
        set.currentExam = (set.currentExam || []).filter((q) => q.id !== id);
        Object.keys(set.savedExams || {}).forEach((examNo) => {
          set.savedExams[examNo] = set.savedExams[examNo].filter((q) => q.id !== id);
        });
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
      state.examSets.forEach((set) => {
        set.specs = (set.specs || []).filter((spec) => spec.categoryId !== id);
        set.currentExam = (set.currentExam || []).filter((q) => q.categoryId !== id);
        Object.keys(set.savedExams || {}).forEach((examNo) => {
          set.savedExams[examNo] = set.savedExams[examNo].filter((q) => q.categoryId !== id);
        });
      });
      renderAll();
    };

    window.updateSpec = (index, key, value) => {
      state.specs[index][key] = key === 'count' ? Math.max(0, Number(value || 0)) : value;
      renderSpecs();
      saveState();
      renderExamPreview();
      renderAnswerPreview();
    };

    window.removeSpec = (index) => {
      state.specs.splice(index, 1);
      renderSpecs();
      saveState();
      renderExamPreview();
      renderAnswerPreview();
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
      const width = Math.max(1, Number(template.customWidth || 29.7));
      const height = Math.max(1, Number(template.customHeight || 21));
      return { width, height };
    }

    function collectDiplomaStudentInfoFields() {
      const fields = new Map(baseDiplomaFields.map(([key, label]) => [key, { label, builtin: true }]));
      state.diplomaStudents.forEach((student) => {
        Object.keys(student.extraFields || {}).forEach((key) => {
          const label = student.extraFieldLabels?.[key] || state.diplomaTemplate?.fieldMeta?.[key]?.label || key;
          fields.set(key, { label, builtin: false });
        });
      });
      document.querySelectorAll('.student-extra-row').forEach((row) => {
        const key = row.dataset.extraKey;
        const label = row.querySelector('.student-extra-label')?.value.trim() || key;
        if (key) fields.set(key, { label, builtin: false });
      });
      return Array.from(fields.entries()).map(([key, meta]) => [key, meta.label, meta.builtin]);
    }

    function ensureDiplomaTemplateStudentFields() {
      state.diplomaTemplate = normalizeDiplomaTemplate(state.diplomaTemplate);
      collectDiplomaStudentInfoFields().forEach(([key, label, builtin]) => {
        if (!state.diplomaTemplate.fields[key]) {
          state.diplomaTemplate.fields[key] = {
            label: `{${key}}`,
            x: 50,
            y: 50,
            size: 14,
            font: 'Times New Roman',
            color: '#111111',
            bold: false,
            spacing: 0,
            visible: true
          };
        }
        state.diplomaTemplate.fieldMeta[key] = {
          ...(state.diplomaTemplate.fieldMeta[key] || {}),
          label,
          builtin: Boolean(builtin)
        };
      });
    }

    function diplomaFieldEntries(template = state.diplomaTemplate) {
      if (template === state.diplomaTemplate) ensureDiplomaTemplateStudentFields();
      const normalized = normalizeDiplomaTemplate(template);
      const allowed = new Map(collectDiplomaStudentInfoFields().map(([key, label]) => [key, label]));
      return Object.keys(normalized.fields)
        .filter((key) => allowed.has(key))
        .map((key) => [key, normalized.fieldMeta[key]?.label || allowed.get(key) || key]);
    }

    function diplomaFieldSizeOptions(selectedSize) {
      const selected = Math.max(6, Math.min(96, Number(selectedSize || 14)));
      const sizes = [...new Set([...diplomaFontSizes, selected])].sort((a, b) => a - b);
      return sizes.map((size) => `<option value="${size}" ${size === selected ? 'selected' : ''}>${size} pt</option>`).join('');
    }

    function diplomaCustomFieldEntries(template = state.diplomaTemplate) {
      ensureDiplomaTemplateStudentFields();
      const normalized = normalizeDiplomaTemplate(template);
      return collectDiplomaStudentInfoFields()
        .filter(([key, , builtin]) => !builtin)
        .map(([key, label]) => [key, normalized.fieldMeta[key]?.label || label || key]);
    }

    function nextDiplomaStudentExtraKey() {
      const used = new Set([
        ...diplomaCustomFieldEntries().map(([key]) => key),
        ...Array.from(document.querySelectorAll('.student-extra-row')).map((row) => row.dataset.extraKey)
      ]);
      let number = 1;
      let key = `studentInfo${number}`;
      while (used.has(key)) {
        number += 1;
        key = `studentInfo${number}`;
      }
      return { key, label: `Thông tin thêm ${number}` };
    }

    function renderDiplomaStudentExtraFields(values = {}, labels = {}) {
      const rows = diplomaCustomFieldEntries().map(([key, label]) => ({
        key,
        label: labels[key] || label,
        value: values[key] || ''
      }));
      Object.entries(values || {}).forEach(([key, value]) => {
        if (!rows.some((row) => row.key === key)) rows.push({ key, label: labels[key] || key, value });
      });
      $('diplomaStudentExtraFields').innerHTML = rows.map((row) => `
        <div class="student-extra-row" data-extra-key="${escapeHtml(row.key)}">
          <input class="student-extra-label" value="${escapeHtml(row.label)}" placeholder="Tên thông tin">
          <input class="student-extra-value" value="${escapeHtml(row.value)}" placeholder="Giá trị">
          <button class="danger icon" type="button" title="Xóa" onclick="removeDiplomaStudentExtraField(this)">×</button>
        </div>
      `).join('') || '<div class="empty compact">Chưa có thông tin thêm.</div>';
    }

    function readDiplomaStudentExtraData() {
      const extraFields = {};
      const extraFieldLabels = {};
      document.querySelectorAll('.student-extra-row').forEach((row) => {
        const key = row.dataset.extraKey;
        const label = row.querySelector('.student-extra-label')?.value.trim();
        const value = row.querySelector('.student-extra-value')?.value.trim();
        if (!key || (!label && !value)) return;
        extraFields[key] = value || '';
        extraFieldLabels[key] = label || key;
      });
      return { extraFields, extraFieldLabels };
    }

    function readDiplomaStudentExtraFields() {
      return readDiplomaStudentExtraData().extraFields;
    }

    function addDiplomaStudentExtraField() {
      const { key, label } = nextDiplomaStudentExtraKey();
      const empty = $('diplomaStudentExtraFields').querySelector('.empty');
      if (empty) empty.remove();
      $('diplomaStudentExtraFields').insertAdjacentHTML('beforeend', `
        <div class="student-extra-row" data-extra-key="${escapeHtml(key)}">
          <input class="student-extra-label" value="${escapeHtml(label)}" placeholder="Tên thông tin">
          <input class="student-extra-value" placeholder="Giá trị">
          <button class="danger icon" type="button" title="Xóa" onclick="removeDiplomaStudentExtraField(this)">×</button>
        </div>
      `);
    }

    window.removeDiplomaStudentExtraField = (button) => {
      button.closest('.student-extra-row')?.remove();
      if (!$('diplomaStudentExtraFields').children.length) renderDiplomaStudentExtraFields({});
    };

    function currentDiplomaStudents() {
      const courseId = activeDiplomaCourse().id;
      return state.diplomaStudents.filter((student) => student.courseId === courseId);
    }

    function exportDiplomaStudents() {
      const courseId = diplomaExportCourse().id;
      const ids = new Set(state.diplomaExportStudentIds || []);
      return state.diplomaStudents.filter((student) => student.courseId === courseId && ids.has(student.id));
    }

    function diplomaStudentValue(student, key) {
      if (key === 'birthDate' || key === 'startDate' || key === 'graduationDate') return formatDisplayDate(student?.[key]);
      if (student?.extraFields && Object.prototype.hasOwnProperty.call(student.extraFields, key)) return student.extraFields[key] || '';
      return student?.[key] || '';
    }

    function renderDiplomaText(text, student) {
      return escapeHtml(String(text || '').replace(/\{(\w+)\}/g, (_, key) => diplomaStudentValue(student || {}, key)));
    }

    function diplomaFieldDisplayValue(key, field, student) {
      if (key === 'title') return renderDiplomaText(field.label || 'VĂN BẰNG', student);
      return escapeHtml(diplomaStudentValue(student || {}, key));
    }

    function renderDiplomaCertificate(student = currentDiplomaStudents()[0] || {}, elementId = '', options = {}) {
      const template = normalizeDiplomaTemplate(state.diplomaTemplate);
      const paper = diplomaPaperSize(template);
      const fields = diplomaFieldEntries(template).map(([key]) => {
        const field = template.fields[key];
        if (!field?.visible) return '';
        const editableAttrs = options.editable ? ` data-diploma-field="${key}" title="Kéo để di chuyển"` : '';
        return `<div class="diploma-field" ${editableAttrs} style="left:${field.x}%; top:${field.y}%; font-family:'${field.font}', serif; font-size:${field.size}pt; color:${field.color}; font-weight:${field.bold ? 700 : 400}; letter-spacing:${Number(field.spacing || 0)}px;">${diplomaFieldDisplayValue(key, field, student)}</div>`;
      }).join('');
      return `
        <div ${elementId ? `id="${elementId}"` : ''} class="diploma-certificate" style="--paper-width:${paper.width}cm; --paper-height:${paper.height}cm;">
          ${template.pdfData ? `<embed class="diploma-pdf-bg" src="${template.pdfData}" type="application/pdf">` : '<div class="diploma-pdf-empty">Tải lên file PDF mẫu văn bằng</div>'}
          ${fields}
        </div>
      `;
    }

    function renderDiplomaStudents() {
      const students = currentDiplomaStudents();
      $('diplomaStudentList').innerHTML = students.map((student) => `
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
          ${Object.values(student.extraFields || {}).filter(Boolean).length ? `<div class="meta">${escapeHtml(Object.values(student.extraFields || {}).filter(Boolean).join(' - '))}</div>` : ''}
          <div class="meta">${escapeHtml([student.position, student.unit].filter(Boolean).join(' - ') || 'Chưa cập nhật đơn vị')}</div>
        </div>
      `).join('') || '<div class="empty">Chưa có học viên trong khóa này.</div>';
    }

    function clearDiplomaStudentForm() {
      ['diplomaStudentId', 'diplomaFullName', 'diplomaBirthDate', 'diplomaRank', 'diplomaPosition', 'diplomaUnit', 'diplomaStartDate', 'diplomaGraduationDate', 'diplomaType'].forEach((id) => { $(id).value = ''; });
      renderDiplomaStudentExtraFields({});
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
      renderDiplomaStudentExtraFields(student.extraFields || {}, student.extraFieldLabels || {});
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
      $('diplomaPdfWidth').value = Number(template.customWidth || 0).toFixed(2);
      $('diplomaPdfHeight').value = Number(template.customHeight || 0).toFixed(2);
      $('diplomaPdfInfo').textContent = template.pdfName ? `Đang dùng mẫu: ${template.pdfName}` : 'Chưa tải PDF mẫu.';
      const selected = $('diplomaFieldTarget').value;
      $('diplomaFieldTarget').innerHTML = diplomaFieldEntries(template).map(([key, label]) => `<option value="${key}" ${key === selected ? 'selected' : ''}>${escapeHtml(label)}</option>`).join('');
      renderDiplomaAlignOptions();
      fillDiplomaFieldControls();
    }

    function readDiplomaTemplateForm() {
      state.diplomaTemplate = normalizeDiplomaTemplate({
        ...state.diplomaTemplate
      });
    }

    function fillDiplomaFieldControls() {
      const key = $('diplomaFieldTarget').value || 'title';
      const field = normalizeDiplomaTemplate(state.diplomaTemplate).fields[key];
      $('diplomaFieldX').value = field.x;
      $('diplomaFieldY').value = field.y;
      $('diplomaFieldSize').innerHTML = diplomaFieldSizeOptions(field.size);
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
        x: Math.min(100, Math.max(0, Number($('diplomaFieldX').value || 0))),
        y: Math.min(100, Math.max(0, Number($('diplomaFieldY').value || 0))),
        size: Math.max(6, Math.min(96, Number($('diplomaFieldSize').value || 14))),
        spacing: Math.max(0, Math.min(20, Number($('diplomaFieldSpacing').value || 0))),
        font: $('diplomaFieldFont').value,
        color: $('diplomaFieldColor').value,
        bold: $('diplomaFieldBold').checked,
        visible: $('diplomaFieldVisible').checked
      };
      renderDiplomaPreview();
    }

    function renderDiplomaAlignOptions() {
      if (!$('diplomaAlignTarget')) return;
      const currentKey = $('diplomaFieldTarget').value || 'title';
      $('diplomaAlignTarget').innerHTML = diplomaFieldEntries()
        .filter(([key]) => key !== currentKey)
        .map(([key, label]) => `<option value="${key}">${escapeHtml(label)}</option>`)
        .join('');
    }

    function alignDiplomaField(axis) {
      const key = $('diplomaFieldTarget').value || 'title';
      const targetKey = $('diplomaAlignTarget').value;
      if (!targetKey || !state.diplomaTemplate.fields[targetKey]) return;
      readDiplomaFieldControls();
      state.diplomaTemplate.fields[key][axis] = state.diplomaTemplate.fields[targetKey][axis];
      fillDiplomaFieldControls();
      renderDiplomaPreview();
      saveState();
    }

    function centerDiplomaField(axis) {
      const key = $('diplomaFieldTarget').value || 'title';
      readDiplomaFieldControls();
      state.diplomaTemplate.fields[key][axis] = 50;
      fillDiplomaFieldControls();
      renderDiplomaPreview();
      saveState();
    }

    function renderDiplomaPreview() {
      const previewStudents = exportDiplomaStudents();
      const student = previewStudents[0] || currentDiplomaStudents()[0] || {};
      if ($('diplomaDesignerPreview')) {
        $('diplomaDesignerPreview').outerHTML = renderDiplomaCertificate(student, 'diplomaDesignerPreview', { editable: true });
        enableDiplomaFieldDragging('diplomaDesignerPreview');
      }
      if ($('diplomaPreviewWrap')) {
        $('diplomaPreviewWrap').innerHTML = previewStudents.length
          ? previewStudents.map((item, index) => renderDiplomaCertificate(item, index === 0 ? 'diplomaExportPreview' : '')).join('')
          : renderDiplomaCertificate(student, 'diplomaExportPreview');
      }
    }

    function renderDiplomaAll() {
      state.diplomaCourses = normalizeDiplomaCourses(state.diplomaCourses);
      state.diplomaStudents = normalizeDiplomaStudents(state.diplomaStudents);
      state.diplomaTemplate = normalizeDiplomaTemplate(state.diplomaTemplate);
      ensureDiplomaTemplateStudentFields();
      renderDiplomaCourseButtons();
      renderDiplomaStudents();
      if ($('diplomaStudentExtraFields')) {
        const extraData = readDiplomaStudentExtraData();
        renderDiplomaStudentExtraFields(extraData.extraFields, extraData.extraFieldLabels);
      }
      fillDiplomaTemplateForm();
      renderDiplomaExportControls();
      renderDiplomaPreview();
    }

    function renderDiplomaCourseButtons() {
      if (!$('diplomaCourseButtons')) return;
      const activeId = activeDiplomaCourse().id;
      $('diplomaCourseButtons').innerHTML = state.diplomaCourses.map((course) => `
        <button type="button" class="${course.id === activeId && diplomaCourseSelected ? '' : 'secondary'}" onclick="openDiplomaCourse('${course.id}')">
          ${escapeHtml(course.name)}
        </button>
      `).join('');
      $('diplomaStudentPanel').classList.toggle('hidden', !diplomaCourseSelected);
    }

    function renderDiplomaExportControls() {
      if (!$('diplomaExportCourse')) return;
      const course = diplomaExportCourse();
      $('diplomaExportCourse').innerHTML = state.diplomaCourses.map((item) => `<option value="${item.id}" ${item.id === course.id ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('');
      const selected = new Set(state.diplomaExportStudentIds || []);
      const students = state.diplomaStudents.filter((student) => student.courseId === course.id);
      $('diplomaExportStudentList').innerHTML = students.map((student) => `
        <label class="row-item diploma-export-row">
          <input type="checkbox" class="diploma-export-check" value="${student.id}" ${selected.has(student.id) ? 'checked' : ''}>
          <span>
            <strong>${escapeHtml(student.fullName || 'Chưa có tên')}</strong>
            <span class="meta">${escapeHtml([student.rank, student.position, student.unit].filter(Boolean).join(' - ') || 'Chưa cập nhật thông tin')}</span>
            <span class="meta">Sinh: ${escapeHtml(formatDisplayDate(student.birthDate) || 'Chưa có')} · TN: ${escapeHtml(formatDisplayDate(student.graduationDate) || 'Chưa có')} · ${escapeHtml(student.diplomaType || 'Chưa loại bằng')}</span>
          </span>
        </label>
      `).join('') || '<div class="empty">Khóa này chưa có học viên.</div>';
    }

    function selectedDiplomaExportIdsFromDom() {
      return Array.from(document.querySelectorAll('.diploma-export-check:checked')).map((input) => input.value);
    }

    function openDiplomaCourse(id) {
      if (state.activeDiplomaCourseId !== id) {
        clearDiplomaStudentForm();
      }
      state.activeDiplomaCourseId = id;
      diplomaCourseSelected = true;
      renderDiplomaAll();
      saveState();
    }

    window.openDiplomaCourse = openDiplomaCourse;

    function addDiplomaCourse() {
      const name = prompt('Nhập tên khóa học viên:');
      if (!name?.trim()) return;
      const course = { id: crypto.randomUUID(), name: name.trim() };
      state.diplomaCourses.push(course);
      state.activeDiplomaCourseId = course.id;
      state.diplomaExportCourseId = course.id;
      diplomaCourseSelected = true;
      renderDiplomaAll();
      saveState();
    }

    function deleteDiplomaCourse() {
      if (!diplomaCourseSelected) return alert('Hãy chọn khóa học viên cần xóa trước.');
      if (state.diplomaCourses.length <= 1) return alert('Phải giữ lại ít nhất một khóa học viên.');
      const course = activeDiplomaCourse();
      if (!confirm(`Xóa khóa "${course.name}" và toàn bộ học viên trong khóa này?`)) return;
      state.diplomaCourses = state.diplomaCourses.filter((item) => item.id !== course.id);
      state.diplomaStudents = state.diplomaStudents.filter((student) => student.courseId !== course.id);
      state.activeDiplomaCourseId = state.diplomaCourses[0].id;
      state.diplomaExportCourseId = state.diplomaCourses[0].id;
      state.diplomaExportStudentIds = [];
      diplomaCourseSelected = false;
      clearDiplomaStudentForm();
      renderDiplomaAll();
      saveState();
    }

    function parsePdfPageSize(buffer) {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      const limit = Math.min(bytes.length, 1024 * 1024);
      for (let index = 0; index < limit; index += 1) binary += String.fromCharCode(bytes[index]);
      const match = binary.match(/\/MediaBox\s*\[\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*\]/);
      if (!match) return null;
      const widthPt = Number(match[1]);
      const heightPt = Number(match[2]);
      if (!Number.isFinite(widthPt) || !Number.isFinite(heightPt)) return null;
      return { width: widthPt * 2.54 / 72, height: heightPt * 2.54 / 72 };
    }

    function readPdfTemplateFile(input) {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const size = parsePdfPageSize(reader.result);
        const dataReader = new FileReader();
        dataReader.onload = () => {
          state.diplomaTemplate = normalizeDiplomaTemplate({
            ...state.diplomaTemplate,
            pdfData: dataReader.result,
            pdfName: file.name,
            customWidth: size?.width || state.diplomaTemplate.customWidth,
            customHeight: size?.height || state.diplomaTemplate.customHeight
          });
          fillDiplomaTemplateForm();
          renderDiplomaPreview();
          saveState();
          if (!size) alert('Đã tải PDF, nhưng chưa nhận diện được kích thước. Đang giữ kích thước mẫu hiện tại.');
        };
        dataReader.readAsDataURL(file);
      };
      reader.readAsArrayBuffer(file);
    }

    function enableDiplomaFieldDragging(certificateId) {
      const certificate = $(certificateId);
      if (!certificate) return;
      certificate.querySelectorAll('[data-diploma-field]').forEach((fieldNode) => {
        fieldNode.addEventListener('pointerdown', (event) => {
          event.preventDefault();
          const key = fieldNode.dataset.diplomaField;
          certificate.setPointerCapture?.(event.pointerId);
          const rect = certificate.getBoundingClientRect();
          const move = (moveEvent) => {
            const x = Math.min(100, Math.max(0, ((moveEvent.clientX - rect.left) / rect.width) * 100));
            const y = Math.min(100, Math.max(0, ((moveEvent.clientY - rect.top) / rect.height) * 100));
            state.diplomaTemplate.fields[key].x = Number(x.toFixed(2));
            state.diplomaTemplate.fields[key].y = Number(y.toFixed(2));
            fieldNode.style.left = `${x}%`;
            fieldNode.style.top = `${y}%`;
            if ($('diplomaFieldTarget').value === key) {
              $('diplomaFieldX').value = state.diplomaTemplate.fields[key].x;
              $('diplomaFieldY').value = state.diplomaTemplate.fields[key].y;
            }
          };
          const up = () => {
            document.removeEventListener('pointermove', move);
            document.removeEventListener('pointerup', up);
            saveState();
          };
          document.addEventListener('pointermove', move);
          document.addEventListener('pointerup', up, { once: true });
        });
      });
    }

    function switchDiplomaView(view) {
      animateContentSwitch();
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

    function exportDiplomas() {
      const students = exportDiplomaStudents();
      if (!students.length) return alert('Hãy chọn học viên cần xuất và bấm Lưu để xem preview trước.');
      if (!state.diplomaTemplate.pdfData) return alert('Hãy tải lên file PDF mẫu văn bằng trước.');
      const paper = diplomaPaperSize(state.diplomaTemplate);
      const pages = students.map((student) => `<div class="diploma-print-page">${renderDiplomaCertificate(student)}</div>`).join('');
      const popup = window.open('', '_blank');
      if (!popup) return alert('Trình duyệt đang chặn cửa sổ xuất.');
      popup.document.write(`
        <html><head><meta charset="utf-8"><title>Xuất văn bằng</title>
        <style>
          @page { size: ${paper.width}cm ${paper.height}cm; margin: 0; }
          body { margin: 0; font-family: "Times New Roman", serif; background: #fff; }
          .diploma-print-page { width: ${paper.width}cm; height: ${paper.height}cm; page-break-after: always; display: grid; place-items: center; }
          .diploma-print-page:last-child { page-break-after: auto; }
          .diploma-certificate { position: relative; width: var(--paper-width); height: var(--paper-height); overflow: hidden; box-sizing: border-box; background:#fff; }
          .diploma-pdf-bg { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; pointer-events: none; }
          .diploma-pdf-empty { display:none; }
          .diploma-field { position: absolute; transform: translate(-50%, -50%); white-space: pre-wrap; text-align: center; line-height: 1.2; overflow-wrap: anywhere; }
          .export-actions { position: fixed; right: 16px; top: 16px; z-index: 9; display: flex; gap: 8px; }
          .export-actions button { border: 0; border-radius: 8px; padding: 10px 14px; background: #0f766e; color: #fff; font-weight: 700; cursor: pointer; }
          @media print { .export-actions { display: none; } }
        </style></head><body><div class="export-actions"><button onclick="window.print()">Lưu PDF</button></div>${pages}</body></html>
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

    function animateContentSwitch() {
      document.querySelectorAll('.content').forEach((content) => {
        content.classList.remove('is-switching');
        void content.offsetWidth;
        content.classList.add('is-switching');
        setTimeout(() => content.classList.remove('is-switching'), 360);
      });
    }

    function switchView(view) {
      if (view === 'questions') questionBankSetSelected = false;
      if (view === 'template') examTemplateSelected = false;
      if (view === 'answer-template') answerTemplateSelected = false;
      const current = document.querySelector('.app-shell main > section:not(.hidden)');
      if (current) current.classList.add('view-leaving');
      animateContentSwitch();
      document.querySelectorAll('.nav button[data-view]').forEach((btn) => btn.classList.toggle('active', btn.dataset.view === view));
      document.querySelectorAll('.app-shell main > section').forEach((section) => section.classList.add('hidden'));
      $(`view-${view}`).classList.remove('hidden');
      $(`view-${view}`).classList.remove('view-leaving');
      renderQuestionExamSetButtons();
      renderExamTemplateButtons();
      renderAnswerTemplateButtons();
      renderExamPreview();
      renderAnswerPreview();
    }

    function updateTotalExams(value) {
      const totalExams = Math.max(1, Number(value || 1));
      state.settings.totalExams = totalExams;
      state.settings.selectedExamNo = Math.min(totalExams, Math.max(1, Number(state.settings.selectedExamNo || 1)));
      examPreviewPage = clampExamPreviewPage(examPreviewPage);
      state.questions = normalizeQuestions(state.questions);
      Object.keys(state.savedExams || {}).forEach((examNo) => {
        if (Number(examNo) > totalExams) delete state.savedExams[examNo];
      });
      state.currentExam = examForPreview(state.settings.selectedExamNo);
      renderAll();
      renderAnswerPreview();
    }

    function updateSelectedExamNo(value) {
      state.settings.selectedExamNo = Math.min(state.settings.totalExams, Math.max(1, Number(value || 1)));
      examPreviewPage = clampExamPreviewPage(Math.ceil(state.settings.selectedExamNo / 2));
      state.currentExam = examForPreview(state.settings.selectedExamNo);
      renderExamControls();
      renderSpecs();
      saveState();
      renderExamPreview();
      renderAnswerPreview();
    }

    function switchExamSet(id) {
      syncActiveExamSetFromState();
      state.activeExamSetId = id;
      applyActiveExamSetToState();
      renderExamSets();
      renderExamControls();
      renderSpecs();
      renderExamPreview();
      renderAnswerPreview();
      saveState();
    }

    window.openQuestionBankForSet = (id) => {
      questionBankSetSelected = true;
      switchExamSet(id);
      renderQuestionExamSetButtons();
    };

    function switchExamTemplate(id) {
      syncActiveTemplateFromState();
      state.activeExamTemplateId = id;
      applyActiveTemplateToState();
      syncAnswerTemplateFromExamTemplate();
      fillTemplateForm();
      renderExamTemplateButtons();
      renderAnswerTemplateButtons();
      renderExamPreview();
      renderAnswerPreview();
      saveState();
    }

    window.openExamTemplate = (id) => {
      examTemplateSelected = true;
      switchExamTemplate(id);
      renderExamTemplateButtons();
    };

    window.openAnswerTemplate = (id) => {
      answerTemplateSelected = true;
      switchExamTemplate(id);
      fillAnswerTemplateForm();
      renderAnswerTemplateButtons();
    };

    function addExamTemplate() {
      openExamTemplateNameModal();
    }

    function finishAddExamTemplate(name) {
      syncActiveTemplateFromState();
      const number = (state.examTemplates?.length || 0) + 1;
      const item = {
        id: crypto.randomUUID(),
        name: String(name || '').trim() || `Form đề thi ${number}`,
        template: structuredClone(defaultTemplate)
      };
      state.examTemplates.push(item);
      state.activeExamTemplateId = item.id;
      examTemplateSelected = true;
      applyActiveTemplateToState();
      renderAll();
      renderExamTemplateButtons();
    }

    function openExamTemplateNameModal() {
      $('newExamTemplateName').value = '';
      $('examTemplateNameModal').classList.remove('hidden');
      setTimeout(() => $('newExamTemplateName').focus(), 0);
    }

    function closeExamTemplateNameModal() {
      $('examTemplateNameModal').classList.add('hidden');
      $('newExamTemplateName').value = '';
    }

    function deleteExamTemplate() {
      if (!examTemplateSelected) return alert('Hãy chọn form đề thi cần xóa trước.');
      if (state.examTemplates.length <= 1) return alert('Phải giữ lại ít nhất một form đề thi.');
      const item = activeExamTemplate();
      if (!confirm(`Xóa "${item.name}"?`)) return;
      state.examTemplates = state.examTemplates.filter((template) => template.id !== item.id);
      state.activeExamTemplateId = state.examTemplates[0].id;
      examTemplateSelected = false;
      applyActiveTemplateToState();
      renderAll();
    }

    function addExamSet() {
      syncActiveExamSetFromState();
      const number = (state.examSets?.length || 0) + 1;
      const name = String(arguments[0] || '').trim() || `Bộ đề ${number}`;
      const set = {
        id: crypto.randomUUID(),
        name,
        specs: [],
        settings: { ...defaultSettings },
        currentExam: [],
        savedExams: {}
      };
      state.examSets.push(set);
      state.activeExamSetId = set.id;
      applyActiveExamSetToState();
      renderAll();
      return set;
    }

    function addQuestionExamSet() {
      openExamSetNameModal();
    }

    function finishAddQuestionExamSet(name) {
      const set = addExamSet(name);
      questionBankSetSelected = true;
      renderQuestionExamSetButtons();
    }

    function openExamSetNameModal() {
      $('newExamSetName').value = '';
      $('examSetNameModal').classList.remove('hidden');
      setTimeout(() => $('newExamSetName').focus(), 0);
    }

    function closeExamSetNameModal() {
      $('examSetNameModal').classList.add('hidden');
      $('newExamSetName').value = '';
    }

    function deleteExamSet() {
      if (state.examSets.length <= 1) return alert('Phải giữ lại ít nhất một bộ đề.');
      const set = activeExamSet();
      if (!confirm(`Xóa "${set.name}" và toàn bộ đề đã lưu trong bộ này?`)) return;
      state.examSets = state.examSets.filter((item) => item.id !== set.id);
      state.categories = state.categories.filter((cat) => (cat.examSetId || 'default-set') !== set.id);
      state.questions = state.questions.filter((question) => (question.examSetId || 'default-set') !== set.id);
      state.activeExamSetId = state.examSets[0].id;
      questionBankSetSelected = false;
      applyActiveExamSetToState();
      renderAll();
    }

    function deleteQuestionExamSet() {
      if (!questionBankSetSelected) return alert('Hãy chọn bộ đề cần xóa trước.');
      deleteExamSet();
    }

    document.querySelectorAll('.nav button[data-view]').forEach((button) => {
      button.addEventListener('click', () => {
        switchView(button.dataset.view);
      });
    });

    $('loginForm').addEventListener('submit', (event) => {
      event.preventDefault();
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
      diplomaCourseSelected = false;
      switchDiplomaView('students');
    });

    $('openAccountManager').addEventListener('click', () => {
      if (!requireAdmin()) return;
      activeModule = 'accounts';
      renderAuthState();
      $('account-view').classList.remove('hidden');
      renderAccounts();
    });

    $('backToModules').addEventListener('click', () => {
      activeModule = null;
      renderAuthState();
    });

    $('backToModulesFromDiploma').addEventListener('click', () => {
      activeModule = null;
      renderAuthState();
    });

    $('backToModulesFromAccounts').addEventListener('click', () => {
      activeModule = null;
      clearAccountForm();
      renderAuthState();
    });

    $('diplomaLogoutBtn').addEventListener('click', () => {
      sessionUserId = null;
      activeModule = null;
      renderAuthState();
    });

    $('accountLogoutBtn').addEventListener('click', () => {
      sessionUserId = null;
      activeModule = null;
      renderAuthState();
    });

    document.querySelectorAll('[data-diploma-view]').forEach((button) => {
      button.addEventListener('click', () => switchDiplomaView(button.dataset.diplomaView));
    });

    $('diplomaStudentForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const extraData = readDiplomaStudentExtraData();
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
        courseId: activeDiplomaCourse().id,
        extraFields: extraData.extraFields,
        extraFieldLabels: extraData.extraFieldLabels
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
    $('addDiplomaStudentExtraField').addEventListener('click', addDiplomaStudentExtraField);
    $('addDiplomaCourse').addEventListener('click', addDiplomaCourse);
    $('deleteDiplomaCourse').addEventListener('click', deleteDiplomaCourse);

    $('saveDiplomaTemplate').addEventListener('click', () => {
      readDiplomaFieldControls();
      saveState();
      alert('Đã lưu mẫu văn bằng.');
    });

    $('diplomaPdfFile').addEventListener('change', (event) => readPdfTemplateFile(event.target));
    $('diplomaFieldTarget').addEventListener('change', () => {
      renderDiplomaAlignOptions();
      fillDiplomaFieldControls();
    });
    ['diplomaFieldX', 'diplomaFieldY', 'diplomaFieldSize', 'diplomaFieldSpacing', 'diplomaFieldFont', 'diplomaFieldColor', 'diplomaFieldBold', 'diplomaFieldVisible'].forEach((id) => {
      $(id).addEventListener('input', readDiplomaFieldControls);
      $(id).addEventListener('change', readDiplomaFieldControls);
    });
    $('alignDiplomaFieldX').addEventListener('click', () => alignDiplomaField('x'));
    $('alignDiplomaFieldY').addEventListener('click', () => alignDiplomaField('y'));
    $('centerDiplomaFieldX').addEventListener('click', () => centerDiplomaField('x'));
    $('centerDiplomaFieldY').addEventListener('click', () => centerDiplomaField('y'));
    $('diplomaExportCourse').addEventListener('change', (event) => {
      state.diplomaExportCourseId = event.target.value;
      state.diplomaExportStudentIds = [];
      renderDiplomaExportControls();
      renderDiplomaPreview();
      saveState();
    });
    $('selectAllDiplomaExportStudents').addEventListener('click', () => {
      document.querySelectorAll('.diploma-export-check').forEach((input) => { input.checked = true; });
    });
    $('saveDiplomaExportSelection').addEventListener('click', () => {
      state.diplomaExportStudentIds = selectedDiplomaExportIdsFromDom();
      saveState();
      renderDiplomaPreview();
    });
    $('exportDiplomas').addEventListener('click', exportDiplomas);

    $('questionForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const payload = {
        id: $('questionId').value || crypto.randomUUID(),
        examSetId: activeExamSet().id,
        categoryId: $('questionCategory').value,
        text: $('questionText').value.trim(),
        answer: $('questionAnswer').value.trim(),
        points: Number($('questionPoints').value || 0)
      };
      if (!payload.categoryId) return alert('Hãy thêm ít nhất một mục câu hỏi cho bộ đề này trước.');
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
    $('examSetSelect').addEventListener('change', (event) => switchExamSet(event.target.value));
    $('addQuestionExamSet').addEventListener('click', addQuestionExamSet);
    $('deleteQuestionExamSet').addEventListener('click', deleteQuestionExamSet);
    $('addExamTemplate').addEventListener('click', addExamTemplate);
    $('deleteExamTemplate').addEventListener('click', deleteExamTemplate);
    $('examSetNameForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const name = $('newExamSetName').value.trim();
      if (!name) return;
      closeExamSetNameModal();
      finishAddQuestionExamSet(name);
    });
    $('cancelExamSetName').addEventListener('click', closeExamSetNameModal);
    $('examTemplateNameForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const name = $('newExamTemplateName').value.trim();
      if (!name) return;
      closeExamTemplateNameModal();
      finishAddExamTemplate(name);
    });
    $('cancelExamTemplateName').addEventListener('click', closeExamTemplateNameModal);
    $('totalExamCount').addEventListener('change', (event) => updateTotalExams(event.target.value));
    $('selectedExamNo').addEventListener('change', (event) => updateSelectedExamNo(event.target.value));

    $('categoryForm').addEventListener('submit', (event) => {
      event.preventDefault();
      if (!requireAdmin()) return;
      const name = $('categoryName').value.trim();
      if (!name) return;
      state.categories.push({ id: crypto.randomUUID(), examSetId: activeExamSet().id, name });
      $('categoryName').value = '';
      renderAll();
    });

    $('addSpec').addEventListener('click', () => {
      const categories = currentCategories();
      if (!categories.length) return alert('Hãy thêm ít nhất một mục câu hỏi cho bộ đề này trước.');
      state.specs.push({ categoryId: categories[0].id, count: 1 });
      renderSpecs();
      saveState();
      renderAnswerPreview();
    });

    $('generateExam').addEventListener('click', generateExam);
    $('saveGeneratedExam').addEventListener('click', saveGeneratedExam);
    $('prevPreviewPage').addEventListener('click', () => changeExamPreviewPage(-1));
    $('nextPreviewPage').addEventListener('click', () => changeExamPreviewPage(1));
    $('exportWord').addEventListener('click', exportWord);
    $('exportAllWord').addEventListener('click', exportAllWord);
    $('exportAllAnswersWord').addEventListener('click', exportAllAnswersWord);
    ['tplLeftHeader', 'tplCenterHeader', 'tplRightHeader', 'tplTitle', 'tplSubject', 'tplDuration', 'tplCode', 'tplStudentLine', 'tplInstruction', 'tplNumberStyle', 'tplAnswerSpace', 'tplExamGapLines'].forEach((id) => {
      $(id).addEventListener('input', readTemplateForm);
      $(id).addEventListener('change', readTemplateForm);
    });
    $('saveTemplate').addEventListener('click', () => {
      readTemplateForm();
      alert('Đã lưu form đề thi.');
    });
    $('resetTemplate').addEventListener('click', () => {
      if (!requireAdmin()) return;
      state.template = structuredClone(defaultTemplate);
      syncActiveTemplateFromState();
      renderAll();
    });
    $('saveAnswerTemplate').addEventListener('click', () => {
      readAnswerTemplateForm();
      alert('Đã lưu form đáp án.');
    });
    $('resetAnswerTemplate').addEventListener('click', () => {
      if (!requireAdmin()) return;
      state.answerTemplate = structuredClone(defaultAnswerTemplate);
      syncAnswerTemplateFromExamTemplate();
      fillAnswerTemplateForm();
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
            categories: normalizeCategories(imported.categories || []),
            questions: normalizeQuestions(imported.questions || []),
            specs: imported.specs || [],
            template: normalizeTemplate(imported.template),
            settings: normalizeSettings(imported.settings),
            activeExamSetId: imported.activeExamSetId || imported.examSets?.[0]?.id || 'default-set',
            activeExamTemplateId: imported.activeExamTemplateId || imported.examTemplates?.[0]?.id || 'default-template',
            examSets: normalizeExamSets(imported.examSets, imported),
            examTemplates: normalizeExamTemplates(imported.examTemplates, imported),
            accounts: normalizeAccounts(imported.accounts),
            currentExam: imported.currentExam || [],
            savedExams: normalizeSavedExams(imported.savedExams),
            answerTemplate: normalizeAnswerTemplate(imported.answerTemplate),
            diplomaCourses: normalizeDiplomaCourses(imported.diplomaCourses),
            activeDiplomaCourseId: imported.activeDiplomaCourseId || imported.diplomaCourses?.[0]?.id || 'default-diploma-course',
            diplomaExportCourseId: imported.diplomaExportCourseId || imported.activeDiplomaCourseId || imported.diplomaCourses?.[0]?.id || 'default-diploma-course',
            diplomaExportStudentIds: Array.isArray(imported.diplomaExportStudentIds) ? imported.diplomaExportStudentIds : [],
            diplomaStudents: normalizeDiplomaStudents(imported.diplomaStudents, imported.activeDiplomaCourseId || 'default-diploma-course'),
            diplomaTemplate: normalizeDiplomaTemplate(imported.diplomaTemplate)
          };
          applyActiveTemplateToState();
          applyActiveExamSetToState();
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
    ['ansTplNumberStyle', 'ansTplExamGapLines'].forEach((id) => {
      $(id).addEventListener('input', readAnswerTemplateForm);
      $(id).addEventListener('change', readAnswerTemplateForm);
    });
    $('answerStyleTarget').addEventListener('change', fillAnswerStyleControls);
    ['answerStyleFont', 'answerStyleSize', 'answerStyleAlign', 'answerStyleBold'].forEach((id) => {
      $(id).addEventListener('input', readAnswerStyleControls);
      $(id).addEventListener('change', readAnswerStyleControls);
    });

    function initButtonEffects() {
      document.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button || button.disabled) return;

        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        ripple.style.left = `${event.clientX - rect.left}px`;
        ripple.style.top = `${event.clientY - rect.top}px`;
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 620);

        if (!button.closest('.nav') && !button.classList.contains('icon')) {
          button.classList.add('is-loading');
          setTimeout(() => button.classList.remove('is-loading'), 420);
        }
      });
    }

    initButtonEffects();
    renderAll();


