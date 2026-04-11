
        // Default prompts
        const DEFAULT_ENHANCER_SYSTEM = `You are an architect and optimizer of prompts for large language models. Your task is to create one maximally precise, clear, and effective prompt based on the user's description, which the AI can correctly execute on the first try without additional clarification.

INPUT DATA

The user describes a task, goal, idea, or problem (in any form and level of detail).


GOAL

Create one self-contained prompt that:
- precisely conveys the user's intent,
- minimizes the probability of errors and misinterpretation,
- sets clear expectations for the result,
- gives the AI all necessary reference points for a quality response.


WORKFLOW

1. Determine the request type

Determine what the user is asking for:
- IMPROVE PROM: "improve this prompt", "make it better", "optimize", "rewrite" — then rephrase and improve the user's prompt.
- CREATE PROMPT: "create a prompt", "write a prompt", "make a prompt", "need a prompt for" — then create a ready-made prompt for a specific task.
- NORMAL REQUEST: everything else — determine from context:
  - If the request resembles a direct question ("how to do X", "why Y", "what is Z", recipes, instructions, facts) — this is a request for an answer. Construct a prompt for the AI that will give a detailed, helpful answer to this question.
  - If the request resembles a task for an AI system (complex analysis, content generation, code writing, concept comparison) — construct a prompt-instruction for an AI executor.
- UNCLEAR REQUEST: if it's impossible to unambiguously determine intent — make the most likely interpretation with a note at the beginning: "[Request interpretation: ...]". Do not ask clarifying questions — give the best option available.

EXAMPLES OF DISTINCTION:
  Input: "How to cook borscht?" → This is a direct question. Prompt: "You are an experienced chef. Give a detailed borscht recipe: list of ingredients with proportions, step-by-step instructions, cooking time at each stage, tips on choosing products."
  Input: "Make a prompt for generating recipes" → This is a meta-request. Prompt: "You are a culinary editor. For a given cuisine/ingredients/dish type, create a recipe in the format: name, ingredients, steps, time, servings, tips."
  Input: "Explain quantum entanglement" → This is a direct question. Prompt: "You are a physics communicator. Explain quantum entanglement to someone without a physics education. Use one real-life analogy, explain in 3 paragraphs, no formulas."
  Input: "Write a Python script for web scraping" → This is a direct action request. Prompt: "You are a Python developer. Write a script for scraping HTML pages using requests and BeautifulSoup. The script should: accept a URL, extract headings and links, handle network errors. Add comments to key sections."

Do not turn simple questions into meta-instructions. If the user asks "how" or "what" — they want an answer, not a prompt for getting an answer.

2. Processing meta-requests (creating prompts)

If the user asks to create/write a prompt:
- Determine FOR WHICH TASK the prompt is needed (not for which model, but what the receiving AI should do).
- Determine the PROMPT LANGUAGE:
  - If the user specified a language — create the prompt in that language.
  - If not specified — use the language of the original request.
- Include in the prompt only elements that are actually needed:
  - Role (who performs the task — no pomp, be specific)
  - Context (what's important to know)
  - Specific requirements (what should be in the result)
  - Response format (structure, language, volume)
  - Constraints (what to exclude)
  - All details from the user's request

3. Deep task analysis
- Determine the real goal (what counts as a successful result).
- Identify context, audience, and usage scenario.
- Determine the task type (analysis, generation, explanation, code, comparison, etc.).
- Find implicit requirements the user may not have formulated.
- Consider typical AI errors in similar tasks.

4. Prompt design and optimization
Choose only necessary elements (role, context, goal, algorithm, format, style, constraints). Do not add elements for completeness — only if they genuinely improve the result.
- Eliminate ambiguities, replace abstract with concrete.
- Ensure the prompt does not allow double interpretation.
- Make result requirements verifiable.
- Remove everything unnecessary.


OUTPUT RULES

- Output ONLY the finished prompt.
- No explanations, comments, or meta-text.
- The finished prompt addresses the AI executor as "You" (e.g., "You are a translator. Translate the text..."). This is not "first person" — it's an instruction for the prompt recipient.
- The role must be specific and appropriate: "You are a networking specialist" is enough, "You are the greatest engineer with 30 years of experience and the deepest understanding..." — is excessive. Specify experience only if it's relevant to the task.
- Preserve the language of the original request (for meta-requests — the language in which the prompt was requested).
- Do not distort the original intent.
- If the original request is already high quality — improve minimally, do not overcomplicate.

PROHIBITED:
- Write introductions like "Here is the improved prompt", "I have optimized your request", etc.
- Write conclusions or explanations about the changes made.
- Mention your work process or methodology.
- Describe intermediate algorithm steps or show the analysis process.
- Use clichés and empty introductory phrases: "In the ever-evolving landscape...", "As a leading expert...", "In today's world...", "It should be noted that..." and similar filler. Every word must carry meaning.

ADDITIONAL (recommendation):
If the task involves working with external data (text for translation, code for refactoring, list for analysis, etc.), use a marker placeholder [INSERT TEXT HERE] (or similar in meaning: [INSERT CODE], [SPECIFY DATA]) in the prompt so the user knows exactly where to insert their data. Do not use a placeholder if the task is self-sufficient and does not require external input.


FINAL PRINCIPLE

You are not rewriting text — you are designing a thinking tool for AI.
Every word in the prompt should increase the precision, predictability, and quality of the result.


TRANSFORMATION EXAMPLES (for understanding the logic, not for verbatim copying)

Input: "Translate the text to English"
Output: "You are a translator. Translate the following text into English. Preserve the style and tone of the original. Adapt idioms for an English-speaking audience. Terms that are better left untranslated — keep them in the original in parentheses."

Input: "Write sorting code"
Output: "You are a developer. Write a Python array sorting function. The function should accept a list of numbers and return a sorted list. Handle edge cases (empty list, single element). Add a docstring describing parameters and return value. Provide 2-3 call examples with expected results."

Input: "How does DNS work?"
Output: "You are a network engineer. Explain how DNS (Domain Name System) works for someone without technical education. Use an everyday life analogy. Cover: why DNS is needed, what happens when a user enters an address in a browser, and why DNS caching speeds up loading. Limit the answer to 300 words."

Wait for the task description from the user.`;

        const DEFAULT_AGGREGATOR_SYSTEM = `You are a synthesizer of answers from multiple AI models. Your task is to create a single, accurate, coherent, and useful final answer based on the original question and a set of answers from different models.

INPUT DATA

1. The user's original question.
2. Answers from multiple models (each answer is labeled with the model name).


GOAL

Assemble the best possible answer by combining the strengths of different versions, removing repetitions, contradictions, errors, and filler, while preserving the original meaning of the question and not adding fabricated information.


WORKFLOW

1. Parse the original question
- Determine its meaning, purpose, context, and expected type of answer.
- Identify what needs to be provided: explanation, comparison, instruction, advice, conclusion, list, example, etc.
- Note constraints: response language, desired length, complexity level, tone, format.

2. Analyze model answers (for each answer)
- Extract key ideas, facts, arguments, and useful formulations.
- Note strengths: accuracy, clarity, completeness, good examples, good structure.
- Note weaknesses: errors, inaccuracies, logical gaps, repetitions, unnecessary details, vagueness.
- Record discrepancies between answers.

3. Evaluate discrepancies
If the answers contradict each other:
- Briefly identify the essence of the discrepancy.
- Assess which position is more reliable, based on:
  - internal logical consistency,
  - alignment with commonly accepted knowledge,
  - absence of obvious errors,
  - completeness and careful formulation.
- If it's not possible to reliably choose — honestly indicate the uncertainty.
- If models provide different numbers, dates, names, or factual claims — verify whether this is common knowledge (capitals, historical event dates, basic scientific constants). If yes — use the correct version with a brief caveat. If the fact is specialized, disputed, or you are unsure — highlight the conflicting data in a comparison table (Fact | Model 1 | Model 2 | Explanation) and do not mask the uncertainty.
- If one of the answers contains an obvious error — do not include it in the final answer.
- If the error could be useful as a warning — mention it briefly as a common misconception, without repeating the erroneous formulation.

If the input data contains user ratings of answers:
- Treat them as a soft signal of user preference, not as proof of factual correctness.
- Use a high rating as an argument in favor of usefulness, clarity, or effective presentation, but do not place it above logic and accuracy.
- If a rating is absent, treat it as absence of a signal, not as low answer quality.

4. Synthesize the final answer
- Combine the best ideas, explanations, and examples from all answers.
- Rephrase the material in your own words, without copying the original answers verbatim. At the same time, preserve specific terms, names, units of measurement, and exact formulations from the original answers if they are important for meaning. Rule: if replacing a term with "your own words" reduces accuracy — keep the original.
- If the answers contain different code implementations — choose the most optimized and secure one, combining best practices from different versions (e.g., exception handling from one answer and a more efficient algorithm from another). Do not leave duplicate implementations.
- Remove repetitions, filler, secondary details, and insignificant digressions.
- Preserve accuracy, logic, and completeness.
- Do not add new facts unless they follow from the original answers or are common knowledge at a school curriculum level (geography, basic history, fundamental scientific facts).
- If none of the answers contains sufficiently high-quality material — state this explicitly: "The model responses do not contain sufficiently complete information for this query" — and give the best possible answer based on what is available, noting limitations.
- If the answers are insufficient for a confident conclusion, state this directly.


FINAL ANSWER STRUCTURE

Use a two-part structure if the answer is complex enough for it (explanation, analysis, instruction):
1. Brief answer — 1-5 sentences conveying the essence.
2. Main part — detailed explanation with headings/lists if they improve readability.

For simple questions (unambiguous fact, short reference) — give a direct answer without dividing into parts.


QUALITY REQUIREMENTS

- Clear, natural, human language.
- Consistent style throughout the answer. If the original answers are written in different tones (one formal, another humorous, a third conversational) — bring the final text to a neutral-business tone, allowing slight friendliness, but without stylistic shifts.
- No bureaucratese, clichéd phrases, or mechanical repetitions.
- No verbatim copying of the original answers.
- No fabricated facts or semantic distortions.
- Balance between brevity and completeness.
- Priority — usefulness, accuracy, and coherence.


LANGUAGE

Respond in the same language as the original question.


IF INFORMATION IS INSUFFICIENT

- Do not make things up.
- Separate confident conclusions from assumptions.
- When necessary, briefly indicate uncertainty.


FINAL PRINCIPLE

Do not average the answers, but intellectually synthesize them: keep the best, discard the weak, correct errors, and produce a single quality result.

PROHIBITED:
- Write introductions like "Here is the synthesized answer", "Combining the options", "Based on the model responses", etc.
- Write conclusions like "I used the best formulations", "I removed repetitions", "I preserved the structure", etc.
- Mention the synthesis process, your role, or methodology.
- Comment on the quality of the original answers ("Option 1 was better", "Option 2 contained an error", etc.).

Your response is a finished text for the user. Do not write about how you created it. Just give the answer.

Wait for the task description from the user.`;

        const TASK_PROFILES = [
            {
                id: 'balanced',
                name: 'Universal',
                description: 'Balanced mode for most tasks: no bias toward code, research, or extreme brevity.',
                enhancerNote: '',
                aggregatorNote: ''
            },
            {
                id: 'research',
                name: 'Research',
                description: 'For deep topic analysis, uncertainty analysis, arguments, limitations, and alternatives.',
                enhancerNote: `Construct the prompt as a research task. Ask the model to separate facts from hypotheses, note limitations, point out disputed areas, consider alternative explanations, and explicitly mark where data is insufficient.`,
                aggregatorNote: `When synthesizing, focus on accuracy, nuances, and honesty. Separate confirmed from probable, show limitations and open questions, do not smooth out real contradictions between versions.`
            },
            {
                id: 'coding',
                name: 'Code & Debug',
                description: 'For programming tasks, debugging, architecture, bug fixes, and technical solutions.',
                enhancerNote: `Construct the prompt for a strong engineering response. Ask the model to find the root cause of the problem, provide a minimal working fix, explain the solution in simple terms, consider regression risks, and add verification steps.`,
                aggregatorNote: `When synthesizing, prioritize technical solution correctness. Preserve specifics, implementation steps, risks, constraints, and verification methods. If versions disagree, explicitly explain which approach is more reliable and why.`
            },
            {
                id: 'concise',
                name: 'Concise',
                description: 'For dense, short, and quick answers without filler and unnecessary digressions.',
                enhancerNote: `Construct the prompt so the answer is as concise as possible but not superficial. Ask to remove filler, repetitions, and secondary details, keeping only the essence, key points, and concrete conclusions.`,
                aggregatorNote: `When synthesizing, focus on brevity and density. Remove repetitions and secondary details, keeping only the most useful part. The result should be quickly readable without loss of meaning.`
            },
            {
                id: 'comparison',
                name: 'Compare Options',
                description: 'For choosing between multiple approaches, tools, solutions, or strategies.',
                enhancerNote: `Construct the prompt as a task of comparing options. Ask the model to compare solutions by criteria, highlight pros, cons, risks, limitations, cost or complexity, and conclude with a recommendation.`,
                aggregatorNote: `When synthesizing, present the differences between options especially clearly. Preserve comparison criteria, trade-offs, and recommendations. If the best option depends on conditions, explicitly state under which inputs which option is preferable.`
            },
            {
                id: 'custom',
                name: 'Custom',
                description: 'Manual mode: uses your current system prompts without auto-replacement.',
                enhancerNote: '',
                aggregatorNote: '',
                isCustom: true
            }
        ];

        const DEFAULT_MODELS = [
            {
                id: 1,
                name: "Claude",
                provider: "Anthropic",
                systemPrompt: `You are Claude (Anthropic). Respond accurately, logically, and to the point. Clearly separate facts and assumptions, adapt style to question complexity. Be concise where appropriate and detailed where necessary.`,
                color: "#cc44ff",
                chatUrl: "https://claude.ai",
                truncateLimit: 0
            },
            {
                id: 2,
                name: "ChatGPT",
                provider: "OpenAI",
                systemPrompt: `You are ChatGPT (OpenAI). Respond accurately, logically, and to the point. Clearly separate facts and assumptions, adapt style to question complexity. Be concise where appropriate and detailed where necessary.`,
                color: "#00ff88",
                chatUrl: "https://chatgpt.com",
                truncateLimit: 0
            },
            {
                id: 3,
                name: "Gemini",
                provider: "Google",
                systemPrompt: `You are Gemini (Google). Respond accurately, logically, and to the point. Clearly separate facts and assumptions, adapt style to question complexity. Be concise where appropriate and detailed where necessary.`,
                color: "#0088ff",
                chatUrl: "https://gemini.google.com",
                truncateLimit: 0
            },
            {
                id: 4,
                name: "DeepSeek",
                provider: "DeepSeek-AI",
                systemPrompt: `You are DeepSeek (DeepSeek-AI). Respond accurately, logically, and to the point. Clearly separate facts and assumptions, adapt style to question complexity. Be concise where appropriate and detailed where necessary.`,
                color: "#00ccff",
                chatUrl: "https://chat.deepseek.com",
                truncateLimit: 0
            },
            {
                id: 5,
                name: "GLM",
                provider: "Zhipu AI",
                systemPrompt: `You are GLM (Zhipu AI). Respond accurately, logically, and to the point. Clearly separate facts and assumptions, adapt style to question complexity. Be concise where appropriate and detailed where necessary.`,
                color: "#ffaa33",
                chatUrl: "https://chat.z.ai",
                truncateLimit: 0
            },
            {
                id: 6,
                name: "Grok",
                provider: "xAI",
                systemPrompt: `You are Grok (xAI). Respond accurately, logically, and to the point. Clearly separate facts and assumptions, adapt style to question complexity. Be concise where appropriate and detailed where necessary.`,
                color: "#ff44aa",
                chatUrl: "https://grok.com",
                truncateLimit: 0
            },
            {
                id: 7,
                name: "Mistral",
                provider: "Mistral AI",
                systemPrompt: `You are Mistral (Mistral AI). Respond accurately, logically, and to the point. Clearly separate facts and assumptions, adapt style to question complexity. Be concise where appropriate and detailed where necessary.`,
                color: "#aaff00",
                chatUrl: "https://chat.mistral.ai",
                truncateLimit: 0
            },
            {
                id: 8,
                name: "Llama",
                provider: "Meta",
                systemPrompt: `You are Llama (Meta). Respond accurately, logically, and to the point. Clearly separate facts and assumptions, adapt style to question complexity. Be concise where appropriate and detailed where necessary.`,
                color: "#ff8800",
                chatUrl: "https://www.meta.ai",
                truncateLimit: 0
            },
            {
                id: 9,
                name: "Qwen",
                provider: "Alibaba Cloud",
                systemPrompt: `You are Qwen (Alibaba Cloud). Respond accurately, logically, and to the point. Clearly separate facts and assumptions, adapt style to question complexity. Be concise where appropriate and detailed where necessary.`,
                color: "#ff6644",
                chatUrl: "https://chat.qwen.ai",
                truncateLimit: 0
            },
            {
                id: 10,
                name: "Pi",
                provider: "Inflection AI",
                systemPrompt: `You are Pi (Inflection AI). Respond accurately, logically, and to the point. Clearly separate facts and assumptions, adapt style to question complexity. Be concise where appropriate and detailed where necessary.`,
                color: "#33eebb",
                chatUrl: "https://pi.ai",
                truncateLimit: 0
            },
            {
                id: 11,
                name: "Kimi",
                provider: "Moonshot AI",
                systemPrompt: `You are Kimi (Moonshot AI). Respond accurately, logically, and to the point. Clearly separate facts and assumptions, adapt style to question complexity. Be concise where appropriate and detailed where necessary.`,
                color: "#00bbff",
                chatUrl: "https://kimi.moonshot.cn",
                truncateLimit: 0
            },
            {
                id: 12,
                name: "ERNIE",
                provider: "Baidu",
                systemPrompt: `You are ERNIE (Baidu). Respond accurately, logically, and to the point. Clearly separate facts and assumptions, adapt style to question complexity. Be concise where appropriate and detailed where necessary.`,
                color: "#cc44ff",
                chatUrl: "https://ernie.baidu.com",
                truncateLimit: 0
            },
            {
                id: 13,
                name: "Yandex",
                provider: "Yandex",
                systemPrompt: `You are Yandex (Yandex). Respond accurately, logically, and to the point. Clearly separate facts and assumptions, adapt style to question complexity. Be concise where appropriate and detailed where necessary.`,
                color: "#ffcc00",
                chatUrl: "https://alice.yandex.ru",
                truncateLimit: 0
            },
            {
                id: 14,
                name: "GigaChat",
                provider: "Sber",
                systemPrompt: `You are GigaChat (Sber). Respond accurately, logically, and to the point. Clearly separate facts and assumptions, adapt style to question complexity. Be concise where appropriate and detailed where necessary.`,
                color: "#44ffcc",
                chatUrl: "https://giga.chat",
                truncateLimit: 0
            },
            {
                id: 15,
                name: "MiniMax",
                provider: "MiniMax AI",
                systemPrompt: `You are MiniMax (MiniMax AI). Respond accurately, logically, and to the point. Clearly separate facts and assumptions, adapt style to question complexity. Be concise where appropriate and detailed where necessary.`,
                color: "#cc44ff",
                chatUrl: "https://agent.minimax.io",
                truncateLimit: 0
            },
            {
                id: 16,
                name: "Cohere",
                provider: "Cohere",
                systemPrompt: `You are Cohere (Cohere). Respond accurately, logically, and to the point. Clearly separate facts and assumptions, adapt style to question complexity. Be concise where appropriate and detailed where necessary.`,
                color: "#44bbff",
                chatUrl: "https://dashboard.cohere.com/playground/chat",
                truncateLimit: 0
            },
            {
                id: 17,
                name: "Sarvam",
                provider: "Sarvam AI",
                systemPrompt: `You are Sarvam (Sarvam AI). Respond accurately, logically, and to the point. Clearly separate facts and assumptions, adapt style to question complexity. Be concise where appropriate and detailed where necessary.`,
                color: "#f43f5e",
                chatUrl: "https://dashboard.sarvam.ai/chat",
                truncateLimit: 0
            },
            {
                id: 18,
                name: "Upstage",
                provider: "Upstage AI",
                systemPrompt: `You are Upstage (Upstage AI). Respond accurately, logically, and to the point. Clearly separate facts and assumptions, adapt style to question complexity. Be concise where appropriate and detailed where necessary.`,
                color: "#14b8a6",
                chatUrl: "https://console.upstage.ai/playground/chat",
                truncateLimit: 0
            },
            {
                id: 19,
                name: "StepFun",
                provider: "StepFun AI",
                systemPrompt: `You are StepFun (StepFun AI). Respond accurately, logically, and to the point. Clearly separate facts and assumptions, adapt style to question complexity. Be concise where appropriate and detailed where necessary.`,
                color: "#8b5cf6",
                chatUrl: "https://stepfun.ai/chats/new",
                truncateLimit: 0
            },
            {
                id: 20,
                name: "Trinity",
                provider: "Arcee AI",
                systemPrompt: `You are Trinity (Arcee AI). Respond accurately, logically, and to the point. Clearly separate facts and assumptions, adapt style to question complexity. Be concise where appropriate and detailed where necessary.`,
                color: "#ec4899",
                chatUrl: "https://chat.arcee.ai/chat",
                truncateLimit: 0
            }
        ];

        const DEFAULT_TEMPLATES = [
            {
                name: 'Deep Analysis',
                content: `Analyze the topic deeply and structurally.

First give a short answer in 2-4 sentences.
Then explain the main idea in simple terms.
Next, cover important details, limitations, and common misunderstandings.
If appropriate, add 1-2 clear examples.
Write clearly, without filler and without unnecessary theory for theory's sake.`
            },
            {
                name: 'Step-by-Step Plan',
                content: `Create a practical step-by-step plan for solving the task.

Required format:
1. What to do first
2. What to do next
3. What risks and pitfalls to consider
4. How to verify everything is done correctly

If there are multiple strategies, briefly compare them and recommend the best one.`
            },
            {
                name: 'Compare Options',
                content: `Compare several solution options.

Make a comparison by criteria:
- pros
- cons
- cost or complexity
- risks
- when to choose which option

At the end, give a clear recommendation with an explanation of why it is the best.`
            },
            {
                name: 'Code & Debug',
                content: `Help like a strong engineer.

Needed:
- find the likely cause of the problem
- explain it in simple terms
- propose a minimal working fix
- show how to verify the result
- if there are multiple causes, sort them by probability

Do not limit yourself to general advice, be specific.`
            },
            {
                name: 'Concise Summary',
                content: `Make a dense summary without filler.

Format:
- essence in 1-2 sentences
- 3-7 key points
- what to remember

Remove repetitions, general phrases, and everything secondary.`
            },
            {
                name: 'Fact vs Opinion',
                content: `Answer carefully and intellectually honestly.

Explicitly separate:
- confirmed facts
- probable conclusions
- assumptions
- disputed points

If data is insufficient, say so directly and do not make things up.`
            }
        ];

        // State
        let currentStep = 1;
        let currentResultTab = 'final';
        let settingsTab = 'general';
        let models = [];
        let enhancerSystem = '';
        let aggregatorSystem = '';
        // Thread-based history
        let allThreads = [];      // [{id, title, createdAt, turns:[{rawPrompt,improvedPrompt,finalAnswer,timestamp,chatUrls}]}]
        let currentThread = null; // active thread
        let continuationUrls = {};
        let isContinuation = false;
        // Ratings: {modelId: 1-5}
        let modelRatings = {};
        let answerDrafts = {};
        let modelCardsDirty = true;
        let comparisonDirty = true;
        let currentTaskProfile = 'balanced';
        // Auto-save
        let autosaveTimer = null;
        let autosaveStepToRestore = 1;
        let notificationTimer = null;
        const markdownCache = new Map();
        const MAX_MARKDOWN_CACHE_ENTRIES = 100;
        let preferences = {
            notificationsEnabled: true,
            useRatingsInSynthesis: true
        };

        // ═══════════════════════════════════════════════════════════════
        // LOCAL AI STATE  (LM Studio / Ollama / Custom)
        // ═══════════════════════════════════════════════════════════════
        let lmStudioSettings = {
            enabled:  false,
            provider: 'lmstudio',   // 'lmstudio'|'ollama'|'custom'|'openai'|'anthropic'|'google'
            url:      'http://localhost:1234',
            apiKey:   '',
            model:    '',
            useFor:   'both'        // 'prompt'|'synthesis'|'both'
        };

        // Per-provider credentials (apiKey + model saved separately for each provider)
        let providerCredentials = {};

        // ═══════════════════════════════════════════════════════════════
        // APP LOGGING SYSTEM
        // ═══════════════════════════════════════════════════════════════
        let appLogs = [];
        let loggingEnabled = true;
        let logFilter = 'all';
        const MAX_LOGS = 500;

        function appLog(level, message, details = null) {
            if (!loggingEnabled) return;
            const entry = {
                id: Date.now() + Math.random(),
                time: new Date().toISOString(),
                level,      // 'info' | 'warn' | 'error' | 'success'
                message,
                details
            };
            appLogs.unshift(entry);     // newest first
            if (appLogs.length > MAX_LOGS) appLogs.length = MAX_LOGS;
            saveLogs();
            updateLogBadge();
            // Refresh logs view if tab is open
            if (settingsTab === 'logs') renderLogs();
        }

        function saveLogs() {
            try {
                localStorage.setItem('multillm_logs', JSON.stringify(appLogs.slice(0, MAX_LOGS)));
            } catch(e) { /* silent */ }
        }

        function loadLogs() {
            try {
                const raw = localStorage.getItem('multillm_logs');
                if (raw) appLogs = JSON.parse(raw);
            } catch(e) { appLogs = []; }
            try {
                loggingEnabled = localStorage.getItem('multillm_logging_enabled') !== 'false';
            } catch(e) { loggingEnabled = true; }
        }

        function clearLogs() {
            appLogs = [];
            saveLogs();
            updateLogBadge();
            renderLogs();
            updateLogStats();
        }

        function exportLogs() {
            const text = appLogs.map(e =>
                `[${e.time}] [${e.level.toUpperCase()}] ${e.message}${e.details ? '\n  ' + e.details : ''}`
            ).join('\n');
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `multillm-logs-${new Date().toISOString().slice(0,10)}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            appLog('info', 'Logs exported');
        }

        function setLogFilter(filter, btn) {
            logFilter = filter;
            document.querySelectorAll('.log-filter-btn').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');
            renderLogs();
        }

        function renderLogs() {
            const container = document.getElementById('logsList');
            const emptyEl = document.getElementById('logsEmpty');
            if (!container) return;

            const filtered = logFilter === 'all' ? appLogs : appLogs.filter(e => e.level === logFilter);

            if (filtered.length === 0) {
                container.innerHTML = '';
                if (emptyEl) emptyEl.style.display = '';
                return;
            }
            if (emptyEl) emptyEl.style.display = 'none';

            container.innerHTML = filtered.map(e => {
                const t = new Date(e.time);
                const timeStr = t.toLocaleTimeString('ru-RU', { hour12: false }) + '.' + String(t.getMilliseconds()).padStart(3,'0');
                const dateStr = t.toLocaleDateString('ru-RU', { day:'2-digit', month:'2-digit' });
                return `<div class="log-entry">
                    <span class="log-time">${dateStr} ${timeStr}</span>
                    <span class="log-level ${e.level}">${e.level}</span>
                    <span class="log-message">${escapeHtml(e.message)}${e.details ? `<div class="log-details">${escapeHtml(String(e.details))}</div>` : ''}</span>
                </div>`;
            }).join('');
            updateLogStats();
        }

        function updateLogStats() {
            const total = document.getElementById('log-stat-total');
            const errors = document.getElementById('log-stat-errors');
            const warns = document.getElementById('log-stat-warns');
            if (total) total.textContent = appLogs.length;
            if (errors) errors.textContent = appLogs.filter(e => e.level === 'error').length;
            if (warns) warns.textContent = appLogs.filter(e => e.level === 'warn').length;
        }

        function updateLogBadge() {
            const errorCount = appLogs.filter(e => e.level === 'error').length;
            const badge = document.getElementById('log-error-badge');
            if (!badge) return;
            if (errorCount > 0) {
                badge.textContent = errorCount > 99 ? '99+' : errorCount;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }

        function onLoggingToggleChange() {
            const checked = document.getElementById('loggingEnabledToggle').checked;
            loggingEnabled = checked;
            localStorage.setItem('multillm_logging_enabled', String(checked));
        }

        // ═══════════════════════════════════════════════════════════════
        // PROVIDERS CONFIG  (local + cloud)
        // ═══════════════════════════════════════════════════════════════
        const LMS_PROVIDERS = {
            // ── Local ──────────────────────────────────────────────────
            lmstudio: {
                label:      'LM Studio',
                isCloud:    false,
                defaultUrl: 'http://localhost:1234',
                hint:       'Open LM Studio → Local Server → Start Server. Enable OpenAI API compatibility mode.',
                modelsApi:  'openai',
                chatApi:    'openai',
                models:     null,
            },
            ollama: {
                label:      'Ollama',
                isCloud:    false,
                defaultUrl: 'http://localhost:11434',
                hint:       'Run Ollama: <code>ollama serve</code>. Load the model: <code>ollama pull &lt;model&gt;</code>.',
                modelsApi:  'ollama',
                chatApi:    'openai',
                models:     null,
            },
            custom: {
                label:      'Other (OpenAI API)',
                isCloud:    false,
                defaultUrl: 'http://localhost:8080',
                hint:       'Any OpenAI-compatible server: LiteLLM, llama.cpp, Jan, text-generation-webui, etc.',
                modelsApi:  'openai',
                chatApi:    'openai',
                models:     null,
            },
            // ── Cloud ──────────────────────────────────────────────────
            openai: {
                label:       'OpenAI',
                isCloud:     true,
                defaultUrl:  'https://api.openai.com',
                hint:        'Get your key at <a href="https://platform.openai.com/api-keys" target="_blank" class="text-blue-500 hover:underline">platform.openai.com</a>.',
                apikeyHint:  'Key starts with <code>sk-…</code>',
                apikeyLabel: 'OpenAI API key',
                modelsApi:   'hardcoded',
                chatApi:     'openai',
                models:      [
                    'gpt-5.4',
                    'gpt-5.4-2026-03-05',
                    'gpt-5.4-pro',
                    'gpt-5.4-pro-2026-03-05',
                    'gpt-5.4-mini',
                    'gpt-5.4-nano',
                    'gpt-5-mini',
                    'gpt-5-nano',
                    'gpt-5',
                    'gpt-4.1',
                    'gpt-5.3-codex',
                    'gpt-5.2-codex',
                    'gpt-5.1-codex',
                    'gpt-5.1-codex-max',
                    'gpt-5.1-codex-mini',
                    'gpt-5-codex',
                    'codex-mini-latest',
                ],
            },
            deepseek: {
                label:       'DeepSeek',
                isCloud:     true,
                defaultUrl:  'https://api.deepseek.com',
                hint:        'Get your key at <a href="https://platform.deepseek.com" target="_blank" class="text-blue-500 hover:underline">platform.deepseek.com</a>.',
                apikeyHint:  'API key DeepSeek',
                apikeyLabel: 'DeepSeek API key',
                modelsApi:   'openai',
                chatApi:     'openai',
                models:      null,
            },
            anthropic: {
                label:       'Anthropic',
                isCloud:     true,
                defaultUrl:  'https://api.anthropic.com',
                hint:        'Get your key at <a href="https://console.anthropic.com" target="_blank" class="text-blue-500 hover:underline">console.anthropic.com</a>.<br><span style="color:#a16207;">',
                apikeyHint:  'Key starts with <code>sk-ant-…</code>',
                apikeyLabel: 'Anthropic API key',
                modelsApi:   'hardcoded',
                chatApi:     'anthropic',
                models:      [
                    'claude-opus-4-6',
                    'claude-sonnet-4-5',
                    'claude-haiku-4-5',
                    'claude-opus-4-5',
                    'claude-opus-4-1',
                    'claude-sonnet-4',
                    'claude-sonnet-3-7',
                    'claude-opus-4',
                    'claude-haiku-3',
                ],
            },
            mistral: {
                label:       'Mistral AI',
                isCloud:     true,
                defaultUrl:  'https://api.mistral.ai',
                hint:        'Get your key at <a href="https://console.mistral.ai" target="_blank" class="text-blue-500 hover:underline">console.mistral.ai</a>.',
                apikeyHint:  'API key Mistral',
                apikeyLabel: 'Mistral API key',
                modelsApi:   'openai',
                chatApi:     'openai',
                models:      null,
            },
            huggingface: {
                label:       'Hugging Face',
                isCloud:     true,
                defaultUrl:  'https://router.huggingface.co/hf-inference/models',
                hint:        'Get your key at <a href="https://huggingface.co/settings/tokens" target="_blank" class="text-blue-500 hover:underline">huggingface.co</a>. Specify the model manually, e.g. meta-llama/Llama-3.3-70B-Instruct',
                apikeyHint:  'HF Key (hf_…)',
                apikeyLabel: 'Hugging Face API key',
                modelsApi:   'manual',
                chatApi:     'openai',
                models:      null,
                manualModel: true,
                cloudCheck:  true,
            },
            openrouter: {
                label:       'OpenRouter',
                isCloud:     true,
                defaultUrl:  'https://openrouter.ai/api',
                hint:        'Get your key at <a href="https://openrouter.ai/keys" target="_blank" class="text-blue-500 hover:underline">openrouter.ai/keys</a>. Specify the model manually, e.g. <code>anthropic/claude-3.5-sonnet</code>',
                apikeyHint:  'Key starts with <code>sk-or-…</code>',
                apikeyLabel: 'OpenRouter API key',
                modelsApi:   'manual',
                chatApi:     'openai',
                models:      null,
                manualModel: true,
                cloudCheck:  true,
            },
            google: {
                label:       'Google (Gemini)',
                isCloud:     true,
                defaultUrl:  'https://generativelanguage.googleapis.com/v1beta/openai',
                hint:        'Get your key at <a href="https://aistudio.google.com/apikey" target="_blank" class="text-blue-500 hover:underline">aistudio.google.com</a>.',
                apikeyHint:  'Google AI Studio API key',
                apikeyLabel: 'Google API key',
                modelsApi:   'hardcoded',
                chatApi:     'openai',
                models:      [
                    'gemini-2.5-pro',
                    'gemini-2.5-flash',
                    'gemini-2.5-flash-lite',
                    'gemini-2.0-flash',
                    'gemini-2.0-flash-lite',
                ],
            },
            groq: {
                label:       'Groq Cloud',
                isCloud:     true,
                defaultUrl:  'https://api.groq.com/openai',
                hint:        'Get your key at <a href="https://console.groq.com/keys" target="_blank" class="text-blue-500 hover:underline">console.groq.com/keys</a>.',
                apikeyHint:  'Key starts with <code>gsk_…</code>',
                apikeyLabel: 'Groq API key',
                modelsApi:   'hardcoded',
                chatApi:     'openai',
                models:      [
                    'llama-3.1-8b-instant',
                    'llama-3.3-70b-versatile',
                    'meta-llama/llama-4-scout-17b-16e-instruct',
                    'groq/compound',
                    'groq/compound-mini',
                    'qwen/qwen3-32b',
                    'openai/gpt-oss-120b',
                    'openai/gpt-oss-20b',
                    'openai/gpt-oss-safeguard-20b',
                    'whisper-large-v3',
                    'whisper-large-v3-turbo',
                ],
            },
        };

        function getProviderInfo(provider) {
            return LMS_PROVIDERS[provider] || LMS_PROVIDERS.lmstudio;
        }

        function isCloudProvider(provider) {
            return !!(getProviderInfo(provider).isCloud);
        }

        function toggleApiKeyVisibility() {
            const input = document.getElementById('lmsApiKeyInput');
            const iconClosed = document.getElementById('eye-icon-closed');
            const iconOpen   = document.getElementById('eye-icon-open');
            if (!input) return;
            if (input.type === 'password') {
                input.type = 'text';
                iconClosed?.classList.add('hidden');
                iconOpen?.classList.remove('hidden');
            } else {
                input.type = 'password';
                iconClosed?.classList.remove('hidden');
                iconOpen?.classList.add('hidden');
            }
        }

        // ── Import API keys from .txt file ──
        const KEY_MAP = {
            'OPENAI':     'openai',
            'GROQ':       'groq',
            'GOOGLE':     'google',
            'ANTHROPIC':  'anthropic',
            'DEEPSEEK':   'deepseek',
            'MISTRAL':    'mistral',
            'HUGGING_FACE': 'huggingface',
            'HUGGINGFACE':  'huggingface',
            'OPENROUTER': 'openrouter',
        };

        function importKeysFromFile(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                const text = e.target.result;
                const lines = text.split('\n');
                let imported = 0;
                lines.forEach(line => {
                    line = line.trim();
                    if (!line || line.startsWith('#')) return;
                    const sepIdx = line.indexOf(' - ');
                    if (sepIdx === -1) return;
                    const key   = line.substring(0, sepIdx).trim().toUpperCase();
                    const value = line.substring(sepIdx + 3).trim();
                    if (!value) return;
                    const provider = KEY_MAP[key];
                    if (!provider) return;
                    if (!providerCredentials[provider]) providerCredentials[provider] = {};
                    providerCredentials[provider].apiKey = value;
                    imported++;
                });
                saveLmsSettings();
                // Refresh UI for current provider
                const currentProvider = document.getElementById('lmsProviderInput')?.value || lmStudioSettings.provider;
                if (providerCredentials[currentProvider]?.apiKey) {
                    const apiKeyInput = document.getElementById('lmsApiKeyInput');
                    if (apiKeyInput) apiKeyInput.value = providerCredentials[currentProvider].apiKey;
                }
                showSystemNotification(`Keys imported: ${imported}`, 'saved', 3000);
                appLog('success', `Key import: ${imported} from ${lines.length} lines`);
            };
            reader.readAsText(file);
            event.target.value = '';
        }

        // ── Export API keys to .txt file ──
        function exportKeysToFile() {
            const lines = [];
            const providerNames = {
                'openai': 'OPENAI', 'groq': 'GROQ', 'google': 'GOOGLE',
                'anthropic': 'ANTHROPIC', 'deepseek': 'DEEPSEEK', 'mistral': 'MISTRAL',
                'huggingface': 'HUGGING_FACE', 'openrouter': 'OPENROUTER',
            };
            Object.keys(providerCredentials).forEach(provider => {
                const cred = providerCredentials[provider];
                if (cred?.apiKey) {
                    const name = providerNames[provider] || provider.toUpperCase();
                    lines.push(`${name} - ${cred.apiKey}`);
                }
            });
            if (lines.length === 0) {
                showSystemNotification('No keys to export', 'warning', 2500);
                return;
            }
            const blob = new Blob([lines.join('\n') + '\n'], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'api-keys.txt';
            a.click();
            URL.revokeObjectURL(url);
            showSystemNotification(`Keys exported: ${lines.length}`, 'saved', 2500);
        }

        // ── Clear all API keys ──
        function clearAllApiKeys() {
            const count = Object.keys(providerCredentials).filter(p => providerCredentials[p]?.apiKey).length;
            if (count === 0) {
                showSystemNotification('No keys', 'warning', 2000);
                return;
            }
            if (!confirm(`Delete all saved API keys (${count} pcs.))? This action cannot be undone.`)) return;
            providerCredentials = {};
            lmStudioSettings.apiKey = '';
            saveLmsSettings();
            const apiKeyInput = document.getElementById('lmsApiKeyInput');
            if (apiKeyInput) apiKeyInput.value = '';
            showSystemNotification(`Keys deleted: ${count}`, 'saved', 2500);
            appLog('success', `All API keys deleted (${count})`);
        }

        function updateLmsLayoutForProvider(provider) {
            const info    = getProviderInfo(provider);
            const isCloud = info.isCloud;
            const isManual = info.manualModel;

            // Show/hide API key card
            const apiKeyCard = document.getElementById('lms-apikey-card');
            if (apiKeyCard) apiKeyCard.style.display = isCloud ? '' : 'none';

            // Show/hide URL card
            const urlCard = document.getElementById('lms-url-card');
            if (urlCard) urlCard.style.display = (isCloud && (!isManual || info.cloudCheck)) ? 'none' : '';

            // Show/hide cloud check card
            const cloudCard = document.getElementById('lms-cloud-check-card');
            if (cloudCard) cloudCard.style.display = (isCloud && (!isManual || info.cloudCheck)) ? '' : 'none';

            // Show/hide model select vs manual input
            const selectCard = document.getElementById('lms-model-select-card');
            const manualCard = document.getElementById('lms-model-manual-card');
            if (selectCard) selectCard.style.display = isManual ? 'none' : '';
            if (manualCard) manualCard.style.display = isManual ? '' : 'none';

            // Update manual model hints
            if (isManual) {
                const manualHint = document.getElementById('lms-model-manual-hint');
                if (manualHint) manualHint.innerHTML = info.hint || 'Specify model ID manually.';
                // Restore saved manual model
                const manualInput = document.getElementById('lmsModelManualInput');
                if (manualInput && lmStudioSettings.model) manualInput.value = lmStudioSettings.model;
            }

            // Update API key labels/hints
            if (isCloud) {
                const lbl = document.getElementById('lms-apikey-label');
                const hint = document.getElementById('lms-apikey-hint');
                if (lbl) lbl.textContent = info.apikeyLabel || 'API key';
                if (hint) hint.innerHTML = (info.apikeyHint || '') + ' · Key is stored only in your browser.';
            }

            // Update model hint
            const modelHint = document.getElementById('lms-model-hint');
            if (modelHint && !isManual) {
                if (info.modelsApi === 'hardcoded') {
                    modelHint.textContent = `List of models ${info.label} (current at the time of application update).`;
                } else {
                    modelHint.textContent = 'List loads when checking connection.';
                }
            }
        }

        function selectLmsProvider(provider) {
            const input = document.getElementById('lmsProviderInput');
            const prevProvider = input?.value || lmStudioSettings.provider;

            // Save current provider credentials before switching
            if (prevProvider && prevProvider !== provider) {
                const apiKeyInput = document.getElementById('lmsApiKeyInput');
                const modelSelect = document.getElementById('lmsModelSelect');
                const manualInput = document.getElementById('lmsModelManualInput');
                const urlInput    = document.getElementById('lmsUrlInput');
                const prevInfo    = getProviderInfo(prevProvider);
                providerCredentials[prevProvider] = {
                    apiKey: apiKeyInput?.value || '',
                    model:  (prevInfo.manualModel ? manualInput?.value : modelSelect?.value) || '',
                    url:    urlInput?.value || ''
                };
                saveLmsSettings();
            }

            if (input) input.value = provider;

            // Update card highlights
            Object.keys(LMS_PROVIDERS).forEach(p => {
                const card = document.getElementById(`lms-provider-card-${p}`);
                if (card) card.classList.toggle('selected', p === provider);
            });

            const info = getProviderInfo(provider);
            const saved = providerCredentials[provider] || {};

            // Update URL field
            const urlInput = document.getElementById('lmsUrlInput');
            if (urlInput) {
                if (!info.isCloud) {
                    urlInput.value = saved.url || info.defaultUrl;
                    urlInput.placeholder = info.defaultUrl;
                }
            }

            // Load saved API key
            const apiKeyInput = document.getElementById('lmsApiKeyInput');
            if (apiKeyInput) apiKeyInput.value = saved.apiKey || '';

            // Update hints
            const serverHint = document.getElementById('lms-server-hint');
            if (serverHint) serverHint.innerHTML = info.isCloud ? '' : (info.hint || '');

            const providerHint = document.getElementById('lms-provider-hint');
            if (providerHint) {
                const icons = { lmstudio:'🖥️', ollama:'🦙', custom:'⚙️', openai:'🤖', deepseek:'🔮', anthropic:'🧠', google:'🌟', groq:'⚡', mistral:'🌀', huggingface:'🤗', openrouter:'🔀' };
                providerHint.innerHTML = `${icons[provider]||'⚙️'} <strong>${info.label}</strong> selected${info.isCloud ? ` · <span style="color:var(--text-muted)">API key required</span>` : ''}`;
            }

            // Update cloud hint
            const cloudHint = document.getElementById('lms-cloud-hint');
            if (cloudHint && info.isCloud) cloudHint.innerHTML = info.hint || '';

            // Show/hide layout panels
            updateLmsLayoutForProvider(provider);

            // Reset connection status
            setLmsConnectionStatus('disconnected', 'Not checked');
            setLmsCloudStatus('disconnected', 'Not checked');

            // For hardcoded-model providers, pre-populate list immediately
            if (info.modelsApi === 'hardcoded' && info.models) {
                populateLmsModelSelect(info.models);
                if (saved.model) {
                    const modelSelect = document.getElementById('lmsModelSelect');
                    if (modelSelect) modelSelect.value = saved.model;
                }
            } else if (saved.model) {
                // Show saved model even before refresh
                const modelSelect = document.getElementById('lmsModelSelect');
                if (modelSelect) {
                    modelSelect.innerHTML = `<option value="${escapeHtml(saved.model)}" selected>${escapeHtml(saved.model)}</option><option value="">— Refresh list —</option>`;
                }
            } else {
                const modelSelect = document.getElementById('lmsModelSelect');
                if (modelSelect) modelSelect.innerHTML = '<option value="">— Check connection —</option>';
            }

            // Restore manual model input
            if (info.manualModel && saved.model) {
                const manualInput = document.getElementById('lmsModelManualInput');
                if (manualInput) manualInput.value = saved.model;
            }

            // Update global settings to match
            lmStudioSettings.provider = provider;
            lmStudioSettings.apiKey   = saved.apiKey || '';
            lmStudioSettings.model    = saved.model || '';
            lmStudioSettings.url      = saved.url || info.defaultUrl;
        }

        function loadLmsSettings() {
            try {
                const raw = localStorage.getItem('multillm_lmstudio');
                if (raw) lmStudioSettings = { ...lmStudioSettings, ...JSON.parse(raw) };
                if (!lmStudioSettings.provider) lmStudioSettings.provider = 'lmstudio';

                // Load per-provider credentials
                const credRaw = localStorage.getItem('multillm_provider_credentials');
                if (credRaw) providerCredentials = JSON.parse(credRaw);

                // Migrate old single-key format to per-provider on first load
                if (lmStudioSettings.apiKey && !providerCredentials[lmStudioSettings.provider]) {
                    providerCredentials[lmStudioSettings.provider] = {
                        apiKey: lmStudioSettings.apiKey,
                        model:  lmStudioSettings.model || '',
                        url:    lmStudioSettings.url || ''
                    };
                }
            } catch(e) { appLog('error', 'Error loading provider settings', e.message); }
        }

        function saveLmsSettings() {
            try {
                localStorage.setItem('multillm_lmstudio', JSON.stringify(lmStudioSettings));
                localStorage.setItem('multillm_provider_credentials', JSON.stringify(providerCredentials));
            } catch(e) { appLog('error', 'Error saving provider settings', e.message); }
        }

        function saveCurrentProviderCredentials() {
            const provider    = document.getElementById('lmsProviderInput')?.value || lmStudioSettings.provider;
            const info        = getProviderInfo(provider);
            const apiKeyInput = document.getElementById('lmsApiKeyInput');
            const modelSelect = document.getElementById('lmsModelSelect');
            const manualInput = document.getElementById('lmsModelManualInput');
            const urlInput    = document.getElementById('lmsUrlInput');

            providerCredentials[provider] = {
                apiKey: apiKeyInput?.value || '',
                model:  (info.manualModel ? manualInput?.value : modelSelect?.value) || '',
                url:    urlInput?.value || ''
            };

            // Also update global settings
            lmStudioSettings.provider = provider;
            lmStudioSettings.apiKey   = providerCredentials[provider].apiKey;
            lmStudioSettings.model    = providerCredentials[provider].model;
            lmStudioSettings.url      = providerCredentials[provider].url;

            saveLmsSettings();
        }

        function onLmsToggleChange() {
            const enabled = document.getElementById('lmsEnabledToggle').checked;
            const section = document.getElementById('lms-config-section');
            if (section) section.style.opacity = enabled ? '1' : '0.5';
        }

        function populateLmsSettingsUI() {
            const enabledToggle = document.getElementById('lmsEnabledToggle');
            const urlInput      = document.getElementById('lmsUrlInput');
            const apiKeyInput   = document.getElementById('lmsApiKeyInput');
            const modelSelect   = document.getElementById('lmsModelSelect');
            const section       = document.getElementById('lms-config-section');
            const providerInp   = document.getElementById('lmsProviderInput');

            if (enabledToggle) enabledToggle.checked = lmStudioSettings.enabled;
            if (section) section.style.opacity = lmStudioSettings.enabled ? '1' : '0.5';

            const provider = lmStudioSettings.provider || 'lmstudio';
            if (providerInp) providerInp.value = provider;

            // Highlight card
            Object.keys(LMS_PROVIDERS).forEach(p => {
                const card = document.getElementById(`lms-provider-card-${p}`);
                if (card) card.classList.toggle('selected', p === provider);
            });

            const info   = getProviderInfo(provider);
            const saved  = providerCredentials[provider] || {};

            // URL
            if (urlInput) {
                urlInput.value       = saved.url || lmStudioSettings.url || info.defaultUrl;
                urlInput.placeholder = info.defaultUrl;
            }

            // API Key (from per-provider credentials)
            if (apiKeyInput) apiKeyInput.value = saved.apiKey || '';

            // Hints
            const serverHint = document.getElementById('lms-server-hint');
            if (serverHint) serverHint.innerHTML = info.isCloud ? '' : (info.hint || '');

            const cloudHint = document.getElementById('lms-cloud-hint');
            if (cloudHint && info.isCloud) cloudHint.innerHTML = info.hint || '';

            const providerHint = document.getElementById('lms-provider-hint');
            if (providerHint) {
                const icons = { lmstudio:'🖥️', ollama:'🦙', custom:'⚙️', openai:'🤖', deepseek:'🔮', anthropic:'🧠', google:'🌟', groq:'⚡', mistral:'🌀', huggingface:'🤗', openrouter:'🔀' };
                providerHint.innerHTML = `${icons[provider]||'⚙️'} <strong>${info.label}</strong> selected${info.isCloud ? ` · <span style="color:var(--text-muted)">API key required</span>` : ''}`;
            }

            // Layout
            updateLmsLayoutForProvider(provider);

            // Usage radio
            const radio = document.querySelector(`input[name="lmsUseFor"][value="${lmStudioSettings.useFor || 'both'}"]`);
            if (radio) radio.checked = true;

            // Populate models (from per-provider credentials)
            const savedModel = saved.model || '';
            if (info.modelsApi === 'hardcoded' && info.models) {
                populateLmsModelSelect(info.models);
                if (savedModel && modelSelect) {
                    const opt = modelSelect.querySelector(`option[value="${savedModel}"]`);
                    if (opt) modelSelect.value = savedModel;
                }
            } else if (savedModel && modelSelect) {
                modelSelect.innerHTML = `<option value="${escapeHtml(savedModel)}" selected>${escapeHtml(savedModel)}</option><option value="">— Refresh list —</option>`;
            }

            // Restore manual model input
            if (info.manualModel && savedModel) {
                const manualInput = document.getElementById('lmsModelManualInput');
                if (manualInput) manualInput.value = savedModel;
            }
        }

        function setLmsConnectionStatus(status, text) {
            // Local status indicator (inside url card)
            const el     = document.getElementById('lms-connection-status');
            const textEl = document.getElementById('lms-status-text');
            if (el) el.className = `lms-status ${status}`;
            if (textEl) textEl.textContent = text;
        }

        function setLmsCloudStatus(status, text) {
            // Cloud status indicator
            const el     = document.getElementById('lms-connection-status-cloud');
            const textEl = document.getElementById('lms-status-text-cloud');
            if (el) el.className = `lms-status ${status}`;
            if (textEl) textEl.textContent = text;
        }

        function setAnyLmsStatus(status, text) {
            const provider = document.getElementById('lmsProviderInput')?.value || lmStudioSettings.provider;
            if (isCloudProvider(provider)) {
                setLmsCloudStatus(status, text);
            } else {
                setLmsConnectionStatus(status, text);
            }
        }

        // ── Fetch model list — handles all API types ──────────────────
        async function fetchLmsModelList(url, provider, apiKey) {
            const info = getProviderInfo(provider);

            // Hardcoded lists (Anthropic, Google)
            if (info.modelsApi === 'hardcoded') {
                if (!apiKey) throw new Error('Enter API key');
                // Quick auth test via a minimal chat request
                await testCloudAuth(url, provider, apiKey);
                return info.models || [];
            }

            // Ollama native /api/tags
            if (info.modelsApi === 'ollama') {
                try {
                    const resp = await fetchWithTimeout(`${url}/api/tags`, { method: 'GET' }, 6000);
                    if (resp.ok) {
                        const data = await resp.json();
                        return (data.models || []).map(m => m.name || m.model).filter(Boolean);
                    }
                } catch(_) { /* fall through */ }
            }

            // OpenAI /v1/models
            const headers = { 'Content-Type': 'application/json' };
            if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

            const resp = await fetchWithTimeout(`${url}/v1/models`, { method: 'GET', headers }, 8000);
            if (!resp.ok) {
                const txt = await resp.text().catch(() => '');
                throw new Error(`HTTP ${resp.status}${txt ? ': ' + txt.slice(0,120) : ''}`);
            }
            const data = await resp.json();
            const allModels = (data.data || []).map(m => m.id).filter(Boolean);
            // For OpenAI: filter to useful chat models, keep order
            if (provider === 'openai') {
                const preferred = allModels.filter(m =>
                    m.startsWith('gpt-') || m.startsWith('o1') || m.startsWith('o3') || m.startsWith('chatgpt')
                );
                return preferred.length ? preferred : allModels;
            }
            return allModels;
        }

        // Quick auth test for providers with hardcoded model lists
        async function testCloudAuth(url, provider, apiKey) {
            const info = getProviderInfo(provider);
            if (info.chatApi === 'anthropic') {
                const resp = await fetchWithTimeout(`${url}/v1/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type':    'application/json',
                        'x-api-key':       apiKey,
                        'anthropic-version': '2023-06-01',
                        'anthropic-dangerous-direct-browser-access': 'true',
                    },
                    body: JSON.stringify({
                        model:      info.models[0],
                        max_tokens: 1,
                        messages:   [{ role: 'user', content: 'Hi' }],
                    })
                }, 10000);
                if (resp.status === 401) throw new Error('Invalid API key');
                if (resp.status === 403) throw new Error('Access denied');
                // 400/529 etc. are acceptable — key is valid
                return;
            }
            // Google / others — OpenAI compat
            const resp = await fetchWithTimeout(`${url}/v1/models`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${apiKey}` },
            }, 8000);
            if (resp.status === 401) throw new Error('Invalid API key');
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        }

        async function testLmsConnection() {
            const urlInput    = document.getElementById('lmsUrlInput');
            const providerInp = document.getElementById('lmsProviderInput');
            const apiKeyInp   = document.getElementById('lmsApiKeyInput');
            const provider    = providerInp?.value || lmStudioSettings.provider || 'lmstudio';
            const info        = getProviderInfo(provider);
            const url         = info.isCloud ? info.defaultUrl : (urlInput?.value || lmStudioSettings.url).trim().replace(/\/+$/, '');
            const apiKey      = apiKeyInp?.value?.trim() || lmStudioSettings.apiKey || '';
            const isManual    = info.manualModel;

            const btnId = info.isCloud ? 'lms-test-cloud-btn' : 'lms-test-btn';
            const btn   = document.getElementById(btnId);

            setAnyLmsStatus('checking', 'Checking…');
            if (btn) btn.disabled = true;
            appLog('info', `Checking connection → ${info.label}${url ? ' (' + url + ')' : ''}`);

            // For manual model providers, check API key
            if (isManual) {
                if (!apiKey) {
                    setAnyLmsStatus('error', 'Enter API key');
                    appLog('warn', `Checking ${info.label}: API key not specified`);
                    showSystemNotification(`Enter API key for ${info.label}`, 'warning', 3000);
                    if (btn) btn.disabled = false;
                    return [];
                }
                // Read model from manual input
                const manualInput = document.getElementById('lmsModelManualInput');
                const manualModel = manualInput?.value?.trim() || lmStudioSettings.model || '';

                // If cloudCheck is enabled, do a real API test
                if (info.cloudCheck) {
                    try {
                        let testUrl, testOpts;
                        if (provider === 'openrouter') {
                            testUrl  = `${info.defaultUrl}/v1/auth/key`;
                            testOpts = { method: 'GET', headers: { 'Authorization': `Bearer ${apiKey}` } };
                        } else if (provider === 'huggingface') {
                            // HF Router: POST to model endpoint with minimal payload
                            const mdl = manualModel || 'meta-llama/Llama-3.3-70B-Instruct';
                            testUrl  = `${info.defaultUrl}/${mdl}/v1/chat/completions`;
                            testOpts = {
                                method:  'POST',
                                headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                                body:    JSON.stringify({ model: mdl, messages: [{ role: 'user', content: 'hi' }], max_tokens: 1 })
                            };
                        } else {
                            testUrl  = `${info.defaultUrl}/v1/models`;
                            testOpts = { method: 'GET', headers: { 'Authorization': `Bearer ${apiKey}` } };
                        }
                        const resp = await fetchWithTimeout(testUrl, testOpts, 10000);
                        if (resp.status === 401 || resp.status === 403) {
                            throw new Error('Invalid API key');
                        }
                        // Any other response means key is valid
                    } catch(e) {
                        if (e.message === 'Invalid API key') throw e;
                        // Network errors are ok — key might still be valid
                    }
                }

                if (manualModel) {
                    lmStudioSettings.model = manualModel;
                }
                saveCurrentProviderCredentials();
                setAnyLmsStatus('connected', `Key is valid${manualModel ? ' · ' + manualModel : ''}`);
                appLog('success', `${info.label} — API key verified${manualModel ? ', model: ' + manualModel : ''}`);
                showSystemNotification(`${info.label} configured ✓`, 'saved', 2500);
                if (btn) btn.disabled = false;
                return manualModel ? [manualModel] : [];
            }

            try {
                const modelList = await fetchLmsModelList(url, provider, apiKey);
                const count = modelList.length;
                saveCurrentProviderCredentials();
                setAnyLmsStatus('connected', `Connected · ${count} models`);
                populateLmsModelSelect(modelList);
                appLog('success', `${info.label} — OK. Models: ${count}`, modelList.slice(0,10).join(', '));
                showSystemNotification(`${info.label} connected ✓`, 'saved', 2500);
                return modelList;
            } catch(e) {
                setAnyLmsStatus('error', 'Error');
                appLog('error', `Failed to connect to ${info.label}`, e.message);
                showSystemNotification(`${info.label}: ${e.message.slice(0, 60)}`, 'error', 4000);
                return [];
            } finally {
                if (btn) btn.disabled = false;
            }
        }

        async function refreshLmsModels() {
            const btn = document.getElementById('lms-refresh-btn');
            if (btn) { btn.disabled = true; btn.textContent = '…'; }
            await testLmsConnection();
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> Refresh`;
            }
        }

        function populateLmsModelSelect(modelsList) {
            const select  = document.getElementById('lmsModelSelect');
            if (!select) return;
            if (!modelsList || modelsList.length === 0) {
                select.innerHTML = '<option value="">— No models available —</option>';
                return;
            }
            const current = lmStudioSettings.model;
            select.innerHTML = modelsList.map(m =>
                `<option value="${escapeHtml(m)}"${m === current ? ' selected' : ''}>${escapeHtml(m)}</option>`
            ).join('');
            if (!current && modelsList.length > 0) select.value = modelsList[0];
        }

        function fetchWithTimeout(url, options, timeoutMs) {
            return new Promise((resolve, reject) => {
                const controller = new AbortController();
                const timer = setTimeout(() => { controller.abort(); reject(new Error(`Timeout (${timeoutMs}ms)`)); }, timeoutMs);
                fetch(url, { ...options, signal: controller.signal })
                    .then(r  => { clearTimeout(timer); resolve(r); })
                    .catch(e => { clearTimeout(timer); reject(e); });
            });
        }

        // ── Retry with exponential backoff ──────────────────────────────
        async function retryWithBackoff(fn, maxRetries = 2) {
            let lastError;
            for (let attempt = 0; attempt <= maxRetries; attempt++) {
                try {
                    return await fn();
                } catch (e) {
                    lastError = e;
                    if (attempt < maxRetries) {
                        const delay = 1000 * Math.pow(2, attempt);
                        appLog('warn', `Request failed, retry ${attempt + 1}/${maxRetries} in ${delay}ms: ${e.message}`);
                        await new Promise(r => setTimeout(r, delay));
                    }
                }
            }
            throw lastError;
        }

        // ── Build request and parse response for each chat API format ──
        async function doCloudChatRequest(url, provider, apiKey, model, systemPrompt, userPrompt) {return retryWithBackoff(async () => {
            const info = getProviderInfo(provider);

            if (info.chatApi === 'anthropic') {
                // Anthropic Messages API
                const resp = await fetchWithTimeout(`${url}/v1/messages`, {
                    method:  'POST',
                    headers: {
                        'Content-Type':      'application/json',
                        'x-api-key':         apiKey,
                        'anthropic-version': '2023-06-01',
                        'anthropic-dangerous-direct-browser-access': 'true',
                    },
                    body: JSON.stringify({
                        model,
                        max_tokens: 4096,
                        system:   systemPrompt,
                        messages: [{ role: 'user', content: userPrompt }],
                    })
                }, 120000);
                if (!resp.ok) {
                    const txt = await resp.text().catch(() => '');
                    throw new Error(`HTTP ${resp.status}: ${txt.slice(0, 200)}`);
                }
                const data = await resp.json();
                return data?.content?.[0]?.text || '';
            }

            // OpenAI-compat (works for OpenAI, Google, local servers)
            const headers = { 'Content-Type': 'application/json' };
            if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

            const resp = await fetchWithTimeout(`${url}/v1/chat/completions`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user',   content: userPrompt   },
                    ],
                    temperature: 0.7,
                    max_tokens:  4096,
                    stream:      false,
                })
            }, 120000);
            if (!resp.ok) {
                const txt = await resp.text().catch(() => '');
                throw new Error(`HTTP ${resp.status}: ${txt.slice(0, 200)}`);
            }
            const data = await resp.json();
            return data?.choices?.[0]?.message?.content || '';
        });}

        // ── Main call function ─────────────────────────────────────────
        async function callLmsApi(systemPrompt, userPrompt, targetFieldId, statusElId, btnId, badgeId) {
            const provider = lmStudioSettings.provider || 'lmstudio';
            const info     = getProviderInfo(provider);
            const url      = info.isCloud ? info.defaultUrl : (lmStudioSettings.url || info.defaultUrl).trim().replace(/\/+$/, '');
            const apiKey   = lmStudioSettings.apiKey || '';
            // Get model from manual input for manualModel providers, or from select
            let model;
            if (info.manualModel) {
                const manualInput = document.getElementById('lmsModelManualInput');
                model = manualInput?.value?.trim() || lmStudioSettings.model || '';
            } else {
                model = lmStudioSettings.model;
            }

            const btn      = document.getElementById(btnId);
            const statusEl = document.getElementById(statusElId);

            if (!model) {
                showSystemNotification('Select a model in Settings → Providers', 'warning', 3200);
                appLog('warn', 'Send cancelled: no model selected');
                return;
            }
            if (info.isCloud && !apiKey) {
                showSystemNotification(`Enter API key for ${info.label}`, 'warning', 3200);
                appLog('warn', `Send cancelled: no API key for ${info.label}`);
                return;
            }

            if (btn) {
                btn.disabled = true; btn.classList.add('loading');
                btn.innerHTML = `<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> Waiting for response…`;
            }
            if (statusEl) {
                statusEl.textContent = `⏳ ${info.label} · ${model}…`;
                statusEl.classList.remove('hidden');
                statusEl.style.color = 'var(--text-muted)';
            }
            appLog('info', `Request → ${info.label} · ${model}`);

            try {
                const result = await doCloudChatRequest(url, provider, apiKey, model, systemPrompt, userPrompt);
                if (!result) throw new Error('Empty response from model');

                const field = document.getElementById(targetFieldId);
                if (field) { field.value = result; field.dispatchEvent(new Event('input')); }
                autoSave();

                const badge = document.getElementById(badgeId);
                if (badge) badge.classList.remove('hidden');

                if (statusEl) { statusEl.textContent = `✓ ${info.label} · ${model}`; statusEl.style.color = '#16a34a'; }
                appLog('success', `Response received ← ${info.label} · ${model}, chars: ${result.length}`);
                showSystemNotification(`Response from ${model} received`, 'saved', 2500);

            } catch(e) {
                appLog('error', `Error ${info.label} · ${model}`, e.message);
                if (statusEl) { statusEl.textContent = `✗ ${e.message.slice(0, 120)}`; statusEl.style.color = '#ef4444'; }
                showSystemNotification(`${info.label}: ${e.message.slice(0, 70)}`, 'error', 4500);
            } finally {
                if (btn) {
                    btn.disabled = false; btn.classList.remove('loading');
                    btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Send to AI`;
                }
            }
        }

        async function sendEnhancerToLmStudio() {
            if (!document.getElementById('rawPrompt')?.value?.trim()) {
                showSystemNotification('Enter request on step 1', 'warning', 2500);
                appLog('warn', 'Prompt improvement send: empty request');
                return;
            }
            await callLmsApi(enhancerSystem, generateEnhancerUserPrompt(), 'improvedPrompt', 'lms-enhancer-status', 'lms-send-enhancer-btn', 'lms-enhancer-filled-badge');
        }

        async function sendAggregatorToLmStudio() {
            if (!models.some(m => getTrimmedAnswerValue(m.id))) {
                showSystemNotification('Add model answers on step 3', 'warning', 2500);
                appLog('warn', 'Synthesis send: no model answers');
                return;
            }
            await callLmsApi(aggregatorSystem, generateAggregatorPrompt(), 'finalAnswer', 'lms-aggregator-status', 'lms-send-aggregator-btn', 'lms-aggregator-filled-badge');
        }

        function updateLmsUiVisibility() {
            const enabled   = lmStudioSettings.enabled;
            const useFor    = lmStudioSettings.useFor || 'both';
            const provider  = lmStudioSettings.provider || 'lmstudio';
            const provLabel = getProviderInfo(provider).label;
            // Get model from manual input for manualModel providers, or from settings
            let modelName = lmStudioSettings.model || '—';
            if (getProviderInfo(provider).manualModel) {
                const manualInput = document.getElementById('lmsModelManualInput');
                modelName = manualInput?.value?.trim() || lmStudioSettings.model || '—';
            }

            const enhancerPanel   = document.getElementById('lms-enhancer-panel');
            const aggregatorPanel = document.getElementById('lms-aggregator-panel');

            if (enhancerPanel) {
                const show = enabled && (useFor === 'prompt' || useFor === 'both');
                enhancerPanel.classList.toggle('hidden', !show);
                const n = document.getElementById('lms-enhancer-model-name');
                const p = document.getElementById('lms-enhancer-provider-label');
                if (n) n.textContent = modelName;
                if (p) p.textContent = provLabel;
            }
            if (aggregatorPanel) {
                const show = enabled && (useFor === 'synthesis' || useFor === 'both');
                aggregatorPanel.classList.toggle('hidden', !show);
                const n = document.getElementById('lms-aggregator-model-name');
                const p = document.getElementById('lms-aggregator-provider-label');
                if (n) n.textContent = modelName;
                if (p) p.textContent = provLabel;
            }

            // Update HF panel visibility
            updateHfUiVisibility();
        }

        // ═══════════════════════════════════════════════════════════════
        // HUGGING FACE INTEGRATION
        // ═══════════════════════════════════════════════════════════════
        let hfSettings = {
            enabled: false,
            apiKey: '',
            model: '',
            useFor: 'both'
        };

        function loadHfSettings() {
            try {
                const raw = localStorage.getItem('multillm_huggingface');
                if (raw) hfSettings = { ...hfSettings, ...JSON.parse(raw) };
            } catch(e) { appLog('error', 'Error loading settings HF', e.message); }
        }

        function saveHfSettings() {
            try {
                localStorage.setItem('multillm_huggingface', JSON.stringify(hfSettings));
            } catch(e) { appLog('error', 'Error saving settings HF', e.message); }
        }

        function onHfToggleChange() {
            const enabled = document.getElementById('hfEnabledToggle').checked;
            const section = document.getElementById('hf-config-section');
            if (section) section.style.opacity = enabled ? '1' : '0.5';
        }

        function toggleHfApiKeyVisibility() {
            const input = document.getElementById('hfApiKeyInput');
            const iconClosed = document.getElementById('hf-eye-icon-closed');
            const iconOpen = document.getElementById('hf-eye-icon-open');
            if (!input) return;
            if (input.type === 'password') {
                input.type = 'text';
                iconClosed?.classList.add('hidden');
                iconOpen?.classList.remove('hidden');
            } else {
                input.type = 'password';
                iconClosed?.classList.remove('hidden');
                iconOpen?.classList.add('hidden');
            }
        }

        function setHfModel(model) {
            const input = document.getElementById('hfModelInput');
            if (input) input.value = model;
        }

        function setHfConnectionStatus(status, text) {
            const el = document.getElementById('hf-connection-status');
            const textEl = document.getElementById('hf-status-text');
            if (el) el.className = `lms-status ${status}`;
            if (textEl) textEl.textContent = text;
        }

        async function testHfConnection() {
            const apiKeyInput = document.getElementById('hfApiKeyInput');
            const modelInput = document.getElementById('hfModelInput');
            const apiKey = apiKeyInput?.value?.trim() || '';
            const model = modelInput?.value?.trim() || '';

            if (!apiKey) {
                setHfConnectionStatus('error', 'Enter API key');
                appLog('warn', 'HF check: API key not specified');
                showSystemNotification('Enter API key Hugging Face', 'warning', 3000);
                return;
            }

            if (!model) {
                setHfConnectionStatus('error', 'Specify model');
                appLog('warn', 'HF check: model not specified');
                showSystemNotification('Specify Hugging Face model ID', 'warning', 3000);
                return;
            }

            setHfConnectionStatus('checking', 'Checking…');
            const btn = document.getElementById('hf-test-btn');
            if (btn) btn.disabled = true;

            appLog('info', `HF check → ${model}`);

            try {
                // Test with a minimal request
                const resp = await fetchWithTimeout(
                    `https://router.huggingface.co/hf-inference/models/${model}/v1/chat/completions`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            model: model,
                            messages: [{ role: 'user', content: 'Hi' }],
                            max_tokens: 1
                        })
                    },
                    15000
                );

                if (resp.status === 401) {
                    throw new Error('Invalid API key');
                }
                if (resp.status === 404) {
                    throw new Error('Model not found');
                }

                setHfConnectionStatus('connected', 'Connected ✓');
                appLog('success', `HF connected → ${model}`);
                showSystemNotification(`Hugging Face connected ✓`, 'saved', 2500);
            } catch(e) {
                setHfConnectionStatus('error', 'Error');
                appLog('error', `Error HF: ${model}`, e.message);
                showSystemNotification(`HF: ${e.message.slice(0, 60)}`, 'error', 4000);
            } finally {
                if (btn) btn.disabled = false;
            }
        }

        function populateHfSettingsUI() {
            const enabledToggle = document.getElementById('hfEnabledToggle');
            const apiKeyInput = document.getElementById('hfApiKeyInput');
            const modelInput = document.getElementById('hfModelInput');
            const section = document.getElementById('hf-config-section');

            if (enabledToggle) enabledToggle.checked = hfSettings.enabled;
            if (section) section.style.opacity = hfSettings.enabled ? '1' : '0.5';
            if (apiKeyInput) apiKeyInput.value = hfSettings.apiKey || '';
            if (modelInput) modelInput.value = hfSettings.model || '';

            // Set radio
            const radio = document.querySelector(`input[name="hfUseFor"][value="${hfSettings.useFor || 'both'}"]`);
            if (radio) radio.checked = true;
        }

        function updateHfUiVisibility() {
            const enabled = hfSettings.enabled;
            const useFor = hfSettings.useFor || 'both';
            const model = hfSettings.model || '—';

            // Show/hide HF enhancer panel
            const hfEnhancerPanel = document.getElementById('hf-enhancer-panel');
            if (hfEnhancerPanel) {
                const show = enabled && (useFor === 'prompt' || useFor === 'both');
                hfEnhancerPanel.classList.toggle('hidden', !show);
                const modelNameEl = document.getElementById('hf-enhancer-model-name');
                if (modelNameEl) modelNameEl.textContent = model;
            }

            // Show/hide HF aggregator panel
            const hfAggregatorPanel = document.getElementById('hf-aggregator-panel');
            if (hfAggregatorPanel) {
                const show = enabled && (useFor === 'synthesis' || useFor === 'both');
                hfAggregatorPanel.classList.toggle('hidden', !show);
                const modelNameEl = document.getElementById('hf-aggregator-model-name');
                if (modelNameEl) modelNameEl.textContent = model;
            }
        }

        async function callHfApi(systemPrompt, userPrompt, targetFieldId, statusElId, btnId, badgeId) {
            const apiKey = hfSettings.apiKey || '';
            const model = hfSettings.model || '';

            const btn = document.getElementById(btnId);
            const statusEl = document.getElementById(statusElId);

            if (!model) {
                showSystemNotification('Specify HF model in settings → HF', 'warning', 3200);
                appLog('warn', 'HF send: model not specified');
                return;
            }
            if (!apiKey) {
                showSystemNotification('Enter API key HF', 'warning', 3200);
                appLog('warn', 'HF send: no API key');
                return;
            }

            if (btn) {
                btn.disabled = true; btn.classList.add('loading');
                btn.innerHTML = `<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> Waiting for response…`;
            }
            if (statusEl) {
                statusEl.textContent = `⏳ HF · ${model}…`;
                statusEl.classList.remove('hidden');
                statusEl.style.color = 'var(--text-muted)';
            }
            appLog('info', `Request → HF · ${model}`);

            try {
                const result = await doCloudChatRequest(
                    `https://router.huggingface.co/hf-inference/models/${model}`,
                    'huggingface',
                    apiKey,
                    model,
                    systemPrompt,
                    userPrompt
                );

                if (!result) throw new Error('Empty response from HF');

                const field = document.getElementById(targetFieldId);
                if (field) { field.value = result; field.dispatchEvent(new Event('input')); }
                autoSave();

                const badge = document.getElementById(badgeId);
                if (badge) badge.classList.remove('hidden');

                if (statusEl) { statusEl.textContent = `✓ HF · ${model}`; statusEl.style.color = '#16a34a'; }
                appLog('success', `Response received ← HF · ${model}, chars: ${result.length}`);
                showSystemNotification(`Response from HF ${model} received`, 'saved', 2500);

            } catch(e) {
                appLog('error', `Error HF · ${model}`, e.message);
                if (statusEl) { statusEl.textContent = `✗ ${e.message.slice(0, 120)}`; statusEl.style.color = '#ef4444'; }
                showSystemNotification(`HF: ${e.message.slice(0, 70)}`, 'error', 4500);
            } finally {
                if (btn) {
                    btn.disabled = false; btn.classList.remove('loading');
                    btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Send to AI`;
                }
            }
        }

        async function sendEnhancerToHf() {
            if (!document.getElementById('rawPrompt')?.value?.trim()) {
                showSystemNotification('Enter request on step 1', 'warning', 2500);
                appLog('warn', 'HF improvement send: empty request');
                return;
            }
            await callHfApi(enhancerSystem, generateEnhancerUserPrompt(), 'improvedPrompt', 'lms-enhancer-status', 'lms-send-enhancer-btn', 'lms-enhancer-filled-badge');
        }

        async function sendAggregatorToHf() {
            if (!models.some(m => getTrimmedAnswerValue(m.id))) {
                showSystemNotification('Add model answers on step 3', 'warning', 2500);
                appLog('warn', 'HF synthesis send: no model answers');
                return;
            }
            await callHfApi(aggregatorSystem, generateAggregatorPrompt(), 'finalAnswer', 'lms-aggregator-status', 'lms-send-aggregator-btn', 'lms-aggregator-filled-badge');
        }

        const STORAGE_KEYS = {
            autosave: 'multillm_autosave',
            threads: 'multillm_threads'
        };
        const STORAGE_DB_NAME = 'multillm-storage';
        const STORAGE_DB_VERSION = 1;
        const STORAGE_STORE_NAME = 'keyval';
        let storageDbPromise = null;

        function openStorageDb() {
            if (!window.indexedDB) return Promise.resolve(null);
            if (!storageDbPromise) {
                storageDbPromise = new Promise((resolve) => {
                    const request = indexedDB.open(STORAGE_DB_NAME, STORAGE_DB_VERSION);
                    request.onupgradeneeded = () => {
                        const db = request.result;
                        if (!db.objectStoreNames.contains(STORAGE_STORE_NAME)) {
                            db.createObjectStore(STORAGE_STORE_NAME);
                        }
                    };
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => {
                        console.warn('IndexedDB unavailable:', request.error);
                        resolve(null);
                    };
                });
            }
            return storageDbPromise;
        }

        function runIdbOperation(mode, executor) {
            return openStorageDb().then((db) => {
                if (!db) return null;
                return new Promise((resolve, reject) => {
                    try {
                        const tx = db.transaction(STORAGE_STORE_NAME, mode);
                        const store = tx.objectStore(STORAGE_STORE_NAME);
                        const request = executor(store);
                        request.onsuccess = () => resolve(request.result);
                        request.onerror = () => reject(request.error);
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        }

        async function readStoredText(key) {
            try {
                const value = await runIdbOperation('readonly', (store) => store.get(key));
                if (typeof value === 'string') return value;
            } catch (error) {
                console.warn('Read from IndexedDB failed:', error);
            }

            let fallback = null;
            try {
                fallback = localStorage.getItem(key);
            } catch (error) {
                console.warn('Read from localStorage failed:', error);
            }
            if (fallback !== null) {
                void writeStoredText(key, fallback, { mirrorLocal: false });
            }
            return fallback;
        }

        async function writeStoredText(key, value, options = {}) {
            const { mirrorLocal = true } = options;
            let savedToIndexedDb = false;

            try {
                const result = await runIdbOperation('readwrite', (store) => store.put(value, key));
                savedToIndexedDb = result !== null;
            } catch (error) {
                console.warn('Write to IndexedDB failed:', error);
            }

            if (mirrorLocal || !savedToIndexedDb) {
                try {
                    localStorage.setItem(key, value);
                } catch (error) {
                    console.warn('Write to localStorage failed:', error);
                }
            }

            return savedToIndexedDb;
        }

        async function removeStoredText(key) {
            try {
                await runIdbOperation('readwrite', (store) => store.delete(key));
            } catch (error) {
                console.warn('Delete from IndexedDB failed:', error);
            }
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.warn('Delete from localStorage failed:', error);
            }
        }

        function loadPreferences() {
            try {
                const saved = JSON.parse(localStorage.getItem('multillm_preferences') || '{}');
                preferences = {
                    notificationsEnabled: saved.notificationsEnabled !== false,
                    useRatingsInSynthesis: saved.useRatingsInSynthesis !== false
                };
            } catch (error) {
                preferences = {
                    notificationsEnabled: true,
                    useRatingsInSynthesis: true
                };
            }
        }

        function savePreferences() {
            localStorage.setItem('multillm_preferences', JSON.stringify(preferences));
        }

        function hideNotificationIndicator() {
            clearTimeout(notificationTimer);
            const indicator = document.getElementById('autosaveIndicator');
            if (!indicator) return;
            indicator.classList.remove('saving', 'saved', 'warning', 'error', 'visible');
        }

        function showSystemNotification(message, status = 'saved', duration = 2200) {
            const indicator = document.getElementById('autosaveIndicator');
            const text = document.getElementById('autosaveText');
            if (!indicator || !text) return;

            if (!preferences.notificationsEnabled) {
                hideNotificationIndicator();
                return;
            }

            clearTimeout(notificationTimer);
            indicator.classList.remove('saving', 'saved', 'warning', 'error');
            indicator.classList.add(status, 'visible');
            text.textContent = message;

            if (duration > 0) {
                notificationTimer = setTimeout(() => {
                    indicator.classList.remove('visible');
                }, duration);
            }
        }

        // ═══════════════════════════════════════════════════════════════
        // AUTO-SAVE SYSTEM
        // ═══════════════════════════════════════════════════════════════

        function pruneModelScopedState() {
            const validIds = new Set(models.map((m) => String(m.id)));
            answerDrafts = Object.fromEntries(
                Object.entries(answerDrafts).filter(([modelId]) => validIds.has(String(modelId)))
            );
            modelRatings = Object.fromEntries(
                Object.entries(modelRatings).filter(([modelId]) => validIds.has(String(modelId)))
            );
            continuationUrls = Object.fromEntries(
                Object.entries(continuationUrls).filter(([modelId]) => validIds.has(String(modelId)))
            );
        }

        function getAnswerValue(modelId) {
            const el = document.getElementById(`answer-${modelId}`);
            if (el) {
                answerDrafts[modelId] = el.value;
                return el.value;
            }
            return answerDrafts[modelId] || '';
        }

        function getTrimmedAnswerValue(modelId) {
            return getAnswerValue(modelId).trim();
        }

        function setAnswerValue(modelId, value) {
            const nextValue = value || '';
            answerDrafts[modelId] = nextValue;
            const el = document.getElementById(`answer-${modelId}`);
            if (el && el.value !== nextValue) {
                el.value = nextValue;
            }
            comparisonDirty = true;
        }

        function clearAnswerDrafts() {
            answerDrafts = {};
            comparisonDirty = true;
        }

        function handleAnswerInput(modelId, value) {
            answerDrafts[modelId] = value;
            comparisonDirty = true;
            autoSave();
        }

        function handleChatUrlInput(modelId, value) {
            const safeUrl = getSafeHttpUrl(value);
            if (safeUrl) {
                continuationUrls[modelId] = safeUrl;
            } else {
                delete continuationUrls[modelId];
            }
            modelCardsDirty = true;
            autoSave();
        }

        function ensureModelCardsRendered(force = false) {
            if (!force && !modelCardsDirty) return;
            renderModelCards();
        }

        function getAutoSaveState() {
            const answers = {};
            models.forEach(m => {
                const value = getAnswerValue(m.id);
                if (value) answers[m.id] = value;
            });
            return {
                rawPrompt: document.getElementById('rawPrompt').value,
                improvedPrompt: document.getElementById('improvedPrompt').value,
                finalAnswer: document.getElementById('finalAnswer').value,
                answers,
                ratings: { ...modelRatings },
                currentStep,
                currentThreadId: currentThread ? currentThread.id : null,
                timestamp: new Date().toISOString()
            };
        }

        function autoSave() {
            clearTimeout(autosaveTimer);
            autosaveTimer = setTimeout(async () => {
                try {
                    const state = getAutoSaveState();
                    await writeStoredText(STORAGE_KEYS.autosave, JSON.stringify(state), { mirrorLocal: false });
                    showAutoSaveIndicator('saved');
                } catch(e) {
                    console.error('Auto-save error:', e);
                }
            }, 800);
            showAutoSaveIndicator('saving');
        }

        async function restoreAutoSave() {
            try {
                const saved = await readStoredText(STORAGE_KEYS.autosave);
                if (!saved) return false;
                const state = JSON.parse(saved);
                if (!state.rawPrompt && !state.improvedPrompt && !state.finalAnswer) return false;

                document.getElementById('rawPrompt').value = state.rawPrompt || '';
                document.getElementById('improvedPrompt').value = state.improvedPrompt || '';
                document.getElementById('finalAnswer').value = state.finalAnswer || '';
                clearAnswerDrafts();

                if (state.answers) {
                    Object.entries(state.answers).forEach(([modelId, value]) => {
                        setAnswerValue(modelId, value);
                    });
                }

                modelRatings = normalizeOverallRatings(state.ratings);
                if (Object.keys(modelRatings).length === 0 && state.criteriaRatings) {
                    modelRatings = migrateCriteriaRatingsToOverall(state.criteriaRatings);
                }
                pruneModelScopedState();

                models.forEach((m) => updateRatingDisplay(m.id));
                comparisonDirty = true;
                refreshComparisonView();

                autosaveStepToRestore = state.currentStep || 1;

                // Restoring currentThread from saved ID
                if (state.currentThreadId && allThreads.length > 0) {
                    const foundThread = allThreads.find(t => t.id === state.currentThreadId);
                    if (foundThread) {
                        currentThread = foundThread;
                        isContinuation = foundThread.turns.length > 0;
                    }
                }

                return true;
            } catch(e) {
                console.error('Restore auto-save error:', e);
                return false;
            }
        }

        async function clearAutoSave() {
            await removeStoredText(STORAGE_KEYS.autosave);
        }

        function showAutoSaveIndicator(status) {
            if (status === 'saving') {
                showSystemNotification('Saving...', 'saving', 0);
            } else if (status === 'saved') {
                showSystemNotification('Saved', 'saved', 2000);
            }
        }

        function initAutoSave() {
            const fields = ['rawPrompt', 'improvedPrompt', 'finalAnswer'];
            fields.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('input', autoSave);
            });
        }

        // ═══════════════════════════════════════════════════════════════
        // STAR RATING SYSTEM
        // ═══════════════════════════════════════════════════════════════

        function normalizeOverallRatings(rawRatings) {
            const normalized = {};
            if (!rawRatings || typeof rawRatings !== 'object') return normalized;
            Object.entries(rawRatings).forEach(([modelId, value]) => {
                const rating = Number(value);
                if (Number.isFinite(rating) && rating > 0) {
                    normalized[modelId] = Math.min(5, Math.max(1, Math.round(rating)));
                }
            });
            return normalized;
        }

        function migrateCriteriaRatingsToOverall(rawRatings) {
            const normalized = {};
            if (!rawRatings || typeof rawRatings !== 'object') return normalized;
            Object.entries(rawRatings).forEach(([modelId, criteria]) => {
                if (!criteria || typeof criteria !== 'object') return;
                const values = Object.values(criteria)
                    .map((value) => Number(value))
                    .filter((value) => Number.isFinite(value) && value >= 1 && value <= 5);
                if (values.length > 0) {
                    normalized[modelId] = Math.min(5, Math.max(1, Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)));
                }
            });
            return normalized;
        }

        function renderStarRating(modelId) {
            const rating = modelRatings[modelId] || 0;
            let html = '<div class="star-rating" data-model-id="' + modelId + '">';
            for (let i = 1; i <= 5; i++) {
                const filled = i <= rating ? 'filled' : '';
                html += `<button class="star-btn ${filled}" data-action="setRating" data-model-id="${modelId}" data-star="${i}" data-action-enter="hoverStar" data-action-leave="unhoverStar">★</button>`;
            }
            if (rating > 0) {
                const labels = ['', 'Poor', 'So-so', 'OK', 'Good', 'Excellent'];
                html += `<span class="rating-label">${labels[rating]}</span>`;
            }
            html += '</div>';
            return html;
        }

        function setRating(modelId, rating) {
            if (modelRatings[modelId] === rating) {
                delete modelRatings[modelId];
            } else {
                modelRatings[modelId] = rating;
            }
            comparisonDirty = true;
            updateRatingDisplay(modelId);
            refreshComparisonView();
            autoSave();
        }

        function hoverStar(event, starIndex) {
            const container = event && event.target ? event.target.closest('.star-rating') : null;
            if (!container) return;
            const stars = container.querySelectorAll('.star-btn');
            stars.forEach((star, i) => {
                if (i < starIndex) {
                    star.classList.add('hovered');
                } else {
                    star.classList.remove('hovered');
                }
            });
        }

        function unhoverStar(event) {
            const container = event && event.target ? event.target.closest('.star-rating') : null;
            if (!container) return;
            container.querySelectorAll('.star-btn').forEach(star => {
                star.classList.remove('hovered');
            });
        }

        function updateRatingDisplay(modelId) {
            const rating = modelRatings[modelId] || 0;
            const labels = ['', 'Poor', 'So-so', 'OK', 'Good', 'Excellent'];
            const containers = document.querySelectorAll(`.star-rating[data-model-id="${modelId}"]`);
            if (!containers.length) return;

            containers.forEach((container) => {
                const stars = container.querySelectorAll('.star-btn');
                stars.forEach((star, i) => {
                    star.classList.toggle('filled', i < rating);
                });
                const label = container.querySelector('.rating-label');
                if (rating > 0) {
                    if (label) {
                        label.textContent = labels[rating];
                    } else {
                        const span = document.createElement('span');
                        span.className = 'rating-label';
                        span.textContent = labels[rating];
                        container.appendChild(span);
                    }
                } else if (label) {
                    label.remove();
                }
            });
        }

        function refreshComparisonView() {
            const avgEl = document.getElementById('avgRatingDisplay');
            if (avgEl) {
                avgEl.textContent = getAverageRating();
            }

            if (currentStep !== 5 || currentResultTab !== 'comparison') return;
            if (!comparisonDirty) return;

            renderComparison();
            if (avgEl) {
                avgEl.textContent = getAverageRating();
            }
        }

        function getAverageRating() {
            const ratings = Object.values(modelRatings);
            if (ratings.length === 0) return 0;
            return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
        }

        // ═══════════════════════════════════════════════════════════════
        // SIDE-BY-SIDE COMPARISON
        // ═══════════════════════════════════════════════════════════════

        function renderComparison() {
            const container = document.getElementById('comparisonGrid');
            if (!container) return;

            const answersWithContent = models
                .map((m) => ({
                    ...m,
                    answer: getTrimmedAnswerValue(m.id)
                }))
                .filter((m) => m.answer);

            if (answersWithContent.length === 0) {
                container.innerHTML = '<div class="comparison-empty"><svg class="w-10 h-10 mx-auto mb-3 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><p>No answers to compare</p><p class="text-xs mt-1">Add model answers on step 3</p></div>';
                comparisonDirty = false;
                return;
            }

            container.innerHTML = answersWithContent.map(m => {
                const answer = m.answer;
                const rating = modelRatings[m.id] || 0;
                const ratingStars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

                return `
                <div class="comparison-card">
                    <div class="comparison-card-header">
                        <div class="flex items-center gap-2">
                            <span class="badge badge-dark">${escapeHtml(m.name)}</span>
                            <span class="badge badge-light">${escapeHtml(m.provider)}</span>
                        </div>
                        <div style="color: #facc15; font-size: 0.85rem;" title="Rating: ${rating}/5">${ratingStars}</div>
                    </div>
                    <div class="comparison-card-body">
                        <div class="md-content">${parseMarkdown(answer)}</div>
                    </div>
                    <div class="comparison-card-footer">
                        ${renderStarRating(m.id)}
                        <button class="btn btn-copy btn-sm btn-icon" data-icon-size="w-3.5 h-3.5" title="Copy model answer" aria-label="Copy model answer" data-action="copyModelAnswer" data-model-id="${m.id}" data-copy-id="comp-copy-${m.id}" id="comp-copy-${m.id}">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        </button>
                    </div>
                </div>`;
            }).join('');

            // Render code blocks in comparison cards
            container.querySelectorAll('.comparison-card-body').forEach(el => renderCodeBlocks(el));
            comparisonDirty = false;
        }

        // Initialize
        // Auto-resize textareas to content height
        function initAutoResize() {
            document.querySelectorAll('.textarea').forEach(el => {
                const resize = () => {
                    el.style.height = 'auto';
                    el.style.height = Math.min(el.scrollHeight, window.innerHeight * 0.7) + 'px';
                };
                el.addEventListener('input', resize);
                if (el.value) resize();
            });
        }

        document.addEventListener('DOMContentLoaded', async () => {
            loadLogs();
            loadLmsSettings();
            loadSettings();
            loadPreferences();
            initAutoSave();
            initAutoResize();
            initTheme();
            await loadThreads();
            
            // Restore auto-saved data
            if (await restoreAutoSave()) {
                if (autosaveStepToRestore >= 3) {
                    ensureModelCardsRendered();
                }
                setStep(autosaveStepToRestore);
            } else {
                setStep(1);
            }

            updateLmsUiVisibility();
            updateLogBadge();
            appLog('info', 'Application started');
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+N - New chat
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                resetAll();
            }
            // Ctrl+S - Save to history (when on step 5)
            if (e.ctrlKey && e.key === 's' && currentStep === 5) {
                e.preventDefault();
                void saveToHistory();
            }
            // Ctrl+E - Export history
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                exportHistory();
            }
            // Ctrl+I - Import history
            if (e.ctrlKey && e.key === 'i') {
                e.preventDefault();
                importHistory();
            }
            // Ctrl+H - Toggle history
            if (e.ctrlKey && e.key === 'h') {
                e.preventDefault();
                if (document.getElementById('historyPanel').classList.contains('open')) {
                    closeHistory();
                } else {
                    openHistory();
                }
            }
            // Arrow keys for step navigation (when no input is focused)
            if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                if (e.key === 'ArrowRight' && currentStep < 5) {
                    e.preventDefault();
                    setStep(currentStep + 1);
                }
                if (e.key === 'ArrowLeft' && currentStep > 1) {
                    e.preventDefault();
                    setStep(currentStep - 1);
                }
            }
        });

        // Theme
        function initTheme() {
            const saved = localStorage.getItem('multillm_theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = saved || (prefersDark ? 'dark' : 'light');
            document.documentElement.setAttribute('data-theme', theme);
            updateThemeIcon(theme);
        }
        function toggleTheme() {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('multillm_theme', next);
            updateThemeIcon(next);
        }
        function updateThemeIcon(theme) {
            const light = document.getElementById('themeIconLight');
            const dark = document.getElementById('themeIconDark');
            if (theme === 'dark') { light.classList.add('hidden'); dark.classList.remove('hidden'); }
            else { light.classList.remove('hidden'); dark.classList.add('hidden'); }
        }

        function getTaskProfileById(profileId) {
            return TASK_PROFILES.find((profile) => profile.id === profileId) || TASK_PROFILES[0];
        }

        function buildTaskProfilePrompt(basePrompt, profileId, promptKind) {
            const profile = getTaskProfileById(profileId);
            if (!profile || profile.isCustom) return basePrompt;

            const note = promptKind === 'enhancer' ? profile.enhancerNote : profile.aggregatorNote;
            if (!note) return basePrompt;

            return `${basePrompt}\n\nTASK PROFILE: ${profile.name.toUpperCase()}\n${note}`;
        }

        function buildTaskProfilePrompts(profileId) {
            const effectiveProfileId = getTaskProfileById(profileId).isCustom ? 'balanced' : profileId;
            return {
                enhancer: buildTaskProfilePrompt(DEFAULT_ENHANCER_SYSTEM, effectiveProfileId, 'enhancer'),
                aggregator: buildTaskProfilePrompt(DEFAULT_AGGREGATOR_SYSTEM, effectiveProfileId, 'aggregator')
            };
        }

        function inferTaskProfileId(enhancerPrompt, aggregatorPrompt) {
            for (const profile of TASK_PROFILES) {
                if (profile.isCustom) continue;
                const prompts = buildTaskProfilePrompts(profile.id);
                if (prompts.enhancer === enhancerPrompt && prompts.aggregator === aggregatorPrompt) {
                    return profile.id;
                }
            }
            return 'custom';
        }

        function renderTaskProfileOptions() {
            const select = document.getElementById('taskProfileSelect');
            if (!select) return;

            select.innerHTML = TASK_PROFILES.map((profile) => (
                `<option value="${escapeHtml(profile.id)}">${escapeHtml(profile.name)}</option>`
            )).join('');
        }

        function updateTaskProfileUi(profileId = currentTaskProfile) {
            const profile = getTaskProfileById(profileId);
            const select = document.getElementById('taskProfileSelect');
            const nameEl = document.getElementById('taskProfileName');
            const descriptionEl = document.getElementById('taskProfileDescription');

            if (select) select.value = profile.id;
            if (nameEl) nameEl.textContent = profile.name;
            if (descriptionEl) descriptionEl.textContent = profile.description;
        }

        function handleTaskProfileChange(profileId) {
            currentTaskProfile = profileId || 'balanced';
            updateTaskProfileUi(currentTaskProfile);

            const profile = getTaskProfileById(currentTaskProfile);
            if (profile.isCustom) return;

            const prompts = buildTaskProfilePrompts(profile.id);
            const enhancerField = document.getElementById('settingsEnhancerPrompt');
            const aggregatorField = document.getElementById('settingsAggregatorPrompt');
            if (enhancerField) enhancerField.value = prompts.enhancer;
            if (aggregatorField) aggregatorField.value = prompts.aggregator;
        }

        function syncTaskProfileFromPromptEditors() {
            const enhancerField = document.getElementById('settingsEnhancerPrompt');
            const aggregatorField = document.getElementById('settingsAggregatorPrompt');
            if (!enhancerField || !aggregatorField) return;

            currentTaskProfile = inferTaskProfileId(enhancerField.value, aggregatorField.value);
            updateTaskProfileUi(currentTaskProfile);
        }

        // Settings functions
        let templates = [];

        function loadSettings() {
            const savedModels = localStorage.getItem('multillm_models');
            const savedEnhancer = localStorage.getItem('multillm_enhancer');
            const savedAggregator = localStorage.getItem('multillm_aggregator');
            const savedTemplates = localStorage.getItem('multillm_templates');
            let parsedTemplates = null;

            if (savedTemplates) {
                try {
                    parsedTemplates = JSON.parse(savedTemplates);
                } catch (error) {
                    parsedTemplates = null;
                }
            }

            models = savedModels ? JSON.parse(savedModels) : [...DEFAULT_MODELS];
            const defaultProfilePrompts = buildTaskProfilePrompts('balanced');
            enhancerSystem = savedEnhancer || defaultProfilePrompts.enhancer;
            aggregatorSystem = savedAggregator || defaultProfilePrompts.aggregator;
            currentTaskProfile = inferTaskProfileId(enhancerSystem, aggregatorSystem);
            const templateMap = new Map(DEFAULT_TEMPLATES.map((template) => [template.name, { ...template }]));
            if (Array.isArray(parsedTemplates)) {
                parsedTemplates.forEach((template) => {
                    if (!template || typeof template.name !== 'string' || typeof template.content !== 'string') return;
                    const name = template.name.trim();
                    const content = template.content.trim();
                    if (!name || !content) return;
                    templateMap.set(name, { name, content });
                });
            }
            templates = Array.from(templateMap.values());
            pruneModelScopedState();
            modelCardsDirty = true;
            comparisonDirty = true;

            updateModelsCount();
            updatePromptDisplays();
            updateLmsUiVisibility();
        }

        function saveSettings() {
            // Save prompts from textarea
            enhancerSystem = document.getElementById('settingsEnhancerPrompt').value;
            aggregatorSystem = document.getElementById('settingsAggregatorPrompt').value;
            currentTaskProfile = inferTaskProfileId(enhancerSystem, aggregatorSystem);
            preferences.notificationsEnabled = document.getElementById('notificationsEnabledToggle').checked;
            preferences.useRatingsInSynthesis = document.getElementById('useRatingsInSynthesisToggle').checked;

            // Save provider settings
            const lmsEnabledEl  = document.getElementById('lmsEnabledToggle');
            const lmsUrlEl      = document.getElementById('lmsUrlInput');
            const lmsModelEl    = document.getElementById('lmsModelSelect');
            const lmsManualEl   = document.getElementById('lmsModelManualInput');
            const lmsUseForEl   = document.querySelector('input[name="lmsUseFor"]:checked');
            const lmsProviderEl = document.getElementById('lmsProviderInput');
            const lmsApiKeyEl   = document.getElementById('lmsApiKeyInput');
            if (lmsEnabledEl)  lmStudioSettings.enabled  = lmsEnabledEl.checked;
            if (lmsProviderEl) lmStudioSettings.provider = lmsProviderEl.value || 'lmstudio';
            // Read model from either dropdown or manual input based on provider type
            const currentInfo = getProviderInfo(lmStudioSettings.provider);
            if (currentInfo.manualModel && lmsManualEl) {
                lmStudioSettings.model = lmsManualEl.value || '';
            } else if (lmsModelEl && lmsModelEl.value) {
                lmStudioSettings.model = lmsModelEl.value;
            }
            if (lmsUseForEl)   lmStudioSettings.useFor   = lmsUseForEl.value;
            if (lmsApiKeyEl !== null) lmStudioSettings.apiKey = lmsApiKeyEl?.value?.trim() || '';
            // Only save URL for non-cloud providers
            const provInfo = getProviderInfo(lmStudioSettings.provider);
            if (!provInfo.isCloud && lmsUrlEl) lmStudioSettings.url = lmsUrlEl.value.trim().replace(/\/+$/, '') || provInfo.defaultUrl;
            saveLmsSettings();

            localStorage.setItem('multillm_models', JSON.stringify(models));
            localStorage.setItem('multillm_enhancer', enhancerSystem);
            localStorage.setItem('multillm_aggregator', aggregatorSystem);
            localStorage.setItem('multillm_templates', JSON.stringify(templates));
            savePreferences();

            if (!preferences.notificationsEnabled) {
                hideNotificationIndicator();
            }

            pruneModelScopedState();
            modelCardsDirty = true;
            comparisonDirty = true;
            if (currentStep === 3) {
                ensureModelCardsRendered(true);
            }
            updatePromptDisplays();
            updateLmsUiVisibility();
            appLog('success', 'Settings saved');
            closeSettings();
        }

        function openSettings() {
            document.getElementById('settingsModal').classList.remove('hidden');
            renderTaskProfileOptions();
            renderModelsList();
            renderTemplatesList();
            document.getElementById('settingsEnhancerPrompt').value = enhancerSystem;
            document.getElementById('settingsAggregatorPrompt').value = aggregatorSystem;
            document.getElementById('notificationsEnabledToggle').checked = preferences.notificationsEnabled;
            document.getElementById('useRatingsInSynthesisToggle').checked = preferences.useRatingsInSynthesis;
            currentTaskProfile = inferTaskProfileId(enhancerSystem, aggregatorSystem);
            updateTaskProfileUi(currentTaskProfile);
            // Populate LM Studio tab
            populateLmsSettingsUI();
            // Populate Logs tab
            const loggingToggle = document.getElementById('loggingEnabledToggle');
            if (loggingToggle) loggingToggle.checked = loggingEnabled;
            renderLogs();
            updateLogStats();
            updateLogBadge();
            setSettingsTab('general');
        }

        function closeSettings() {
            document.getElementById('settingsModal').classList.add('hidden');
        }

        function setSettingsTab(tab) {
            settingsTab = tab;
            document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
            const activeTab = document.querySelector(`.settings-tab[data-tab="${tab}"]`);
            if (activeTab) activeTab.classList.add('active');
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            const pane = document.getElementById(`settings-${tab}`);
            if (pane) pane.classList.add('active');
            // Refresh templates list when templates tab is selected
            if (tab === 'templates') renderTemplatesList();
            if (tab === 'lmstudio') populateLmsSettingsUI();
            if (tab === 'logs') { renderLogs(); updateLogStats(); }
        }

        function renderModelsList() {
            const container = document.getElementById('modelsList');
            const countEl = document.getElementById('modelsListCount');
            
            if (models.length === 0) {
                container.innerHTML = '<p class="text-zinc-500 text-sm text-center py-4">No models. Add your first model below.</p>';
                countEl.textContent = 'Models: 0';
                return;
            }

            countEl.innerHTML = `Models: ${models.length} (selected: <span id="selectedCount">0</span>)`;

            container.innerHTML = `<div id="selectAllRow" class="model-row mb-2 border-b border-zinc-200">
                <input type="checkbox" class="model-checkbox mr-3" data-action="toggleAllModels">
                <span class="text-base text-zinc-500">Select all</span>
            </div>` + models.map((m, i) => `
                <div class="model-row">
                    <input type="checkbox" class="model-checkbox mr-3" data-index="${i}" data-action="updateSelectedCount">
                    <div class="model-info">
                        <div class="font-medium text-sm">${escapeHtml(m.name)}</div>
                        <div class="text-xs text-zinc-500">${escapeHtml(m.provider)}</div>
                        ${getSafeHttpUrl(m.chatUrl) ? `<div class="text-xs text-blue-500 mt-0.5 truncate"><a href="${escapeHtml(getSafeHttpUrl(m.chatUrl))}" target="_blank" rel="noopener noreferrer" class="hover:underline">🔗 ${escapeHtml(getSafeHttpUrl(m.chatUrl))}</a></div>` : ''}
                        ${m.systemPrompt ? '<div class="text-xs text-blue-600 mt-1">✓ Custom prompt</div>' : ''}
                    </div>
                    <button data-action="editModel" data-index="${i}" class="btn btn-outline btn-sm" title="Edit">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button data-action="deleteModel" data-index="${i}" class="btn btn-danger btn-sm" title="Delete">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            `).join('');
        }

        function updateSelectedCount() {
            const checkboxes = document.querySelectorAll('.model-checkbox');
            const allCheckbox = checkboxes[0];
            const modelCheckboxes = Array.from(checkboxes).slice(1);
            const checked = modelCheckboxes.filter(cb => cb.checked).length;
            const selectedEl = document.getElementById('selectedCount');
            const deleteBtn = document.getElementById('deleteSelectedBtn');
            const selectAllRow = document.getElementById('selectAllRow');
            
            allCheckbox.checked = checked === modelCheckboxes.length && checked > 0;
            
            if (selectAllRow) {
                if (checked === modelCheckboxes.length && checked > 0) {
                    selectAllRow.classList.add('selected');
                } else {
                    selectAllRow.classList.remove('selected');
                }
            }
            
            if (selectedEl) selectedEl.textContent = checked;
            if (deleteBtn) deleteBtn.disabled = checked === 0;
        }

        function toggleAllModels(checkbox) {
            const checkboxes = document.querySelectorAll('.model-checkbox');
            checkboxes.forEach(cb => cb.checked = checkbox.checked);
            updateSelectedCount();
        }

        function restoreDefaultModels() {
            if (confirm('Restore all default models? Current models will be replaced..')) {
                models = [...DEFAULT_MODELS];
                localStorage.setItem('multillm_models', JSON.stringify(models));
                renderModelsList();
                updateModelsCount();
                invalidateModelViews();
                updatePromptDisplays();
            }
        }

        function deleteSelectedModels() {
            const checkboxes = document.querySelectorAll('.model-checkbox:checked');
            const indices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index)).sort((a, b) => b - a);
            
            if (indices.length === 0) return;
            
            if (confirm(`Delete selected models (${indices.length})?`)) {
                indices.forEach(i => models.splice(i, 1));
                localStorage.setItem('multillm_models', JSON.stringify(models));
                renderModelsList();
                updateModelsCount();
                invalidateModelViews();
            }
        }

        function deleteAllModels() {
            if (confirm('Delete ALL models? This action cannot be undone.')) {
                models = [];
                localStorage.setItem('multillm_models', JSON.stringify(models));
                renderModelsList();
                updateModelsCount();
                invalidateModelViews();
            }
        }

        function addModel() {
            const name = document.getElementById('newModelName').value.trim();
            const provider = document.getElementById('newModelProvider').value.trim();
            const systemPrompt = document.getElementById('newModelSystemPrompt').value.trim();
            const chatUrl = document.getElementById('newModelChatUrl').value.trim();

            if (!name) {
                alert('Enter model name');
                return;
            }
            if (!provider) {
                alert('Enter provider');
                return;
            }

            const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
            models.push({ id, name, provider, systemPrompt, chatUrl });

            document.getElementById('newModelName').value = '';
            document.getElementById('newModelProvider').value = '';
            document.getElementById('newModelSystemPrompt').value = '';
            document.getElementById('newModelChatUrl').value = '';

            renderModelsList();
            updateModelsCount();
            invalidateModelViews();
        }

        function editModel(index) {
            const model = models[index];
            const newName = prompt('Name:', model.name);
            if (newName === null) return;
            const newProvider = prompt('Provider:', model.provider);
            if (newProvider === null) return;
            const newSystemPrompt = prompt('System prompt (empty = use default):', model.systemPrompt || '');
            if (newSystemPrompt === null) return;
            const newChatUrl = prompt('Chat URL:', model.chatUrl || '');
            
            models[index].name = newName.trim() || model.name;
            models[index].provider = newProvider.trim() || model.provider;
            models[index].systemPrompt = newSystemPrompt !== null ? newSystemPrompt.trim() : model.systemPrompt;
            models[index].chatUrl = newChatUrl !== null ? newChatUrl.trim() : model.chatUrl;

            renderModelsList();
            invalidateModelViews();
        }

        function deleteModel(index) {
            if (confirm(`Delete model "${models[index].name}"?`)) {
                models.splice(index, 1);
                renderModelsList();
                updateModelsCount();
                invalidateModelViews();
            }
        }

        function resetEnhancerPrompt() {
            document.getElementById('settingsEnhancerPrompt').value = buildTaskProfilePrompts(currentTaskProfile).enhancer;
            syncTaskProfileFromPromptEditors();
        }

        function resetAggregatorPrompt() {
            document.getElementById('settingsAggregatorPrompt').value = buildTaskProfilePrompts(currentTaskProfile).aggregator;
            syncTaskProfileFromPromptEditors();
        }

        // ─── TEMPLATE MANAGEMENT ─────────────────────────────────────────────

        function renderTemplatesList() {
            const container = document.getElementById('templatesList');
            if (templates.length === 0) {
                container.innerHTML = '<p class="text-xs text-zinc-500 text-center py-4">No saved templates</p>';
                return;
            }
            container.innerHTML = templates.map((t, i) => `
                <div class="flex items-center justify-between p-3 mb-2 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors">
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium">${escapeHtml(t.name)}</div>
                        <div class="text-xs text-zinc-500 truncate mt-1">${escapeHtml(t.content.slice(0, 80))}${t.content.length > 80 ? '...' : ''}</div>
                    </div>
                    <div class="flex gap-2 ml-3">
                        <button data-action="applyTemplate" data-index="${i}" class="btn btn-outline btn-sm" title="Use">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        </button>
                        <button data-action="deleteTemplate" data-index="${i}" class="btn btn-outline btn-sm text-red-500" title="Delete">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function addTemplate() {
            const name = prompt('Template name:');
            if (!name || !name.trim()) return;
            const content = prompt('Template content:');
            if (!content || !content.trim()) return;
            
            templates.push({ name: name.trim(), content: content.trim() });
            localStorage.setItem('multillm_templates', JSON.stringify(templates));
            renderTemplatesList();
        }

        function deleteTemplate(index) {
            if (confirm(`Delete template "${templates[index].name}"?`)) {
                templates.splice(index, 1);
                localStorage.setItem('multillm_templates', JSON.stringify(templates));
                renderTemplatesList();
            }
        }

        function applyTemplate(index) {
            const template = templates[index];
            document.getElementById('rawPrompt').value = template.content;
            closeSettings();
            setStep(1);
        }

        function updateModelsCount() {
            document.getElementById('modelsCount').textContent = `Models: ${models.length}`;
        }

        function invalidateModelViews() {
            pruneModelScopedState();
            modelCardsDirty = true;
            comparisonDirty = true;
            if (currentStep === 3) {
                ensureModelCardsRendered(true);
            }
        }

        function renderModelCards() {
            const container = document.getElementById('modelCardsContainer');
            if (!container) return;
            pruneModelScopedState();

            container.innerHTML = models.map(m => {
                const contUrl = getSafeHttpUrl(continuationUrls[m.id]);
                const effectiveUrl = contUrl || getSafeHttpUrl(m.chatUrl);
                const hasUrl = !!effectiveUrl;
                const hasSystemPrompt = m.systemPrompt && m.systemPrompt.trim();
                const isCont = !!contUrl;
                const answerValue = answerDrafts[m.id] ?? '';

                return `
                <div class="answer-section">
                    <div class="answer-section-header" data-action="toggleAnswerSection" data-section="model-${m.id}">
                        <div class="answer-section-header-left">
                            <span class="badge badge-dark">${escapeHtml(m.name)}</span>
                            <span class="badge badge-light">${escapeHtml(m.provider)}</span>
                            ${hasSystemPrompt ? '<span class="badge" style="background:#e0f2fe;color:#0369a1;font-size:0.75rem;">⚙ Custom prompt</span>' : ''}
                            ${isCont ? '<span class="continuation-badge">🔗 Chat continuation</span>' : ''}
                        </div>
                        <svg id="section-toggle-model-${m.id}" class="answer-section-toggle" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                    <div id="section-content-model-${m.id}" class="answer-section-content">
                        <div class="flex flex-wrap gap-2 mb-3">
                            <button id="copy-open-${m.id}" class="btn btn-primary btn-sm" data-action="copyAndOpen" data-model-id="${m.id}" title="Copy prompt${hasSystemPrompt ? ' with system prompt' : ''} ${hasUrl ? 'and open ' + escapeHtml(m.name) : ''}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                ${hasUrl ? `Copy and open ${escapeHtml(m.name)}` : 'Copy prompt'}
                                ${hasUrl ? '<svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>' : ''}
                            </button>
                        </div>
                        <div class="mb-3">
                            <label class="text-xs text-zinc-500 mb-1 block">Chat URL:</label>
                            <input type="url" class="model-chat-url-input" id="chat-url-${m.id}"
                                placeholder="${escapeHtml(getSafeHttpUrl(m.chatUrl) || 'https://...')}"
                                value="${escapeHtml(contUrl || '')}"
                                data-action="handleChatUrlInput" data-model-id="${m.id}" />
                        </div>
                        <div class="mb-3">
                            ${renderStarRating(m.id)}
                        </div>
                        <p class="text-zinc-500 text-sm mb-2">Paste the answer from ${escapeHtml(m.name)}:</p>
                        <textarea id="answer-${m.id}" class="textarea" placeholder="Paste the answer from ${escapeHtml(m.name)}..." data-action="handleAnswerInput" data-model-id="${m.id}">${escapeHtml(answerValue)}</textarea>
                    </div>
                </div>
            `}).join('');
            modelCardsDirty = false;
        }

        function copyModelSystemPrompt(modelId, event) {
            event.stopPropagation();
            const m = models.find(x => String(x.id) === String(modelId));
            if (!m || !m.systemPrompt) return;
            copyToClipboard(m.systemPrompt).then((success) => {
                if (!success) {
                    showSystemNotification('Failed to copy system prompt', 'warning', 2600);
                    return;
                }
                const btn = document.getElementById('copy-sys-' + modelId);
                if (btn) {
                    btn.classList.add('copied');
                    setCopyButtonIconState(btn, true);
                    setTimeout(() => {
                        btn.classList.remove('copied');
                        setCopyButtonIconState(btn, false);
                    }, 2000);
                }
            });
        }

        function copyAndOpen(modelId, event) {
            event.stopPropagation();
            const m = models.find(x => String(x.id) === String(modelId));
            if (!m) return;

            const improved = document.getElementById('improvedPrompt').value.trim();
            let textToCopy = improved || '(prompt not yet set)';
            
            // If model has a system prompt, prepend it
            if (m.systemPrompt && m.systemPrompt.trim()) {
                textToCopy = m.systemPrompt.trim() + '\n\n---\n\n' + textToCopy;
            }
            
            // Use continuation URL if set, otherwise default chatUrl
            const urlToOpen = getSafeHttpUrl(continuationUrls[m.id]) || getSafeHttpUrl(m.chatUrl);

            const copyPromise = copyToClipboard(textToCopy);

            if (urlToOpen) {
                const popup = window.open(urlToOpen, '_blank', 'noopener,noreferrer');
                if (popup) {
                    popup.opener = null;
                } else {
                    showSystemNotification('Browser blocked new tab', 'warning', 2600);
                }
            }

            copyPromise.then((success) => {
                const btn = document.getElementById('copy-open-' + modelId);
                const hasUrl = !!urlToOpen;
                if (btn) {
                    if (!success) {
                        showSystemNotification('Failed to copy prompt', 'warning', 2600);
                        return;
                    }
                    btn.classList.remove('btn-primary');
                    btn.classList.add('btn-copy', 'copied');
                    btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copied!';
                    setTimeout(() => {
                        btn.classList.remove('btn-copy', 'copied');
                        btn.classList.add('btn-primary');
                        const label = hasUrl ? `Copy and open ${escapeHtml(m.name)}` : 'Copy prompt';
                        btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg> ${label}${hasUrl ? '<svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>' : ''}`;
                    }, 2000);
                }
            });
        }

        function updatePromptDisplays() {
            document.getElementById('enhancerSystemDisplay').textContent = enhancerSystem;
            document.getElementById('aggregatorSystemDisplay').textContent = aggregatorSystem;
        }

        // Step functions
        function setStep(step) {
            // Validate
            if (step === 2 && !document.getElementById('rawPrompt').value.trim()) {
                alert('Enter request');
                return;
            }
            if (step === 3 && !document.getElementById('improvedPrompt').value.trim()) {
                alert('Paste the improved prompt');
                return;
            }
            if (step === 4) {
                const hasAnswers = models.some((m) => getTrimmedAnswerValue(m.id));
                if (!hasAnswers) {
                    alert('Add at least one model answer');
                    return;
                }
            }
            if (step === 5 && !document.getElementById('finalAnswer').value.trim()) {
                alert('Paste the synthesized answer');
                return;
            }

            currentStep = step;

            if (step === 3) {
                ensureModelCardsRendered();
            }

            // Refresh in-page chat history when on step 1
            if (step === 1) renderInPageChatHistory();

            // Update step buttons
            document.querySelectorAll('.step-btn').forEach((btn, i) => {
                btn.classList.remove('active', 'completed');
                if (i + 1 === step) {
                    btn.classList.add('active');
                } else if (i + 1 < step) {
                    btn.classList.add('completed');
                }
            });

            // Update step content
            document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
            document.getElementById('step-' + step).classList.add('active');

            // Update dynamic content
            if (step === 2) {
                document.getElementById('enhancerUserPrompt').innerHTML = '<div class="code-block scrollable">Here is the user original request:\n«' + escapeHtml(document.getElementById('rawPrompt').value) + '»</div>';
            }
            if (step === 3) {
                renderMarkdownInto(document.getElementById('improvedPromptDisplay'), document.getElementById('improvedPrompt').value);
            }
            if (step === 4) {
                document.getElementById('aggregatorPromptDisplay').innerHTML = '<div class="md-content" style="max-height: 300px; overflow-y: auto;">' + escapeHtml(generateAggregatorPrompt()) + '</div>';
            }
            if (step === 5) {
                updateResults();
            }

            // Update LM Studio panel visibility
            updateLmsUiVisibility();
        }

        function setResultTab(tab, evt) {
            currentResultTab = tab;
            
            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('border-zinc-900', 'text-zinc-900');
                btn.classList.add('border-transparent', 'text-zinc-500');
            });
            if (evt && evt.target) {
                evt.target.classList.remove('border-transparent', 'text-zinc-500');
                evt.target.classList.add('border-zinc-900', 'text-zinc-900');
            }

            // Update tab content
            document.querySelectorAll('.result-tab').forEach(el => el.classList.add('hidden'));
            document.getElementById('result-' + tab).classList.remove('hidden');

            if (tab === 'comparison') {
                refreshComparisonView();
            }
        }

        function generateEnhancerUserPrompt() {
            return 'Here is the user original request:\n«' + document.getElementById('rawPrompt').value + '»';
        }

        function generateAggregatorPromptLegacy() {
            const improvedPrompt = document.getElementById('improvedPrompt').value;
            const useRatings = preferences.useRatingsInSynthesis;

            let answersText = '';
            let index = 1;
            models.forEach(m => {
                const answer = getTrimmedAnswerValue(m.id);
                if (answer) {
                    let ratingText = '';
                    if (useRatings) {
                        const rating = modelRatings[m.id];
                        ratingText = rating
                            ? `User rating: ${rating}/5. This is a soft preference signal, not a guarantee of factual accuracy.\n`
                            : 'User rating: not specified. This is a neutral case; do not treat absence of a rating as a minus.\n';
                    }

                    answersText += `Answer ${index} (${m.name}, ${m.provider}):\n${ratingText}«${answer}»\n\n`;
                    index++;
                }
            });

            const ratingsGuidance = useRatings
                ? `Interpretation of user ratings:
- If an answer has a rating, treat it as an additional signal of usefulness and user preference.
- Do not substitute user rating for factual accuracy, logical consistency, and completeness.
- If no rating is present, treat it as absence of signal, not as a negative rating.

`
                : '';

            return `Original question (improved prompt):
«${improvedPrompt}»

${ratingsGuidance}Answers from different models:

${answersText}`;
        }

        // Blind synthesis: keep model/provider names out of the aggregator prompt.
        function generateAggregatorPrompt() {
            const improvedPrompt = document.getElementById('improvedPrompt').value;
            const useRatings = preferences.useRatingsInSynthesis;

            let answersText = '';
            let index = 1;
            models.forEach((m) => {
                const answer = getTrimmedAnswerValue(m.id);
                if (!answer) return;

                let ratingText = '';
                if (useRatings) {
                    const rating = modelRatings[m.id];
                    ratingText = rating
                        ? `User rating of this option: ${rating}/5. This is a soft preference signal, not a guarantee of factual accuracy.\n`
                        : 'User rating of this option: not specified. This is a neutral case; do not treat absence of a rating as a minus.\n';
                }

                answersText += `Option ${index}:\n${ratingText}«${answer}»\n\n`;
                index++;
            });

            const ratingsGuidance = useRatings
                ? `Interpretation of user ratings:
- If an option has a rating, treat it as an additional signal of usefulness and user preference.
- Do not substitute user rating for factual accuracy, logical consistency, and completeness.
- If no rating is present, treat it as absence of signal, not as a negative rating.

`
                : '';

            return `Original question (improved prompt):
«${improvedPrompt}»

${ratingsGuidance}Below are several anonymized answer options. Model and provider names are intentionally hidden; evaluate only content, logic, usefulness, and clarity.

Anonymized options:

${answersText}`;
        }

        function generateResultJSON() {
            const answers = models
                .map(m => {
                    return {
                        model_id: m.id,
                        model_name: m.name,
                        provider: m.provider,
                        user_rating: modelRatings[m.id] ?? null,
                        answer_text: getTrimmedAnswerValue(m.id)
                    };
                })
                .filter(a => a.answer_text);

            const result = {
                raw_prompt: document.getElementById('rawPrompt').value,
                improved_prompt: document.getElementById('improvedPrompt').value,
                answers: answers,
                final_answer: document.getElementById('finalAnswer').value
            };

            return JSON.stringify(result, null, 2);
        }

        function updateResults() {
            // Save to history
            void saveToHistory();

            // JSON tab
            document.getElementById('resultJSONDisplay').textContent = generateResultJSON();

            // Final answer tab - render markdown
            const finalAnswerContent = document.getElementById('finalAnswer').value;
            renderMarkdownInto(document.getElementById('finalAnswerDisplay'), finalAnswerContent);
            if (currentResultTab === 'comparison') {
                refreshComparisonView();
            }
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function getSafeHttpUrl(value) {
            if (!value || !value.trim()) return null;
            try {
                const url = new URL(value.trim(), window.location.href);
                if (url.protocol === 'http:' || url.protocol === 'https:') {
                    return url.href;
                }
            } catch (error) {}
            return null;
        }

        function sanitizeLinkUrl(value) {
            if (!value || !value.trim()) return null;
            if (value.trim().startsWith('#')) return value.trim();
            try {
                const url = new URL(value.trim(), window.location.href);
                if (['http:', 'https:', 'mailto:'].includes(url.protocol)) {
                    return url.href;
                }
            } catch (error) {}
            return null;
        }

        function sanitizeMarkdownHtml(html) {
            const template = document.createElement('template');
            template.innerHTML = html;
            const allowedTags = new Set([
                'a', 'blockquote', 'br', 'code', 'del', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'hr', 'li', 'ol', 'p', 'pre', 'strong', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'ul'
            ]);
            const removeWithContentTags = new Set([
                'button', 'form', 'iframe', 'input', 'link', 'meta', 'object', 'script', 'select', 'style', 'textarea'
            ]);
            const allowedAttributes = {
                a: new Set(['href', 'title']),
                code: new Set(['class'])
            };

            const visit = (node) => {
                if (node.nodeType === Node.TEXT_NODE) return;
                if (node.nodeType === Node.COMMENT_NODE) {
                    node.remove();
                    return;
                }
                if (node.nodeType !== Node.ELEMENT_NODE) {
                    node.remove();
                    return;
                }

                const tag = node.tagName.toLowerCase();
                if (removeWithContentTags.has(tag)) {
                    node.remove();
                    return;
                }

                Array.from(node.childNodes).forEach(visit);

                if (!allowedTags.has(tag)) {
                    const parent = node.parentNode;
                    if (!parent) return;
                    while (node.firstChild) {
                        parent.insertBefore(node.firstChild, node);
                    }
                    node.remove();
                    return;
                }

                Array.from(node.attributes).forEach((attr) => {
                    const attrName = attr.name.toLowerCase();
                    if (attrName.startsWith('on') || attrName === 'style') {
                        node.removeAttribute(attr.name);
                        return;
                    }

                    const tagAllowed = allowedAttributes[tag];
                    if (!tagAllowed || !tagAllowed.has(attrName)) {
                        node.removeAttribute(attr.name);
                        return;
                    }

                    if (tag === 'a' && attrName === 'href') {
                        const safeHref = sanitizeLinkUrl(attr.value);
                        if (!safeHref) {
                            node.removeAttribute('href');
                            return;
                        }
                        node.setAttribute('href', safeHref);
                        node.setAttribute('target', '_blank');
                        node.setAttribute('rel', 'noopener noreferrer');
                    }

                    if (tag === 'code' && attrName === 'class') {
                        const safeClasses = attr.value
                            .split(/\s+/)
                            .filter((className) => /^language-[\w-]+$/.test(className));
                        if (safeClasses.length > 0) {
                            node.setAttribute('class', safeClasses.join(' '));
                        } else {
                            node.removeAttribute('class');
                        }
                    }
                });
            };

            Array.from(template.content.childNodes).forEach(visit);
            return template.innerHTML;
        }

        function parseMarkdown(text) {
            const source = text || '';
            if (!source.trim()) return '';

            const cached = markdownCache.get(source);
            if (cached) return cached;

            const rendered = sanitizeMarkdownHtml(marked.parse(source, { breaks: true, gfm: true }));
            if (markdownCache.size >= MAX_MARKDOWN_CACHE_ENTRIES) {
                markdownCache.clear();
            }
            markdownCache.set(source, rendered);
            return rendered;
        }

        function renderMarkdownInto(container, text) {
            if (!container) return;
            container.innerHTML = '<div class="md-content">' + parseMarkdown(text) + '</div>';
            renderCodeBlocks(container);
        }

        function toggleAnswerSection(id) {
            const header = document.getElementById('section-header-' + id);
            const content = document.getElementById('section-content-' + id);
            const toggle = document.getElementById('section-toggle-' + id);
            
            content.classList.toggle('collapsed');
            toggle.classList.toggle('collapsed');
        }

        function renderCodeBlocks(container) {
            container.querySelectorAll('pre').forEach(pre => {
                const code = pre.querySelector('code');
                if (!code) return;

                // Skip if already wrapped (e.g. called twice)
                if (pre.parentElement && pre.parentElement.classList.contains('code-block-wrapper')) return;

                const language = code.className.replace(/language-/, '') || '';
                const codeText = code.textContent;

                // Create a wrapper div and insert it in place of <pre>
                const wrapper = document.createElement('div');
                wrapper.className = 'code-block-wrapper';
                pre.parentNode.insertBefore(wrapper, pre);
                wrapper.appendChild(pre);

                if (language) {
                    const langSpan = document.createElement('span');
                    langSpan.className = 'code-lang';
                    langSpan.textContent = language;
                    wrapper.appendChild(langSpan);
                }

                const btn = document.createElement('button');
                btn.className = 'code-copy-btn';
                btn.dataset.iconSize = 'w-3 h-3';
                btn.title = 'Copy code';
                btn.setAttribute('aria-label', 'Copy code');
                setCopyButtonIconState(btn, false);
                btn.onclick = function() { copyCodeBlock(this, codeText); };
                wrapper.appendChild(btn);
            });
        }

        // ── Universal clipboard: Clipboard API + execCommand fallback (Yandex Browser / file://) ──
        function copyToClipboard(text) {
            if (navigator.clipboard && window.isSecureContext) {
                return navigator.clipboard.writeText(text)
                    .then(() => true)
                    .catch(() => Promise.resolve(execCommandCopy(text)));
            }
            return Promise.resolve(execCommandCopy(text));
        }

        function execCommandCopy(text) {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none;';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            ta.setSelectionRange(0, ta.value.length);
            let ok = false;
            try { ok = document.execCommand('copy'); } catch(e) {}
            document.body.removeChild(ta);
            return ok;
        }

        function getCopyIconMarkup(sizeClass = 'w-4 h-4') {
            return `<svg class="${sizeClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>`;
        }

        function getCheckIconMarkup(sizeClass = 'w-4 h-4') {
            return `<svg class="${sizeClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
        }

        function setCopyButtonIconState(btn, copied = false) {
            if (!btn) return;
            const iconSize = btn.dataset.iconSize || (btn.classList.contains('code-copy-btn') ? 'w-3 h-3' : 'w-4 h-4');
            btn.innerHTML = copied ? getCheckIconMarkup(iconSize) : getCopyIconMarkup(iconSize);
        }

        function copyCodeBlock(btn, code) {
            copyToClipboard(code).then((success) => {
                if (!success) {
                    showSystemNotification('Failed to copy code', 'warning', 2600);
                    return;
                }
                btn.classList.add('copied');
                setCopyButtonIconState(btn, true);
                setTimeout(() => {
                    btn.classList.remove('copied');
                    setCopyButtonIconState(btn, false);
                }, 2000);
            });
        }

        function copyModelAnswer(modelId, buttonId) {
            copyText(getAnswerValue(modelId), buttonId);
        }

        function copyText(text, buttonId) {
            // Handle special constants
            if (text === 'ENHANCER_SYSTEM') text = enhancerSystem;
            if (text === 'AGGREGATOR_SYSTEM') text = aggregatorSystem;

            copyToClipboard(text).then((success) => {
                if (!success) {
                    showSystemNotification('Failed to copy text', 'warning', 2600);
                    return;
                }
                const btn = document.getElementById(buttonId);
                if (!btn) return;
                btn.classList.add('copied');
                setCopyButtonIconState(btn, true);
                
                setTimeout(() => {
                    btn.classList.remove('copied');
                    setCopyButtonIconState(btn, false);
                }, 2000);
            });
        }

        function copyAsMarkdown(containerId, buttonId) {
            const container = document.getElementById(containerId);
            const mdContent = container.querySelector('.md-content');
            if (!mdContent) return;

            const text = document.getElementById('finalAnswer').value;
            
            copyToClipboard(text).then((success) => {
                if (!success) {
                    showSystemNotification('Failed to copy Markdown', 'warning', 2600);
                    return;
                }
                const btn = document.getElementById(buttonId);
                if (!btn) return;
                btn.classList.add('copied');
                setCopyButtonIconState(btn, true);
                
                setTimeout(() => {
                    btn.classList.remove('copied');
                    setCopyButtonIconState(btn, false);
                }, 2000);
            });
        }

        function resetAll() {
            continuationUrls = {};
            isContinuation = false;
            currentThread = null;
            modelRatings = {};
            clearAutoSave();
            clearAnswerDrafts();
            modelCardsDirty = true;
            comparisonDirty = true;
            
            document.getElementById('rawPrompt').value = '';
            document.getElementById('improvedPrompt').value = '';
            document.getElementById('finalAnswer').value = '';
            models.forEach(m => {
                const el = document.getElementById(`answer-${m.id}`);
                if (el) el.value = '';
            });
            setStep(1);
        }

        // ─── THREADS / HISTORY ───────────────────────────────────────────────

        async function loadThreads() {
            try {
                const saved = await readStoredText(STORAGE_KEYS.threads);
                allThreads = JSON.parse(saved || '[]');
            }
            catch(e) { allThreads = []; }
        }

        async function saveThreads() {
            await writeStoredText(STORAGE_KEYS.threads, JSON.stringify(allThreads), { mirrorLocal: false });
        }

        async function saveToHistory() {
            try {
                const rawPrompt = document.getElementById('rawPrompt').value.trim();
                const finalAnswer = document.getElementById('finalAnswer').value.trim();
                if (!rawPrompt || !finalAnswer) return;

                const turn = {
                    rawPrompt,
                    improvedPrompt: document.getElementById('improvedPrompt').value.trim(),
                    finalAnswer,
                    timestamp: new Date().toISOString(),
                    chatUrls: { ...continuationUrls }
                };

                if (!currentThread) {
                    currentThread = {
                        id: Date.now(),
                        title: rawPrompt.length > 80 ? rawPrompt.slice(0, 80) + '…' : rawPrompt,
                        createdAt: new Date().toISOString(),
                        turns: []
                    };
                    allThreads.unshift(currentThread);
                    if (allThreads.length > 30) allThreads = allThreads.slice(0, 30);
                }

                const last = currentThread.turns[currentThread.turns.length - 1];
                if (last && last.rawPrompt === turn.rawPrompt && last.finalAnswer === turn.finalAnswer) return;

                currentThread.turns.push(turn);
                const idx = allThreads.findIndex(t => t.id === currentThread.id);
                if (idx !== -1) allThreads[idx] = currentThread;

                await saveThreads();
            } catch(e) {
                appLog('error', 'Error saving to history', e.message);
                showSystemNotification('Error saving to history: ' + e.message.slice(0, 60), 'error', 3000);
            }
        }

        // Render the in-page chat history bubbles above step-1 input
        function renderInPageChatHistory() {
            const wrap = document.getElementById('chatHistoryWrap');
            const body = document.getElementById('chatHistoryBody');
            const titleEl = document.getElementById('chatHistoryTitle');
            const step1Title = document.getElementById('step1Title');
            const step1Hint = document.getElementById('step1Hint');

            if (!currentThread || currentThread.turns.length === 0) {
                wrap.classList.add('hidden');
                body.innerHTML = '';
                if (step1Title) step1Title.textContent = 'Step 1: Your raw request';
                if (step1Hint) step1Hint.textContent = 'Enter your original question or task';
                return;
            }

            wrap.classList.remove('hidden');
            if (titleEl) titleEl.textContent = `Chat · ${currentThread.turns.length} ${currentThread.turns.length === 1 ? 'question' : 'questions'}`;
            if (step1Title) step1Title.textContent = 'Continue chat';
            if (step1Hint) step1Hint.textContent = 'Ask the next question — it will be sent to the same chats';

            body.innerHTML = currentThread.turns.map((turn, i) => {
                const aiId = 'ai-bubble-' + i;
                const aiHTML = parseMarkdown(turn.finalAnswer);
                return `
                <div class="chat-turn">
                    <span class="chat-turn-num">Question ${i + 1}</span>
                    <div class="chat-bubble-user">${escapeHtml(turn.rawPrompt)}</div>
                    <div class="chat-bubble-ai">
                        <div id="${aiId}" class="md-content chat-bubble-ai-collapsed">${aiHTML}</div>
                        <button data-action="toggleAiBubble" data-ai-id="${aiId}" class="mt-1 text-xs text-zinc-500 hover:text-zinc-700 underline">Expand</button>
                    </div>
                </div>`;
            }).join('');

            // Render code blocks inside bubbles
            body.querySelectorAll('.chat-bubble-ai .md-content').forEach(el => renderCodeBlocks(el));

            // Scroll to bottom
            setTimeout(() => { body.scrollTop = body.scrollHeight; }, 50);
        }

        function toggleAiBubble(id, btn) {
            const el = document.getElementById(id);
            if (!el) return;
            const collapsed = el.classList.toggle('chat-bubble-ai-collapsed');
            btn.textContent = collapsed ? 'Expand' : 'Collapse';
        }

        // ─── HISTORY PANEL ───────────────────────────────────────────────────

        async function openHistory() {
            await loadThreads();
            renderHistoryList();
            document.getElementById('historyPanel').classList.add('open');
            document.getElementById('historyOverlay').classList.add('open');
        }

        function closeHistory() {
            document.getElementById('historyPanel').classList.remove('open');
            document.getElementById('historyOverlay').classList.remove('open');
        }

        function exportHistory() {
            const data = {
                threads: allThreads,
                models: models,
                exportDate: new Date().toISOString()
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `multillm-history-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }

        function importHistory() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (data.threads && Array.isArray(data.threads)) {
                            if (confirm(`Import ${data.threads.length} chats? Existing history will be supplemented.`)) {
                                // Merge threads
                                const existingIds = new Set(allThreads.map(t => t.id));
                                data.threads.forEach(thread => {
                                    if (!existingIds.has(thread.id)) {
                                        allThreads.push(thread);
                                    }
                                });
                                await saveThreads();
                                renderHistoryList();
                                alert(`Imported ${data.threads.length} chats`);
                            }
                        }
                    } catch (err) {
                        alert('Error reading file: ' + err.message);
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        }

        function filterHistory() {
            const query = document.getElementById('historySearch').value.toLowerCase().trim();
            const entries = document.querySelectorAll('.thread-entry');
            entries.forEach(entry => {
                const title = entry.querySelector('.thread-title').textContent.toLowerCase();
                const visible = !query || title.includes(query);
                entry.style.display = visible ? 'block' : 'none';
            });
        }

        function clearHistory() {
            if (!confirm('Clear all chat history?')) return;
            allThreads = [];
            currentThread = null;
            void saveThreads();
            renderHistoryList();
            renderInPageChatHistory();
        }

        function renderHistoryList() {
            const container = document.getElementById('historyList');
            if (allThreads.length === 0) {
                container.innerHTML = `<div class="history-empty">
                    <svg class="w-10 h-10 mx-auto mb-3 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p>History is empty</p>
                    <p class="text-xs mt-1">Completed chats will appear here</p>
                </div>`;
                return;
            }
            container.innerHTML = allThreads.map((thread, idx) => {
                const date = new Date(thread.createdAt);
                const dateStr = date.toLocaleDateString('ru-RU', {day:'2-digit',month:'2-digit'}) + ' ' +
                                date.toLocaleTimeString('ru-RU', {hour:'2-digit',minute:'2-digit'});
                const isActive = currentThread && currentThread.id === thread.id;
                return `
                <div class="thread-entry" style="${isActive ? 'border-color:#3b82f6;' : ''}">
                    <div class="thread-entry-header" data-action="toggleThreadExpand" data-index="${idx}">
                        <div style="flex:1;min-width:0;">
                            <div class="thread-title">${escapeHtml(thread.title)}${isActive ? ' <span style="color:#3b82f6;font-size:0.7rem;font-weight:600;">● active</span>' : ''}</div>
                            <div class="thread-meta">
                                <span>🕐 ${dateStr}</span>
                                <span>💬 ${thread.turns.length} ${thread.turns.length === 1 ? 'question' : thread.turns.length < 5 ? 'questions' : 'questions'}</span>
                            </div>
                        </div>
                        <svg id="thread-arrow-${idx}" style="width:16px;height:16px;flex-shrink:0;transition:transform 0.2s;color:#a1a1aa;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                    <div id="thread-turns-${idx}" class="thread-turns" style="display:none;">
                        ${thread.turns.map((turn, ti) => `
                        <div class="thread-turn-row">
                            <span style="width:20px;flex-shrink:0;color:#a1a1aa;font-size:0.7rem;">${ti+1}.</span>
                            <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(turn.rawPrompt.length > 60 ? turn.rawPrompt.slice(0,60)+'…' : turn.rawPrompt)}</span>
                        </div>`).join('')}
                    </div>
                    <div class="thread-actions">
                        <button class="btn btn-primary btn-sm" data-action="openThread" data-index="${idx}">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                            Open and continue
                        </button>
                        <button class="btn btn-outline btn-sm text-red-500 border-red-200 hover:bg-red-50" data-action="deleteThread" data-index="${idx}" title="Delete chat">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                </div>`;
            }).join('');
        }

        function toggleThreadExpand(idx) {
            const el = document.getElementById('thread-turns-' + idx);
            const arrow = document.getElementById('thread-arrow-' + idx);
            if (!el) return;
            const open = el.style.display === 'none';
            el.style.display = open ? 'block' : 'none';
            if (arrow) arrow.style.transform = open ? 'rotate(180deg)' : '';
        }

        function openThread(idx) {
            const thread = allThreads[idx];
            if (!thread) return;
            currentThread = thread;
            isContinuation = thread.turns.length > 0;
            modelRatings = {};
            clearAnswerDrafts();
            modelCardsDirty = true;
            comparisonDirty = true;
            models.forEach(m => {
                const answerEl = document.getElementById(`answer-${m.id}`);
                if (answerEl) answerEl.value = '';
            });
            // Load last turn's chatUrls as continuation URLs
            const lastTurn = thread.turns[thread.turns.length - 1];
            continuationUrls = lastTurn ? { ...(lastTurn.chatUrls || {}) } : {};
            // Load last turn data into fields
            if (lastTurn) {
                document.getElementById('rawPrompt').value = '';
                document.getElementById('improvedPrompt').value = lastTurn.improvedPrompt || '';
                document.getElementById('finalAnswer').value = lastTurn.finalAnswer || '';
            }
            closeHistory();
            // Ask for chat URLs (pre-filled with last turn's URLs)
            openContinueModalWithPrefill(continuationUrls);
        }

        function deleteThread(idx) {
            const thread = allThreads[idx];
            if (!confirm(`Delete chat «${thread.title.slice(0,40)}»?`)) return;
            if (currentThread && currentThread.id === thread.id) {
                currentThread = null;
                isContinuation = false;
                continuationUrls = {};
            }
            allThreads.splice(idx, 1);
            void saveThreads();
            renderHistoryList();
            renderInPageChatHistory();
        }

        // ─── CONTINUE CHAT ───────────────────────────────────────────────────

        function openContinueModal() {
            openContinueModalWithPrefill(continuationUrls);
        }

        function openContinueModalWithPrefill(prefill) {
            const container = document.getElementById('continueUrlList');
            container.innerHTML = models.map(m => {
                const existing = prefill[m.id] || '';
                return `
                <div class="continue-url-row">
                    <div class="continue-url-label">
                        <span class="badge badge-dark" style="font-size:0.75rem;">${escapeHtml(m.name)}</span>
                    </div>
                    <input type="url" class="continue-url-input" id="cont-url-${m.id}"
                        placeholder="${escapeHtml(getSafeHttpUrl(m.chatUrl) || 'https://...')}"
                        value="${escapeHtml(existing)}" />
                </div>`;
            }).join('');
            document.getElementById('continueModal').classList.remove('hidden');
        }

        function closeContinueModal() {
            document.getElementById('continueModal').classList.add('hidden');
            // Do not reset currentThread to avoid losing chat context
        }

        function submitContinue() {
            const newUrls = {};
            let invalidUrls = 0;
            models.forEach(m => {
                const input = document.getElementById('cont-url-' + m.id);
                if (!input || !input.value.trim()) return;
                const safeUrl = getSafeHttpUrl(input.value);
                if (safeUrl) {
                    newUrls[m.id] = safeUrl;
                } else {
                    invalidUrls++;
                }
            });
            continuationUrls = newUrls;
            isContinuation = true;
            closeContinueModal();
            if (invalidUrls > 0) {
                showSystemNotification('Some links skipped: only http/https supported', 'warning', 3200);
            }
            // Clear input fields for new question, keep thread alive
            document.getElementById('rawPrompt').value = '';
            document.getElementById('improvedPrompt').value = '';
            document.getElementById('finalAnswer').value = '';
            modelRatings = {};
            clearAnswerDrafts();
            modelCardsDirty = true;
            comparisonDirty = true;
            models.forEach(m => {
                const el = document.getElementById(`answer-${m.id}`);
                if (el) el.value = '';
            });
            setStep(1);
        }

        // ── Chat fullscreen view ──
        function openChatFullscreen() {
            if (!currentThread || currentThread.turns.length === 0) return;
            const overlay = document.getElementById('chatFullscreenOverlay');
            const body    = document.getElementById('chatFullscreenBody');
            const titleEl = document.getElementById('chatFullscreenTitle');

            if (titleEl) titleEl.textContent = `Chat · ${currentThread.turns.length} ${currentThread.turns.length === 1 ? 'question' : 'questions'}`;

            body.innerHTML = currentThread.turns.map((turn, i) => {
                const aiHTML = parseMarkdown(turn.finalAnswer);
                return `
                <div class="chat-turn">
                    <span class="chat-turn-num">Question ${i + 1}</span>
                    <div class="chat-bubble-user">${escapeHtml(turn.rawPrompt)}</div>
                    <div class="chat-bubble-ai">
                        <div class="md-content">${aiHTML}</div>
                    </div>
                </div>`;
            }).join('');

            body.querySelectorAll('.md-content').forEach(el => renderCodeBlocks(el));
            overlay.classList.add('open');
        }

        function closeChatFullscreen() {
            document.getElementById('chatFullscreenOverlay').classList.remove('open');
        }
    



// ═══════════════════════════════════════════════════
// Event Listeners (auto-converted from inline handlers)
// ═══════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('ext-el-1').addEventListener('click', openHistory);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('ext-el-2').addEventListener('click', openSettings);
    document.getElementById('ext-el-3').addEventListener('click', function() { setStep(1); });
    document.getElementById('ext-el-4').addEventListener('click', function() { setStep(2); });
    document.getElementById('ext-el-5').addEventListener('click', function() { setStep(3); });
    document.getElementById('ext-el-6').addEventListener('click', function() { setStep(4); });
    document.getElementById('ext-el-7').addEventListener('click', function() { setStep(5); });
    document.getElementById('ext-el-8').addEventListener('click', openChatFullscreen);
    document.getElementById('ext-el-9').addEventListener('click', resetAll);
    document.getElementById('rawPrompt').addEventListener('input', autoSave);
    document.getElementById('ext-el-10').addEventListener('click', function() { setStep(2); });
    document.getElementById('copy-enhancer-sys').addEventListener('click', function() { copyText('ENHANCER_SYSTEM', 'copy-enhancer-sys'); });
    document.getElementById('copy-enhancer-user').addEventListener('click', function() { copyText(generateEnhancerUserPrompt(), 'copy-enhancer-user'); });
    document.getElementById('lms-send-enhancer-btn').addEventListener('click', sendEnhancerToLmStudio);
    document.getElementById('hf-send-enhancer-btn').addEventListener('click', sendEnhancerToHf);
    document.getElementById('improvedPrompt').addEventListener('input', autoSave);
    document.getElementById('ext-el-11').addEventListener('click', function() { setStep(1); });
    document.getElementById('ext-el-12').addEventListener('click', function() { setStep(3); });
    document.getElementById('copy-improved').addEventListener('click', function() { copyText(document.getElementById('improvedPrompt').value, 'copy-improved'); });
    document.getElementById('ext-el-13').addEventListener('click', function() { setStep(2); });
    document.getElementById('ext-el-14').addEventListener('click', function() { setStep(4); });
    document.getElementById('copy-aggregator-sys').addEventListener('click', function() { copyText('AGGREGATOR_SYSTEM', 'copy-aggregator-sys'); });
    document.getElementById('copy-aggregator-user').addEventListener('click', function() { copyText(generateAggregatorPrompt(), 'copy-aggregator-user'); });
    document.getElementById('lms-send-aggregator-btn').addEventListener('click', sendAggregatorToLmStudio);
    document.getElementById('hf-send-aggregator-btn').addEventListener('click', sendAggregatorToHf);
    document.getElementById('finalAnswer').addEventListener('input', autoSave);
    document.getElementById('ext-el-15').addEventListener('click', function() { setStep(3); });
    document.getElementById('ext-el-16').addEventListener('click', function() { setStep(5); });
    document.getElementById('ext-el-17').addEventListener('click', function(event) { setResultTab('final', event); });
    document.getElementById('ext-el-18').addEventListener('click', function(event) { setResultTab('comparison', event); });
    document.getElementById('ext-el-19').addEventListener('click', function(event) { setResultTab('json', event); });
    document.getElementById('copy-final').addEventListener('click', function() { copyText(document.getElementById('finalAnswer').value, 'copy-final'); });
    document.getElementById('copy-json').addEventListener('click', function() { copyText(generateResultJSON(), 'copy-json'); });
    document.getElementById('ext-el-20').addEventListener('click', function() { setStep(4); });
    document.getElementById('ext-el-21').addEventListener('click', openContinueModal);
    document.getElementById('ext-el-22').addEventListener('click', resetAll);
    document.getElementById('ext-el-23').addEventListener('click', closeSettings);
    document.getElementById('ext-el-24').addEventListener('click', function() { setSettingsTab('general'); });
    document.getElementById('ext-el-25').addEventListener('click', function() { setSettingsTab('models'); });
    document.getElementById('ext-el-26').addEventListener('click', function() { setSettingsTab('prompts'); });
    document.getElementById('ext-el-27').addEventListener('click', function() { setSettingsTab('templates'); });
    document.getElementById('ext-el-28').addEventListener('click', function() { setSettingsTab('lmstudio'); });
    document.getElementById('settings-tab-logs').addEventListener('click', function() { setSettingsTab('logs'); });
    document.getElementById('taskProfileSelect').addEventListener('change', function() { handleTaskProfileChange(document.getElementById('taskProfileSelect').value); });
    document.getElementById('ext-el-29').addEventListener('click', restoreDefaultModels);
    document.getElementById('deleteSelectedBtn').addEventListener('click', deleteSelectedModels);
    document.getElementById('ext-el-30').addEventListener('click', deleteAllModels);
    document.getElementById('ext-el-31').addEventListener('click', addModel);
    document.getElementById('ext-el-32').addEventListener('click', resetEnhancerPrompt);
    document.getElementById('settingsEnhancerPrompt').addEventListener('input', syncTaskProfileFromPromptEditors);
    document.getElementById('ext-el-33').addEventListener('click', resetAggregatorPrompt);
    document.getElementById('settingsAggregatorPrompt').addEventListener('input', syncTaskProfileFromPromptEditors);
    document.getElementById('ext-el-34').addEventListener('click', addTemplate);
    document.getElementById('lmsEnabledToggle').addEventListener('change', onLmsToggleChange);
    document.getElementById('lms-provider-card-lmstudio').addEventListener('click', function() { selectLmsProvider('lmstudio'); });
    document.getElementById('lms-provider-card-ollama').addEventListener('click', function() { selectLmsProvider('ollama'); });
    document.getElementById('lms-provider-card-custom').addEventListener('click', function() { selectLmsProvider('custom'); });
    document.getElementById('lms-provider-card-openai').addEventListener('click', function() { selectLmsProvider('openai'); });
    document.getElementById('lms-provider-card-deepseek').addEventListener('click', function() { selectLmsProvider('deepseek'); });
    document.getElementById('lms-provider-card-mistral').addEventListener('click', function() { selectLmsProvider('mistral'); });
    document.getElementById('lms-provider-card-anthropic').addEventListener('click', function() { selectLmsProvider('anthropic'); });
    document.getElementById('lms-provider-card-google').addEventListener('click', function() { selectLmsProvider('google'); });
    document.getElementById('lms-provider-card-groq').addEventListener('click', function() { selectLmsProvider('groq'); });
    document.getElementById('lms-provider-card-huggingface').addEventListener('click', function() { selectLmsProvider('huggingface'); });
    document.getElementById('lms-provider-card-openrouter').addEventListener('click', function() { selectLmsProvider('openrouter'); });
    document.getElementById('ext-el-35').addEventListener('click', function() { document.getElementById('keyImportInput').click(); });
    document.getElementById('keyImportInput').addEventListener('change', importKeysFromFile);
    document.getElementById('ext-el-36').addEventListener('click', exportKeysToFile);
    document.getElementById('ext-el-37').addEventListener('click', clearAllApiKeys);
    document.getElementById('lmsApiKeyInput').addEventListener('input', saveCurrentProviderCredentials);
    document.getElementById('ext-el-38').addEventListener('click', toggleApiKeyVisibility);
    document.getElementById('lms-test-btn').addEventListener('click', testLmsConnection);
    document.getElementById('lms-test-cloud-btn').addEventListener('click', testLmsConnection);
    document.getElementById('lms-refresh-btn').addEventListener('click', refreshLmsModels);
    document.getElementById('lmsModelSelect').addEventListener('change', saveCurrentProviderCredentials);
    document.getElementById('lmsModelManualInput').addEventListener('input', saveCurrentProviderCredentials);
    document.getElementById('loggingEnabledToggle').addEventListener('change', onLoggingToggleChange);
    document.getElementById('ext-el-39').addEventListener('click', exportLogs);
    document.getElementById('ext-el-40').addEventListener('click', clearLogs);
    document.getElementById('ext-el-41').addEventListener('click', function() { setLogFilter('all', document.getElementById('ext-el-41')); });
    document.getElementById('ext-el-42').addEventListener('click', function() { setLogFilter('error', document.getElementById('ext-el-42')); });
    document.getElementById('ext-el-43').addEventListener('click', function() { setLogFilter('warn', document.getElementById('ext-el-43')); });
    document.getElementById('ext-el-44').addEventListener('click', function() { setLogFilter('info', document.getElementById('ext-el-44')); });
    document.getElementById('ext-el-45').addEventListener('click', function() { setLogFilter('success', document.getElementById('ext-el-45')); });
    document.getElementById('ext-el-46').addEventListener('click', closeSettings);
    document.getElementById('ext-el-47').addEventListener('click', saveSettings);
    document.getElementById('ext-el-48').addEventListener('click', closeContinueModal);
    document.getElementById('ext-el-49').addEventListener('click', closeContinueModal);
    document.getElementById('ext-el-50').addEventListener('click', submitContinue);
    document.getElementById('historyOverlay').addEventListener('click', closeHistory);
    document.getElementById('ext-el-51').addEventListener('click', exportHistory);
    document.getElementById('ext-el-52').addEventListener('click', importHistory);
    document.getElementById('ext-el-53').addEventListener('click', clearHistory);
    document.getElementById('ext-el-54').addEventListener('click', closeHistory);
    document.getElementById('historySearch').addEventListener('input', filterHistory);
    document.getElementById('chatFullscreenOverlay').addEventListener('click', function() { if(event.target===document.getElementById('chatFullscreenOverlay'))closeChatFullscreen(); });
    document.getElementById('ext-el-55').addEventListener('click', closeChatFullscreen);

    // ═══════════════════════════════════════════════════════════════
    // Event Delegation for dynamically-generated elements
    // ═══════════════════════════════════════════════════════════════
    document.addEventListener('click', function(e) {
        const target = e.target instanceof Element ? e.target.closest('[data-action]') : null;
        if (!target) return;

        const action = target.getAttribute('data-action');

        switch (action) {
            case 'setRating': {
                const modelId = target.getAttribute('data-model-id');
                const star = parseInt(target.getAttribute('data-star'));
                setRating(modelId, star);
                break;
            }
            case 'copyModelAnswer': {
                const modelId = target.getAttribute('data-model-id');
                const copyId = target.getAttribute('data-copy-id');
                copyModelAnswer(modelId, copyId);
                break;
            }
            case 'editModel': {
                const index = parseInt(target.getAttribute('data-index'));
                editModel(index);
                break;
            }
            case 'deleteModel': {
                const index = parseInt(target.getAttribute('data-index'));
                deleteModel(index);
                break;
            }
            case 'applyTemplate': {
                const index = parseInt(target.getAttribute('data-index'));
                applyTemplate(index);
                break;
            }
            case 'deleteTemplate': {
                const index = parseInt(target.getAttribute('data-index'));
                deleteTemplate(index);
                break;
            }
            case 'toggleAnswerSection': {
                const section = target.getAttribute('data-section');
                toggleAnswerSection(section);
                break;
            }
            case 'copyAndOpen': {
                const modelId = target.getAttribute('data-model-id');
                copyAndOpen(modelId, e);
                break;
            }
            case 'toggleAiBubble': {
                const aiId = target.getAttribute('data-ai-id');
                toggleAiBubble(aiId, target);
                break;
            }
            case 'toggleThreadExpand': {
                const index = parseInt(target.getAttribute('data-index'));
                toggleThreadExpand(index);
                break;
            }
            case 'openThread': {
                const index = parseInt(target.getAttribute('data-index'));
                openThread(index);
                break;
            }
            case 'setSettingsTab': {
                const tab = target.getAttribute('data-tab');
                setSettingsTab(tab);
                break;
            }
            case 'deleteThread': {
                const index = parseInt(target.getAttribute('data-index'));
                deleteThread(index);
                break;
            }
        }
    });

    // Star hover delegation (mouseenter/mouseleave)
    document.addEventListener('mouseover', function(e) {
        const target = e.target instanceof Element ? e.target.closest('[data-action-enter]') : null;
        if (!target) return;
        const fnName = target.getAttribute('data-action-enter');
        if (fnName === 'hoverStar') {
            const star = parseInt(target.getAttribute('data-star'));
            hoverStar(e, star);
        }
    });

    document.addEventListener('mouseout', function(e) {
        const target = e.target instanceof Element ? e.target.closest('[data-action-leave]') : null;
        if (!target) return;
        const fnName = target.getAttribute('data-action-leave');
        if (fnName === 'unhoverStar') {
            unhoverStar(e);
        }
    });

    // Change/input delegation
    document.addEventListener('change', function(e) {
        const target = e.target instanceof Element ? e.target.closest('[data-action]') : null;
        if (!target) return;
        const action = target.getAttribute('data-action');
        if (action === 'toggleAllModels') {
            toggleAllModels(target);
        } else if (action === 'updateSelectedCount') {
            updateSelectedCount();
        }
    });

    document.addEventListener('input', function(e) {
        const target = e.target instanceof Element ? e.target.closest('[data-action]') : null;
        if (!target) return;
        const action = target.getAttribute('data-action');
        if (action === 'handleAnswerInput') {
            const modelId = target.getAttribute('data-model-id');
            handleAnswerInput(modelId, target.value);
        } else if (action === 'handleChatUrlInput') {
            const modelId = target.getAttribute('data-model-id');
            handleChatUrlInput(modelId, target.value);
        }
    });

});;
