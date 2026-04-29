import React from "react";
import { Modal, Button } from "react-bootstrap";
import {
  Target,
  Bot,
  BarChart3,
  ShieldCheck,
  EyeOff,
} from "lucide-react";

interface AboutModalProps {
  show: boolean;
  onHide: () => void;
}

const ADVANTAGES = [
  {
    num: 1,
    title: "Personalized, not generic",
    desc: "Your recommendation is generated from your specific combination of answers across 148 items — not a one-size-fits-all quiz.",
  },
  {
    num: 2,
    title: "Covers 8 programs simultaneously",
    desc: "You receive compatibility scores for all 8 programs at once — so you can see not just your top match, but how other programs compare.",
  },
  {
    num: 3,
    title: "Practical, not just academic",
    desc: "The assessment factors in your budget, commute, study habits, and career goals — not just math and English scores.",
  },
  {
    num: 4,
    title: "Instant, detailed results",
    desc: "After completing all 5 sections, you immediately receive a detailed breakdown: recommended program, readiness score, visual charts, and preparation tips.",
  },
  {
    num: 5,
    title: "Gives you an honest starting point",
    desc: "Even if you already have a program in mind, this assessment either validates your choice or opens your eyes to a better-fitting option.",
  },
];

const PURPOSE_CARDS = [
  {
    icon: Target,
    color: "#2B3176",
    bg: "rgba(43,49,118,0.07)",
    title: "Right Program, Right Student",
    desc: "Many students enroll in programs that don't match their strengths, leading to frustration and dropout. This system helps ensure your first choice is your best choice.",
  },
  {
    icon: Bot,
    color: "#1a7a3c",
    bg: "rgba(26,122,60,0.07)",
    title: "AI-Powered Matching",
    desc: "Your answers are analyzed by an AI model that weighs academic aptitude, career interests, technical preferences, and real-life constraints together — not just grades.",
  },
  {
    icon: BarChart3,
    color: "#d97706",
    bg: "rgba(217,119,6,0.07)",
    title: "Honest Self-Assessment",
    desc: "Unlike entrance exams, this tool asks how you actually think, study, and learn — giving a fuller picture of where you'll thrive.",
  },
  {
    icon: ShieldCheck,
    color: "#0e7490",
    bg: "rgba(14,116,144,0.07)",
    title: "Private & Confidential",
    desc: "Your responses are used solely to generate your personalized recommendation. No scores are shared with faculty or used for admission decisions.",
  },
];

const RESPONSIVE_CSS = `
  .about-modal-body { padding: 1.25rem !important; display: flex; flex-direction: column; gap: 18px; }

  .about-hero {
    background: linear-gradient(135deg, #EEF0F9 0%, #E8EBF7 100%);
    border: 1px solid rgba(43,49,118,0.15);
    border-radius: 12px;
    padding: 18px;
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }
  .about-hero-icon {
    width: 46px; height: 46px; border-radius: 11px;
    background: #2B3176; display: flex; align-items: center;
    justify-content: center; flex-shrink: 0;
  }
  .about-hero h3 { font-size: 15px; font-weight: 700; color: #2B3176; margin-bottom: 6px; }
  .about-hero p  { font-size: 13px; color: #52525b; line-height: 1.6; margin: 0; }

  .about-label {
    font-size: 11px; font-weight: 700; color: #a1a1aa;
    text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 10px;
  }

  .about-purpose-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  }
  @media (max-width: 480px) { .about-purpose-grid { grid-template-columns: 1fr; } }

  .purpose-card {
    border: 1px solid rgba(43,49,118,0.12);
    border-radius: 10px; padding: 14px;
    background: #fff;
  }
  .purpose-card-icon {
    width: 34px; height: 34px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 9px;
  }
  .purpose-card h4 { font-size: 13px; font-weight: 700; color: #18181b; margin-bottom: 4px; }
  .purpose-card p  { font-size: 12px; color: #52525b; line-height: 1.55; margin: 0; }

  .about-why-box {
    background: #fff8ed; border: 1px solid #fcd34d;
    border-radius: 10px; padding: 14px 16px;
  }
  .about-why-box h4 { color: #92400e; font-size: 13px; font-weight: 700; margin-bottom: 9px; }
  .about-why-box ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 5px; }
  .about-why-box li {
    font-size: 12.5px; color: #78350f; line-height: 1.5;
    padding-left: 18px; position: relative;
  }
  .about-why-box li::before { content: "→"; position: absolute; left: 0; color: #d97706; font-weight: 700; }

  .adv-list { display: flex; flex-direction: column; gap: 8px; }
  .adv-item {
    display: flex; gap: 12px; align-items: flex-start;
    background: #f7f8fc; border: 1px solid rgba(43,49,118,0.1);
    border-radius: 10px; padding: 12px 14px;
  }
  .adv-num {
    width: 28px; height: 28px; border-radius: 50%;
    background: #2B3176; color: #fff;
    font-size: 12px; font-weight: 700; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .adv-text h5 { font-size: 13px; font-weight: 700; color: #2B3176; margin-bottom: 2px; }
  .adv-text p  { font-size: 12px; color: #52525b; line-height: 1.5; margin: 0; }

  .about-privacy-row {
    display: flex; gap: 10px; align-items: center;
    background: #f4f4f5; border: 1px solid #d4d4d8;
    border-radius: 10px; padding: 12px 14px;
  }
  .about-privacy-row p { font-size: 12px; color: #3f3f46; line-height: 1.5; margin: 0; }
`;

export const AboutModal: React.FC<AboutModalProps> = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <style>{RESPONSIVE_CSS}</style>

      <Modal.Header
        className="border-0 pb-0"
        closeButton
        closeVariant="white"
        style={{
          background: "#2B3176",
          borderRadius: "12px 12px 0 0",
          padding: "1rem 1.25rem",
        }}
      >
        <Modal.Title className="w-100 d-flex align-items-center gap-3">
          <div
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Target size={18} color="#fff" />
          </div>
          <div>
            <div style={{ color: "#fff", fontSize: "clamp(13px,13px + 1vw,16px)", fontWeight: 700 }}>
              About the CCDI Career Assessment
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "clamp(10px,10px + 0.5vw,12px)", marginTop: 2 }}>
              AI-powered program recommendation for incoming students
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="about-modal-body" style={{ maxHeight: "72vh", overflowY: "auto" }}>

        {/* Hero */}
        <div className="about-hero">
          <div className="about-hero-icon">
            <span style={{ fontSize: 20 }}>🧭</span>
          </div>
          <div>
            <h3>What is this system?</h3>
            <p>
              The CCDI Career Assessment is a guided, AI-powered tool designed to match each incoming
              student with the academic program that best fits their abilities, interests, and life
              situation — before they enroll. It replaces guesswork with data-driven guidance.
            </p>
          </div>
        </div>

        {/* Purpose */}
        <div>
          <p className="about-label">Our purpose</p>
          <div className="about-purpose-grid">
            {PURPOSE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div className="purpose-card" key={card.title}>
                  <div className="purpose-card-icon" style={{ background: card.bg }}>
                    <Icon size={17} color={card.color} />
                  </div>
                  <h4>{card.title}</h4>
                  <p>{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why */}
        <div className="about-why-box">
          <h4>💡 Why should you take this assessment?</h4>
          <ul>
            <li>Mismatched programs lead to lower academic performance and higher dropout rates.</li>
            <li>Switching programs mid-year means lost units, lost tuition, and lost time.</li>
            <li>Many students choose based on what friends picked — not their own strengths.</li>
            <li>This 20-minute assessment can save you years of uncertainty and misdirection.</li>
          </ul>
        </div>

        {/* Advantages */}
        <div>
          <p className="about-label">Advantages of taking this assessment</p>
          <div className="adv-list">
            {ADVANTAGES.map((adv) => (
              <div className="adv-item" key={adv.num}>
                <div className="adv-num">{adv.num}</div>
                <div className="adv-text">
                  <h5>{adv.title}</h5>
                  <p>{adv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="about-privacy-row">
          <EyeOff size={16} color="#52525b" style={{ flexShrink: 0 }} />
          <p>
            This is not an entrance exam. There are no passing or failing scores. Your results exist
            only to help you — answer as honestly as you can for the most accurate recommendation.
          </p>
        </div>

      </Modal.Body>

      <Modal.Footer className="border-0 justify-content-center pb-4">
        <Button
          variant="secondary"
          onClick={onHide}
          style={{
            background: "#f4f4f5", border: "1px solid #d4d4d8",
            color: "#18181b", fontWeight: 600, borderRadius: 8,
            padding: "8px 28px",
          }}
        >
          Got it
        </Button>
      </Modal.Footer>
    </Modal>
  );
};