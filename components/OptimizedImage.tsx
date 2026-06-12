import Image, { type ImageProps } from "next/image";

const DEFAULT_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

type OptimizedImageProps = ImageProps & {
  quality?: number;
};

export default function OptimizedImage({
  quality = 60,
  sizes = DEFAULT_SIZES,
  loading,
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      {...props}
      quality={quality}
      sizes={sizes}
      loading={props.priority ? undefined : loading ?? "lazy"}
      decoding="async"
    />
  );
}
