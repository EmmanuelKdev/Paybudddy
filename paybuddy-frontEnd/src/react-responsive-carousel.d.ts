// src/react-responsive-carousel.d.ts
declare module 'react-responsive-carousel' {
    import * as React from 'react';
  
    interface CarouselProps {
      children?: React.ReactNode;
      showArrows?: boolean;
      showThumbs?: boolean;
      infiniteLoop?: boolean;
      autoPlay?: boolean;
      interval?: number;
      stopOnHover?: boolean;
      swipeable?: boolean;
      dynamicHeight?: boolean;
      emulateTouch?: boolean;
      autoFocus?: boolean;
      selectedItem?: number;
      showStatus?: boolean;
      showIndicators?: boolean;
      axis?: 'horizontal' | 'vertical';
      onChange?: (index: number, item: React.ReactNode) => void;
      onClickItem?: (index: number, item: React.ReactNode) => void;
      onClickThumb?: (index: number, item: React.ReactNode) => void;
      renderArrowPrev?: (onClickHandler: () => void, hasPrev: boolean, label: string) => React.ReactNode;
      renderArrowNext?: (onClickHandler: () => void, hasNext: boolean, label: string) => React.ReactNode;
      renderIndicator?: (clickHandler: (e: React.MouseEvent | React.KeyboardEvent) => void, isSelected: boolean, index: number, label: string) => React.ReactNode;
    }
  
    export class Carousel extends React.Component<CarouselProps> {}
  }
  