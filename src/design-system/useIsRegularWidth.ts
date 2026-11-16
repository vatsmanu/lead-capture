import { useWindowDimensions } from 'react-native';

import { breakpoints } from './tokens';

/** True when the window is wide enough for the two-column layout. Reacts to rotation and split view. */
export function useIsRegularWidth(): boolean {
  const { width } = useWindowDimensions();
  return width >= breakpoints.twoColumn;
}
