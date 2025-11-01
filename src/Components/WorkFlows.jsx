import React from "react";
import { FaDownload } from "react-icons/fa";
import "./WorkFlows.css";
// import file from "../assets/Agent OG Workflows"
const workflows = [
  {
    title: "N8N Workflows",
    desc: "All agents start from Main agent to all sub agents",
    file: "../assets/Agent OG Workflows.zip",
  }
];

function WorkFlows() {
  return (
    <div className="workflow-wrapper">
      <h2 className="workflow-title">Download Ready-Made Workflows ⚙️</h2>

      <div className="workflow-list">
        {workflows.map((wf, i) => (
          <div key={i} className="workflow-card">
            <div>
              <h3>{wf.title}</h3>
              <p>{wf.desc}</p>
            </div>

            <a href={wf.file} download className="download-btn">
              <FaDownload className="download-icon" /> Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkFlows;
