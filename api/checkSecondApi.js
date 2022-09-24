import { config } from "dotenv";
config();
import axios from "axios";
import { composeRateNotification, sendMessage } from "../utils/index.js";

const API_URL = process.env.API_URL_TWO;
const key = "FLTRWVE";

export const checkSecondApi = async () => {
    try {
        const apiResponse = await axios.get(API_URL);

        const response = apiResponse?.data?.data?.find((dataObj) => dataObj?.toCurrencyCode === "NGN");

        const rate = response.exchangeRate;

        await composeRateNotification(rate, key);
    } catch (e) {
        // let me know when an error occurs
        await sendMessage(`${e.message} - ${key}`);
    }
};
