import { useEffect, useMemo, useRef, useState } from "react";

const CATEGORY_INTERVAL_MS = 12000;
const TICK_MS = 100;

const clampIndex = (index, length) => {
  if (!length) {
    return 0;
  }

  return ((index % length) + length) % length;
};

export const useCarouselLogic = ({ categories = [], paused = false }) => {
  const validCategories = useMemo(
    () => categories.filter((category) => Array.isArray(category?.items) && category.items.length),
    [categories],
  );
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [itemIndexMap, setItemIndexMap] = useState({});
  const [categoryProgress, setCategoryProgress] = useState(0);
  const categoryElapsedRef = useRef(0);

  useEffect(() => {
    if (!validCategories.length) {
      setActiveCategoryIndex(0);
      setItemIndexMap({});
      setCategoryProgress(0);
      categoryElapsedRef.current = 0;
      return;
    }

    setActiveCategoryIndex((currentIndex) => clampIndex(currentIndex, validCategories.length));
    setItemIndexMap((previous) => {
      const next = {};

      validCategories.forEach((category) => {
        next[category.key] = clampIndex(previous[category.key] || 0, category.items.length);
      });

      return next;
    });
  }, [validCategories]);

  useEffect(() => {
    if (!validCategories.length || paused) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      categoryElapsedRef.current += TICK_MS;

      if (categoryElapsedRef.current >= CATEGORY_INTERVAL_MS) {
        const currentCategory = validCategories[activeCategoryIndex];

        categoryElapsedRef.current = 0;
        setCategoryProgress(0);
        setItemIndexMap((previous) => {
          if (!currentCategory?.items?.length) {
            return previous;
          }

          const current = previous[currentCategory.key] || 0;
          const next = clampIndex(current + 1, currentCategory.items.length);

          return {
            ...previous,
            [currentCategory.key]: next,
          };
        });
        setActiveCategoryIndex((currentIndex) =>
          clampIndex(currentIndex + 1, validCategories.length),
        );
        return;
      }

      setCategoryProgress(categoryElapsedRef.current / CATEGORY_INTERVAL_MS);
    }, TICK_MS);

    return () => window.clearInterval(interval);
  }, [activeCategoryIndex, paused, validCategories]);

  useEffect(() => {
    categoryElapsedRef.current = 0;
  }, [activeCategoryIndex]);

  const activeCategory = validCategories[activeCategoryIndex] || null;
  const activeItemIndex = activeCategory
    ? clampIndex(itemIndexMap[activeCategory.key] || 0, activeCategory.items.length)
    : 0;
  const activeItem = activeCategory?.items?.[activeItemIndex] || null;

  return {
    categories: validCategories,
    activeCategory,
    activeCategoryIndex,
    activeItem,
    activeItemIndex,
    categoryProgress,
  };
};
