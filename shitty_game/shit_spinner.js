const shit_spinner = {
    isRunning: false,
    timeoutId: null,

    start: function(clickCount) {
        this.isRunning = true;
        let currentClicks = 0;

        const spinButton = document.querySelector('body > app-root > div.app-container > app-daily-wheel > div > button.spin-button.main-button.pink-button-horizontal.flex-column.scaleOne');

        const executeClick = () => {
            if (!this.isRunning || currentClicks >= clickCount) {
                this.stop();
                return;
            }

            spinButton.click();
            currentClicks++;

            // Генерируем случайную задержку между 8000 и 13000 миллисекунд
            const randomDelay = Math.floor(Math.random() * (13000 - 8000 + 1)) + 8000;

            this.timeoutId = setTimeout(executeClick, randomDelay);
        };

        executeClick();
    },

    stop: function() {
        this.isRunning = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
};
