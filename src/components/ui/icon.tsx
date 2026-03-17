import Image from "next/image";

type IconProps = {
  name: string;
  size?: number;
  alt?: string;
  className?: string;
};

export default function Icon({
  name,
  size = 24,
  alt = "",
  className,
}: IconProps) {
  return (
    <Image
      src={`/icons/${name}.svg`}
      alt={alt}
      width={size}
      height={size}
      className={className}
      aria-hidden={!alt}
    />
  );
}
