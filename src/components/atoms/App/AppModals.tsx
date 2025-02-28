import React, { PropsWithChildren } from 'react';
import {
  Modal,
  ModalBaseProps,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

interface AppModalsProps extends ModalBaseProps, PropsWithChildren {
  visible: boolean;
  onDismiss: () => void;
  style?: ViewStyle;
  position?: 'center' | 'bottom';
}

const AppModals: React.FC<AppModalsProps> = ({
  visible,
  onDismiss,
  children,
  style: addOnStyle,
  position = 'center',
  ...modalBaseProps
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      {...modalBaseProps}
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View
          style={[
            StyleSheet.absoluteFillObject,
            styles.modalContainer,
            { justifyContent: position == 'center' ? 'center' : 'flex-end' },
            addOnStyle,
          ]}
        >
          <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default AppModals;
