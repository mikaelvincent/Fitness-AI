// src/hooks/useFormStatus.ts
import { useState, useCallback } from "react";

// Define the allowed HTTP methods as a union type
type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

// Define the return type of the hook, making it generic for flexibility
export interface UseFormStatusReturn<T = any> {
  pending: boolean;
  data: T | null;
  method: HttpMethod;
  action: string | null;
  startSubmission: (
    formData: T,
    formMethod?: HttpMethod,
    formAction?: string
  ) => void;
  endSubmission: () => void;
}

// Define the hook as a generic function
const useFormStatus = <T = any>(): UseFormStatusReturn<T> => {
  // Initialize state with appropriate types
  const [pending, setPending] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);
  const [method, setMethod] = useState<HttpMethod>("get");
  const [action, setAction] = useState<string | null>(null);

  /**
   * Starts the form submission process.
   * @param formData - The data to be submitted.
   * @param formMethod - The HTTP method to use (defaults to 'get').
   * @param formAction - The action URL (optional).
   */
  const startSubmission = useCallback(
    (
      formData: T,
      formMethod: HttpMethod = "get",
      formAction: string | null = null
    ) => {
      setPending(true);
      setData(formData);
      setMethod(formMethod);
      setAction(formAction);
    },
    []
  );

  /**
   * Ends the form submission process, resetting all states.
   */
  const endSubmission = useCallback(() => {
    setPending(false);
    setData(null);
    setMethod("get");
    setAction(null);
  }, []);

  // Return the state and action functions
  return {
    pending,
    data,
    method,
    action,
    startSubmission,
    endSubmission,
  };
};

export default useFormStatus;
