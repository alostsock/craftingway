import type {
  Activators,
  KeyboardSensorOptions,
  MouseSensorOptions,
  TouchSensorOptions,
} from "@dnd-kit/core";
import { KeyboardCode, KeyboardSensor, MouseSensor, TouchSensor } from "@dnd-kit/core";

// Patches for the default dnd-kit sensors to ignore events from elements with a
// "data-no-dnd" attribute.

function shouldHandleEvent(element: HTMLElement | null) {
  let current = element;

  while (current) {
    if (current.dataset.noDnd) {
      return false;
    }
    current = current.parentElement;
  }

  return true;
}

export class CustomMouseSensor extends MouseSensor {
  static activators = [
    {
      eventName: "onMouseDown" as const,
      handler: ({ nativeEvent: event }: React.MouseEvent, { onActivation }: MouseSensorOptions) => {
        if (event.button !== 0 || !shouldHandleEvent(event.target as HTMLElement)) {
          return false;
        }

        onActivation?.({ event });

        return true;
      },
    },
  ];
}

const defaultKeyboardCodes = {
  start: [KeyboardCode.Space, KeyboardCode.Enter],
  cancel: [KeyboardCode.Esc],
  end: [KeyboardCode.Space, KeyboardCode.Enter],
};

export class CustomKeyboardSensor extends KeyboardSensor {
  static activators: Activators<KeyboardSensorOptions> = [
    {
      eventName: "onKeyDown" as const,
      handler: (
        event: React.KeyboardEvent,
        { keyboardCodes = defaultKeyboardCodes, onActivation }: KeyboardSensorOptions,
        { active }
      ) => {
        const { code } = event.nativeEvent;

        if (keyboardCodes.start.includes(code)) {
          const activator = active.activatorNode.current;

          if (
            activator &&
            event.target !== activator &&
            shouldHandleEvent(event.target as HTMLElement)
          ) {
            return false;
          }

          event.preventDefault();

          onActivation?.({ event: event.nativeEvent });

          return true;
        }

        return false;
      },
    },
  ];
}

export class CustomTouchSensor extends TouchSensor {
  static activators = [
    {
      eventName: "onTouchStart" as const,
      handler: ({ nativeEvent: event }: React.TouchEvent, { onActivation }: TouchSensorOptions) => {
        const { touches } = event;

        if (touches.length > 1 || !shouldHandleEvent(event.target as HTMLElement)) {
          return false;
        }

        onActivation?.({ event });

        return true;
      },
    },
  ];
}
