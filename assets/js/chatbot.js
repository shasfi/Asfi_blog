// assets/js/chatbot.js — floating chat widget, calls /api/chat (key stays server-side)

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("pw-chat-toggle");
  const panel = document.getElementById("pw-chat-panel");
  const closeBtn = document.getElementById("pw-chat-close");
  const body = document.getElementById("pw-chat-body");
  const form = document.getElementById("pw-chat-form");
  const input = document.getElementById("pw-chat-input");

  if (!toggle || !panel) return;

  let history = [
    {
      role: "system",
      content:
        "You are 'The Desk', the friendly editorial assistant for AsfiBlog, a trending news and ideas publication covering technology, business, science, and health. Answer questions about the site's articles and topics helpfully and briefly (2-4 sentences unless asked for more).",
    },
  ];

  toggle.addEventListener("click", () => panel.classList.toggle("open"));
  closeBtn.addEventListener("click", () => panel.classList.remove("open"));

  function addMessage(text, role) {
    const div = document.createElement("div");
    div.className = `pw-msg ${role === "user" ? "user" : "bot"}`;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    history.push({ role: "user", content: text });
    input.value = "";

    const loadingDiv = document.createElement("div");
    loadingDiv.className = "pw-msg bot";
    loadingDiv.textContent = "Typing...";
    body.appendChild(loadingDiv);
    body.scrollTop = body.scrollHeight;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      loadingDiv.remove();

      const reply = data.reply || "Sorry, I couldn't process that right now.";
      addMessage(reply, "bot");
      history.push({ role: "assistant", content: reply });
    } catch (err) {
      loadingDiv.remove();
      addMessage("Something went wrong. Please try again.", "bot");
    }
  });
});
