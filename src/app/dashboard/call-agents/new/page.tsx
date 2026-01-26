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
import { Search, Phone, CheckCircle, Loader2 } from "lucide-react";

type PhoneNumber = {
    phoneNumber: string;
    friendlyName: string;
    isoCountry: string;
    locality: string;
    region: string;
};

export default function AICallAgentPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Twilio Search State
    const [isSearching, setIsSearching] = useState(false);
    const [availableNumbers, setAvailableNumbers] = useState<PhoneNumber[]>([]);
    const [searchAreaCode, setSearchAreaCode] = useState("");
    const [isBuying, setIsBuying] = useState(false);

    const [formData, setFormData] = useState({
        agentName: "",
        agentDescription: "",
        phoneNumber: "",
        phoneSid: "", // Hidden field for Twilio SID
        phoneCountry: "US" as const, // Changed default to US country code
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

    const handleSearchNumbers = async () => {
        setIsSearching(true);
        try {
            const res = await fetch("/api/twilio/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    areaCode: searchAreaCode,
                    countryCode: formData.phoneCountry
                }),
            });

            if (!res.ok) throw new Error("Failed to search numbers");

            const numbers = await res.json();
            setAvailableNumbers(numbers);
            if (numbers.length === 0) {
                toast.info("No numbers found for this area code.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to search numbers");
        } finally {
            setIsSearching(false);
        }
    };

    const handleBuyNumber = async (number: PhoneNumber) => {
        setIsBuying(true);
        try {
            const res = await fetch("/api/twilio/buy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber: number.phoneNumber }),
            });

            if (!res.ok) throw new Error("Failed to purchase number");

            const data = await res.json();
            updateFormData("phoneNumber", data.phoneNumber);
            updateFormData("phoneSid", data.sid);
            setAvailableNumbers([]); // Clear search results on success
            toast.success(`Successfully purchased ${data.phoneNumber}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to purchase number");
        } finally {
            setIsBuying(false);
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.agentName.trim()) {
            toast.error("Agent name is required");
            return;
        }
        if (!formData.phoneNumber.trim()) {
            toast.error("Please purchase a phone number first");
            return;
        }
        if (!formData.agentContext.trim()) {
            toast.error("Agent context is required");
            return;
        }

        try {
            setIsSubmitting(true);
            // Here you would typically save the agent to your DB
            // await saveAgent(formData);
            toast.success("AI Call Agent created successfully!");
            // router.push("/dashboard/call-agents");
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

                                        <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
                                            {!formData.phoneNumber ? (
                                                <div className="space-y-4">
                                                    <Label>Search and Buy a Number</Label>
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
                                                                <SelectItem value="US">US</SelectItem>
                                                                <SelectItem value="GB">UK</SelectItem>
                                                                <SelectItem value="AU">AU</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <Input
                                                            placeholder="Area Code (e.g. 415)"
                                                            className="w-40"
                                                            value={searchAreaCode}
                                                            onChange={(e) => setSearchAreaCode(e.target.value)}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                            onClick={handleSearchNumbers}
                                                            disabled={isSearching}
                                                        >
                                                            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                                                            Search
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={async () => {
                                                                try {
                                                                    const res = await fetch("/api/twilio/existing");
                                                                    if (!res.ok) throw new Error("No existing number");
                                                                    const data = await res.json();
                                                                    updateFormData("phoneNumber", data.phoneNumber);
                                                                    updateFormData("phoneSid", data.sid);
                                                                    toast.success(`Using existing number: ${data.phoneNumber}`);
                                                                } catch {
                                                                    toast.error("No existing number configured in environment");
                                                                }
                                                            }}
                                                        >
                                                            Use Existing
                                                        </Button>
                                                    </div>

                                                    {availableNumbers.length > 0 && (
                                                        <div className="mt-4 border rounded-md divide-y bg-white">
                                                            {availableNumbers.map((num) => (
                                                                <div key={num.phoneNumber} className="p-3 flex items-center justify-between">
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium">{num.friendlyName}</span>
                                                                        <span className="text-xs text-gray-500">{num.locality}, {num.region}</span>
                                                                    </div>
                                                                    <Button
                                                                        type="button"
                                                                        size="sm"
                                                                        onClick={() => handleBuyNumber(num)}
                                                                        disabled={isBuying}
                                                                    >
                                                                        {isBuying ? "Buying..." : "Buy $1.00"}
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between bg-green-50 p-3 rounded-md border border-green-200">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-green-100 p-2 rounded-full">
                                                            <Phone className="h-5 w-5 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-green-900">Number Acquired</p>
                                                            <p className="text-green-700">{formData.phoneNumber}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            updateFormData("phoneNumber", "");
                                                            updateFormData("phoneSid", "");
                                                        }}
                                                        className="text-green-700 hover:text-green-800 hover:bg-green-100"
                                                    >
                                                        Change
                                                    </Button>
                                                </div>
                                            )}
                                        </div>


                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
