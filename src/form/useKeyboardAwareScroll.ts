import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  TextInput,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Space kept between the focused field and the keyboard or the top edge. */
const MARGIN = 16;

/**
 * Keeps the focused text input fully above the keyboard, including tall multiline inputs.
 * `keyboardInset` is extra bottom padding for the scroll content while the keyboard is open,
 * so the last fields can be scrolled clear of it.
 */
export function useKeyboardAwareScroll() {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const offsetY = useRef(0);
  const viewportHeight = useRef(0);
  const keyboardOverlap = useRef(0);
  const [keyboardInset, setKeyboardInset] = useState(0);
  const { bottom: bottomInset } = useSafeAreaInsets();

  const scrollFocusedIntoView = useCallback(() => {
    const input = TextInput.State.currentlyFocusedInput();
    const content = scrollRef.current?.getInnerViewRef();
    if (!input || !content) return;

    input.measureLayout(
      content,
      (_x, y, _width, height) => {
        const visibleBottom = offsetY.current + viewportHeight.current - keyboardOverlap.current;
        const fieldBottom = y + height + MARGIN;

        if (fieldBottom > visibleBottom) {
          scrollRef.current?.scrollTo({ y: offsetY.current + fieldBottom - visibleBottom, animated: true });
        } else if (y - MARGIN < offsetY.current) {
          scrollRef.current?.scrollTo({ y: Math.max(0, y - MARGIN), animated: true });
        }
      },
      () => {},
    );
  }, []);

  useEffect(() => {
    const subscriptions = [
      Keyboard.addListener('keyboardWillShow', (event) => {
        // The scroll view already ends above the home-indicator inset, so ignore that part of the keyboard.
        const overlap = Math.max(0, event.endCoordinates.height - bottomInset);
        keyboardOverlap.current = overlap;
        setKeyboardInset(overlap);
      }),
      // Scroll after the extra padding has been laid out, otherwise the target is out of range.
      Keyboard.addListener('keyboardDidShow', scrollFocusedIntoView),
      Keyboard.addListener('keyboardWillHide', () => {
        keyboardOverlap.current = 0;
        setKeyboardInset(0);
      }),
    ];
    return () => subscriptions.forEach((subscription) => subscription.remove());
  }, [bottomInset, scrollFocusedIntoView]);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    offsetY.current = event.nativeEvent.contentOffset.y;
  }, []);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    viewportHeight.current = event.nativeEvent.layout.height;
  }, []);

  return {
    scrollRef,
    keyboardInset,
    scrollFocusedIntoView,
    scrollProps: { onScroll, onLayout, scrollEventThrottle: 16 },
  };
}
