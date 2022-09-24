import { ONE_MILLION_NAIRA } from "../constant.js";
import { sendMessage } from "./sendToTelegram.js";

let cachedRates = 0;
let cachedAmountInEuro = 0;
let requestCount = 0;

const INCREASE_EMOJI = "🌟";
const DECREASE_EMOJI = "🔻";
const EQUAL_EMOJI = "📊";

const getEmoji = (rate) => {
    if (rate > cachedRates) {
        return INCREASE_EMOJI;
    } else if (rate < cachedRates) {
        return DECREASE_EMOJI;
    } else {
        return EQUAL_EMOJI;
    }
};

export const composeRateNotification = async (rate = 0, key = "") => {
    try {
        const amountInEuro = ONE_MILLION_NAIRA / rate;

        const rateDifference = rate - cachedRates;
        const differenceInEuro = amountInEuro - cachedAmountInEuro;

        const emoji = getEmoji(rate);

        // only send message if the rate has changed significantly and every 3 requests - 3 hours based on cron value
        if (rateDifference > 5 || requestCount % 3 === 0) {
            const message = `${key} ${emoji}
        NGN1,000,000  = EUR${amountInEuro.toFixed(2)}
        (rate: ${rate}) 
        (difference: EUR${differenceInEuro.toFixed(2)} 
        (rate-difference: ${rateDifference}))`;

            await sendMessage(message);
        }
    } catch (e) {
        // let me know when an error occurs
        await sendMessage(`${e.message} - ${key}`);
    }
};
