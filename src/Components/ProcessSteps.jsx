import React from "react";
import "./ProcessSteps.css";
import {
  FaNodeJs,
  FaDownload,
  FaKey,
  FaRocket,
  FaLink,
  FaSmileBeam,
} from "react-icons/fa";

const steps = [
  {
    step: "1",
    icon: <FaNodeJs className="step-icon" />,
    title: "Install NodeJS & n8n",
    desc: (
      <>
        Install NodeJS from{" "}
        <a
          className="card-link"
          href="https://nodejs.org/en/download"
          target="_blank"
          rel="noopener noreferrer"
        >
          NodeJS Official Site
        </a>{" "}
        Then install n8n locally in CMD using:
        <code className="code-block">npm install n8n -g</code>
      </>
    ),
  },
  {
    step: "2",
    icon: <FaDownload className="step-icon" />,
    title: "Download Workflows",
    desc: (
      <>
        Download all workflows and keep them ready.{" "}
        <a className="card-link" href="/workflows">
          Click here
        </a>{" "}
        to go to workflows page.
      </>
    ),
  },
  {
    step: "3",
    icon: <FaKey className="step-icon" />,
    title: "Set Your Credentials",
    desc: (
      <>
        Add your credentials for the required services.{" "}
        <a className="card-link" href="/integrations">
          Click here
        </a>{" "}
        to go to integrations page.
      </>
    ),
  },
  {
    step: "4",
    icon: <FaRocket className="step-icon" />,
    title: "Start & Run Main Workflow",
    desc: (
      <>
        Start n8n. <br />
        Open <strong>Agent 5.0</strong> → Click <strong>Webhook</strong> → Copy
        Production URL → Activate workflow.
      </>
    ),
  },
  {
    step: "5",
    icon: <FaLink className="step-icon" />,
    title: "Use URL During Signup",
    desc: "Paste the copied webhook URL during signup.",
  },
  {
    step: "6",
    icon: <FaSmileBeam className="step-icon" />,
    title: "Explore & Enjoy Agent OG",
    desc: "Your setup is completed. Enjoy using Agent OG!",
  },
];

function ProcessSteps() {
  return (
    <div className="wrapper">
      <h2 className="heading">Setup Process</h2>
      <div className="card-container">
        {steps.map((item, index) => (
          <div className="card" key={index}>
            <div className="icon-row">
              <span className="step-number">{item.step}</span>
              {item.icon}
            </div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProcessSteps;
