async function collectCoins() {
    console.log('[BOT] Скрипт запущен');

    while (true) {
        try {
            console.log('[BOT] Ожидание кнопки старта...');
            const startButton = await waitForElement('#root > div > div > div > div.sc-dstKZu.sc-keTIit.gUgNEr.qLQzp > div.sc-dstKZu.bGypib > div > div.sc-dstKZu.lhpnwN > div > div.sc-cHqXqK.sc-dCpCdO.fJzBrD.eEXrQQ > div.sc-dstKZu.sc-hWqaJQ.gUgNEr.bHeBpT > div.sc-khLCKb.sc-eMwmJz.jEPToZ.fSgyJd');

            if (startButton.disabled) {
                console.log('[BOT] Кнопка старта заблокирована. Завершение работы');
                break;
            }

            startButton.click();
            console.log('[BOT] Нажата кнопка старта');

            console.log('[BOT] Ожидание кнопки пропуска рекламы...');

            // Ждем появления любой из кнопок рекламы
            const adButton = await waitForAnyButton([
                { id: 'close_button' },
                { id: 'sonar-close' },
                { parent: 'google-rewarded-video', tag: 'button' },
                { text: 'Skip Ad' },
                { text: 'Пропустить' },
                { text: 'Закрыть' }
            ]);

            if (adButton) {
                console.log('[BOT] Найдена кнопка:', adButton.outerHTML);

                if (adButton.id === 'sonar-close') {
                    console.log('[BOT] Обработка sonar-close последовательности...');
                    adButton.click();
                    console.log('[BOT] Нажата первая #sonar-close');

                    const confirmButton = await waitForElement('#sonar-confirm-btn');
                    confirmButton.click();
                    console.log('[BOT] Нажата кнопка подтверждения');

                    await waitForElementRemoval('#sonar-confirm-btn');

                    const finalCloseButton = await waitForElement('#sonar-close');
                    finalCloseButton.click();
                    console.log('[BOT] Нажата вторая #sonar-close');
                } else {
                    console.log('[BOT] Ожидание 12 секунд...');
                    await sleep(12000);
                    adButton.click();
                    console.log('[BOT] Реклама пропущена');
                }
            }

            console.log('[BOT] Ожидание кнопки сбора монет...');
            const collectButton = await waitForElement('#root > div > div > div > div.sc-dstKZu.sc-keTIit.gUgNEr.qLQzp > div.sc-dstKZu.bGypib > div > div.sc-dstKZu.lhpnwN > div > div.sc-cHqXqK.sc-dCpCdO.fJzBrD.eEXrQQ > div.sc-dstKZu.sc-hWqaJQ.gUgNEr.bHeBpT > div.sc-khLCKb.sc-eMwmJz.jEPToZ.fSgyJd');
            collectButton.click();
            console.log('[BOT] Монеты собраны');

            console.log('[BOT] Ожидание кнопки подтверждения...');
            const okButton = await waitForElement('#ModalWrapperComponent > div.sc-khLCKb.sc-jhZTHU.bHgMog.bhGQFX > div');
            okButton.click();
            console.log('[BOT] Закрыт поп-ап подтверждения');

        } catch (error) {
            console.error('[BOT] Произошла ошибка:', error);
            break;
        }
    }
}

function findButton(criteria) {
    // Получаем все элементы на странице
    const allElements = document.querySelectorAll('*');

    for (const element of allElements) {
        // Проверка по ID
        if (criteria.id && element.id === criteria.id) {
            return element;
        }

        // Проверка по родителю и тегу
        if (criteria.parent && criteria.tag) {
            const parent = document.getElementById(criteria.parent);
            if (parent && element.tagName.toLowerCase() === criteria.tag.toLowerCase() &&
                parent.contains(element)) {
                return element;
            }
        }

        // Проверка по тексту
        if (criteria.text && element.textContent.trim() === criteria.text) {
            // Проверяем, является ли элемент или его родитель кликабельным
            const clickableElement = getClickableParent(element);
            if (clickableElement) {
                return clickableElement;
            }
        }
    }

    return null;
}

function getClickableParent(element) {
    let current = element;
    while (current) {
        if (current.tagName === 'BUTTON' ||
            current.tagName === 'A' ||
            current.onclick ||
            current.getAttribute('role') === 'button') {
            return current;
        }
        current = current.parentElement;
    }
    return null;
}

function waitForAnyButton(criteria) {
    return new Promise((resolve) => {
        // Сначала проверяем существующие элементы
        for (const criterion of criteria) {
            const element = findButton(criterion);
            if (element) {
                console.log('[BOT] Найдена существующая кнопка:', criterion);
                return resolve(element);
            }
        }

        const observer = new MutationObserver(() => {
            for (const criterion of criteria) {
                const element = findButton(criterion);
                if (element) {
                    observer.disconnect();
                    console.log('[BOT] Найдена новая кнопка:', criterion);
                    return resolve(element);
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
    });
}

function waitForElement(selector) {
    return new Promise((resolve) => {
        const element = document.querySelector(selector);
        if (element) return resolve(element);

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function waitForElementRemoval(selector) {
    return new Promise((resolve) => {
        if (!document.querySelector(selector)) {
            return resolve();
        }

        const observer = new MutationObserver(() => {
            if (!document.querySelector(selector)) {
                observer.disconnect();
                resolve();
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
    collectCoins();
} catch (error) {
    console.error('[BOT] Критическая ошибка:', error);
}
