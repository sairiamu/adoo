import React, { createContext, useContext, useEffect, useState } from "react";

interface RouterContextType {
  pathname: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const BrowserRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pathname, setPathname] = useState(() => window.location.pathname || "/");

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname || "/");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, "", to);
    setPathname(to);
  };

  let params: Record<string, string> = {};
  if (pathname.startsWith("/editor/")) {
    const parts = pathname.split("/");
    if (parts[2]) {
      params.projectId = parts[2];
    }
  }

  return (
    <RouterContext.Provider value={{ pathname, navigate, params }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useNavigate = () => {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useNavigate must be used within BrowserRouter");
  return ctx.navigate;
};

export const useParams = () => {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useParams must be used within BrowserRouter");
  return ctx.params;
};

export const Routes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ctx = useContext(RouterContext);
  if (!ctx) return null;

  let matchedElement: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const props = child.props as { path?: string; element?: React.ReactNode };
      const { path, element } = props;
      if (path === ctx.pathname) {
        matchedElement = element;
      } else if (path && path.startsWith("/editor/") && ctx.pathname.startsWith("/editor/")) {
        matchedElement = element;
      }
    }
  });

  return <>{matchedElement}</>;
};

export const Route: React.FC<{ path: string; element: React.ReactNode }> = ({ element }) => {
  return <>{element}</>;
};
