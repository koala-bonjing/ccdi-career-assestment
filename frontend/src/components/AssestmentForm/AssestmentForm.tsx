import React, { useState } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AssestmentForm.css"; // Import the separated CSS
import type { User, AssessmentAnswers } from "../../types";
import DotGrid from "../ActiveBackground/DotGrid.css";
import {
  Info,
  BookOpen,
  Wrench,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { Modal } from "react-bootstrap";
import {
  categoryTitles,
  questions,
  sectionBgColors,
  sectionFormBgColors,
  sectionHoverColors,
  sectionDotColors,
} from "../../config/constants";
import TooltipButton from "../TootltipButton/TooltipButton";
import NavigationBar from "../NavigationBarComponents/NavigationBar";
import ProgressSideBar from "../ProgressSideBar/ProgressSideBar";

interface AssessmentFormProps {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  onSubmit: (answers: AssessmentAnswers) => void;
  onNextSection: () => void;
  onPrevSection: () => void;
  currentSectionIndex: number;
  totalSections: number;
  loading?: boolean;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({
  currentUser,
  setCurrentUser,
  onSubmit,
  loading,
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

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
      if (section === "academicAptitude") {
        setCurrentQuestionIndex(0);
      }
    } else {
      setFormData({
        academicAptitude: {},
        technicalSkills: {},
        careerInterest: {},
        learningStyle: {},
      });
      setCurrentQuestionIndex(0);
    }
    setShowResetModal(false);
  };

  const confirmReset = (section: keyof AssessmentAnswers) => {
    setSectionToReset(section);
    setShowResetModal(true);
  };

  const saveAnswersLocally = () => {
    try {
      const timestamp = new Date().toISOString();
      const dataToSave = {
        answers: formData,
        timestamp: timestamp,
        section: categoryTitles[sections[currentSection]],
        currentSection: currentSection,
      };

      const blob = new Blob([JSON.stringify(dataToSave, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `assessment-answers-${timestamp.split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Answers saved successfully!", {
        position: "top-right",
        autoClose: 3000,
        style: {
          backgroundColor: "rgba(34, 197, 94, 0.3)",
          backdropFilter: "blur(6px)",
          border: "2px solid #22c55e",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "14px",
          borderRadius: "8px",
          fontFamily: "Poppins",
        },
        transition: Bounce,
      });
    } catch (error) {
      toast.error("Failed to save answers. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        style: {
          backgroundColor: "rgba(239, 68, 68, 0.3)",
          backdropFilter: "blur(6px)",
          border: "2px solid #ef4444",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "14px",
          borderRadius: "8px",
          fontFamily: "Poppins",
        },
        transition: Bounce,
      });
    }
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

        setCurrentQuestionIndex(firstUnansweredIndex);
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
            backgroundColor: "rgb(147, 51, 234, 0.3)",
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

        setCurrentQuestionIndex(firstUnansweredIndex);
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
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateSection()) {
      setCompletedSections((prev) => [...prev, currentSection]);

      if (currentSection < sections.length - 1) {
        setCurrentSection((prev) => prev + 1);
        setCurrentQuestionIndex(0);
      } else {
        setShowReview(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
      setCurrentQuestionIndex(0);
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
    setCurrentQuestionIndex(0);
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

  const renderReviewSection = () => {
    return (
      <div className="review-section">
        <h2 className="review-header">
          <Eye size={24} /> Review Your Answers
        </h2>

        <div className="review-content scrollbar-thin-blue">
          {sections.map((sectionKey, sectionIndex) => (
            <div key={sectionKey} className="review-section-item">
              <div className="review-section-header">
                <h3 className="review-section-title">
                  {categoryTitles[sectionKey]}
                </h3>
                <button
                  type="button"
                  onClick={() => navigateToSection(sectionIndex)}
                  className="review-edit-button"
                >
                  <Edit size={16} /> Edit
                </button>
              </div>

              <div className="review-answers-container">
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
        </div>
      </div>
    );
  };

  const getSectionColorClass = (section: string) => {
    const colorMap: { [key: string]: string } = {
      academicAptitude: "academic-bg academic-hover",
      technicalSkills: "technical-bg technical-hover", 
      careerInterest: "career-bg career-hover",
      learningStyle: "learning-bg learning-hover"
    };
    return colorMap[section] || "bg-blue-500 hover:bg-blue-600";
  };

  return (
    <div className="assessment-container">
      <div className="background-overlay">
        <div className="background-full">
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

      <ToastContainer />
      <NavigationBar />
      <ProgressSideBar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />

      <div className="main-content">
        <form
          onSubmit={handleSubmit}
          className={`assessment-form ${sectionFormBgColors[sections[currentSection]]}`}
        >
          {showReview ? (
            renderReviewSection()
          ) : (
            <>
              {/* Academic Aptitude Section */}
              {currentSection === 0 && (
                <div className="form-section">
                  <div className="progress-info">
                    <span className="text-blue-400">
                      Question {currentQuestionIndex + 1} of{" "}
                      {questions.academicAptitude.length}
                    </span>

                    <div className="progress-controls">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentQuestionIndex((prev) =>
                            Math.max(0, prev - 1)
                          )
                        }
                        disabled={currentQuestionIndex === 0}
                        className={`navigation-button ${
                          currentQuestionIndex === 0
                            ? "bg-gray-400"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <div className="progress-dots">
                        {questions.academicAptitude.map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentQuestionIndex(index)}
                            className={`progress-dot ${
                              index === currentQuestionIndex
                                ? "bg-blue-500 scale-125"
                                : formData.academicAptitude[
                                    questions.academicAptitude[index]
                                  ]
                                ? "bg-green-500 hover:bg-green-400"
                                : "bg-gray-400 hover:bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            currentQuestionIndex <
                            questions.academicAptitude.length - 1
                          ) {
                            setCurrentQuestionIndex((prev) => prev + 1);
                          }
                        }}
                        disabled={
                          currentQuestionIndex ===
                          questions.academicAptitude.length - 1
                        }
                        className={`navigation-button ${
                          currentQuestionIndex ===
                          questions.academicAptitude.length - 1
                            ? "bg-gray-400"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="progress-bar-container">
                    <div
                      className="progress-bar bg-blue-600"
                      style={{
                        width: `${
                          ((currentQuestionIndex + 1) /
                            questions.academicAptitude.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  <div className="scrollable-content scrollbar-thin-blue">
                    <div className="question-container">
                      <h4 className="question-text">
                        {questions.academicAptitude[currentQuestionIndex]}
                      </h4>

                      <div className="choices-grid">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <label
                            key={val}
                            className={`choice-label ${
                              formData.academicAptitude[
                                questions.academicAptitude[
                                  currentQuestionIndex
                                ]
                              ] === val
                                ? "border-blue-500 bg-blue-500/20 scale-105"
                                : "border-gray-300 hover:border-blue-400 hover:bg-blue-500/10"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`academic-question-${currentQuestionIndex}`}
                              value={val}
                              checked={
                                formData.academicAptitude[
                                  questions.academicAptitude[
                                    currentQuestionIndex
                                  ]
                                ] === val
                              }
                              onChange={() =>
                                handleChange(
                                  "academicAptitude",
                                  questions.academicAptitude[
                                    currentQuestionIndex
                                  ],
                                  val
                                )
                              }
                              className="choice-input"
                            />
                            <span className="choice-text">
                              {
                                [
                                  "Strongly Disagree",
                                  "Disagree",
                                  "Neutral",
                                  "Agree",
                                  "Strongly Agree",
                                ][val - 1]
                              }
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Skills Section */}
              {currentSection === 1 && (
                <div className="form-section">
                  <div className="section-header">
                    <h3 className="section-title text-orange-500">
                      Technical Skills
                    </h3>
                    <TooltipButton
                      id="technical"
                      paragraph="Pick at least one technical skill you feel confident in."
                      buttonBgColor="bg-orange-500"
                      icon={<Info size={20} />}
                    />
                  </div>

                  <div className="skills-container">
                    <div className="skills-list scrollbar-thin-orange">
                      {questions.technicalSkills.map((skill, index) => (
                        <label
                          key={skill}
                          className="skill-label fade-in-up hover:border-orange-400 hover:bg-orange-500/10"
                          style={{
                            animationDelay: `${index * 100}ms`,
                          }}
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
                            className="skill-checkbox"
                          />
                          <span className="font-medium">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Career Interest Section */}
              {currentSection === 2 && (
                <div className="form-section">
                  <div className="progress-info">
                    <span className="text-purple-400">
                      Question {currentQuestionIndex + 1} of{" "}
                      {questions?.careerInterest?.length ?? 0}
                    </span>

                    <div className="progress-controls">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentQuestionIndex((prev) =>
                            Math.max(0, prev - 1)
                          )
                        }
                        disabled={currentQuestionIndex === 0}
                        className={`navigation-button ${
                          currentQuestionIndex === 0
                            ? "bg-gray-400"
                            : "bg-purple-500 hover:bg-purple-600 text-white"
                        }`}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <div className="progress-dots">
                        {(questions?.careerInterest ?? []).map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentQuestionIndex(index)}
                            className={`progress-dot ${
                              index === currentQuestionIndex
                                ? "bg-purple-500 scale-125"
                                : formData.careerInterest[
                                    questions.careerInterest[index]
                                  ]
                                ? "bg-green-500 hover:bg-green-400"
                                : "bg-gray-400 hover:bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            currentQuestionIndex <
                            questions.careerInterest.length - 1
                          ) {
                            setCurrentQuestionIndex((prev) => prev + 1);
                          }
                        }}
                        disabled={
                          currentQuestionIndex ===
                          questions.careerInterest.length - 1
                        }
                        className={`navigation-button ${
                          currentQuestionIndex ===
                          questions.careerInterest.length - 1
                            ? "bg-gray-400"
                            : "bg-purple-500 hover:bg-purple-600 text-white"
                        }`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="progress-bar-container">
                    <div
                      className="progress-bar bg-purple-600"
                      style={{
                        width: `${
                          ((currentQuestionIndex + 1) /
                            questions.careerInterest.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  <div className="scrollable-content scrollbar-thin-purple">
                    <div className="question-container">
                      <h4 className="question-text">
                        {questions.careerInterest[currentQuestionIndex]}
                      </h4>

                      <div className="choices-grid">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <label
                            key={val}
                            className={`choice-label ${
                              formData.careerInterest[
                                questions.careerInterest[currentQuestionIndex]
                              ] === val
                                ? "border-purple-500 bg-purple-500/20 scale-105"
                                : "border-gray-300 hover:border-purple-400 hover:bg-purple-500/10"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`career-question-${currentQuestionIndex}`}
                              value={val}
                              checked={
                                formData.careerInterest[
                                  questions.careerInterest[currentQuestionIndex]
                                ] === val
                              }
                              onChange={() =>
                                handleChange(
                                  "careerInterest",
                                  questions.careerInterest[
                                    currentQuestionIndex
                                  ],
                                  val
                                )
                              }
                              className="accent-purple-500 w-5 h-5"
                            />
                            <span className="choice-text">{val}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Learning Style Section */}
              {currentSection === 3 && (
                <div className="form-section">
                  <div className="section-header">
                    <h3 className="section-title text-pink-600 font-poppins">
                      Learning Style
                    </h3>
                    <TooltipButton
                      id="learning-style"
                      icon={<Wrench size={20} />}
                      paragraph="This section identifies how you prefer to learn and process information."
                    />
                  </div>

                  <div className="progress-info">
                    <span className="text-pink-500">
                      Question {currentQuestionIndex + 1} of{" "}
                      {questions.learningStyle.length}
                    </span>

                    <div className="progress-controls">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentQuestionIndex((prev) =>
                            Math.max(0, prev - 1)
                          )
                        }
                        disabled={currentQuestionIndex === 0}
                        className={`navigation-button ${
                          currentQuestionIndex === 0
                            ? "bg-gray-400"
                            : "bg-pink-500 hover:bg-pink-600 text-white"
                        }`}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <div className="progress-dots">
                        {questions.learningStyle.map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentQuestionIndex(index)}
                            className={`progress-dot ${
                              index === currentQuestionIndex
                                ? "bg-pink-500 scale-125"
                                : formData.learningStyle[
                                    questions.learningStyle[index].question
                                  ]
                                ? "bg-green-500 hover:bg-green-400"
                                : "bg-gray-400 hover:bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            currentQuestionIndex <
                            questions.learningStyle.length - 1
                          ) {
                            setCurrentQuestionIndex((prev) => prev + 1);
                          }
                        }}
                        disabled={
                          currentQuestionIndex ===
                          questions.learningStyle.length - 1
                        }
                        className={`navigation-button ${
                          currentQuestionIndex ===
                          questions.learningStyle.length - 1
                            ? "bg-gray-400"
                            : "bg-pink-500 hover:bg-pink-600 text-white"
                        }`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="progress-bar-container">
                    <div
                      className="progress-bar bg-pink-500"
                      style={{
                        width: `${
                          ((currentQuestionIndex + 1) /
                            questions.learningStyle.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  <div className="flex-1 pr-4">
                    <div className="question-container">
                      <h4 className="question-text">
                        {
                          questions.learningStyle[currentQuestionIndex]
                            ?.question
                        }
                      </h4>

                      <div className="learning-options scrollbar-thin-pink">
                        {questions.learningStyle[
                          currentQuestionIndex
                        ]?.options.map((opt) => (
                          <label
                            key={opt}
                            className={`choice-label ${
                              formData.learningStyle[
                                questions.learningStyle[currentQuestionIndex]
                                  .question
                              ] === opt
                                ? "border-pink-500 bg-pink-500/20 scale-105"
                                : "border-gray-300 hover:border-pink-400 hover:bg-pink-500/10"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`learning-${currentQuestionIndex}`}
                              value={opt}
                              checked={
                                formData.learningStyle[
                                  questions.learningStyle[currentQuestionIndex]
                                    .question
                                ] === opt
                              }
                              onChange={() =>
                                handleChange(
                                  "learningStyle",
                                  questions.learningStyle[currentQuestionIndex]
                                    .question,
                                  opt
                                )
                              }
                              className="accent-pink-500 w-5 h-5"
                            />
                            <span className="choice-text">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </form>

        {/* Section Navigation Buttons */}
        {!showReview && (
          <div className="nav-buttons-container">
            <div className="nav-buttons-group">
              {currentSection > 0 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className={`nav-button ${getSectionColorClass(sections[currentSection - 1])}`}
                >
                  Previous Section
                </button>
              )}

              {currentSection < sections.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className={`nav-button ${getSectionColorClass(sections[currentSection])}`}
                >
                  Next Section
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="nav-button bg-green-600 hover:bg-green-500 border-green-500"
                >
                  Review Answers
                </button>
              )}
            </div>
          </div>
        )}

        {/* Review Section Buttons */}
        {showReview && (
          <div className="review-buttons-container">
            <button
              type="button"
              onClick={() => setShowReview(false)}
              className="review-button bg-gray-600 hover:bg-gray-500 border-gray-500"
            >
              Back to Form
            </button>

            <button
              type="button"
              onClick={saveAnswersLocally}
              className="review-button bg-blue-600 hover:bg-blue-500 border-blue-500 flex items-center gap-2"
            >
              <Download size={18} />
              Save Answers Locally
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`review-button ${
                loading
                  ? "bg-gray-500 cursor-not-allowed border-gray-400"
                  : "bg-green-600 hover:bg-green-500 border-green-500"
              }`}
            >
              {loading ? "Submitting..." : "Submit Assessment"}
            </button>
          </div>
        )}
      </div>

      <Modal
        show={showResetModal}
        onHide={() => setShowResetModal(false)}
        centered
        dialogClassName="transparent-modal"
        contentClassName="modal-content-custom"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">
            Confirm Reset
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          {sectionToReset
            ? `Are you sure you want to reset the ${categoryTitles[sectionToReset]} section?`
            : "Are you sure you want to reset ALL sections?"}
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <button
            type="button"
            className="modal-button modal-button-cancel"
            onClick={() => setShowResetModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="modal-button modal-button-confirm"
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