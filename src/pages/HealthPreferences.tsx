import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ShieldAlert, Heart, Leaf, Save } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { useUserPreferences } from "@/lib/context";

const HealthPreferences = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [allergens, setAllergens] = useState<string[]>([]);
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);

  const allergenOptions = [
    "Peanuts", "Tree Nuts", "Milk", "Eggs", "Fish", "Shellfish",
    "Soy", "Wheat/Gluten", "Sesame", "Sulfites"
  ];

  const medicalOptions = [
    "Diabetes", "High Blood Pressure", "Heart Disease", "High Cholesterol",
    "Kidney Disease", "Liver Disease", "Celiac Disease", "Lactose Intolerance",
    "Food Allergies", "GERD/Acid Reflux"
  ];

  const dietaryOptions = [
    "Vegetarian", "Vegan", "Keto", "Paleo", "Mediterranean",
    "Low Carb", "Low Fat", "Low Sodium", "High Protein", "Organic Only",
    "Non-GMO", "Halal", "Kosher", "Raw Food"
  ];

  const handleCheckboxChange = (
    value: string,
    currentList: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (currentList.includes(value)) {
      setter(currentList.filter(item => item !== value));
    } else {
      setter([...currentList, value]);
    }
  };

  const { setContextAllergens, setContextDietaryPreferences, setContextMedicalConditions } = useUserPreferences();

  const handleSubmit = () => {
    setContextAllergens(allergens);
    setContextDietaryPreferences(dietaryPreferences);
    setContextMedicalConditions(medicalConditions);
    toast({
      title: "Preferences Saved!",
      description: "Your health preferences have been updated successfully.",
    });

    // Navigate to chat page
    navigate("/chat");
  };

  const CheckboxSection = ({
    title,
    description,
    icon: Icon,
    options,
    selectedValues,
    onChange,
    iconColor
  }: {
    title: string;
    description: string;
    icon: any;
    options: string[];
    selectedValues: string[];
    onChange: (value: string) => void;
    iconColor: string;
  }) => (
    <Card className="border-border/20">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-primary/10`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${title}-${option}`}
                checked={selectedValues.includes(option)}
                onCheckedChange={() => onChange(option)}
              />
              <label
                htmlFor={`${title}-${option}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Health Preferences</h1>
            <p className="text-muted-foreground text-lg">
              Help us personalize your nutrition recommendations
            </p>
          </div>

          <div className="space-y-8">
            {/* Allergen Categories */}
            <CheckboxSection
              title="Allergen Categories"
              description="Select allergens you need to avoid for safety"
              icon={ShieldAlert}
              iconColor="text-destructive"
              options={allergenOptions}
              selectedValues={allergens}
              onChange={(value) => handleCheckboxChange(value, allergens, setAllergens)}
            />

            <Separator />

            {/* Medical Conditions */}
            <CheckboxSection
              title="Medical Conditions"
              description="Select any medical conditions that affect your diet"
              icon={Heart}
              iconColor="text-info"
              options={medicalOptions}
              selectedValues={medicalConditions}
              onChange={(value) => handleCheckboxChange(value, medicalConditions, setMedicalConditions)}
            />

            <Separator />

            {/* Lifestyle Dietary Preferences */}
            <CheckboxSection
              title="Lifestyle & Dietary Preferences"
              description="Choose your dietary lifestyle and preferences"
              icon={Leaf}
              iconColor="text-success"
              options={dietaryOptions}
              selectedValues={dietaryPreferences}
              onChange={(value) => handleCheckboxChange(value, dietaryPreferences, setDietaryPreferences)}
            />

            {/* Summary */}
            {(allergens.length > 0 || medicalConditions.length > 0 || dietaryPreferences.length > 0) && (
              <Card className="bg-muted/50 border-border/20">
                <CardHeader>
                  <CardTitle className="text-lg">Selected Preferences Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {allergens.length > 0 && (
                    <div>
                      <h4 className="font-medium text-destructive mb-2">Allergens to Avoid:</h4>
                      <p className="text-sm text-muted-foreground">{allergens.join(", ")}</p>
                    </div>
                  )}
                  {medicalConditions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-info mb-2">Medical Considerations:</h4>
                      <p className="text-sm text-muted-foreground">{medicalConditions.join(", ")}</p>
                    </div>
                  )}
                  {dietaryPreferences.length > 0 && (
                    <div>
                      <h4 className="font-medium text-success mb-2">Dietary Preferences:</h4>
                      <p className="text-sm text-muted-foreground">{dietaryPreferences.join(", ")}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <Button
                onClick={handleSubmit}
                size="lg"
                className="bg-primary hover:bg-primary-dark px-8"
              >
                <Save className="mr-2 h-5 w-5" />
                Save Preferences & Continue
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HealthPreferences;