import { useEffect, useState } from "react";

export function useAsyncData(loader, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function run() {
      try {
        setLoading(true);
        setError("");
        const result = await loader();
        if (mounted) setData(result.data);
      } catch (err) {
        if (mounted) setError(err.message || "Terjadi kesalahan.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, dependencies);

  return { data, loading, error, setData };
}
