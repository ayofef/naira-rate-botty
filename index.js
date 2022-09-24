import cron from "node-cron";
import { checkFirstApi, checkSecondApi } from "./api/index.js";

const getCurrentRates = async () => {
    try {
        await checkFirstApi();
        await checkSecondApi();
    } catch (e) {
        // let me know when an error occurs
        await sendMessage(`${e.message} - getCurrentRates`);
    }
};
// At minute 30 past every hour from 6 through 20 on every day-of-week from Monday through Friday.
cron.schedule("30 6-20 * * 1-5", getCurrentRates);
