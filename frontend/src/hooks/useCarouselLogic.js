import { useEffect, useMemo, useRef, useState } from "react";

const CATEGORY_INTERVAL_MS = 8000;
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

  const nextCategoryIndex = validCategories.length ? clampIndex(activeCategoryIndex + 1, validCategories.length) : 0;
  const nextCategory = validCategories[nextCategoryIndex] || null;

  let nextItemIndex = 0;
  if (nextCategory) {
    if (nextCategoryIndex === activeCategoryIndex) {
      nextItemIndex = clampIndex((itemIndexMap[nextCategory.key] || 0) + 1, nextCategory.items.length);
    } else {
      nextItemIndex = clampIndex(itemIndexMap[nextCategory.key] || 0, nextCategory.items.length);
    }
  }
  const nextItem = nextCategory?.items?.[nextItemIndex] || null;

  return {
    categories: validCategories,
    activeCategory,
    activeCategoryIndex,
    activeItem,
    activeItemIndex,
    categoryProgress,
    nextItem,
  };
};
