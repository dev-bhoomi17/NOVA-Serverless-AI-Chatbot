
/* =====================================================
   NOVA — AI CHAT STUDIO
   Frontend Interaction & State Management
===================================================== */

// =====================================================
// 01. CONFIGURATION
// =====================================================

const CONFIG = {
    storageKey: "nova-chat-conversations",
    maxConversations: 25,
    maxMessageLength: 4000,
    maxHistoryMessages: 12,
    requestTimeout: 45000
};


// =====================================================
// 02. DOM ELEMENT REFERENCES
// =====================================================

const elements = {
    sidebar: document.getElementById("sidebar"),
    mobileMenuButton: document.getElementById("mobile-menu-button"),

    newChatButton: document.getElementById("new-chat-button"),
    clearChatButton: document.getElementById("clear-chat-button"),

    welcomeScreen: document.getElementById("welcome-screen"),
    messagesArea: document.getElementById("messages-area"),
    messagesList: document.getElementById("messages-list"),

    chatForm: document.getElementById("chat-form"),
    messageInput: document.getElementById("message-input"),
    sendButton: document.getElementById("send-button"),
    characterCount: document.getElementById("character-count"),

    typingIndicator: document.getElementById("typing-indicator"),

    conversationList: document.getElementById("conversation-list"),
    historyCount: document.getElementById("history-count"),

    connectionStatus: document.getElementById("connection-status"),
    connectionLabel: document.getElementById("connection-label"),
    sidebarModel: document.getElementById("sidebar-model"),

    notification: document.getElementById("notification"),
    notificationMessage: document.getElementById("notification-message"),
    notificationClose: document.getElementById("notification-close")
};


// =====================================================
// 03. APPLICATION STATE
// =====================================================

const state = {
    conversations: [],
    activeConversationId: null,
    isSending: false,
    mode: "demo"
};

let notificationTimer;
let currentRequestController = null;


// =====================================================
// 04. UTILITY FUNCTIONS
// =====================================================

function createId() {

    if (typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    return `nova-${Date.now()}-${Math.random()
        .toString(36).slice(2)}`;

}


function getCurrentTime() {

    return new Date().toISOString();

}


function formatTime(timestamp) {

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit"
    }).format(date);

}


function createConversationTitle(message) {

    const cleanMessage = message
        .replace(/\s+/g, " ")
        .trim();

    if (cleanMessage.length > 32) {
        return cleanMessage.slice(0, 32).trimEnd() + "...";
    }

    return cleanMessage || "New conversation";

}


// =====================================================
// 05. NOTIFICATION SYSTEM
// =====================================================

function showNotification(message) {

    clearTimeout(notificationTimer);

    elements.notificationMessage.textContent = message;

    elements.notification.hidden = false;

    notificationTimer = setTimeout(() => {

        elements.notification.hidden = true;

    }, 4500);

}


function hideNotification() {

    clearTimeout(notificationTimer);

    elements.notification.hidden = true;

}


// =====================================================
// 06. LOCAL STORAGE — LOAD CONVERSATIONS
// =====================================================

function loadConversations() {

    try {

        const savedData = localStorage.getItem(
            CONFIG.storageKey
        );

        if (!savedData) {
            return [];
        }

        const parsedData = JSON.parse(savedData);

        if (!Array.isArray(parsedData)) {
            return [];
        }

        // Validate restored conversations
        return parsedData

            .filter((conversation) => {

                return (
                    conversation &&
                    typeof conversation.id === "string" &&
                    Array.isArray(conversation.messages)
                );

            })

            .map((conversation) => {

                const messages = conversation.messages

                    .filter((message) => {

                        return (
                            message &&
                            ["user", "assistant"].includes(message.role) &&
                            typeof message.content === "string"
                        );

                    })

                    .map((message) => ({

                        role: message.role,
                        content: message.content.slice(
                            0,
                            CONFIG.maxMessageLength
                        ),
                        timestamp:
                            typeof message.timestamp === "string"
                                ? message.timestamp
                                : getCurrentTime()

                    }));

                return {

                    id: conversation.id,

                    title:
                        typeof conversation.title === "string"
                            ? conversation.title.slice(0, 40)
                            : "New conversation",

                    createdAt:
                        typeof conversation.createdAt === "string"
                            ? conversation.createdAt
                            : getCurrentTime(),

                    updatedAt:
                        typeof conversation.updatedAt === "string"
                            ? conversation.updatedAt
                            : getCurrentTime(),

                    messages

                };

            })

            .filter((conversation) => conversation.messages.length > 0)

            .sort((a, b) => {
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            })

            .slice(0, CONFIG.maxConversations);

    } catch (error) {

        console.error("Unable to restore conversations:", error);

        return [];

    }

}


// =====================================================
// 07. LOCAL STORAGE — SAVE CONVERSATIONS
// =====================================================

function saveConversations() {

    try {

        state.conversations.sort((a, b) => {

            return new Date(b.updatedAt) - new Date(a.updatedAt);

        });

        state.conversations = state.conversations.slice(
            0,
            CONFIG.maxConversations
        );

        localStorage.setItem(
            CONFIG.storageKey,
            JSON.stringify(state.conversations)
        );

        renderConversationHistory();

        return true;

    } catch (error) {

        console.error("Unable to save conversations:", error);

        showNotification(
            "Chat could not be saved in this browser. Storage may be full."
        );

        return false;

    }

}


// =====================================================
// 08. GET ACTIVE CONVERSATION
// =====================================================

function getActiveConversation() {

    return state.conversations.find((conversation) => {

        return conversation.id === state.activeConversationId;

    }) || null;

}


// =====================================================
// 09. CREATE A NEW CONVERSATION
// =====================================================

function createConversation() {

    const conversation = {

        id: createId(),

        title: "New conversation",

        createdAt: getCurrentTime(),

        updatedAt: getCurrentTime(),

        messages: []

    };

    state.conversations.unshift(conversation);

    state.activeConversationId = conversation.id;

    return conversation;

}


// =====================================================
// 10. RENDER CONVERSATION HISTORY
// =====================================================

function renderConversationHistory() {

    elements.conversationList.replaceChildren();

    const conversations = state.conversations;

    elements.historyCount.textContent = String(
        conversations.length
    );

    if (conversations.length === 0) {

        const emptyState = document.createElement("div");

        emptyState.className = "history-empty";

        emptyState.textContent =
            "Your conversations will appear here.";

        elements.conversationList.appendChild(emptyState);

        return;

    }


    conversations.forEach((conversation) => {

        const button = document.createElement("button");

        button.type = "button";

        button.className = "conversation-item";

        button.classList.toggle(
            "active",
            conversation.id === state.activeConversationId
        );

        button.dataset.conversationId = conversation.id;


        const icon = document.createElement("span");

        icon.className = "conversation-item-icon";

        icon.textContent = "◈";


        const title = document.createElement("span");

        title.className = "conversation-item-title";

        title.textContent = conversation.title;


        button.append(icon, title);

        button.addEventListener("click", () => {

            openConversation(conversation.id);

        });

        elements.conversationList.appendChild(button);

    });

}


// =====================================================
// 11. OPEN AN EXISTING CONVERSATION
// =====================================================

function openConversation(conversationId) {

    const conversation = state.conversations.find((item) => {

        return item.id === conversationId;

    });

    if (!conversation) {
        return;
    }

    state.activeConversationId = conversationId;

    renderApplication();

    closeMobileSidebar();

}


// =====================================================
// 12. RENDER INDIVIDUAL MESSAGES
// =====================================================

function createMessageElement(message) {

    const row = document.createElement("article");

    row.className = `message-row ${message.role}`;


    // Avatar
    const avatar = document.createElement("div");

    avatar.className = "message-avatar";

    avatar.textContent =
        message.role === "assistant" ? "N" : "U";

    avatar.setAttribute("aria-hidden", "true");


    // Message container
    const content = document.createElement("div");

    content.className = "message-content";


    // Author label
    const author = document.createElement("div");

    author.className = "message-author";

    author.textContent =
        message.role === "assistant" ? "NOVA" : "You";


    // Message text
    const bubble = document.createElement("div");

    bubble.className = "message-bubble";

    const paragraph = document.createElement("p");

    // textContent prevents user or API text from becoming executable HTML
    paragraph.textContent = message.content;

    bubble.appendChild(paragraph);


    // Message timestamp
    const time = document.createElement("div");

    time.className = "message-time";

    time.textContent = formatTime(message.timestamp);


    content.append(author, bubble, time);

    row.append(avatar, content);

    return row;

}


// =====================================================
// 13. RENDER ALL MESSAGES
// =====================================================

function renderMessages() {

    const conversation = getActiveConversation();

    elements.messagesList.replaceChildren();

    if (!conversation || conversation.messages.length === 0) {

        elements.welcomeScreen.hidden = false;

        elements.messagesArea.hidden = true;

        return;

    }

    elements.welcomeScreen.hidden = true;

    elements.messagesArea.hidden = false;


    conversation.messages.forEach((message) => {

        elements.messagesList.appendChild(
            createMessageElement(message)
        );

    });


    // Scroll to the latest message
    requestAnimationFrame(() => {

        elements.messagesList.scrollTop =
            elements.messagesList.scrollHeight;

    });

}


// =====================================================
// 14. RENDER APPLICATION
// =====================================================

function renderApplication() {

    renderMessages();

    renderConversationHistory();

    updateComposer();

    updateConnectionStatus();

}


// =====================================================
// 15. CONNECTION STATUS
// =====================================================

function updateConnectionStatus() {

    if (state.mode === "live") {

        elements.connectionLabel.textContent = "LIVE LLM";

        elements.connectionStatus.title =
            "Connected to the configured LLM provider";

        elements.sidebarModel.textContent = "AI Assistant";

    } else {

        elements.connectionLabel.textContent = "DEMO MODE";

        elements.connectionStatus.title =
            "Using the local demo response service";

        elements.sidebarModel.textContent = "NOVA Assistant";

    }

}


// =====================================================
// 16. COMPOSER STATE
// =====================================================

function updateComposer() {

    const message = elements.messageInput.value;

    const length = message.length;

    elements.characterCount.textContent =
        `${length} / ${CONFIG.maxMessageLength}`;


    // Disable button for empty messages or active requests
    elements.sendButton.disabled =
        !message.trim() ||
        state.isSending ||
        length > CONFIG.maxMessageLength;

}


function resizeTextarea() {

    elements.messageInput.style.height = "auto";

    elements.messageInput.style.height = `${Math.min(
        elements.messageInput.scrollHeight,
        145
    )}px`;

}


function setSendingState(isSending) {

    state.isSending = isSending;

    elements.typingIndicator.hidden = !isSending;

    elements.sendButton.disabled =
        isSending || !elements.messageInput.value.trim();

    elements.messageInput.disabled = isSending;


    if (isSending) {

        const conversation = getActiveConversation();

        elements.messagesArea.hidden = false;

        elements.welcomeScreen.hidden = true;

        requestAnimationFrame(() => {

            elements.messagesList.scrollTop =
                elements.messagesList.scrollHeight;

        });

    }

}


// =====================================================
// 17. SEND MESSAGE TO SERVERLESS API
// =====================================================

async function sendMessage(message) {

    const cleanMessage = message.trim();

    if (!cleanMessage || state.isSending) {
        return;
    }

    if (cleanMessage.length > CONFIG.maxMessageLength) {

        showNotification("Your message is too long.");

        return;

    }


    hideNotification();

    // Find or create the current conversation
    let conversation = getActiveConversation();

    if (!conversation) {

        conversation = createConversation();

    }

    const firstMessage = conversation.messages.length === 0;


    // Create the user message
    const userMessage = {

        role: "user",

        content: cleanMessage,

        timestamp: getCurrentTime()

    };


    conversation.messages.push(userMessage);

    conversation.updatedAt = getCurrentTime();

    if (firstMessage) {

        conversation.title = createConversationTitle(
            cleanMessage
        );

    }


    // Clear composer
    elements.messageInput.value = "";

    resizeTextarea();

    updateComposer();


    renderApplication();

    saveConversations();


    // Only send previous messages as context.
    // The current message is provided separately.
    const history = conversation.messages

        .slice(0, -1)

        .slice(-CONFIG.maxHistoryMessages)

        .map(({ role, content }) => ({

            role,
            content

        }));


    setSendingState(true);

    const controller = new AbortController();

    currentRequestController = controller;

    const timeoutId = setTimeout(() => {

        controller.abort();

    }, CONFIG.requestTimeout);


    try {

        // The browser talks only to our backend.
        // The LLM API key never belongs in frontend code.
        const response = await fetch("/api/chat", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                message: cleanMessage,

                history

            }),

            signal: controller.signal

        });


        // Read server response
        const data = await response.json().catch(() => ({}));


        if (!response.ok) {

            throw new Error(
                data.error || "The server could not process your message."
            );

        }


        if (
            !data ||
            typeof data.reply !== "string" ||
            !data.reply.trim()
        ) {

            throw new Error(
                "The server returned an invalid response."
            );

        }


        // Update connection mode if supplied by backend
        state.mode =
            data.mode === "live" ? "live" : "demo";


        // Save the assistant response
        conversation.messages.push({

            role: "assistant",

            content: data.reply.trim(),

            timestamp: getCurrentTime()

        });

        conversation.updatedAt = getCurrentTime();

        saveConversations();

        renderApplication();


    } catch (error) {

        console.error("Chat request failed:", error);


        // Remove the unsent user message from stored conversation
        // so failed requests are not accidentally sent as context.
        if (
            conversation.messages.at(-1) === userMessage
        ) {

            conversation.messages.pop();

        }


        if (conversation.messages.length === 0) {

            state.conversations = state.conversations.filter(
                (item) => item.id !== conversation.id
            );

            state.activeConversationId = null;

        } else {

            conversation.updatedAt = getCurrentTime();

        }


        // Restore text so the user can retry
        elements.messageInput.value = cleanMessage;

        resizeTextarea();

        renderApplication();


        if (error.name === "AbortError") {

            showNotification(
                "The request timed out. Please try again."
            );

        } else {

            showNotification(
                error.message || "Unable to connect to NOVA."
            );

        }


        saveConversations();


    } finally {

        clearTimeout(timeoutId);

        currentRequestController = null;

        setSendingState(false);

        updateComposer();

    }

}


// =====================================================
// 18. NEW CONVERSATION
// =====================================================

function startNewConversation() {

    if (state.isSending) {

        showNotification(
            "Please wait for the current response to finish."
        );

        return;

    }

    state.activeConversationId = null;

    elements.messageInput.value = "";

    resizeTextarea();

    renderApplication();

    hideNotification();

    closeMobileSidebar();

}


// =====================================================
// 19. CLEAR CURRENT CONVERSATION
// =====================================================

function clearCurrentConversation() {

    if (state.isSending) {

        showNotification(
            "Please wait for the current response to finish."
        );

        return;

    }

    const conversation = getActiveConversation();

    if (!conversation) {

        showNotification("There is no active conversation to clear.");

        return;

    }

    state.conversations = state.conversations.filter((item) => {

        return item.id !== conversation.id;

    });

    state.activeConversationId = null;

    elements.messageInput.value = "";

    resizeTextarea();

    saveConversations();

    renderApplication();

    showNotification("Conversation cleared.");

}


// =====================================================
// 20. MOBILE SIDEBAR
// =====================================================

function closeMobileSidebar() {

    elements.sidebar.classList.remove("is-open");

}


function toggleMobileSidebar() {

    elements.sidebar.classList.toggle("is-open");

}


// =====================================================
// 21. SUGGESTED PROMPTS
// =====================================================

function handleSuggestedPrompt(event) {

    const card = event.target.closest("[data-prompt]");

    if (!card) {
        return;
    }

    if (state.isSending) {
        return;
    }

    const prompt = card.dataset.prompt;

    elements.messageInput.value = prompt;

    resizeTextarea();

    updateComposer();

    elements.messageInput.focus();

    elements.chatForm.requestSubmit();

}


// =====================================================
// 22. EVENT LISTENERS
// =====================================================

function initializeEventListeners() {

    // Message submission
    elements.chatForm.addEventListener("submit", (event) => {

        event.preventDefault();

        sendMessage(elements.messageInput.value);

    });


    // Character count and textarea resizing
    elements.messageInput.addEventListener("input", () => {

        resizeTextarea();

        updateComposer();

    });


    // Enter to send; Shift + Enter for a new line
    elements.messageInput.addEventListener("keydown", (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.isComposing
        ) {

            event.preventDefault();

            elements.chatForm.requestSubmit();

        }

    });


    // New conversation
    elements.newChatButton.addEventListener(
        "click",
        startNewConversation
    );


    // Clear the active conversation
    elements.clearChatButton.addEventListener(
        "click",
        clearCurrentConversation
    );


    // Suggested prompts
    document.querySelectorAll("[data-prompt]").forEach((card) => {

        card.addEventListener(
            "click",
            handleSuggestedPrompt
        );

    });


    // Mobile navigation
    elements.mobileMenuButton.addEventListener(
        "click",
        toggleMobileSidebar
    );


    // Dismiss notifications
    elements.notificationClose.addEventListener(
        "click",
        hideNotification
    );


    // Close mobile sidebar on Escape
    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            closeMobileSidebar();

            hideNotification();

        }

    });

}


// =====================================================
// 23. INITIALIZE NOVA
// =====================================================

function initializeNOVA() {

    // Restore saved conversations
    state.conversations = loadConversations();


    // Restore most recent conversation
    if (state.conversations.length > 0) {

        state.activeConversationId =
            state.conversations[0].id;

    }


    // Register event listeners
    initializeEventListeners();


    // Render initial interface
    renderApplication();


    console.log("NOVA Chat Studio initialized.");

    console.log(
        "Restored conversations:",
        state.conversations.length
    );

}


// =====================================================
// 24. START APPLICATION
// =====================================================

initializeNOVA();
