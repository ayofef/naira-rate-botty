import { config } from "dotenv";
config();
import axios from "axios";
import cron from "node-cron";
import { sendMessage } from "./sendToTelegram.js";

const API_URL = `${process.env.API_URL}`;

const ONE_MILLION_NAIRA = 1000000;

let cachedRates = 0;
let cachedAmountInEuro = 0;
let requestCount = 0;

const getCurrentRates = async () => {
    try {
        const response = await axios.get(API_URL);

        const quote = response.data.deliveryOptions.standard.paymentOptions.bank.quote;
        const rate = quote.rate;

        const amountInEuro = ONE_MILLION_NAIRA / rate;

        const rateDifference = cachedRates - rate;
        const differenceInEuro = cachedAmountInEuro - amountInEuro;

        // only send message if the rate has changed significantly and every 3 requests - 3 hours based on cron value
        if (rateDifference > 5 || requestCount % 3 === 0) {
            const message = `NGN1,000,000  = EUR${amountInEuro.toFixed(2)}(rate: ${rate}) (difference: EUR${differenceInEuro.toFixed(2)} (rate-difference: ${rateDifference}))`;

            console.log(message);
            await sendMessage(message);
        }

        // cache rates
        cachedRates = rate;
        // cache amount in euro
        cachedAmountInEuro = amountInEuro;
        // cache request count
        requestCount++;
    } catch (e) {
        // let me know when an error occurs
        await sendMessage(e.message);
    }
};

// runs every 30 minute of every hour of every day
cron.schedule("30 */1 * * *", getCurrentRates);
