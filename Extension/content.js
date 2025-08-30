// Convert an image URL to Base64
async function imageUrlToBase64(url) {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result.split(",")[1]); // Strip "data:image/...;base64,"
        };
        reader.readAsDataURL(blob);
    });
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "convertImage") {
        const base64 = await imageUrlToBase64(message.srcUrl);
        chrome.runtime.sendMessage({ action: "sendFaceSearch", imageBase64: base64 });
    }

    if (message.action === "showResult") {
        showOverlay(message.data);
    }
});

// Display results in overlay
function showOverlay(data) {
    let overlay = document.getElementById("folp-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "folp-overlay";
        document.body.appendChild(overlay);
    }

    overlay.style.position = "fixed";
    overlay.style.top = "10px";
    overlay.style.right = "10px";
    overlay.style.background = "rgba(0,0,0,0.6)";
    overlay.style.color = "#fff";
    overlay.style.padding = "10px";
    overlay.style.borderRadius = "8px";
    overlay.style.zIndex = 999999;
    overlay.style.maxWidth = "400px";
    overlay.style.overflowY = "auto";
    overlay.style.maxHeight = "90vh";

    overlay.innerHTML = `
        <h3>Folp Results</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>
        <button id="closeFolp">Close</button>
    `;

    document.getElementById("closeFolp").onclick = () => overlay.remove();
}
