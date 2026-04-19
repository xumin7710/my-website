// 初始化特效
function createParticles() {
    const container = document.getElementById('particles-container');
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const spark = document.createElement('div');
            spark.className = 'spark';
            spark.style.left = Math.random() * 100 + 'vw';
            spark.style.animationDuration = (Math.random() * 4 + 4) + 's';
            container.appendChild(spark);
            spark.addEventListener('animationend', () => { spark.style.left = Math.random() * 100 + 'vw'; });
        }, i * 200);
    }
}
createParticles();

document.addEventListener('click', function(e) {
    if(e.target.closest('.ink-trigger')) {
        const el = e.target.closest('.ink-trigger');
        const rect = el.getBoundingClientRect();
        const ripple = document.createElement('div');
        ripple.className = 'ink-ripple';
        ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
        ripple.style.left = e.clientX - rect.left - rect.width/2 + 'px';
        ripple.style.top = e.clientY - rect.top - rect.height/2 + 'px';
        if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
        el.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }
});

const API_KEY = 'sk-121bc48398d7485389e133580afb7d2b'; 
const API_URL = 'https://api.deepseek.com/chat/completions';
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');

let messageHistory = [{
    "role": "system", 
    "content": "你是鲁迅。语言风格是民国白话文，深沉、冷峻。面对青年(陈思羽)，回答要具有启发性。"
}];

const quotes = ["不在沉默中爆发，就在沉默中灭亡。", "贪安稳就没有自由，要自由就要历些危险。"];
const quotesContainer = document.getElementById('quotesContainer');
quotes.forEach(q => {
    const div = document.createElement('div');
    div.className = 'interactive-tag ink-trigger';
    div.innerText = `「${q}」`;
    div.onclick = () => { userInput.value = q; userInput.focus(); };
    quotesContainer.appendChild(div);
});

function askAboutWork(title) {
    userInput.value = `先生，我想听您谈谈《${title}》背后的深意。`;
    sendMessage();
}

// 新增工具栏调用逻辑
function useTool(type) {
    let prompt = "";
    if (type === 'essay') prompt = "先生，近来社会上多有‘内卷’与‘躺平’之争，请您以此为题，写一篇简短犀利的杂文，骂醒或者点醒当下的青年。";
    if (type === 'lyrics') prompt = "先生，我想请您为现代青年写一段充满力量的现代歌词，犹如炬火般照亮前路。格式要有节奏感。";
    if (type === 'story') prompt = "先生，夜深了，能给我讲一段您当年在百草园，或者在仙台学医时发生的有趣轶事吗？";
    
    userInput.value = prompt;
    sendMessage();
}

function typeWriterEffect(element, text) {
    let i = 0; element.innerHTML = '';
    return new Promise(resolve => {
        const timer = setInterval(() => {
            if (i < text.length) { element.innerHTML += text.charAt(i); i++; chatBox.scrollTop = chatBox.scrollHeight; } 
            else { clearInterval(timer); resolve(); }
        }, 30);
    });
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    chatBox.innerHTML += `<div class="message user">青年(陈思羽)：${text}</div>`;;
    userInput.value = '';
    messageHistory.push({"role": "user", "content": text});
    chatBox.scrollTop = chatBox.scrollHeight;

    const loadingId = 'loading-' + Date.now();
    chatBox.innerHTML += `<div class="message luxun" id="${loadingId}">先生正在提笔...</div>`;
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
            body: JSON.stringify({ model: "deepseek-chat", messages: messageHistory, temperature: 0.7 })
        });
        const data = await response.json();
        const reply = data.choices[0].message.content;

        document.getElementById(loadingId).remove();
        const luxunMsgDiv = document.createElement('div');
        luxunMsgDiv.className = 'message luxun';
        luxunMsgDiv.innerHTML = '鲁迅先生：';
        chatBox.appendChild(luxunMsgDiv);
        
        await typeWriterEffect(luxunMsgDiv, '鲁迅先生：' + reply);
        messageHistory.push({"role": "assistant", "content": reply});
    } catch (error) {
        document.getElementById(loadingId).innerText = "（先生暂不能回。请稍后再试。）";
    }
}

document.getElementById('sendBtn').onclick = sendMessage;
window.onload = () => {
    typeWriterEffect(document.getElementById('first-msg'), "鲁迅先生：思羽，你来了。有什么想问的，便说罢。我不怕多费些笔墨，只怕你们这代青年，心里的火灭了。");
};