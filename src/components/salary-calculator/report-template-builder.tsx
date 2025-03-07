import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus, Trash2, FileText, MoveVertical } from "lucide-react";

interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: "text" | "number" | "date" | "checkbox" | "section";
  required: boolean;
  order: number;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  fields: TemplateField[];
  createdAt: string;
}

interface ReportTemplateBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (template: ReportTemplate) => void;
  initialTemplate?: ReportTemplate;
}

export function ReportTemplateBuilder({
  open,
  onOpenChange,
  onSave,
  initialTemplate,
}: ReportTemplateBuilderProps) {
  const [template, setTemplate] = useState<ReportTemplate>(
    initialTemplate || {
      id: Date.now().toString(),
      name: "",
      description: "",
      fields: [],
      createdAt: new Date().toISOString(),
    },
  );

  const [newField, setNewField] = useState<Partial<TemplateField>>({
    name: "",
    label: "",
    type: "text",
    required: false,
  });

  const handleAddField = () => {
    if (!newField.name || !newField.label) return;

    const field: TemplateField = {
      id: Date.now().toString(),
      name: newField.name,
      label: newField.label,
      type: newField.type as
        | "text"
        | "number"
        | "date"
        | "checkbox"
        | "section",
      required: newField.required || false,
      order: template.fields.length,
    };

    setTemplate({
      ...template,
      fields: [...template.fields, field],
    });

    setNewField({
      name: "",
      label: "",
      type: "text",
      required: false,
    });
  };

  const handleRemoveField = (id: string) => {
    setTemplate({
      ...template,
      fields: template.fields.filter((field) => field.id !== id),
    });
  };

  const handleMoveField = (id: string, direction: "up" | "down") => {
    const fieldIndex = template.fields.findIndex((field) => field.id === id);
    if (fieldIndex === -1) return;

    const newFields = [...template.fields];
    const field = newFields[fieldIndex];

    if (direction === "up" && fieldIndex > 0) {
      newFields[fieldIndex] = newFields[fieldIndex - 1];
      newFields[fieldIndex - 1] = field;
    } else if (direction === "down" && fieldIndex < newFields.length - 1) {
      newFields[fieldIndex] = newFields[fieldIndex + 1];
      newFields[fieldIndex + 1] = field;
    }

    // Update order
    newFields.forEach((field, index) => {
      field.order = index;
    });

    setTemplate({
      ...template,
      fields: newFields,
    });
  };

  const handleSave = () => {
    if (!template.name) return;

    onSave(template);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>إنشاء قالب تقرير جديد</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>اسم القالب</Label>
              <Input
                value={template.name}
                onChange={(e) =>
                  setTemplate({ ...template, name: e.target.value })
                }
                className="text-right"
                placeholder="مثال: تقرير الرواتب الشهري"
              />
            </div>

            <div className="space-y-2">
              <Label>وصف القالب</Label>
              <Textarea
                value={template.description}
                onChange={(e) =>
                  setTemplate({ ...template, description: e.target.value })
                }
                className="text-right"
                placeholder="وصف مختصر للقالب والغرض منه"
              />
            </div>

            <div className="border p-4 rounded-md space-y-4">
              <h3 className="font-medium">إضافة حقل جديد</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اسم الحقل (بالإنجليزية)</Label>
                  <Input
                    value={newField.name}
                    onChange={(e) =>
                      setNewField({ ...newField, name: e.target.value })
                    }
                    className="text-right"
                    placeholder="employee_name"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label>عنوان الحقل (بالعربية)</Label>
                  <Input
                    value={newField.label}
                    onChange={(e) =>
                      setNewField({ ...newField, label: e.target.value })
                    }
                    className="text-right"
                    placeholder="اسم الموظف"
                  />
                </div>

                <div className="space-y-2">
                  <Label>نوع الحقل</Label>
                  <select
                    value={newField.type}
                    onChange={(e) =>
                      setNewField({
                        ...newField,
                        type: e.target.value as any,
                      })
                    }
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="text">نص</option>
                    <option value="number">رقم</option>
                    <option value="date">تاريخ</option>
                    <option value="checkbox">خانة اختيار</option>
                    <option value="section">قسم</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox
                    id="required"
                    checked={newField.required}
                    onCheckedChange={(checked) =>
                      setNewField({
                        ...newField,
                        required: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="required" className="mr-2">
                    حقل مطلوب
                  </Label>
                </div>
              </div>

              <Button
                onClick={handleAddField}
                disabled={!newField.name || !newField.label}
              >
                <Plus className="ml-2 h-4 w-4" />
                إضافة الحقل
              </Button>
            </div>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-4">معاينة القالب</h3>

            {template.fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-md">
                <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  أضف حقولاً لمعاينة القالب
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {template.fields
                  .sort((a, b) => a.order - b.order)
                  .map((field) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveField(field.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <div className="flex flex-col gap-1">
                          <MoveVertical
                            className="h-4 w-4 cursor-pointer text-muted-foreground"
                            onClick={() => {
                              // Toggle between up and down
                              handleMoveField(
                                field.id,
                                field.order === 0 ? "down" : "up",
                              );
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex-1 mx-4">
                        <p className="font-medium">{field.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {field.name} ({field.type})
                          {field.required && " - مطلوب"}
                        </p>
                      </div>

                      {field.type === "text" && (
                        <Input className="w-32 text-right" disabled />
                      )}
                      {field.type === "number" && (
                        <Input
                          type="number"
                          className="w-32 text-right"
                          disabled
                        />
                      )}
                      {field.type === "date" && (
                        <Input
                          type="date"
                          className="w-32 text-right"
                          disabled
                        />
                      )}
                      {field.type === "checkbox" && <Checkbox disabled />}
                      {field.type === "section" && (
                        <div className="w-32 h-px bg-muted" />
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSave} disabled={!template.name}>
            <Save className="ml-2 h-4 w-4" />
            حفظ القالب
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
