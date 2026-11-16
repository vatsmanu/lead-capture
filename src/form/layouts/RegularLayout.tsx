import { StyleSheet, View } from 'react-native';

import { spacing } from '../../design-system';
import type { LayoutItem, LayoutProps } from './types';

/** Groups visible items into rows: two `half` items share a row, a `full` item gets its own. */
function toRows(items: LayoutItem[]): LayoutItem[][] {
  const rows: LayoutItem[][] = [];
  let pending: LayoutItem | null = null;

  for (const item of items) {
    if (item.span === 'full') {
      if (pending) {
        rows.push([pending]);
        pending = null;
      }
      rows.push([item]);
    } else if (pending) {
      rows.push([pending, item]);
      pending = null;
    } else {
      pending = item;
    }
  }
  if (pending) rows.push([pending]);

  return rows;
}

/** Two columns. Used at or above the two-column breakpoint. */
export function RegularLayout({ items }: LayoutProps) {
  return (
    <View style={styles.rows}>
      {toRows(items).map((row) => (
        <View key={row.map((item) => item.key).join('|')} style={styles.row}>
          {row.map((item) => (
            <View key={item.key} style={styles.cell}>
              {item.node}
            </View>
          ))}
          {/* A lone half-width item keeps its width instead of stretching. */}
          {row.length === 1 && row[0].span === 'half' ? <View style={styles.cell} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  rows: {
    width: '100%',
    gap: spacing.lg,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  cell: {
    flex: 1,
    minWidth: 0,
  },
});
