import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Pressable,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Card from './Card';

const Modal = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  transparent = true,
  animationType = 'fade',
  contentStyle,
  overlayStyle,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={onClose}
      {...props}
    >
      <Pressable
        style={[styles.overlay, overlayStyle]}
        onPress={onClose}
      >
        <View style={styles.center}>
          <Card
            style={[
              styles.modalContent,
              contentStyle,
            ]}
            elevated={true}
          >
            <Pressable>
              {(title || showCloseButton) && (
                <View style={styles.header}>
                  {title && (
                    <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                      {title}
                    </Text>
                  )}
                  
                  {showCloseButton && (
                    <TouchableOpacity
                      onPress={onClose}
                      style={styles.closeButton}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Text style={[styles.closeText, { color: theme.colors.textSecondary }]}>
                        ×
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              
              <View style={styles.body}>
                {children}
              </View>
            </Pressable>
          </Card>
        </View>
      </Pressable>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  center: {
    width: '100%',
    maxWidth: 400,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: 4,
    marginLeft: 16,
  },
  closeText: {
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 24,
  },
  body: {
    paddingTop: 16,
  },
});

export default Modal;