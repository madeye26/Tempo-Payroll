import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface Step {
  title: string;
  description?: string;
  component: React.ReactNode;
  validate?: () => boolean | Promise<boolean>;
}

interface MultiStepFormProps {
  steps: Step[];
  onComplete: (data: any) => void;
  initialData?: any;
  className?: string;
}

export function MultiStepForm({
  steps,
  onComplete,
  initialData = {},
  className = "",
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [direction, setDirection] = useState(0); // -1 for backward, 1 for forward
  const [isValidating, setIsValidating] = useState(false);

  const updateFormData = (newData: any) => {
    setFormData((prev: any) => ({ ...prev, ...newData }));
  };

  const handleNext = async () => {
    const currentStepObj = steps[currentStep];

    if (currentStepObj.validate) {
      setIsValidating(true);
      try {
        const isValid = await currentStepObj.validate();
        if (!isValid) return;
      } catch (error) {
        console.error("Validation error:", error);
        return;
      } finally {
        setIsValidating(false);
      }
    }

    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      setDirection(-1);
    } else if (stepIndex > currentStep) {
      setDirection(1);
    }
    setCurrentStep(stepIndex);
  };

  return (
    <div className={`space-y-6 ${className}`} dir="rtl">
      {/* Step indicators */}
      <div className="flex justify-between items-center mb-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
            onClick={() => index < currentStep && goToStep(index)}
          >
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center 
                transition-colors duration-300 cursor-pointer
                ${
                  index < currentStep
                    ? "bg-primary text-primary-foreground"
                    : index === currentStep
                      ? "bg-primary/20 text-primary border-2 border-primary"
                      : "bg-muted text-muted-foreground"
                }
              `}
            >
              {index < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span
              className={`text-sm mt-2 ${index === currentStep ? "font-medium" : "text-muted-foreground"}`}
            >
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className="w-full h-1 bg-muted mt-2" />
            )}
          </div>
        ))}
      </div>

      {/* Current step */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{steps[currentStep].title}</h2>
          {steps[currentStep].description && (
            <p className="text-muted-foreground mt-1">
              {steps[currentStep].description}
            </p>
          )}
        </div>

        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            initial={{ x: direction * 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {React.cloneElement(
              steps[currentStep].component as React.ReactElement,
              {
                formData,
                updateFormData,
              },
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0 || isValidating}
          >
            <ChevronRight className="ml-2 h-4 w-4" />
            السابق
          </Button>
          <Button onClick={handleNext} disabled={isValidating}>
            {currentStep === steps.length - 1 ? "إنهاء" : "التالي"}
            {currentStep < steps.length - 1 && (
              <ChevronLeft className="mr-2 h-4 w-4" />
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
