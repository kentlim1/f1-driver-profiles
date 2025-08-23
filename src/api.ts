export interface DriverStanding {
  position: string;
  points: string;
  Driver: {
    driverId: string;
    givenName: string;
    familyName: string;
    nationality: string;
  };
  Constructors: {
    constructorId: any;
    name: string;
  }[];
}

export interface StandingsResponse {
  MRData: {
    StandingsTable: {
      StandingsLists: Array<{
        DriverStandings: DriverStanding[];
      }>;
    };
  };
}

export async function fetchDriverStandings(
  season = "current"
): Promise<DriverStanding[]> {
  const url = `https://api.jolpi.ca/ergast/f1/${season}/driverstandings/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch standings");
  const data: StandingsResponse = await res.json();
  return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
}

export type RacePoints = {
  race: string;
  points: number;
};

export async function fetchDriverProgression(
  year: string,
  driverId: string
): Promise<RacePoints[]> {
  const response = await fetch(
    `https://api.jolpi.ca/ergast/f1/${year}/results`
  );
  if (!response.ok) throw new Error("Failed to fetch race results");
  const results = await response.json();

  let cumulative = 0;
  const progression: RacePoints[] = [];

  results.forEach((race: any) => {
    const driverResult = race.Results.find(
      (res: any) => res.Driver.driverId === driverId
    );
    if (driverResult) {
      const points = parseFloat(driverResult.points) || 0;
      cumulative += points;
      progression.push({
        race: race.raceName,
        points: cumulative,
      });
    }
  });

  return progression;
}
