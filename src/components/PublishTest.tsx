import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { publishTest } from "../services/testService";

export default function PublishTest() {
  const [mode, setMode] = useState("publish");
  const [duration, setDuration] = useState("custom");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const navigate = useNavigate();

  const handleConfirm = async () => {
    const testId = localStorage.getItem("testId");

    if (!testId) {
      alert("Test ID not found");
      return;
    }

    try {
      await publishTest(testId);

      alert("Test Published Successfully");

      localStorage.removeItem("testId");

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert("Unable to publish test");
    }
  };

  return (
    <div className="bg-white rounded-xl p-8">
      {/* Tabs */}

      <div className="inline-flex border border-gray-300 rounded-lg overflow-hidden mb-10">
        <button
          onClick={() => setMode("publish")}
          className={`px-8 py-3 ${
            mode === "publish"
              ? "bg-indigo-50 text-indigo-600 font-medium"
              : "bg-white text-gray-500"
          }`}
        >
          Publish Now
        </button>

        <button
          onClick={() => setMode("schedule")}
          className={`px-8 py-3 ${
            mode === "schedule"
              ? "bg-indigo-50 text-indigo-600 font-medium"
              : "bg-white text-gray-500"
          }`}
        >
          Schedule Publish
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Live Until</h2>

      <p className="text-gray-500 mb-8">
        Choose how long this test should remain available on the platform.
      </p>

      <div className="grid grid-cols-2 gap-y-8">
        <label className="flex items-center gap-3">
          <input
            type="radio"
            checked={duration === "always"}
            onChange={() => setDuration("always")}
          />
          Always Available
        </label>

        <label className="flex items-center gap-3">
          <input
            type="radio"
            checked={duration === "3weeks"}
            onChange={() => setDuration("3weeks")}
          />
          3 Weeks
        </label>

        <label className="flex items-center gap-3">
          <input
            type="radio"
            checked={duration === "1week"}
            onChange={() => setDuration("1week")}
          />
          1 Week
        </label>

        <label className="flex items-center gap-3">
          <input
            type="radio"
            checked={duration === "1month"}
            onChange={() => setDuration("1month")}
          />
          1 Month
        </label>

        <label className="flex items-center gap-3">
          <input
            type="radio"
            checked={duration === "2weeks"}
            onChange={() => setDuration("2weeks")}
          />
          2 Weeks
        </label>

        <label className="flex items-center gap-3">
          <input
            type="radio"
            checked={duration === "custom"}
            onChange={() => setDuration("custom")}
          />
          Custom Duration
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-10">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-12 border border-gray-300 rounded-lg px-4"
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="h-12 border border-gray-300 rounded-lg px-4"
        />
      </div>

      <div className="flex justify-end gap-5 mt-12">
        <button className="px-10 py-3 rounded-lg bg-gray-100">Cancel</button>

        <button
          onClick={handleConfirm}
          className="px-12 py-3 rounded-lg bg-indigo-500 text-white"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
