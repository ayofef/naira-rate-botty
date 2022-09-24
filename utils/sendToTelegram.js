import axios from "axios";

const telegram = (message) => `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=@${process.env.CHAT_ID}&parse_mode=HTML&text=${message}`;

export async function sendMessage(message) {
    const parseMessage = encodeURIComponent(message);
    try {
        await axios.post(telegram(parseMessage));
    } catch {
        // console.log("🚀 ~ file: sendToTelegram.js ~ line 10 ~ sendMessage ~ res", "error", e);
        // ignore
    }
}
