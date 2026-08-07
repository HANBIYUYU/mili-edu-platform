import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal
 * 滚动进入/离开视口时触发元素显示/隐藏动画（双向触发）
 * @param options.threshold 触发阈值 (0~1)
 * @param options.rootMargin 根边距
 * @returns { ref, visible }
 */
export function useScrollReveal<T extends HTMLElement>(
  options: { threshold?: number; rootMargin?: string } = {}
) {
  const { threshold = 0.15, rootMargin = '0px 0px -50px 0px' } = options;
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, visible };
}
