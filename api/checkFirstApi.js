import { config } from "dotenv";
config();
import axios from "axios";
import { composeRateNotification, sendMessage } from "../utils/index.js";

const API_URL = process.env.API_URL_ONE;

const key = "GTRNSFR";

export const checkFirstApi = async () => {
    try {
        const response = await axios.get(API_URL);

        const quote = response.data.deliveryOptions.standard.paymentOptions.bank.quote;
        const rate = quote.rate;

        await composeRateNotification(rate, key);
    } catch (e) {
        // let me know when an error occurs
        await sendMessage(`${e.message} - ${key}`);
    }
};
