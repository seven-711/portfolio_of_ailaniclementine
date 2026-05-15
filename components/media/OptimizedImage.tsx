"use client";

import { CldImage as NextCldImage, CldImageProps } from 'next-cloudinary';

interface OptimizedImageProps extends Omit<CldImageProps, 'alt'> {
  alt: string;
  className?: string;
}

/**
 * Optimized Image Component
 * - Automatic WebP/AVIF conversion
 * - Automatic resizing based on device
 * - Blurred placeholder while loading
 * - CDN delivery
 */
export default function OptimizedImage({ alt, className, ...props }: OptimizedImageProps) {
  const isLocal = typeof props.src === 'string' && (props.src.startsWith('/') || props.src.startsWith('http'));

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLocal ? (
        <img 
          src={props.src as string} 
          alt={alt} 
          className={`w-full h-full object-cover ${className || ''}`}
        />
      ) : (
        <NextCldImage
          {...props}
          alt={alt}
          // Automatic format (WebP/AVIF) and quality optimization
          format="auto"
          quality="auto"
          // Generate a blurred placeholder
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+ZNPQAIXwM4li87oAAAAABJRU5ErkJggg=="
          className={`w-full h-full object-cover ${className || ''}`}
        />
      )}
    </div>
  );
}
