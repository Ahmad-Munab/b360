import { useState } from "react";
import { motion } from "framer-motion";
import { WidgetFormValues } from "@/lib/validations/widget";

interface WidgetConfigProps {
  onSave: (config: WidgetFormValues) => void;
  initialConfig?: WidgetFormValues;
}

export const WidgetConfig = ({ onSave, initialConfig }: WidgetConfigProps) => {
  const [config, setConfig] = useState<WidgetFormValues>(
    initialConfig || {
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
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Widget Configuration</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Position</label>
          <select
            value={config.position}
            onChange={(e) =>
              setConfig({
                ...config,
                position: e.target.value as WidgetFormValues["position"],
              })
            }
            className="w-full p-2 border rounded-lg"
          >
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="top-right">Top Right</option>
            <option value="top-left">Top Left</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Primary Color
          </label>
          <input
            type="color"
            value={config.primaryColor}
            onChange={(e) =>
              setConfig({ ...config, primaryColor: e.target.value })
            }
            className="w-full h-10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Product Type</label>
          <select
            value={config.productType}
            onChange={(e) =>
              setConfig({
                ...config,
                productType: e.target.value as "saas" | "portfolio",
              })
            }
            className="w-full p-2 border rounded-lg"
          >
            <option value="saas">SaaS</option>
            <option value="portfolio">Portfolio</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            value={config.productName}
            onChange={(e) =>
              setConfig({ ...config, productName: e.target.value })
            }
            className="w-full p-2 border rounded-lg"
            placeholder="Enter your product name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Widget Title</label>
          <input
            type="text"
            value={config.widgetTitle}
            onChange={(e) =>
              setConfig({ ...config, widgetTitle: e.target.value })
            }
            className="w-full p-2 border rounded-lg"
            placeholder="Need Help?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Welcome Message
          </label>
          <textarea
            value={config.welcomeMessage}
            onChange={(e) =>
              setConfig({ ...config, welcomeMessage: e.target.value })
            }
            className="w-full p-2 border rounded-lg"
            rows={3}
            placeholder="Enter your welcome message"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={config.description}
            onChange={(e) =>
              setConfig({ ...config, description: e.target.value })
            }
            className="w-full p-2 border rounded-lg"
            rows={4}
            placeholder="Enter your product description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Features (one per line)
          </label>
          <textarea
            value={config.features.join("\n")}
            onChange={(e) =>
              setConfig({ ...config, features: e.target.value.split("\n") })
            }
            className="w-full p-2 border rounded-lg"
            rows={4}
            placeholder="Enter your product features"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Enable Bug Reports
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.enableBugReports}
              onChange={(e) =>
                setConfig({ ...config, enableBugReports: e.target.checked })
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">
              Allow users to report bugs
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Feedback Question
          </label>
          <textarea
            value={config.feedbackQuestion}
            onChange={(e) =>
              setConfig({ ...config, feedbackQuestion: e.target.value })
            }
            className="w-full p-2 border rounded-lg"
            rows={3}
            placeholder="Enter your feedback question"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.isActive}
              onChange={(e) =>
                setConfig({ ...config, isActive: e.target.checked })
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Active</span>
          </div>
        </div>
      </div>

      <motion.button
        type="submit"
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Save Configuration
      </motion.button>
    </form>
  );
};
