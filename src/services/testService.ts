import api from "../api/axios";

export const getSubjects = async () => {
  const { data } = await api.get("/subjects");
  return data;
};

export const getTopics = async (subjectId: string) => {
  const { data } = await api.get(`/topics/subject/${subjectId}`);
  return data;
};

export const getSubTopics = async (topicIds: string[]) => {
  const { data } = await api.post("/sub-topics/multi-topics", {
    topicIds,
  });
  return data;
};

export const createTest = async (payload: any) => {
  const { data } = await api.post("/tests", payload);
  return data;
};

// NEW

export const getTestById = async (id: string) => {
  const { data } = await api.get(`/tests/${id}`);
  return data;
};

export const updateTest = async (id: string, payload: any) => {
  const { data } = await api.put(`/tests/${id}`, payload);
  return data;
};

export const createQuestions = async (questions: any[]) => {
  const { data } = await api.post("/questions/bulk", {
    questions,
  });
  return data;
};

export const fetchBulkQuestions = async (question_ids: string[]) => {
  const { data } = await api.post("/questions/fetchBulk", {
    question_ids,
  });
  return data;
};

export const publishTest = async (id: string) => {
  const { data } = await api.put(`/tests/${id}`, {
    status: "live",
  });
  return data;
};

export const getTests = async () => {
  const response = await api.get("/tests");
  return response.data;
};