async function dropClaimer() {
    console.log('[DROP] Скрипт запущен');

    while (true) {
        try {
            // Ждем появления кнопки дропа
            const dropButton = await waitForElement('#root > div > div > div > div.sc-dstKZu.sc-keTIit.dMGtil.qLQzp > div.sc-dstKZu.sc-bPCIsI.iocKyd.cUmOSp > div > div:nth-child(1) > div.sc-dstKZu.kBJVrf > div:nth-child(2) > div.sc-khLCKb.sc-eMwmJz.jEPToZ.hgfYHN', 5000);

            if (!dropButton) {
                console.log('[DROP] Кнопка дропа не найдена. Завершение работы');
                break;
            }

            console.log('[DROP] Найдена кнопка дропа');
            dropButton.click();
            console.log('[DROP] Нажата кнопка дропа');

            // Ждем появления кнопки подтверждения
            console.log('[DROP] Ожидание кнопки подтверждения...');
            const confirmButton = await waitForElement('#ModalWrapperComponent > div.sc-khLCKb.sc-jhZTHU.eucHEN.bhGQFX > div', 5000);

            if (confirmButton) {
                confirmButton.click();
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
