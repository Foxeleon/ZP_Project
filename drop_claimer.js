async function dropClaimer() {
    console.log('[DROP] Скрипт запущен');

    while (true) {
        try {
            // Ждем появления кнопки дропа
            const dropButton = await waitForElement('#root > div > div > div > div.sc-keTIit.sc-dpBQxM.jWrQnU.jTRQep > div.sc-keTIit.sc-gluGTh.eixkcc.jQjXUq > div > div:nth-child(1) > div.sc-keTIit.gRUJyW > div:nth-child(2) > div.sc-dstKZu.sc-drVZOg.grXdHv.hvXREJ', 5000);

            if (!dropButton) {
                console.log('[DROP] Кнопка дропа не найдена. Завершение работы');
                break;
            }

            console.log('[DROP] Найдена кнопка дропа');
            simulateHumanClick(dropButton);
            console.log('[DROP] Нажата кнопка дропа');

            // Ждем появления кнопки подтверждения
            console.log('[DROP] Ожидание кнопки подтверждения...');
            const confirmButton = await waitForElement('#ModalWrapperComponent > div.sc-dstKZu.sc-epnzzT.eYosiC.cgRJVh > div', 5000);

            if (confirmButton) {
                simulateHumanClick(confirmButton);
                console.log('[DROP] Нажата кнопка подтверждения');
            }

            // Небольшая пауза перед следующей итерацией
            await sleep(2000);

        } catch (error) {
            console.error('[DROP] Произошла ошибка:', error);
            break;
        }
    }

    console.log('[DROP] Скрипт завершил работу');
}

function simulateHumanClick(element) {
    const rect = element.getBoundingClientRect();

    // Получаем случайные координаты в пределах области 20x20 пикселей
    const x = rect.left + rect.width/2 + (Math.random() * 20 - 10);
    const y = rect.top + rect.height/2 + (Math.random() * 20 - 10);

    // Создаем события мыши
    const mouseDown = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: x,
        clientY: y
    });

    const mouseUp = new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: x,
        clientY: y
    });

    const click = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: x,
        clientY: y
    });

    // Отправляем события
    element.dispatchEvent(mouseDown);
    element.dispatchEvent(mouseUp);
    element.dispatchEvent(click);
}

function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const startTime = Date.now();

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            } else if (Date.now() - startTime >= timeout) {
                observer.disconnect();
                resolve(null);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Запуск скрипта
try {
    dropClaimer();
} catch (error) {
    console.error('[DROP] Критическая ошибка:', error);
}