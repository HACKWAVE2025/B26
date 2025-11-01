// import React from "react";
// import { FaServer, FaRobot, FaCloud, FaKey, FaPlug, FaDatabase } from "react-icons/fa";
// import "./IntegrationsPage.css";

// const integrations = [
//   { icon: <FaServer />, title: "Webhooks", desc: "Trigger automations using incoming/outgoing webhooks." },
//   { icon: <FaRobot />, title: "OpenAI / AI Agents", desc: "Integrate AI Agents and LLM-based workflows." },
//   { icon: <FaCloud />, title: "Google APIs", desc: "Google Sheets, Gmail, Drive automations." },
//   { icon: <FaKey />, title: "API Keys", desc: "Store and manage secure API credentials." },
//   { icon: <FaPlug />, title: "Third-Party APIs", desc: "Connect to 200+ external tools." },
//   { icon: <FaDatabase />, title: "Databases", desc: "MySQL, PostgreSQL, MongoDB connections." },
// ];

// function IntegrationsPage() {
//   return (
//     <div className="integration-wrapper">
//       <h2 className="heading">Available Integrations</h2>

//       <div className="integration-card-container">
//         {integrations.map((item, index) => (
//           <div className="integration-card" key={index}>
//             <div className="integration-icon">{item.icon}</div>
//             <h3>{item.title}</h3>
//             <p>{item.desc}</p>
//             <button className="integration-btn">Connect</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default IntegrationsPage;

import React from "react";
import {
  FaGoogle,
  FaProjectDiagram,
  FaKey,
  FaRegEdit,
  FaUserShield,
  FaUsersCog,
  FaSearch,
} from "react-icons/fa";
import "./IntegrationsPage.css";

// const googleCloudSteps = [
//   {
//     icon: <FaGoogle />,
//     title: "Google Cloud Console",
//     desc: "Open Google Cloud Console and create/login to your Google account.",
//     link: "https://console.cloud.google.com/",
//   },
//   {
//     icon: <FaProjectDiagram />,
//     title: "Select / Create Project",
//     desc: "Click on project dropdown → New Project → Enter name → Create.",
//     link: "https://console.cloud.google.com/projectselector2/home/dashboard",
//   },
//   {
//     icon: <FaKey />,
//     title: "API & Services",
//     desc: "Navigate to API & Services section to manage Cloud APIs.",
//     link: "https://console.cloud.google.com/apis/dashboard",
//   },
//   {
//     icon: <FaUserShield />,
//     title: "OAuth Consent Screen",
//     desc: "Configure user consent screen (Internal/External users).",
//     link: "https://console.cloud.google.com/apis/credentials/consent",
//   },
//   {
//     icon: <FaRegEdit />,
//     title: "Branding",
//     desc: "Add App Name, Logo & basic branding details.",
//     link: "https://console.cloud.google.com/apis/credentials/consent",
//   },
//   {
//     icon: <FaUsersCog />,
//     title: "Create OAuth Client ID",
//     desc: "Go to Credentials → Create Credentials → OAuth Client ID.",
//     link: "https://console.cloud.google.com/apis/credentials",
//   },
//   {
//     icon: <FaSearch />,
//     title: "Enable Google Services",
//     desc: "Search & enable APIs like Sheets, Drive, Gmail, Calendar etc.",
//     link: "https://console.cloud.google.com/apis/library",
//   },
// ];

const googleCloudSteps = [
  {
    icon: <FaGoogle />,
    title: "Google Cloud Console",
    desc: "Open Google Cloud Console and sign in with your Google account.",
    link: "https://console.cloud.google.com/",
  },
  {
    icon: <FaProjectDiagram />,
    title: "Select / Create Project",
    desc: "Click the project dropdown → New Project → Enter name → Create.",
    link: "https://console.cloud.google.com/projectselector2/home/dashboard",
  },
  {
    icon: <FaKey />,
    title: "API & Services",
    desc: "Open 'API & Services' to manage Google APIs.",
    link: "https://console.cloud.google.com/apis/dashboard",
  },
  {
    icon: <FaUserShield />,
    title: "OAuth Consent Screen",
    desc: "Configure your consent screen (Internal/External users).",
    link: "https://console.cloud.google.com/apis/credentials/consent",
  },
  {
    icon: <FaRegEdit />,
    title: "Branding",
    desc: "Add App Name, Logo & developer details.",
    link: "https://console.cloud.google.com/apis/credentials/consent",
  },
  {
    icon: <FaUsersCog />,
    title: "Create OAuth Client ID",
    desc: "Go to Credentials → Create Credentials → OAuth Client ID.",
    link: "https://console.cloud.google.com/apis/credentials",
  },
  {
    icon: <FaSearch />,
    title: "Enable Google Services",
    desc: "Search & enable APIs like Google Drive, Sheets, Gmail, Calendar.",
    link: "https://console.cloud.google.com/apis/library",
  },
  {
    icon: <FaKey />,
    title: "Copy Client ID & Secret",
    desc: "Copy the Client ID & Client Secret from your OAuth Client — paste them in your app when connecting Google Services like Drive or Sheets to grant correct permissions.",
    link: "https://console.cloud.google.com/apis/credentials",
  },
];

function IntegrationsPage() {
  return (
    <div className="integration-wrapper">
      <h2 className="heading">Google Cloud Setup Guide</h2>
      <p className="sub-heading">
        Follow these steps to configure Google Cloud Console — explained in a
        simple way for beginners 👇
      </p>

      <div className="integration-card-container">
        {googleCloudSteps.map((item, index) => (
          <div className="integration-card" key={index}>
            <div className="integration-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <button className="integration-btn">Open Link</button>
            </a>
          </div>
        ))}
      </div>
      {/* YouTube Tutorial Horizontal Card */}
      <div className="yt-card">
        <div className="yt-content">
          <h3>🎥 Need More Clarity? Watch This Tutorial</h3>
          <p>
            This video teaches how to create credentials and plug them into Agent workflows.
          </p>

          <a
            href="https://youtu.be/3Ai1EPznlAc?si=_8mvzg0f2H5UApsa"
            target="_blank"
            rel="noopener noreferrer"
            className="yt-btn"
          >
            <span className="yt-icon">▶</span> Watch on YouTube
          </a>
        </div>
      </div>
    </div>
  );
}

export default IntegrationsPage;
