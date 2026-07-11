import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTests } from "../services/testService";
import navim from "../assets/navicon.png";
import profileimg from "../assets/profileicn.png";

interface Test {
  id: string;
  name: string;
  subject: string;
  topics: string[];
  status: string;
  created_at: string;
}

function Dashboard() {
  const navigate = useNavigate();

  const [tests, setTests] = useState<Test[]>([]);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await getTests();

      if (res.status === "success") {
        setTests(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border border-gray-300">
        <div className="p-5">
          <img src={navim} alt="Nav Icon" />
        </div>

        <nav className="px-4 space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium border border-gray-300 border border-gray-300-blue-200">
            Dashboard
          </button>

          <button
            onClick={() => navigate("/create-test")}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100"
          >
            Test Creation
          </button>

          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100">
            Test Tracking
          </button>
        </nav>
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
                alt="Profile"
              />

              <div>
                <p className="font-semibold">Alex Wando</p>
                <p className="text-sm text-gray-500">Admin</p>
              </div>
            </div>
          </div>
        </header>

        <section className="p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-sm text-gray-500">Dashboard / Test List</p>
              <h1 className="text-2xl font-semibold mt-2">All Tests</h1>
            </div>

            <button
              onClick={() => navigate("/create-test")}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg"
            >
              + Create New Test
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-300 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border border-gray-300 hover:bg-gray-50">
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">
                    Name
                  </th>
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">
                    Subject
                  </th>
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-gray-500 font-medium">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody>
                {tests.map((test) => (
                  <tr key={test.id}>
                    <td className="px-6 py-5">{test.name}</td>
                    <td className="px-6 py-5">{test.subject}</td>
                    <td className="px-6 py-5">{test.status}</td>
                    <td className="px-6 py-5">
                      {new Date(test.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
