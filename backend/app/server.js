const app = require("./app");

const PORT = process.env.PORT || 4000;
const HOST = "0.0.0.0"; // indispensable pour Docker

app.listen(PORT, HOST, () => {
    console.log(`Campfire API démarrée sur http://${HOST}:${PORT}`);
});
