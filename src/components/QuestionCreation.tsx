import { useState } from "react";
import navim from "../assets/navicon.png";
import profileimg from "../assets/profileicn.png";
import { useLocation } from "react-router-dom";
import EditTestModal from "./EditTestModal";
import PublishTest from "./PublishTest";

export default function QuestionCreation() {
  const location = useLocation();

  const [openEdit, setOpenEdit] = useState(false);

  const { testData, testId } = location.state || {};

  const [testMeta, setTestMeta] = useState({
    type: testData?.type ?? "",
    difficulty: testData?.difficulty ?? "",
    totalQuestions: Number(testData?.totalQuestions ?? 0),
    totalMarks: testData?.totalMarks ?? "",
    totalTime: testData?.totalTime ?? "",
    subject: testData?.subject ?? "",
    topic: testData?.topic ?? "",
    subTopic: testData?.subTopic ?? "",
  });

  const { type, difficulty, totalQuestions, totalMarks, totalTime, subject, topic, subTopic } = testMeta;

  const [questions, setQuestions] = useState(() =>
    Array.from({ length: Number(testData?.totalQuestions ?? 0) }, () => ({
      question: "",
      options: ["", "", "", ""],
      solution: "",
      difficulty: testData?.difficulty ?? "easy",
      topic: testData?.topic ?? "",
      subTopic: testData?.subTopic ?? "",
      correctOption: 0,
    })),
  );

  const [showPublish, setShowPublish] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const question = questions[currentQuestion];

  const handleQuestion = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updated = [...questions];
    updated[currentQuestion].question = e.target.value;
    setQuestions(updated);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...questions];

    updated[currentQuestion].options[index] = value;

    setQuestions(updated);
  };

  const handleSolution = (value: string) => {
    const updated = [...questions];

    updated[currentQuestion].solution = value;

    setQuestions(updated);
  };

  const isQuestionCompleted = (q: any) => {
    return (
      q.question.trim() &&
      q.solution.trim() &&
      q.difficulty &&
      q.topic &&
      q.subTopic &&
      q.options.every((opt: string) => opt.trim())
    );
  };

  const handleNext = () => {
    if (!isQuestionCompleted(questions[currentQuestion])) {
      alert("Please complete this question first.");
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowPublish(true);
    }
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border border-gray-300">
        <div className="p-5 border border-gray-300">
          <img src={navim} alt="Nav Icon" />
        </div>

        <div className="p-4">
          <h3 className="font-semibold mb-5">Question Creation</h3>

          <p className="text-sm text-gray-500 mb-5">
            Total Questions : {totalQuestions}
          </p>

          <div className="space-y-3">
            {questions.map((q, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-full flex justify-between items-center border border-gray-300 rounded-lg px-3 py-2
                ${
                  isQuestionCompleted(q)
                    ? "bg-green-100 border border-gray-300-green-500 text-green-700"
                    : currentQuestion === index
                      ? "bg-blue-100 border border-gray-300-blue-500"
                      : ""
                }`}
              >
                <span>Question {index + 1}</span>

                <span>›</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1">
        <header className="h-20 bg-white border border-gray-300 flex justify-between items-center px-10">
          <div></div>
          <div className="flex items-center gap-5">
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center font-bold">
              🕭
            </button>
            <div className="flex items-center gap-3">
              <img
                src={profileimg}
                className="w-11 h-11 rounded-full bg-orange-300"
              />
              <div>
                <p className="font-semibold">Alex Wando</p>
                <p className="text-sm text-gray-500">Admin</p>
              </div>
            </div>
          </div>
        </header>

        <header className="h-20 bg-white border border-gray-300 flex justify-between items-center px-10">
          <div className="text-sm text-gray-500 flex justify-between items-center">
            {" "}
            Test Creation / Create Test / Chapter Wise
          </div>
          <button className="bg-indigo-500 text-white px-8 py-2 rounded">
            Publish
          </button>
        </header>

        <div className="p-8">
          <div className="bg-white rounded-xl p-6">
            <div className="border border-gray-300 rounded-xl p-6 mb-8 bg-white relative">
              <button className="absolute top-5 right-5 text-indigo-500 hover:text-indigo-700">
                ✏️
              </button>

              <span className="bg-[#1B1F6B] text-white text-xs font-medium px-4 py-1 rounded-full">
                {type === "chapterwise"
                  ? "Chapter Wise"
                  : type === "pyq"
                    ? "PYQ"
                    : "Mock Test"}
              </span>

              <div className="flex items-center gap-3 mb-6 mt-6">
                <h3 className="text-2xl font-bold text-gray-800">Chapter 1</h3>

                <span className="bg-[#30C7A5] text-white text-sm px-4 py-1 rounded-md flex items-center gap-1">
                  ✓ {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
              </div>

              <div className="flex justify-between items-end">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <p className="w-24 text-gray-400 text-sm">Subject</p>
                    <span className="mr-3">:</span>

                    <span className="text-gray-700 font-medium">{subject}</span>
                  </div>

                  <div className="flex items-center">
                    <p className="w-24 text-gray-400 text-sm">Topic</p>
                    <span className="mr-3">:</span>

                    <div className="flex gap-2">
                      <span className="border border-gray-300 border border-gray-300-yellow-400 text-yellow-500 rounded-full px-3 py-1 text-xs">
                        {topic}
                      </span>

                      <span className="border border-gray-300 border border-gray-300-yellow-400 text-yellow-500 rounded-full px-3 py-1 text-xs">
                        {subTopic}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <p className="w-24 text-gray-400 text-sm">Sub Topic</p>
                    <span className="mr-3">:</span>

                    <span className="border border-gray-300 border border-gray-300-yellow-400 text-yellow-500 rounded-full px-3 py-1 text-xs">
                      Application
                    </span>
                  </div>
                </div>

                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <div className="px-5 py-2 flex items-center gap-2 border border-gray-300 text-gray-600 text-sm">
                    ⏱<span>{totalTime} Min</span>
                  </div>

                  <div className="px-5 py-2 flex items-center gap-2 border border-gray-300 text-gray-600 text-sm">
                    📝
                    <span>{totalQuestions} Q's</span>
                  </div>

                  <div className="px-5 py-2 flex items-center gap-2 text-gray-600 text-sm">
                    📊
                    <span>{totalMarks} Marks</span>
                  </div>
                </div>
              </div>
            </div>

            {!showPublish ? (
              <>
                <div className="mb-8">
                  <label className="font-semibold">
                    Question{" "}
                    <span>
                      {currentQuestion + 1}/{questions.length}
                    </span>
                  </label>

                  <textarea
                    rows={6}
                    value={question.question}
                    onChange={handleQuestion}
                    className="w-full border border-gray-300 rounded-lg mt-3 p-4 resize-none"
                    placeholder="Type your question here..."
                  />
                </div>

                <h3 className="font-semibold mb-4">Type the options below</h3>

                <div className="space-y-4">
                  {question.options.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={question.correctOption === index}
                        onChange={() => {
                          const updated = [...questions];
                          updated[currentQuestion].correctOption = index;
                          setQuestions(updated);
                        }}
                      />

                      <input
                        value={item}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        className="flex-1 h-12 border border-gray-300 rounded-lg px-4"
                        placeholder={`Option ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <label className="font-semibold">Add Solution</label>

                  <textarea
                    rows={5}
                    value={question.solution}
                    onChange={(e) => handleSolution(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg mt-3 p-4"
                    placeholder="Type solution..."
                  />
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold mb-5">Question Settings</h3>

                  <div className="grid gap-5">
                    <input
                      value={difficulty}
                      readOnly
                      className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-100"
                    />

                    <input
                      value={topic}
                      readOnly
                      className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-100"
                    />

                    <input
                      value={subTopic}
                      readOnly
                      className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-100"
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-10">
                  <button
                    onClick={() => setOpenEdit(true)}
                    className="bg-red-500 text-white px-6 py-3 rounded"
                  >
                    Edit Test Creation
                  </button>

                  <button
                    onClick={handleNext}
                    className="bg-indigo-500 text-white px-10 py-3 rounded"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <PublishTest />
            )}
          </div>
        </div>
      </main>
      <EditTestModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        testId={testId ?? localStorage.getItem("testId")}
        initialData={{
          type,
          subject,
          topic,
          subTopic,
          duration: totalTime,
          difficulty,
          totalQuestions,
          totalMarks,
        }}
        onSaved={(updatedData) => {
          setTestMeta((prev) => ({
            ...prev,
            type: updatedData.type ?? prev.type,
            subject: updatedData.subject ?? prev.subject,
            topic: updatedData.topic ?? prev.topic,
            subTopic: updatedData.subTopic ?? prev.subTopic,
            totalTime: updatedData.totalTime ?? prev.totalTime,
            totalQuestions: Number(updatedData.totalQuestions ?? prev.totalQuestions),
            totalMarks: updatedData.totalMarks ?? prev.totalMarks,
            difficulty: updatedData.difficulty ?? prev.difficulty,
          }));
        }}
      />
    </div>
  );
}
