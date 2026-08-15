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
  type: "filme" | "serie";
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
  Action = "ACAO",
  Comedy = "COMEDIA",
  Drama = "DRAMA",
  Horror = "TERROR",
  Documentary = "DOCUMENTARIO",
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

const filterByType = (catalog: Catalog, type: "filme" | "serie"): Content[] =>
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
    throw new Error("Invalid Plan");
  }
  return `Plan: ${plan}`;
};

const generateStatistics = (catalog: Catalog) => {
  const totalContent = catalog.length;
  const totalMovies = catalog.filter(
    (content) => content.type === "filme",
  ).length;
  const totalSeries = catalog.filter(
    (content) => content.type === "serie",
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
    ACAO?: Content[];
    COMEDIA?: Content[];
    DRAMA?: Content[];
    TERROR?: Content[];
    DOCUMENTARIO?: Content[];
  } = {};

  catalog.forEach((content) => {
    if (!groups[content.genre]) {
      groups[content.genre] = [];
    }
    groups[content.genre]!.push(content);
  });

  return groups;
};
