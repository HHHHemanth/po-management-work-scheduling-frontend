import React from "react";
import { useNavigate, Link } from "react-router-dom";
import BlurText from "../components/BlurText";
import Cubes from "../components/Cubes";
import GradientText from "../components/GradientText";
import { AuroraText } from "../components/aurora-text";
import LogoLoop from '../components/LogoLoop';
import { Highlighter } from "@/components/highlighter";
import {
    ShieldCheck,
    Users,
    UserCheck,
    Lock,
    Server,
    Trash2,
    Activity,
    Cloud,
    Clock,
    FileText
} from "lucide-react";
const cmtiLogos = [
  {
    src: "/cmtiRunningLogo.png",
    alt: "CMTI Running Logo",
    href: "/"
  }
];
function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen overflow-x-hidden text-white font-sans bg-slate-900">
            {/* Background Image Setup similar to LoginPage */}
            <div className="fixed inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/background.jpg')" }}
                />
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <Cubes
                        gridSize={10}
                        maxAngle={45}
                        radius={5}
                        borderStyle="2px solid rgba(255,255,255,0.4)"
                        faceColor="transparent"
                        rippleColor="rgba(255,255,255,0.6)"
                        rippleSpeed={1.5}
                        autoAnimate
                        rippleOnClick
                    />
                </div>
                <div
                    className="absolute inset-0 bg-cover bg-center z-20 pointer-events-none"
                    style={{ backgroundImage: "url('/background2.png')" }}
                />
                {/* Dark overlay to make content readable while keeping background visible */}
                <div className="absolute inset-0  z-30 pointer-events-none " />
            </div>

            {/* Main Content Area */}
            <div className="relative z-40 pointer-events-auto">

                {/* Header/Nav (Logos) */}
                <header className="px-6 py-6 md:px-12 flex justify-between items-center h-24">
                    <Link to="/">
                        <img
                            src="/cmtilogo.png"
                            alt="CMTI Logo"
                            className="h-14 md:h-16 object-contain cursor-pointer drop-shadow-lg "
                        />
                    </Link>
                    <img
                        src="/mhilogo.png"
                        alt="MHI Logo"
                        className="h-14 md:h-16 object-contain "
                    />
                </header>

                <section className="min-h-[85vh] flex items-center justify-center px-6 text-center pt-4 pb-20">
                    <div
                        className="relative bg-white/5 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-12 text-center max-w-xl w-full z-40"
                    >
                        <div className="flex justify-center items-center text-center z-40">
                            <BlurText
                                text="WELCOME TO"
                                delay={500}
                                animateBy="words"
                                direction="top"
                                className="text-4xl md:text-5xl font-extrabold mt-10 mb-6 text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
                            />
                        </div>
                        <GradientText
                            colors={["#1D4DD6", "#1D4DD6", "#000766"]}
                            animationSpeed={4}
                            showBorder={false}
                            className="text-3xl md:text-3xl mb-1 drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
                        >
                            PO MANAGEMENT SYSTEM
                        </GradientText>
                        <p className="text-gray-200 mb-10">
                            Smart, Secure, Efficient purchase order management.
                        </p>
                        <div className="flex flex-col items-center gap-4 mt-8">

  {/* Admin + Staff */}
  <div className="flex flex-col md:flex-row gap-6 justify-center w-full">

    <button
      onClick={() => navigate("/login/admin")}
      className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      Login as Admin
    </button>

    <button
      onClick={() => navigate("/login/staff")}
      className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      Login as Staff
    </button>

  </div>

  {/* Project Associate */}
  <button
    onClick={() => navigate("/login/project-associate")}
    className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
  >
    Login as Project Associate
  </button>

</div>
                    </div>
                </section>

                {/* 2. Roles Section */}
                <section className=" py-24 px-6 bg-white text-gray-900 border-t-4 border-blue-500">
                    <div className="max-w-6xl mx-auto z-10 relative">
                        <div className="text-center mb-16">
                            
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"><AuroraText>Access</AuroraText> Levels </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Tailored interfaces and responsibilities for every role in the <br/><Highlighter action="underline" color="#E6BD67">
  <span className="text-xl text-gray-600 max-w-2xl mx-auto">
    Organization...
  </span>
</Highlighter></p>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Admin Role */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                                    <ShieldCheck size={32} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors">Admin</h3>
                                <ul className="space-y-4 text-gray-600">
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-500 mt-1">•</span>
                                        <span className="leading-snug">Full system control</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-500 mt-1">•</span>
                                        <span className="leading-snug">Manage staff & project associates</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-500 mt-1">•</span>
                                        <span className="leading-snug">Restore soft deleted data</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-500 mt-1">•</span>
                                        <span className="leading-snug">View analytics & overall progress</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Staff Role */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                                    <Users size={32} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 group-hover:text-indigo-600 transition-colors">Staff</h3>
                                <ul className="space-y-4 text-gray-600">
                                    <li className="flex items-start gap-3">
                                        <span className="text-indigo-500 mt-1">•</span>
                                        <span className="leading-snug">Create and manage records</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-indigo-500 mt-1">•</span>
                                        <span className="leading-snug">Assign works to project associates</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-indigo-500 mt-1">•</span>
                                        <span className="leading-snug">Upload and manage documents</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-indigo-500 mt-1">•</span>
                                        <span className="leading-snug">Monitor task progress</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Project Associate Role */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                                <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                                    <UserCheck size={32} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 group-hover:text-sky-600 transition-colors">Project Associate</h3>
                                <ul className="space-y-4 text-gray-600">
                                    <li className="flex items-start gap-3">
                                        <span className="text-sky-500 mt-1">•</span>
                                        <span className="leading-snug">View assigned works</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-sky-500 mt-1">•</span>
                                        <span className="leading-snug">Update progress status</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-sky-500 mt-1">•</span>
                                        <span className="leading-snug">Add delay reasons after deadline</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-sky-500 mt-1">•</span>
                                        <span className="leading-snug">Upload work-related documents</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Features Section */}
                <section className="-mb-10 py-24 px-6 bg-slate-50 border-t border-slate-200 text-gray-900">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"><AuroraText>System</AuroraText> Capabilities</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Built with modern technologies ensuring security, reliability, and <Highlighter action="underline" color="#E6BD67">
  <span className="text-xl text-gray-600 max-w-2xl mx-auto">
    Performance...
  </span>
</Highlighter></p>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { icon: <Lock />, title: "Secure JWT Auth", desc: "Robust JWT-based authentication for secure session management.", color: "bg-blue-100 text-blue-600" },
                                { icon: <Server />, title: "Role-Based Access", desc: "Strict RBAC ensuring users only access what they're explicitly permitted to.", color: "bg-indigo-100 text-indigo-600" },
                                { icon: <Trash2 />, title: "Soft Delete & Restore", desc: "Accidental deletions are a thing of the past with our soft delete mechanics.", color: "bg-rose-100 text-rose-600" },
                                { icon: <Activity />, title: "Automated Status", desc: "Dynamic status updates (Green / Yellow / Red) based on real-time task progress.", color: "bg-emerald-100 text-emerald-600" },
                                { icon: <Cloud />, title: "Supabase Cloud", desc: "Reliable and scalable document storage powered by Supabase Cloud.", color: "bg-sky-100 text-sky-600" },
                                { icon: <Clock />, title: "Deadline Tracking", desc: "Keep projects on track with advanced deadline monitoring and delay management.", color: "bg-amber-100 text-amber-600" },
                                { icon: <FileText />, title: "Swagger API Docs", desc: "Clean, comprehensive Swagger API documentation for seamless integration.", color: "bg-purple-100 text-purple-600" },
                            ].map((feature, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex items-start gap-4">
                                    <div className={`p-3 rounded-lg flex-shrink-0 ${feature.color}`}>
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-1">{feature.title}</h4>
                                        <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
<div className="relative h-[50px] mb-15 overflow-visible">

<div className="relative w-full py-0 overflow-hidden z-10">
  <LogoLoop
    logos={[
      { src: "/cmtiRunningLogo.png", alt: "CMTI Logo" }
    ]}
    speed={80}
    direction="right"
    logoHeight={40}
    gap={70}
    hoverSpeed={5}
    scaleOnHover={true}
    fadeOut={false}
    ariaLabel="CMTI Running Logo"
  />
</div>
</div>
                {/* 4. Footer Section */}
                <footer className="bg-slate-900 text-slate-300 -mt-7 py-20 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">

                            <div className="md:col-span-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <img src="/cmtilogo.png" alt="CMTI Logo" className="h-10 bg-white/10 p-1.5 rounded-lg" />
                                    <img src="/mhilogo.png" alt="MHI Logo" className="h-10 bg-white/10 p-1.5 rounded-lg" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">PO Management System</h3>
                                <p className="text-sm text-slate-400 max-w-sm mb-4">
                                    Designed for scalable enterprise-level PR/PO and Task Management workflows.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                                <ul className="space-y-2 text-sm z-50 relative pointer-events-auto">
                                    <li><Link to="/login/admin" className="hover:text-blue-400 transition-colors">Admin Login</Link></li>
                                    <li><Link to="/login/staff" className="hover:text-blue-400 transition-colors">Staff Login</Link></li>
                                    <li><Link to="/login/project-associate" className="hover:text-blue-400 transition-colors">Project Associate Login</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-semibold mb-4">Contact & Support</h4>
                                <ul className="space-y-2 text-sm z-50 relative pointer-events-auto">
                                    <li className="flex items-center gap-2">
                                        support@cmti.res.in
                                    </li>
                                    <li className="flex items-center gap-2">
                                        +91 (80) 9876 5234
                                    </li>
                                    <li className="mt-4 flex flex-col gap-1">
                                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                                        <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
                                    </li>
                                </ul>
                            </div>

                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                            <p>&copy; {new Date().getFullYear()} Central Manufacturing Technology Institute. All rights reserved.</p>
                            <p className="mt-2 md:mt-0 font-mono">v1.0.0</p>
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    );
}

export default LandingPage;
