interface User {
  readonly id: number;
  name: string;
  email: string;
  verified: boolean;
  registrationDate: string;
  country?: string;
  plan: SubscriptionPlan;
}

interface Content {
  readonly id: number;
  title: string;
  year: number;
  duration: number;
  rating: 1 | 2 | 3 | 4 | 5;
  type: "movie" | "series";
  genre: Genre;
  actors: string[];
  seasons?: number;
}

enum SubscriptionPlan {
  Free = "FREE",
  Standard = "STANDARD",
  Premium = "PREMIUM",
}

enum Genre {
  Action = "ACTION",
  Comedy = "COMEDY",
  Drama = "DRAMA",
  Horror = "HORROR",
  Documentary = "DOCUMENTARY",
}

type Catalog = Content[];

type ViewingHistory = [number, string, number];

interface Profile extends User {
  history: ViewingHistory[];
  favorites: string[];
}

type Success = {
  success: true;
  data: Content[];
};

type Error = {
  success: false;
  message: string;
  code: number;
};

type ApiResponse = Success | Error;

const findById = (catalog: Catalog, id: number = 0): Content | undefined =>
  catalog.find((content) => content.id === id);

const filterByGenre = (catalog: Catalog, genre: Genre): Content[] =>
  catalog.filter((content) => content.genre === genre);

const filterByType = (catalog: Catalog, type: "movie" | "series"): Content[] =>
  catalog.filter((content) => content.type === type);

const sortByRating = (catalog: Catalog): Content[] =>
  [...catalog].sort((a, b) => b.rating - a.rating);

const totalDuration = (catalog: Catalog): number =>
  catalog.reduce((sum, content) => sum + content.duration, 0);

const canWatch = (user: User, content: Content): boolean => {
  if (user.plan === SubscriptionPlan.Free) {
    return content.rating < 3;
  }
  return true;
};

const addFavorite = (profile: Profile, contentId: number): Profile => ({
  ...profile,
  favorites: [...profile.favorites, contentId.toString()],
});

const registerView = (
  profile: Profile,
  contentId: number,
  percentage: number,
): Profile => {
  const date = new Date().toISOString().substring(0, 10);
  const newEntry: ViewingHistory = [contentId, date, percentage];

  return {
    ...profile,
    history: [...profile.history, newEntry],
  };
};

const validatePlan = (plan: string): string => {
  if (!Object.values(SubscriptionPlan).includes(plan as SubscriptionPlan)) {
    throw new Error("Invalid plan");
  }
  return `Plan: ${plan}`;
};

const generateStatistics = (catalog: Catalog) => {
  const totalContent = catalog.length;
  const totalMovies = catalog.filter(
    (content) => content.type === "movie",
  ).length;
  const totalSeries = catalog.filter(
    (content) => content.type === "series",
  ).length;
  const averageDuration = totalDuration(catalog) / totalContent;
  const averageRating =
    catalog.reduce((sum, content) => sum + content.rating, 0) / totalContent;

  return {
    totalContent,
    totalMovies,
    totalSeries,
    averageDuration,
    averageRating,
  };
};

const processResponse = (response: ApiResponse): void => {
  if (response.success) {
    console.log(`Success: ${response.data.length} items received`);
  } else {
    console.log(`Error ${response.code}: ${response.message}`);
  }
};

const groupByGenre = (catalog: Catalog) => {
  const groups: {
    ACTION?: Content[];
    COMEDY?: Content[];
    DRAMA?: Content[];
    HORROR?: Content[];
    DOCUMENTARY?: Content[];
  } = {};

  catalog.forEach((content) => {
    if (!groups[content.genre]) {
      groups[content.genre] = [];
    }
    groups[content.genre]!.push(content);
  });

  return groups;
};

const contentList: Content[] = [
  {
    id: 1,
    title: "The Matrix",
    year: 1999,
    duration: 136,
    rating: 5,
    type: "movie",
    genre: Genre.Action,
    actors: ["Keanu Reeves", "Laurence Fishburne"],
  },
  {
    id: 2,
    title: "The Office",
    year: 2005,
    duration: 22,
    rating: 4,
    type: "series",
    genre: Genre.Comedy,
    actors: ["Steve Carell", "John Krasinski"],
    seasons: 9,
  },
  {
    id: 3,
    title: "Breaking Bad",
    year: 2008,
    duration: 47,
    rating: 5,
    type: "series",
    genre: Genre.Drama,
    actors: ["Bryan Cranston", "Aaron Paul"],
    seasons: 5,
  },
  {
    id: 4,
    title: "Hereditary",
    year: 2018,
    duration: 127,
    rating: 3,
    type: "movie",
    genre: Genre.Horror,
    actors: ["Toni Collette"],
  },
  {
    id: 5,
    title: "Free Solo",
    year: 2018,
    duration: 100,
    rating: 5,
    type: "movie",
    genre: Genre.Documentary,
    actors: ["Alex Honnold"],
  },
  {
    id: 6,
    title: "Peaky Blinders",
    year: 2013,
    duration: 55,
    rating: 2,
    type: "series",
    genre: Genre.Drama,
    actors: ["Cillian Murphy"],
    seasons: 6,
  },
];

const userList: User[] = [
  {
    id: 1,
    name: "Anna Smith",
    email: "anna@example.com",
    verified: true,
    registrationDate: "2024-01-10",
    plan: SubscriptionPlan.Free,
  },
  {
    id: 2,
    name: "Charles Newman",
    email: "charles@example.com",
    verified: true,
    registrationDate: "2023-06-22",
    plan: SubscriptionPlan.Standard,
  },
  {
    id: 3,
    name: "Martha Coast",
    email: "martha@example.com",
    verified: false,
    registrationDate: "2025-03-05",
    plan: SubscriptionPlan.Premium,
  },
];

const anna = userList[0];
const charles = userList[1];
const martha = userList[2];

const profileList: Profile[] = [
  {
    ...anna,
    history: [
      [1, "2026-07-01", 100],
      [3, "2026-07-05", 45],
    ],
    favorites: ["1", "5"],
  },
  {
    ...charles,
    history: [[2, "2026-06-15", 100]],
    favorites: ["2", "3", "6"],
  },
];
