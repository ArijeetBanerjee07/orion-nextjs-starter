"use client";

import { useState, useEffect, useRef } from "react";
import {
  PanelLeftClose, PanelLeft, Plus, MessageSquare, Send, Loader2,
  Code, LayoutTemplate, MoreHorizontal, Edit2, Download, FileCode2, Play, Trash2, Mic, ImagePlus, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import AuroraBackground from "./AuroraBackground";

type Project = {
  id: string;
  name: string;
  createdAt: string;
};

type Message = {
  id: string;
  role: string;
  content: string;
};

const LOADING_STATES = [
  "Analyzing requirements...",
  "Thinking about system architecture...",
  "Planning component structure...",
  "Writing React code...",
  "Styling with Tailwind CSS...",
  "Setting up state management...",
  "Pushing to GitHub repository...",
  "Finalizing deployment..."
];

export default function DashboardClient({ userEmail }: { userEmail: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const [chatWidth, setChatWidth] = useState<number | null>(null);
  const isDragging = useRef(false);
  const dragStartRef = useRef<{ startX: number, startWidth: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    const rect = chatPanelRef.current?.getBoundingClientRect();
    const currentWidth = rect ? rect.width : (chatWidth || 450);
    dragStartRef.current = { startX: e.clientX, startWidth: currentWidth };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    const iframe = document.getElementById("preview-iframe");
    if (iframe) iframe.style.pointerEvents = "none";
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !dragStartRef.current) return;
      const delta = e.clientX - dragStartRef.current.startX;
      let newWidth = dragStartRef.current.startWidth + delta;
      
      if (newWidth < 300) newWidth = 300;
      if (newWidth > window.innerWidth - 300) newWidth = window.innerWidth - 300;
      
      // Directly mutate DOM for buttery smooth 60fps dragging (avoids React re-renders)
      if (chatPanelRef.current) {
        chatPanelRef.current.style.width = `${newWidth}px`;
        chatPanelRef.current.style.flex = 'none';
      }
    };

    const handleMouseUp = () => {
      if (isDragging.current && chatPanelRef.current) {
        // Commit the final width to React state
        setChatWidth(parseFloat(chatPanelRef.current.style.width));
      }
      isDragging.current = false;
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
      const iframe = document.getElementById("preview-iframe");
      if (iframe) iframe.style.pointerEvents = "auto";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Load Projects
  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        if (data.length > 0 && !activeProjectId) {
          loadProject(data[0].id);
        }
      });
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Loading state interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setLoadingTextIndex(0);
      const loadingInterval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % LOADING_STATES.length);
      }, 3000);
      interval = loadingInterval;
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const loadProject = async (id: string) => {
    setActiveProjectId(id);
    const res = await fetch(`/api/projects/${id}`);
    const data = await res.json();
    setMessages(data.messages || []);

    // Find last assistant message for preview
    const lastAssistantMsg = data.messages?.slice().reverse().find((m: Message) => m.role === 'assistant');
    if (lastAssistantMsg) {
      try {
        const parsed = JSON.parse(lastAssistantMsg.content);
        if (parsed.html) {
          setPreviewHtml(parsed.html);
        }
      } catch (e) {
        const htmlMatch = lastAssistantMsg.content.match(/```(?:html)?\s*\n([\s\S]*?)```/i);
        if (htmlMatch) {
          setPreviewHtml(htmlMatch[1]);
        } else {
          const rawHtmlMatch = lastAssistantMsg.content.match(/<!doctype html>|<html/i);
          if (rawHtmlMatch) {
            setPreviewHtml(lastAssistantMsg.content.substring(rawHtmlMatch.index));
          } else {
            setPreviewHtml(null);
          }
        }
      }
    } else {
      setPreviewHtml(null);
    }
  };

  const handleNewProject = async () => {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New Chat" })
    });
    const newProj = await res.json();
    setProjects([newProj, ...projects]);
    setActiveProjectId(newProj.id);
    setMessages([]);
    setPreviewHtml(null);
    setViewMode("preview");
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this chat?")) return;

    await fetch(`/api/projects/${id}`, { method: "DELETE" });

    setProjects(projects.filter(p => p.id !== id));
    if (activeProjectId === id) {
      setActiveProjectId(null);
      setMessages([]);
      setPreviewHtml(null);
      setViewMode("preview");
    }
    setDropdownOpenId(null);
  };

  const handleOpenInNewTab = () => {
    if (!previewHtml) return;
    const blob = new Blob([previewHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleDownloadZip = async () => {
    if (!previewHtml) return;
    
    // Extract React code
    const scriptMatch = previewHtml.match(/<script type="text\/babel">([\s\S]*?)<\/script>/i);
    const reactCode = scriptMatch ? scriptMatch[1] : `export default function App() { return <div className="p-8 text-center text-red-500">Error extracting component. Ensure the AI used text/babel.</div>; }`;

    const zip = new JSZip();

    // package.json
    zip.file("package.json", JSON.stringify({
      name: "orion-generated-app",
      private: true,
      version: "0.0.0",
      type: "module",
      scripts: {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview"
      },
      dependencies: {
        "lucide-react": "^0.263.1",
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
      },
      devDependencies: {
        "@vitejs/plugin-react": "^4.0.3",
        "autoprefixer": "^10.4.14",
        "postcss": "^8.4.27",
        "tailwindcss": "^3.3.3",
        "vite": "^4.4.5"
      }
    }, null, 2));

    // vite.config.js
    zip.file("vite.config.js", `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`);

    // index.html
    zip.file("index.html", `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Orion Generated App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`);

    // tailwind.config.js
    zip.file("tailwind.config.js", `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`);

    // postcss.config.js
    zip.file("postcss.config.js", `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`);

    // src/main.jsx
    zip.file("src/main.jsx", `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`);

    // src/index.css
    zip.file("src/index.css", `@tailwind base;\n@tailwind components;\n@tailwind utilities;`);

    // src/App.jsx (the extracted code)
    let cleanedCode = reactCode;
    cleanedCode = cleanedCode.replace(/const\s*{\s*([^}]+)\s*}\s*=\s*React;?/g, "import React, { $1 } from 'react';");
    cleanedCode = cleanedCode.replace(/const\s*{\s*([^}]+)\s*}\s*=\s*lucide;?/g, "import { $1 } from 'lucide-react';");
    cleanedCode = cleanedCode.replace(/ReactDOM\.render\([\s\S]*$/, "");
    if (!cleanedCode.includes("export default")) {
      cleanedCode += `\nexport default MainComponent;`;
    }
    zip.file("src/App.jsx", cleanedCode);

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "orion-app.zip");
  };

  const handleSendMessage = async (e?: React.FormEvent | string, customStr?: string) => {
    if (typeof e === 'object' && e.preventDefault) {
      e.preventDefault();
    }
    const customPrompt = typeof e === 'string' ? e : customStr;
    const promptToSend = customPrompt || input;
    if (!promptToSend.trim()) return;

    let currentProjectId = activeProjectId;

    // Auto-create a new project if chatting in the empty state
    if (!currentProjectId) {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: promptToSend.slice(0, 30) + (promptToSend.length > 30 ? "..." : "") })
      });
      const newProj = await res.json();
      setProjects(prev => [newProj, ...prev]);
      setActiveProjectId(newProj.id);
      currentProjectId = newProj.id;
    }

    const prompt = promptToSend;
    if (!customPrompt) setInput("");

    // Optimistic UI for user message
    const userMsg = { id: Date.now().toString(), role: "user", content: prompt };
    setMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      // 1. Save user message
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: currentProjectId, role: "user", content: prompt })
      });

      // 2. Call n8n webhook via proxy which returns a jobId instantly
      const webhookRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, sessionId: currentProjectId, currentCode: previewHtml })
      });
      
      const { jobId } = await webhookRes.json();
      
      // Poll the database for the job status
      let jobResult = null;
      while (true) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        const statusRes = await fetch(`/api/jobs/${jobId}`);
        if (!statusRes.ok) continue;
        
        const job = await statusRes.json();
        if (job.status === 'COMPLETED') {
          jobResult = job.result;
          break;
        } else if (job.status === 'ERROR') {
          throw new Error("Generation failed.");
        }
      }

      const responseText = jobResult || "Your app has been successfully generated and pushed to your GitHub repository!";

      // 3. Save assistant message
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: currentProjectId, role: "assistant", content: responseText })
      });

      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: responseText }]);
      // We don't setPreviewHtml anymore since V2 pushes to GitHub instead of rendering in an iframe
      setViewMode("code");

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: "Error connecting to AI." }]);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'FIX_ERROR') {
        const errorMsg = event.data.error;
        const fixPrompt = `The code you generated threw this error:\n${errorMsg}\n\nPlease fix it.`;
        handleSendMessage(fixPrompt);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeProjectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-100 font-sans overflow-hidden">

      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 ease-in-out border-r border-white/10 bg-black flex flex-col relative z-20 ${sidebarOpen ? "w-[260px]" : "w-0 opacity-0 overflow-hidden border-none"
          }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-white/5 h-14 shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <svg width="20" height="20" viewBox="0 0 256 256" fill="#e8702a" xmlns="http://www.w3.org/2000/svg">
              <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
            </svg>
            <span className="font-bold tracking-widest uppercase text-white text-sm">Orion</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 shrink-0">
          <button
            onClick={handleNewProject}
            className="w-full flex items-center gap-2 px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1 mt-2">
          <div className="px-3 mb-2 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
            Recent Projects
          </div>
          {projects.map(proj => (
            <div key={proj.id} className="relative group">
              <button
                onClick={() => loadProject(proj.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${activeProjectId === proj.id ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0 opacity-70" />
                <span className="truncate pr-6">{proj.name}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpenId(dropdownOpenId === proj.id ? null : proj.id);
                }}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-white/20 text-zinc-400 hover:text-white transition-colors ${activeProjectId === proj.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {dropdownOpenId === proj.id && (
                <div ref={dropdownRef} className="absolute right-2 top-10 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors">
                    <Edit2 className="w-4 h-4" /> Rename
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors">
                    <Download className="w-4 h-4" /> Import Application
                  </button>
                  <div className="h-px bg-white/10 my-1" />
                  <button
                    onClick={(e) => handleDeleteProject(proj.id, e)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Chat
                  </button>
                  <button
                    onClick={() => {
                      setViewMode("code");
                      setDropdownOpenId(null);
                      loadProject(proj.id);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#e8702a] hover:bg-white/5 transition-colors"
                  >
                    <FileCode2 className="w-4 h-4" /> Overview (Code)
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 bg-black shrink-0">
          <div className="text-xs text-zinc-500 mb-3 truncate px-2">{userEmail}</div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center px-2 py-1.5 text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex min-w-0 h-screen transition-all duration-300 relative bg-black overflow-hidden">

        {/* Animated Premium Background for Empty State */}
        {messages.length === 0 && !isGenerating && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <AuroraBackground
              colorStops={["#caa388", "#f87f14", "#302715"]}
              amplitude={1.0}
              blend={0.5}
              speed={0.5}
            />
          </div>
        )}

        {/* Chat Panel */}
        <div 
          ref={chatPanelRef}
          className={`flex flex-col h-full transition-all ease-in-out relative z-10 ${!isDragging.current && !chatWidth ? 'duration-500' : 'duration-0'} ${
            previewHtml 
              ? `border-r border-white/10 bg-black/50 backdrop-blur-xl ${!chatWidth ? "w-full md:w-[350px] lg:w-[400px] xl:w-[450px]" : ""}` 
              : "w-full flex-1"
          }`}
          style={previewHtml && chatWidth ? { width: `${chatWidth}px`, flex: 'none' } : {}}
        >

          {/* Topbar of Chat */}
          <div className="h-14 flex items-center px-4 gap-3 bg-transparent mt-2 shrink-0">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Open Sidebar">
                <PanelLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex flex-col cursor-default">
              <span className="text-sm font-semibold flex items-center gap-2 text-white drop-shadow-md">
                Gemini 3.5 Flash <span className="px-1.5 py-[1px] rounded text-[9px] uppercase font-bold bg-[#e8702a]/20 text-[#e8702a]">Fast</span>
              </span>
            </div>
          </div>

          {/* Chat Layout Inner */}
          <div className="flex-1 flex flex-col relative overflow-hidden">

            {messages.length === 0 && !isGenerating ? (
              /* EMPTY STATE: Centered Layout */
              <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-700">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-2xl backdrop-blur-sm">
                  <svg width="32" height="32" viewBox="0 0 256 256" fill="#e8702a" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-medium text-white mb-3 tracking-tight">What do you want to build?</h3>
                <p className="text-[15px] text-zinc-400 max-w-md text-center leading-relaxed mb-10">
                  Describe a UI component, page layout, or full dashboard, and the Orion agent will generate it instantly.
                </p>

                {/* Centered Input Box */}
                <div className="w-full max-w-3xl relative flex items-end bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20 transition-all group">
                  <button className="absolute left-2.5 bottom-2.5 p-2 text-zinc-400 hover:text-white transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask Orion to build something..."
                    className="w-full bg-transparent pl-14 pr-[110px] py-[18px] text-[15px] text-white resize-none outline-none min-h-[60px] max-h-40"
                    rows={1}
                  />
                  <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1">
                    <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                      <Mic className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!input.trim()}
                      className="p-2 bg-white text-black rounded-lg hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase opacity-70">Agent powered by n8n Webhook</span>
                </div>
              </div>
            ) : (
              /* ACTIVE CHAT: Messages + Bottom Input */
              <>
                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                  {messages.map((msg, i) => {
                    let displayMsg = msg.content;
                    let hasCode = false;

                    if (msg.role === "assistant") {
                      try {
                        const parsed = JSON.parse(msg.content);
                        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].output) {
                          displayMsg = parsed[0].output;
                        } else if (parsed.output) {
                          displayMsg = parsed.output;
                        } else if (parsed.message) {
                          displayMsg = parsed.message;
                        }
                      } catch (e) {
                        // fallback to raw text if not JSON
                      }
                    }

                    return (
                      <div key={i} className={`flex flex-col w-full ${msg.role === "user" ? "items-end" : "items-start"}`}>
                        <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm break-words whitespace-pre-wrap ${msg.role === "user"
                            ? "bg-[#e8702a] text-white rounded-br-sm"
                            : "bg-[#111] text-zinc-200 rounded-bl-sm border border-white/10"
                          }`}>
                          {displayMsg}
                          {hasCode && (
                            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/10 text-xs font-medium text-[#e8702a] opacity-80">
                              <Code className="w-3.5 h-3.5" /> Code generated in preview
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {isGenerating && (
                    <div className="flex flex-col items-start w-full">
                      <div className="bg-[#111] border border-white/10 rounded-2xl rounded-bl-sm px-5 py-4 flex items-center gap-4 max-w-[85%] sm:max-w-[75%] shadow-sm">
                        <div className="relative flex items-center justify-center">
                          <Loader2 className="w-5 h-5 animate-spin text-[#e8702a]" />
                          <div className="absolute inset-0 bg-[#e8702a] blur-md opacity-30 rounded-full"></div>
                        </div>
                        <span className="text-[15px] text-zinc-300 transition-all duration-300 animate-pulse">
                          {LOADING_STATES[loadingTextIndex]}
                        </span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input (Bottom) */}
                <div className="p-4 md:p-6 bg-transparent pb-6 shrink-0 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="relative flex items-end bg-[#111] border border-white/10 rounded-2xl shadow-lg overflow-hidden focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20 transition-all">
                    <button className="absolute left-2.5 bottom-2.5 p-2 text-zinc-400 hover:text-white transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Ask Orion to build something..."
                      className="w-full bg-transparent pl-14 pr-[110px] py-[18px] text-[15px] text-white resize-none outline-none max-h-[200px] min-h-[60px]"
                      rows={1}
                    />
                    <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1">
                      <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                        <Mic className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleSendMessage}
                        disabled={!input.trim() || isGenerating}
                        className="p-2 bg-white text-black rounded-lg hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-center mt-3">
                    <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">Agent powered by n8n Webhook</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Resizer Handle */}
        {previewHtml && (
          <div 
            onMouseDown={handleMouseDown}
            className="hidden md:flex w-1.5 -ml-[3px] bg-transparent hover:bg-[#e8702a]/50 cursor-col-resize z-30 relative items-center justify-center group transition-colors"
          >
            <div className="h-10 w-1 rounded-full bg-white/20 group-hover:bg-[#e8702a] transition-colors" />
          </div>
        )}

        {/* Preview Panel (Hidden if no UI is generated) */}
        {previewHtml && (
          <div className="hidden md:flex flex-1 flex-col bg-[#050505] relative z-0 animate-in slide-in-from-right-8 duration-500 ease-out">
            <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#0a0a0a]">
              <div className="flex bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("preview")}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === "preview" ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                >
                  <Play className="w-4 h-4" /> Preview
                </button>
                <button
                  onClick={() => setViewMode("code")}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === "code" ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                >
                  <Code className="w-4 h-4" /> Code
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleOpenInNewTab}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-xs font-semibold transition-colors shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Preview in Browser
                </button>
                <button
                  onClick={handleDownloadZip}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e8702a] hover:bg-[#ff8642] text-white rounded text-xs font-semibold transition-colors shadow-sm mr-4"
                >
                  <Download className="w-3.5 h-3.5" /> Download Code
                </button>
                <div className="w-3 h-3 rounded-full bg-zinc-800 self-center"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-800 self-center"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-800 self-center"></div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden relative flex">
              {viewMode === "preview" ? (
                <div className="flex-1 p-4 bg-[#050505]">
                  <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden border border-white/10 relative ring-1 ring-black/5">
                    <iframe
                      id="preview-iframe"
                      srcDoc={previewHtml}
                      className="w-full h-full border-none bg-white"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex bg-[#0a0a0a]">
                  {/* Fake VS Code Sidebar */}
                  <div className="w-48 border-r border-white/10 bg-[#050505] p-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3 pl-2">Explorer</div>
                    <div className="space-y-1">
                      <div className="px-2 py-1.5 text-sm text-[#e8702a] bg-white/5 rounded flex items-center gap-2">
                        <FileCode2 className="w-4 h-4" /> index.html
                      </div>
                      <div className="px-2 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 cursor-pointer flex items-center gap-2">
                        <FileCode2 className="w-4 h-4" /> package.json
                      </div>
                      <div className="px-2 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 cursor-pointer flex items-center gap-2">
                        <FileCode2 className="w-4 h-4" /> tailwind.config.js
                      </div>
                    </div>
                  </div>
                  {/* Code Editor */}
                  <div className="flex-1 p-4 overflow-auto bg-[#0a0a0a]">
                    <pre className="text-[13px] font-mono text-zinc-300 leading-relaxed">
                      <code>
                        {previewHtml}
                      </code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
