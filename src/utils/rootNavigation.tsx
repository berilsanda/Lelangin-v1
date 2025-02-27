import { CommonActions } from '@react-navigation/native';
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.navigate(name, params));
  }
}

export function reset(name: string, index: number) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: index,
      routes: [{ name }],
    });
  }
}
