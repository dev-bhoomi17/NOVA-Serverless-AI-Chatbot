
/* =====================================================
   NOVA — CHAT API TESTS
===================================================== */

import {
    test,
    before,
    after
} from "node:test";

import assert from "node:assert/strict";

import {
    GET,
    POST
} from "../api/chat.js";

import {
    normalizeHistory
} from "../lib/prompt.js";


const originalApiKey = process.env.GEMINI_API_KEY;


// Keep API tests in local demo mode.
before(() => {
    delete process.env.GEMINI_API_KEY;
});


after(() => {

    if (originalApiKey === undefined) {
        delete process.env.GEMINI_API_KEY;
    } else {
        process.env.GEMINI_API_KEY = originalApiKey;
    }

});


function createPostRequest(body, contentType = "application/json") {

    return new Request("http://localhost/api/chat", {

        method: "POST",

        headers: {
            "Content-Type": contentType
        },

        body: typeof body === "string"
            ? body
            : JSON.stringify(body)

    });

}


// ==========================================
// HEALTH CHECK
// ==========================================

test("GET returns API health information", async () => {

    const response = await GET(
        new Request("http://localhost/api/chat")
    );

    const data = await response.json();

    assert.equal(response.status, 200);
    assert.equal(data.status, "ok");
    assert.equal(data.service, "NOVA Chat API");
    assert.equal(data.mode, "demo");

});


// ==========================================
// VALID CHAT REQUEST
// ==========================================

test("POST returns a demo response for a valid message", async () => {

    const response = await POST(
        createPostRequest({
            message: "Explain serverless computing.",
            history: []
        })
    );

    const data = await response.json();

    assert.equal(response.status, 200);
    assert.equal(data.mode, "demo");
    assert.equal(typeof data.reply, "string");
    assert.ok(data.reply.includes("serverless"));

});


// ==========================================
// EMPTY MESSAGE
// ==========================================

test("POST rejects an empty message", async () => {

    const response = await POST(
        createPostRequest({
            message: "   "
        })
    );

    const data = await response.json();

    assert.equal(response.status, 400);
    assert.ok(data.error);

});


// ==========================================
// MESSAGE LENGTH VALIDATION
// ==========================================

test("POST rejects messages exceeding the length limit", async () => {

    const response = await POST(
        createPostRequest({
            message: "x".repeat(4001)
        })
    );

    assert.equal(response.status, 413);

});


// ==========================================
// INVALID JSON
// ==========================================

test("POST rejects malformed JSON", async () => {

    const response = await POST(
        createPostRequest("{invalid-json")
    );

    assert.equal(response.status, 400);

});


// ==========================================
// CONTENT TYPE VALIDATION
// ==========================================

test("POST rejects unsupported content types", async () => {

    const response = await POST(
        createPostRequest(
            "message=hello",
            "text/plain"
        )
    );

    assert.equal(response.status, 415);

});


// ==========================================
// HISTORY VALIDATION
// ==========================================

test("Conversation history removes invalid entries", () => {

    const history = normalizeHistory([

        {
            role: "user",
            content: "Hello"
        },

        {
            role: "system",
            content: "Invalid client instruction"
        },

        {
            role: "assistant",
            content: "Hello! How can I help?"
        },

        {
            role: "user",
            content: ""
        }

    ]);

    assert.equal(history.length, 2);

    assert.equal(history[0].role, "user");

    assert.equal(history[1].role, "assistant");

});
