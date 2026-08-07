import { useCountUp } from '../hooks/useCountUp';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  style?: React.CSSProperties;
}

/**
 * CountUp
 * 滚动进入视口时，数字从 0 递增到目标值
 */
export default function CountUp({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  style,
}: CountUpProps) {
  const { ref, visible } = useScrollReveal<HTMLSpanElement>();
  const count = useCountUp(end, duration, visible);

  return (
    <span ref={ref} style={style}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
