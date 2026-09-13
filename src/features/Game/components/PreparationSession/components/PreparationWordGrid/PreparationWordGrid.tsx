import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { LayoutRectangle, ScrollView, View } from 'react-native';

import { measureViewInWindow } from '../../utils';
import { PreparationWordTile } from '../PreparationWordTile/PreparationWordTile';
import {
  PREPARATION_GRID_COLUMN_COUNT,
  PREPARATION_GRID_ROW_HEIGHT,
  PREPARATION_GRID_SCROLL_LEAD,
} from './constants';
import { styles } from './styles';
import { PreparationWordGridHandle, PreparationWordGridProps } from './types';
import { calculatePreparationGridScrollOffset } from './utils';

export const PreparationWordGrid = forwardRef<PreparationWordGridHandle, PreparationWordGridProps>(
  function PreparationWordGrid({ activeIndex, preparedWordCount, wordPairs }, ref) {
    const scrollViewRef = useRef<ScrollView>(null);
    const gridRef = useRef<View>(null);
    const slotLayoutsRef = useRef<(LayoutRectangle | null)[]>([]);

    useImperativeHandle(
      ref,
      () => ({
        async measureSlot(index) {
          const gridLayout = await measureViewInWindow(gridRef.current);
          const slotLayout = slotLayoutsRef.current[index] ?? null;

          if (!gridLayout || !slotLayout) {
            return null;
          }

          return {
            x: gridLayout.x + slotLayout.x,
            y: gridLayout.y + slotLayout.y,
            width: slotLayout.width,
            height: slotLayout.height,
          };
        },
      }),
      [],
    );

    useEffect(() => {
      const nextScrollOffset = calculatePreparationGridScrollOffset(
        activeIndex,
        PREPARATION_GRID_COLUMN_COUNT,
        PREPARATION_GRID_ROW_HEIGHT,
        PREPARATION_GRID_SCROLL_LEAD,
      );

      scrollViewRef.current?.scrollTo({ y: nextScrollOffset, animated: activeIndex > 0 });
    }, [activeIndex]);

    return (
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={wordPairs.length > PREPARATION_GRID_COLUMN_COUNT * 3}
        showsVerticalScrollIndicator={false}
      >
        <View ref={gridRef} collapsable={false} style={styles.grid}>
          {wordPairs.map((wordPair, index) => (
            <PreparationWordTile
              key={wordPair.id}
              index={index}
              isPrepared={index < preparedWordCount}
              onLayout={(event) => {
                slotLayoutsRef.current[index] = event.nativeEvent.layout;
              }}
              wordPair={wordPair}
            />
          ))}
        </View>
      </ScrollView>
    );
  },
);
