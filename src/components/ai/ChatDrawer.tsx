import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Mic, MicOff, Volume2, VolumeX, Sparkles, RotateCcw, 
  Heart, Bot, User, Loader2, AlertCircle, Check
} from 'lucide-react';
import { AIMessage, UserProfile } from '../../types';
import { sendAIChatMessage, VoiceAssistant } from '../../services/aiService';
import { ActionConfirmationCard } from './ActionConfirmationCard';
import { db } from '../../db';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  isPeriod: boolean;
  onActionExecuted?: () => void;
}

const QUICK_CHIPS = [
  'What should I eat for breakfast today?',
  'Can I eat biryani today?',
  'I have eggs, rice and chicken at home.',
  'How much cooked rice should I log?',
  'I only have 10 minutes. Adjust my workout.',
  'My cramps are bad today. What should I do?',
  'Give me a safe 2-day reset.',
  'I felt bloated and my weight increased. Why?',
  'Summarize my progress this week.',
  'Switch to minimum viable day.'
];

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  isPeriod,
  onActionExecuted
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true);
  const [assistantName, setAssistantName] = useState(profile.assistantName || 'Rosy — Your Wellness Companion ❤️');
  const [isEditingName, setIsEditingName] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceAssistantRef = useRef<VoiceAssistant | null>(null);

  // Load chat messages from IndexedDB
  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen]);

  const loadMessages = async () => {
    const saved = await db.aiMessages.toArray();
    if (saved.length > 0) {
      setMessages(saved);
    } else {
      // Default welcome
      const welcome: AIMessage = {
        id: 'welcome-init',
        sender: 'assistant',
        text: `Namaste Deep! I am ${assistantName}. I am here with you on Deep\'s Magical Journey ❤️\n\nHow is your body feeling today? You can ask me about Indian meal planning, raw vs cooked scale weights, gentle workouts, period comfort, or safe resets anytime!`,
        timestamp: new Date().toISOString()
      };
      await db.aiMessages.add(welcome);
      setMessages([welcome]);
    }
  };

  useEffect(() => {
    voiceAssistantRef.current = new VoiceAssistant();
    return () => {
      voiceAssistantRef.current?.stopListening();
      voiceAssistantRef.current?.stopSpeaking();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setInput('');
    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString()
    };

    const newThread = [...messages, userMsg];
    setMessages(newThread);
    await db.aiMessages.add(userMsg);

    setIsLoading(true);

    try {
      const response = await sendAIChatMessage(query, profile, isPeriod);
      const assistantMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toISOString(),
        suggestedAction: response.suggestedAction,
        safetyAlert: response.safetyAlert
      };

      setMessages(prev => [...prev, assistantMsg]);
      await db.aiMessages.add(assistantMsg);

      if (isSpeakingEnabled && voiceAssistantRef.current) {
        voiceAssistantRef.current.speak(response.reply);
      }
    } catch (e: any) {
      const fallbackMsg: AIMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'I am here with you! Let me know how I can support your meal or workout plan today. ❤️',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, fallbackMsg]);
      await db.aiMessages.add(fallbackMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoiceInput = () => {
    if (!voiceAssistantRef.current?.isSupported) {
      alert('Microphone speech recognition is not supported in this browser. You can type your question freely!');
      return;
    }

    if (isListening) {
      voiceAssistantRef.current.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      voiceAssistantRef.current.startListening(
        (transcript) => {
          setIsListening(false);
          setInput(transcript);
          handleSend(transcript);
        },
        (err) => {
          console.warn('Voice error:', err);
          setIsListening(false);
        }
      );
    }
  };

  const handleClearHistory = async () => {
    if (confirm('Clear conversation history?')) {
      await db.aiMessages.clear();
      voiceAssistantRef.current?.stopSpeaking();
      const resetMsg: AIMessage = {
        id: `reset-${Date.now()}`,
        sender: 'assistant',
        text: 'Fresh conversation started! How may I care for your body and mind today? ❤️',
        timestamp: new Date().toISOString()
      };
      await db.aiMessages.add(resetMsg);
      setMessages([resetMsg]);
    }
  };

  const handleActionApplied = (actionId: string, resultMsg: string) => {
    setMessages(prev => prev.map(m => {
      if (m.suggestedAction?.id === actionId) {
        return { ...m, actionStatus: 'applied' };
      }
      return m;
    }));
    onActionExecuted?.();
  };

  const handleActionDismissed = (actionId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.suggestedAction?.id === actionId) {
        return { ...m, actionStatus: 'dismissed' };
      }
      return m;
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-plum-950/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full sm:max-w-2xl h-[92vh] sm:h-[85vh] bg-cream-50 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-cream-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-plum-900 to-plum-950 text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-roseDust-400 to-softCoral-400 p-0.5 shadow-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              {isEditingName ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={assistantName}
                    onChange={(e) => setAssistantName(e.target.value)}
                    className="text-sm px-2 py-0.5 bg-plum-800 text-white rounded-lg border border-plum-600 focus:outline-none"
                    autoFocus
                  />
                  <button 
                    onClick={() => setIsEditingName(false)}
                    className="p-1 hover:bg-plum-700 rounded text-xs"
                  >
                    <Check className="w-3.5 h-3.5 text-sageCare-400" />
                  </button>
                </div>
              ) : (
                <div 
                  className="flex items-center space-x-1.5 cursor-pointer"
                  onClick={() => setIsEditingName(true)}
                  title="Click to rename assistant"
                >
                  <h3 className="font-serif font-bold text-sm sm:text-base leading-tight">
                    {assistantName}
                  </h3>
                  <span className="text-[10px] bg-plum-700/80 px-1.5 py-0.2 rounded text-cream-300">edit</span>
                </div>
              )}
              <div className="flex items-center space-x-1.5 text-[11px] text-cream-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Context Aware • Always by your side</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Toggle TTS */}
            <button
              onClick={() => {
                const nextState = !isSpeakingEnabled;
                setIsSpeakingEnabled(nextState);
                if (!nextState) voiceAssistantRef.current?.stopSpeaking();
              }}
              className={`p-2 rounded-xl transition-all ${
                isSpeakingEnabled ? 'bg-plum-800 text-roseDust-300' : 'text-plum-400 hover:text-white'
              }`}
              title={isSpeakingEnabled ? 'Voice reads answers aloud (Click to mute)' : 'Muted (Click to enable voice)'}
            >
              {isSpeakingEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Clear Chat */}
            <button
              onClick={handleClearHistory}
              className="p-2 text-plum-400 hover:text-white rounded-xl hover:bg-plum-800 transition-all"
              title="Clear conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-plum-300 hover:text-white rounded-xl hover:bg-plum-800 transition-all"
              aria-label="Close assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-cream-100/90 border-b border-cream-300 px-4 py-2.5 overflow-x-auto no-scrollbar flex items-center space-x-2 shrink-0">
          <span className="text-[10px] uppercase font-bold text-plum-500 tracking-wider shrink-0 flex items-center">
            <Sparkles className="w-3 h-3 text-roseDust-500 mr-1" /> Quick Ask:
          </span>
          {QUICK_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="text-xs whitespace-nowrap bg-white hover:bg-roseDust-50 text-plum-800 border border-cream-300 hover:border-roseDust-300 px-3 py-1.5 rounded-full transition-all shadow-2xs shrink-0 active:scale-95"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-roseDust-400 to-softCoral-400 flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                    <Heart className="w-4 h-4 fill-white" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-plum-900 text-cream-50 rounded-tr-xs shadow-soft'
                    : 'bg-white text-plum-900 border border-cream-300 rounded-tl-xs shadow-soft'
                }`}>
                  <div className="whitespace-pre-line font-sans">
                    {msg.text}
                  </div>

                  {/* Safety Alert Banner */}
                  {msg.safetyAlert && (
                    <div className="mt-3 p-3 bg-softCoral-100 border border-softCoral-300 rounded-xl text-softCoral-800 text-xs font-semibold flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{msg.safetyAlert}</span>
                    </div>
                  )}

                  {/* Structured Action Execution Preview Card */}
                  {msg.suggestedAction && msg.actionStatus !== 'applied' && msg.actionStatus !== 'dismissed' && (
                    <ActionConfirmationCard
                      action={msg.suggestedAction}
                      onApplied={handleActionApplied}
                      onDismissed={handleActionDismissed}
                    />
                  )}

                  {msg.actionStatus === 'applied' && (
                    <div className="mt-2.5 text-[11px] text-sageCare-600 font-semibold flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Changes applied to your active plan</span>
                    </div>
                  )}

                  <div className={`text-[10px] mt-1.5 ${isUser ? 'text-cream-400 text-right' : 'text-plum-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-cream-300 flex items-center justify-center text-plum-700 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-plum-500 bg-white border border-cream-300 px-4 py-3 rounded-2xl w-fit shadow-2xs">
              <Loader2 className="w-4 h-4 animate-spin text-roseDust-500" />
              <span>Rosy is carefully thinking for you...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-cream-300 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            {/* Mic speech recognition */}
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              className={`p-3 rounded-2xl transition-all ${
                isListening
                  ? 'bg-roseDust-500 text-white animate-pulse shadow-rose-glow'
                  : 'bg-cream-100 hover:bg-cream-200 text-plum-700 border border-cream-300'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Click to speak your question'}
              aria-label="Voice input"
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <input
              type="text"
              id="ai-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? 'Listening to your voice...' : 'Ask Rosy anything about food, workouts, period, or rest...'}
              className="flex-1 bg-cream-100 text-plum-900 placeholder:text-plum-400 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-cream-300 focus:outline-none focus:border-roseDust-400 focus:bg-white transition-all"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-roseDust-500 to-softCoral-400 hover:from-roseDust-600 hover:to-softCoral-500 text-white rounded-2xl shadow-rose-glow transition-all disabled:opacity-40 disabled:scale-100 active:scale-95"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="text-[10px] text-center text-plum-600 mt-2">
            Private & confidential • Compassionate wellness support • Not a medical prescription
          </div>
        </div>

      </div>
    </div>
  );
};
