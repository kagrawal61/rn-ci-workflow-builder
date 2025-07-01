import { cn } from '../utils';

describe('Utils', () => {
  describe('cn', () => {
    it('should join valid class names', () => {
      const result = cn('class1', 'class2', 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('should filter out falsy values', () => {
      const result = cn('class1', null, undefined, false, '', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('should handle empty input', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle all falsy values', () => {
      const result = cn(null, undefined, false, '');
      expect(result).toBe('');
    });

    it('should handle single class name', () => {
      const result = cn('single-class');
      expect(result).toBe('single-class');
    });

    it('should handle conditional class names', () => {
      const isActive = true;
      const isDisabled = false;

      const result = cn(
        'base-class',
        isActive && 'active',
        isDisabled && 'disabled'
      );

      expect(result).toBe('base-class active');
    });

    it('should handle mixed types', () => {
      const result = cn(
        'class1',
        true && 'class2',
        false && 'class3',
        null,
        'class4'
      );
      expect(result).toBe('class1 class2 class4');
    });
  });
});
