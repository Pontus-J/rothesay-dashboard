import React, { useState, useMemo } from 'react';
import {
    LineChart, BarChart, PieChart, AreaChart, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, Line, Bar, Pie, Cell, Area, ResponsiveContainer,
    ReferenceLine, ComposedChart, Scatter
} from "recharts";
import {
    TrendingUp, TrendingDown, Info, DollarSign, Building2,
    Shield, Cpu, Users, BarChart3, Target, Layers, Goal, Activity, ArrowLeft
} from "lucide-react";

// --- Design System Tokens (V2 Dark Mode) ---
const colors = {
    bgBase: "#050B14", // Very deep dark blue/black
    bgPanel: "#0D1B2A", // Brighter panel
    glassBg: "rgba(13, 27, 42, 0.6)",
    glassBorder: "rgba(255, 255, 255, 0.1)",
    primaryAcc: "#13A385", // Rothesay Teal/Green
    secondaryAcc: "#1B7B6B",
    gold: "#C5A76B",
    textPrimary: "#FFFFFF",
    textMuted: "#8892B0",
    success: "#13A385",
    danger: "#FF4D4D",
};

// --- Custom Components ---
const GlassPanel = ({ children, className = "", onClick = null }) => (
    <div
        onClick={onClick}
        className={`bg-[#0D1B2A]/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 ${onClick ? 'cursor-pointer hover:bg-[#0D1B2A]/80 hover:border-white/20 hover:-translate-y-1' : ''} ${className}`}
    >
        {children}
    </div>
);

const Badge = ({ isFavourable, children }) => (
    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white shadow-sm
    ${isFavourable ? 'bg-[#13A385]' : 'bg-[#FF4D4D]'}`}>
        {isFavourable ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
        <span>{children}</span>
    </span>
);

const SectionHeading = ({ title }) => (
    <h2 className="text-2xl font-light tracking-wide text-white mb-8 border-l-4 border-[#13A385] pl-4">{title}</h2>
);

// --- Data Stubs ---
const costBreakdown = [
    { name: "Deal Acquisition", value: 80, color: "#13A385", description: "Pricing, legal, due diligence" },
    { name: "Investment Management", value: 55, color: "#1B7B6B", description: "In-house + external managers" },
    { name: "Policy Administration", value: 50, color: "#2E5B5B", description: "Pensioner payroll, data, comms" },
    { name: "Technology & Data", value: 35, color: "#C5A76B", description: "Proprietary platform, cyber" },
    { name: "Regulatory & Compliance", value: 30, color: "#8892B0", description: "Solvency II, audit, PRA levies" },
    { name: "Corporate Overheads", value: 27, color: "#4A5568", description: "Finance, HR, premises" },
];

const efficiencyTrend = [
    { year: "FY2022", costPerAUM: 4.9, acqCostPct: 4.5, costPerPolicy: 95 },
    { year: "FY2023", costPerAUM: 5.2, acqCostPct: 1.6, costPerPolicy: 124 },
    { year: "FY2024", costPerAUM: 3.9, acqCostPct: 1.2, costPerPolicy: 80 },
];

const marketData = [
    { year: "2020", volume: 31.4, deals: 142 },
    { year: "2021", volume: 27.7, deals: 170 },
    { year: "2022", volume: 27.8, deals: 226 },
    { year: "2023", volume: 49.1, deals: 227 },
    { year: "2024", volume: 47.8, deals: 298 },
    { year: "2025F", volume: 47.5, deals: 325 },
];

const competitors = [
    { name: "Rothesay", premiums: 10.3, deals: 6, avgDeal: 1722, strategy: "Mega-deals & back-books", highlight: true },
    { name: "L&G", premiums: 8.4, deals: 38, avgDeal: 221, strategy: "Broad market, gilts-based" },
    { name: "PIC", premiums: 8.0, deals: 25, avgDeal: 321, strategy: "Mid-to-large schemes" },
    { name: "Aviva", premiums: 7.8, deals: 64, avgDeal: 122, strategy: "High-volume mid-market" },
    { name: "Just Group", premiums: 5.4, deals: 129, avgDeal: 42, strategy: "Small scheme specialist" },
    { name: "Standard Life", premiums: 5.1, deals: 14, avgDeal: 362, strategy: "Re-entrant, growing" },
];

const waterfallData = [
    { name: "Best Estimate\nLiabilities", base: 0, cost: 0, profit: 0, benefit: 0, total: 0, primary: 920, type: "primary" },
    { name: "Expense\nLoading", base: 920, cost: 25, profit: 0, benefit: 0, total: 0, type: "cost" },
    { name: "Risk Margin", base: 945, cost: 30, profit: 0, benefit: 0, total: 0, type: "cost" },
    { name: "Acquisition\nCosts", base: 975, cost: 8, profit: 0, benefit: 0, total: 0, type: "cost" },
    { name: "Profit\nTarget", base: 983, cost: 0, profit: 45, benefit: 0, total: 0, type: "profit" },
    { name: "Matching\nAdjustment", base: 953, cost: 0, profit: 0, benefit: 75, total: 0, type: "benefit" },
    { name: "Longevity\nReinsurance", base: 938, cost: 0, profit: 0, benefit: 15, total: 0, type: "benefit" },
    { name: "Deal\nPremium", base: 0, cost: 0, profit: 0, benefit: 0, total: 938, type: "total" },
];

const dealSizeEconomics = [
    { size: 50, costPct: 0.60, label: "Just Group avg" },
    { size: 100, costPct: 0.40, label: "" },
    { size: 200, costPct: 0.30, label: "Aviva avg" },
    { size: 500, costPct: 0.18, label: "PIC avg" },
    { size: 1000, costPct: 0.12, label: "" },
    { size: 1700, costPct: 0.08, label: "Rothesay avg" },
    { size: 3000, costPct: 0.05, label: "" },
    { size: 5000, costPct: 0.04, label: "Mega-deal" },
];

const strategyMap = [
    { name: "Just", x: 8, y: 85, size: 54, color: "#4A5568" },
    { name: "Aviva", x: 22, y: 70, size: 78, color: "#4A5568" },
    { name: "L&G", x: 35, y: 55, size: 84, color: "#4A5568" },
    { name: "PIC", x: 45, y: 40, size: 80, color: "#4A5568" },
    { name: "Std Life", x: 50, y: 25, size: 51, color: "#4A5568" },
    { name: "Rothesay", x: 85, y: 12, size: 103, color: "#13A385" },
];

const scaleData = Array.from({ length: 15 }, (_, i) => {
    const aum = 50 + i * 5;
    const fixedCosts = 150;
    const variableRate = 1.5;
    const fixedBps = fixedCosts / (aum * 10);
    const totalBps = fixedBps + variableRate;
    return { aum, fixedBps: +fixedBps.toFixed(1), variableBps: variableRate, totalBps: +totalBps.toFixed(1) };
});

export default function RothesayDashboard() {
    const [view, setView] = useState("landing"); // "landing" | "dashboard"
    const [activeTab, setActiveTab] = useState(0);
    const tabs = ["Business Overview", "Cost Drivers", "Deal Economics"];

    const openTab = (idx) => {
        setActiveTab(idx);
        setView("dashboard");
    };

    return (
        <div className="min-h-screen bg-[#050B14] text-white selection:bg-[#13A385] selection:text-white" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>

            {view === "landing" && (
                <div className="absolute inset-0 bg-radial-gradient from-[#0D1B2A] to-[#050B14] z-0 flex flex-col items-center justify-center p-8 overflow-hidden animate-in fade-in duration-1000">

                    {/* Ambient Glows */}
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#13A385] rounded-full blur-[180px] opacity-20 pointer-events-none"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#C5A76B] rounded-full blur-[200px] opacity-10 pointer-events-none"></div>

                    <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">

                        <div className="mb-20 text-center space-y-6">
                            <h1 className="text-sm font-bold tracking-[0.3em] uppercase text-[#13A385] mb-2 flex items-center justify-center">
                                <div className="w-12 h-1 bg-[#13A385] mr-6"></div>
                                Rothesay
                                <div className="w-12 h-1 bg-[#13A385] ml-6"></div>
                            </h1>
                            <h2 className="text-6xl md:text-8xl font-light tracking-tight text-white leading-tight">
                                Providing long-term <br /><span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#13A385]">security</span>
                            </h2>
                            <p className="text-xl text-[#8892B0] max-w-2xl mx-auto font-light pt-6">
                                A cinematic, multi-dimensional analysis into the cost economics that drive the UK's largest specialist pension insurer.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                            {[
                                { title: "Business Overview", desc: "KPIs, cost structure, and our standing in the £1.4tn BPA market.", icon: LayoutDashboardIcon },
                                { title: "Cost Drivers", desc: "Interactive scenario engine and value-driving cost classifications.", icon: CpuIcon },
                                { title: "Deal Economics", desc: "Pricing power anatomy and structural acquisition advantages.", icon: BarChartIcon }
                            ].map((mod, idx) => (
                                <GlassPanel key={idx} onClick={() => openTab(idx)} className="group flex flex-col items-center text-center p-12 h-80 justify-center">
                                    <div className="w-16 h-16 rounded-2xl bg-[#13A385]/10 flex items-center justify-center mb-8 group-hover:bg-[#13A385]/30 transition-colors group-hover:scale-110 duration-500">
                                        <mod.icon className="w-8 h-8 text-[#13A385]" />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-[#13A385] transition-colors">{mod.title}</h3>
                                    <p className="text-[#8892B0] text-sm leading-relaxed">{mod.desc}</p>
                                </GlassPanel>
                            ))}
                        </div>

                    </div>
                </div>
            )}

            {view === "dashboard" && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20 relative z-10">

                    {/* Header */}
                    <header className="sticky top-0 z-50 bg-[#050B14]/80 backdrop-blur-xl border-b border-white/10 px-8 pt-6 pb-2">
                        <div className="max-w-7xl mx-auto flex justify-between items-end">
                            <div className="flex items-center space-x-6">
                                <button
                                    onClick={() => setView("landing")}
                                    className="flex items-center space-x-2 text-[#8892B0] hover:text-white transition-colors pb-1 pr-6 border-r border-white/10"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span className="text-sm font-medium tracking-wide">Home</span>
                                </button>
                                <div>
                                    <h1 className="text-xl font-bold tracking-widest uppercase text-white flex items-center">
                                        <div className="w-2.5 h-2.5 bg-[#13A385] mr-3"></div>
                                        Rothesay
                                    </h1>
                                    <p className="text-xs uppercase tracking-widest text-[#13A385] mt-1 font-semibold">Cost Economics</p>
                                </div>
                            </div>
                            <p className="text-xs text-[#8892B0] pb-1">Data: Annual Report 2024 · LCP</p>
                        </div>
                    </header>

                    {/* Tab Nav */}
                    <div className="sticky top-[85px] z-40 bg-[#050B14]/60 backdrop-blur-lg border-b border-white/5 items-center px-8 transition-all">
                        <div className="max-w-7xl mx-auto flex space-x-12">
                            {tabs.map((tab, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveTab(idx)}
                                    className={`py-5 text-sm font-semibold tracking-wider uppercase transition-all duration-300 relative ${activeTab === idx ? "text-[#13A385]" : "text-[#8892B0] hover:text-white"
                                        }`}
                                >
                                    {tab}
                                    {activeTab === idx && (
                                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#13A385] animate-in zoom-in duration-300" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <main className="max-w-7xl mx-auto px-8 py-16 relative">
                        <div className="transition-opacity duration-300">
                            {activeTab === 0 && <TabOverview />}
                            {activeTab === 1 && <TabCostDrivers />}
                            {activeTab === 2 && <TabDealEconomics />}
                        </div>
                    </main>

                </div>
            )}
        </div>
    );
}

// --- Tab 1: Business Overview ---
function TabOverview() {
    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Row 1: KPIs */}
            <section className="grid grid-cols-4 gap-6">
                <GlassPanel>
                    <p className="text-xs uppercase tracking-widest text-[#8892B0] mb-4 font-semibold">AUM</p>
                    <div className="flex items-baseline space-x-4 mb-2">
                        <h3 className="text-5xl font-light text-white" style={{ fontVariantNumeric: 'tabular-nums' }}>£70.8<span className="text-2xl text-[#8892B0] font-light">bn</span></h3>
                    </div>
                    <div className="flex items-center space-x-3 mt-4">
                        <Badge isFavourable={true}>16% YoY</Badge>
                        <p className="text-sm text-[#8892B0]">from £61.2bn</p>
                    </div>
                </GlassPanel>

                <GlassPanel>
                    <p className="text-xs uppercase tracking-widest text-[#8892B0] mb-4 font-semibold">Operating Profit</p>
                    <div className="flex items-baseline space-x-4 mb-2">
                        <h3 className="text-5xl font-light text-white" style={{ fontVariantNumeric: 'tabular-nums' }}>£1,779<span className="text-2xl text-[#8892B0] font-light">m</span></h3>
                    </div>
                    <div className="flex items-center space-x-3 mt-4">
                        <Badge isFavourable={true}>31% YoY</Badge>
                        <p className="text-sm text-[#8892B0]">from £1,358m</p>
                    </div>
                </GlassPanel>

                <GlassPanel>
                    <p className="text-xs uppercase tracking-widest text-[#8892B0] mb-4 font-semibold">Total OPEX</p>
                    <div className="flex items-baseline space-x-4 mb-2">
                        <h3 className="text-5xl font-light text-white" style={{ fontVariantNumeric: 'tabular-nums' }}>£277<span className="text-2xl text-[#8892B0] font-light">m</span></h3>
                    </div>
                    <div className="flex items-center space-x-3 mt-4">
                        <Badge isFavourable={true}>13% YoY</Badge>
                        <p className="text-sm text-[#8892B0]">Opex + Acq</p>
                    </div>
                </GlassPanel>

                <GlassPanel className="border-[#13A385]/30">
                    <p className="text-xs uppercase tracking-widest text-[#13A385] mb-4 font-bold">Cost Efficiency</p>
                    <div className="flex items-baseline space-x-4 mb-2">
                        <h3 className="text-5xl font-semibold text-white drop-shadow-[0_0_15px_rgba(19,163,133,0.5)]" style={{ fontVariantNumeric: 'tabular-nums' }}>3.9 <span className="text-2xl text-[#13A385] font-light">bps</span></h3>
                    </div>
                    <div className="flex items-center space-x-3 mt-4">
                        <Badge isFavourable={true}>from 5.2</Badge>
                        <p className="text-sm text-[#8892B0]">Cost / AUM</p>
                    </div>
                </GlassPanel>
            </section>

            {/* Row 2: Cost Structure */}
            <section>
                <SectionHeading title="Cost Structure & Efficiency" />
                <div className="grid grid-cols-2 gap-8">
                    <GlassPanel className="flex flex-col h-[460px]">
                        <h3 className="text-xl font-light mb-1">Cost Structure Breakdown</h3>
                        <p className="text-xs text-[#8892B0] mb-8 uppercase tracking-widest">(Modelled Estimate)</p>
                        <div className="flex-1 min-h-0 relative px-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={costBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="65%"
                                        outerRadius="90%"
                                        paddingAngle={3}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {costBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity duration-300 cursor-pointer drop-shadow-md" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0D1B2A', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                        itemStyle={{ color: 'white' }}
                                        labelStyle={{ color: '#8892B0', marginBottom: '8px' }}
                                        formatter={(val, name) => [`£${val}m`, name]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col mt-4">
                                <span className="text-4xl font-light text-white">£277m</span>
                                <span className="text-xs uppercase tracking-widest text-[#13A385] font-bold mt-2">Total Edge</span>
                            </div>
                        </div>
                    </GlassPanel>

                    <GlassPanel className="flex flex-col h-[460px]">
                        <h3 className="text-xl font-light mb-8">Structural Efficiency Trend</h3>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={efficiencyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#8892B0', fontSize: 13 }} dy={15} />
                                    <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fill: '#13A385', fontSize: 13 }} dx={-15} />
                                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#C5A76B', fontSize: 13 }} dx={15} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0D1B2A', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                        itemStyle={{ color: 'white' }}
                                        labelStyle={{ color: '#8892B0', marginBottom: '8px' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '30px', fontSize: '13px', color: '#8892B0' }} />
                                    <Line yAxisId="left" type="monotone" name="Cost/AUM (bps)" dataKey="costPerAUM" stroke="#13A385" strokeWidth={4} dot={{ r: 5, fill: '#050B14', strokeWidth: 3, stroke: '#13A385' }} activeDot={{ r: 8, fill: '#13A385' }} />
                                    <Line yAxisId="right" type="monotone" name="Acq. Cost (% Premium)" dataKey="acqCostPct" stroke="#C5A76B" strokeWidth={4} dot={{ r: 5, fill: '#050B14', strokeWidth: 3, stroke: '#C5A76B' }} activeDot={{ r: 8, fill: '#C5A76B' }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassPanel>
                </div>
            </section>

            {/* Row 3: Market Context */}
            <section>
                <SectionHeading title="Market Context" />
                <div className="grid grid-cols-2 gap-8">
                    <GlassPanel className="flex flex-col h-[460px] relative">
                        <h3 className="text-xl font-light mb-8">UK BPA Market Dynamics</h3>

                        <div className="absolute top-20 right-8 bg-[#13A385]/10 backdrop-blur-md p-4 rounded-xl border border-[#13A385]/30 z-10 max-w-[220px]">
                            <div className="flex items-start space-x-3">
                                <Info className="w-5 h-5 text-[#13A385] shrink-0 mt-0.5" />
                                <p className="text-sm text-white font-medium leading-relaxed">£1.4tn of uninsured DB liabilities remain</p>
                            </div>
                        </div>

                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={marketData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#8892B0', fontSize: 13 }} dy={15} />
                                    <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fill: '#8892B0', fontSize: 13 }} dx={-10} />
                                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#C5A76B', fontSize: 13 }} dx={10} />
                                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#0D1B2A', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} itemStyle={{ color: 'white' }} labelStyle={{ color: '#8892B0', marginBottom: '8px' }} />
                                    <Bar yAxisId="left" dataKey="volume" name="Volume (£bn)" fill="#2E5B5B" radius={[6, 6, 0, 0]} maxBarSize={45}>
                                        {marketData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.year.includes('F') ? '#1B7B6B' : (index === marketData.length - 2 ? '#13A385' : '#2E5B5B')} fillOpacity={entry.year.includes('F') ? 0.4 : 1} />
                                        ))}
                                    </Bar>
                                    <Line yAxisId="right" type="monotone" name="Deal Count" dataKey="deals" stroke="#C5A76B" strokeWidth={3} dot={{ r: 4, fill: '#0D1B2A', strokeWidth: 2, stroke: '#C5A76B' }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassPanel>

                    <GlassPanel className="flex flex-col h-[460px]">
                        <h3 className="text-xl font-light mb-8">Competitive Positioning</h3>
                        <div className="flex-1 overflow-auto pr-4">
                            <table className="w-full text-base">
                                <thead>
                                    <tr className="border-b border-white/10 text-[#8892B0] text-xs uppercase tracking-widest font-semibold">
                                        <th className="py-4 text-left">Provider</th>
                                        <th className="py-4 text-right">Vol (£bn)</th>
                                        <th className="py-4 text-right">Deals</th>
                                        <th className="py-4 text-right pr-4">Avg (£m)</th>
                                        <th className="py-4 pl-4 text-left">Strategy Focus</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {competitors.map((comp, idx) => (
                                        <tr key={idx} className={`transition-colors hover:bg-white/5
                      ${comp.highlight ? 'bg-[#13A385]/10 font-medium' : ''}`}>
                                            <td className="py-5 font-semibold text-white">
                                                {comp.highlight ? (
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-1.5 h-6 bg-[#13A385] rounded-full shadow-[0_0_10px_#13A385]"></div>
                                                        <span className="text-[#13A385] text-lg">{comp.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="pl-4.5 text-[#8892B0]">{comp.name}</span>
                                                )}
                                            </td>
                                            <td className={`py-5 text-right tabular-nums ${comp.highlight ? 'text-white' : 'text-[#8892B0]'}`}>{comp.premiums.toFixed(1)}</td>
                                            <td className={`py-5 text-right tabular-nums ${comp.highlight ? 'text-white' : 'text-[#8892B0]'}`}>{comp.deals}</td>
                                            <td className={`py-5 text-right tabular-nums pr-4 ${comp.highlight ? 'text-white font-bold' : 'text-[#8892B0]'}`}>{comp.avgDeal}</td>
                                            <td className="py-5 pl-4 text-[#8892B0] text-sm font-light">{comp.strategy}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassPanel>
                </div>
            </section>
        </div>
    );
}

const SliderConfig = ({ label, min, max, step, unit, valueKey, value, onChange }) => (
    <div className="flex items-center py-3 space-x-6">
        <div className="w-2/5 text-sm font-medium text-[#8892B0] uppercase tracking-wider">{label}</div>
        <div className="w-1/2 flex items-center">
            <input
                type="range"
                min={min} max={max} step={step}
                value={value}
                onChange={(e) => onChange(valueKey, e.target.value)}
                className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#13A385] hover:accent-white transition-all outline-none"
            />
        </div>
        <div className="w-1/4 text-right tabular-nums font-semibold text-white text-lg bg-white/5 py-1 px-3 rounded-lg border border-white/10">
            {value}<span className="text-xs text-[#13A385] ml-1.5 font-bold">{unit}</span>
        </div>
    </div>
);

// --- Tab 2: Cost Drivers ---
function TabCostDrivers() {
    const [inputs, setInputs] = useState({
        newBiz: 15.7,
        avgDealSize: 1700,
        winRate: 15,
        costPerQuote: 1.5,
        costPerPolicy: 80,
        techSpend: 35,
        matchingAdj: 125,
        expenseInflation: 3.0
    });

    const handleSlider = (key, value) => {
        setInputs(prev => ({ ...prev, [key]: parseFloat(value) }));
    };

    const modelMetrics = useMemo(() => {
        const newBizPremium = inputs.newBiz;
        const dealsWon = Math.max(1, Math.round(newBizPremium * 1000 / inputs.avgDealSize));
        const projectedAUM = 70.8 + newBizPremium - 3.8;

        const newPolicies = newBizPremium * 1e9 / 50000;
        const totalPolicies = 1004920 + newPolicies;

        // Inflation impact on baseline costs (vs 3% assumed target)
        const inflationMultiplier = 1 + ((inputs.expenseInflation - 3.0) / 100);
        const fixedOverheads = (55 + 30 + 27) * inflationMultiplier;

        // Win Rate impact on Acquisition Costs
        // Lower win rate = more bids required to win the deal target = higher total acquisition costs
        const bidsRequired = dealsWon / (inputs.winRate / 100);
        const acqCostTotal = bidsRequired * inputs.costPerQuote * inflationMultiplier;

        const adminCostTotal = (inputs.costPerPolicy * totalPolicies / 1e6) * inflationMultiplier;
        const techSpendDynamic = inputs.techSpend * inflationMultiplier;

        const totalCosts = adminCostTotal + techSpendDynamic + fixedOverheads + acqCostTotal;
        const costPerAUM = totalCosts / (projectedAUM * 10);
        const acqCostPct = acqCostTotal / (newBizPremium * 1000) * 100;

        const maBenefit = inputs.matchingAdj / 10000 * projectedAUM * 1000;
        const pricingAdvBps = inputs.matchingAdj - 100;

        const expenseLoading = (adminCostTotal + techSpendDynamic + fixedOverheads) / (projectedAUM * 10);

        return {
            totalCosts: Math.round(totalCosts),
            costPerAUM: costPerAUM.toFixed(1),
            costPerPolicy: Math.round(totalCosts * 1e6 / totalPolicies),
            acqCostPct: acqCostPct.toFixed(1),
            dealsWon,
            newBizPremium: newBizPremium.toFixed(1),
            projectedAUM: projectedAUM.toFixed(1),
            aumPerEmployee: Math.round(projectedAUM * 1000 / 560),
            maBenefit: Math.round(maBenefit),
            pricingAdvBps: Math.round(pricingAdvBps),
            expenseLoading: expenseLoading.toFixed(1),
            totalPolicies: Math.round(totalPolicies),
        };
    }, [inputs]);

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Target Classification */}
            <section>
                <SectionHeading title="Cost Classification Matrix" />
                <div className="grid grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-[#13A385] font-light text-xl flex items-center mb-8 border-b border-[#13A385]/30 pb-3"><Goal className="mr-3 w-6 h-6" /> Value Accelerators</h3>
                        {[
                            { title: "Pricing & Actuarial", cost: "£6.1m", desc: "Firepower → higher win rate", icon: Target },
                            { title: "Investment Origination", cost: "£45m", desc: "Illiquid sourcing → MA", icon: Layers },
                            { title: "Platform Tech", cost: "£35m", desc: "Automation → cost leverage", icon: Cpu },
                        ].map((item, i) => (
                            <GlassPanel key={i} className="border-t-2 border-[#13A385] !p-5 hover:border-[#13A385]">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center space-x-3 text-white font-medium"><item.icon className="w-5 h-5 text-[#13A385]" /> <span className="text-lg">{item.title}</span></div>
                                    <span className="text-xl font-bold tabular-nums text-white">{item.cost}</span>
                                </div>
                                <p className="text-sm text-[#8892B0] ml-8">{item.desc}</p>
                            </GlassPanel>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[#C5A76B] font-light text-xl flex items-center mb-8 border-b border-[#C5A76B]/30 pb-3"><Shield className="mr-3 w-6 h-6" /> Regulatory Anchors</h3>
                        {[
                            { title: "Regulatory Reporting", cost: "£12m", desc: "QRTs, SFCR, Solvency II", icon: Layers },
                            { title: "Internal Model", cost: "£5m", desc: "PRA validation demands", icon: BarChart3 },
                            { title: "External Audit", cost: "£7m", desc: "IFRS 17 complexity", icon: Shield },
                        ].map((item, i) => (
                            <GlassPanel key={i} className="border-t-2 border-[#C5A76B] !p-5 hover:border-[#C5A76B]">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center space-x-3 text-white font-medium"><item.icon className="w-5 h-5 text-[#C5A76B]" /> <span className="text-lg">{item.title}</span></div>
                                    <span className="text-xl font-bold tabular-nums text-white">{item.cost}</span>
                                </div>
                                <p className="text-sm text-[#8892B0] ml-8">{item.desc}</p>
                            </GlassPanel>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[#FF4D4D] font-light text-xl flex items-center mb-8 border-b border-[#FF4D4D]/30 pb-3"><TrendingDown className="mr-3 w-6 h-6" /> Efficiency Targets</h3>
                        {[
                            { title: "Policy Administration", cost: "£50m", desc: "Drive to £55/policy", icon: Users },
                            { title: "Deal Quotation", cost: "£12m", desc: "Streamline sub-£500m", icon: Activity },
                            { title: "Corporate Overhead", cost: "£27m", desc: "Shrink as % of AUM", icon: Building2 },
                        ].map((item, i) => (
                            <GlassPanel key={i} className="border-t-2 border-[#FF4D4D] !p-5 hover:border-[#FF4D4D]">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center space-x-3 text-white font-medium"><item.icon className="w-5 h-5 text-[#FF4D4D]" /> <span className="text-lg">{item.title}</span></div>
                                    <span className="text-xl font-bold tabular-nums text-white">{item.cost}</span>
                                </div>
                                <p className="text-sm text-[#8892B0] ml-8">{item.desc}</p>
                            </GlassPanel>
                        ))}
                    </div>
                </div>
            </section>

            {/* Scenario Engine */}
            <section>
                <SectionHeading title="Dynamic Scenario Engine" />
                <GlassPanel className="!p-10 bg-gradient-to-br from-[#0D1B2A] to-[#0A1118] border border-[#13A385]/20 overflow-hidden relative shadow-[0_0_50px_rgba(19,163,133,0.05)]">

                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#13A385] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

                    <div className="grid grid-cols-2 gap-20 relative z-10">
                        <div>
                            <h3 className="text-white text-lg font-light tracking-widest uppercase mb-8 pb-4 border-b border-white/10 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-3 text-[#13A385]" /> Growth Assumptions
                            </h3>
                            <div className="space-y-5">
                                <SliderConfig label="Annual New Biz" min={5} max={25} step={0.5} unit="£bn" valueKey="newBiz" value={inputs.newBiz} onChange={handleSlider} />
                                <SliderConfig label="Avg Deal Size" min={100} max={5000} step={100} unit="£m" valueKey="avgDealSize" value={inputs.avgDealSize} onChange={handleSlider} />
                                <SliderConfig label="Cost / Quote" min={0.5} max={5.0} step={0.1} unit="£m" valueKey="costPerQuote" value={inputs.costPerQuote} onChange={handleSlider} />
                                <SliderConfig label="Market Win Rate" min={5} max={40} step={1} unit="%" valueKey="winRate" value={inputs.winRate} onChange={handleSlider} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white text-lg font-light tracking-widest uppercase mb-8 pb-4 border-b border-white/10 flex items-center">
                                <Cpu className="w-5 h-5 mr-3 text-[#13A385]" /> Operation Levers
                            </h3>
                            <div className="space-y-5">
                                <SliderConfig label="Cost / Policy" min={30} max={150} step={5} unit="£" valueKey="costPerPolicy" value={inputs.costPerPolicy} onChange={handleSlider} />
                                <SliderConfig label="Tech Spend" min={15} max={60} step={1} unit="£m" valueKey="techSpend" value={inputs.techSpend} onChange={handleSlider} />
                                <SliderConfig label="Matching Adj" min={50} max={200} step={5} unit="bps" valueKey="matchingAdj" value={inputs.matchingAdj} onChange={handleSlider} />
                                <SliderConfig label="1Y Exp Inflation" min={1.5} max={5.0} step={0.1} unit="%" valueKey="expenseInflation" value={inputs.expenseInflation} onChange={handleSlider} />
                            </div>
                        </div>
                    </div>
                </GlassPanel>
            </section>

            {/* Impact Output */}
            <section className="grid grid-cols-3 gap-8">
                <GlassPanel className="border-t-4 border-t-[#13A385]">
                    <h3 className="text-xl font-light mb-8 flex items-center text-white"><Activity className="w-6 h-6 mr-3 text-[#13A385]" /> Operating Metrics</h3>
                    <div className="space-y-2">
                        <MetricRow label="Total OPEX" current="£277m" scenario={`£${modelMetrics.totalCosts}m`} delta={277 - modelMetrics.totalCosts} reverse={true} />
                        <MetricRow label="Cost / AUM" current="3.9 bps" scenario={`${modelMetrics.costPerAUM} bps`} delta={3.9 - parseFloat(modelMetrics.costPerAUM)} reverse={true} />
                        <MetricRow label="Cost / Policy" current="£275" scenario={`£${modelMetrics.costPerPolicy}`} delta={275 - modelMetrics.costPerPolicy} reverse={true} />
                        <MetricRow label="Acq / Premium" current="1.2%" scenario={`${modelMetrics.acqCostPct}%`} delta={(1.2 - parseFloat(modelMetrics.acqCostPct)).toFixed(1)} reverse={true} />
                    </div>
                </GlassPanel>

                <GlassPanel className="border-t-4 border-t-white">
                    <h3 className="text-xl font-light mb-8 flex items-center text-white"><TrendingUp className="w-6 h-6 mr-3 text-white" /> Scaling Outcomes</h3>
                    <div className="space-y-2">
                        <MetricRow label="Deals Won" current="6" scenario={modelMetrics.dealsWon} delta={modelMetrics.dealsWon - 6} />
                        <MetricRow label="New Biz Prem" current="£15.7bn" scenario={`£${modelMetrics.newBizPremium}bn`} delta={(parseFloat(modelMetrics.newBizPremium) - 15.7).toFixed(1)} />
                        <MetricRow label="Projected AUM" current="£70.8bn" scenario={`£${modelMetrics.projectedAUM}bn`} delta={(parseFloat(modelMetrics.projectedAUM) - 70.8).toFixed(1)} />
                        <MetricRow label="AUM / FTE" current="£131m" scenario={`£${modelMetrics.aumPerEmployee}m`} delta={modelMetrics.aumPerEmployee - 131} />
                    </div>
                </GlassPanel>

                <GlassPanel className="border-t-4 border-t-[#C5A76B]">
                    <h3 className="text-xl font-light mb-8 flex items-center text-white"><DollarSign className="w-6 h-6 mr-3 text-[#C5A76B]" /> Pricing Power</h3>
                    <div className="space-y-2">
                        <MetricRow label="MA Benefit" current="£884m" scenario={`£${modelMetrics.maBenefit}m`} delta={modelMetrics.maBenefit - 884} />
                        <MetricRow label="Pricing Edge" current="+25 bps" scenario={`+${modelMetrics.pricingAdvBps} bps`} delta={modelMetrics.pricingAdvBps - 25} />
                        <MetricRow label="BEL Exp Load" current="30 bps" scenario={`${modelMetrics.expenseLoading} bps`} delta={30 - parseFloat(modelMetrics.expenseLoading)} reverse={true} />
                    </div>
                </GlassPanel>
            </section>

            {/* Scale Effects Area */}
            <section>
                <GlassPanel className="h-[450px] flex flex-col pt-8">
                    <div className="mb-8 flex justify-between items-end">
                        <div>
                            <h3 className="text-2xl font-light mb-2">Scale Leverage on Unit Costs</h3>
                            <p className="text-sm text-[#8892B0] uppercase tracking-widest">Growing the book structurally suppresses fixed operational costs</p>
                        </div>
                        <div className="flex items-center space-x-4 text-sm font-semibold text-white">
                            <div className="flex items-center"><div className="w-4 h-4 rounded bg-[#13A385] mr-2 opactity-50"></div>Fixed</div>
                            <div className="flex items-center"><div className="w-4 h-4 rounded bg-[#ffffff] mr-2"></div>Variable</div>
                        </div>
                    </div>
                    <div className="flex-1 min-h-0 relative -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={scaleData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorFixed2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#13A385" stopOpacity={0.6} />
                                        <stop offset="95%" stopColor="#13A385" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="aum" type="number" domain={[50, 120]} tickFormatter={v => `£${v}bn`} tick={{ fill: '#8892B0', fontSize: 13 }} dy={15} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#8892B0', fontSize: 13 }} tickFormatter={v => `${v}bps`} dx={-10} axisLine={false} tickLine={false} />
                                <Tooltip formatter={(value, name) => [`${value} bps`, name]} contentStyle={{ backgroundColor: '#0D1B2A', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} itemStyle={{ color: 'white' }} labelStyle={{ color: '#8892B0', marginBottom: '8px' }} />
                                <ReferenceLine x={70.8} stroke="white" strokeDasharray="5 5" label={{ position: 'top', value: 'Rothesay Today', fill: 'white', fontSize: 13, fontWeight: 300, offset: 20 }} />
                                <Area type="monotone" dataKey="fixedBps" stackId="1" stroke="#13A385" strokeWidth={3} fill="url(#colorFixed2)" name="Fixed Costs" />
                                <Area type="monotone" dataKey="variableBps" stackId="1" stroke="#ffffff" strokeWidth={2} fill="transparent" name="Variable Costs" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassPanel>
            </section>
        </div >
    );
}

const MetricRow = ({ label, current, scenario, delta, reverse = false }) => {
    const isPositive = delta > 0;
    const isZero = delta === 0 || delta === "0.0";
    const isGood = reverse ? !isPositive && !isZero : isPositive && !isZero;
    const dVal = (typeof delta === 'number' && delta % 1 !== 0) ? delta.toFixed(1) : delta;

    return (
        <div className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors -mx-4 px-4 rounded-xl">
            <span className="text-base font-medium text-[#8892B0]">{label}</span>
            <div className="flex items-center space-x-6">
                <span className="text-sm line-through text-[#4A5568] hidden md:inline-block tabular-nums font-mono">{current}</span>
                <span className="text-xl font-light text-white tabular-nums">{scenario}</span>
                {!isZero ? (
                    <span className={`px-3 py-1 rounded-md text-xs font-bold tabular-nums w-16 text-center tracking-wider
            ${isGood ? 'bg-[#13A385]/20 text-[#13A385] border border-[#13A385]/30' : 'bg-[#FF4D4D]/20 text-[#FF4D4D] border border-[#FF4D4D]/30'}`}>
                        {isPositive ? '+' : ''}{dVal}
                    </span>
                ) : (
                    <span className="px-3 py-1 rounded-md text-xs font-bold text-[#8892B0] bg-white/10 w-16 text-center tabular-nums">
                        -
                    </span>
                )}
            </div>
        </div>
    );
};

const AcqTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#0D1B2A] border border-white/10 rounded-2xl p-4 shadow-xl">
                <p className="text-[#8892B0] text-sm mb-2">{`Deal Size: £${label}m`}</p>
                <p className="text-white text-base font-semibold">{`Acquisition Cost: ${payload[0].value}%`}</p>
            </div>
        );
    }
    return null;
};

// --- Tab 3: Deal Economics ---
function TabDealEconomics() {
    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <section className="grid grid-cols-2 gap-8">

                {/* Waterfall Chart */}
                <GlassPanel className="flex flex-col h-[550px]">
                    <div className="mb-10">
                        <h3 className="text-2xl font-light mb-2">Anatomy of a £1bn BPA Deal Pricing</h3>
                        <p className="text-sm text-[#8892B0] uppercase tracking-widest">How structural edges win mega-deals</p>
                    </div>
                    <div className="flex-1 min-h-0 pr-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={waterfallData} margin={{ top: 20, right: 10, left: -20, bottom: 50 }} barSize={40}>
                                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8892B0', fontSize: 11 }} interval={0}
                                    tickFormatter={entry => entry.split('\n')[0]} dy={15} angle={-35} textAnchor="end" />
                                <YAxis domain={['auto', 'auto']} tick={{ fill: '#8892B0', fontSize: 13 }} axisLine={false} tickLine={false} tickFormatter={v => `£${v}m`} dx={-10} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#0D1B2A', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                    itemStyle={{ color: 'white' }}
                                    labelStyle={{ color: '#8892B0', marginBottom: '8px' }}
                                    formatter={(val, name, props) => {
                                        const { payload } = props;
                                        return [`£${payload[payload.type]}m`, payload.name.replace('\n', ' ')];
                                    }}
                                />

                                <Bar dataKey="base" stackId="a" fill="transparent" />
                                <Bar dataKey="primary" stackId="a" fill="white" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="cost" stackId="a" fill="#4A5568" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="profit" stackId="a" fill="#C5A76B" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="benefit" stackId="a" fill="#13A385" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="total" stackId="a" fill="white" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassPanel>

                {/* Acquisition Cost Bubble/Line */}
                <GlassPanel className="flex flex-col h-[550px]">
                    <div className="mb-10">
                        <h3 className="text-2xl font-light mb-2">Acquisition Cost Decay</h3>
                        <p className="text-sm text-[#8892B0] uppercase tracking-widest">Opex / Premium shrinks logarithmically at scale</p>
                    </div>
                    <div className="flex-1 min-h-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={dealSizeEconomics} margin={{ top: 30, right: 30, left: 10, bottom: 20 }}>
                                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="size" type="category" ticks={[50, 200, 500, 1700, 5000]} tick={{ fill: '#8892B0', fontSize: 13 }} tickFormatter={v => `£${v}m`} dy={15} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#8892B0', fontSize: 13 }} tickFormatter={v => `${v}%`} dx={-10} axisLine={false} tickLine={false} />
                                <Tooltip
                                    content={<AcqTooltip />}
                                />
                                <Line type="monotone" dataKey="costPct" stroke="white" strokeWidth={3} dot={false} activeDot={{ r: 8, fill: '#13A385', strokeWidth: 0 }} />
                                <Scatter dataKey="costPct" fill="#13A385" shape="circle" >
                                    {dealSizeEconomics.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.label.includes('Rothesay') ? '#13A385' : (entry.label ? 'white' : 'transparent')} />
                                    ))}
                                </Scatter>
                            </ComposedChart>
                        </ResponsiveContainer>

                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-[15%] left-[10%] text-xs font-medium text-[#8892B0]">Just Grp</div>
                            <div className="absolute top-[35%] left-[28%] text-xs font-medium text-[#8892B0]">Aviva</div>
                            <div className="absolute top-[55%] left-[45%] text-xs font-medium text-[#8892B0]">PIC</div>
                            <div className="absolute top-[75%] left-[65%] text-sm font-bold text-[#050B14] bg-[#13A385] px-3 py-1.5 rounded shadow-[0_0_15px_rgba(19,163,133,0.5)]">Rothesay avg</div>
                        </div>
                    </div>
                </GlassPanel>
            </section>

            {/* Strategy Map */}
            <section>
                <div className="p-[2px] rounded-3xl bg-gradient-to-r from-[#13A385]/50 via-transparent to-white/20">
                    <GlassPanel className="h-[600px] flex flex-col relative overflow-hidden bg-black !border-none !rounded-[22px] !p-12 shadow-2xl">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#13A385] rounded-full blur-[250px] opacity-[0.15] pointer-events-none animate-pulse duration-10000"></div>

                        <div className="mb-12 relative z-10 text-center">
                            <h3 className="text-4xl font-light text-white tracking-widest uppercase mb-4">Competitive Strategy Terrain</h3>
                            <p className="text-[#8892B0] text-lg font-light">Navigating by volume velocity and premium scale</p>
                        </div>

                        <div className="flex-1 relative z-10 border-l border-b border-white/20 ml-10 mb-10">

                            <div className="absolute -left-12 top-1/2 -rotate-90 text-[#8892B0] text-sm uppercase tracking-[0.2em] font-semibold origin-center">Velocity (Annual Deals)</div>
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[#8892B0] text-sm uppercase tracking-[0.2em] font-semibold">Scale (Average Premium)</div>
                            <div className="absolute -bottom-8 right-0 text-[#13A385] text-xs font-bold uppercase tracking-widest">Mega Deals →</div>
                            <div className="absolute -top-6 -left-10 text-[#13A385] text-xs font-bold uppercase tracking-widest">High Vol ↑</div>

                            {strategyMap.map((node, i) => (
                                <div
                                    key={i}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all duration-700 hover:scale-125 cursor-pointer shadow-xl backdrop-blur-md hover:z-50"
                                    style={{
                                        left: `${node.x}%`,
                                        bottom: `${node.y}%`,
                                        width: `${node.size * 1.8}px`,
                                        height: `${node.size * 1.8}px`,
                                        backgroundColor: node.color === "#13A385" ? 'rgba(19, 163, 133, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                        border: `2px solid ${node.color === "#13A385" ? '#13A385' : 'rgba(255,255,255,0.2)'}`,
                                        zIndex: node.color === "#13A385" ? 20 : 10,
                                        boxShadow: node.color === "#13A385" ? '0 0 40px rgba(19,163,133,0.3) inset, 0 0 20px rgba(19,163,133,0.4)' : 'none'
                                    }}
                                >
                                    <span className={`text-base font-bold ${node.color === "#13A385" ? 'text-white' : 'text-[#8892B0] font-medium'} text-center px-2 leading-tight`}>
                                        {node.name}
                                    </span>
                                    {node.color === "#13A385" && (
                                        <div className="absolute -bottom-8 whitespace-nowrap text-[#13A385] text-sm tracking-widest uppercase font-bold drop-shadow-lg">The Niche</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </GlassPanel>
                </div>
            </section>

        </div>
    );
}

const LayoutDashboardIcon = ({ className }) => <Layers className={className} />;
const CpuIcon = ({ className }) => <Cpu className={className} />;
const BarChartIcon = ({ className }) => <BarChart3 className={className} />;
