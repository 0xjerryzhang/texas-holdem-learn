// 德州扑克教程 - 主程序

// ============================================
// 工具函数
// ============================================
const SUITS = ['♠', '♥', '♦', '♣'];
const SUIT_NAMES = ['spades', 'hearts', 'diamonds', 'clubs'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function randomCard() {
    const suitIdx = Math.floor(Math.random() * 4);
    const rankIdx = Math.floor(Math.random() * 13);
    return { rank: RANKS[rankIdx], suit: SUITS[suitIdx], suitName: SUIT_NAMES[suitIdx], rankIdx };
}

function createCardHTML(card) {
    return `<div class="card ${card.suitName}">
        <span class="rank">${card.rank}</span>
        <span class="suit">${card.suit}</span>
    </div>`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// 导航系统
// ============================================
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const module = btn.dataset.module;
        
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(module).classList.add('active');
    });
});

// ============================================
// 模块1: 牌型排名 - 互动练习
// ============================================
const HAND_TYPES = [
    { name: '皇家同花顺', generator: () => {
        const suitIdx = Math.floor(Math.random() * 4);
        const suit = SUITS[suitIdx];
        const suitName = SUIT_NAMES[suitIdx];
        return ['10', 'J', 'Q', 'K', 'A'].map(r => ({ rank: r, suit, suitName, rankIdx: RANKS.indexOf(r) }));
    }},
    { name: '同花顺', generator: () => {
        const suitIdx = Math.floor(Math.random() * 4);
        const startIdx = Math.floor(Math.random() * 8) + 1;
        return Array.from({length: 5}, (_, i) => ({
            rank: RANKS[startIdx + i], suit: SUITS[suitIdx], suitName: SUIT_NAMES[suitIdx], rankIdx: startIdx + i
        }));
    }},
    { name: '四条', generator: () => {
        const rankIdx = Math.floor(Math.random() * 13);
        const cards = SUITS.map((s, i) => ({ rank: RANKS[rankIdx], suit: s, suitName: SUIT_NAMES[i], rankIdx }));
        let kIdx = Math.floor(Math.random() * 13);
        while (kIdx === rankIdx) kIdx = Math.floor(Math.random() * 13);
        cards.push({ rank: RANKS[kIdx], suit: SUITS[0], suitName: SUIT_NAMES[0], rankIdx: kIdx });
        return cards;
    }},
    { name: '葫芦', generator: () => {
        const tripIdx = Math.floor(Math.random() * 13);
        let pairIdx = Math.floor(Math.random() * 13);
        while (pairIdx === tripIdx) pairIdx = Math.floor(Math.random() * 13);
        const cards = SUITS.slice(0, 3).map((s, i) => ({ rank: RANKS[tripIdx], suit: s, suitName: SUIT_NAMES[i], rankIdx: tripIdx }));
        cards.push({ rank: RANKS[pairIdx], suit: SUITS[0], suitName: SUIT_NAMES[0], rankIdx: pairIdx });
        cards.push({ rank: RANKS[pairIdx], suit: SUITS[1], suitName: SUIT_NAMES[1], rankIdx: pairIdx });
        return cards;
    }},
    { name: '同花', generator: () => {
        const suitIdx = Math.floor(Math.random() * 4);
        const indices = new Set();
        while (indices.size < 5) indices.add(Math.floor(Math.random() * 13));
        return [...indices].map(i => ({ rank: RANKS[i], suit: SUITS[suitIdx], suitName: SUIT_NAMES[suitIdx], rankIdx: i }));
    }},
    { name: '顺子', generator: () => {
        const suitSet = new Set();
        while (suitSet.size < 5) suitSet.add(Math.floor(Math.random() * 4));
        const startIdx = Math.floor(Math.random() * 8) + 1;
        return [...suitSet].map((s, i) => ({ rank: RANKS[startIdx + i], suit: SUITS[s], suitName: SUIT_NAMES[s], rankIdx: startIdx + i }));
    }},
    { name: '三条', generator: () => {
        const tripIdx = Math.floor(Math.random() * 13);
        const cards = SUITS.slice(0, 3).map((s, i) => ({ rank: RANKS[tripIdx], suit: s, suitName: SUIT_NAMES[i], rankIdx: tripIdx }));
        const used = new Set([tripIdx]);
        while (cards.length < 5) {
            let idx = Math.floor(Math.random() * 13);
            if (!used.has(idx)) {
                used.add(idx);
                cards.push({ rank: RANKS[idx], suit: SUITS[0], suitName: SUIT_NAMES[0], rankIdx: idx });
            }
        }
        return cards;
    }},
    { name: '两对', generator: () => {
        const pairs = new Set();
        while (pairs.size < 2) pairs.add(Math.floor(Math.random() * 13));
        const [p1, p2] = [...pairs];
        let kIdx = Math.floor(Math.random() * 13);
        while (pairs.has(kIdx)) kIdx = Math.floor(Math.random() * 13);
        return [
            { rank: RANKS[p1], suit: SUITS[0], suitName: SUIT_NAMES[0], rankIdx: p1 },
            { rank: RANKS[p1], suit: SUITS[1], suitName: SUIT_NAMES[1], rankIdx: p1 },
            { rank: RANKS[p2], suit: SUITS[2], suitName: SUIT_NAMES[2], rankIdx: p2 },
            { rank: RANKS[p2], suit: SUITS[3], suitName: SUIT_NAMES[3], rankIdx: p2 },
            { rank: RANKS[kIdx], suit: SUITS[0], suitName: SUIT_NAMES[0], rankIdx: kIdx }
        ];
    }},
    { name: '一对', generator: () => {
        const pairIdx = Math.floor(Math.random() * 13);
        const used = new Set([pairIdx]);
        const kickers = [];
        while (kickers.length < 3) {
            let idx = Math.floor(Math.random() * 13);
            if (!used.has(idx)) { used.add(idx); kickers.push(idx); }
        }
        return [
            { rank: RANKS[pairIdx], suit: SUITS[0], suitName: SUIT_NAMES[0], rankIdx: pairIdx },
            { rank: RANKS[pairIdx], suit: SUITS[1], suitName: SUIT_NAMES[1], rankIdx: pairIdx },
            ...kickers.map((idx, i) => ({ rank: RANKS[idx], suit: SUITS[i], suitName: SUIT_NAMES[i], rankIdx: idx }))
        ];
    }},
    { name: '高牌', generator: () => {
        const indices = new Set();
        while (indices.size < 5) indices.add(Math.floor(Math.random() * 13));
        return [...indices].map((idx, i) => ({ rank: RANKS[idx], suit: SUITS[i % 4], suitName: SUIT_NAMES[i % 4], rankIdx: idx }));
    }}
];

let practiceCorrect = '';

function generatePractice() {
    const handIdx = Math.floor(Math.random() * HAND_TYPES.length);
    const hand = HAND_TYPES[handIdx];
    const cards = hand.generator();
    
    document.getElementById('practice-cards').innerHTML = cards.map(c => createCardHTML(c)).join('');
    
    const options = [hand.name];
    while (options.length < 4) {
        const opt = HAND_TYPES[Math.floor(Math.random() * HAND_TYPES.length)].name;
        if (!options.includes(opt)) options.push(opt);
    }
    options.sort(() => Math.random() - 0.5);
    
    practiceCorrect = hand.name;
    document.getElementById('practice-options').innerHTML = options.map(opt => 
        `<button class="option-btn" data-answer="${opt}">${opt}</button>`
    ).join('');
    document.getElementById('practice-feedback').textContent = '';
    
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.dataset.answer;
            document.querySelectorAll('.option-btn').forEach(b => {
                if (b.dataset.answer === practiceCorrect) b.classList.add('correct');
                else if (b === btn && answer !== practiceCorrect) b.classList.add('wrong');
                b.disabled = true;
            });
            document.getElementById('practice-feedback').textContent = 
                answer === practiceCorrect ? '✅ 正确！' : `❌ 错误！正确答案是：${practiceCorrect}`;
        });
    });
}

document.getElementById('next-practice').addEventListener('click', generatePractice);
generatePractice();

// ============================================
// 模块2: 起手牌图表
// ============================================
function renderHandChart() {
    const chart = document.getElementById('hand-chart');
    const handStrength = {
        'AA': 'strong', 'KK': 'strong', 'QQ': 'strong', 'JJ': 'strong', 'TT': 'strong',
        'AKs': 'strong', 'AQs': 'strong', 'AJs': 'strong', 'ATs': 'strong',
        'AKo': 'strong', 'AQo': 'strong',
        '99': 'medium', '88': 'medium', '77': 'medium', '66': 'medium',
        'A9s': 'medium', 'A8s': 'medium', 'A7s': 'medium', 'A6s': 'medium', 'A5s': 'medium', 'A4s': 'medium', 'A3s': 'medium', 'A2s': 'medium',
        'KQs': 'medium', 'KJs': 'medium', 'KTs': 'medium', 'QJs': 'medium', 'QTs': 'medium', 'JTs': 'medium',
        'KQo': 'medium', 'KJo': 'medium',
        '55': 'medium', '44': 'medium', '33': 'medium', '22': 'weak',
        'AJo': 'medium', 'ATo': 'medium', 'KTo': 'medium', 'QJo': 'medium',
    };
    
    for (let i = 12; i >= 0; i--) {
        for (let j = 12; j >= 0; j--) {
            const cell = document.createElement('div');
            let hand, handClass;
            
            if (i === j) {
                hand = RANKS[i] + RANKS[i];
                handClass = handStrength[hand] || 'weak';
                if (handClass === 'medium' && i >= 4) handClass = 'medium';
                cell.classList.add(handClass);
                cell.textContent = hand;
            } else if (i > j) {
                hand = RANKS[i] + RANKS[j] + 's';
                handClass = handStrength[hand] || 'weak';
                cell.classList.add(handClass);
                cell.textContent = hand;
            } else {
                hand = RANKS[j] + RANKS[i] + 'o';
                handClass = handStrength[hand] || 'weak';
                cell.classList.add(handClass);
                cell.textContent = hand;
            }
            
            cell.title = hand;
            chart.appendChild(cell);
        }
    }
}
renderHandChart();

// ============================================
// 模块4: 赔率计算器
// ============================================
function updatePotOdds() {
    const pot = parseFloat(document.getElementById('pot-size').value) || 0;
    const bet = parseFloat(document.getElementById('bet-size').value) || 0;
    const totalPot = pot + bet;
    const callAmount = bet;
    const ratio = callAmount > 0 ? (totalPot / callAmount).toFixed(1) : '∞';
    const equity = callAmount > 0 ? ((callAmount / (totalPot + callAmount)) * 100).toFixed(1) : '0';
    
    document.getElementById('total-pot').textContent = totalPot;
    document.getElementById('call-amount').textContent = callAmount;
    document.getElementById('pot-odds').textContent = `${ratio}:1`;
    document.getElementById('required-equity').textContent = `${equity}%`;
}

document.getElementById('pot-size').addEventListener('input', updatePotOdds);
document.getElementById('bet-size').addEventListener('input', updatePotOdds);
updatePotOdds();

// ============================================
// 模块5: 测验系统
// ============================================
const QUIZ_QUESTIONS = [
    {
        question: '德州扑克中，以下哪个牌型最大？',
        options: ['葫芦', '同花顺', '四条', '同花'],
        correct: 1,
        explanation: '同花顺是第二大牌型，仅次于皇家同花顺。'
    },
    {
        question: '翻牌前，UTG（枪口位）应该用什么范围的牌加注？',
        options: ['任何两张牌', '前10%的牌', '前50%的牌', '只玩AA和KK'],
        correct: 1,
        explanation: 'UTG是最靠前的位置，需要最紧的范围，通常只玩前10%的强牌。'
    },
    {
        question: '底池有100元，对手下注50元，你的底池赔率是多少？',
        options: ['2:1', '3:1', '4:1', '1:1'],
        correct: 1,
        explanation: '底池总额150元，需要跟注50元，赔率为3:1。'
    },
    {
        question: '你有同花听牌（9张出路），翻牌后河牌前的成牌概率约是多少？',
        options: ['19.6%', '35%', '50%', '8.7%'],
        correct: 1,
        explanation: '9张出路，用Rule of 4计算：9×4=36%，实际约35%。'
    },
    {
        question: '以下哪个位置在翻牌后最后行动？',
        options: ['UTG', 'CO', 'BTN', 'BB'],
        correct: 2,
        explanation: 'BTN（庄家位）在翻牌后是最后一个行动的位置，信息优势最大。'
    },
    {
        question: '两头顺听牌有多少张出路？',
        options: ['4张', '6张', '8张', '9张'],
        correct: 2,
        explanation: '两头顺听牌（如789T）可以由6或J成顺，各有4张，共8张出路。'
    },
    {
        question: '你在按钮位，前面所有人都弃牌，你应该怎么做？',
        options: ['只玩强牌', '加注偷盲', '也弃牌', '全下'],
        correct: 1,
        explanation: '按钮位前面都弃牌是偷盲的绝佳机会，可以用较宽的范围加注。'
    },
    {
        question: '以下哪个不是德州扑克的有效牌型？',
        options: ['同花顺', '三条带两对', '两对', '高牌'],
        correct: 1,
        explanation: '三条带两对实际上是葫芦（Full House），不是单独的牌型。'
    },
    {
        question: '用Rule of 2计算时，转牌后9张出路的成牌概率约是多少？',
        options: ['9%', '18%', '36%', '27%'],
        correct: 1,
        explanation: 'Rule of 2：9×2=18%，实际约19.6%。'
    },
    {
        question: 'A-2-3-4-5这手牌在德州扑克中叫什么？',
        options: ['最小顺子', '高牌', '无效牌型', '同花顺'],
        correct: 0,
        explanation: 'A-2-3-4-5被称为"轮子"（Wheel），是最小的顺子，但A可以当作1使用。'
    }
];

let quizState = {
    current: 0,
    score: 0,
    answered: false
};

function renderQuiz() {
    const q = QUIZ_QUESTIONS[quizState.current];
    document.getElementById('question-text').textContent = q.question;
    document.getElementById('quiz-counter').textContent = `${quizState.current + 1}/${QUIZ_QUESTIONS.length}`;
    document.getElementById('quiz-progress').style.width = `${(quizState.current / QUIZ_QUESTIONS.length) * 100}%`;
    document.getElementById('quiz-feedback').textContent = '';
    document.getElementById('next-question').style.display = 'none';
    document.getElementById('quiz-score').style.display = 'none';
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = q.options.map((opt, i) => 
        `<button class="quiz-option" data-index="${i}">${opt}</button>`
    ).join('');
    
    quizState.answered = false;
    
    document.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', () => {
            if (quizState.answered) return;
            quizState.answered = true;
            
            const idx = parseInt(btn.dataset.index);
            const isCorrect = idx === q.correct;
            
            if (isCorrect) {
                quizState.score++;
                btn.classList.add('correct');
                document.getElementById('quiz-feedback').innerHTML = `✅ 正确！${q.explanation}`;
            } else {
                btn.classList.add('wrong');
                document.querySelectorAll('.quiz-option')[q.correct].classList.add('correct');
                document.getElementById('quiz-feedback').innerHTML = `❌ 错误！${q.explanation}`;
            }
            
            document.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);
            document.getElementById('next-question').style.display = 'inline-block';
        });
    });
}

document.getElementById('next-question').addEventListener('click', () => {
    quizState.current++;
    if (quizState.current >= QUIZ_QUESTIONS.length) {
        showQuizScore();
    } else {
        renderQuiz();
    }
});

function showQuizScore() {
    document.getElementById('quiz-question').style.display = 'none';
    document.getElementById('next-question').style.display = 'none';
    document.getElementById('quiz-feedback').textContent = '';
    
    const scoreDiv = document.getElementById('quiz-score');
    scoreDiv.style.display = 'block';
    document.getElementById('score-percent').textContent = `${Math.round((quizState.score / QUIZ_QUESTIONS.length) * 100)}%`;
    document.getElementById('score-correct').textContent = quizState.score;
    document.getElementById('score-total').textContent = QUIZ_QUESTIONS.length;
    document.getElementById('quiz-progress').style.width = '100%';
}

document.getElementById('restart-quiz').addEventListener('click', () => {
    quizState = { current: 0, score: 0, answered: false };
    document.getElementById('quiz-question').style.display = 'block';
    renderQuiz();
});

renderQuiz();

// ============================================
// 模块6: 情境模拟
// ============================================
const SCENARIOS = [
    {
        myHand: [{ rank: 'A', suit: '♠', suitName: 'spades', rankIdx: 12 }, { rank: 'K', suit: '♠', suitName: 'spades', rankIdx: 11 }],
        community: [],
        position: 'BTN',
        pot: '3.5BB',
        action: '前面3人弃牌，你该怎么做？',
        bestAction: 'raise',
        explanation: 'AKs是极强的起手牌，在按钮位前面都弃牌时，应该加注偷盲。建议加注到2.5-3BB。'
    },
    {
        myHand: [{ rank: '7', suit: '♥', suitName: 'hearts', rankIdx: 5 }, { rank: '7', suit: '♦', suitName: 'diamonds', rankIdx: 5 }],
        community: [{ rank: 'A', suit: '♠', suitName: 'spades', rankIdx: 12 }, { rank: 'K', suit: '♣', suitName: 'clubs', rankIdx: 11 }, { rank: '2', suit: '♥', suitName: 'hearts', rankIdx: 0 }],
        position: 'UTG',
        pot: '15BB',
        action: '你加注开池，大盲跟注。翻牌A-K-2，大盲过牌，你该怎么做？',
        bestAction: 'check',
        explanation: '翻牌面有A和K，对手很可能有一张A或K。你的77在这里几乎没有价值，应该过牌控制底池。'
    },
    {
        myHand: [{ rank: 'J', suit: '♠', suitName: 'spades', rankIdx: 9 }, { rank: 'T', suit: '♠', suitName: 'spades', rankIdx: 8 }],
        community: [{ rank: 'Q', suit: '♠', suitName: 'spades', rankIdx: 10 }, { rank: '9', suit: '♠', suitName: 'spades', rankIdx: 7 }, { rank: '2', suit: '♦', suitName: 'diamonds', rankIdx: 0 }],
        position: 'CO',
        pot: '20BB',
        action: '你有同花听牌+两头顺听牌。对手下注10BB，你该怎么做？',
        bestAction: 'raise',
        explanation: '你有极强的听牌组合（同花+两头顺），约有15张出路。可以加注施压，即使被跟注也有很好的胜率。'
    },
    {
        myHand: [{ rank: 'Q', suit: '♥', suitName: 'hearts', rankIdx: 10 }, { rank: 'Q', suit: '♦', suitName: 'diamonds', rankIdx: 10 }],
        community: [{ rank: 'Q', suit: '♠', suitName: 'spades', rankIdx: 10 }, { rank: '7', suit: '♣', suitName: 'clubs', rankIdx: 5 }, { rank: '2', suit: '♥', suitName: 'hearts', rankIdx: 0 }],
        position: 'BTN',
        pot: '30BB',
        action: '你翻牌击中三条Q。对手下注15BB，你该怎么做？',
        bestAction: 'raise',
        explanation: '你有顶三条，牌力极强。应该加注建池，争取在河牌前打光筹码。'
    },
    {
        myHand: [{ rank: '9', suit: '♣', suitName: 'clubs', rankIdx: 7 }, { rank: '8', suit: '♣', suitName: 'clubs', rankIdx: 6 }],
        community: [{ rank: 'K', suit: '♠', suitName: 'spades', rankIdx: 11 }, { rank: 'T', suit: '♦', suitName: 'diamonds', rankIdx: 8 }, { rank: '3', suit: '♥', suitName: 'hearts', rankIdx: 1 }],
        position: 'SB',
        pot: '12BB',
        action: '大盲过牌，你该怎么做？',
        bestAction: 'check',
        explanation: '98o在SB位置，翻牌K-T-3彩虹面，你的牌几乎没有价值。没有听牌，没有对子，应该过牌放弃。'
    },
    {
        myHand: [{ rank: 'A', suit: '♦', suitName: 'diamonds', rankIdx: 12 }, { rank: 'A', suit: '♣', suitName: 'clubs', rankIdx: 12 }],
        community: [],
        position: 'UTG',
        pot: '1.5BB',
        action: '你是第一个行动，拿到AA，该怎么做？',
        bestAction: 'raise',
        explanation: 'AA是德州扑克最强的起手牌！必须加注。标准加注是2.5-3BB，不要慢玩。'
    },
    {
        myHand: [{ rank: 'K', suit: '♥', suitName: 'hearts', rankIdx: 11 }, { rank: 'Q', suit: '♥', suitName: 'hearts', rankIdx: 10 }],
        community: [{ rank: 'A', suit: '♥', suitName: 'hearts', rankIdx: 12 }, { rank: 'T', suit: '♥', suitName: 'hearts', rankIdx: 8 }, { rank: '5', suit: '♠', suitName: 'spades', rankIdx: 3 }],
        position: 'MP',
        pot: '25BB',
        action: '你有K♥Q♥，翻牌A♥T♥5♠，你有同花听牌。对手下注12BB，你该怎么做？',
        bestAction: 'call',
        explanation: '你有9张同花出路，底池赔率合适（约2:1），跟注看转牌是正确的。如果转牌成同花，可以激进打价值。'
    },
    {
        myHand: [{ rank: 'T', suit: '♠', suitName: 'spades', rankIdx: 8 }, { rank: '9', suit: '♠', suitName: 'spades', rankIdx: 7 }],
        community: [{ rank: 'J', suit: '♠', suitName: 'spades', rankIdx: 9 }, { rank: '8', suit: '♥', suitName: 'hearts', rankIdx: 6 }, { rank: '7', suit: '♦', suitName: 'diamonds', rankIdx: 5 }],
        position: 'BTN',
        pot: '18BB',
        action: '你有T♠9♠，翻牌J♠8♥7♦，你有两头顺听牌。对手下注9BB，你该怎么做？',
        bestAction: 'call',
        explanation: '你有8张出路的两头顺听牌（6或Q成顺），底池赔率2:1，跟注是正确的。加注也可以考虑，但跟注更稳妥。'
    },
    {
        myHand: [{ rank: '2', suit: '♥', suitName: 'hearts', rankIdx: 0 }, { rank: '2', suit: '♦', suitName: 'diamonds', rankIdx: 0 }],
        community: [],
        position: 'BB',
        pot: '8BB',
        action: 'CO加注到3BB，按钮位跟注，小盲弃牌，你在大盲拿到22，该怎么做？',
        bestAction: 'call',
        explanation: '小对子的目标是翻牌击中三条（概率约12%）。多人底池，底池赔率足够，跟注看翻牌。'
    },
    {
        myHand: [{ rank: 'A', suit: '♠', suitName: 'spades', rankIdx: 12 }, { rank: 'K', suit: '♦', suitName: 'diamonds', rankIdx: 11 }],
        community: [{ rank: 'A', suit: '♥', suitName: 'hearts', rankIdx: 12 }, { rank: 'K', suit: '♣', suitName: 'clubs', rankIdx: 11 }, { rank: 'Q', suit: '♦', suitName: 'diamonds', rankIdx: 10 }],
        position: 'CO',
        pot: '40BB',
        action: '你翻牌击中顶两对（AK）。对手全下30BB，你该怎么做？',
        bestAction: 'raise',
        explanation: '顶两对在AKQ的牌面上非常强。对手可能有AQ、AJ等牌，也可能有QJ听顺。应该跟注（或再加注）。'
    }
];

let scenarioIndex = 0;

function renderScenario() {
    const s = SCENARIOS[scenarioIndex];
    
    document.getElementById('my-hand').innerHTML = s.myHand.map(c => createCardHTML(c)).join('');
    
    if (s.community.length > 0) {
        document.getElementById('community-cards').innerHTML = s.community.map(c => createCardHTML(c)).join('');
    } else {
        document.getElementById('community-cards').innerHTML = '<p style="color:#7f8c8d">翻牌前（无公共牌）</p>';
    }
    
    document.getElementById('my-position').textContent = s.position;
    document.getElementById('scenario-pot').textContent = s.pot;
    document.getElementById('scenario-action').textContent = s.action;
    document.getElementById('scenario-feedback').innerHTML = '';
    document.getElementById('next-scenario').style.display = 'none';
    
    document.querySelectorAll('.decision-buttons button').forEach(btn => btn.disabled = false);
}

function handleDecision(action) {
    const s = SCENARIOS[scenarioIndex];
    const isCorrect = action === s.bestAction;
    
    document.querySelectorAll('.decision-buttons button').forEach(btn => btn.disabled = true);
    
    const feedbackHTML = isCorrect 
        ? `<h4 style="color:#27ae60">✅ 正确选择：${action === 'fold' ? '弃牌' : action === 'call' ? '跟注' : '加注'}</h4><p>${s.explanation}</p>`
        : `<h4 style="color:#e74c3c">❌ 最佳选择是：${s.bestAction === 'fold' ? '弃牌' : s.bestAction === 'call' ? '跟注' : '加注'}</h4><p>${s.explanation}</p>`;
    
    document.getElementById('scenario-feedback').innerHTML = feedbackHTML;
    document.getElementById('next-scenario').style.display = 'inline-block';
}

document.getElementById('btn-fold').addEventListener('click', () => handleDecision('fold'));
document.getElementById('btn-call').addEventListener('click', () => handleDecision('call'));
document.getElementById('btn-raise').addEventListener('click', () => handleDecision('raise'));

document.getElementById('next-scenario').addEventListener('click', () => {
    scenarioIndex = (scenarioIndex + 1) % SCENARIOS.length;
    renderScenario();
});

renderScenario();

// ============================================
// 初始化完成
// ============================================
console.log('德州扑克教程已加载！');
