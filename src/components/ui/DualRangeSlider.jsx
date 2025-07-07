import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '../../lib/utils';

const DualRangeSlider = React.forwardRef(
  (
    {
      className,
      label,
      labelPosition = 'top',
      value = [0, 100],
      min = 0,
      max = 99999,
      step = 1,
      onValueChange,
      ...props
    },
    ref
  ) => {
    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn('relative flex w-full touch-none select-none items-center', className)}
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={onValueChange}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
          <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
        </SliderPrimitive.Track>
        {value.map((val, index) => (
          <React.Fragment key={index}>
            <SliderPrimitive.Thumb className="relative block h-5 w-5 rounded-full border-2 border-blue-600 bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              {label && (
                <span
                  className={cn(
                    'absolute flex w-full justify-center text-xs font-bold text-blue-600',
                    labelPosition === 'top' && '-top-7',
                    labelPosition === 'bottom' && 'top-6'
                  )}
                >
                  {label(val)}
                </span>
              )}
            </SliderPrimitive.Thumb>
          </React.Fragment>
        ))}
      </SliderPrimitive.Root>
    );
  }
);
DualRangeSlider.displayName = 'DualRangeSlider';

export { DualRangeSlider };