import { WebviewWindow } from '@tauri-apps/api/webviewwindow';

document.addEventListener('DOMContentLoaded', () => {
    const minutesInput = document.getElementById('minutesInput') as HTMLInputElement;
    const startButton = document.getElementById('startButton') as HTMLButtonElement;
    const stopButton = document.getElementById('stopButton') as HTMLButtonElement;
    const timerDisplay = document.getElementById('timerDisplay') as HTMLDivElement;
    const restartCountDisplay = document.getElementById('restartCount') as HTMLSpanElement;
    const openSettingsButton = document.getElementById('openSettings') as HTMLButtonElement;

    let countdownInterval: number;
    let timeLeft: number;
    let restartCount: number = 0;
    let isRunning: boolean = false;
    let settings = {
        language: 'zh-CN',
        endAction: 'alert',
        programPath: ''
    };
    loadSettings();

    function loadSettings() {
        const savedSettings = localStorage.getItem('timerSettings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
        }
    }
    function updateDisplay() {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function startTimer() {
        if (isRunning) {
            // Pause the timer
            clearInterval(countdownInterval);
            startButton.textContent = '开始';
            isRunning = false;
        } else {
            // Start the timer
            timeLeft = parseInt(minutesInput.value) * 60;
            if (isNaN(timeLeft) || timeLeft <= 0) {
                alert('请输入有效的分钟数');
                return;
            }

            updateDisplay();

            countdownInterval = setInterval(() => {
                timeLeft--;
                updateDisplay();

                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    handleTimerEnd();
                    restartCount++;
                    restartCountDisplay.textContent = `重新开始次数: ${restartCount}`;
                    isRunning = false;
                    startButton.textContent = '开始';
                }
            }, 1000);

            startButton.textContent = '暂停';
            isRunning = true;
        }
    }

    function stopTimer() {
        clearInterval(countdownInterval);
        timerDisplay.textContent = '00:00:00';
        restartCount = 0;
        restartCountDisplay.textContent = `重新开始次数: ${restartCount}`;
        isRunning = false;
        startButton.textContent = '开始';
    }

    function handleTimerEnd() {
        switch (settings.endAction) {
            case 'alert':
                alert('倒计时结束');
                break;
            case 'sound':
                // TODO: Implement sound playback
                alert('播放声音文件功能尚未实现');
                break;
            case 'program':
                // TODO: Implement program execution
                alert('启动特定程序功能尚未实现');
                break;
        }
    }

    minutesInput.addEventListener('wheel', (event: WheelEvent) => {
        event.preventDefault();
        let currentValue = parseInt(minutesInput.value) || 0;
        if (event.deltaY < 0) {
            minutesInput.value = String(currentValue + 5);
        } else {
            minutesInput.value = String(Math.max(0, currentValue - 5));
        }
    });

    minutesInput.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            let currentValue = parseInt(minutesInput.value) || 0;
            minutesInput.value = String(currentValue + 5);
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            let currentValue = parseInt(minutesInput.value) || 0;
            minutesInput.value = String(Math.max(0, currentValue - 5));
        }
    });

    startButton.addEventListener('click', startTimer);
    stopButton.addEventListener('click', stopTimer);
    timerDisplay.addEventListener('click', startTimer);

    openSettingsButton.addEventListener('click', () => {
        const settingsWindow = new WebviewWindow('settings');
        settingsWindow.emit('open_settings');

    });
});
