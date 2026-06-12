import { createContext, useContext, useEffect, useState } from 'react';

const ContentContext = createContext({ status: 'loading', data: null, error: null });

export function ContentProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });

  useEffect(() => {
    // Resolve content.json relative to Vite's BASE_URL so it works on
    // GitHub Pages project sites (e.g. /repo-name/content.json).
    const url = `${import.meta.env.BASE_URL}content.json`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setState({ status: 'ready', data, error: null }))
      .catch((error) => setState({ status: 'error', data: null, error }));
  }, []);

  return <ContentContext.Provider value={state}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}

export function useAbout() {
  const { data } = useContent();
  return data?.about ?? null;
}

export function useExperience() {
  const { data } = useContent();
  return data?.experience ?? [];
}

export function useProjects() {
  const { data } = useContent();
  return data?.projects ?? [];
}
