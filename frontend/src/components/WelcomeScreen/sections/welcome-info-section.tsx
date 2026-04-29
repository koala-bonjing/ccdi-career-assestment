import React from "react";

/**
 * WelcomeInfoSection
 *
 * Drop this component into WelcomePage between <FeaturesSection /> and <CtaSection />.
 * It adds three lightweight info blocks:
 *   1. "By the numbers" stat row
 *   2. "How it works" 3-step process
 *   3. "Programs we'll match you to" pill grid
 *
 * Designed to give students just enough context without overwhelming them.
 */

const RESPONSIVE_CSS = `
  .wis-root {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 20px;
  }

  .wis-divider {
    border: none;
    border-top: 1px solid rgba(43,49,118,0.1);
    margin: 20px 0;
  }

  /* ── Stats ── */
  .wis-stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  @media (max-width: 480px) {
    .wis-stats-row { grid-template-columns: repeat(3, 1fr); gap: 6px; }
  }

  .wis-stat {
    background: #f7f8fc;
    border: 1px solid rgba(43,49,118,0.1);
    border-radius: 10px;
    padding: 14px 10px;
    text-align: center;
  }
  .wis-stat-num {
    font-size: clamp(20px, 20px + 0.5vw, 26px);
    font-weight: 700;
    color: #2B3176;
    display: block;
    line-height: 1.1;
  }
  .wis-stat-label {
    font-size: clamp(10px, 10px + 0.3vw, 12px);
    color: #71717a;
    margin-top: 4px;
    line-height: 1.4;
    display: block;
  }

  /* ── Section heading ── */
  .wis-section-head {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-bottom: 13px;
  }
  .wis-section-head h3 {
    font-size: clamp(13px, 13px + 0.4vw, 15px);
    font-weight: 700;
    color: #2B3176;
    margin: 0;
  }

  /* ── Steps ── */
  .wis-steps { display: flex; flex-direction: column; gap: 0; }
  .wis-step {
    display: flex;
    gap: 12px;
    position: relative;
    padding-bottom: 16px;
  }
  .wis-step:last-child { padding-bottom: 0; }
  .wis-step:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 17px;
    top: 36px;
    width: 1px;
    height: calc(100% - 20px);
    background: rgba(43,49,118,0.12);
  }
  .wis-step-dot {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #2B3176;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .wis-step-body { padding-top: 5px; }
  .wis-step-body h4 {
    font-size: clamp(12px, 12px + 0.3vw, 13.5px);
    font-weight: 700;
    color: #18181b;
    margin-bottom: 2px;
  }
  .wis-step-body p {
    font-size: clamp(11.5px, 11.5px + 0.3vw, 12.5px);
    color: #52525b;
    line-height: 1.55;
    margin: 0;
  }

  /* ── Programs pills ── */
  .wis-programs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 7px;
  }
  @media (max-width: 420px) { .wis-programs-grid { grid-template-columns: 1fr; } }

  .wis-prog-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f7f8fc;
    border: 1px solid rgba(43,49,118,0.1);
    border-radius: 8px;
    padding: 8px 11px;
  }
  .wis-prog-code {
    font-size: 11px;
    font-weight: 700;
    color: #2B3176;
    min-width: 38px;
    flex-shrink: 0;
  }
  .wis-prog-name {
    font-size: 11.5px;
    color: #52525b;
    flex: 1;
    line-height: 1.3;
  }
  .wis-dur-badge {
    font-size: 10px;
    font-weight: 600;
    border-radius: 10px;
    padding: 2px 7px;
    margin-left: auto;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .wis-dur-4yr { background: #e0f2fe; color: #0369a1; }
  .wis-dur-2yr { background: #d1fae5; color: #065f46; }
`;

const PROGRAMS = [
  { code: "BSCS",  name: "Computer Science",         dur: "4yr" },
  { code: "BSIT",  name: "Information Technology",   dur: "4yr" },
  { code: "BSIS",  name: "Information Systems",      dur: "4yr" },
  { code: "BSEE",  name: "Electrical Engineering",   dur: "4yr" },
  { code: "BSECE", name: "Electronics Engineering",  dur: "4yr" },
  { code: "ACT",   name: "Programming",              dur: "2yr" },
  { code: "ACT",   name: "Networking",               dur: "2yr" },
  { code: "ACT",   name: "Multimedia & Animation",   dur: "2yr" },
];

export const WelcomeInfoSection: React.FC = () => {
  return (
    <>
      <style>{RESPONSIVE_CSS}</style>

      <div className="wis-root">

        {/* ── 1. Stats ── */}
        <hr className="wis-divider" />
        <div className="wis-stats-row" style={{ marginBottom: 0 }}>
          <div className="wis-stat">
            <span className="wis-stat-num">148</span>
            <span className="wis-stat-label">Assessment items across 5 sections</span>
          </div>
          <div className="wis-stat">
            <span className="wis-stat-num">8</span>
            <span className="wis-stat-label">Programs evaluated for your profile</span>
          </div>
          <div className="wis-stat">
            <span className="wis-stat-num">~22m</span>
            <span className="wis-stat-label">Typical completion time</span>
          </div>
        </div>

        {/* ── 2. How it works ── */}
        <hr className="wis-divider" />
        <div className="wis-section-head">
          <span style={{ fontSize: 18 }}>🗺️</span>
          <h3>How it works</h3>
        </div>
        <div className="wis-steps">
          <div className="wis-step">
            <div className="wis-step-dot">1</div>
            <div className="wis-step-body">
              <h4>Answer 5 sections honestly</h4>
              <p>Foundational knowledge, academic aptitude, technical interests, career direction, and your real-life commitments.</p>
            </div>
          </div>
          <div className="wis-step">
            <div className="wis-step-dot">2</div>
            <div className="wis-step-body">
              <h4>AI analyzes your profile</h4>
              <p>Your answers are weighted across all 8 programs, factoring in both your strengths and practical constraints.</p>
            </div>
          </div>
          <div className="wis-step">
            <div className="wis-step-dot">3</div>
            <div className="wis-step-body">
              <h4>Receive your personalized report</h4>
              <p>Instantly see your recommended program, compatibility scores, visual charts, and study preparation tips.</p>
            </div>
          </div>
        </div>

        {/* ── 3. Programs ── */}
        <hr className="wis-divider" />
        <div className="wis-section-head">
          <span style={{ fontSize: 18 }}>🎓</span>
          <h3>Programs we'll match you to</h3>
        </div>
        <div className="wis-programs-grid">
          {PROGRAMS.map((p, i) => (
            <div className="wis-prog-pill" key={i}>
              <span className="wis-prog-code">{p.code}</span>
              <span className="wis-prog-name">{p.name}</span>
              <span className={`wis-dur-badge wis-dur-${p.dur}`}>{p.dur}</span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
};