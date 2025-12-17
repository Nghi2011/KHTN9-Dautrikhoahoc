// =========================================================
// 1. DỮ LIỆU CÂU HỎI & BIẾN HỆ THỐNG
// =========================================================
const questionsData = [
    { type: 'mcq', q: "Điện trở của một đoạn dây dẫn đặc trưng cho:", a: ["Khả năng dẫn điện tốt", "Mức độ cản trở dòng điện", "Hiệu điện thế", "Cường độ dòng điện"], correct: 1 },
    { type: 'mcq', q: "Đồ thị biểu diễn mối quan hệ giữa I và U là:", a: ["Đường cong", "Đường thẳng qua gốc tọa độ", "Đường song song trục U", "Đường song song trục I"], correct: 1 },
    { type: 'mcq', q: "Trong đoạn mạch mắc nối tiếp, đại lượng nào bằng nhau tại mọi điểm?", a: ["Hiệu điện thế", "Điện trở", "Cường độ dòng điện", "Công suất"], correct: 2 },
    { type: 'mcq', q: "Công thức đúng cho đoạn mạch mắc song song là:", a: ["U = U1 + U2", "I = I1 = I2", "1/Rtđ = 1/R1 + 1/R2", "Rtđ = R1 + R2"], correct: 2 },
    { type: 'mcq', q: "Đại lượng đặc trưng cho tốc độ tiêu thụ điện năng là:", a: ["Công dòng điện", "Công suất điện", "Cường độ dòng điện", "Điện trở"], correct: 1 },
    { type: 'mcq', q: "Công thức tính công suất điện P là:", a: ["P = U.I", "P = U/I", "P = I/U", "P = U.t"], correct: 0 },
    { type: 'mcq', q: "Dụng cụ đo điện năng tiêu thụ là:", a: ["Ampe kế", "Vôn kế", "Công tơ điện", "Nhiệt kế"], correct: 2 },
    { type: 'mcq', q: "1 kWh tương ứng với bao nhiêu Joule?", a: ["3600 J", "360.000 J", "3.600.000 J", "1.000 J"], correct: 2 },
    { type: 'mcq', q: "Nhiệt lượng tỏa ra (Jun-Len-xơ) tỉ lệ thuận với:", a: ["Bình phương cường độ dòng điện", "Cường độ dòng điện", "Hiệu điện thế", "Thời gian"], correct: 0 },
    { type: 'mcq', q: "Đơn vị của nhiệt lượng trong hệ SI là:", a: ["Watt (W)", "Ampe (A)", "Joule (J)", "Ohm (Ω)"], correct: 2 },
    { type: 'mcq', q: "Lắp aptomat nhằm mục đích:", a: ["Tiết kiệm điện", "Bảo vệ khi quá tải/đoản mạch", "Tăng công suất", "Đo điện năng"], correct: 1 },
    { type: 'mcq', q: "Hành động nào KHÔNG an toàn khi dùng điện?", a: ["Ngắt điện khi sửa", "Dùng dây dẫn hở vỏ bọc", "Rút phích khi không dùng", "Nối đất vỏ máy"], correct: 1 },
    { type: 'mcq', q: "Khi U tăng 3 lần thì cường độ dòng điện I:", a: ["Giảm 3 lần", "Tăng 3 lần", "Không đổi", "Tăng 9 lần"], correct: 1 },
    { type: 'mcq', q: "Nguyên nhân dây điện quá tải gây hỏa hoạn là?", a: ["Dây bị lạnh", "Dây tỏa nhiệt mạnh", "Điện trở giảm", "Dòng điện mất"], correct: 1 },
    { type: 'input', q: "Câu 15: R1=20, R2=30 song song, nt R3=8. Tính Rtđ (Ohm)?", correct: "20" },
    { type: 'input', q: "Câu 16: Đèn 220V-100W. Tính điện trở đèn (Ohm)?", correct: "484" },
    { type: 'input', q: "Câu 17: 1200W dùng 5h/ngày. Tính tiền điện 30 ngày (Giá 2500đ/kWh)?", correct: "450000" },
    { type: 'input', q: "Câu 18: R=44Ω, U=220V. Tính nhiệt lượng tỏa ra trong 15 phút (J)?", correct: "990000" },
    { type: 'input', q: "Câu 19: U=4V, I=1A. Tính giá trị điện trở R (Ohm)?", correct: "4" },
    { type: 'mcq', q: "Câu 20: Để tiết kiệm điện năng chúng ta nên làm gì?", a: ["Dùng dây dẫn nhỏ", "Bật đèn cả ngày", "Tắt khi không sử dụng", "Dùng đèn sợi đốt"], correct: 2 }
];

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let playerName = "", playerClass = "", selectedCharId = null;
let lives = 5, timeLeft = 30 * 60, currentLevel = 1, gameState = 'START';
let isPaused = false, hasShield = false, magnetActive = 0, walkCycle = 0;
let currentHint = "", hintTimer = 0, timerInterval = null;

const player = { x: 50, y: 350, width: 40, height: 40, dy: 0, speed: 5, jump: -12, grav: 0.6, grounded: false };
let obstacles = [], gem = { x: 0, y: 0, w: 30, h: 30 };
const playerImg = new Image();
const keys = {};

// =========================================================
// 2. KHỞI TẠO UI & ĐIỀU KHIỂN
// =========================================================
function initUI() {
    const grid = document.getElementById('character-grid');
    grid.innerHTML = "";
    for (let i = 1; i <= 11; i++) {
        const div = document.createElement('div');
        div.className = 'col-3 col-md-2 mb-3';
        div.innerHTML = `
            <div class="character p-1 border rounded bg-dark text-center" onclick="selectChar(this, ${i})">
                <img src="assets/characters/9-${i}.png" class="img-fluid rounded" onerror="this.src='https://placehold.co/50x50?text=9-${i}'">
                <p class="small mb-0 mt-1">Lớp 9/${i}</p>
            </div>`;
        grid.appendChild(div);
    }
}

window.selectChar = (el, id) => {
    document.querySelectorAll('.character').forEach(c => c.classList.remove('selected', 'border-warning'));
    el.classList.add('selected', 'border-warning');
    selectedCharId = id;
    playerImg.src = `assets/characters/9-${id}.png`; 
};

document.getElementById('startBtn').onclick = () => {
    playerName = document.getElementById('playerName').value;
    playerClass = document.getElementById('playerClass').value;
    if (!playerName || !playerClass || !selectedCharId) return alert("Vui lòng điền đủ thông tin!");
    document.getElementById('start-screen').classList.add('d-none');
    document.getElementById('intro-screen').classList.remove('d-none');
};

document.getElementById('confirmIntroBtn').onclick = () => {
    document.getElementById('intro-screen').classList.add('d-none');
    document.getElementById('game-screen').classList.remove('d-none');
    startGame();
};

// =========================================================
// 3. LOGIC MÀN CHƠI & CẬP NHẬT
// =========================================================
function buildLevel(lv) {
    document.getElementById('levelDisplay').innerText = `Màn ${lv}/20`;
    player.x = 50; player.y = 350; player.dy = 0;
    magnetActive = 0;
    
    // Thiết lập Hint
    const hints = { 1: "Mũi tên để đi, Nhặt Ngọc💎!", 2: "Ăn Khiên🛡️ bảo vệ!", 4: "Ăn Nam châm🧲 hút Ngọc!", 5: "Coi chừng Gai🔺!", 11: "Nhảy qua Cảnh sát👮!" };
    currentHint = hints[lv] || "Tiến lên!";
    hintTimer = 180;

    // Tạo bệ đứng biến thiên
    obstacles = [{ type: 'platform', x: 0, y: 450, w: 900, h: 50 }];
    let count = Math.min(2 + Math.floor(lv/4), 5);
    for (let i=0; i<count; i++) {
        obstacles.push({ 
            type: 'platform', 
            x: 150 + (i*180) + (Math.sin(lv+i)*40), 
            y: 350 - (i*60), 
            w: 120 - (lv*2), 
            h: 20 
        });
    }

    // Thêm vật phẩm & bẫy
    if (lv >= 5) obstacles.push({ type: 'spike', x: 400, y: 425, w: 30, h: 25 });
    if (lv % 3 === 0) obstacles.push({ type: 'spring', x: 600, y: 430, w: 40, h: 20 });
    if (lv > 10) obstacles.push({ type: 'police', x: 400, y: 410, w: 40, h: 40, dx: 2, minX: 200, maxX: 700 });
    if (lv === 2 || lv === 15) obstacles.push({ type: 'shield', x: 150, y: 410, w: 30, h: 30 });
    if (lv === 4 || lv === 12) obstacles.push({ type: 'magnet', x: 220, y: 410, w: 30, h: 30 });

    gem = { x: 800, y: lv > 10 ? 150 : 380, w: 30, h: 30 };
}

function update() {
    let moving = false;
    if (keys['ArrowLeft']) { player.x -= player.speed; moving = true; }
    if (keys['ArrowRight']) { player.x += player.speed; moving = true; }
    
    if (moving && player.grounded) walkCycle += 0.2; 
    else if (player.grounded) walkCycle = 0;

    if ((keys['Space'] || keys['ArrowUp']) && player.grounded) { player.dy = player.jump; player.grounded = false; }

    player.dy += player.grav;
    player.y += player.dy;
    player.grounded = false;

    // Xử lý va chạm
    obstacles.forEach(o => {
        if (o.type === 'police') { o.x += o.dx; if (o.x < o.minX || o.x > o.maxX) o.dx *= -1; }
        if (checkCollision(player, o)) {
            if (o.type === 'platform' && player.dy > 0) { player.y = o.y - player.height; player.dy = 0; player.grounded = true; }
            else if (o.type === 'spring') { player.dy = -18; player.grounded = false; }
            else if (o.type === 'shield') { hasShield = true; o.x = -1000; }
            else if (o.type === 'magnet') { magnetActive = 400; o.x = -1000; }
            else if (o.type === 'spike' || o.type === 'police') { 
                if (hasShield) { hasShield = false; o.x = -1000; } else handleDeath(); 
            }
        }
    });

    if (magnetActive > 0) { gem.x += (player.x - gem.x)*0.05; gem.y += (player.y - gem.y)*0.05; magnetActive--; }
    if (checkCollision(player, gem)) triggerQuestion();
    if (player.y > 500) handleDeath();
}

// =========================================================
// 4. HÀM VẼ (DRAW) HOÀN CHỈNH
// =========================================================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    obstacles.forEach(o => {
        if (o.type === 'platform') { ctx.fillStyle = '#7f8c8d'; ctx.fillRect(o.x, o.y, o.w, o.h); }
        ctx.font = "24px Arial"; ctx.textAlign = "left";
        if (o.type === 'police') ctx.fillText("👮", o.x + 5, o.y + 30);
        if (o.type === 'spring') ctx.fillText("🚀", o.x + 5, o.y + 20);
        if (o.type === 'spike') ctx.fillText("🔺", o.x + 2, o.y + 25);
        if (o.type === 'shield') ctx.fillText("🛡️", o.x + 2, o.y + 25);
        if (o.type === 'magnet') ctx.fillText("🧲", o.x + 2, o.y + 25);
    });

    ctx.font = "26px Arial"; ctx.fillText("💎", gem.x, gem.y + 25);

    // Vẽ hào quang khiên
    if (hasShield) {
        ctx.strokeStyle = "#00d2ff"; ctx.lineWidth = 3; ctx.beginPath();
        ctx.arc(player.x + player.width/2, player.y + player.height/2, 28, 0, Math.PI*2);
        ctx.stroke();
    }

    // Vẽ nhân vật với hiệu ứng Squash & Stretch & Rocking
    ctx.save();
    ctx.translate(player.x + player.width/2, player.y + player.height/2);
    if (player.grounded && walkCycle > 0) ctx.rotate(Math.sin(walkCycle) * 0.1);
    ctx.scale(player.grounded ? 1 : 0.8, player.grounded ? 1 : 1.2);
    ctx.drawImage(playerImg, -player.width/2, -player.height/2, player.width, player.height);
    ctx.restore();

    ctx.fillStyle = "white"; ctx.font = "bold 14px Arial"; ctx.textAlign = "center";
    ctx.fillText(playerClass, player.x + player.width/2, player.y - 15);

    if (hintTimer > 0) {
        ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(250, 50, 400, 40);
        ctx.fillStyle = "#f1c40f"; ctx.font = "16px Arial"; ctx.fillText(currentHint, 450, 76);
        hintTimer--;
    }
}

// =========================================================
// 5. HỆ THỐNG GAME & CÂU HỎI
// =========================================================
function startGame() {
    gameState = 'PLAYING'; buildLevel(currentLevel);
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!isPaused && gameState === 'PLAYING') {
            timeLeft--; let m = Math.floor(timeLeft / 60), s = timeLeft % 60;
            document.getElementById('timer').innerText = `${m}:${s.toString().padStart(2, '0')}`;
            if (timeLeft <= 0) endGame(false);
        }
    }, 1000);
    requestAnimationFrame(gameLoop);
}

function gameLoop() { if (gameState === 'PLAYING' && !isPaused) { update(); draw(); } requestAnimationFrame(gameLoop); }

function triggerQuestion() {
    isPaused = true; const q = questionsData[currentLevel - 1];
    document.getElementById('questionText').innerText = q.q;
    const area = document.getElementById('answerArea'); area.innerHTML = "";
    const modal = new bootstrap.Modal(document.getElementById('questionModal'));
    if (q.type === 'mcq') {
        q.a.forEach((text, i) => {
            const btn = document.createElement('button'); btn.className = "btn btn-outline-info text-start mb-2";
            btn.innerText = text; btn.onclick = () => { modal.hide(); isPaused = false; if (i === q.correct) nextLevel(); else handleDeath(); };
            area.appendChild(btn);
        });
    } else {
        area.innerHTML = `<input type="number" id="ansInp" class="form-control mb-2"><button class="btn btn-primary w-100" onclick="checkInput('${q.correct}')">Gửi đáp án</button>`;
    }
    modal.show();
}

window.checkInput = (ans) => {
    isPaused = false; bootstrap.Modal.getInstance(document.getElementById('questionModal')).hide();
    (document.getElementById('ansInp').value === ans) ? nextLevel() : handleDeath();
};

function nextLevel() { if (currentLevel >= 20) endGame(true); else { currentLevel++; buildLevel(currentLevel); } }
function handleDeath() { lives--; document.getElementById('lives').innerText = "❤️".repeat(Math.max(0, lives)); if (lives <= 0) endGame(false); else { player.x = 50; player.y = 350; player.dy = 0; } }
function checkCollision(a, b) { return a.x < b.x + b.w && a.x + a.width > b.x && a.y < b.y + b.h && a.y + a.height > b.y; }
function endGame(win) { gameState = 'END'; clearInterval(timerInterval); alert(win ? "CHIẾN THẮNG! Bạn đã minh oan thành công!" : "THẤT BẠI! Bạn đã bị bắt lại!"); location.reload(); }

window.onkeydown = (e) => keys[e.code] = true; window.onkeyup = (e) => keys[e.code] = false;
initUI();