import { useEffect, useState } from "react";
import {
  getSubjects,
  getTopics,
  getSubTopics,
  updateTest,
} from "../services/testService";

interface Props {
  open: boolean;
  onClose: () => void;
  testId?: string | null;
  initialData?: {
    type?: string;
    subject?: string;
    name?: string;
    topic?: string;
    subTopic?: string;
    duration?: string | number;
    difficulty?: string;
    wrongMarks?: number | string;
    unattempted?: number | string;
    correctMarks?: number | string;
    totalQuestions?: number | string;
    totalMarks?: number | string;
  };
  onSaved?: (updatedData: any) => void;
}

type FormState = {
  type: string;
  subject: string;
  name: string;
  topic: string;
  subTopic: string;
  duration: string;
  difficulty: string;
  wrongMarks: number | string;
  unattempted: number | string;
  correctMarks: number | string;
  totalQuestions: string;
  totalMarks: string;
};

const defaultFormState = (): FormState => ({
  type: "chapterwise",
  subject: "",
  name: "",
  topic: "",
  subTopic: "",
  duration: "",
  difficulty: "easy",
  wrongMarks: -1,
  unattempted: 0,
  correctMarks: 5,
  totalQuestions: "",
  totalMarks: "",
});

export default function EditTestModal({
  open,
  onClose,
  testId,
  initialData,
  onSaved,
}: Props) {
  const [formData, setFormData] = useState<FormState>(defaultFormState);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [subTopics, setSubTopics] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setFormData({
      ...defaultFormState(),
      type: initialData?.type ?? "chapterwise",
      name: initialData?.name ?? "",
      duration: String(initialData?.duration ?? ""),
      difficulty: initialData?.difficulty ?? "easy",
      wrongMarks: initialData?.wrongMarks ?? -1,
      unattempted: initialData?.unattempted ?? 0,
      correctMarks: initialData?.correctMarks ?? 5,
      totalQuestions: String(initialData?.totalQuestions ?? ""),
      totalMarks: String(initialData?.totalMarks ?? ""),
    });

    setTopics([]);
    setSubTopics([]);
    loadSubjects();
  }, [open, initialData]);

  const loadSubjects = async () => {
    try {
      const response = await getSubjects();

      if (response.status === "success") {
        const subjectList = response.data;
        setSubjects(subjectList);

        const subjectName = initialData?.subject;
        if (subjectName) {
          const matchedSubject = subjectList.find(
            (item : any) => item.name?.toLowerCase() === subjectName.toLowerCase(),
          );

          if (matchedSubject?.id) {
            setFormData((prev) => ({ ...prev, subject: matchedSubject.id }));
            await loadTopics(matchedSubject.id);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loadTopics = async (subjectId: string) => {
    try {
      const response = await getTopics(subjectId);

      if (response.status === "success") {
        const topicList = response.data;
        setTopics(topicList);

        const topicName = initialData?.topic;
        if (topicName) {
          const matchedTopic = topicList.find(
            (item : any) => item.name?.toLowerCase() === topicName.toLowerCase(),
          );

          if (matchedTopic?.id) {
            setFormData((prev) => ({ ...prev, topic: matchedTopic.id }));
            await loadSubTopics(matchedTopic.id);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loadSubTopics = async (topicId: string) => {
    try {
      const response = await getSubTopics([topicId]);

      if (response.status === "success") {
        const subTopicList = response.data;
        setSubTopics(subTopicList);

        const subTopicName = initialData?.subTopic;
        if (subTopicName) {
          const matchedSubTopic = subTopicList.find(
            (item : any) => item.name?.toLowerCase() === subTopicName.toLowerCase(),
          );

          if (matchedSubTopic?.id) {
            setFormData((prev) => ({ ...prev, subTopic: matchedSubTopic.id }));
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubjectChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const subjectId = e.target.value;

    setFormData((prev) => ({ ...prev, subject: subjectId, topic: "", subTopic: "" }));
    setTopics([]);
    setSubTopics([]);

    if (subjectId) {
      await loadTopics(subjectId);
    }
  };

  const handleTopicChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const topicId = e.target.value;

    setFormData((prev) => ({ ...prev, topic: topicId, subTopic: "" }));
    setSubTopics([]);

    if (topicId) {
      await loadSubTopics(topicId);
    }
  };

  const handleSubmit = async () => {
    if (!testId) {
      alert("Test id is missing.");
      return;
    }

    if (!formData.name.trim()) {
      alert("Enter Test Name");
      return;
    }

    if (!formData.subject) {
      alert("Select Subject");
      return;
    }

    if (!formData.topic) {
      alert("Select Topic");
      return;
    }

    if (!formData.subTopic) {
      alert("Select Sub Topic");
      return;
    }

    if (!formData.duration) {
      alert("Enter Duration");
      return;
    }

    if (!formData.totalQuestions) {
      alert("Enter Number of Questions");
      return;
    }

    if (!formData.totalMarks) {
      alert("Enter Total Marks");
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        name: formData.name.trim(),
        type: formData.type,
        subject: formData.subject,
        topics: formData.topic ? [formData.topic] : [],
        sub_topics: formData.subTopic ? [formData.subTopic] : [],
        correct_marks: Number(formData.correctMarks),
        wrong_marks: Number(formData.wrongMarks),
        unattempt_marks: Number(formData.unattempted),
        difficulty: formData.difficulty,
        total_time: Number(formData.duration),
        total_marks: Number(formData.totalMarks),
        total_questions: Number(formData.totalQuestions),
        status: "draft",
      };

      const response = await updateTest(testId, payload);

      if (response.status === "success") {
        const selectedSubject = subjects.find((item) => item.id === formData.subject);
        const selectedTopic = topics.find((item) => item.id === formData.topic);
        const selectedSubTopic = subTopics.find(
          (item) => item.id === formData.subTopic,
        );

        onSaved?.({
          type: formData.type,
          subject: selectedSubject?.name ?? formData.subject,
          topic: selectedTopic?.name ?? formData.topic,
          subTopic: selectedSubTopic?.name ?? formData.subTopic,
          totalTime: formData.duration,
          totalQuestions: formData.totalQuestions,
          totalMarks: formData.totalMarks,
          difficulty: formData.difficulty,
        });

        alert(response.message || "Test updated successfully");
        onClose();
      }
    } catch (err: any) {
      console.log(err);
      alert(err.response?.data?.message || "Unable to update test.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div className="bg-white w-full max-w-3xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center px-8 py-5 border border-gray-300-b">
          <h2 className="text-lg font-semibold">Edit Test creation</h2>

          <button onClick={onClose} className="text-2xl text-gray-500">
            ×
          </button>
        </div>

        <div className="p-8 overflow-y-auto h-[calc(85vh-80px)]">
          <div className="inline-flex border border-gray-300 rounded-xl overflow-hidden mb-10">
            <button
              onClick={() => setFormData((prev) => ({ ...prev, type: "chapterwise" }))}
              className={`px-8 py-3 ${
                formData.type === "chapterwise"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-white"
              }`}
            >
              Chapter Wise
            </button>

            <button
              onClick={() => setFormData((prev) => ({ ...prev, type: "pyq" }))}
              className={`px-8 py-3 ${
                formData.type === "pyq" ? "bg-blue-50 text-blue-600" : ""
              }`}
            >
              PYQ
            </button>

            <button
              onClick={() => setFormData((prev) => ({ ...prev, type: "mock" }))}
              className={`px-8 py-3 ${
                formData.type === "mock" ? "bg-blue-50 text-blue-600" : ""
              }`}
            >
              Mock Test
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-8">
            <div>
              <label className="block mb-2 font-medium">Subject</label>

              <select
                name="subject"
                value={formData.subject}
                onChange={handleSubjectChange}
                className="w-full h-12 border border-gray-300 rounded-lg px-4"
              >
                <option value="">Choose from Drop-down</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">Name of Test</label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-12 border border-gray-300 rounded-lg px-4"
                placeholder="Enter name of Test"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Topic</label>

              <select
                name="topic"
                value={formData.topic}
                onChange={handleTopicChange}
                className="w-full h-12 border border-gray-300 rounded-lg px-4"
              >
                <option value="">Choose from Drop-down</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">Sub Topic</label>

              <select
                name="subTopic"
                value={formData.subTopic}
                onChange={handleChange}
                className="w-full h-12 border border-gray-300 rounded-lg px-4"
              >
                <option value="">Choose from Drop-down</option>
                {subTopics.map((subTopic) => (
                  <option key={subTopic.id} value={subTopic.id}>
                    {subTopic.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">Duration (Minutes)</label>

              <input
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full h-12 border border-gray-300 rounded-lg px-4"
                placeholder="Enter the time"
              />
            </div>

            <div>
              <label className="block mb-5 font-medium">Test Difficulty Level</label>

              <div className="flex gap-10">
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

          <div className="mt-12">
            <h3 className="font-semibold mb-6">Marking Scheme:</h3>

            <div className="grid grid-cols-5 gap-6">
              <div>
                <label className="block mb-2">Wrong Answer</label>

                <input
                  type="number"
                  name="wrongMarks"
                  value={formData.wrongMarks}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4"
                />
              </div>

              <div>
                <label className="block mb-2">Unattempted</label>

                <input
                  type="number"
                  name="unattempted"
                  value={formData.unattempted}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4"
                />
              </div>

              <div>
                <label className="block mb-2">Correct Answer</label>

                <input
                  type="number"
                  name="correctMarks"
                  value={formData.correctMarks}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4"
                />
              </div>

              <div>
                <label className="block mb-2">No of Questions</label>

                <input
                  name="totalQuestions"
                  value={formData.totalQuestions}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4"
                />
              </div>

              <div>
                <label className="block mb-2">Total Marks</label>

                <input
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-5 mt-12">
            <button
              onClick={onClose}
              className="px-10 py-3 rounded-lg bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-12 py-3 rounded-lg bg-indigo-500 text-white disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}