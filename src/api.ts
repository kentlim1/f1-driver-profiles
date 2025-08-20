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

export async function fetchDriverStandings(season = 'current'): Promise<DriverStanding[]> {
  const url = `https://api.jolpi.ca/ergast/f1/${season}/driverstandings/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch standings');
  const data: StandingsResponse = await res.json();
  return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
}
