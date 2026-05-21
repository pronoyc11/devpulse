import app from "./app";
import config from "./config";
import { connectDB } from "./db";



app.listen(config.port, () => {
    connectDB();
    console.log(`App is listening on ${config.port}`);
});
