import { useEffect, useState } from "react";
import {
  getSubjects,
  getTopics,
  getSubTopics,
  createTest,
} from "../services/testService";
import { useNavigate } from "react-router-dom";
import navim from "../assets/navicon.png";
import profileimg from "../assets/profileicn.png";

export default function CreateTest() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [subTopics, setSubTopics] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    type: "chapterwise",
    subject: "",
    topics: [] as string[],
    sub_topics: [] as string[],
    difficulty: "easy",
    correct_marks: 0,
    wrong_marks: 0,
    unattempt_marks: 0,
    total_time: "",
    total_marks: "",
    total_questions: "",
    status: "draft",
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await getSubjects();

      if (response.status === "success") {
        setSubjects(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleTopicChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const topicId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      topics: topicId ? [topicId] : [],
      sub_topics: [],
    }));

    try {
      const response = await getSubTopics([topicId]);

      if (response.status === "success") {
        setSubTopics(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subTopicId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      sub_topics: subTopicId ? [subTopicId] : [],
    }));
  };

  const handleSubjectChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const subjectId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      subject: subjectId,
      topics: [],
      sub_topics: [],
    }));

    try {
      const response = await getTopics(subjectId);

      if (response.status === "success") {
        setTopics(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: e.target.type === "number" ? Number(value) : value,
    }));
  };

  const handleNext = async () => {
    try {
      if (!formData.name.trim()) {
        return alert("Enter Test Name");
      }

      if (!formData.subject) {
        return alert("Select Subject");
      }

      if (!formData.topics.length) {
        return alert("Select Topic");
      }

      if (!formData.sub_topics.length) {
        return alert("Select Sub Topic");
      }

      if (!formData.total_time) {
        return alert("Enter Duration");
      }

      if (!formData.total_questions) {
        return alert("Enter Number of Questions");
      }

      if (!formData.total_marks) {
        return alert("Enter Total Marks");
      }

      console.log("Payload", formData);
      const response = await createTest(formData);

      if (response.status === "success") {
        localStorage.setItem("testId", response.data.id);

        alert(response.message);

        localStorage.setItem("testId", response.data.id);
        navigate("/questions", {
          state: {
            testId: response.data.id,
            testData: {
              type: formData.type,
              difficulty: formData.difficulty,
              totalQuestions: formData.total_questions,
              totalMarks: formData.total_marks,
              totalTime: formData.total_time,
              subject: subjects.find((item) => item.id === formData.subject)
                ?.name,
              topic: topics.find((item) => item.id === formData.topics[0])
                ?.name,
              subTopic: subTopics.find(
                (item) => item.id === formData.sub_topics[0],
              )?.name,
            },
          },
        });
      }
    } catch (err: any) {
      console.log(err);

      alert(err.response?.data?.message || "Unable to create test.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border border-gray-300">
        <div className="p-5">
          <img src={navim} alt="Nav Icon" />
        </div>

        <nav className="px-4 space-y-2">
          <button  onClick={() => navigate("/dashboard")} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100">
            Dashboard
          </button>

          <button className="w-full text-left px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium border border-gray-300 border border-gray-300-blue-200">
            Test Creation
          </button>

          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100">
            Test Tracking
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1">
        {/* Header */}
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

        {/* Content */}
        <section className="p-10">
          <p className="text-m text-gray-500 mb-8">
            Test Creation / Create Test / Chapter Wise
          </p>

          {/* Tabs */}
          <div className="inline-flex bg-white border border-gray-300 rounded-lg overflow-hidden mb-8 border border-gray-300-gray-300">
            <button
              onClick={() =>
                setFormData({
                  ...formData,
                  type: "chapterwise",
                })
              }
              className={`px-6 py-2 ${
                formData.type === "chapterwise"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              Chapterwise
            </button>

            <button
              onClick={() =>
                setFormData({
                  ...formData,
                  type: "pyq",
                })
              }
              className={`px-6 py-2 ${
                formData.type === "pyq"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              PYQ
            </button>

            <button
              onClick={() =>
                setFormData({
                  ...formData,
                  type: "mock",
                })
              }
              className={`px-6 py-2 ${
                formData.type === "mock"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              Mock Test
            </button>
          </div>

          {/* Form */}
          <div className="grid grid-cols-2 gap-8">
            {/* Subject */}
            <div>
              <label className="block mb-2 text-sm font-medium">Subject</label>

              <select
                value={formData.subject}
                onChange={handleSubjectChange}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 outline-none"
              >
                <option value="">Choose Subject</option>

                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Test Name */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Name of Test
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-12 border border-gray-300 rounded-lg px-4"
                placeholder="Enter name of Test"
              />
            </div>

            {/* Topic */}
            <div>
              <label className="block mb-2 text-sm font-medium">Topic</label>

              <select
                value={formData.topics[0] || ""}
                onChange={handleTopicChange}
                className="w-full h-12 border border-gray-300 rounded-lg px-4"
              >
                <option value="">Choose Topic</option>

                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Topic */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Sub Topic
              </label>

              <select
                value={formData.sub_topics[0] || ""}
                onChange={handleSubTopicChange}
                className="w-full h-12 border border-gray-300 rounded-lg px-4"
              >
                <option value="">Choose Sub Topic</option>

                {subTopics.map((subTopic) => (
                  <option key={subTopic.id} value={subTopic.id}>
                    {subTopic.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Duration (Minutes)
              </label>

              <input
                name="total_time"
                value={formData.total_time}
                onChange={handleChange}
                className="w-full h-12 border border-gray-300 rounded-lg px-4"
                placeholder="Enter the time"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block mb-4 text-sm font-medium">
                Test Difficulty Level
              </label>

              <div className="flex gap-12">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="difficulty"
                    value="easy"
                    checked={formData.difficulty === "easy"}
                    onChange={handleChange}
                  />
                  Easy
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="difficulty"
                    value="medium"
                    checked={formData.difficulty === "medium"}
                    onChange={handleChange}
                  />
                  Medium
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="difficulty"
                    value="difficult"
                    checked={formData.difficulty === "difficult"}
                    onChange={handleChange}
                  />
                  Difficult
                </label>
              </div>
            </div>
          </div>

          {/* Marking */}
          <div className="mt-12">
            <h3 className="font-semibold mb-6">Marking Scheme:</h3>

            <div className="grid grid-cols-5 gap-6">
              <div>
                <label className="block text-sm mb-2">Wrong Answer</label>

                <input
                  type="number"
                  name="wrong_marks"
                  value={formData.wrong_marks}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Unattempted</label>

                <input
                  type="number"
                  name="unattempt_marks"
                  value={formData.unattempt_marks}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Correct Answer</label>

                <input
                  type="number"
                  name="correct_marks"
                  value={formData.correct_marks}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">No of Questions</label>

                <input
                  type="number"
                  name="total_questions"
                  value={formData.total_questions}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4"
                  placeholder="Ex:50"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Total Marks</label>

                <input
                  type="number"
                  name="total_marks"
                  value={formData.total_marks}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4"
                  placeholder="Ex:250"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 mt-16">
            <button className="px-8 py-3 rounded-lg bg-gray-100 text-gray-600">
              Cancel
            </button>

            <button
              onClick={handleNext}
              className="px-10 py-3 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
            >
              Next
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
