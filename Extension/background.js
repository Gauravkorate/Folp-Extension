chrome.runtime.onInstalled.addListener(() => {
    // Context menu for text search
    chrome.contextMenus.create({
        id: "folpTextSearch",
        title: "Folp: Search name",
        contexts: ["selection"]
    });

    // Context menu for image search
    chrome.contextMenus.create({
        id: "folpImageSearch",
        title: "Folp: Search face",
        contexts: ["image"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "folpTextSearch") {
        // Send highlighted text to backend
        fetch("http://localhost:3000/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-token": "MY_SECRET_TOKEN"
            },
            body: JSON.stringify({ type: "name", value: info.selectionText })
        })
            .then(r => r.json())
            .then(data => {
                chrome.tabs.sendMessage(tab.id, { action: "showResult", data });
            })
            .catch(err => console.error(err));
    }

    if (info.menuItemId === "folpImageSearch") {
        // Ask content script to convert image to Base64
        chrome.tabs.sendMessage(tab.id, { action: "convertImage", srcUrl: info.srcUrl });
    }
});

// Receive Base64 image from content.js and send to backend
chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === "sendFaceSearch") {
        fetch("http://localhost:3000/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-token": "MY_SECRET_TOKEN"
            },
            body: JSON.stringify({ type: "face", value: message.imageBase64 })
        })
            .then(r => r.json())
            .then(data => {
                chrome.tabs.sendMessage(sender.tab.id, { action: "showResult", data });
            })
            .catch(err => console.error(err));
    }
});
