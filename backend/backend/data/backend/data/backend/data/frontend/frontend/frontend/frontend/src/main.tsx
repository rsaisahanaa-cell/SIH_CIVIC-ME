import React, {
  useEffect,
  useState
} from "react";

import {
  createRoot
} from "react-dom/client";

import {
  LayoutDashboard,
  FileCheck2,
  Workflow,
  ShieldCheck,
  Gift,
  MessageSquare,
  Upload,
  Search
} from "lucide-react";

import "./styles.css";

const API =
  "http://localhost:8000/api";

type Application = {
  id: string;
  name: string;
  approval: string;
  department: string;
  status: string;
  sla_status: string;
  days_left: number;
};

function App() {

  const [tab, setTab] =
    useState("Dashboard");

  const [applications, setApplications] =
    useState<Application[]>([]);

  const [approvals, setApprovals] =
    useState<any[]>([]);

  const [incentives, setIncentives] =
    useState<any[]>([]);

  const [question, setQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [profile, setProfile] =
    useState({
      sector: "food_processing",
      location: "maharashtra"
    });

  const loadData = () => {

    fetch(`${API}/applications`)
      .then(response => response.json())
      .then(setApplications);

    fetch(`${API}/approvals`)
      .then(response => response.json())
      .then(setApprovals);

    fetch(`${API}/incentives`)
      .then(response => response.json())
      .then(setIncentives);
  };

  useEffect(() => {
    loadData();
  }, []);

  const checkApprovals = () => {

    fetch(`${API}/profile/check`, {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify(profile)
    })
      .then(response => response.json())
      .then(data => {

        setApprovals(data.approvals);

        setTab("Approvals");

      });
  };

  const askAI = () => {

    fetch(`${API}/rag/query`, {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        question
      })
    })
      .then(response => response.json())
      .then(data => {

        setAnswer(
          `${data.answer}\n\nSources: ${
            data.sources.join(", ")
          }`
        );

      });
  };

  const uploadDocument =
    (event: React.ChangeEvent<HTMLInputElement>) => {

      const file =
        event.target.files?.[0];

      if (!file) return;

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      fetch(`${API}/documents/validate`, {
        method: "POST",
        body: formData
      })
        .then(response => response.json())
        .then(data => {

          alert(
            JSON.stringify(
              data,
              null,
              2
            )
          );

        });
    };

  const navigation = [
    ["Dashboard", LayoutDashboard],
    ["Approvals", Workflow],
    ["Documents", FileCheck2],
    ["Compliance", ShieldCheck],
    ["Incentives", Gift],
    ["Regulatory AI", MessageSquare]
  ];

  return (

    <div className="app">

      <aside>

        <div className="brand">
          CIVIC<span>@ME</span>

          <small>
            Industrial Governance OS
          </small>
        </div>

        {navigation.map(
          ([name, Icon]: any) => (

            <button
              key={name}
              className={
                tab === name
                  ? "active"
                  : ""
              }
              onClick={() =>
                setTab(name)
              }
            >

              <Icon size={18} />

              {name}

            </button>

          )
        )}

      </aside>

      <main>

        <header>

          <div>

            <div className="eyebrow">
              SMART AUTOMATION • SIH26130
            </div>

            <h1>
              {tab}
            </h1>

            <p>
              Intelligent Industrial
              Approvals & Compliance
              Accelerator
            </p>

          </div>

          <div className="profile">
            Industry User · Maharashtra
          </div>

        </header>

        {tab === "Dashboard" && (

          <>

            <section className="hero">

              <div>

                <span className="pill">
                  GUIDED APPROVAL JOURNEY
                </span>

                <h2>
                  From fragmented approvals
                  to one intelligent workflow.
                </h2>

                <p>
                  Discover applicable approvals,
                  validate documents, monitor
                  SLAs and find support schemes
                  from one workspace.
                </p>

              </div>

              <div className="journey">

                Profile →
                Map →
                Validate →
                Route →
                Track →
                Approve

              </div>

            </section>

            <div className="grid">

              <div className="card stat">
                <span>
                  Applications
                </span>

                <strong>
                  {applications.length}
                </strong>
              </div>

              <div className="card stat">
                <span>
                  Pending
                </span>

                <strong>
                  {
                    applications.filter(
                      a =>
                        a.status ===
                        "Pending"
                    ).length
                  }
                </strong>
              </div>

              <div className="card stat">
                <span>
                  SLA Risk
                </span>

                <strong>
                  {
                    applications.filter(
                      a =>
                        a.sla_status ===
                        "At Risk"
                    ).length
                  }
                </strong>
              </div>

              <div className="card stat">
                <span>
                  Approved
                </span>

                <strong>
                  {
                    applications.filter(
                      a =>
                        a.status ===
                        "Approved"
                    ).length
                  }
                </strong>
              </div>

            </div>

            <section className="panel">

              <h3>
                Smart Approval Mapper
              </h3>

              <div className="form">

                <select
                  value={profile.sector}
                  onChange={e =>
                    setProfile({
                      ...profile,
                      sector:
                        e.target.value
                    })
                  }
                >

                  <option value="food_processing">
                    Food Processing
                  </option>

                </select>

                <select
                  value={profile.location}
                  onChange={e =>
                    setProfile({
                      ...profile,
                      location:
                        e.target.value
                    })
                  }
                >

                  <option value="maharashtra">
                    Maharashtra
                  </option>

                </select>

                <button
                  className="primary"
                  onClick={
                    checkApprovals
                  }
                >

                  <Search size={16} />

                  Find approvals

                </button>

              </div>

            </section>

          </>

        )}

        {tab === "Approvals" && (

          <section className="panel">

            <h3>
              Applicable Approvals
            </h3>

            {approvals.map(
              approval => (

                <div
                  className="row"
                  key={approval.id}
                >

                  <div>

                    <b>
                      {approval.name}
                    </b>

                    <small>
                      {approval.department}
                      {" · "}
                      SLA {approval.sla_days}
                      {" "}days
                    </small>

                  </div>

                  <span className="tag">
                    {
                      approval.documents
                        .length
                    } documents
                  </span>

                </div>

              )
            )}

          </section>

        )}

        {tab === "Documents" && (

          <section className="panel">

            <h3>
              Document & Application
              Validator
            </h3>

            <p>
              Upload a document for
              validation.
            </p>

            <label className="upload">

              <Upload />

              Choose PDF / document

              <input
                type="file"
                hidden
                onChange={
                  uploadDocument
                }
              />

            </label>

            <div className="checks">

              <span>
                ✓ File completeness
              </span>

              <span>
                • OCR field extraction
              </span>

              <span>
                • Cross-document
                consistency
              </span>

            </div>

          </section>

        )}

        {tab === "Compliance" && (

          <section className="panel">

            <h3>
              Compliance & SLA Copilot
            </h3>

            {applications.map(
              application => (

                <div
                  className="row"
                  key={application.id}
                >

                  <div>

                    <b>
                      {application.id}
                      {" · "}
                      {application.approval}
                    </b>

                    <small>
                      {application.department}
                      {" · "}
                      {application.days_left}
                      {" "}days remaining
                    </small>

                  </div>

                  <span
                    className={
                      application.sla_status ===
                      "At Risk"
                        ? "tag risk"
                        : "tag"
                    }
                  >

                    {
                      application.sla_status
                    }

                  </span>

                </div>

              )
            )}

          </section>

        )}

        {tab === "Incentives" && (

          <section className="panel">

            <h3>
              Support & Incentive
              Discovery
            </h3>

            {incentives.map(
              incentive => (

                <div
                  className="row"
                  key={incentive.name}
                >

                  <div>

                    <b>
                      {incentive.name}
                    </b>

                    <small>
                      {incentive.eligibility}
                    </small>

                  </div>

                  <span className="tag">
                    {incentive.type}
                  </span>

                </div>

              )
            )}

          </section>

        )}

        {tab === "Regulatory AI" && (

          <section className="panel">

            <h3>
              Regulatory Knowledge
              Assistant
            </h3>

            <div className="chat">

              <textarea
                value={question}
                onChange={e =>
                  setQuestion(
                    e.target.value
                  )
                }
                placeholder="Ask about approvals, compliance or SLA tracking..."
              />

              <button
                className="primary"
                onClick={askAI}
              >
                Ask CIVIC@ME
              </button>

              {answer && (

                <pre>
                  {answer}
                </pre>

              )}

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

createRoot(
  document.getElementById("root")!
).render(
  <App />
);
