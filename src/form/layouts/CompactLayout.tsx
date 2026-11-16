import { StyleSheet, View } from 'react-native';

import { spacing } from '../../design-system';
import type { LayoutProps } from './types';

/** One column, full-width fields. Used below the two-column breakpoint. */
export function CompactLayout({ items }: LayoutProps) {
  return (
    <View style={styles.column}>
      {items.map((item) => (
        <View key={item.key} style={styles.item}>
          {item.node}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    width: '100%',
    gap: spacing.lg,
  },
  item: {
    width: '100%',
  },
});
