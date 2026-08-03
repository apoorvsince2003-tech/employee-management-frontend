import { useState } from "react";
import toast from "react-hot-toast";
import {
  LifeBuoy,
  Search,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  HelpCircle,
  ShieldQuestion,
  ChevronDown,
  ChevronUp,
  Send,
} from "lucide-react";

export default function HelpSupport() {
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    {
      q: "How do I add a new employee?",
      a: "Go to Employees → Add Employee and fill in the required information.",
    },
    {
      q: "How do I approve leave requests?",
      a: "Open Leave Management and click Approve beside the employee request.",
    },
    {
      q: "Can I download reports?",
      a: "Yes. Navigate to Reports and click the Download button.",
    },
    {
      q: "How do I change my password?",
      a: "Open Security from Settings and update your password.",
    },
  ];

  return (
    <div className="space-y-6 p-6">

      <div className="rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-600 text-white p-8 shadow-lg">

        <div className="flex items-center gap-4">

          <LifeBuoy size={45} />

          <div>
            <h1 className="text-3xl font-bold">
              Help & Support
            </h1>

            <p className="opacity-90 mt-2">
              Find answers, contact support and solve problems quickly.
            </p>
          </div>

        </div>

      </div>

      <div className="relative">

        <Search
          size={18}
          className="absolute left-4 top-3 text-gray-400"
        />

        <input
          placeholder="Search help articles..."
          className="w-full rounded-xl border pl-11 pr-4 py-3 outline-none"
        />

      </div>

      <div className="grid md:grid-cols-3 gap-5">

        <div className="rounded-xl border p-5 shadow">
          <Mail className="text-blue-600 mb-3" size={34} />

          <h2 className="font-bold">
            Email Support
          </h2>

          <p className="text-gray-500 mt-2">
            support@apsara.com
          </p>

          <button
            onClick={() => toast.success("Opening Email")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Contact
          </button>
        </div>

        <div className="rounded-xl border p-5 shadow">

          <Phone className="text-green-600 mb-3" size={34} />

          <h2 className="font-bold">
            Phone Support
          </h2>

          <p className="text-gray-500 mt-2">
            +91 9876543210
          </p>

          <button
            onClick={() => toast.success("Calling Support")}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Call
          </button>

        </div>

        <div className="rounded-xl border p-5 shadow">

          <MessageCircle
            className="text-purple-600 mb-3"
            size={34}
          />

          <h2 className="font-bold">
            Live Chat
          </h2>

          <p className="text-gray-500 mt-2">
            Chat instantly with our support team.
          </p>

          <button
            onClick={() => toast.success("Chat Started")}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Start Chat
          </button>

        </div>

      </div>

      <div className="rounded-xl border p-6 shadow">

        <h2 className="text-2xl font-bold mb-5">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">

          {faqs.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg"
            >

              <button
                onClick={() =>
                  setOpen(open === index ? null : index)
                }
                className="w-full flex justify-between items-center p-4"
              >
                <span className="font-semibold">
                  {item.q}
                </span>

                {open === index ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </button>

              {open === index && (
                <div className="px-4 pb-4 text-gray-500">
                  {item.a}
                </div>
              )}

            </div>
          ))}

        </div>

      </div>

      <div className="rounded-xl border p-6 shadow">

        <h2 className="text-2xl font-bold mb-5">
          Submit a Support Ticket
        </h2>

        <div className="grid gap-4">

          <input
            placeholder="Subject"
            className="border rounded-lg p-3"
          />

          <textarea
            rows={5}
            placeholder="Describe your issue..."
            className="border rounded-lg p-3"
          />

          <button
            onClick={() => toast.success("Ticket Submitted")}
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg py-3 flex justify-center items-center gap-2"
          >
            <Send size={18} />
            Submit Ticket
          </button>

        </div>

      </div>

    </div>
  );
}