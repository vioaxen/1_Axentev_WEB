/**
 * Модуль для работы с cookie в браузере.
 * Предоставляет функции для установки, получения и удаления cookie.
 */

/**
 * Устанавливает cookie с заданным именем, значением и сроком действия.
 * @param {string} name - Имя cookie.
 * @param {string} value - Значение cookie.
 * @param {number} days - Количество дней, через которое cookie истечёт.
 */
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    const cookieString = name + "=" + (value || "") + expires + "; path=/";
    console.log("Setting cookie:", cookieString); // Отладка
    document.cookie = cookieString;
    console.log("Cookie after setting:", document.cookie); // Проверка результата
}

/**
 * Получает значение cookie по имени.
 * @param {string} name - Имя cookie.
 * @returns {string|null} Значение cookie или null, если cookie не найдено.
 */
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

/**
 * Удаляет cookie по имени.
 * @param {string} name - Имя cookie.
 */
function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
}