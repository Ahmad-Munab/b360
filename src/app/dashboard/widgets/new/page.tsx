"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Plus,
  X,
  MessageCircle,
  Bug,
  ThumbsUp,
  Send,
  ArrowLeft,
} from "lucide-react";
import { useWidgetsStore } from "@/store/useWidgetsStore";

export default function NewWidgetPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createWidget } = useWidgetsStore();

  const [formData, setFormData] = useState({
    name: "",
    position: "bottom-right" as const,
    primaryColor: "#6366F1",
    productType: "saas" as const,
    productName: "",
    features: [""],
    description: "",
    faqs: [] as Array<{ question: string; answer: string }>,
    widgetTitle: "Need Help?",
    welcomeMessage: "How can we help you today?",
    feedbackQuestion: "",
    enableBugReports: true,
    isActive: true,
  });

  const [previewState, setPreviewState] = useState({
    isOpen: false,
    currentView: "main", // main, chat, feedback, bug
  });

  const updateFormData = (
    field: string,
    value:
      | string
      | boolean
      | Array<{ question: string; answer: string }>
      | Array<string>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    if (formData.features.length < 10) {
      updateFormData("features", [...formData.features, ""]);
    }
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      updateFormData(
        "features",
        formData.features.filter((_, i) => i !== index)
      );
    }
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    updateFormData("features", newFeatures);
  };

  const addFAQ = () => {
    if (formData.faqs.length < 3) {
      updateFormData("faqs", [...formData.faqs, { question: "", answer: "" }]);
    }
  };

  const removeFAQ = (index: number) => {
    updateFormData(
      "faqs",
      formData.faqs.filter((_, i) => i !== index)
    );
  };

  const updateFAQ = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const newFAQs = [...formData.faqs];
    newFAQs[index][field] = value;
    updateFormData("faqs", newFAQs);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("Widget name is required");
      return;
    }
    if (!formData.productName.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (formData.features.filter((f) => f.trim()).length === 0) {
      toast.error("At least one feature is required");
      return;
    }
    if (formData.description.split(" ").length < 20) {
      toast.error("Description must be at least 20 words");
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare data for API
      const widgetData = {
        name: formData.name.trim(),
        position: formData.position,
        primaryColor: formData.primaryColor,
        productType: formData.productType,
        productName: formData.productName.trim(),
        features: formData.features.filter((f) => f.trim()),
        description: formData.description.trim(),
        faqs: formData.faqs,
        widgetTitle: formData.widgetTitle.trim(),
        welcomeMessage: formData.welcomeMessage.trim(),
        feedbackQuestion: formData.feedbackQuestion.trim(),
        enableBugReports: formData.enableBugReports,
        isActive: formData.isActive,
      };

      const widget = await createWidget(widgetData);

      router.push(`/dashboard/widgets/${widget.id}`);
    } catch (error) {
      console.error("Error creating widget:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create widget"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const WidgetPreview = () => {
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

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New Widget
              </CardTitle>
              <CardDescription>
                Build a beautiful support widget for your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit}>
                <div className="space-y-6">
                  {/* Basic Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Basic Settings
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Widget Name</Label>
                        <Input
                          id="name"
                          placeholder="My Support Widget"
                          value={formData.name}
                          onChange={(e) =>
                            updateFormData("name", e.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Select
                          value={formData.position}
                          onValueChange={(value) =>
                            updateFormData("position", value)
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={formData.primaryColor}
                          onChange={(e) =>
                            updateFormData("primaryColor", e.target.value)
                          }
                          className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer"
                        />
                        <Input
                          value={formData.primaryColor}
                          onChange={(e) =>
                            updateFormData("primaryColor", e.target.value)
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Product Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="productType">Product Type</Label>
                        <Select
                          value={formData.productType}
                          onValueChange={(value) =>
                            updateFormData("productType", value)
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

                      <div className="space-y-2">
                        <Label htmlFor="productName">Product Name</Label>
                        <Input
                          id="productName"
                          placeholder="Your Amazing Product"
                          value={formData.productName}
                          onChange={(e) =>
                            updateFormData("productName", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Features</Label>
                      {formData.features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder={`Feature ${index + 1}`}
                            value={feature}
                            onChange={(e) =>
                              updateFeature(index, e.target.value)
                            }
                            required
                          />
                          {formData.features.length > 1 && (
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
                      {formData.features.length < 10 && (
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your product in at least 20 words..."
                        value={formData.description}
                        onChange={(e) =>
                          updateFormData("description", e.target.value)
                        }
                        className="min-h-20"
                        required
                      />
                      <p className="text-sm text-gray-500">
                        {
                          formData.description
                            .trim()
                            .split(/\s+/)
                            .filter(Boolean).length
                        }
                        /20 words minimum
                      </p>
                    </div>
                  </div>

                  {/* FAQ Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        FAQ (Optional)
                      </h3>
                      <span className="text-sm text-gray-500">
                        Up to 3 questions
                      </span>
                    </div>

                    {formData.faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-xl space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <Label>Question {index + 1}</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFAQ(index)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                        <Input
                          placeholder="Enter your question"
                          value={faq.question}
                          onChange={(e) =>
                            updateFAQ(index, "question", e.target.value)
                          }
                        />
                        <Textarea
                          placeholder="Enter the answer"
                          value={faq.answer}
                          onChange={(e) =>
                            updateFAQ(index, "answer", e.target.value)
                          }
                          className="min-h-16"
                        />
                      </div>
                    ))}

                    {formData.faqs.length < 3 && (
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
                  </div>

                  {/* Widget Configuration */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Widget Configuration
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="widgetTitle">Widget Title</Label>
                        <Input
                          id="widgetTitle"
                          placeholder="Need Help?"
                          value={formData.widgetTitle}
                          onChange={(e) =>
                            updateFormData("widgetTitle", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="welcomeMessage">Welcome Message</Label>
                        <Input
                          id="welcomeMessage"
                          placeholder="How can we help you today?"
                          value={formData.welcomeMessage}
                          onChange={(e) =>
                            updateFormData("welcomeMessage", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="feedbackQuestion">
                        Feedback Question (Optional)
                      </Label>
                      <Input
                        id="feedbackQuestion"
                        placeholder="How was your experience?"
                        value={formData.feedbackQuestion}
                        onChange={(e) =>
                          updateFormData("feedbackQuestion", e.target.value)
                        }
                      />
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enableBugReports"
                          checked={formData.enableBugReports}
                          onCheckedChange={(checked) =>
                            updateFormData("enableBugReports", checked)
                          }
                        />
                        <Label htmlFor="enableBugReports">
                          Enable Bug Reports
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isActive"
                          checked={formData.isActive}
                          onCheckedChange={(checked) =>
                            updateFormData("isActive", checked)
                          }
                        />
                        <Label htmlFor="isActive">Widget Active</Label>
                      </div>
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
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isSubmitting ? "Creating..." : "Create Widget"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="xl:sticky xl:top-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                Live Preview
              </CardTitle>
              <CardDescription>
                See how your widget will look on your website
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
