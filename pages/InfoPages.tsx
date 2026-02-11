import React from 'react';
import { Shield, Mail, HelpCircle, Bot } from 'lucide-react';

export const About: React.FC = () => (
  <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
    <h1 className="text-3xl font-bold mb-6">About RAID Master</h1>
    <div className="prose prose-slate max-w-none">
      <p className="text-lg text-slate-600 mb-6">
        RAID Master was created to simplify the complex world of data storage. Whether you are building a home NAS, a professional server, or just curious about redundancy, our tools are designed to provide accurate and visual insights.
      </p>
      
      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 my-8 rounded-r-lg">
        <h3 className="text-lg font-bold text-indigo-900 flex items-center mb-2">
          <Bot className="w-6 h-6 mr-2" /> AI Transparency
        </h3>
        <p className="text-indigo-800">
          This website was architected and coded with the assistance of advanced Artificial Intelligence. 
          However, every line of code, design choice, and calculation logic has been reviewed and managed by human engineers to ensure accuracy, security, and quality. We believe in the power of AI to augment human creativity, not replace it.
        </p>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Why use this tool?</h2>
      <ul className="list-disc pl-6 space-y-2 text-slate-700">
        <li>Instant visualization of storage efficiency.</li>
        <li>Comparison of complex RAID arrays like RAID 50 and 60.</li>
        <li>AI-powered recommendations for your specific hardware.</li>
        <li>Mobile-friendly design for on-the-go checks in the server room.</li>
      </ul>
    </div>
  </div>
);

export const Privacy: React.FC = () => (
  <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
    <div className="flex items-center mb-6">
      <Shield className="w-8 h-8 text-emerald-600 mr-3" />
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
    </div>
    <div className="prose prose-slate max-w-none">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        At RAID Master, we prioritize your privacy. This calculator is a client-side application. 
        This means:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>No Data Collection:</strong> We do not store the configurations you enter on our servers.</li>
        <li><strong>Local Processing:</strong> All calculations happen directly in your browser.</li>
        <li><strong>AI Interactions:</strong> If you use the AI Advisor feature, your RAID configuration parameters (only numbers and text) are sent to the AI provider (Google Gemini) solely for the purpose of generating the advice. No personal identifiers are transmitted.</li>
      </ul>
    </div>
  </div>
);

export const Contact: React.FC = () => (
  <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
    <div className="flex items-center mb-6">
      <Mail className="w-8 h-8 text-primary-600 mr-3" />
      <h1 className="text-3xl font-bold">Contact Us</h1>
    </div>
    <p className="text-slate-600 mb-6">
      Have a suggestion for a new RAID level? Found a bug? We'd love to hear from you.
    </p>
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
        <input type="text" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5" placeholder="Your Name" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input type="email" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5" placeholder="name@example.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
        <textarea className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 h-32" placeholder="How can we help?"></textarea>
      </div>
      <button className="w-full bg-primary-600 text-white font-medium py-2.5 rounded-lg hover:bg-primary-700 transition">
        Send Message
      </button>
    </form>
  </div>
);

export const FAQ: React.FC = () => (
  <div className="max-w-3xl mx-auto space-y-6">
     <div className="text-center mb-8">
       <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
       <p className="text-slate-500">Everything you need to know about RAID</p>
     </div>
     
     {[
       { q: "What is RAID?", a: "RAID stands for Redundant Array of Independent Disks. It is a technology that combines multiple physical disk drive components into one or more logical units for data redundancy, performance improvement, or both." },
       { q: "Which RAID is best for speed?", a: "RAID 0 offers the fastest read/write speeds as it stripes data across all drives without overhead. However, it offers zero protection against failure. For a balance of speed and protection, RAID 10 is often recommended." },
       { q: "Does RAID replace backups?", a: "NO! RAID is not a backup. RAID protects against hardware failure (disk death), but it does not protect against file corruption, accidental deletion, ransomware, or fire/flood. Always maintain a separate backup (3-2-1 rule)." },
       { q: "Can I mix drive sizes?", a: "Yes, but in most RAID levels, the array will treat all drives as if they are the size of the smallest drive. The excess space on larger drives will typically be wasted." }
     ].map((item, i) => (
       <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
         <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center">
           <HelpCircle className="w-5 h-5 text-primary-500 mr-2" />
           {item.q}
         </h3>
         <p className="text-slate-600 leading-relaxed ml-7">{item.a}</p>
       </div>
     ))}
  </div>
);
