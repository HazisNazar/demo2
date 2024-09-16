let points = 0;
let pointsPerClick = 1;
let upgradeCost = 100;
let isBoostActive = false;
let boostDuration = 60; // Секунди
let boostCooldown = 3600; // Секунди
let timeUntilNextBoost = 0;
let boostInterval;
let cooldownInterval;
const activeUser = localStorage.getItem('activeUser');

if (activeUser) {
    loadProgress(); // Завантаження прогресу користувача
} else {
    window.location.href = 'login.html'; // Якщо немає активного користувача, перенаправляємо на сторінку логіну
}

function saveProgress() {
    const userData = {
        points,
        pointsPerClick,
        upgradeCost,
        timeUntilNextBoost
    };
    localStorage.setItem(activeUser, JSON.stringify(userData));
}

function loadProgress() {
    const savedData = localStorage.getItem(activeUser);
    if (savedData) {
        const { points: savedPoints, pointsPerClick: savedPPC, upgradeCost: savedUpgradeCost, timeUntilNextBoost: savedTimeUntilNextBoost } = JSON.parse(savedData);
        points = savedPoints || 0;
        pointsPerClick = savedPPC || 1;
        upgradeCost = savedUpgradeCost || 100;
        timeUntilNextBoost = savedTimeUntilNextBoost || 0;
        updateDisplay();
    }
}

document.getElementById('click-btn').addEventListener('click', () => {
    points += pointsPerClick;
    updateDisplay();
    saveProgress();
});

document.getElementById('upgrade-btn').addEventListener('click', () => {
    if (points >= upgradeCost) {
        points -= upgradeCost;
        pointsPerClick += 1;
        upgradeCost *= 2;
        updateDisplay();
        saveProgress();
    }
});

document.getElementById('boost-btn').addEventListener('click', () => {
    if (!isBoostActive && timeUntilNextBoost === 0) {
        isBoostActive = true;
        pointsPerClick = 100;
        boostDuration = 60; // 60 секунд

        boostInterval = setInterval(() => {
            boostDuration -= 1;
            updateDisplay();

            if (boostDuration <= 0) {
                clearInterval(boostInterval);
                pointsPerClick = 1;
                isBoostActive = false;
                timeUntilNextBoost = boostCooldown;
                startCooldown();
                updateDisplay();
                saveProgress();
            }
        }, 1000);

        updateDisplay();
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    saveProgress(); // Зберігаємо прогрес перед виходом
    localStorage.removeItem('activeUser'); // Видаляємо активного користувача
    window.location.href = 'login.html'; // Перенаправляємо на сторінку авторизації
});

function startCooldown() {
    cooldownInterval = setInterval(() => {
        timeUntilNextBoost -= 1;
        if (timeUntilNextBoost <= 0) {
            clearInterval(cooldownInterval);
            updateDisplay();
        } else {
            updateDisplay();
        }
    }, 1000);
}

function updateDisplay() {
    document.getElementById('points').innerText = `Поінти: ${points}`;
    document.getElementById('upgrade-btn').innerText = `Прокачати клік (${upgradeCost} поінтів)`;
    if (isBoostActive) {
        document.getElementById('boost-btn').innerText = `Буст активний (${boostDuration} сек)`;
        document.getElementById('boost-btn').disabled = true;
    } else {
        if (timeUntilNextBoost > 0) {
            document.getElementById('boost-btn').innerText = `Буст (через ${Math.floor(timeUntilNextBoost / 60)} хв)`;
            document.getElementById('boost-btn').disabled = true;
        } else {
            document.getElementById('boost-btn').innerText = `Буст (Безкоштовно)`;
            document.getElementById('boost-btn').disabled = false;
        }
    }
}
