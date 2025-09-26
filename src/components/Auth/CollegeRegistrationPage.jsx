// src/components/Auth/CollegeRegistrationPage.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Building2, KeyRound, Mail, User, Shield } from "lucide-react";
import { supabase } from "../../supabaseClient";

const CollegeRegistrationPage = () => {
  const [formData, setFormData] = useState({
    collegeName: "",
    collegeId: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    setLoading(true);

    try {
      // --- FIX: Changed keys to snake_case ---
      // This matches what the updated SQL trigger will expect.
      const {  error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: 'admin',
            full_name: formData.fullName,
            college_id_text: formData.collegeId, // Use a different key to avoid confusion with UUID
            college_name: formData.collegeName
          },
        },
      });

      if (error) throw error;

      toast.success("Registration successful! Please check your email to verify your account.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-500/30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl animate-pulse delay-2000"></div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col md:flex-row">
        {/* Left brand panel */}
        <aside className="hidden md:flex md:w-1/2 lg:w-7/12 flex-col justify-between bg-gradient-to-br from-purple-700/20 via-indigo-700/20 to-purple-700/20 backdrop-blur-xl p-8 lg:p-12 border-r border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
          <header>
            <p className="text-sm tracking-widest text-purple-400 uppercase">
              AttendTrack
            </p>
            <h1 className="mt-2 text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
              Register your college admin account
            </h1>
            <p className="mt-4 max-w-md text-sm text-gray-300">
              Fast, secure attendance management. Create your institution and
              the first admin in minutes.
            </p>
          </header>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 md:mt-0">
            <li className="rounded-lg border border-purple-500/30 bg-purple-700/20 p-4 shadow-lg shadow-purple-500/20 hover:scale-105 transition-transform">
              <div className="flex items-center gap-3 text-purple-300">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">Secure by design</span>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Protected flows and best practices for account creation.
              </p>
            </li>
            <li className="rounded-lg border border-blue-500/30 bg-blue-700/20 p-4 shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform">
              <div className="flex items-center gap-3 text-blue-300">
                <Building2 className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Institution-first
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Set your unique College ID to identify your organization.
              </p>
            </li>
            <li className="rounded-lg border border-pink-500/30 bg-pink-700/20 p-4 shadow-lg shadow-pink-500/20 hover:scale-105 transition-transform">
              <div className="flex items-center gap-3 text-pink-300">
                <KeyRound className="h-5 w-5" />
                <span className="text-sm font-medium">Admin controls</span>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Create the first admin and manage access with confidence.
              </p>
            </li>
          </ul>

          <footer className="mt-8 text-xs text-gray-400">
            © {new Date().getFullYear()} AttendTrack. All rights reserved.
          </footer>
        </aside>

        {/* Right form panel */}
        <section className="flex w-full md:w-1/2 lg:w-5/12 items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-lg rounded-2xl border border-purple-500/30 bg-black/50 shadow-[0_0_25px_rgba(139,92,246,0.4)] backdrop-blur-xl">
            <div className="border-b border-purple-500/20 px-6 py-5">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
                Register Your College
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Create an admin account for AttendTrack
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 p-6">
              {/* Inputs */}
              {[
                {
                  id: "collegeName",
                  icon: Building2,
                  placeholder: "College Name",
                  type: "text",
                },
                {
                  id: "collegeId",
                  icon: Shield,
                  placeholder: "Unique College ID (e.g., IITB-01)",
                  type: "text",
                },
                {
                  id: "fullName",
                  icon: User,
                  placeholder: "Admin's Full Name",
                  type: "text",
                },
                {
                  id: "email",
                  icon: Mail,
                  placeholder: "Admin's Email Address",
                  type: "email",
                },
                {
                  id: "password",
                  icon: KeyRound,
                  placeholder: "Password",
                  type: "password",
                },
                {
                  id: "confirmPassword",
                  icon: KeyRound,
                  placeholder: "Confirm Password",
                  type: "password",
                },
              ].map(({ id, icon: Icon, placeholder, type }) => (
                <div key={id} className="relative">
                  <input
                    id={id}
                    name={id}
                    type={type}
                    placeholder={placeholder}
                    required
                    value={formData[id]}
                    onChange={handleChange}
                    className="peer w-full rounded-lg border border-purple-500/30 bg-black/60 px-4 py-3 pl-10 text-white placeholder-gray-400 outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/50 transition"
                  />
                  <Icon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 peer-focus:text-fuchsia-400 transition" />
                </div>
              ))}

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-3 font-semibold text-white shadow-lg shadow-fuchsia-500/30 hover:scale-[1.02] hover:shadow-fuchsia-500/50 transition disabled:opacity-50"
              >
                {loading ? "Registering..." : "Create Account"}
              </button>

              <p className="text-center text-xs text-gray-400">
                By creating an account you agree to our Terms and Privacy.
              </p>

              <p className="text-center text-sm text-gray-300">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-fuchsia-400 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default CollegeRegistrationPage;