import type { IncomingMessage, ServerResponse } from "node:http";

export type VercelRequestLike = IncomingMessage & {
  body?: unknown;
  method?: string;
};

export type VercelResponseLike = ServerResponse & {
  status(statusCode: number): VercelResponseLike;
  json(body: unknown): void;
};
