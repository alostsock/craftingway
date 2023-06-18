import { Job } from "./jobs";

export const API_URL = import.meta.env.DEV ? "http://localhost:8080" : import.meta.env.VITE_API_URL;

interface RotationRequest {
  version: "6.4-1";
  job: Job;
  job_level: number;
  craftsmanship: number;
  control: number;
  cp: number;
  food: string | null;
  potion: string | null;
  recipe_job_level: number;
  recipe: string;
  hq_ingredients: Record<string, number>;
  actions: string;
}

interface RotationResponse extends RotationRequest {
  created_at: number;
}

export interface SlugBody {
  slug: string;
}

export type ApiError = { error: string };

export type ApiResult<T> = Promise<T | ApiError>;

export async function getRotation(slug: string): ApiResult<RotationResponse> {
  const response = await fetch(`${API_URL}/rotation/${slug}`);
  const isJson = response.headers.get("Content-Type") === "application/json";

  if (!isJson) {
    return { error: "There was a problem fetching the rotation from the server" };
  }

  if (response.status === 200) {
    return (await response.json()) as RotationResponse;
  } else {
    return (await response.json()) as ApiError;
  }
}

export async function createRotation(rotation: RotationRequest): ApiResult<string> {
  const response = await fetch(`${API_URL}/rotation`, {
    method: "POST",
    body: JSON.stringify(rotation),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    return { error: "Couldn't save this rotation" };
  }

  const { slug } = (await response.json()) as SlugBody;

  return slug;
}
