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
import { MessageCircle, Send, X } from "lucide-react";
import { useWidgetsStore } from "@/store/useWidgetsStore";
import { IconSelector } from "@/components/dashboard/IconSelector";

export default function NewWidgetPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createWidget } = useWidgetsStore();

  const [formData, setFormData] = useState({
    name: "",
    position: "bottom-right" as const,
    primaryColor: "#6366F1",
    productName: "",
    description: "",
    widgetTitle: "Chat with us",
    welcomeMessage: "Hi! How can I help you today?",
    isActive: true,
    iconType: "default" as const,
    iconEmoji: "",
    customIcon: "",
  });

  const [previewState, setPreviewState] = useState({
    isOpen: false,
  });

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare data for API
      const widgetData = {
        name: formData.name.trim(),
        position: formData.position,
        primaryColor: formData.primaryColor,
        productName: formData.productName.trim(),
        description: formData.description.trim(),
        widgetTitle: formData.widgetTitle.trim(),
        welcomeMessage: formData.welcomeMessage.trim(),
        isActive: formData.isActive,
        iconType: formData.iconType,
        iconEmoji: formData.iconEmoji,
        customIcon: formData.customIcon,
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
    const renderChatView = () => (
      <>
        <div
          className="px-6 py-5 text-white rounded-t-2xl flex items-center gap-3"
          style={{ backgroundColor: formData.primaryColor }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-lg"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
          >
            {(formData.productName || "B").charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {formData.productName || "Your Product"}
            </h3>
            <p className="text-white/90 text-sm">{formData.widgetTitle}</p>
          </div>
          <button
            onClick={() =>
              setPreviewState((prev) => ({ ...prev, isOpen: false }))
            }
            className="ml-auto text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-4 bg-gray-50 min-h-[300px]">
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600 text-lg font-medium mb-2">
                {formData.welcomeMessage || "Hi! How can I help you today?"}
              </p>
              <p className="text-gray-500 text-sm">
                Ask me anything about {formData.productName || "our product"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              style={{ "--tw-ring-color": formData.primaryColor + "33" } as any}
            />
            <button
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg"
              style={{ backgroundColor: formData.primaryColor }}
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
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
            className="w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
            style={{ backgroundColor: formData.primaryColor }}
          >
            <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>

        {/* Widget Popup */}
        {previewState.isOpen && (
          <div
            className={`absolute ${
              formData.position.includes("right") ? "right-4" : "left-4"
            } ${
              formData.position.includes("bottom") ? "bottom-24" : "top-24"
            } w-96 h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100`}
          >
            <div className="flex flex-col h-full">{renderChatView()}</div>
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

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your product or service..."
                        value={formData.description}
                        onChange={(e) =>
                          updateFormData("description", e.target.value)
                        }
                        className="min-h-20"
                        required
                      />
                    </div>
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

                  {/* Widget Icon */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Widget Icon
                    </h3>
                    <IconSelector
                      iconType={formData.iconType}
                      iconEmoji={formData.iconEmoji}
                      customIcon={formData.customIcon}
                      onIconTypeChange={(type) => updateFormData("iconType", type)}
                      onEmojiChange={(emoji) => updateFormData("iconEmoji", emoji)}
                      onCustomIconChange={(url) => updateFormData("customIcon", url)}
                    />
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
