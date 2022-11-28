import { ApplicationError } from "@/protocols";

export function preconditionFailedError(): ApplicationError {
  return {
    name: "PreconditionFailedError",
    message: "Precondition failed",
  };
}