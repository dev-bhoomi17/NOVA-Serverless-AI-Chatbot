
/* =====================================================
   NOVA — SERVERLESS CHAT API
   HTTP request validation and response handling
===================================================== */

import {
    normalizeHistory,
    MAX_MESSAGE_LENGTH
} from "../lib/prompt.js";

import {
    generateAssistantReply
} from "../lib/llm.js";


/* =====================================================
   01. HEALTH CHECK
===================================================== */

export async function GET() {

    const isConfigured = Boolean(
        process.env.GEMINI_API_KEY &&
        process.env.GEMINI_API_KEY.trim() &&
        process.env.GEMINI_API_KEY !== "your_api_key_here"
    );

    return Response.json({

        status: "ok",

        service: "NOVA Chat API",

        mode: isConfigured ? "live" : "demo",

        timestamp: new Date().toISOString()

    });

}


/* =====================================================
   02. PROCESS CHAT REQUEST
===================================================== */

export async function POST(request) {

    // Validate request type
    const contentType =
        request.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {

        return Response.json({

            error: "Content-Type must be application/json."

        }, {
            status: 415
        });

    }


    // Parse request body
    let body;

    try {

        body = await request.json();

    } catch {

        return Response.json({

            error: "Invalid JSON request body."

        }, {
            status: 400
        });

    }


    // Validate body structure
    if (
        !body ||
        typeof body !== "object" ||
        Array.isArray(body)
    ) {

        return Response.json({

            error: "A valid request object is required."

        }, {
            status: 400
        });

    }


    // Validate message
    if (
        typeof body.message !== "string" ||
        !body.message.trim()
    ) {

        return Response.json({

            error: "Please provide a non-empty message."

        }, {
            status: 400
        });

    }


    const message = body.message.trim();


    if (message.length > MAX_MESSAGE_LENGTH) {

        return Response.json({

            error: `Message exceeds the ${MAX_MESSAGE_LENGTH} character limit.`

        }, {
            status: 413
        });

    }


    // Validate history container
    if (
        body.history !== undefined &&
        !Array.isArray(body.history)
    ) {

        return Response.json({

            error: "Conversation history must be an array."

        }, {
            status: 400
        });

    }


    // Sanitize conversation history
    const history = normalizeHistory(body.history || []);


    // Generate response
    try {

        const result = await generateAssistantReply({

            message,

            history,

            signal: request.signal

        });


        return Response.json({

            reply: result.reply,

            mode: result.mode

        }, {
            status: 200
        });


    } catch (error) {

        console.error(
            "NOVA chat request failed:",
            error.message
        );


        if (error.name === "AbortError") {

            return Response.json({

                error: "The AI request was interrupted."

            }, {
                status: 504
            });

        }


        return Response.json({

            error: error.message ||
                "Unable to process your message right now."

        }, {
            status: error.status || 502
        });

    }

}
