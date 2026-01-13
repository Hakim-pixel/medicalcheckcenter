"use client";

import Link from "next/link";
import { ArrowRight, Activity, Shield, Clock, Stethoscope } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Activity className="text-white" size={24} />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              MedRecordSys
            </span>
          </div>
          <Link
            href="/login"
            className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all flex items-center gap-2 text-sm sm:text-base"
          >
            Login <span className="hidden sm:inline">System</span> <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm border border-blue-100">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Sistem Informasi Kesehatan V1.0
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                Masa Depan <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Rekam Medis
                </span>
              </h1>

              <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
                Platform terintegrasi untuk rumah sakit modern. Kelola data pasien, rekam medis, dan operasional dalam satu dashboard yang efisien.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/login"
                  className="px-8 py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-500/30 text-center"
                >
                  Mulai Sekarang
                </Link>
                <button className="px-8 py-4 rounded-xl bg-white text-slate-700 font-bold text-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-center">
                  Pelajari Lebih Lanjut
                </button>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 blur-3xl rounded-full"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 transform rotate-2 hover:rotate-0 transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=2600&q=80"
                  alt="Dashboard Preview"
                  className="rounded-xl w-full"
                />

                {/* Floating Cards */}
                <div className="absolute -left-8 top-20 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-bounce-slow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                      <Shield size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Data Security</div>
                      <div className="font-bold text-slate-900">Encrypted</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-8 bottom-20 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-bounce-slow delay-75">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Uptime</div>
                      <div className="font-bold text-slate-900">99.9%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Fitur Unggulan</h2>
            <p className="text-slate-500">Dirancang khusus untuk kebutuhan fasilitas kesehatan modern dengan standar keamanan tinggi.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Stethoscope,
                title: "Diagnosis Cepat",
                desc: "Input diagnosa dan resep obat dengan antarmuka yang intuitif dan cepat."
              },
              {
                icon: Shield,
                title: "Keamanan Data",
                desc: "Data pasien tersimpan aman dengan enkripsi standar industri kesehatan."
              },
              {
                icon: Activity,
                title: "Monitoring Real-time",
                desc: "Pantau antrian dan status pemeriksaan secara langsung dari dashboard."
              }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  <f.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>© 2025 Sistem Rekam Medis Digital. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
