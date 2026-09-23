import { useState } from "react";
import { HScroll } from "../common/HScroll";
import { QuestionCard } from "./QuestionCard";
import { QuestionSheet } from "./QuestionSheet";
import { useStore } from "../../hooks/useStore";
import { QUESTIONS, type Question } from "../../constants/questions";

/** One swipeable collection of every category's Question Cards - internal
 *  profile data that helps FireFlair match the person to work, kept off
 *  the public card. */
export function QuestionCardsCollection() {
  const { state } = useStore();
  const [openQuestion, setOpenQuestion] = useState<Question | null>(null);
  const answers = state.profile.answers;
  const done = QUESTIONS.filter(
    (q) => answers[q.id] !== undefined && answers[q.id] !== "",
  ).length;

  return (
    <>
      <p className="ff-body ff-muted -mt-1 mb-2.5 text-[11.5px]">
        {done}/{QUESTIONS.length} answered · these stay off your public card
      </p>
      <HScroll label="Question Cards" snap>
        {QUESTIONS.map((q) => (
          <QuestionCard
            key={q.id}
            q={q}
            answer={answers[q.id]}
            onClick={() => setOpenQuestion(q)}
          />
        ))}
      </HScroll>
      <QuestionSheet
        open={!!openQuestion}
        question={openQuestion}
        onClose={() => setOpenQuestion(null)}
      />
    </>
  );
}
