"use client";

import React from "react"

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

export default function AICallAgentPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        agentName: "",
        agentDescription: "",
        phoneNumber: "",
        phoneCountry: "+1" as const,
        agentVoice: "female" as const,
        agentContext: "",
        primaryColor: "#6366F1",
        widgetTitle: "Call with AI Agent",
        welcomeMessage: "Hi! How can I help you today?",
        isActive: true,
    });

    const updateFormData = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.agentName.trim()) {
            toast.error("Agent name is required");
            return;
        }
        if (!formData.phoneNumber.trim()) {
            toast.error("Phone number is required");
            return;
        }
        if (!formData.agentContext.trim()) {
            toast.error("Agent context is required");
            return;
        }

        try {
            setIsSubmitting(true);
            toast.success("AI Call Agent created successfully!");
        } catch (error) {
            console.error("Error creating agent:", error);
            toast.error("Failed to create agent");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="grid grid-cols-1 gap-8">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Create AI Call Agent
                            </CardTitle>
                            <CardDescription>
                                Set up an intelligent voice agent to handle incoming calls
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
                                                <Label htmlFor="agentName">Agent Name</Label>
                                                <Input
                                                    id="agentName"
                                                    placeholder="My Support Agent"
                                                    value={formData.agentName}
                                                    onChange={(e) =>
                                                        updateFormData("agentName", e.target.value)
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="agentVoice">Voice Gender</Label>
                                                <Select
                                                    value={formData.agentVoice}
                                                    onValueChange={(value) =>
                                                        updateFormData("agentVoice", value)
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="female">Female</SelectItem>
                                                        <SelectItem value="male">Male</SelectItem>
                                                        <SelectItem value="neutral">Neutral</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>


                                        <div className="space-y-2">
                                            <Label htmlFor="agentDescription">Description</Label>
                                            <Textarea
                                                id="agentDescription"
                                                placeholder="Describe your agent and its purpose..."
                                                value={formData.agentDescription}
                                                onChange={(e) =>
                                                    updateFormData("agentDescription", e.target.value)
                                                }
                                                className="min-h-20"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Configuration */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Phone Configuration
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                                <div className="flex gap-2">
                                                    <Select
                                                        value={formData.phoneCountry}
                                                        onValueChange={(value) =>
                                                            updateFormData("phoneCountry", value)
                                                        }
                                                    >
                                                        <SelectTrigger className="w-24">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="+1">+1 US</SelectItem>
                                                            <SelectItem value="+44">+44 UK</SelectItem>
                                                            <SelectItem value="+91">+91 IN</SelectItem>
                                                            <SelectItem value="+61">+61 AU</SelectItem>
                                                            <SelectItem value="+33">+33 FR</SelectItem>
                                                            <SelectItem value="+49">+49 DE</SelectItem>
                                                            <SelectItem value="+86">+86 CN</SelectItem>
                                                            <SelectItem value="+81">+81 JP</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Input
                                                        id="phoneNumber"
                                                        placeholder="(555) 123-4567"
                                                        value={formData.phoneNumber}
                                                        onChange={(e) =>
                                                            updateFormData("phoneNumber", e.target.value)
                                                        }
                                                        className="flex-1"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="widgetTitle">Widget Title</Label>
                                                <Input
                                                    id="widgetTitle"
                                                    placeholder="Call with AI"
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
                                                    placeholder="Hi! How can I help you today?"
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
                                            <Label htmlFor="isActive">Agent Active</Label>
                                        </div>
                                    </div>

                                    {/* Agent Context */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Agent Context
                                        </h3>

                                        <div className="space-y-2">
                                            <Label htmlFor="agentContext">Knowledge Base</Label>
                                            <Textarea
                                                id="agentContext"
                                                placeholder="Describe your business, products, services, FAQs, and any information the agent should know..."
                                                value={formData.agentContext}
                                                onChange={(e) =>
                                                    updateFormData("agentContext", e.target.value)
                                                }
                                                className="min-h-24"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex justify-end space-x-3 pt-6">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.push("/dashboard")}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                        >
                                            {isSubmitting ? "Creating..." : "Create Agent"}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
