"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useWidgetsStore } from "@/store/useWidgetsStore";
import {
  widgetFormSchema,
  type WidgetFormValues,
} from "@/lib/validations/widget";
import {
  Plus,
  X,
  MessageCircle,
  Bug,
  ThumbsUp,
  Send,
  ArrowLeft,
} from "lucide-react";

export default function EditWidgetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { widgets, isLoading, fetchWidgets, updateWidget } = useWidgetsStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [widgetId, setWidgetId] = useState<string>("");
  const [previewState, setPreviewState] = useState({
    isOpen: false,
    currentView: "main", // main, chat, feedback, bug
  });

  const form = useForm<WidgetFormValues>({
    resolver: zodResolver(widgetFormSchema),
    defaultValues: {
      name: "",
      position: "bottom-right",
      primaryColor: "#6366F1",
      productType: "saas",
      productName: "",
      features: [""],
      description: "",
      faqs: [],
      widgetTitle: "Need Help?",
      welcomeMessage: "How can we help you today?",
      feedbackQuestion: "",
      enableBugReports: true,
      isActive: true,
    },
  });

  useEffect(() => {
    fetchWidgets();
  }, [fetchWidgets]);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setWidgetId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (widgetId && widgets.length > 0) {
      const widget = widgets.find((w) => w.id === widgetId);
      if (widget) {
        form.reset({
          name: widget.name,
          position: widget.position,
          primaryColor: widget.primaryColor,
          productType: widget.productType,
          productName: widget.productName,
          features: widget.features,
          description: widget.description,
          faqs: widget.faqs,
          widgetTitle: widget.widgetTitle,
          welcomeMessage: widget.welcomeMessage,
          feedbackQuestion: widget.feedbackQuestion,
          enableBugReports: widget.enableBugReports,
          isActive: widget.isActive,
        });
      }
    }
  }, [widgets, widgetId, form]);

  const onSubmit = async (data: WidgetFormValues) => {
    if (!widgetId) return;
    try {
      setIsSubmitting(true);
      await updateWidget(widgetId, data);
      toast.success("Widget updated successfully");
      router.push("/dashboard/widgets");
    } catch (_error) {
      toast.error("Failed to update widget");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFeature = () => {
    const currentFeatures = form.getValues("features");
    if (currentFeatures.length < 10) {
      form.setValue("features", [...currentFeatures, ""]);
    }
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues("features");
    if (currentFeatures.length > 1) {
      form.setValue(
        "features",
        currentFeatures.filter((_, i) => i !== index)
      );
    }
  };

  const updateFeature = (index: number, value: string) => {
    const currentFeatures = form.getValues("features");
    const newFeatures = [...currentFeatures];
    newFeatures[index] = value;
    form.setValue("features", newFeatures);
  };

  const addFAQ = () => {
    const currentFAQs = form.getValues("faqs");
    if (currentFAQs.length < 3) {
      form.setValue("faqs", [...currentFAQs, { question: "", answer: "" }]);
    }
  };

  const removeFAQ = (index: number) => {
    const currentFAQs = form.getValues("faqs");
    form.setValue(
      "faqs",
      currentFAQs.filter((_, i) => i !== index)
    );
  };

  const updateFAQ = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const currentFAQs = form.getValues("faqs");
    const newFAQs = [...currentFAQs];
    newFAQs[index][field] = value;
    form.setValue("faqs", newFAQs);
  };

  const WidgetPreview = () => {
    const formData = form.watch();

    const getAvailableOptions = () => {
      const options = [];
      options.push({
        icon: MessageCircle,
        label: "Talk to Agent",
        action: "chat",
      });
      if (formData.feedbackQuestion) {
        options.push({
          icon: ThumbsUp,
          label: "Give Feedback",
          action: "feedback",
        });
      }
      if (formData.enableBugReports) {
        options.push({ icon: Bug, label: "Report Bug", action: "bug" });
      }
      return options;
    };

    const renderMainView = () => (
      <>
        <div
          className="px-6 py-5 text-white rounded-t-2xl"
          style={{ backgroundColor: formData.primaryColor }}
        >
          <h3 className="font-semibold text-lg mb-1">
            {formData.productName || "Your Product"}
          </h3>
          <p className="text-sm opacity-90">
            {formData.welcomeMessage || "How can we help you today?"}
          </p>
        </div>

        <div className="p-6 space-y-3">
          {getAvailableOptions().map((option) => (
            <button
              key={option.action}
              onClick={() =>
                setPreviewState((prev) => ({
                  ...prev,
                  currentView: option.action,
                }))
              }
              className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
            >
              <div
                className="p-2 rounded-lg text-white"
                style={{ backgroundColor: formData.primaryColor }}
              >
                <option.icon size={20} />
              </div>
              <div>
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-500">
                  {option.action === "chat" &&
                    "Start a conversation with our AI assistant"}
                  {option.action === "feedback" &&
                    "Share your thoughts about our product"}
                  {option.action === "bug" &&
                    "Report any issues you encountered"}
                </div>
              </div>
            </button>
          ))}
        </div>
      </>
    );

    const renderChatView = () => (
      <>
        <div
          className="px-6 py-4 text-white rounded-t-2xl flex items-center gap-3"
          style={{ backgroundColor: formData.primaryColor }}
        >
          <button
            onClick={() =>
              setPreviewState((prev) => ({ ...prev, currentView: "main" }))
            }
            className="p-1 hover:bg-white/20 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <h3 className="font-semibold">Chat with Agent</h3>
        </div>

        <div className="flex-1 p-6 space-y-3 min-h-[200px]">
          <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-sm max-w-[80%]">
            <p className="text-sm text-gray-800">
              {formData.welcomeMessage || "How can we help you today?"}
            </p>
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-opacity-50"
            />
            <button
              className="p-2 rounded-full text-white"
              style={{ backgroundColor: formData.primaryColor }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </>
    );

    const renderFeedbackView = () => (
      <>
        <div
          className="px-6 py-4 text-white rounded-t-2xl flex items-center gap-3"
          style={{ backgroundColor: formData.primaryColor }}
        >
          <button
            onClick={() =>
              setPreviewState((prev) => ({ ...prev, currentView: "main" }))
            }
            className="p-1 hover:bg-white/20 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <h3 className="font-semibold">Give Feedback</h3>
        </div>

        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {formData.feedbackQuestion || "How was your experience?"}
          </label>
          <textarea
            placeholder="Please share your feedback..."
            className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-opacity-50"
            rows={4}
          />
          <button
            className="w-full mt-4 py-3 text-white font-medium rounded-xl"
            style={{ backgroundColor: formData.primaryColor }}
          >
            Submit Feedback
          </button>
        </div>
      </>
    );

    const renderBugView = () => (
      <>
        <div
          className="px-6 py-4 text-white rounded-t-2xl flex items-center gap-3"
          style={{ backgroundColor: formData.primaryColor }}
        >
          <button
            onClick={() =>
              setPreviewState((prev) => ({ ...prev, currentView: "main" }))
            }
            className="p-1 hover:bg-white/20 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <h3 className="font-semibold">Report Bug</h3>
        </div>

        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Describe the issue you encountered
          </label>
          <textarea
            placeholder="Please describe the bug in detail..."
            className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-opacity-50"
            rows={4}
          />
          <button
            className="w-full mt-4 py-3 text-white font-medium rounded-xl"
            style={{ backgroundColor: formData.primaryColor }}
          >
            Submit Bug Report
          </button>
        </div>
      </>
    );

    return (
      <div className="relative h-[500px] bg-gray-50 rounded-xl overflow-hidden">
        {/* Widget Button */}
        <div
          className={`absolute ${
            formData.position.includes("right") ? "right-4" : "left-4"
          } ${formData.position.includes("bottom") ? "bottom-4" : "top-4"}`}
        >
          <button
            onClick={() =>
              setPreviewState((prev) => ({ ...prev, isOpen: !prev.isOpen }))
            }
            className="px-4 py-3 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            style={{ backgroundColor: formData.primaryColor }}
          >
            <MessageCircle size={18} />
            {formData.widgetTitle || "Need Help?"}
          </button>
        </div>

        {/* Widget Popup */}
        {previewState.isOpen && (
          <div
            className={`absolute ${
              formData.position.includes("right") ? "right-4" : "left-4"
            } ${
              formData.position.includes("bottom") ? "bottom-20" : "top-20"
            } w-80 bg-white rounded-2xl shadow-2xl overflow-hidden`}
          >
            <div className="flex flex-col h-full max-h-[400px]">
              {previewState.currentView === "main" && renderMainView()}
              {previewState.currentView === "chat" && renderChatView()}
              {previewState.currentView === "feedback" && renderFeedbackView()}
              {previewState.currentView === "bug" && renderBugView()}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Edit Widget</CardTitle>
              <CardDescription>
                Update your widget configuration and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Basic Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Settings</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Widget Name</Label>
                      <Input
                        id="name"
                        {...form.register("name")}
                        placeholder="My Support Widget"
                      />
                      {form.formState.errors.name && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        {...form.register("productName")}
                        placeholder="Your Product Name"
                      />
                      {form.formState.errors.productName && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.productName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        {...form.register("description")}
                        placeholder="Describe your product or service..."
                        rows={3}
                      />
                      {form.formState.errors.description && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Appearance Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Appearance</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Select
                        value={form.watch("position")}
                        onValueChange={(value) =>
                          form.setValue(
                            "position",
                            value as
                              | "bottom-right"
                              | "bottom-left"
                              | "top-right"
                              | "top-left"
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bottom-right">
                            Bottom Right
                          </SelectItem>
                          <SelectItem value="bottom-left">
                            Bottom Left
                          </SelectItem>
                          <SelectItem value="top-right">Top Right</SelectItem>
                          <SelectItem value="top-left">Top Left</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <Input
                        id="primaryColor"
                        type="color"
                        {...form.register("primaryColor")}
                        className="h-10"
                      />
                      {form.formState.errors.primaryColor && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.primaryColor.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productType">Product Type</Label>
                    <Select
                      value={form.watch("productType")}
                      onValueChange={(value) =>
                        form.setValue(
                          "productType",
                          value as "saas" | "portfolio"
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="portfolio">Portfolio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Features</h3>
                  <div className="space-y-2">
                    <Label>Product Features</Label>
                    {form.watch("features").map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Feature ${index + 1}`}
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                        />
                        {form.watch("features").length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeFeature(index)}
                          >
                            <X size={16} />
                          </Button>
                        )}
                      </div>
                    ))}
                    {form.watch("features").length < 10 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addFeature}
                        className="w-full"
                      >
                        <Plus size={16} className="mr-2" />
                        Add Feature
                      </Button>
                    )}
                    {form.formState.errors.features && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.features.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Widget Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Widget Configuration
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="widgetTitle">Widget Title</Label>
                      <Input
                        id="widgetTitle"
                        {...form.register("widgetTitle")}
                        placeholder="Need Help?"
                      />
                      {form.formState.errors.widgetTitle && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.widgetTitle.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="welcomeMessage">Welcome Message</Label>
                      <Textarea
                        id="welcomeMessage"
                        {...form.register("welcomeMessage")}
                        placeholder="How can we help you today?"
                        rows={2}
                      />
                      {form.formState.errors.welcomeMessage && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.welcomeMessage.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="feedbackQuestion">
                        Feedback Question (Optional)
                      </Label>
                      <Input
                        id="feedbackQuestion"
                        {...form.register("feedbackQuestion")}
                        placeholder="How was your experience?"
                      />
                      {form.formState.errors.feedbackQuestion && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.feedbackQuestion.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="enableBugReports"
                        {...form.register("enableBugReports")}
                        className="rounded"
                      />
                      <Label htmlFor="enableBugReports">
                        Enable Bug Reports
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        {...form.register("isActive")}
                        className="rounded"
                      />
                      <Label htmlFor="isActive">Widget Active</Label>
                    </div>
                  </div>
                </div>

                {/* FAQs */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">FAQs (Optional)</h3>
                  <div className="space-y-4">
                    {form.watch("faqs").map((faq, index) => (
                      <div
                        key={index}
                        className="space-y-2 p-4 border rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <Label>FAQ {index + 1}</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFAQ(index)}
                          >
                            <X size={14} />
                          </Button>
                        </div>
                        <Input
                          placeholder="Question"
                          value={faq.question}
                          onChange={(e) =>
                            updateFAQ(index, "question", e.target.value)
                          }
                        />
                        <Textarea
                          placeholder="Answer"
                          value={faq.answer}
                          onChange={(e) =>
                            updateFAQ(index, "answer", e.target.value)
                          }
                          rows={2}
                        />
                      </div>
                    ))}
                    {form.watch("faqs").length < 3 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addFAQ}
                        className="w-full"
                      >
                        <Plus size={16} className="mr-2" />
                        Add FAQ
                      </Button>
                    )}
                    {form.formState.errors.faqs && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.faqs.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard/widgets")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                See how your widget will look to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WidgetPreview />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
