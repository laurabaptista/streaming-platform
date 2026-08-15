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
