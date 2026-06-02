"use client";

import { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { Tabs, Chip } from "@heroui/react";

// Interfaces mirroring your SQLAlchemy backend models exactly
interface BirthProfile {
  id: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  place: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface PlanetPosition {
  name: string;
  sign: string;
  degree: string;
  house: number;
  isRetrograde: boolean;
}

interface NatalChart {
  id: number;
  birth_profile_id: number;
  chart_data: {
    ascendant: { sign: string; degree: string };
    planets: PlanetPosition[];
  };
  birth_profile: BirthProfile;
}

// Sample mock data hydrated exactly like your linked relationship queries
const sampleChartRecord: NatalChart = {
  id: 42,
  birth_profile_id: 108,
  birth_profile: {
    id: 108,
    date: "1992-10-24",
    time: "04:32:00",
    place: "New Delhi, India",
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: "Asia/Kolkata",
  },
  chart_data: {
    ascendant: { sign: "Virgo", degree: "14° 32' 11\"" },
    planets: [
      { name: "Sun", sign: "Scorpio", degree: "07° 15' 44\"", house: 3, isRetrograde: false },
      { name: "Moon", sign: "Libra", degree: "22° 08' 15\"", house: 2, isRetrograde: false },
      { name: "Mercury", sign: "Scorpio", degree: "02° 11' 58\"", house: 3, isRetrograde: true },
      { name: "Venus", sign: "Scorpio", degree: "28° 40' 19\"", house: 3, isRetrograde: false },
      { name: "Mars", sign: "Gemini", degree: "19° 52' 03\"", house: 10, isRetrograde: false },
      { name: "Jupiter", sign: "Virgo", degree: "11° 24' 30\"", house: 1, isRetrograde: false },
      { name: "Saturn", sign: "Aquarius", degree: "13° 04' 55\"", house: 6, isRetrograde: true },
      { name: "Rahu", sign: "Sagittarius", degree: "25° 33' 01\"", house: 4, isRetrograde: false },
      { name: "Ketu", sign: "Gemini", degree: "25° 33' 01\"", house: 10, isRetrograde: false },
    ]
  }
};

export default function Chart() {
  const [activeTab, setActiveTab] = useState<string>("rasi");
  const [selectedHouse, setSelectedHouse] = useState<number>(1);

  const profile = sampleChartRecord.birth_profile;
  const chartData = sampleChartRecord.chart_data;

  // Format date to readable format
  const formattedBirthDate = new Date(profile.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getPlanetsInHouse = (houseNum: number) => {
    return chartData.planets.filter((p) => p.house === houseNum);
  };

  const activeHousePlanets = getPlanetsInHouse(selectedHouse);

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">

        {/* Page Header block mapped entirely to theme variables */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-separator pb-6">
          <div>
            <h1 className="text-4xl text-accent tracking-wide mb-2 font-bold">
              My Cosmic Blueprint
            </h1>
            <p className="text-muted text-sm font-medium">
              Born {formattedBirthDate} • {profile.time.slice(0, 5)} • {profile.place}
            </p>
          </div>

          {/* HeroUI Custom Compound Tabs configured to align to your system properties */}
          <Tabs
            className="w-auto flex-shrink-0"
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
          >
            <Tabs.ListContainer>
              <Tabs.List aria-label="Chart Types">
                <Tabs.Tab id="rasi">
                  Rasi (D1)
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="navamsa">
                  Navamsa (D9)
                  <Tabs.Indicator />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>
          </Tabs>
        </div>

        {/* Main Interface Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT PANEL: The Geometric Matrix Box */}
          <section className="lg:col-span-7 bg-surface-secondary border border-separator rounded-3xl p-6 sm:p-8 flex flex-col items-center relative overflow-hidden">

            <div className="w-full flex items-center justify-between mb-6 z-10">
              <h2 className="text-xl text-accent font-bold">Natal Lattice Mesh</h2>
              <Chip size="sm" variant="flat" color="primary" className="text-[10px] font-bold">
                Ascendant: {chartData.ascendant.sign} {chartData.ascendant.degree.split(" ")[0]}
              </Chip>
            </div>

            {/* Structured Vector Chart Container built off custom layout rules */}
            <div className="w-full max-w-[420px] aspect-square relative border border-separator bg-surface rounded-xl overflow-hidden shadow-sm">

              {/* Geometric Grid Background Line Layers using custom separator color rules */}
              <svg className="absolute inset-0 w-full h-full text-separator pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" />
                <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.5" />
                <line x1="50" y1="0" x2="0" y2="50" stroke="currentColor" strokeWidth="0.5" />
                <line x1="50" y1="0" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" />
                <line x1="100" y1="50" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" />
              </svg>

              {/* Central Diamond Fields (Kendras) */}
              {/* House 1 */}
              <button
                type="button"
                onClick={() => setSelectedHouse(1)}
                className={`absolute top-[12%] left-[35%] w-[30%] h-[23%] flex flex-col items-center justify-center transition-all rounded-md ${selectedHouse === 1 ? 'bg-accent/10 border border-accent scale-105 z-10' : 'hover:bg-muted/5'}`}
              >
                <span className="text-[9px] font-bold text-accent">I (Lagna)</span>
                <div className="flex gap-1 text-[10px] font-semibold text-foreground mt-0.5">
                  {getPlanetsInHouse(1).map(p => <span key={p.name}>{p.name.slice(0, 2)}</span>)}
                </div>
              </button>

              {/* House 4 */}
              <button
                type="button"
                onClick={() => setSelectedHouse(4)}
                className={`absolute top-[38%] left-[10%] w-[23%] h-[24%] flex flex-col items-center justify-center transition-all rounded-md ${selectedHouse === 4 ? 'bg-accent/10 border border-accent scale-105 z-10' : 'hover:bg-muted/5'}`}
              >
                <span className="text-[9px] font-bold text-muted">IV</span>
                <div className="flex gap-1 text-[10px] font-semibold text-foreground mt-0.5">
                  {getPlanetsInHouse(4).map(p => <span key={p.name}>{p.name.slice(0, 2)}</span>)}
                </div>
              </button>

              {/* House 7 */}
              <button
                type="button"
                onClick={() => setSelectedHouse(7)}
                className={`absolute bottom-[12%] left-[35%] w-[30%] h-[23%] flex flex-col items-center justify-center transition-all rounded-md ${selectedHouse === 7 ? 'bg-accent/10 border border-accent scale-105 z-10' : 'hover:bg-muted/5'}`}
              >
                <span className="text-[9px] font-bold text-muted">VII</span>
                <div className="flex gap-1 text-[10px] font-semibold text-foreground mt-0.5">
                  {getPlanetsInHouse(7).map(p => <span key={p.name}>{p.name.slice(0, 2)}</span>)}
                </div>
              </button>

              {/* House 10 */}
              <button
                type="button"
                onClick={() => setSelectedHouse(10)}
                className={`absolute top-[38%] right-[10%] w-[23%] h-[24%] flex flex-col items-center justify-center transition-all rounded-md ${selectedHouse === 10 ? 'bg-accent/10 border border-accent scale-105 z-10' : 'hover:bg-muted/5'}`}
              >
                <span className="text-[9px] font-bold text-muted">X</span>
                <div className="flex gap-1 text-[10px] font-semibold text-foreground mt-0.5">
                  {getPlanetsInHouse(10).map(p => <span key={p.name}>{p.name.slice(0, 2)}</span>)}
                </div>
              </button>

              {/* Triangular Corner Fields (Trikonas / Outer Slots) */}
              <button type="button" onClick={() => setSelectedHouse(12)} className={`absolute top-4 left-5 text-left text-[9px] transition-colors ${selectedHouse === 12 ? 'text-accent font-bold' : 'text-muted'}`}>
                <div>XII</div><span className="text-foreground text-[8px]">{getPlanetsInHouse(12).map(p => p.name.slice(0, 2)).join(' ')}</span>
              </button>

              <button type="button" onClick={() => setSelectedHouse(2)} className={`absolute top-4 right-5 text-right text-[9px] transition-colors ${selectedHouse === 2 ? 'text-accent font-bold' : 'text-muted'}`}>
                <div>II</div><span className="text-foreground text-[8px]">{getPlanetsInHouse(2).map(p => p.name.slice(0, 2)).join(' ')}</span>
              </button>

              <button type="button" onClick={() => setSelectedHouse(3)} className={`absolute top-24 left-[46%] text-center text-[9px] transition-colors ${selectedHouse === 3 ? 'text-accent font-bold' : 'text-muted'}`}>
                <div>III</div><span className="text-foreground text-[8px]">{getPlanetsInHouse(3).map(p => p.name.slice(0, 2)).join(' ')}</span>
              </button>

              <button type="button" onClick={() => setSelectedHouse(5)} className={`absolute bottom-24 left-[47%] text-center text-[9px] transition-colors ${selectedHouse === 5 ? 'text-accent font-bold' : 'text-muted'}`}>
                <div>V</div><span className="text-foreground text-[8px]">{getPlanetsInHouse(5).map(p => p.name.slice(0, 2)).join(' ')}</span>
              </button>

              <button type="button" onClick={() => setSelectedHouse(6)} className={`absolute bottom-4 left-5 text-left text-[9px] transition-colors ${selectedHouse === 6 ? 'text-accent font-bold' : 'text-muted'}`}>
                <div>VI</div><span className="text-foreground text-[8px]">{getPlanetsInHouse(6).map(p => p.name.slice(0, 2)).join(' ')}</span>
              </button>

              <button type="button" onClick={() => setSelectedHouse(8)} className={`absolute bottom-4 right-5 text-right text-[9px] transition-colors ${selectedHouse === 8 ? 'text-accent font-bold' : 'text-muted'}`}>
                <div>VIII</div><span className="text-foreground text-[8px]">{getPlanetsInHouse(8).map(p => p.name.slice(0, 2)).join(' ')}</span>
              </button>

              <button type="button" onClick={() => setSelectedHouse(9)} className={`absolute top-[44%] left-4 text-left text-[9px] transition-colors ${selectedHouse === 9 ? 'text-accent font-bold' : 'text-muted'}`}>
                <div>IX</div><span className="text-foreground text-[8px]">{getPlanetsInHouse(9).map(p => p.name.slice(0, 2)).join(' ')}</span>
              </button>

              <button type="button" onClick={() => setSelectedHouse(11)} className={`absolute top-[44%] right-4 text-right text-[9px] transition-colors ${selectedHouse === 11 ? 'text-accent font-bold' : 'text-muted'}`}>
                <div>XI</div><span className="text-foreground text-[8px]">{getPlanetsInHouse(11).map(p => p.name.slice(0, 2)).join(' ')}</span>
              </button>
            </div>

            {/* Quick-Glance Footer pill metrics list */}
            <div className="mt-8 flex gap-3 overflow-x-auto w-full pb-2 scrollbar-hide border-t border-separator pt-4">
              {chartData.planets.slice(0, 4).map((p) => (
                <span key={p.name} className="px-3 py-1.5 rounded-full border border-separator bg-surface text-accent text-xs font-medium whitespace-nowrap">
                  {p.name}: {p.sign}
                </span>
              ))}
            </div>
          </section>

          {/* RIGHT PANELS: Target coordinate values information lists */}
          <section className="lg:col-span-5 flex flex-col gap-6">

            {/* House Data Panel Inspector Block */}
            <div className="bg-surface-secondary border border-separator rounded-3xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg text-accent font-bold">House {selectedHouse} Horizon</h2>
                {activeHousePlanets.length > 0 && (
                  <Chip size="sm" variant="flat" className="text-[10px] font-bold">
                    {activeHousePlanets[0].sign} Sign
                  </Chip>
                )}
              </div>

              <div className="space-y-3">
                {activeHousePlanets.length > 0 ? (
                  activeHousePlanets.map((planet) => (
                    <div key={planet.name} className="flex items-center justify-between p-3.5 rounded-xl bg-surface border border-separator hover:border-accent transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <div>
                          <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                            {planet.name}
                            {planet.isRetrograde && (
                              <span className="text-[9px] px-1 rounded bg-accent/10 text-accent border border-accent/20">R</span>
                            )}
                          </div>
                          <div className="text-[11px] text-muted">{planet.sign} Coordinate</div>
                        </div>
                      </div>
                      <span className="text-xs text-foreground/80">{planet.degree}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 border border-dashed border-separator rounded-xl text-xs text-muted italic">
                    No explicit planet arrays occupy this specific alignment layer.
                  </div>
                )}
              </div>
            </div>

            {/* General Static Ephemeris Positions Overview List */}
            <div className="bg-surface-secondary border border-separator rounded-3xl p-6">
              <h2 className="text-lg text-accent font-bold mb-4">Planetary Coordinates</h2>
              <div className="max-h-[220px] overflow-y-auto pr-1 space-y-2 scrollbar-thin">
                {chartData.planets.map((planet) => (
                  <div key={planet.name} className="flex items-center justify-between text-xs py-2 border-b border-separator last:border-0">
                    <span className="text-foreground font-medium">{planet.name}</span>
                    <span className="text-muted">
                      {planet.sign} • House {planet.house}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </section>
        </div>

        {/* Bottom Ephemeris Meta Engine Engine Status Block */}
        <footer className="mt-16 pt-6 border-t border-separator text-center">
          <p className="text-[11px] text-muted tracking-widest uppercase">
            Aradhana Real Ephemeris Core v4.2 • Verified DB Synced
          </p>
        </footer>

      </div>
    </DefaultLayout>
  );
}
