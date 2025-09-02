import React, { useState } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { User, AssessmentAnswers } from "../types";
import DotGrid from "../components/ActiveBackground/index";
import { Info, BookOpen, Wrench, Eye, Edit } from "lucide-react";
import { Modal, Button } from "react-bootstrap";
import {
  categoryTitles,
  questions,
  sectionBgColors,
  sectionFormBgColors,
  sectionHoverColors,
  sectionDotColors,
} from "../config/constants";
import TooltipButton from "./TootltipButton/TooltipButton";

interface AssessmentFormProps {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  onSubmit: (answers: AssessmentAnswers) => void;
  onNextSection: () => void;
  onPrevSection: () => void;
  currentSectionIndex: number;
  totalSections: number;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({
  currentUser,
  setCurrentUser,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<AssessmentAnswers>({
    academicAptitude: {},
    technicalSkills: {},
    careerInterest: {},
    learningStyle: {},
  });

  const [showResetModal, setShowResetModal] = useState(false);
  const [sectionToReset, setSectionToReset] = useState<
    keyof AssessmentAnswers | null
  >(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [showReview, setShowReview] = useState(false);

  const academicScrollRef = React.useRef<HTMLDivElement | null>(null);

  const sections: (keyof AssessmentAnswers)[] = [
    "academicAptitude",
    "technicalSkills",
    "careerInterest",
    "learningStyle",
  ];

  const section = sections[currentSection];
  const { base, active } = sectionDotColors[section] || {
    base: "#000",
    active: "#000",
  };

  const handleChange = (
    section: keyof AssessmentAnswers,
    question: string,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [question]: value,
      },
    }));
  };

  const handleReset = (section?: keyof AssessmentAnswers) => {
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {},
      }));
    } else {
      setFormData({
        academicAptitude: {},
        technicalSkills: {},
        careerInterest: {},
        learningStyle: {},
      });
    }
    setShowResetModal(false);
  };

  const confirmReset = (section: keyof AssessmentAnswers) => {
    setSectionToReset(section);
    setShowResetModal(true);
  };

  const validateSection = (): boolean => {
    const answers = formData[section];

    if (section === "academicAptitude") {
      const firstUnansweredIndex = questions.academicAptitude.findIndex(
        (q) => answers[q] === undefined || answers[q] === ""
      );

      if (firstUnansweredIndex !== -1) {
        toast.warning("Please answer all Academic Aptitude questions.", {
          position: "top-right",
          autoClose: 3000,
          style: {
            backgroundColor: "rgba(33, 150, 243, 0.3)",
            backdropFilter: "blur(6px)",
            border: "2px solid #2196F3",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "14px",
            borderRadius: "8px",
            fontFamily: "Poppins",
          },
          transition: Bounce,
        });

        const el = document.getElementById(`academic-${firstUnansweredIndex}`);
        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
          el.classList.add("ring-2", "ring-blue-400", "rounded-md", "p-2");
          setTimeout(
            () =>
              el.classList.remove(
                "ring-2",
                "ring-blue-400",
                "rounded-md",
                "p-2"
              ),
            2000
          );
        }

        return false;
      }
    }

    if (section === "technicalSkills") {
      const hasAtLeastOne = Object.values(answers).some((val) => val === true);
      if (!hasAtLeastOne) {
        toast.warning("Please select at least one Technical Skill.", {
          position: "top-right",
          style: {
            backgroundColor: "rgba(255, 165, 0, 0.5)",
            color: "#fff",
            border: "2px solid #FF8C00",
            borderRadius: "8px",
            fontWeight: "500",
            fontFamily: "Poppins",
          },
        });
        return false;
      }
    }

    if (section === "careerInterest") {
      const firstUnansweredIndex = questions.careerInterest.findIndex(
        (q) => answers[q] === undefined || answers[q] === ""
      );

      if (firstUnansweredIndex !== -1) {
        toast.warning("Please answer all Career Interest questions.", {
          position: "top-right",
          autoClose: 3000,
          style: {
            backgroundColor: " rgb(147, 51, 234, 0.3)",
            backdropFilter: "blur(6px)",
            border: "2px solid #9333ea",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "14px",
            borderRadius: "8px",
            fontFamily: "Poppins",
          },
          transition: Bounce,
        });

        const el = document.getElementById(`career-${firstUnansweredIndex}`);
        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
          el.classList.add("ring-2", "ring-purple-600", "rounded-md", "p-2");
          setTimeout(
            () =>
              el.classList.remove(
                "ring-2",
                "ring-blue-400",
                "rounded-md",
                "p-2"
              ),
            2000
          );
        }

        return false;
      }
    }

    if (section === "learningStyle") {
      const firstUnansweredIndex = questions.learningStyle.findIndex(
        (ls) =>
          answers[ls.question] === undefined || answers[ls.question] === ""
      );

      if (firstUnansweredIndex !== -1) {
        toast.warning(
          "Please select an option for all Learning Style questions.",
          {
            position: "top-right",
            autoClose: 3000,
            style: {
              backgroundColor: "rgba(236, 72, 153, 0.3)",
              backdropFilter: "blur(6px)",
              border: "2px solid #EC4899",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "14px",
              borderRadius: "8px",
              fontFamily: "Poppins",
            },
            transition: Bounce,
          }
        );

        const el = document.getElementById(`learning-${firstUnansweredIndex}`);
        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
          el.classList.add("ring-2", "ring-pink-400", "rounded-md", "p-2");
          setTimeout(
            () =>
              el.classList.remove(
                "ring-2",
                "ring-pink-400",
                "rounded-md",
                "p-2"
              ),
            2000
          );
        }

        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateSection()) {
      if (currentSection < sections.length - 1) {
        setCurrentSection((prev) => prev + 1);
      } else {
        setShowReview(true);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSection()) {
      onSubmit(formData);
    }
  };

  const navigateToSection = (sectionIndex: number) => {
    setCurrentSection(sectionIndex);
    setShowReview(false);
  };

  const getAnswerLabel = (
    section: keyof AssessmentAnswers,
    question: string,
    value: any
  ): string => {
    if (section === "academicAptitude" || section === "careerInterest") {
      const labels = [
        "Strongly Disagree",
        "Disagree",
        "Neutral",
        "Agree",
        "Strongly Agree",
      ];
      return labels[value - 1] || "Not answered";
    }

    if (section === "technicalSkills") {
      return value ? "Yes" : "No";
    }

    if (section === "learningStyle") {
      return value || "Not answered";
    }

    return value?.toString() || "Not answered";
  };

  // Render the review/summary section
  const renderReviewSection = () => {
    return (
      <div className="review-section bg-gray-800 p-6 rounded-xl text-white">
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <Eye size={24} /> Review Your Answers
        </h2>

        {sections.map((sectionKey, sectionIndex) => (
          <div key={sectionKey} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {categoryTitles[sectionKey]}
              </h3>
              <button
                type="button"
                onClick={() => navigateToSection(sectionIndex)}
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Edit size={16} /> Edit
              </button>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              {sectionKey === "technicalSkills" ? (
                <div>
                  <h4 className="font-medium mb-2">Selected Skills:</h4>
                  <ul className="list-disc list-inside">
                    {questions.technicalSkills
                      .filter((skill) => formData.technicalSkills[skill])
                      .map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    {Object.values(formData.technicalSkills).filter((v) => v)
                      .length === 0 && (
                      <li className="text-gray-400">No skills selected</li>
                    )}
                  </ul>
                </div>
              ) : (
                <div className="space-y-3">
                  {questions[sectionKey].map((question, qIndex) => {
                    const questionText =
                      typeof question === "string"
                        ? question
                        : question.question;
                    const answer = formData[sectionKey][questionText];

                    return (
                      <div
                        key={questionText}
                        className="border-b border-gray-600 pb-3 last:border-0"
                      >
                        <p className="font-medium">
                          {qIndex + 1}. {questionText}
                        </p>
                        <p className="text-blue-300">
                          {getAnswerLabel(sectionKey, questionText, answer)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => setShowReview(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
          >
            Back to Form
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition-colors"
          >
            Submit Assessment
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Fullscreen DotGrid background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-black">
          <DotGrid
            dotSize={5}
            gap={15}
            baseColor="#393E46"
            activeColor={active}
            proximity={120}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
            className="w-full h-full"
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`
    relative z-10 w-full max-w-3xl p-6 
    ${sectionFormBgColors[sections[currentSection]]} 
    border border-white rounded-xl shadow-lg space-y-6`}
      >
        <ToastContainer />

        {showReview ? (
          renderReviewSection()
        ) : (
          <>
            {/* Academic Aptitude */}
            {currentSection === 0 && (
              <div className="form-section flex flex-col max-h-[70vh] p-4 pr-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold text-blue-600 py-2">
                    Academic Aptitude
                  </h3>

                  <TooltipButton
                    id="academic"
                    icon={<BookOpen size={20} />}
                    paragraph="This section evaluates your logical thinking, problem-solving, and adaptability."
                  />
                </div>

                <div
                  ref={academicScrollRef}
                  className="overflow-y-auto mt-2 pr-2 flex-1 scrollbar-thin scrollbar-thumb-blue-500/40 scrollbar-track-transparent hover:scrollbar-thumb-blue-500/60"
                >
                  {questions.academicAptitude.map((q, index) => (
                    <label
                      key={q}
                      id={`academic-${index}`}
                      className="flex flex-col gap-4 mb-5"
                    >
                      <span className="text-xl font-bold text-text-primary font-poppins">
                        {index + 1}.) {q}
                      </span>

                      <div className="flex flex-wrap gap-4 mb-2">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <label
                            key={val}
                            className="flex items-center gap-2 cursor-pointer font-poppins 
                           hover:scale-105 active:scale-95 transition-transform duration-300 ease-in-out text-text-primary hover:text-blue-500"
                          >
                            <input
                              type="radio"
                              name={q}
                              value={val}
                              checked={formData.academicAptitude[q] === val}
                              onChange={() =>
                                handleChange("academicAptitude", q, val)
                              }
                              className="accent-blue-500 "
                            />
                            {
                              [
                                "Strongly Agree",
                                "Agree",
                                "Neutral",
                                "Disagree",
                                "Strongly Disagree",
                              ][val - 1]
                            }
                          </label>
                        ))}
                      </div>
                    </label>
                  ))}
                </div>

                <div className="">
                  <button
                    type="button"
                    onClick={() => confirmReset(sections[currentSection])}
                    className="bg-btn-solid-bg text-btn-solid-text p-2 
                      font-inter rounded-sm font-medium px-5 border-2
                      hover:bg-blue-500/30 hover:border-blue-500
                      hover:text-text-primary transition-all duration-300 ease-in-out 
                      active:scale-95 mt-8"
                  >
                    Reset Section
                  </button>
                </div>
              </div>
            )}

            {/* Technical Skills */}
            {currentSection === 1 && (
              <div className="form-section space-y-4">
                <div className="flex items-center justify-between ">
                  <h3 className="text-3xl font-bold text-orange-500 py-2">
                    Technical Skills
                  </h3>

                  <TooltipButton
                    id="technical"
                    paragraph="Pick at least one technical skill you feel confident in."
                    buttonBgColor="bg-orange-500"
                    icon={<Info size={20} />}
                  />
                </div>
                <div className="space-y-4">
                  {questions.technicalSkills.map((skill) => (
                    <label
                      key={skill}
                      className="flex items-center gap-2 cursor-pointer font-poppins 
                           hover:scale-105 active:scale-95 transition-transform duration-300 ease-in-out text-text-primary hover:text-orange-500 "
                    >
                      <input
                        type="checkbox"
                        checked={!!formData.technicalSkills[skill]}
                        onChange={(e) =>
                          handleChange(
                            "technicalSkills",
                            skill,
                            e.target.checked
                          )
                        }
                        className="accent-orange-500 flex items-center gap-2 cursor-pointer text-text-primary font-poppins 
                              "
                      />
                      {skill}
                    </label>
                  ))}
                  <button
                    type="button"
                    onClick={() => confirmReset(sections[currentSection])}
                    className="bg-btn-solid-bg text-btn-solid-text p-2 
                      font-inter rounded-sm font-medium px-5 border-2
                      hover:bg-orange-500/30 hover:border-orange-500
                      hover:text-text-primary transition-all duration-300 ease-in-out 
                      active:scale-95 mt-8"
                  >
                    Reset Section
                  </button>
                </div>
              </div>
            )}

            {/* Career Interest */}
            {currentSection === 2 && (
              <div className="form-section flex flex-col max-h-[70vh] p-4 pr-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-4xl font-bold text-purple-600 py-2">
                    Career Interest
                  </h3>

                  <TooltipButton
                    id="career"
                    icon={<Info size={20} />}
                    paragraph="This section evaluates your career preferences and interests."
                  />
                </div>

                <div className="overflow-y-auto mt-2 pr-2 flex-1 scrollbar-thin scrollbar-thumb-purple-500/40 scrollbar-track-transparent hover:scrollbar-thumb-purple-500/60">
                  {questions.careerInterest.map((ci, index) => (
                    <div
                      key={ci}
                      id={`career-${index}`}
                      className="flex flex-col gap-2 mb-5"
                    >
                      <span className="font-xl font-poppins text-text-primary font-bold">
                        {index + 1}.) {ci}
                      </span>
                      <div className="flex flex-wrap gap-4">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <label
                            key={val}
                            className="flex items-center gap-2 cursor-pointer text-text-primary font-poppins font-bold hover:scale-105 active:scale-95 
                            hover:scale-105 transition-transform duration-300 ease-in-out hover:text-purple-500"
                          >
                            <input
                              type="radio"
                              name={ci}
                              value={val}
                              checked={formData.careerInterest[ci] === val}
                              onChange={() =>
                                handleChange("careerInterest", ci, val)
                              }
                              className="accent-purple-500"
                            />
                            {val}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => confirmReset(sections[currentSection])} // ← FIXED
                    className="bg-btn-solid-bg text-btn-solid-text p-2 
    font-inter rounded-sm font-medium px-5 border-2
    hover:bg-purple-500/30 hover:border-purple-500
    hover:text-text-primary transition-all duration-300 ease-in-out 
    active:scale-95 mt-8"
                  >
                    Reset Section
                  </button>
                </div>
              </div>
            )}

            {/* Learning Style */}
            {currentSection === 3 && (
              <div className="form-section flex flex-col max-h-[70vh] p-4 pr-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold font-poppins text-pink-600 py-2">
                    Learning Style
                  </h3>

                  <TooltipButton
                    id="learning-style"
                    icon={<Wrench size={20} />}
                    paragraph="This section identifies how you prefer to learn and process information."
                  />
                </div>

                <div className="overflow-y-auto mt-2 pr-2 flex-1 scrollbar-thin scrollbar-thumb-pink-500/40 scrollbar-track-transparent hover:scrollbar-thumb-pink-500/60">
                  {questions.learningStyle.map((ls, index) => (
                    <div
                      key={ls.question}
                      id={`learning-${index}`}
                      className="flex flex-col gap-2 mb-5"
                    >
                      <span className="font-medium text-2xl font-poppins text-text-primary">
                        {index + 1}.) {ls.question}
                      </span>
                      <div className="flex flex-wrap gap-4">
                        {ls.options.map((opt) => (
                          <label
                            key={opt}
                            className="flex items-center gap-2 cursor-pointer font-poppins 
                           hover:scale-105 active:scale-95 transition-transform duration-300 ease-in-out text-text-primary hover:text-pink-600"
                          >
                            <input
                              type="radio"
                              name={ls.question}
                              value={opt}
                              checked={
                                formData.learningStyle[ls.question] === opt
                              }
                              onChange={() =>
                                handleChange("learningStyle", ls.question, opt)
                              }
                              className="accent-pink-500"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => confirmReset(sections[currentSection])}
                    className="bg-btn-solid-bg text-btn-solid-text p-2 
          font-inter rounded-sm font-medium px-5 border-2
          hover:bg-pink-500/30 hover:border-pink-500
          hover:text-text-primary transition-all duration-300 ease-in-out 
          active:scale-95 mt-8"
                  >
                    Reset Section
                  </button>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="form-navigation flex justify-between mt-6">
              {currentSection > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentSection((prev) => prev - 1)}
                  className={`
      ${sectionBgColors[sections[currentSection - 1]]} 
      text-white p-2 font-inter rounded-sm font-medium px-5 border-2
      ${sectionHoverColors[sections[currentSection - 1]]} 
       transition-all duration-300 ease-in-out active:scale-95 mt-8
    `}
                >
                  Previous
                </button>
              )}

              {currentSection < sections.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className={`
      ${sectionBgColors[sections[currentSection]]} 
      text-white p-2 font-inter rounded-sm font-medium px-5 border-2
      ${sectionHoverColors[sections[currentSection]]} 
    transition-all duration-300 ease-in-out active:scale-95 mt-8
    `}
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 text-text-primary font-inter font-medium border-2 transition-all duration-300 ease-in-out active:scale-95
              bg-green-500 hover:bg-green-500/40 hover:scale-105 mt-2"
                >
                  Review Answers
                </button>
              )}
            </div>
          </>
        )}
      </form>

      <Modal
        show={showResetModal}
        onHide={() => setShowResetModal(false)}
        centered
        dialogClassName="transparent-modal"
        contentClassName="bg-white/20 backdrop-blur-md text-white border border-white/30"
      >
        <Modal.Header
          closeButton
          className="border-b border-white/30 text-white"
        >
          <Modal.Title className="font-semibold text-lg">
            Confirm Reset
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-white/90">
          {sectionToReset
            ? `Are you sure you want to reset the ${categoryTitles[sectionToReset]} section?`
            : "Are you sure you want to reset ALL sections?"}
        </Modal.Body>

        <Modal.Footer className="flex justify-end gap-3">
          <button
            type="button"
            className={`
     bg-btn-solid-bg text-btn-solid-text p-2 
          font-inter rounded-sm font-medium px-3 border-2
           ${sectionHoverColors[sections[currentSection]]} 
          hover:text-text-primary transition-all duration-300 ease-in-out 
          active:scale-95 mt-8
    `}
            onClick={() => setShowResetModal(false)}
          >
            Cancel
          </button>

          <button
            type="button"
             className={`
     bg-btn-solid-bg text-btn-solid-text p-2 
          font-inter rounded-sm font-medium px-4 border-2
           ${sectionHoverColors[sections[currentSection]]} 
          hover:text-text-primary transition-all duration-300 ease-in-out 
          active:scale-95 mt-8
    `}
            onClick={() => handleReset(sectionToReset)}
          >
            Yes, Reset
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AssessmentForm;
