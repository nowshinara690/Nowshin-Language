// --- DOM Elements ---
const el = {
  code: document.getElementById("codeInput"),
  highlight: document.getElementById("highlight"),
  lines: document.getElementById("lineNumbers"),
  terminal: document.getElementById("terminal"),
  tokenArea: document.getElementById("tokenArea"),
  modal: document.getElementById("guideModal"),
};

// --- Demo Codes (8 Examples including Input) ---
const demos = [
  {
    name: "Basic",
    code: 'shuru koro\n  dhoro name = "Nowshin";\n  dekhao "Hello " + name;\nshesh koro',
  },
  {
    name: "Input Test",
    code: 'shuru koro\n  dekhao "Tomar boyosh koto?";\n  dhoro age = poro;\n  jodi (age >= 18) {\n    dekhao "Tumi vote dite parbe!";\n  } nahole {\n    dekhao "Tumi ekhono choto.";\n  }\n\n  dekhao "Ekti doshomik (float) shongkha din:";\n  dhoro num = poro;\n  dekhao "Shongkha tir sathe 2 gun korle hoy: " + (num * 2);\nshesh koro',
  },
  {
    name: "Math",
    code: 'shuru koro\n  dhoro a = 15;\n  dhoro b = 5;\n  dekhao "Jogfol: " + (a + b);\n  dekhao "Vagfol: " + (a / b);\nshesh koro',
  },
  {
    name: "Condition",
    code: 'shuru koro\n  dhoro marks = 85;\n  jodi (marks >= 80) {\n    dekhao "A+ Peyecho!";\n  } nahole {\n    dekhao "Bhalo korte hobe!";\n  }\nshesh koro',
  },
  {
    name: "Even/Odd",
    code: 'shuru koro\n  dhoro n = 10;\n  jodi (n % 2 == 0) {\n    dekhao n + " hocche Jor shongkha";\n  } nahole {\n    dekhao n + " hocche Bijor shongkha";\n  }\nshesh koro',
  },
  {
    name: "While Loop",
    code: 'shuru koro\n  dhoro i = 1;\n  jotokhon (i <= 3) {\n    dekhao "Count: " + i;\n    i = i + 1;\n  }\nshesh koro',
  },
  {
    name: "For Loop",
    code: 'shuru koro\n  koro (dhoro i = 1; i <= 3; i = i + 1) {\n    dekhao "For loop ghurchhe: " + i;\n  }\nshesh koro',
  },
  {
    name: "Series Sum",
    code: 'shuru koro\n  dhoro sum = 0;\n  koro (dhoro i = 1; i <= 5; i = i + 1) {\n    sum = sum + i;\n  }\n  dekhao "1 theke 5 er jogfol: " + sum;\nshesh koro',
  },
];

demos.forEach((d) => {
  const btn = document.createElement("button");
  btn.className = "demo-chip";
  btn.innerText = d.name;
  btn.onclick = () => {
    el.code.value = d.code;
    updateUI();
  };
  document.getElementById("demoBar").appendChild(btn);
});

// --- Modal Logic ---
document.getElementById("guideBtn").onclick = () =>
  (el.modal.style.display = "flex");
document.getElementById("closeModal").onclick = () =>
  (el.modal.style.display = "none");
window.onclick = (e) => {
  if (e.target == el.modal) el.modal.style.display = "none";
};

// --- HTML Escaping ---
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// --- UI Updaters ---
function updateUI() {
  const text = el.code.value;
  // 1. Line Numbers
  el.lines.innerHTML = Array.from(
    { length: text.split("\n").length },
    (_, i) => i + 1,
  ).join("<br>");

  // 2. Syntax Highlight
  el.highlight.innerHTML = escapeHtml(text)
    .replace(
      /(shuru koro|shesh koro)/g,
      "<span style='color: #ff6b6b; font-weight: bold;'>$1</span>",
    )
    .replace(
      /\b(dhoro|dekhao|jodi|nahole|jotokhon|koro|poro)\b/g,
      "<span style='color: #6bd0ff; font-weight: bold;'>$1</span>",
    )
    .replace(/("[^"]*")/g, "<span style='color: #7ef0b0;'>$1</span>")
    .replace(/\b(\d+)\b/g, "<span style='color: #ffd36f;'>$1</span>")
    .replace(
      /(\/\/.*)/g,
      "<span style='color: #8b949e; font-style: italic;'>$1</span>",
    );

  // 3. Token Breakdown
  renderTokens(text);
}

function renderTokens(text) {
  el.tokenArea.innerHTML = "";
  const tokenRegex =
    /(?:\/\/.*)|(shuru koro|shesh koro|\bdhoro\b|\bdekhao\b|\bjodi\b|\bnahole\b|\bjotokhon\b|\bkoro\b|\bporo\b|"[^"]*"|\b\d+\b|<=|>=|==|!=|[{}();=<>+*\/%\-])/g;
  const tokens = text.match(tokenRegex) || [];

  tokens.forEach((val) => {
    val = val.trim();
    if (!val) return;

    let typeClass = "",
      label = "Symbol";

    if (val.startsWith("//")) {
      typeClass = "tb-com";
      label = "Comment";
    } else if (val === "shuru koro" || val === "shesh koro") {
      typeClass = "tb-boss";
      label = "Main";
    } else if (
      [
        "dhoro",
        "dekhao",
        "jodi",
        "nahole",
        "jotokhon",
        "koro",
        "poro",
      ].includes(val)
    ) {
      typeClass = "tb-kw";
      label = "Keyword";
    } else if (val.startsWith('"')) {
      typeClass = "tb-str";
      label = "String";
    } else if (/^\d+$/.test(val)) {
      typeClass = "tb-num";
      label = "Number";
    }

    const displayVal = escapeHtml(val);

    el.tokenArea.innerHTML += `<div class="token-badge ${typeClass}">
      ${displayVal} <span style="opacity:0.5; font-size:0.6rem;">${label}</span>
    </div>`;
  });
}
// --- Smart Custom Input Function for 'poro' ---
async function customInput() {
  return new Promise((resolve) => {
    const promptModal = document.getElementById("prompt-modal");
    const promptMsg = document.getElementById("prompt-message");
    const promptInput = document.getElementById("prompt-input");

    // টার্মিনালের শেষ প্রিন্ট করা লাইনটা খুঁজে বের করা
    const terminalText = el.terminal.innerText.trim();
    const lines = terminalText.split("\n");
    const lastLine = lines[lines.length - 1] || "Kichu ekta input din:";

    // মডেলে সেই মেসেজটা সেট করা
    promptMsg.innerText = lastLine;
    promptInput.value = "";
    promptModal.style.display = "flex";
    promptInput.focus();

    // এন্টার (Enter) প্রেস করলে ইনপুট সাবমিট হবে
    const handleEnter = (e) => {
      if (e.key === "Enter") {
        submitInput();
      }
    };

    const submitInput = () => {
      const val = promptInput.value.trim();
      promptModal.style.display = "none";
      promptInput.removeEventListener("keydown", handleEnter); // ইভেন্ট ক্লিয়ার করা

      // নাম্বার নাকি স্ট্রিং তা চেক করা
      if (!isNaN(val) && val !== "") {
        resolve(Number(val));
      } else {
        resolve(val);
      }
    };

    promptInput.addEventListener("keydown", handleEnter);
  });
}

// --- Compiler Core ---
function transpile(code) {
  return code
    .replace(/shuru koro/gi, "async function __main(log, customInput) {")
    .replace(/shesh koro/gi, "}")
    .replace(/\bdhoro\b/g, "let")
    .replace(/\bdekhao\b\s+([^;\n]+);?/g, "log($1);")
    .replace(/\bjodi\b/g, "if")
    .replace(/\bnahole\b/g, "else")
    .replace(/\bjotokhon\b/g, "while")
    .replace(/\bkoro\b/g, "for")
    .replace(/\bporo\b/g, "await customInput()");
}

async function runCode() {
  el.terminal.textContent = "";
  try {
    const jsCode = transpile(el.code.value);
    const terminalLogger = (msg) => {
      el.terminal.textContent += msg + "\n";
      el.terminal.scrollTop = el.terminal.scrollHeight;
    };
    const executor = new Function(
      "log",
      "customInput",
      jsCode + "\nreturn __main(log, customInput);",
    );
    await executor(terminalLogger, customInput);
  } catch (err) {
    el.terminal.textContent = `SyntaxError: Jhamela hoyeche!\n${err.message}`;
  }
}

// --- Events ---
el.code.addEventListener("input", () => {
  updateUI();
  // Auto Run is disabled while typing if it contains 'poro' to avoid infinite popups
  if (
    document.getElementById("autoRun").checked &&
    !el.code.value.includes("poro")
  ) {
    runCode();
  }
});

document.getElementById("runBtn").addEventListener("click", runCode);

document.getElementById("saveBtn").addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([el.code.value], { type: "text/plain" }),
  );
  a.download = "program.ns";
  a.click();
});

// Init
updateUI();
