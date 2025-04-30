import { createContext, ReactNode, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { SuccessStory } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";

type SuccessStoriesContextType = {
  successStories: SuccessStory[];
  isLoading: boolean;
  error: Error | null;
};

// شرح: تعريف نوع بيانات معلومات قصص النجاح التي سنوفرها في المزود
export const SuccessStoriesContext = createContext<SuccessStoriesContextType | null>(null);

export function SuccessStoriesProvider({ children }: { children: ReactNode }) {
  // جلب جميع قصص النجاح
  const {
    data: successStories = [],
    error,
    isLoading,
  } = useQuery<SuccessStory[], Error>({
    queryKey: ["/api/success-stories"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  return (
    <SuccessStoriesContext.Provider
      value={{
        successStories,
        isLoading,
        error: error || null,
      }}
    >
      {children}
    </SuccessStoriesContext.Provider>
  );
}

export function useSuccessStories() {
  const context = useContext(SuccessStoriesContext);
  if (!context) {
    throw new Error("useSuccessStories must be used within a SuccessStoriesProvider");
  }
  return context;
}