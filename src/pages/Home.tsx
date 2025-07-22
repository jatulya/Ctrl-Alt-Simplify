import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Camera,
  Upload,
  Edit3,
  Settings,
  MessageCircle,
  Lightbulb,
  Heart,
  Shield,
} from "lucide-react";
import heroImage from "@/assets/hero-nutrition.jpg";
import scanImage from "@/assets/scan-food.jpg";
import healthTipsImage from "@/assets/health-tips.jpg";
import { Navbar } from "@/components/Navbar";

const Home = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  useEffect(() => {
    const storedImage = localStorage.getItem("uploadedImage");
    if (storedImage) {
      setImagePreview(storedImage);
    }
  }, []);

  // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result as string);
  //       alert("Image uploaded successfully!");
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const base64Image = reader.result as string;
  //       setImagePreview(base64Image);
  //       localStorage.setItem("uploadedImage", base64Image);
  //       alert("Image uploaded successfully!");
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;
      setImagePreview(base64Image);
      localStorage.setItem("uploadedImage", base64Image);
      alert("Image uploaded successfully!");
    };
    reader.readAsDataURL(file);

    // 👇 Send POST request to FastAPI
    const formData = new FormData();
    formData.append("image", file);
    formData.append("allergens", "nuts, soy"); // Replace with user input if needed
    formData.append("preferences", "vegan");   // Replace with user input if needed
    formData.append("health_conditions", "diabetes"); // Replace as needed

    try {
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();
      console.log("LLM Response:", data.result);

    localStorage.setItem("nutripal-ocr", JSON.stringify(data.result));

      alert("Analysis completed. Check console for result.");
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed");
    }
  }
};


  const healthTips = [
    {
      title: "Read Ingredient Labels",
      description:
        "Always check the first 3 ingredients - they make up most of the product.",
      icon: Lightbulb,
      color: "text-info",
    },
    {
      title: "Watch for Hidden Allergens",
      description:
        "Common allergens can hide under different names. Stay vigilant!",
      icon: Shield,
      color: "text-warning",
    },
    {
      title: "Portion Control Matters",
      description:
        "Even healthy foods should be consumed in appropriate portions.",
      icon: Heart,
      color: "text-success",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-8 shadow-card">
          <img
            src={heroImage}
            alt="Healthy nutrition"
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-light/60 flex items-center">
            <div className="px-8 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Welcome back!
              </h1>
              <p className="text-lg md:text-xl mb-6 text-white/90">
                Let's make healthy eating easier with smart ingredient analysis
              </p>
              <Button
                onClick={() => navigate("/health-preferences")}
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="group hover:shadow-hover transition-all duration-300 cursor-pointer border-border/20">
            <CardHeader className="text-center pb-4">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Camera className="h-8 w-8 text-primary mx-auto" />
              </div>
              <CardTitle className="text-xl">Scan Ingredients</CardTitle>
              <CardDescription>
                Use your camera to instantly scan food labels
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <img
                src={scanImage}
                alt="Scan food"
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <Button
                onClick={() => navigate("/chat")}
                className="w-full"
                variant="outline"
              >
                Start Scanning
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-hover transition-all duration-300 cursor-pointer border-border/20">
            <CardHeader className="text-center pb-4">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Upload className="h-8 w-8 text-primary mx-auto" />
              </div>
              <CardTitle className="text-xl">Upload Photo</CardTitle>
              <CardDescription>
                Upload a photo of ingredient list from your gallery
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-muted rounded-lg h-32 flex items-center justify-center mb-4 overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Uploaded preview"
                    className="h-full object-contain"
                  />
                ) : (
                  <Upload className="h-12 w-12 text-muted-foreground" />
                )}
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Trigger upload on button click */}
              <Button
                className="w-full"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Image
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-hover transition-all duration-300 cursor-pointer border-border/20">
            <CardHeader className="text-center pb-4">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Edit3 className="h-8 w-8 text-primary mx-auto" />
              </div>
              <CardTitle className="text-xl">Manual Entry</CardTitle>
              <CardDescription>
                Type ingredient list manually for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-muted rounded-lg h-32 flex items-center justify-center mb-4">
                <Edit3 className="h-12 w-12 text-muted-foreground" />
              </div>
              <Button
                onClick={() => navigate("/chat")}
                className="w-full"
                variant="outline"
              >
                Enter Manually
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Health Tips Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <img
              src={healthTipsImage}
              alt="Health tips"
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Today's Health Tips
              </h2>
              <p className="text-muted-foreground">
                Smart nutrition insights for better choices
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {healthTips.map((tip, index) => (
              <Card
                key={index}
                className="border-border/20 hover:shadow-soft transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-primary/10`}>
                      <tip.icon className={`h-5 w-5 ${tip.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {tip.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Button
            onClick={() => navigate("/health-preferences")}
            className="h-16 bg-primary hover:bg-primary-dark text-lg"
          >
            <Settings className="mr-2 h-6 w-6" />
            Health Preferences
          </Button>
          <Button
            onClick={() => navigate("/chat")}
            variant="outline"
            className="h-16 text-lg border-primary text-primary hover:bg-primary hover:text-white"
          >
            <MessageCircle className="mr-2 h-6 w-6" />
            Chat with NutriBot
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Home;
