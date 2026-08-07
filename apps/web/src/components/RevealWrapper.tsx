import { useScrollReveal } from '../hooks/useScrollReveal';

interface RevealWrapperProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * RevealWrapper
 * 滚动进入视口时触发子元素的渐入动画
 * @param delay 延迟索引 (0~4)，对应 0~0.4s 的 transition-delay
 */
export default function RevealWrapper({
  children,
  delay = 0,
  className = '',
  style,
}: RevealWrapperProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  const delayClass = delay > 0 && delay <= 4 ? `reveal-delay-${delay}` : '';

  return (
    <div
      ref={ref}
      className={`reveal ${delayClass} ${className}`}
      style={{
        opacity: visible ? 1 : undefined,
        transform: visible ? 'translateY(0)' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
