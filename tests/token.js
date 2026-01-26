require("dotenv").config();

const http = require("http");
const fs = require("fs");
const path = require("path");
const twilio = require("twilio");

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

const PORT = 3002;

const server = http.createServer((req, res) => {

    // ✅ Serve HTML
    if (req.method === "GET" && req.url === "/") {
        const html = fs.readFileSync(path.join(__dirname, "call.html"), "utf8");
        res.writeHead(200, { "Content-Type": "text/html" });
        return res.end(html);
    }

    // ✅ Serve Twilio SDK
    if (req.method === "GET" && req.url === "/twilio.min.js") {
        const js = fs.readFileSync(path.join(__dirname, "twilio.min.js"));
        res.writeHead(200, { "Content-Type": "application/javascript" });
        return res.end(js);
    }

    // ✅ Token endpoint
    if (req.method === "GET" && req.url === "/token") {
        try {
            const token = new AccessToken(
                process.env.TWILIO_ACCOUNT_SID,
                process.env.TWILIO_API_KEY,
                process.env.TWILIO_API_SECRET,
                { identity: "test-user" }
            );

            const voiceGrant = new VoiceGrant({
                outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
                incomingAllow: true,
            });

            token.addGrant(voiceGrant);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ token: token.toJwt() }));
        } catch (err) {
            res.writeHead(500);
            res.end(err.message);
        }
        return;
    }

    // ❌ Anything else
    res.writeHead(404);
    res.end("Not found");
});

server.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
console.log({
    ACCOUNT: process.env.TWILIO_ACCOUNT_SID,
    API_KEY: process.env.TWILIO_API_KEY,
    API_SECRET: process.env.TWILIO_API_SECRET,
    TWIML_APP: process.env.TWILIO_TWIML_APP_SID,
});
