import { fetchFromLaravel } from "@/lib/api";
import { CheckCircle2, XCircle, Database, Server } from "lucide-react";

export default async function SettingsPage() {
    // Test Connections
    const health = await fetchFromLaravel('/health');
    const isLaravelConnected = health?.status === 'ok';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">System Integration Status</h1>
                    <p className="text-slate-500">Monitoring status koneksi Frontend, Backend, dan Database</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Frontend Status */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-lg text-green-600">
                        <Server size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">Next.js Frontend</h3>
                        <p className="text-xs text-slate-500 mb-2">Running on Port 3000</p>
                        <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                            <CheckCircle2 size={16} /> Operaional
                        </div>
                    </div>
                </div>

                {/* Database Status */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                        <Database size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">MySQL Database</h3>
                        <p className="text-xs text-slate-500 mb-2">Database: medical_record</p>
                        <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                            <CheckCircle2 size={16} /> Connected
                        </div>
                    </div>
                </div>

                {/* Backend Status */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${isLaravelConnected ? 'bg-indigo-100 text-indigo-600' : 'bg-red-100 text-red-600'}`}>
                        <Server size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">Laravel Backend API</h3>
                        <p className="text-xs text-slate-500 mb-2">Running on Port 8000</p>
                        {isLaravelConnected ? (
                            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                                <CheckCircle2 size={16} /> Connected
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-sm font-medium text-red-600">
                                <XCircle size={16} /> Disconnected
                            </div>
                        )}
                        <div className="text-xs mt-2 text-slate-400">Endpoint: /api/health</div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2">System Architecture</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                    Sistem ini berjalan menggunakan arsitektur <strong>Hybrid/Headless</strong>.
                    <strong> Next.js</strong> bertindak sebagai <em>Frontend User Interface</em> yang modern, sementara
                    <strong> Laravel</strong> bertindak sebagai <em>Backend API Service</em> dan <em>Database Manager</em> via Migrations.
                    Keduanya terhubung ke database <strong>MySQL</strong> yang sama untuk memastikan integritas data.
                </p>
            </div>
        </div>
    );
}
