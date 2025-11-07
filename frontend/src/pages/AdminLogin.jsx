// AdminLogin.jsx (Updated)
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdTokenResult();
      
      if (!token.claims.admin) {
        throw new Error("Access restricted to authorized administrators");
      }

      navigate("/admin-dashboard");
    } catch (error) {
      setError(error.code === 'auth/wrong-password' ? 
        "Invalid credentials" : 
        "Administrator access required");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-xl w-96">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Admin Portal</h1>
          <p className="mt-2 text-gray-500">College Management System</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Institutional Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="admin@college.edu"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 
                      disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Authenticating..." : "Secure Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;