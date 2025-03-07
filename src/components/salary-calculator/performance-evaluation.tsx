import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Save } from "lucide-react";

interface PerformanceCriteria {
  id: string;
  name: string;
  description: string;
  rating: number;
  comments: string;
}

interface PerformanceEvaluationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string;
  employeeName: string;
  onSave: (data: {
    employeeId: string;
    criteria: PerformanceCriteria[];
    overallRating: number;
    overallComments: string;
  }) => void;
}

export function PerformanceEvaluation({
  open,
  onOpenChange,
  employeeId,
  employeeName,
  onSave,
}: PerformanceEvaluationProps) {
  const [criteria, setCriteria] = useState<PerformanceCriteria[]>([
    {
      id: "1",
      name: "جودة العمل",
      description: "دقة وجودة العمل المنجز",
      rating: 0,
      comments: "",
    },
    {
      id: "2",
      name: "الإنتاجية",
      description: "كمية العمل المنجز في الوقت المحدد",
      rating: 0,
      comments: "",
    },
    {
      id: "3",
      name: "المبادرة",
      description: "القدرة على اتخاذ المبادرة وحل المشكلات",
      rating: 0,
      comments: "",
    },
    {
      id: "4",
      name: "العمل الجماعي",
      description: "القدرة على العمل ضمن فريق",
      rating: 0,
      comments: "",
    },
    {
      id: "5",
      name: "الالتزام",
      description: "الالتزام بمواعيد العمل والحضور",
      rating: 0,
      comments: "",
    },
  ]);

  const [overallComments, setOverallComments] = useState("");

  const handleRatingChange = (id: string, rating: number) => {
    setCriteria(
      criteria.map((criterion) =>
        criterion.id === id ? { ...criterion, rating } : criterion,
      ),
    );
  };

  const handleCommentsChange = (id: string, comments: string) => {
    setCriteria(
      criteria.map((criterion) =>
        criterion.id === id ? { ...criterion, comments } : criterion,
      ),
    );
  };

  const calculateOverallRating = () => {
    const totalRating = criteria.reduce(
      (sum, criterion) => sum + criterion.rating,
      0,
    );
    return totalRating / criteria.length;
  };

  const handleSave = () => {
    onSave({
      employeeId,
      criteria,
      overallRating: calculateOverallRating(),
      overallComments,
    });
    onOpenChange(false);
  };

  const renderRatingStars = (criterionId: string, currentRating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => handleRatingChange(criterionId, rating)}
            className={`w-8 h-8 rounded-full ${currentRating >= rating ? "bg-yellow-400" : "bg-gray-200"}`}
            aria-label={`Rate ${rating} stars`}
          >
            {rating}
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>تقييم أداء الموظف: {employeeName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {criteria.map((criterion) => (
            <div key={criterion.id} className="space-y-2 border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{criterion.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {criterion.description}
                  </p>
                </div>
                {renderRatingStars(criterion.id, criterion.rating)}
              </div>
              <div className="space-y-1">
                <Label>ملاحظات</Label>
                <Textarea
                  value={criterion.comments}
                  onChange={(e) =>
                    handleCommentsChange(criterion.id, e.target.value)
                  }
                  className="text-right"
                  placeholder="أضف ملاحظاتك هنا..."
                />
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <Label>ملاحظات عامة</Label>
            <Textarea
              value={overallComments}
              onChange={(e) => setOverallComments(e.target.value)}
              className="text-right"
              placeholder="أضف ملاحظات عامة حول أداء الموظف..."
            />
          </div>

          <div className="bg-muted p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">التقييم العام:</span>
              <span className="font-bold text-lg">
                {calculateOverallRating().toFixed(1)} / 5
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSave}>
            <Save className="ml-2 h-4 w-4" />
            حفظ التقييم
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
