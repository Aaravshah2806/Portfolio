import { useState, useEffect, useRef } from 'react';
import { Send, X, RotateCcw, Sparkles, User, Bot } from 'lucide-react';

const SUGGESTIONS = [
  { label: "🛠️ Core Skills", query: "What are Aarav's core technical skills and technologies?" },
  { label: "🏆 Hackathon Wins", query: "Tell me about Aarav's hackathon achievements and awards." },
  { label: "💻 Featured Projects", query: "What featured projects has Aarav built?" },
  { label: "📫 Contact & Hire", query: "How can I contact Aarav for internship or project opportunities?" }
];

const INITIAL_MESSAGE = {
  role: 'ai',
  content: "👋 Hi! I'm **Aarav's Portfolio Assistant**.\n\nAsk me anything about Aarav's skills, projects, hackathon wins, experience, or how to get in touch!"
};

// Parses inline markdown: bold, italics, code, links, emails, and handles html breaks
const parseInlineMarkdown = (text) => {
  if (!text) return null;

  // Replace <br> or <br/> with newline or spaces
  const cleanText = text.replace(/<br\s*\/?>/gi, ' ');

  // Regex captures bold (**...**), italics (*...* or _..._), inline code (`...`), markdown links ([...](...)), URLs, emails
  const regex = /(\*\*.*?\*\*|\*[^*\n]+?\*|_.*?_|`.*?`|\[.*?\]\(.*?\)|https?:\/\/[^\s<)]+|[\w.-]+@[\w.-]+\.\w+)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(cleanText)) !== null) {
    if (match.index > lastIndex) {
      parts.push(cleanText.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
      parts.push(<strong key={match.index}>{parseInlineMarkdown(token.slice(2, -2))}</strong>);
    } else if (token.startsWith('*') && token.endsWith('*') && token.length >= 2) {
      parts.push(<em key={match.index}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith('_') && token.endsWith('_') && token.length >= 2) {
      parts.push(<em key={match.index}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(<code key={match.index} className="inline-code">{token.slice(1, -1)}</code>);
    } else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
      const linkText = token.slice(1, token.indexOf(']('));
      const linkUrl = token.slice(token.indexOf('](') + 2, -1);
      parts.push(
        <a key={match.index} href={linkUrl} target="_blank" rel="noopener noreferrer" className="chat-link">
          {linkText}
        </a>
      );
    } else if (token.includes('@') && !token.startsWith('http')) {
      parts.push(
        <a key={match.index} href={`mailto:${token}`} className="chat-link email-link">
          {token}
        </a>
      );
    } else if (token.startsWith('http')) {
      parts.push(
        <a key={match.index} href={token} target="_blank" rel="noopener noreferrer" className="chat-link">
          {token}
        </a>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < cleanText.length) {
    parts.push(cleanText.substring(lastIndex));
  }

  return parts;
};

// Formats rich markdown elements (headings, bold, italics, links, code, bullet lists, tables) safely
const FormattedMessage = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="message-formatted-content">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        // Empty line
        if (!trimmed) {
          return <div key={lineIdx} className="message-spacer" />;
        }

        // Table separator row like |---|---|
        if (/^\|[-|\s:]+\|$/.test(trimmed)) {
          return null; // Skip table border lines cleanly
        }

        // Table row like | col1 | col2 |
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
          const cells = trimmed
            .split('|')
            .slice(1, -1)
            .map(c => c.trim())
            .filter(c => c.length > 0);
          
          if (cells.length === 0) return null;

          return (
            <div key={lineIdx} className="chat-table-card">
              {cells.map((cell, cIdx) => (
                <div key={cIdx} className={`chat-table-cell cell-${cIdx}`}>
                  {parseInlineMarkdown(cell)}
                </div>
              ))}
            </div>
          );
        }

        // Headers: ### Title or ## Title or # Title
        if (trimmed.startsWith('#### ')) {
          return <h5 key={lineIdx} className="chat-h5">{parseInlineMarkdown(trimmed.replace(/^####\s+/, ''))}</h5>;
        }
        if (trimmed.startsWith('### ')) {
          return <h4 key={lineIdx} className="chat-h4">{parseInlineMarkdown(trimmed.replace(/^###\s+/, ''))}</h4>;
        }
        if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
          return <h3 key={lineIdx} className="chat-h3">{parseInlineMarkdown(trimmed.replace(/^#+\s+/, ''))}</h3>;
        }

        // Indented sub-bullets or regular bullets
        const isIndented = /^(\s{2,}|\t+)/.test(line);
        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ');
        const isNumbered = /^\d+\.\s+/.test(trimmed);

        if (isBullet || isNumbered) {
          const cleanText = trimmed.replace(/^([•\-*]|\d+\.)\s*/, '');
          const bulletMarker = isNumbered ? trimmed.match(/^\d+\./)[0] : '•';
          return (
            <div key={lineIdx} className={`chat-bullet-item ${isIndented ? 'nested' : ''}`}>
              <span className="chat-bullet-dot">{bulletMarker}</span>
              <span className="chat-bullet-text">{parseInlineMarkdown(cleanText)}</span>
            </div>
          );
        }

        return <p key={lineIdx} className="chat-paragraph">{parseInlineMarkdown(trimmed)}</p>;
      })}
    </div>
  );
};

const ChatPanel = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage = { role: 'user', content: query };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Send conversation history to backend
      const apiMessages = newMessages.map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.content
      }));

      const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000').replace(/\/+$/, '');
      const response = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: query,
          messages: apiMessages 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { role: 'ai', content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { 
            role: 'ai', 
            content: "⚠️ I'm having a little trouble connecting right now. Please ensure the backend server is running, or feel free to email Aarav directly at **shahaarav2806@gmail.com**!" 
          }
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { 
          role: 'ai', 
          content: "⚠️ Could not connect to the assistant backend. If this service is newly hosted, it may take ~30 seconds to wake up from cold start. You can also reach out to Aarav at **shahaarav2806@gmail.com**." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  return (
    <div className={`chat-panel ${isOpen ? 'open' : ''}`} data-lenis-prevent>
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="assistant-avatar">
            <Sparkles size={16} className="avatar-icon" />
          </div>
          <div>
            <h3>Aarav's AI Guide</h3>
            <span className="chat-status-indicator">
              <span className="status-dot"></span> Online & Ready
            </span>
          </div>
        </div>

        <div className="chat-header-controls">
          <button 
            onClick={handleReset} 
            className="control-btn" 
            title="Reset conversation"
            aria-label="Reset conversation"
          >
            <RotateCcw size={16} />
          </button>
          <button 
            onClick={onClose} 
            className="control-btn close-btn" 
            title="Close chat"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="chat-suggestions-bar" data-lenis-prevent>
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            className="suggestion-chip"
            onClick={() => handleSend(s.query)}
            disabled={isLoading}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="chat-messages" data-lenis-prevent>
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-wrapper ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'ai' ? <Bot size={15} /> : <User size={15} />}
            </div>
            <div className={`message-bubble ${msg.role}`}>
              <FormattedMessage content={msg.content} />
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message-wrapper ai">
            <div className="message-avatar">
              <Bot size={15} />
            </div>
            <div className="message-bubble ai thinking">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="chat-input-form">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Aarav's skills, projects..." 
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()} title="Send Message">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
