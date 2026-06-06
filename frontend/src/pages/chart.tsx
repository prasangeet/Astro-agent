"use client";

import { useState, useEffect, Key } from "react";
import DefaultLayout from "@/layouts/default";
import { TagGroup, Tag, Chip, Spinner, toast } from "@heroui/react";
import clsx from "clsx";
import { getUserId } from "@/utils/user";
import { getNatalChart } from "@/api/natal-chart";

interface ApiPlanetPosition {
  longitude: number;
  sign: string;
}

interface PlanetPosition {
  name: string;
  sign: string;
  degree: string;
  house: number;
  isRetrograde?: boolean;
}

interface BirthProfile {
  id: number;
  date: string;
  time: string;
  place: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface ApiHousePosition {
  house: number;
  longitude: number;
  sign: string;
}

interface NatalChart {
  id: number;
  birth_profile_id: number;
  chart_data: {
    ascendant: { sign: string; longitude: number };
    planets: Record<string, ApiPlanetPosition>;
    houses: ApiHousePosition[];
    navamsa_planets?: Record<string, ApiPlanetPosition>;
  };
  birth_profile: BirthProfile;
}

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export default function Chart() {
  const [activeTab, setActiveTab] = useState<string>("rasi");
  const [selectedHouse, setSelectedHouse] = useState<number>(1);
  const [chart, setChart] = useState<NatalChart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadChartData() {
      try {
        const userId = getUserId();
        if (!userId) {
          setError("No active session profile sequence discovered.");
          setIsLoading(false);
          return;
        }

        const data = await getNatalChart(userId);
        if (data) {
          setChart(data);
        } else {
          setError("Cosmic layout coordinates could not be retrieved.");
        }
      } catch (err) {
        console.error("Error loading natal blueprint:", err);
        setError("Failed to interface with real ephemeris API endpoints.");
        toast.danger("Failed to connect to ephemeris service nodes.");
      } finally {
        setIsLoading(false);
      }
    }

    loadChartData();
  }, []);

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="w-full min-h-[80vh] flex flex-col items-center justify-center gap-4 px-4 bg-background font-sans">
          <Spinner size="lg" color="primary" />
          <p className="text-xs text-muted tracking-widest uppercase text-center animate-pulse">
            Intersecting ephemeris with natal house systems...
          </p>
        </div>
      </DefaultLayout>
    );
  }

  if (error || !chart) {
    return (
      <DefaultLayout>
        <div className="max-w-7xl mx-auto px-4 pt-16 text-center font-sans">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-danger/10 text-danger mb-4">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Matrix Blueprint Offline</h2>
          <p className="text-sm text-muted max-w-md mx-auto">
            {error || "Provide your birth geometry parameters on the home chat panel to initialize planetary chart structures."}
          </p>
        </div>
      </DefaultLayout>
    );
  }

  const profile = chart.birth_profile;
  const chartData = chart.chart_data;

  const formattedBirthDate = new Date(profile.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getHouseForPlanet = (planetLong: number, houses: ApiHousePosition[]): number => {
    if (!houses || houses.length === 0) return 1;
    const sortedHouses = [...houses].sort((a, b) => a.longitude - b.longitude);

    for (let i = 0; i < sortedHouses.length; i++) {
      const currentHouse = sortedHouses[i];
      const nextHouse = sortedHouses[(i + 1) % sortedHouses.length];

      if (nextHouse.longitude > currentHouse.longitude) {
        if (planetLong >= currentHouse.longitude && planetLong < nextHouse.longitude) {
          return currentHouse.house;
        }
      } else {
        if (planetLong >= currentHouse.longitude || planetLong < nextHouse.longitude) {
          return currentHouse.house;
        }
      }
    }
    return 1;
  };

  const calculateNavamsaPosition = (totalLongitude: number) => {
    const totalMinutes = totalLongitude * 60;
    const navamsaSegmentMinutes = 200;
    const segmentIndex = Math.floor(totalMinutes / navamsaSegmentMinutes);

    const signIndex = Math.floor(totalLongitude / 30);
    const elementGroup = signIndex % 4;

    let startingSignOffset = 0;
    if (elementGroup === 0) startingSignOffset = 0;
    else if (elementGroup === 1) startingSignOffset = 8;
    else if (elementGroup === 2) startingSignOffset = 4;
    else if (elementGroup === 3) startingSignOffset = 0;

    const targetSignIndex = (startingSignOffset + segmentIndex) % 12;
    const navamsaSign = ZODIAC_SIGNS[targetSignIndex];
    const navamsaLongitude = (targetSignIndex * 30) + (totalLongitude % 3.333333) * 9;

    return { sign: navamsaSign, longitude: navamsaLongitude };
  };

  const rawPlanetsSource = (activeTab === "navamsa" && chartData.navamsa_planets)
    ? chartData.navamsa_planets
    : chartData.planets;

  const normalizedPlanets: PlanetPosition[] = Object.entries(rawPlanetsSource || {}).map(([name, data]) => {
    let finalSign = data.sign;
    let finalLong = data.longitude;

    if (activeTab === "navamsa" && !chartData.navamsa_planets) {
      const derived = calculateNavamsaPosition(data.longitude);
      finalSign = derived.sign;
      finalLong = derived.longitude;
    }

    const rawDegree = finalLong % 30;
    const degreeString = `${Math.floor(rawDegree)}° ${Math.floor((rawDegree % 1) * 60)}'`;

    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      sign: finalSign,
      degree: degreeString,
      house: getHouseForPlanet(finalLong, chartData.houses),
      isRetrograde: false
    };
  });

  const getPlanetsInHouse = (houseNum: number) => {
    return normalizedPlanets.filter((p) => p.house === houseNum);
  };

  const activeHousePlanets = getPlanetsInHouse(selectedHouse);
  const ascendantSign = chartData.ascendant?.sign || "Unknown";
  const ascendantRawDegree = chartData.ascendant?.longitude ? (chartData.ascendant.longitude % 30) : 0;
  const ascendantDegreeStr = `${Math.floor(ascendantRawDegree)}°`;

  const housesMetadata = [
    { house: 1, label: "I (Lagna)", points: "50,50 25,25 50,0 75,25", tx: 50, ty: 22 },
    { house: 2, label: "II", points: "0,0 50,0 25,25", tx: 25, ty: 10 },
    { house: 3, label: "III", points: "0,0 0,50 25,25", tx: 10, ty: 25 },
    { house: 4, label: "IV", points: "50,50 25,25 0,50 25,75", tx: 22, ty: 50 },
    { house: 5, label: "V", points: "0,50 0,100 25,75", tx: 10, ty: 75 },
    { house: 6, label: "VI", points: "0,100 50,100 25,75", tx: 25, ty: 90 },
    { house: 7, label: "VII", points: "50,50 25,75 50,100 75,75", tx: 50, ty: 78 },
    { house: 8, label: "VIII", points: "50,100 100,100 75,75", tx: 75, ty: 90 },
    { house: 9, label: "IX", points: "100,50 100,100 75,75", tx: 90, ty: 75 },
    { house: 10, label: "X", points: "50,50 75,25 100,50 75,75", tx: 78, ty: 50 },
    { house: 11, label: "XI", points: "100,0 100,50 75,25", tx: 90, ty: 25 },
    { house: 12, label: "XII", points: "50,0 100,0 75,25", tx: 75, ty: 10 },
  ];

  const handleTabChange = (keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;
    if (selectedKey) {
      setActiveTab(selectedKey);
    }
  };

  return (
    <DefaultLayout>
      <div className="w-full min-h-screen bg-background text-foreground font-sans overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">

          {/* Title and Controlled TagGroup Header Layout */}
          <div className="mb-6 md:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-separator pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2 bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
                My Cosmic Blueprint
              </h1>
              <p className="text-muted text-xs sm:text-sm font-medium flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="inline-block w-2 h-2 rounded-full bg-accent" />
                Born {formattedBirthDate} <span className="opacity-40 hidden sm:inline">•</span> <span>{profile.time.slice(0, 5)}</span> <span className="opacity-40">•</span> <span>{profile.place}</span>
              </p>
            </div>

            <TagGroup
              aria-label="Chart Views"
              selectionMode="single"
              selectedKeys={[activeTab]}
              onSelectionChange={handleTabChange}
              variant="surface"
              className="w-full sm:w-auto"
            >
              <TagGroup.List className="gap-2 w-full sm:w-auto flex justify-start sm:justify-end">
                <Tag id="rasi" className="text-xs sm:text-sm font-semibold px-4 py-2 cursor-pointer transition-colors">
                  Rasi (D1)
                </Tag>
                <Tag id="navamsa" className="text-xs sm:text-sm font-semibold px-4 py-2 cursor-pointer transition-colors">
                  Navamsa (D9)
                </Tag>
              </TagGroup.List>
            </TagGroup>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">

            {/* CHART CANVAS LAYOUT */}
            <section className="lg:col-span-7 bg-surface border border-separator shadow-md rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 flex flex-col items-center relative backdrop-blur-md">
              <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 md:mb-8 z-10">
                <h2 className="text-base md:text-lg font-bold tracking-tight text-foreground">
                  {activeTab === "rasi" ? "Natal Lattice Mesh (D1)" : "Microscopic Harmonic Grid (D9)"}
                </h2>
                <Chip size="sm" variant="dot" className="text-[10px] sm:text-[11px] px-3 py-2 bg-surface-secondary border-separator border text-foreground w-fit">
                  ASCENDANT: <span className="font-bold text-accent">{ascendantSign} {ascendantDegreeStr}</span>
                </Chip>
              </div>

              {/* Vector SVG Matrix */}
              <div className="w-full max-w-[450px] aspect-square relative bg-background rounded-xl border border-separator shadow-inner overflow-hidden">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full select-none touch-manipulation"
                  style={{ shapeRendering: "geometricPrecision" }}
                >
                  <rect x="0" y="0" width="100" height="100" className="fill-background" />

                  {housesMetadata.map(({ house, points }) => {
                    const isSelected = selectedHouse === house;
                    return (
                      <polygon
                        key={`poly-${house}`}
                        points={points}
                        onClick={() => setSelectedHouse(house)}
                        className={clsx(
                          "cursor-pointer transition-all duration-150",
                          isSelected ? "fill-accent/10" : "fill-transparent hover:fill-surface-secondary/30"
                        )}
                      />
                    );
                  })}

                  {/* Geometric Lines Frame */}
                  <g className="stroke-separator pointer-events-none" strokeWidth="0.5" fill="none" vectorEffect="non-scaling-stroke">
                    <rect x="0" y="0" width="100" height="100" />
                    <line x1="0" y1="0" x2="100" y2="100" />
                    <line x1="100" y1="0" x2="0" y2="100" />
                    <polygon points="50,0 100,50 50,100 0,50" />
                  </g>

                  {/* Selection Path Stroke Highlight */}
                  {housesMetadata.map(({ house, points }) => {
                    if (selectedHouse !== house) return null;
                    return (
                      <polygon
                        key={`poly-outline-${house}`}
                        points={points}
                        className="fill-none stroke-accent stroke-[0.8] pointer-events-none"
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  })}

                  {/* Rendering Overlaid Planetary Indicators */}
                  {housesMetadata.map(({ house, label, tx, ty }) => {
                    const isSelected = selectedHouse === house;
                    const housePlanets = getPlanetsInHouse(house);

                    return (
                      <g key={`text-${house}`} className="pointer-events-none">
                        <text
                          x={tx}
                          y={ty - (housePlanets.length > 0 ? 3.5 : 0)}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className={clsx(
                            "text-[3.5px] font-bold tracking-wider font-sans uppercase transition-colors duration-150",
                            isSelected ? "fill-accent font-extrabold text-[3.8px]" : "fill-muted/80"
                          )}
                        >
                          {label}
                        </text>

                        {housePlanets.length > 0 && (
                          <g transform={`translate(${tx}, ${ty + 4.5})`}>
                            {housePlanets.map((planet, idx) => {
                              const offset = (idx - (housePlanets.length - 1) / 2) * 7.5;
                              return (
                                <g key={planet.name} transform={`translate(${offset}, 0)`}>
                                  <rect
                                    x="-3.2"
                                    y="-2"
                                    width="6.4"
                                    height="4"
                                    rx="0.75"
                                    className="fill-surface stroke-separator stroke-[0.25]"
                                  />
                                  <text
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    className="fill-foreground font-sans font-bold text-[2.2px] tracking-tighter"
                                  >
                                    {planet.name.slice(0, 2)}
                                  </text>
                                </g>
                              );
                            })}
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Slider Tray Upgraded to Semantic TagGroup Layout */}
              <div className="mt-6 md:mt-8 w-full border-t border-separator pt-5">
                <TagGroup aria-label="Current Planet Placements" selectionMode="none" variant="surface">
                  <TagGroup.List className="flex flex-nowrap gap-2.5 overflow-x-auto pb-3 snap-x scrollbar-hide">
                    {normalizedPlanets.map((p) => (
                      <Tag
                        key={p.name}
                        id={p.name.toLowerCase()}
                        className="px-3 py-1.5 rounded-xl border border-separator bg-background text-foreground text-xs font-semibold whitespace-nowrap shadow-sm snap-center"
                      >
                        <span className="text-accent mr-1">●</span>
                        {p.name}: <span className="text-muted font-normal">{p.sign}</span>
                      </Tag>
                    ))}
                  </TagGroup.List>
                </TagGroup>
              </div>
            </section>

            {/* DATA BREAKDOWNS SIDE PANEL */}
            <section className="lg:col-span-5 flex flex-col gap-6 w-full">
              <div className="bg-surface border border-separator shadow-md rounded-2xl md:rounded-3xl p-5 md:p-6 backdrop-blur-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm md:text-md font-bold tracking-tight text-foreground">House {selectedHouse} Inspector</h2>
                  {activeHousePlanets.length > 0 && (
                    <Chip size="sm" variant="flat" className="text-[10px] md:text-[11px] font-bold tracking-wider uppercase px-2 bg-surface-secondary text-accent">
                      {activeHousePlanets[0].sign}
                    </Chip>
                  )}
                </div>

                <div className="space-y-2.5">
                  {activeHousePlanets.length > 0 ? (
                    activeHousePlanets.map((planet) => (
                      <div key={planet.name} className="flex items-center justify-between p-3 rounded-xl bg-background border border-separator shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-1 h-3 rounded-full bg-accent" />
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-foreground">{planet.name}</div>
                            <div className="text-[10px] sm:text-[11px] text-muted font-medium">{planet.sign} Layer</div>
                          </div>
                        </div>
                        <span className="text-[11px] sm:text-xs font-bold text-foreground bg-surface-secondary px-2 py-1 rounded-md border border-separator">
                          {planet.degree}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 border border-dashed border-separator rounded-xl text-xs text-muted italic bg-background/50">
                      No planets occupy this layer.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-surface border border-separator shadow-md rounded-2xl md:rounded-3xl p-5 md:p-6 backdrop-blur-md">
                <h2 className="text-sm md:text-md font-bold tracking-tight text-foreground mb-3">Planetary Coordinates</h2>
                <div className="max-h-[260px] overflow-y-auto pr-1 space-y-1">
                  {normalizedPlanets.map((planet) => (
                    <div key={planet.name} className="flex items-center justify-between text-xs py-2.5 px-2 hover:bg-background/50 rounded-lg border-b border-separator/30 last:border-0">
                      <span className="text-foreground font-bold tracking-wide">{planet.name}</span>
                      <span className="text-muted text-[11px] sm:text-xs font-medium bg-surface-secondary px-2 py-0.5 rounded-md border border-separator">
                        {planet.sign} <span className="text-accent mx-1">•</span> H{planet.house}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <footer className="mt-12 pt-6 border-t border-separator text-center">
            <p className="text-[10px] text-muted tracking-widest uppercase">
              Aradhana Real Ephemeris Core v4.2 • Mobile Adaptive Edition
            </p>
          </footer>
        </div>
      </div>
    </DefaultLayout>
  );
}
