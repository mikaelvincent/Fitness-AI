import { useState } from "react";

// Define possible statuses as a union type
type Status = "loading" | "error" | "done" | "ready";

// Custom hook for managing status
const useStatus = () => {
  const [status, setStatus] = useState<Status>("ready");

  const setLoading = () => setStatus("loading");
  const setError = () => setStatus("error");
  const setDone = () => setStatus("done");
  const setReady = () => setStatus("ready");

  return { status, setLoading, setError, setDone, setReady };
};

export default useStatus;
