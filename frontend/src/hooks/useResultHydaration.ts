import { useEffect } from "react";
import { useAssessmentState } from "./useAssessmentState";
import { useEvaluationStore } from "../../store/useEvaluationStore";

export const useResultsHydration = () => {
  const { assessmentResult } = useAssessmentState();
  const { setResult } = useEvaluationStore();

  useEffect(() => {
    if (assessmentResult && !useEvaluationStore.getState().result) {
      setResult(assessmentResult);
    }
  }, [assessmentResult, setResult]);
};