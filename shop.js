// === ГЛОБАЛЬНІ ЗМІННІ ===
const header = document.getElementById('navbar');
const sections = document.querySelectorAll('section');
let lastScroll = 0;
let selectedColor = ""; // Зберігаємо обраний колір для замовлення

// === ЛОГІКА ХЕДЕРА (Scroll & Load) ===
window.addEventListener('load', () => {
    setTimeout(() => { header.classList.add('visible'); }, 300);
});

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.top = "-100px";
    } else {
        header.style.top = currentScroll > 50 ? "10px" : "20px";
        header.classList.toggle('scrolled', currentScroll > 50);
    }
    lastScroll = currentScroll;
});

// === БІЧНА ПАНЕЛЬ ЗВ'ЯЗКУ ===
function openContact() {
    document.getElementById("contactBar").classList.add("active");
    document.getElementById("contactOverlay").classList.add("active");
    document.getElementById("horizontalContact").style.opacity = "0";
}

function closeContact() {
    document.getElementById("contactBar").classList.remove("active");
    document.getElementById("contactOverlay").classList.remove("active");
    setTimeout(() => { document.getElementById("horizontalContact").style.opacity = "1"; }, 400);
}

// Відправка повідомлення з бічної панелі
function sendMail() {
    const poshta = "forma3d.info.ua@gmail.com";
    const polePovidomlennya = document.getElementById("message");
    const tekstPovidomlennya = polePovidomlennya.value.trim();
    
    if (!tekstPovidomlennya) { 
        polePovidomlennya.classList.add("pomylka");
        polePovidomlennya.placeholder = "Будь ласка, введіть текст...";
        setTimeout(() => { polePovidomlennya.classList.remove("pomylka"); }, 1500);
        return; 
    }

    const temaLista = encodeURIComponent("Запитання Forma3D");
    const tekstEncoded = encodeURIComponent(tekstPovidomlennya);
    const isWindows = navigator.platform.toLowerCase().includes('win');

    if (isWindows) {
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${poshta}&su=${temaLista}&body=${tekstEncoded}`, '_blank');
    } else {
        window.location.href = `mailto:${poshta}?subject=${temaLista}&body=${tekstEncoded}`;
    }
    closeContact();
}

// === МОДАЛЬНЕ ВІКНО ЗАМОВЛЕННЯ ТА ВИБІР КОЛЬОРУ ===

// Блокування введення літер у поле телефону (тільки цифри)
document.getElementById('userPhone').addEventListener('input', function (e) {
    e.target.value = e.target.value.replace(/\D/g, ''); 
});

/**
 * Відкриття модалки з перевіркою кольору
 * @param {string} productName - назва товару
 * @param {HTMLElement} btn - посилання на кнопку (this)
 */
function openOrderModal(productName, btn) {
    const cardInfo = btn.closest('.card-info');
    const colorSelect = cardInfo.querySelector('.color-select');
    
    // Знаходимо артикул у цій же картці
    const skuBtn = cardInfo.querySelector('.sku-btn');
    const productSKU = skuBtn ? skuBtn.innerText.replace('Арт: ', '') : 'Не вказано';

    // 🔥 НОВЕ: Знаходимо тип друку (FDM/SLA) з бейджа
    const card = cardInfo.closest('.card');
    const badge = card.querySelector('.product-badge');
    const printType = badge ? badge.innerText.trim() : 'Невідомо';

    if (!colorSelect.value) {
        colorSelect.classList.add("color-error");
        setTimeout(() => { colorSelect.classList.remove("color-error"); }, 1500);
        return;
    }

    selectedColor = colorSelect.value;
    const modal = document.getElementById("orderModal");
    
    // Записуємо дані в приховані поля модалки
    document.getElementById("currentProductName").value = productName;
    document.getElementById("currentProductSKU").value = productSKU;
    document.getElementById("currentPrintType").value = printType; // 🔥 Зберігаємо тип друку
    document.getElementById("selectedProductTitle").innerText = `${productName} (${selectedColor})`;
    
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeOrderModal() {
    const modal = document.getElementById("orderModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    document.getElementById("userPhone").value = ""; 
}

function handleOutsideClick(event) {
    if (event.target.id === "orderModal") closeOrderModal();
}

// === ДОПОМІЖНІ ФУНКЦІЇ ===

// Пряма відправка пошти (для футера)
function sendMailDirect(email, subjectText = "Питання щодо Forma3D") {
    const temaLista = encodeURIComponent(subjectText);
    const tekstEncoded = encodeURIComponent("Вітаю! У мене є питання щодо...");
    const isWindows = navigator.platform.toLowerCase().includes('win');

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${temaLista}&body=${tekstEncoded}`;
    const mailtoUrl = `mailto:${email}?subject=${temaLista}&body=${tekstEncoded}`;

    if (isWindows) {
        window.open(gmailUrl, '_blank');
    } else {
        window.location.href = mailtoUrl;
    }
}

// Оновлення року у футері
document.getElementById("current-year").textContent = new Date().getFullYear();

function filterCategory(category) {
    const cards = document.querySelectorAll('.card');
    const buttons = document.querySelectorAll('.filter-btn');

    // Оновлюємо активну кнопку
    buttons.forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    cards.forEach(card => {
        // Якщо обрано "Усі" або клас картки збігається з категорією
        if (category === 'all' || card.classList.contains(`category-${category}`)) {
            card.style.display = "flex";
            setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "scale(1)";
            }, 10);
        } else {
            card.style.opacity = "0";
            card.style.transform = "scale(0.95)";
            setTimeout(() => {
                card.style.display = "none";
            }, 300); // Час має збігатися з CSS transition
        }
    });

    // Ховаємо порожню картку "card-empty" при фільтрації, щоб не заважала
    const emptyCard = document.querySelector('.card-empty');
    if (emptyCard) {
        emptyCard.style.display = category === 'all' ? 'flex' : 'none';
    }
}

function copySKU(element, sku) {
    // Копіюємо текст в буфер
    navigator.clipboard.writeText(sku).then(() => {
        // Додаємо клас для ефекту "білої кнопки"
        element.classList.add('active-copy');
        const originalText = element.innerText;
        element.innerText = 'СКОПІЙОВАНО';

        // Через 2 секунди повертаємо все назад
        setTimeout(() => {
            element.classList.remove('active-copy');
            element.innerText = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Не вдалося скопіювати: ', err);
    });
}

function toggleSearchMobile() {
    const wrapper = document.getElementById('searchWrapper');
    const input = document.getElementById('mainSearch');
    
    if (window.innerWidth <= 768) {
        wrapper.classList.add('active');
        input.focus();
    }
}

function handleBlur() {
    const wrapper = document.getElementById('searchWrapper');
    const input = document.getElementById('mainSearch');
    
    // Якщо поле порожнє і це мобільний — згортаємо назад в іконку
    if (input.value === "" && window.innerWidth <= 768) {
        wrapper.classList.remove('active');
    }
}

// Функція пошуку
function liveSearch() {
    const input = document.getElementById('mainSearch').value.toLowerCase();
    const suggestionsContainer = document.getElementById('searchSuggestions');
    const cards = document.querySelectorAll('.card');
    
    // Очищуємо попередні результати
    suggestionsContainer.innerHTML = '';

    if (input.length < 1) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    let foundAny = false;

    cards.forEach(card => {
        const title = card.querySelector('h3').innerText;
        const price = card.querySelector('.price-row p').innerText;
        const imgSrc = card.querySelector('.card-image img').src;
        const skuText = card.querySelector('.sku-btn')?.innerText || "";

        if (title.toLowerCase().includes(input) || skuText.toLowerCase().includes(input)) {
            foundAny = true;
            
            // Створюємо елемент підказки
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerHTML = `
                <img src="${imgSrc}">
                <div class="suggestion-info">
                    <h4>${title}</h4>
                    <span>${price}</span>
                </div>
            `;
            
div.onclick = () => {
    // 1. Плавний скрол до картки товару
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // 2. Ефект підсвічування обраного товару (опціонально)
    card.style.borderColor = 'white';
    setTimeout(() => card.style.borderColor = '', 2000);

    // 3. Згортання пошуку
    const wrapper = document.getElementById('searchWrapper');
    const input = document.getElementById('mainSearch');
    const suggestionsContainer = document.getElementById('searchSuggestions');

    suggestionsContainer.style.display = 'none'; // Ховаємо випадаючий список
    input.value = '';                            // Очищуємо текст
    input.blur();                                // Прибираємо клавіатуру (фокус)
    
    // Якщо ми на мобільці — згортаємо синю/білу рамку пошуку
    if (window.innerWidth <= 768) {
        wrapper.classList.remove('active');
    }
};
            
            suggestionsContainer.appendChild(div);
        }
    });

    suggestionsContainer.style.display = foundAny ? 'block' : 'none';
}

// Закриваємо підказки, якщо клікнули поза пошуком
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        document.getElementById('searchSuggestions').style.display = 'none';
    }
});

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    cart = JSON.parse(localStorage.getItem('forma3d_cart')) || [];
    updateCartUI();
});

function saveCart() {
    localStorage.setItem('forma3d_cart', JSON.stringify(cart));
}

function addToCart(btn) {
    // 1. Перевіряємо, чи кнопка вже в стані "ДОДАНО"
    // Це важливо, щоб таймер не скидався при кожному кліку
    if (btn.classList.contains('added')) return;

    const card = btn.closest('.card-info');
    const title = card.querySelector('h3').innerText;
    
    // Отримуємо ціну (прибираємо пробіли та "₴", якщо вони є, щоб parseInt спрацював чисто)
    const priceText = card.querySelector('.price-row p').innerText;
    const price = parseInt(priceText.replace(/[^0-9]/g, '')); 
    
    const colorSelect = card.querySelector('.color-select');

    // Перевірка вибору кольору
    if (!colorSelect.value) {
        colorSelect.classList.add("color-error");
        setTimeout(() => colorSelect.classList.remove("color-error"), 1500);
        return;
    }

    const color = colorSelect.value;
    const existing = cart.find(item => item.title === title && item.color === color);

    if (existing) {
        existing.qty += 1;
    } else {
        const sku = card.querySelector('.sku-btn')?.innerText || '';
        // 🔥 Отримуємо тип друку з бейджа
        const cardParent = card.closest('.card');
        const badge = cardParent.querySelector('.product-badge');
        const printType = badge ? badge.innerText.trim() : '';
        
        cart.push({
            title,
            price,
            color,
            sku,
            printType, // 🔥 Зберігаємо тип друку
            qty: 1
        });
    }

    // 2. ФІДБЕК КНОПКИ
    const originalText = btn.innerText;
    btn.classList.add('added');
    btn.innerText = 'ДОДАНО';

    // 3. Повертаємо початковий стан через 2 секунди
    setTimeout(() => {
        btn.classList.remove('added');
        btn.innerText = originalText;
    }, 2000);

    updateCartUI();
    saveCart();
}
function updateCartUI() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    const countEl = document.getElementById('cartCount');

    container.innerHTML = "";

    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;
        count += item.qty;

container.innerHTML += `
<div style="margin-bottom:15px; border-bottom:1px solid #333; padding-bottom:10px;">
    <b>${item.title}</b><br>
    Колір: ${item.color}<br>
    ${item.printType ? `Тип: ${item.printType}` : ''}
    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
        
        <div class="qty-controls" style="user-select: none; -webkit-user-select: none; display: flex; align-items: center;">
            <div class="qty-btn" onclick="changeQty(${index}, -1)" style="cursor:pointer; padding: 0 5px;">−</div>
            <div class="qty-number" style="margin: 0 10px;">${item.qty}</div>
            <div class="qty-btn" onclick="changeQty(${index}, 1)" style="cursor:pointer; padding: 0 5px;">+</div>
        </div>

        <div style="user-select: none; -webkit-user-select: none; display: flex; align-items: center;">
            <span>${item.price * item.qty} ₴</span>
            <span onclick="removeItem(${index})" 
                  style="cursor:pointer; margin-left:15px; font-size: 1.1em; display: inline-block; line-height: 1;">
                  ✖
            </span>
        </div>

    </div>
</div>
`;
    });

    totalEl.innerText = total;
    countEl.innerText = count;
}

function changeQty(index, delta) {
    cart[index].qty += delta;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

        updateCartUI();
    saveCart();
}

function removeItem(index) {
    cart.splice(index, 1);
        updateCartUI();
    saveCart();
}

function openCart() {
    document.getElementById("cartModal").style.display = "flex";
}

function closeCart() {
    document.getElementById("cartModal").style.display = "none";
}

document.getElementById('cartPhone').addEventListener('input', function (e) {
    e.target.value = e.target.value.replace(/\D/g, '');
});

document.addEventListener('DOMContentLoaded', () => {
    cart = JSON.parse(localStorage.getItem('forma3d_cart')) || [];
    updateCartUI();
});

const DISCORD_WEBHOOK_URL = 'DISCORD_WEBHOOK_PLACEHOLDER';

// === ФУНКЦІЯ ВІДПРАВКИ В DISCORD ===
async function sendToDiscord(content) {
    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: content })
        });
        return response.ok;
    } catch (error) {
        console.error('Discord Error:', error);
        return false;
    }
}

// Функція для ефекту "Крутіння лого"
function showSuccessAnimation() {
    const loader = document.getElementById('orderLoader');
    
    // Закриваємо всі відкриті модалки
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    
    // Додаємо блюр на фон та показуємо лого
    document.body.classList.add('processing');
    loader.style.display = 'block';

    // Через 2 секунди все прибираємо
    setTimeout(() => {
        document.body.classList.remove('processing');
        loader.style.display = 'none';
        document.body.style.overflow = "auto";
    }, 2000);
}

// === ЗАМОВЛЕННЯ ОДНОГО ТОВАРУ ===
async function validateAndSend() {
    const phoneInput = document.getElementById("userPhone");
    const phone = phoneInput.value.trim();
    const productName = document.getElementById("currentProductName").value;
    const productSKU = document.getElementById("currentProductSKU").value;
    const printType = document.getElementById("currentPrintType").value; // 🔥 Отримуємо тип друку
    
    if (phone.length < 5) {
        phoneInput.classList.add("input-error");
        setTimeout(() => phoneInput.classList.remove("input-error"), 1500);
        return;
    }

    const message = `**📦 НОВЕ ЗАМОВЛЕННЯ (${printType})**\n**Товар:** ${productName}\n**Арт:** ${productSKU}\n**Колір:** ${selectedColor}\n**Телефон:** \`${phone}\``;

    // Запускаємо анімацію відразу (UX: користувач бачить результат миттєво)
    showSuccessAnimation();
    
    // Відправляємо в Discord паралельно
    await sendToDiscord(message);
    phoneInput.value = "";
}

// === ЗАМОВЛЕННЯ З КОШИКА ===
async function sendCartOrder() {
    const phoneInput = document.getElementById("cartPhone");
    const phone = phoneInput.value.trim();

    if (phone.length < 5 || cart.length === 0) {
        phoneInput.classList.add("input-error");
        setTimeout(() => phoneInput.classList.remove("input-error"), 1500);
        return;
    }

    let text = `**🛒 ЗАМОВЛЕННЯ З КОШИКА**\n\n`;
    cart.forEach((item, i) => {
        text += `${i + 1}. **${item.title}** [${item.sku}] (${item.printType || 'Невідомо'})\n   Колір: ${item.color} | ${item.qty} шт.\n\n`;
    });
    text += `**Сума:** ${document.getElementById('cartTotal').innerText} ₴\n**Тел:** \`${phone}\``;

    // Запускаємо анімацію
    showSuccessAnimation();

    // Чистимо кошик і шлемо в Discord
    await sendToDiscord(text);
    cart = [];
    localStorage.removeItem('forma3d_cart');
    updateCartUI();
    phoneInput.value = "";
}