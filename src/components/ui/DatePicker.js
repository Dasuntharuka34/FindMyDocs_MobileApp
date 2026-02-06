import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Platform, StyleSheet, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DatePicker = ({
  value,
  onChange,
  placeholder = 'Select date',
  minimumDate,
  maximumDate,
  mode = 'date',
  disabled = false,
  style,
  textStyle,
  iconColor,
  showIcon = true,
  testID,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  // Temporary date for iOS picker state before confirming
  const [tempDate, setTempDate] = useState(value || new Date());
  const { theme } = useTheme();

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'set' && selectedDate) {
        onChange(selectedDate);
      }
    } else {
      // For iOS, just update local temp state, don't close yet
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const showDatePicker = () => {
    if (!disabled) {
      setTempDate(value || new Date()); // Reset temp date to current value on open
      setShowPicker(true);
    }
  };

  const confirmIOSDate = () => {
    onChange(tempDate);
    setShowPicker(false);
  };

  const cancelIOSDate = () => {
    setShowPicker(false);
  };

  const formatDate = (date) => {
    if (!date) return placeholder;

    if (mode === 'time') {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    // Format: DD/MM/YYYY to match format expected by some forms, or standard locale
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getIconColor = () => {
    if (iconColor) return iconColor;
    return disabled ? theme.colors.textTertiary : theme.colors.primary;
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.pickerButton,
          {
            backgroundColor: theme.colors.inputBackground,
            borderColor: disabled ? theme.colors.borderLight : theme.colors.inputBorder,
            opacity: disabled ? 0.6 : 1,
          }
        ]}
        onPress={showDatePicker}
        disabled={disabled}
        testID={testID}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.dateText,
            {
              color: value ? theme.colors.textPrimary : theme.colors.inputPlaceholder,
            },
            textStyle
          ]}
          numberOfLines={1}
        >
          {formatDate(value)}
        </Text>

        {showIcon && (
          <Icon
            name={mode === 'time' ? 'access-time' : 'calendar-today'}
            size={20}
            color={getIconColor()}
            style={styles.icon}
          />
        )}
      </TouchableOpacity>

      {/* Android Picker */}
      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          display="default"
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}

      {/* iOS Modal Picker */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={showPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={cancelIOSDate}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={cancelIOSDate} style={styles.modalButton}>
                  <Text style={[styles.modalButtonText, { color: theme.colors.error }]}>Cancel</Text>
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>Select Date</Text>
                <TouchableOpacity onPress={confirmIOSDate} style={styles.modalButton}>
                  <Text style={[styles.modalButtonText, { color: theme.colors.primary, fontWeight: 'bold' }]}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode={mode}
                display="spinner"
                onChange={handleDateChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                themeVariant={theme.isDark ? 'dark' : 'light'}
                style={styles.iosPicker}
                textColor={theme.colors.textPrimary}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 50,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    includeFontPadding: false,
  },
  icon: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalButton: {
    padding: 8,
  },
  modalButtonText: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  iosPicker: {
    height: 200,
  },
});

export default DatePicker;