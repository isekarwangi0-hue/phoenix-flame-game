const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let score = 0;

// Karakter Phoenix
const phoenix = {
    x: canvas.width/2 - 30,
    y: canvas.height - 80,
    width: 60,
    height: 60,
    speed: 7
};

// Peluru api
let bullets = [];
let bulletSpeed = 8;

// Musuh
let enemies = [];
let enemySpeed = 2;
let spawnRate = 120; // Semakin kecil, semakin sering muncul
let frameCount = 0;

// Kontrol tombol
let keys = {};
document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

// Fungsi gambar
function drawPhoenix() {
    ctx.fillStyle = '#ff4500';
    ctx.beginPath();
    ctx.moveTo(phoenix.x + 30, phoenix.y);
    ctx.lineTo(phoenix.x, phoenix.y + 30);
    ctx.lineTo(phoenix.x + 60, phoenix.y + 30);
    ctx.lineTo(phoenix.x + 30, phoenix.y + 60);
    ctx.fill();
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(phoenix.x+30, phoenix.y+20, 8, 0, Math.PI*2);
    ctx.fill();
}

function drawBullets() {
    ctx.fillStyle = '#ffd700';
    bullets.forEach(bullet => {
        ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI*2);
    ctx.fill();
    bullet.y -= bulletSpeed;
    });
    // Hapus peluru yang keluar layar
    bullets = bullets.filter(b => b.y > 0);
}

function drawEnemies() {
    ctx.fillStyle = '#990000';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, 40, 40);
        enemy.y += enemySpeed;
    });
    enemies = enemies.filter(e => e.y < canvas.height);
}

// Cek tabrakan
function checkCollision() {
    enemies.forEach((enemy, eIndex) => {
        // Tabrakan dengan phoenix
        if (
            enemy.x < phoenix.x + phoenix.width &&
            enemy.x + 40 > phoenix.x &&
            enemy.y < phoenix.y + phoenix.height &&
            enemy.y + 40 > phoenix.y
        ) {
            alert(`💀 KALAH! Skor akhir kamu: ${score}\nBangkit lagi seperti Phoenix ya bos! 🪽🔥`);
            document.location.reload();
        }

        // Tabrakan dengan peluru
        bullets.forEach((bullet, bIndex) => {
            if (
                bullet.x > enemy.x &&
                bullet.x < enemy.x + 40 &&
                bullet.y > enemy.y &&
                bullet.y < enemy.y + 40
            ) {
                enemies.splice(eIndex, 1);
                bullets.splice(bIndex, 1);
                score += 10;
                document.getElementById('score').textContent = `Skor: ${score}`;
            }
        });
    });
}

// Update posisi & logika
function update() {
    // Gerak kiri
    if (keys['ArrowLeft'] && phoenix.x > 0) phoenix.x -= phoenix.speed;
    // Gerak kanan
    if (keys['ArrowRight'] && phoenix.x < canvas.width - phoenix.width) phoenix.x += phoenix.speed;
    // Tembak
    if (keys['Space'] && frameCount % 8 === 0) {
        bullets.push({x: phoenix.x + 30, y: phoenix.y});
    }

    // Munculkan musuh
    if(frameCount % spawnRate === 0) {
        enemies.push({
            x: Math.random() * (canvas.width - 40),
            y: -40
        });
    }

    frameCount++;
}

// Loop game
function gameLoop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawPhoenix();
    drawBullets();
    drawEnemies();
    checkCollision();
    update();
    requestAnimationFrame(gameLoop);
}

// Mulai game
gameLoop();
