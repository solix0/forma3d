// webhook.js - ТУТ ЗБЕРІГАЄТЬСЯ ВАШ СЕКРЕТНИЙ WEBHOOK
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1486432339096502457/MKBiDKdXRXhTey8RSjB0WDl3non0EkKHZq3zSZOObbyvkG6EdNYNB9k-2dgU7Rd17Jfl';

// Функція відправки в Discord
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