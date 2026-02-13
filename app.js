/**
 * Основная логика приложения YardWords
 * Чистый JavaScript, без зависимостей
 */

// --- Конфигурация ---
const TARGET_LANG = 'en'; // Целевой язык - английский
const INTERFACE_LANG = 'ru';

// --- Словарь (VOCAB) ---
const VOCAB = [
    // 30+ предметов во дворе и на улице
    { en: "fence", ipa: "/fens/", ru: "забор" },
    { en: "gate", ipa: "/ɡeɪt/", ru: "калитка, ворота" },
    { en: "bench", ipa: "/bentʃ/", ru: "скамейка" },
    { en: "swing", ipa: "/swɪŋ/", ru: "качели" },
    { en: "lawn", ipa: "/lɔːn/", ru: "газон" },
    { en: "bush", ipa: "/bʊʃ/", ru: "куст" },
    { en: "tree", ipa: "/triː/", ru: "дерево" },
    { en: "flower", ipa: "/ˈflaʊ.ər/", ru: "цветок" },
    { en: "fountain", ipa: "/ˈfaʊn.tɪn/", ru: "фонтан" },
    { en: "gazebo", ipa: "/ɡəˈziː.boʊ/", ru: "беседка" },
    { en: "grill", ipa: "/ɡrɪl/", ru: "гриль" },
    { en: "barbecue", ipa: "/ˈbɑːr.bə.kjuː/", ru: "мангал, барбекю" },
    { en: "shed", ipa: "/ʃed/", ru: "сарай" },
    { en: "garage", ipa: "/ɡəˈrɑːʒ/", ru: "гараж" },
    { en: "path", ipa: "/pæθ/", ru: "дорожка, тропинка" },
    { en: "lantern", ipa: "/ˈlæn.tɚn/", ru: "фонарь" },
    { en: "mailbox", ipa: "/ˈmeɪl.bɑːks/", ru: "почтовый ящик" },
    { en: "trash can", ipa: "/ˈtræʃ ˌkæn/", ru: "мусорный бак" },
    { en: "hose", ipa: "/hoʊz/", ru: "шланг" },
    { en: "watering can", ipa: "/ˈwɔː.t̬ɚ.ɪŋ ˌkæn/", ru: "лейка" },
    { en: "rake", ipa: "/reɪk/", ru: "грабли" },
    { en: "shovel", ipa: "/ˈʃʌv.əl/", ru: "лопата" },
    { en: "wheelbarrow", ipa: "/ˈwiːlˌbær.oʊ/", ru: "тачка" },
    { en: "pool", ipa: "/puːl/", ru: "бассейн" },
    { en: "playground", ipa: "/ˈpleɪ.ɡraʊnd/", ru: "детская площадка" },
    { en: "slide", ipa: "/slaɪd/", ru: "горка" },
    { en: "sandbox", ipa: "/ˈsænd.bɑːks/", ru: "песочница" },
    { en: "bird", ipa: "/bɜːrd/", ru: "птица" },
    { en: "bird feeder", ipa: "/ˈbɜːrd ˌfiː.dər/", ru: "кормушка" },
    { en: "birdhouse", ipa: "/ˈbɜːrd.haʊs/", ru: "скворечник" },
    { en: "lawn mower", ipa: "/ˈlɔːn ˌmoʊ.ər/", ru: "газонокосилка" },
    { en: "porch", ipa: "/pɔːrtʃ/", ru: "крыльцо, веранда" },
    { en: "patio", ipa: "/ˈpæt.i.oʊ/", ru: "патио, внутренний дворик" },
];

// --- Состояние приложения (State) ---
let state = {
    currentTheme: 'light',
    currentVocab: [...VOCAB], // Текущий отображаемый список слов
    quizMode: 'ru-en', // 'ru-en', 'en-ru', 'mixed'
    quizQuestions: [], // Массив вопросов для текущей сессии
    currentQuestionIndex: 0,
    score: 0,
    totalQuestions: 0,
    selectedOption: null, // Индекс выбранного варианта
    answerSubmitted: false,
    isQuizActive: false,
    mistakes: [], // Слова, на которые ответили неправильно
    originalQuizQuestions: [], // Для сброса
};

// --- DOM Элементы ---
const dom = {
    themeToggle: document.getElementById('theme-toggle'),
    dictSection: document.getElementById('dictionary-section'),
    quizSection: document.getElementById('quiz-section'),
    cardsContainer: document.getElementById('cards-container'),
    searchInput: document.getElementById('search-input'),
    sortAzBtn: document.getElementById('sort-az'),
    sortRandomBtn: document.getElementById('sort-random'),
    goToQuizBtn: document.getElementById('go-to-quiz'),
    backToDictBtns: [
        document.getElementById('back-to-dict-from-result'),
    ],
    quizModeTitle: document.getElementById('quiz-mode-title'),
    scoreDisplay: document.getElementById('score-display'),
    progressBar: document.getElementById('progress-bar'),
    questionWord: document.getElementById('question-word'),
    questionTranslation: document.getElementById('question-translation'),
    optionsContainer: document.getElementById('options-container'),
    nextBtn: document.getElementById('next-btn'),
    resultScreen: document.getElementById('result-screen'),
    quizArea: document.getElementById('quiz-area'),
    resultMessage: document.getElementById('result-message'),
    retryMistakesBtn: document.getElementById('retry-mistakes-btn'),
    playAgainBtn: document.getElementById('play-again-btn'),
};

// --- Инициализация приложения ---
function initApp() {
    loadTheme();
    renderDictionary(state.currentVocab);
    setupEventListeners();
}

// --- Работа с темой ---
function loadTheme() {
    const savedTheme = localStorage.getItem('yardwords-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    state.currentTheme = savedTheme;
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const newTheme = state.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('yardwords-theme', newTheme);
    state.currentTheme = newTheme;
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    dom.themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
}

// --- Функции словаря ---
function renderDictionary(items) {
    if (!dom.cardsContainer) return;
    if (items.length === 0) {
        dom.cardsContainer.innerHTML = '<p class="no-results">Ничего не найдено</p>';
        return;
    }

    dom.cardsContainer.innerHTML = items.map(item => `
        <div class="word-card">
            <span class="target-word">${item.en}</span>
            <span class="ipa">${item.ipa}</span>
            <span class="translation">${item.ru}</span>
            <button class="speak-btn" data-word="${item.en}" data-lang="en-US">🔊 Озвучить</button>
        </div>
    `).join('');

    // Добавляем слушатели на кнопки "Озвучить"
    document.querySelectorAll('.speak-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const word = btn.dataset.word;
            speakText(word, 'en-US');
        });
    });
}

// Web Speech API
function speakText(text, lang) {
    if (!window.speechSynthesis) {
        alert('Ваш браузер не поддерживает синтез речи.');
        return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // Комфортная скорость
    utterance.pitch = 1;
    window.speechSynthesis.cancel(); // Остановить предыдущую речь
    window.speechSynthesis.speak(utterance);
}

// Поиск и сортировка
function filterAndSortDictionary() {
    const searchTerm = dom.searchInput.value.toLowerCase().trim();
    let filtered = VOCAB.filter(item =>
        item.en.toLowerCase().includes(searchTerm) ||
        item.ru.toLowerCase().includes(searchTerm)
    );

    // Применяем текущую сортировку (если не поиск, то по умолчанию AZ, но для UX используем флаг)
    // Для простоты: кнопки сортировки меняют state.currentVocab
    // Этот метод вызывается после изменения search, но сортировку лучше держать в отдельных обработчиках.
    // Поэтому просто фильтруем исходный VOCAB и сортируем по умолчанию A-Z.
    filtered.sort((a, b) => a.en.localeCompare(b.en));
    state.currentVocab = filtered;
    renderDictionary(state.currentVocab);
}

function sortAZ() {
    state.currentVocab = [...state.currentVocab].sort((a, b) => a.en.localeCompare(b.en));
    renderDictionary(state.currentVocab);
}

function sortRandom() {
    state.currentVocab = [...state.currentVocab].sort(() => Math.random() - 0.5);
    renderDictionary(state.currentVocab);
}

// --- Логика Квиза ---
function startQuiz(mode = 'ru-en', questionsList = null) {
    // Переключение секций
    dom.dictSection.classList.remove('active');
    dom.quizSection.classList.add('active');
    dom.resultScreen.classList.add('hidden');
    dom.quizArea.classList.remove('hidden');

    // Сброс состояния квиза
    if (questionsList) {
        // Для повторения ошибок или кастомного списка
        state.quizQuestions = questionsList;
    } else {
        // Генерация новых вопросов из всего словаря
        state.quizQuestions = generateQuestions(VOCAB, mode);
    }

    state.quizMode = mode;
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.totalQuestions = state.quizQuestions.length;
    state.selectedOption = null;
    state.answerSubmitted = false;
    state.isQuizActive = true;
    state.mistakes = [];

    updateQuizHeader();
    renderQuestion();
}

function generateQuestions(vocab, mode) {
    // Перемешиваем и берём все слова (минимум 30)
    const shuffled = [...vocab].sort(() => Math.random() - 0.5);
    return shuffled.map(item => {
        let type;
        if (mode === 'mixed') {
            type = Math.random() < 0.5 ? 'ru-en' : 'en-ru';
        } else {
            type = mode;
        }
        return {
            ...item,
            type: type,
        };
    });
}

function renderQuestion() {
    if (state.currentQuestionIndex >= state.quizQuestions.length) {
        endQuiz();
        return;
    }

    const question = state.quizQuestions[state.currentQuestionIndex];
    const isRuEn = question.type === 'ru-en';

    // Устанавливаем текст вопроса
    dom.questionWord.textContent = isRuEn ? question.ru : question.en;
    dom.questionTranslation.textContent = isRuEn ? question.en : question.ru;

    // Генерация вариантов ответа
    const correctAnswer = isRuEn ? question.en : question.ru;
    const allPossibleAnswers = isRuEn
        ? VOCAB.map(item => item.en) // Все английские слова
        : VOCAB.map(item => item.ru); // Все русские переводы

    // Получаем 3 неправильных уникальных варианта
    let wrongOptions = allPossibleAnswers.filter(ans => ans !== correctAnswer);
    wrongOptions = shuffleArray(wrongOptions).slice(0, 3);

    let options = [...wrongOptions, correctAnswer];
    options = shuffleArray(options); // Финальное перемешивание

    // Отрисовка кнопок
    dom.optionsContainer.innerHTML = options.map((opt, index) => `
        <button class="option-btn" data-option-index="${index}" data-value="${opt}">${opt}</button>
    `).join('');

    // Добавляем слушатели
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => handleOptionClick(e, correctAnswer, question));
    });

    // Сброс состояния для нового вопроса
    state.selectedOption = null;
    state.answerSubmitted = false;
    dom.nextBtn.disabled = true;
}

function handleOptionClick(e, correctAnswer, question) {
    if (state.answerSubmitted) return; // Блокируем повторный выбор

    const clickedBtn = e.currentTarget;
    const selectedValue = clickedBtn.dataset.value;
    const isCorrect = selectedValue === correctAnswer;

    // Подсветка
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.value === correctAnswer) {
            btn.classList.add('correct');
        } else if (btn.dataset.value === selectedValue && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    // Обновление счета и запись ошибок
    if (isCorrect) {
        state.score++;
    } else {
        // Сохраняем оригинальный объект слова для повтора ошибок
        state.mistakes.push(question);
    }

    state.answerSubmitted = true;
    dom.nextBtn.disabled = false;

    // Обновить счет на экране
    updateScore();
}

function nextQuestion() {
    if (state.currentQuestionIndex < state.quizQuestions.length - 1) {
        state.currentQuestionIndex++;
        state.selectedOption = null;
        state.answerSubmitted = false;
        dom.nextBtn.disabled = true;
        updateProgress();
        renderQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    state.isQuizActive = false;
    dom.quizArea.classList.add('hidden');
    dom.resultScreen.classList.remove('hidden');

    const percentage = Math.round((state.score / state.totalQuestions) * 100);
    dom.resultMessage.textContent = `Вы ответили правильно на ${state.score} из ${state.totalQuestions} (${percentage}%)`;
}

function updateQuizHeader() {
    const modeNames = {
        'ru-en': 'Русский → Английский',
        'en-ru': 'Английский → Русский',
        'mixed': 'Смешанный режим'
    };
    dom.quizModeTitle.textContent = `Квиз: ${modeNames[state.quizMode]}`;
    updateScore();
    updateProgress();
}

function updateScore() {
    dom.scoreDisplay.textContent = `Счёт: ${state.score} / ${state.totalQuestions}`;
}

function updateProgress() {
    const progress = ((state.currentQuestionIndex + (state.answerSubmitted ? 1 : 0)) / state.totalQuestions) * 100;
    dom.progressBar.style.width = `${progress}%`;
}

// Повтор ошибочных
function retryMistakes() {
    if (state.mistakes.length === 0) {
        alert('Нет ошибочных слов!');
        return;
    }
    // Создаем новые вопросы только из ошибочных слов, сохраняя режим
    const mistakeQuestions = state.mistakes.map(item => ({
        ...item,
        type: state.quizMode === 'mixed' ? (Math.random() < 0.5 ? 'ru-en' : 'en-ru') : state.quizMode
    }));
    startQuiz(state.quizMode, mistakeQuestions);
}

// Сброс и новая игра
function playAgain() {
    startQuiz(state.quizMode);
}

// Переход в словарь
function backToDictionary() {
    dom.quizSection.classList.remove('active');
    dom.dictSection.classList.add('active');
    // Перерендерить словарь на всякий случай
    renderDictionary(state.currentVocab);
}

// --- Утилиты ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- Настройка слушателей событий ---
function setupEventListeners() {
    // Тема
    dom.themeToggle.addEventListener('click', toggleTheme);

    // Словарь
    dom.searchInput.addEventListener('input', filterAndSortDictionary);
    dom.sortAzBtn.addEventListener('click', sortAZ);
    dom.sortRandomBtn.addEventListener('click', sortRandom);
    dom.goToQuizBtn.addEventListener('click', () => startQuiz('ru-en'));

    // Квиз навигация
    dom.nextBtn.addEventListener('click', nextQuestion);
    dom.retryMistakesBtn.addEventListener('click', retryMistakes);
    dom.playAgainBtn.addEventListener('click', playAgain);

    // Кнопки "Назад в словарь"
    dom.backToDictBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', backToDictionary);
    });

    // Переключение режимов квиза (можно добавить позже через select, но для простоты оставим один вариант)
    // Добавляем в заголовок невидимые кнопки? Нет, оставим как есть.
    // Пользователь может выбрать режим, нажав кнопку "Квиз" несколько раз? Нет, это неудобно.
    // Упростим: В словаре кнопка "Квиз" запускает ru-en. На экране результата есть "Сыграть снова" с тем же режимом.
    // Расширим: Добавим быстрый выбор режима на будущее. Для MVP достаточно.
}

// --- Запуск приложения ---
document.addEventListener('DOMContentLoaded', initApp);
