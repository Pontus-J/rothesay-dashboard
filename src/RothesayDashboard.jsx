import React, { useState, useMemo } from 'react';
import {
  LineChart, BarChart, PieChart, AreaChart, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Line, Bar, Pie, Cell, Area, ResponsiveContainer,
  ReferenceLine, ComposedChart, Scatter
} from "recharts";
import {
  TrendingUp, TrendingDown, Info, DollarSign, Building2,
  Shield, Cpu, Users, BarChart3, Target, Layers, Goal, Activity
} from "lucide-react";

// --- Design System Tokens ---
const colors = {
  navy: "#1B365D",
  deepNavy: "#0F2440",
  midNavy: "#2A4A7F",
  gold: "#C5A76B",
  lightGold: "#D4BC8A",
  paleGold: "#F5F0E6",
  warmWhite: "#FAF8F5",
  cardWhite: "#FFFFFF",
  cardBorder: "#E8E5DE",
  textPrimary: "#1B365D",
  textMuted: "#6B7A8D",
  success: "#2D8F5E",
  warning: "#D4A843",
  danger: "#C4453C",
};

// --- Custom Components ---
const Card = ({ children, className = "" }) => (
  <div className={`bg - white rounded - 2xl border border - [#E8E5DE] p - 6 shadow - sm hover: shadow - md hover: -translate - y - 0.5 transition - all duration - 300 ${className} `}>
    {children}
  </div>
);

const Badge = ({ isFavourable, children }) => (
  <span className={`inline - flex items - center space - x - 1 px - 2 py - 0.5 rounded - full text - xs font - medium text - white shadow - sm
    ${isFavourable ? 'bg-[#2D8F5E]' : 'bg-[#C4453C]'} `}>
    {isFavourable ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
    <span>{children}</span>
  </span>
);

const SectionHeading = ({ title }) => (
  <h2 className="text-2xl font-semibold tracking-tight text-[#1B365D] mb-8">{title}</h2>
);

// --- Data Stubs ---
const costBreakdown = [
  { name: "Deal Acquisition", value: 80, color: "#1B365D", description: "Pricing, legal, due diligence" },
  { name: "Investment Management", value: 55, color: "#2A4A7F", description: "In-house + external managers" },
  { name: "Policy Administration", value: 50, color: "#3D5F99", description: "Pensioner payroll, data, comms" },
  { name: "Technology & Data", value: 35, color: "#C5A76B", description: "Proprietary platform, cyber" },
  { name: "Regulatory & Compliance", value: 30, color: "#6B7A8D", description: "Solvency II, audit, PRA levies" },
  { name: "Corporate Overheads", value: 27, color: "#9BA7B4", description: "Finance, HR, premises" },
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
  { name: "Just", x: 8, y: 85, size: 54, color: "#9BA7B4" },
  { name: "Aviva", x: 22, y: 70, size: 78, color: "#9BA7B4" },
  { name: "L&G", x: 35, y: 55, size: 84, color: "#9BA7B4" },
  { name: "PIC", x: 45, y: 40, size: 80, color: "#9BA7B4" },
  { name: "Std Life", x: 50, y: 25, size: 51, color: "#9BA7B4" },
  { name: "Rothesay", x: 85, y: 12, size: 103, color: "#C5A76B" },
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
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Business Overview", "Cost Drivers", "Deal Economics"];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1B365D]" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FAF8F5]/80 backdrop-blur-md border-b-2 border-[#C5A76B] px-8 pt-6 pb-2">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-[#C5A76B] transform rotate-45" />
              <h1 className="text-xl font-bold tracking-widest uppercase text-[#1B365D]">Rothesay</h1>
            </div>
            <p className="text-xs uppercase tracking-wider text-[#6B7A8D] mt-1">Cost Economics & Business Driver Model</p>
          </div>
          <p className="text-xs text-[#6B7A8D] pb-1">Data: Annual Report 2024 · SFCR · LCP Market Reports</p>
        </div>
      </header>

      {/* Tab Nav */}
      <div className="sticky top-16 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b items-center px-8 border-[#E8E5DE] transition-all">
        <div className="max-w-7xl mx-auto flex space-x-8">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`py - 4 text - sm font - semibold tracking - wide transition - all duration - 200 relative ${activeTab === idx ? "text-[#C5A76B]" : "text-[#6B7A8D] hover:text-[#1B365D]"
                } `}
            >
              {tab}
              {activeTab === idx && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A76B]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="transition-opacity duration-300">
          {activeTab === 0 && <TabOverview />}
          {activeTab === 1 && <TabCostDrivers />}
          {activeTab === 2 && <TabDealEconomics />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0F2440] text-[#6B7A8D] rounded-t-3xl py-12 px-12 mt-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs">
          <div>
            <h3 className="text-[#FAF8F5] text-sm font-semibold tracking-widest uppercase mb-1">Rothesay</h3>
            <p>Cost Economics Model</p>
          </div>
          <div className="text-center">
            <p>Data: Annual Report 2024 · SFCR 2024 · LCP · Hymans Robertson</p>
          </div>
          <div className="text-right">
            <p>Model for discussion purposes</p>
            <p>Not financial advice</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Tab 1: Business Overview ---
function TabOverview() {
  const formatCompact = (num) => new Intl.NumberFormat('en-GB', { notation: "compact", compactDisplay: "short" }).format(num);

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Row 1: KPIs */}
      <section className="grid grid-cols-4 gap-6">
        <Card>
          <p className="text-xs uppercase tracking-wider text-[#6B7A8D] mb-3">Assets Under Management</p>
          <div className="flex items-baseline space-x-3 mb-2">
            <h3 className="text-4xl font-semibold text-[#1B365D]" style={{ fontVariantNumeric: 'tabular-nums' }}>£70.8bn</h3>
            <Badge isFavourable={true}>16% YoY</Badge>
          </div>
          <p className="text-sm text-[#6B7A8D]">from £61.2bn in 2023</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-[#6B7A8D] mb-3">Adjusted Operating Profit</p>
          <div className="flex items-baseline space-x-3 mb-2">
            <h3 className="text-4xl font-semibold text-[#1B365D]" style={{ fontVariantNumeric: 'tabular-nums' }}>£1,779m</h3>
            <Badge isFavourable={true}>31% YoY</Badge>
          </div>
          <p className="text-sm text-[#6B7A8D]">vs £1,358m in 2023</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-[#6B7A8D] mb-3">Total Operating Costs</p>
          <div className="flex items-baseline space-x-3 mb-2">
            <h3 className="text-4xl font-semibold text-[#1B365D]" style={{ fontVariantNumeric: 'tabular-nums' }}>~£277m</h3>
            <Badge isFavourable={true}>13% YoY</Badge>
          </div>
          <p className="text-sm text-[#6B7A8D]">Opex £81m + Acquisition £196m</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-[#6B7A8D] mb-3">Cost Efficiency</p>
          <div className="flex items-baseline space-x-3 mb-2">
            <h3 className="text-4xl font-semibold text-[#1B365D]" style={{ fontVariantNumeric: 'tabular-nums' }}>3.9 <span className="text-2xl">bps</span></h3>
            <Badge isFavourable={true}>from 5.2</Badge>
          </div>
          <p className="text-sm text-[#6B7A8D]">Total costs / AUM</p>
        </Card>
      </section>

      {/* Row 2: Cost Structure */}
      <section>
        <SectionHeading title="Cost Structure & Efficiency" />
        <div className="grid grid-cols-2 gap-8">
          <Card className="flex flex-col h-[420px]">
            <h3 className="text-lg font-semibold mb-1">Cost Structure Breakdown</h3>
            <p className="text-xs text-[#6B7A8D] mb-4">(Modelled estimate from public filings)</p>
            <div className="flex-1 min-h-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="85%"
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell - ${index} `} fill={entry.color} className="hover:opacity-80 transition-opacity duration-300 cursor-pointer" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(val) => [`£${val} m`, 'Value']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                <span className="text-2xl font-semibold text-[#1B365D]">£277m</span>
                <span className="text-xs uppercase tracking-wider text-[#6B7A8D]">Total</span>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col h-[420px]">
            <h3 className="text-lg font-semibold mb-6">Cost Efficiency Trend</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={efficiencyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#E8E5DE" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#6B7A8D', fontSize: 12 }} dy={10} />
                  <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fill: '#1B365D', fontSize: 12 }} dx={-10} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#C5A76B', fontSize: 12 }} dx={10} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                  <Line yAxisId="left" type="monotone" name="Cost/AUM (bps)" dataKey="costPerAUM" stroke="#1B365D" strokeWidth={3} dot={{ r: 4, fill: '#1B365D', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="monotone" name="Acq. Cost (% Premium)" dataKey="acqCostPct" stroke="#C5A76B" strokeWidth={3} dot={{ r: 4, fill: '#C5A76B', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </section>

      {/* Row 3: Market Context */}
      <section>
        <SectionHeading title="Market Context" />
        <div className="grid grid-cols-2 gap-8">
          <Card className="flex flex-col h-[420px] relative">
            <h3 className="text-lg font-semibold mb-6">UK BPA Market Volume (£bn) vs Deal Count</h3>

            {/* Overlay Annotation */}
            <div className="absolute top-16 right-6 bg-[#FAF8F5] p-3 rounded-lg border border-[#E8E5DE] shadow-sm z-10 max-w-[200px]">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-[#C5A76B] shrink-0 mt-0.5" />
                <p className="text-xs text-[#1B365D] font-medium leading-relaxed">£1.2-1.4tn of uninsured DB liabilities remain</p>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={marketData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#E8E5DE" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#6B7A8D', fontSize: 12 }} dy={10} />
                  <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fill: '#1B365D', fontSize: 12 }} dx={-5} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#C5A76B', fontSize: 12 }} dx={5} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar yAxisId="left" dataKey="volume" name="Volume (£bn)" fill="#1B365D" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {marketData.map((entry, index) => (
                      <Cell key={`cell - ${index} `} fill={entry.year.includes('F') ? '#2A4A7F' : '#1B365D'} fillOpacity={entry.year.includes('F') ? 0.6 : 1} />
                    ))}
                  </Bar>
                  <Line yAxisId="right" type="monotone" name="Deal Count" dataKey="deals" stroke="#C5A76B" strokeWidth={3} dot={{ r: 4, fill: '#C5A76B', strokeWidth: 2, stroke: '#fff' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="flex flex-col h-[420px]">
            <h3 className="text-lg font-semibold mb-6">Competitive Landscape (FY24)</h3>
            <div className="flex-1 overflow-auto pr-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8E5DE] text-[#6B7A8D] text-xs uppercase tracking-wider">
                    <th className="py-3 text-left font-medium">Provider</th>
                    <th className="py-3 text-right font-medium">Vol (£bn)</th>
                    <th className="py-3 text-right font-medium">Deals</th>
                    <th className="py-3 text-right font-medium">Avg (£m)</th>
                    <th className="py-3 pl-6 text-left font-medium">Strategy Note</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((comp, idx) => (
                    <tr key={idx} className={`border - b last: border - 0 border - [#E8E5DE] transition - colors rounded - lg
                      ${comp.highlight ? 'bg-[#F5F0E6] font-medium' : 'hover:bg-gray-50'} `}>
                      <td className="py-4 font-semibold text-[#1B365D]">
                        {comp.highlight ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-1 h-4 bg-[#C5A76B] rounded-full"></div>
                            <span>{comp.name}</span>
                          </div>
                        ) : (
                          <span className="pl-3">{comp.name}</span>
                        )}
                      </td>
                      <td className="py-4 text-right tabular-nums">{comp.premiums.toFixed(1)}</td>
                      <td className="py-4 text-right tabular-nums">{comp.deals}</td>
                      <td className="py-4 text-right tabular-nums">{comp.avgDeal}</td>
                      <td className="py-4 pl-6 text-[#6B7A8D] text-xs">{comp.strategy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

// --- Tab 2: Cost Drivers ---
function TabCostDrivers() {
  const [inputs, setInputs] = useState({
    newBiz: 15.7,
    avgDealSize: 1700,
    winRate: 15,
    costPerPolicy: 80,
    techSpend: 35,
    matchingAdj: 125,
    expenseInflation: 3.0
  });

  const handleSlider = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: parseFloat(value) }));
  };

  const modelMetrics = useMemo(() => {
    // Chain 1: Pricing → Deals → Premium
    // Assuming newBiz is the direct output volume targeted, we deduce deals targeted
    const newBizPremium = inputs.newBiz;
    const dealsWon = Math.max(1, Math.round(newBizPremium * 1000 / inputs.avgDealSize));
    const projectedAUM = 70.8 + newBizPremium - 3.8;

    // Chain 2: Costs
    const newPolicies = newBizPremium * 1e9 / 50000;
    const totalPolicies = 1004920 + newPolicies;
    const adminCostTotal = inputs.costPerPolicy * totalPolicies / 1e6;
    const totalCosts = adminCostTotal + inputs.techSpend + 55 + 30 + 27 + 80;
    const costPerAUM = totalCosts / (projectedAUM * 10);
    const acqCostPct = 80 / (newBizPremium * 1000) * 100;

    // Chain 3: MA
    const maBenefit = inputs.matchingAdj / 10000 * projectedAUM * 1000;
    const pricingAdvBps = inputs.matchingAdj - 100;

    // Chain 4: BEL loading
    const expenseLoading = (inputs.costPerPolicy * totalPolicies / 1e6 + inputs.techSpend) / (projectedAUM * 10);

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

  const SliderConfig = ({ label, min, max, step, unit, valueKey }) => (
    <div className="flex items-center py-2 space-x-4">
      <div className="w-1/3 text-sm font-medium text-[#1B365D]">{label}</div>
      <div className="w-1/2 flex items-center">
        <input
          type="range"
          min={min} max={max} step={step}
          value={inputs[valueKey]}
          onChange={(e) => handleSlider(valueKey, e.target.value)}
          className="w-full h-1.5 bg-[#E8E5DE] rounded-full appearance-none cursor-pointer accent-[#C5A76B]"
        />
      </div>
      <div className="w-1/6 text-right tabular-nums font-semibold text-[#1B365D]">
        {inputs[valueKey]}<span className="text-xs text-[#6B7A8D] ml-1 font-normal">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Target Classification */}
      <section>
        <SectionHeading title="Cost Classification Framework" />
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-[#2D8F5E] font-semibold text-lg flex items-center mb-6"><TrendingUp className="mr-2 w-5 h-5" /> Value-Driving Costs</h3>
            {[
              { title: "Pricing & Actuarial", cost: "£6.1m", desc: "More pricing firepower → higher win rate", icon: Target },
              { title: "Investment Origination", cost: "£45m", desc: "Illiquid asset sourcing → Matching Adjustment", icon: Layers },
              { title: "Technology Platform", cost: "£35m", desc: "Automation → lower cost/policy", icon: Cpu },
              { title: "Business Development", cost: "£8m", desc: "Adviser relationships → deal flow", icon: Building2 },
            ].map((item, i) => (
              <Card key={i} className="border-l-4 border-l-[#2D8F5E] !p-4">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center space-x-2 text-[#1B365D] font-medium"><item.icon className="w-4 h-4 text-[#6B7A8D]" /> <span>{item.title}</span></div>
                  <span className="font-bold tabular-nums">{item.cost}</span>
                </div>
                <p className="text-xs text-[#6B7A8D] pl-6">{item.desc}</p>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-[#D4A843] font-semibold text-lg flex items-center mb-6"><Shield className="mr-2 w-5 h-5" /> Necessary Costs</h3>
            {[
              { title: "Solvency II / UK Reporting", cost: "£12m", desc: "QRTs, SFCR, annual returns", icon: FileTextIcon },
              { title: "Internal Model", cost: "£5m", desc: "PRA-required calibration & validation", icon: BarChart3 },
              { title: "External Audit", cost: "£7m", desc: "IFRS 17 + Solvency II dual reporting", icon: ShieldCheckIcon },
              { title: "PRA Levies & Compliance", cost: "£6m", desc: "Scales with firm size — unavoidable", icon: Building2 },
            ].map((item, i) => (
              <Card key={i} className="border-l-4 border-l-[#D4A843] !p-4">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center space-x-2 text-[#1B365D] font-medium"><item.icon className="w-4 h-4 text-[#6B7A8D]" /> <span>{item.title}</span></div>
                  <span className="font-bold tabular-nums">{item.cost}</span>
                </div>
                <p className="text-xs text-[#6B7A8D] pl-6">{item.desc}</p>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-[#C4453C] font-semibold text-lg flex items-center mb-6"><TrendingDown className="mr-2 w-5 h-5" /> Efficiency Targets</h3>
            {[
              { title: "Per-Policy Administration", cost: "£50m", desc: "Target: £80 → £55/policy via automation", icon: Users },
              { title: "Per-Deal Quotation", cost: "£12m", desc: "Streamline sub-£500m scheme processes", icon: Activity },
              { title: "Corporate Overhead", cost: "£27m", desc: "Should shrink as % with AUM growth", icon: Building2 },
            ].map((item, i) => (
              <Card key={i} className="border-l-4 border-l-[#C4453C] !p-4">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center space-x-2 text-[#1B365D] font-medium"><item.icon className="w-4 h-4 text-[#6B7A8D]" /> <span>{item.title}</span></div>
                  <span className="font-bold tabular-nums">{item.cost}</span>
                </div>
                <p className="text-xs text-[#6B7A8D] pl-6">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Scenario Engine */}
      <section>
        <SectionHeading title="Scenario Engine" />
        <Card className="!p-8 bg-[#0F2440] text-white overflow-hidden relative">

          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A76B] rounded-full blur-[100px] opacity-10"></div>

          <div className="grid grid-cols-2 gap-16 relative z-10">
            <div>
              <h3 className="text-[#C5A76B] text-sm uppercase tracking-wider mb-6 font-semibold pb-2 border-b border-[#C5A76B]/30">Growth & Market Assumptions</h3>
              <div className="space-y-4">
                <SliderConfig label="Annual New Business" min={5} max={25} step={0.5} unit="£bn" valueKey="newBiz" />
                <SliderConfig label="Average Deal Size" min={100} max={5000} step={100} unit="£m" valueKey="avgDealSize" />
                <SliderConfig label="Market Win Rate" min={5} max={40} step={1} unit="%" valueKey="winRate" />
              </div>
            </div>
            <div>
              <h3 className="text-[#C5A76B] text-sm uppercase tracking-wider mb-6 font-semibold pb-2 border-b border-[#C5A76B]/30">Cost & Pricing Levers</h3>
              <div className="space-y-4">
                <SliderConfig label="Cost per Policy (Admin)" min={30} max={150} step={5} unit="£" valueKey="costPerPolicy" />
                <SliderConfig label="Technology Spend" min={15} max={60} step={1} unit="£m" valueKey="techSpend" />
                <SliderConfig label="Matching Adj (Spread)" min={50} max={200} step={5} unit="bps" valueKey="matchingAdj" />
                <SliderConfig label="Expense Inflation" min={1.5} max={5.0} step={0.1} unit="%" valueKey="expenseInflation" />
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Impact Output */}
      <section className="grid grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-6 flex items-center text-[#1B365D]"><Goal className="w-5 h-5 mr-2 text-[#C5A76B]" /> Operating Metrics</h3>
          <div className="space-y-4">
            <MetricRow label="Total OPEX" current="£277m" scenario={`£${modelMetrics.totalCosts} m`} delta={277 - modelMetrics.totalCosts} reverse={true} />
            <MetricRow label="Cost / AUM" current="3.9 bps" scenario={`${modelMetrics.costPerAUM} bps`} delta={3.9 - parseFloat(modelMetrics.costPerAUM)} reverse={true} />
            <MetricRow label="Cost / Policy" current="£275" scenario={`£${modelMetrics.costPerPolicy} `} delta={275 - modelMetrics.costPerPolicy} reverse={true} />
            <MetricRow label="Acquisition / Prem" current="1.2%" scenario={`${modelMetrics.acqCostPct}% `} delta={(1.2 - parseFloat(modelMetrics.acqCostPct)).toFixed(1)} reverse={true} />
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-6 flex items-center text-[#1B365D]"><Activity className="w-5 h-5 mr-2 text-[#C5A76B]" /> Growth Outcomes</h3>
          <div className="space-y-4">
            <MetricRow label="Deals Won" current="6" scenario={modelMetrics.dealsWon} delta={modelMetrics.dealsWon - 6} />
            <MetricRow label="New Biz Premium" current="£15.7bn" scenario={`£${modelMetrics.newBizPremium} bn`} delta={(parseFloat(modelMetrics.newBizPremium) - 15.7).toFixed(1)} />
            <MetricRow label="Projected AUM" current="£70.8bn" scenario={`£${modelMetrics.projectedAUM} bn`} delta={(parseFloat(modelMetrics.projectedAUM) - 70.8).toFixed(1)} />
            <MetricRow label="AUM / Employee" current="£131m" scenario={`£${modelMetrics.aumPerEmployee} m`} delta={modelMetrics.aumPerEmployee - 131} />
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-6 flex items-center text-[#1B365D]"><DollarSign className="w-5 h-5 mr-2 text-[#C5A76B]" /> Pricing Power</h3>
          <div className="space-y-4">
            <MetricRow label="MA Annual Benefit" current="£884m" scenario={`£${modelMetrics.maBenefit} m`} delta={modelMetrics.maBenefit - 884} />
            <MetricRow label="Pricing Advantage" current="+25 bps" scenario={`+ ${modelMetrics.pricingAdvBps} bps`} delta={modelMetrics.pricingAdvBps - 25} />
            <MetricRow label="BEL Expense Load" current="30 bps" scenario={`${modelMetrics.expenseLoading} bps`} delta={30 - parseFloat(modelMetrics.expenseLoading)} reverse={true} />
          </div>
        </Card>
      </section>

      {/* Scale Effects Area */}
      <section>
        <Card className="h-[400px] flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Scale Effects on Unit Costs</h3>
            <p className="text-sm text-[#6B7A8D]">Growing the book structurally suppresses fixed costs per unit</p>
          </div>
          <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scaleData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFixed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B365D" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1B365D" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E8E5DE" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="aum" type="number" domain={[50, 120]} tickFormatter={v => `£${v} bn`} tick={{ fill: '#6B7A8D', fontSize: 12 }} dy={10} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6B7A8D', fontSize: 12 }} tickFormatter={v => `${v} bps`} dx={-5} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value, name) => [`${value} bps`, name]} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <ReferenceLine x={70.8} stroke="#C5A76B" strokeDasharray="3 3" label={{ position: 'top', value: 'Rothesay Today', fill: '#C5A76B', fontSize: 12, fontWeight: 600 }} />
                <Area type="monotone" dataKey="fixedBps" stackId="1" stroke="#1B365D" fill="url(#colorFixed)" name="Fixed Costs" />
                <Area type="monotone" dataKey="variableBps" stackId="1" stroke="#C5A76B" fill="#C5A76B" fillOpacity={0.8} name="Variable Costs" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>
    </div>
  );
}

// Helper for row in impact cards
const MetricRow = ({ label, current, scenario, delta, reverse = false }) => {
  const isPositive = delta > 0;
  const isZero = delta === 0 || delta === "0.0";
  // If reverse is true, then a negative delta is good (e.g., lower costs).
  const isGood = reverse ? !isPositive && !isZero : isPositive && !isZero;
  const dVal = (typeof delta === 'number' && delta % 1 !== 0) ? delta.toFixed(1) : delta;

  return (
    <div className="flex justify-between items-center py-2 border-b border-[#E8E5DE] last:border-0 hover:bg-[#FAF8F5] transition-colors -mx-2 px-2 rounded-md">
      <span className="text-sm font-medium text-[#6B7A8D]">{label}</span>
      <div className="flex items-center space-x-4">
        <span className="text-sm line-through text-[#9BA7B4] hidden md:inline-block tabular-nums">{current}</span>
        <span className="text-base font-bold text-[#1B365D] tabular-nums">{scenario}</span>
        {!isZero ? (
          <span className={`px - 2 py - 0.5 rounded - full text - xs font - semibold tabular - nums w - 12 text - center
            ${isGood ? 'bg-[#2D8F5E] text-white' : 'bg-[#C4453C] text-white'} `}>
            {isPositive ? '+' : ''}{dVal}
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-[#6B7A8D] bg-[#E8E5DE] w-12 text-center tabular-nums">
            -
          </span>
        )}
      </div>
    </div>
  );
};

// --- Tab 3: Deal Economics ---
function TabDealEconomics() {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <section className="grid grid-cols-2 gap-8">

        {/* Waterfall Chart */}
        <Card className="flex flex-col h-[500px]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Anatomy of a £1bn BPA Deal Pricing</h3>
            <p className="text-sm text-[#6B7A8D]">How Rothesay structurally builds pricing advantage</p>
          </div>
          <div className="flex-1 min-h-0 pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} margin={{ top: 20, right: 10, left: -20, bottom: 40 }} barSize={35}>
                <CartesianGrid stroke="#E8E5DE" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7A8D', fontSize: 10 }} interval={0}
                  tickFormatter={entry => entry.split('\n')[0]} dy={10} angle={-30} textAnchor="end" />
                <YAxis domain={['auto', 'auto']} tick={{ fill: '#6B7A8D', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `£${v} m`} dx={-5} />
                <Tooltip
                  cursor={{ fill: '#FAF8F5' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(val, name, props) => {
                    const { payload } = props;
                    return [`£${payload[payload.type]} m`, "Value"];
                  }}
                />

                <Bar dataKey="base" stackId="a" fill="transparent" />
                <Bar dataKey="primary" stackId="a" fill="#1B365D" radius={[2, 2, 0, 0]} />
                <Bar dataKey="cost" stackId="a" fill="#6B7A8D" radius={[2, 2, 0, 0]} />
                <Bar dataKey="profit" stackId="a" fill="#C5A76B" radius={[2, 2, 0, 0]} />
                <Bar dataKey="benefit" stackId="a" fill="#2D8F5E" radius={[2, 2, 0, 0]} />
                <Bar dataKey="total" stackId="a" fill="#1B365D" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Acquisition Cost Bubble/Line */}
        <Card className="flex flex-col h-[500px]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Acquisition Cost Advantage</h3>
            <p className="text-sm text-[#6B7A8D]">Costs as % of premium by average deal size</p>
          </div>
          <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dealSizeEconomics} margin={{ top: 30, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid stroke="#E8E5DE" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="size" type="category" ticks={[50, 200, 500, 1700, 5000]} tick={{ fill: '#6B7A8D', fontSize: 12 }} tickFormatter={v => `£${v} m`} dy={10} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6B7A8D', fontSize: 12 }} tickFormatter={v => `${v}% `} dx={-5} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(val) => [`${val}% `, 'Acquisition Cost']}
                  labelFormatter={(lbl) => `Deal Size: £${lbl} m`}
                />
                <Line type="monotone" dataKey="costPct" stroke="#1B365D" strokeWidth={3} dot={false} activeDot={{ r: 8, fill: '#C5A76B', strokeWidth: 0 }} />
                <Scatter dataKey="costPct" fill="#C5A76B" shape="circle" >
                  {dealSizeEconomics.map((entry, index) => (
                    <Cell key={`cell - ${index} `} fill={entry.label.includes('Rothesay') ? '#C5A76B' : (entry.label ? '#1B365D' : 'transparent')} />
                  ))}
                </Scatter>
              </ComposedChart>
            </ResponsiveContainer>

            {/* Custom SVG Labels for Scatter points to be safe on positions */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[15%] left-[10%] text-xs font-medium text-[#6B7A8D]">Just Grp</div>
              <div className="absolute top-[35%] left-[28%] text-xs font-medium text-[#6B7A8D]">Aviva</div>
              <div className="absolute top-[55%] left-[45%] text-xs font-medium text-[#6B7A8D]">PIC</div>
              <div className="absolute top-[75%] left-[65%] text-sm font-bold text-[#C5A76B] bg-white px-2 py-1 rounded shadow-sm">Rothesay avg</div>
            </div>

          </div>
        </Card>
      </section>

      {/* Strategy Map */}
      <section>
        <Card className="h-[550px] flex flex-col relative overflow-hidden bg-[#0F2440] border-none !p-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2A4A7F] rounded-full blur-[150px] opacity-30"></div>

          <div className="mb-8 relative z-10">
            <h3 className="text-2xl font-semibold text-white tracking-tight">Competitive Strategy Mapping</h3>
            <p className="text-[#9BA7B4]">Positioning by volume, velocity, and average premium scale</p>
          </div>

          <div className="flex-1 relative z-10 border-l border-b border-[#2A4A7F]">

            {/* Axes Labels */}
            <div className="absolute -left-6 top-1/2 -rotate-90 text-[#9BA7B4] text-xs uppercase tracking-wider font-semibold origin-center">Annual Deal Volume (Velocity)</div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#9BA7B4] text-xs uppercase tracking-wider font-semibold">Average Deal Size (Scale)</div>
            <div className="absolute -bottom-6 right-0 text-[#6B7A8D] text-xs">Mega deals →</div>
            <div className="absolute -top-4 -left-8 text-[#6B7A8D] text-xs">High vol ↑</div>

            {/* Bubble Rendering */}
            {strategyMap.map((node, i) => (
              <div
                key={i}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all duration-500 hover:scale-110 cursor-pointer shadow-lg backdrop-blur-sm"
                style={{
                  left: `${node.x}% `,
                  bottom: `${node.y}% `,
                  width: `${node.size * 1.5} px`,
                  height: `${node.size * 1.5} px`,
                  backgroundColor: node.color === "#C5A76B" ? 'rgba(197, 167, 107, 0.9)' : 'rgba(155, 167, 180, 0.2)',
                  border: `2px solid ${node.color} `,
                  zIndex: node.color === "#C5A76B" ? 20 : 10
                }}
              >
                <span className={`text - sm font - bold ${node.color === "#C5A76B" ? 'text-[#0F2440]' : 'text-[#E8E5DE]'} text - center px - 2 leading - tight drop - shadow - sm`}>
                  {node.name}
                </span>
                {node.color === "#C5A76B" && (
                  <div className="absolute -bottom-8 whitespace-nowrap text-[#C5A76B] text-xs font-semibold">The Rothesay Niche</div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </section>

    </div>
  );
}

// SVG Icons purely from lucide-react (imported at top)
// Minimal mock-ups to replace any missing icons directly if needed
const ShieldCheckIcon = ({ className }) => <Shield className={className} />;
const FileTextIcon = ({ className }) => <Layers className={className} />;
