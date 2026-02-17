import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [links, setLinks] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  

  const API = import.meta.env.VITE_API_URL;

  const fetchHistory = async () => {
    const res = await axios.get(`${API}/api/research`);
    setHistory(res.data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async () => {
    if (!links.trim()) {
      alert("Please enter at least one link.");
      return;
    }

    const linkArray = links.split("\n").filter(l => l.trim() !== "");

    if (linkArray.length > 5) {
      alert("Maximum 5 links allowed.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${API}/api/research`, {
        links: linkArray
      });

      setResult(response.data);
      fetchHistory();
      setActiveTab("home");

    } catch (error) {
      alert(error.response?.data?.error || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <h1 style={styles.title}>Research Brief Generator</h1>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={activeTab === "home" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>

          <button
            style={activeTab === "history" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>

          <button
            style={activeTab === "status" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("status")}
          >
            Status
          </button>
        </div>

        {/* HOME TAB */}
        {activeTab === "home" && (
          <>
            <textarea
              rows="5"
              placeholder="Paste up to 5 links (one per line)"
              value={links}
              onChange={(e) => setLinks(e.target.value)}
              style={styles.textarea}
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={styles.primaryButton}
            >
              {loading ? "Generating..." : "Generate Research"}
            </button>

            {result && (
              <div style={styles.resultCard}>
                <Section title="Summary">
                  <p>{result.summary}</p>
                </Section>

                <Section title="Key Points">
                  {result.keyPoints?.map((kp, i) => (
                    <div key={i} style={styles.keyPoint}>
                      <strong>{kp.point}</strong>
                      <p><em>Source:</em> {kp.source}</p>
                      <p><em>Snippet:</em> {kp.snippet}</p>
                    </div>
                  ))}
                </Section>

                <Section title="Conflicts">
                  <ul>
                    {result.conflicts?.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </Section>

                <Section title="Verify Checklist">
                  <ul>
                    {result.verifyChecklist?.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </Section>

                <Section title="Tags">
                  <p>{result.tags?.join(", ")}</p>
                </Section>
              </div>
            )}
          </>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div>
            {history.map((item, i) => (
              <div
                key={i}
                style={styles.historyCard}
                onClick={() => {
                  setResult(item);
                  setActiveTab("home");
                }}
              >
                <strong>
                  {new Date(item.createdAt).toLocaleString()}
                </strong>
                <p>{item.summary.substring(0, 120)}...</p>
              </div>
            ))}
          </div>
        )}

        {/* STATUS TAB */}
        {activeTab === "status" && (
          <StatusSection API={API} />
        )}

      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

function StatusSection({ API }) {
  const [status, setStatus] = useState(null);

  const checkStatus = async () => {
    const res = await axios.get(`${API}/status`);
    setStatus(res.data);
  };

  return (
    <div>
      <button style={styles.primaryButton} onClick={checkStatus}>
        Check System Status
      </button>

      {status && (
        <div style={styles.statusCard}>
          <p><strong>Server:</strong> {status.server}</p>
          <p><strong>Database:</strong> {status.database}</p>
          <p><strong>LLM:</strong> {status.llm}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    background: "#f3f4f6",
    minHeight: "100vh",
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center"
  },
  container: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "900px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
  },
  title: {
    marginBottom: "20px"
  },
  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },
  tab: {
    padding: "8px 16px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    background: "#f9fafb",
    cursor: "pointer"
  },
  activeTab: {
    padding: "8px 16px",
    borderRadius: "6px",
    background: "#2563eb",
    color: "white",
    border: "none",
    cursor: "pointer"
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    marginBottom: "15px"
  },
  primaryButton: {
    background: "#2563eb",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  resultCard: {
    marginTop: "30px",
    padding: "20px",
    background: "#fafafa",
    borderRadius: "10px"
  },
  keyPoint: {
    background: "white",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "10px",
    border: "1px solid #eee"
  },
  historyCard: {
    padding: "15px",
    borderRadius: "8px",
    background: "#f9fafb",
    marginBottom: "10px",
    cursor: "pointer",
    border: "1px solid #eee"
  },
  statusCard: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "8px",
    background: "#f9fafb"
  },
  sectionTitle: {
    borderBottom: "1px solid #eee",
    paddingBottom: "5px",
    marginBottom: "10px"
  }
};

export default App;
