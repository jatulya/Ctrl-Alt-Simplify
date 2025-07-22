import { useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Upload,
  Send,
  Bot,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import chatBotImage from "@/assets/chat-bot.jpg";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  analysis?: {
    canConsume: boolean;
    concerns: string[];
    suggestions: string[];
    score: number;
  };
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm NutriBot, your personal nutrition assistant. You can scan, upload, or manually enter ingredient lists, and I'll analyze them based on your health preferences. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [preferences, setPreferences] = useState<{
    allergens: string[];
    medicalConditions: string[];
    dietaryPreferences: string[];
  } | null>(null);
  // const ocrDataRaw = {
  //   result:
  //     '{"ingredients":["CHOCOCREME (SUGAR, REFINED PALMOLEIN, REFINED PALM OIL, COCOA SOLIDS, EMULSIFIER LECITHIN (FROM SOYABEAN), NATURE IDENTICAL FLAVOURING SUBSTANCES (CHOCOLATE), ARTIFICIAL FLAVOURING SUBSTANCES (VANILLA))", "MAIDA (REFINED WHEAT FLOUR)", "HYDROGENATED VEGETABLE OIL", "SUGAR", "DARK INVERT SYRUP", "LIQUID GLUCOSE", "RAISING AGENTS [INS 503(ii), INS 500(i), INS 450()]", "COCOA SOLIDS", "BUTTER", "MILK SOLIDS", "IODIZED SALT", "NATURE IDENTICAL FLAVOURING SUBSTANCES (\\"MILK CHOCOLATE\\")", "COLOURS (INS 150c, INS 150d)", "EMULSIFIERS [LECITHIN (FROM SOYABEAN), MONO AND DIGLYCERIDES OF FATTY ACIDS (FROM PALM OIL)]", "ARTIFICIAL FLAVOURING SUBSTANCES (MILK, VANILLA)"],"allergens": "yes","healthImplication": "This product is highly unsuitable for individuals with diabetes and fatty liver.","dietaryPreference": "no","score": 1}',
  // };
  // const storedOCR = localStorage.getItem("nutripal-ocr");
 const [parsedResult, setOcrData] = useState<{ ingredients: string[]; score: number | null }>({
  ingredients: [],
  score: null,
});

useEffect(() => {
  const storedOCR = localStorage.getItem("nutripal-ocr");
  if (storedOCR) {
    try {
      setOcrData(JSON.parse(storedOCR));
    } catch (err) {
      console.error("Failed to parse OCR result", err);
    }
  }
}, []);

  
  // try {
  //   parsedResult = JSON.parse(ocrData);
  // } catch (err) {
  //   console.error("Failed to parse OCR result", err);
  //   parsedResult = { ingredients: [], score: null };
  // }

  const mockAnalysis = (ingredientText: string) => {
    // Mock analysis based on common ingredients
    const lowercaseIngredients = ingredientText.toLowerCase();
    const concerns = [];
    const suggestions = [];
    let canConsume = true;
    let score = 85;

    // Check for common allergens
    if (
      lowercaseIngredients.includes("peanut") ||
      lowercaseIngredients.includes("tree nut")
    ) {
      concerns.push("Contains nuts - allergen risk");
      canConsume = false;
      score -= 30;
    }
    if (
      lowercaseIngredients.includes("milk") ||
      lowercaseIngredients.includes("dairy")
    ) {
      concerns.push("Contains dairy products");
      score -= 10;
    }
    if (
      lowercaseIngredients.includes("sugar") ||
      lowercaseIngredients.includes("high fructose")
    ) {
      concerns.push("High sugar content");
      score -= 15;
    }
    if (
      lowercaseIngredients.includes("sodium") ||
      lowercaseIngredients.includes("salt")
    ) {
      concerns.push("High sodium content");
      score -= 10;
    }

    // Positive ingredients
    if (lowercaseIngredients.includes("organic")) {
      suggestions.push("Great choice - organic ingredients!");
      score += 10;
    }
    if (
      lowercaseIngredients.includes("fiber") ||
      lowercaseIngredients.includes("whole grain")
    ) {
      suggestions.push("Good source of fiber");
      score += 5;
    }

    return {
      canConsume,
      concerns,
      suggestions,
      score: Math.max(0, Math.min(100, score)),
    };
  };

  const analyzeIngredients = (ingredientText: string) => {
    const analysis = mockAnalysis(ingredientText);

    const botResponse: Message = {
      id: Date.now().toString(),
      type: "bot",
      content: `I've analyzed the ingredients. Here's my assessment:`,
      timestamp: new Date(),
      analysis,
    };

    setMessages((prev) => [...prev, botResponse]);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // If message looks like ingredients, analyze them
    if (
      inputMessage.includes(",") ||
      inputMessage.includes("ingredients:") ||
      inputMessage.length > 50
    ) {
      setTimeout(() => analyzeIngredients(inputMessage), 1000);
    } else {
      // Regular chat response
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content:
            "I'd be happy to help! Please share the ingredient list you'd like me to analyze. You can type it, upload a photo, or scan it with your camera.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1000);
    }

    setInputMessage("");
  };

  const handleAnalyzeIngredients = () => {
    if (!ingredients.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: `Ingredients to analyze: ${ingredients}`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setTimeout(() => analyzeIngredients(ingredients), 1000);
    setIngredients("");
  };

  const AnalysisCard = ({ analysis }: { analysis: Message["analysis"] }) => {
    if (!analysis) return null;

    return (
      <Card className="mt-4 border-border/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              {analysis.canConsume ? (
                <CheckCircle className="h-5 w-5 text-success mr-2" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive mr-2" />
              )}
              {analysis.canConsume ? "Safe to Consume" : "Not Recommended"}
            </CardTitle>
            <Badge
              variant={
                analysis.score >= 70
                  ? "default"
                  : analysis.score >= 40
                  ? "secondary"
                  : "destructive"
              }
              className="text-sm"
            >
              Score: {analysis.score}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysis.concerns.length > 0 && (
            <div>
              <h4 className="font-medium text-destructive mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Concerns:
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {analysis.concerns.map((concern, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {concern}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.suggestions.length > 0 && (
            <div>
              <h4 className="font-medium text-success mb-2">Positive Notes:</h4>
              <ul className="list-disc list-inside space-y-1">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
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
                <h1 className="text-3xl font-bold text-foreground">
                  Chat with NutriBot
                </h1>
                <p className="text-muted-foreground">
                  Your AI nutrition analysis assistant
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Analysis Tools */}
            <div className="space-y-4">
              <Card className="border-border/20">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Analysis</CardTitle>
                  <CardDescription>
                    Enter ingredients manually for instant analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Enter ingredient list here... (e.g., Water, wheat flour, sugar, vegetable oil, eggs, salt)"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    rows={4}
                  />
                  <Button
                    onClick={handleAnalyzeIngredients}
                    className="w-full bg-primary hover:bg-primary-dark"
                    disabled={!ingredients.trim()}
                  >
                    Analyze Ingredients
                  </Button>
                </CardContent>
              </Card>

              <h2 className="text-lg font-semibold mb-2">Ingredients</h2>
              <ul className="list-disc list-inside text-sm space-y-1 max-h-64 overflow-y-auto">
                {parsedResult.ingredients?.map(
                  (item: string, index: number) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>

              <div className="mt-4 text-sm">
                <span className="font-semibold">Health Score:</span>{" "}
                <span
                  className={`font-bold ${
                    parsedResult.score >= 7
                      ? "text-green-600"
                      : parsedResult.score >= 4
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {parsedResult.score}/10
                </span>
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col border-border/20">
                {preferences && (
                  <Card className="mb-4 border-border/20 bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-base">
                        Your Preferences
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Based on your selections
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      {preferences.allergens.length > 0 && (
                        <p>
                          <span className="font-medium text-destructive">
                            Allergens:
                          </span>{" "}
                          {preferences.allergens.join(", ")}
                        </p>
                      )}
                      {preferences.medicalConditions.length > 0 && (
                        <p>
                          <span className="font-medium text-info">
                            Medical Conditions:
                          </span>{" "}
                          {preferences.medicalConditions.join(", ")}
                        </p>
                      )}
                      {preferences.dietaryPreferences.length > 0 && (
                        <p>
                          <span className="font-medium text-success">
                            Dietary Preferences:
                          </span>{" "}
                          {preferences.dietaryPreferences.join(", ")}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
                <CardHeader className="border-b border-border/20">
                  <CardTitle className="text-lg">Conversation</CardTitle>
                </CardHeader>

                {/* Messages */}

                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] ${
                          message.type === "user" ? "order-2" : "order-1"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-lg ${
                            message.type === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <div className="flex items-center mb-1">
                            {message.type === "user" ? (
                              <User className="h-4 w-4 mr-2" />
                            ) : (
                              <Bot className="h-4 w-4 mr-2" />
                            )}
                            <span className="text-sm font-medium">
                              {message.type === "user" ? "You" : "NutriBot"}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </div>

                        {message.analysis && (
                          <AnalysisCard analysis={message.analysis} />
                        )}

                        <p className="text-xs text-muted-foreground mt-1 px-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>

                {/* Input Area */}
                <div className="p-4 border-t border-border/20">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ask me about ingredients or nutrition..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
