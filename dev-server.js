
/* =====================================================
   NOVA — LOCAL DEVELOPMENT SERVER
   Static frontend + serverless API simulation
===================================================== */

import { createServer } from "node:http";

import {
    readFile,
    stat
} from "node:fs/promises";

import {
    resolve,
    extname,
    sep,
    relative,
    isAbsolute
} from "node:path";

import { fileURLToPath } from "node:url";

import {
    GET,
    POST
} from "./api/chat.js";


/* =====================================================
   01. SERVER CONFIGURATION
===================================================== */

const ROOT = resolve(
    fileURLToPath(new URL(".", import.meta.url))
);

const HOST = "127.0.0.1";

const PORT = Number(process.env.PORT) || 5500;


/* =====================================================
   02. MIME TYPES
===================================================== */

const MIME_TYPES = {

    ".html": "text/html; charset=utf-8",

    ".css": "text/css; charset=utf-8",

    ".js": "text/javascript; charset=utf-8",

    ".json": "application/json; charset=utf-8",

    ".png": "image/png",

    ".jpg": "image/jpeg",

    ".jpeg": "image/jpeg",

    ".svg": "image/svg+xml",

    ".webp": "image/webp",

    ".ico": "image/x-icon"

};


/* =====================================================
   03. READ INCOMING REQUEST BODY
===================================================== */

async function readRequestBody(request) {

    const chunks = [];

    let totalSize = 0;

    const MAX_BODY_SIZE = 128 * 1024;


    for await (const chunk of request) {

        totalSize += chunk.length;

        if (totalSize > MAX_BODY_SIZE) {

            const error = new Error(
                "Request body is too large."
            );

            error.status = 413;

            throw error;

        }

        chunks.push(chunk);

    }


    return Buffer.concat(chunks);

}


/* =====================================================
   04. SEND STANDARD RESPONSE
===================================================== */

async function sendResponse(nodeResponse, response) {

    nodeResponse.statusCode = response.status;

    response.headers.forEach((value, key) => {

        nodeResponse.setHeader(key, value);

    });

    nodeResponse.setHeader(
        "X-Content-Type-Options",
        "nosniff"
    );

    const body = Buffer.from(
        await response.arrayBuffer()
    );

    nodeResponse.end(body);

}


/* =====================================================
   05. SERVERLESS API ROUTER
===================================================== */

async function handleApi(request, response, url) {

    if (url.pathname !== "/api/chat") {

        await sendResponse(

            response,

            Response.json({
                error: "API route not found."
            }, {
                status: 404
            })

        );

        return;

    }


    if (!["GET", "POST"].includes(request.method)) {

        response.setHeader("Allow", "GET, POST");

        await sendResponse(

            response,

            Response.json({
                error: "Method not allowed."
            }, {
                status: 405
            })

        );

        return;

    }


    try {

        const body = request.method === "POST"
            ? await readRequestBody(request)
            : undefined;


        const webRequest = new Request(url, {

            method: request.method,

            headers: new Headers(request.headers),

            body

        });


        const apiResponse = request.method === "GET"
            ? await GET(webRequest)
            : await POST(webRequest);


        await sendResponse(response, apiResponse);


    } catch (error) {

        console.error("Local API error:", error.message);

        await sendResponse(

            response,

            Response.json({

                error: error.message === "Request body is too large."
                    ? error.message
                    : "The local server could not process this request."

            }, {
                status: error.status || 500
            })

        );

    }

}


/* =====================================================
   06. STATIC FILE SERVER
===================================================== */

async function serveStaticFile(request, response, url) {

    if (!["GET", "HEAD"].includes(request.method)) {

        response.writeHead(405, {
            "Allow": "GET, HEAD"
        });

        response.end("Method not allowed.");

        return;

    }


    let pathname;

    try {

        pathname = decodeURIComponent(url.pathname);

    } catch {

        response.writeHead(400);

        response.end("Invalid URL.");

        return;

    }


    const relativePath =
        pathname === "/"
            ? "index.html"
            : pathname.replace(/^\/+/, "");


    // Only frontend files are publicly served.
    // Backend folders, tests and environment files stay private.
    const allowedPath =
        relativePath === "index.html" ||
        relativePath.startsWith("css/") ||
        relativePath.startsWith("js/") ||
        relativePath.startsWith("assets/");


    if (!allowedPath) {

        response.writeHead(404);

        response.end("File not found.");

        return;

    }


    const filePath = resolve(ROOT, relativePath);


    // Prevent path traversal outside the project
    
if (
    relativePath === ".." ||
    relativePath.startsWith(".." + sep) ||
    isAbsolute(relativePath)
) {

    response.writeHead(403);

    response.end("Forbidden.");

    return;

}


    try {

        const fileStats = await stat(filePath);

        if (!fileStats.isFile()) {

            throw new Error("Not a file.");

        }

        const file = await readFile(filePath);

        const contentType =
            MIME_TYPES[extname(filePath).toLowerCase()] ||
            "application/octet-stream";


        response.writeHead(200, {

            "Content-Type": contentType,

            "Content-Length": fileStats.size,

            "Cache-Control": "no-store",

            "X-Content-Type-Options": "nosniff"

        });


        response.end(
            request.method === "HEAD" ? undefined : file
        );


    } catch {

        response.writeHead(404, {

            "Content-Type": "text/plain; charset=utf-8"

        });

        response.end("File not found.");

    }

}


/* =====================================================
   07. CREATE SERVER
===================================================== */

const server = createServer(async (request, response) => {

    const url = new URL(
        request.url,
        `http://${HOST}:${PORT}`
    );


    if (url.pathname.startsWith("/api/")) {

        await handleApi(request, response, url);

        return;

    }


    await serveStaticFile(request, response, url);

});


/* =====================================================
   08. START SERVER
===================================================== */

server.listen(PORT, HOST, () => {

    console.log("");

    console.log("======================================");

    console.log("       NOVA CHAT STUDIO");

    console.log("======================================");

    console.log("");

    console.log(`Frontend: http://${HOST}:${PORT}`);

    console.log(`API:      http://${HOST}:${PORT}/api/chat`);

    console.log("");

    console.log("Mode: Local development");

    console.log("Press Ctrl + C to stop the server.");

    console.log("");

});
