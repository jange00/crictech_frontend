import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaGoogle, FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";

const SignupCard = ({ title, subtitle, formData, onChange, onSubmit, showPassword, onTogglePassword, onGoogleLogin, onFacebookLogin }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"
  >
    <div className="relative grid gap-10 p-8 sm:p-12 md:p-14 md:grid-cols-[1.2fr_1fr]">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col justify-between rounded-2xl bg-blue-600 p-8 text-white shadow-lg"
      >
        <div className="space-y-5">
          <div>
            <h1 className="text-4xl font-bold sm:text-5xl leading-tight">{title}</h1>
            <p className="mt-3 text-base text-blue-100 sm:text-lg">{subtitle}</p>
          </div>
          <div className="mt-8 space-y-5 text-sm text-blue-100">
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
              <p className="font-semibold text-white text-base mb-2">Join CricTech Community</p>
              <p className="leading-relaxed">
                Get started with AI-powered biomechanics analysis, track your progress, and access advanced coaching
                tools to improve your cricket performance.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-white/20 px-5 py-3 backdrop-blur-sm border border-white/20">
              <span className="text-xs uppercase tracking-wider text-blue-100 font-semibold">Join</span>
              <span className="text-sm font-bold text-white">Players & Coaches</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-5"
      >
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Full Name
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400 text-sm">
              <FaUser />
            </span>
            <input
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={onChange}
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-11 py-3.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 hover:border-slate-300"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Email Address
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400 text-sm">
              <FaEnvelope />
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="coach@crictech.com"
              value={formData.email}
              onChange={onChange}
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-11 py-3.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 hover:border-slate-300"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="uppercase tracking-wider">Password</span>
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400 text-sm">
              <FaLock />
            </span>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={onChange}
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-11 pr-12 py-3.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 hover:border-slate-300"
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Confirm Password
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400 text-sm">
              <FaLock />
            </span>
            <input
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={onChange}
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-11 py-3.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 hover:border-slate-300"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98, y: 0 }}
          className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
        >
          Create Account
        </motion.button>

        <div className="space-y-5">
          <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
            <span className="h-px flex-1 bg-slate-200" />
            Or continue with
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              type="button"
              onClick={onGoogleLogin}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97, y: 0 }}
              className="flex items-center justify-center gap-2.5 rounded-xl border-2 border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition-all hover:border-blue-400 hover:text-blue-600 hover:shadow-md"
            >
              <FaGoogle className="text-lg text-[#DB4437]" />
              Google
            </motion.button>
            <motion.button
              type="button"
              onClick={onFacebookLogin}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97, y: 0 }}
              className="flex items-center justify-center gap-2.5 rounded-xl border-2 border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition-all hover:border-blue-400 hover:text-blue-600 hover:shadow-md"
            >
              <FaFacebookF className="text-lg text-[#1877F2]" />
              Facebook
            </motion.button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 leading-relaxed">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline">
            Sign in here
          </Link>
        </p>

        <p className="text-center text-xs text-slate-400 leading-relaxed">
          By creating an account, you agree to our
          <a className="mx-1 font-semibold text-blue-600 hover:text-blue-500 hover:underline" href="/terms">
            Terms of Service
          </a>
          and
          <a className="ml-1 font-semibold text-blue-600 hover:text-blue-500 hover:underline" href="/privacy">
            Privacy Policy
          </a>
        </p>
      </motion.form>
    </div>
  </motion.div>
);

export default SignupCard;

