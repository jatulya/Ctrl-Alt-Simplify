import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";;
import { Send, Bot, User } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import chatBotImage from "@/assets/chat-bot.jpg";
import { buildPrompt, fetchChatResponse } from '../lib/chatUtils'
import { formatMessageWithBold } from "@/components/formatResponse";
import { useUserPreferences } from "@/lib/context";


interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  analysis?: {
    canConsume: boolean;
    concerns: string[];
    suggestions: string[];
    score: number;
  };
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    type: 'bot',
    content:
      "Hello! I'm NutriBot, your personal nutrition assistant. You can scan, upload, or manually enter ingredient lists, and I'll analyze them based on your health preferences. How can I help you today?",
    timestamp: new Date(),
  }]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const { allergens, dietaryPreferences, medicalConditions } = useUserPreferences();

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    const prompt = buildPrompt(
      inputMessage,
      ingredients,
      allergens,
      dietaryPreferences,
      medicalConditions
    ); 
    const botReply = await fetchChatResponse(prompt);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: botReply,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img
                src={chatBotImage}
                alt="NutriBot"
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Chat with NutriBot</h1>
                <p className="text-muted-foreground">Your AI nutrition analysis assistant</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col border-border/20">
                <CardHeader className="border-b border-border/20">
                  <CardTitle className="text-lg">Conversation</CardTitle>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`p-3 rounded-lg ${message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                            }`}
                        >
                          <div className="flex items-center mb-1">
                            {message.type === 'user' ? (
                              <User className="h-4 w-4 mr-2" />
                            ) : (
                              <Bot className="h-4 w-4 mr-2" />
                            )}
                            <span className="text-sm font-medium">
                              {message.type === 'user' ? 'You' : 'NutriBot'}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-line">
                            {message.type === "bot"
                              ? formatMessageWithBold(message.content)
                              : message.content}
                          </p>

                        </div>
                        <p className="text-xs text-muted-foreground mt-1 px-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] order-1">
                        <div className="p-3 rounded-lg bg-muted flex items-center space-x-2">
                          <Bot className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">NutriBot is typing...</span>
                          <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-foreground rounded-full" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>

                <div className="p-4 border-t border-border/20">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ask me about ingredients or nutrition..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="bg-primary hover:bg-primary-dark"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar or Future Features Placeholder */}
            <div>
              {/* Reserved for additional features or info */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;