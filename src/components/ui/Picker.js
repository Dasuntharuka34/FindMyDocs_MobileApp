import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const Picker = ({
  // Common props
  value,
  onValueChange,
  items = [],
  placeholder = "Select an option",
  style,
  disabled = false,
  required = false,
  error = null,
  
  // Type specific
  type = 'default', // 'default', 'search', 'multi'
  searchPlaceholder = "Search...",
  
  // Style props
  containerStyle,
  pickerStyle,
  textStyle,
  iconStyle,
  
  // Customization
  renderItem,
  keyExtractor,
  ...props
}) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const styles = createStyles(theme);

  // Filter items based on search query
  const filteredItems = items.filter(item =>
    item.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get selected item(s)
  const getSelectedLabel = useCallback(() => {
    if (type === 'multi' && Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      if (value.length === 1) {
        const item = items.find(i => i.value === value[0]);
        return item?.label || placeholder;
      }
      return `${value.length} selected`;
    }
    
    const item = items.find(i => i.value === value);
    return item?.label || placeholder;
  }, [value, items, placeholder, type]);

  // Handle item selection
  const handleSelect = (itemValue) => {
    if (type === 'multi') {
      const currentValue = Array.isArray(value) ? value : [];
      const newValue = currentValue.includes(itemValue)
        ? currentValue.filter(v => v !== itemValue)
        : [...currentValue, itemValue];
      onValueChange(newValue);
    } else {
      onValueChange(itemValue);
      setModalVisible(false);
      setSearchQuery('');
    }
  };

  // Check if item is selected
  const isSelected = (itemValue) => {
    if (type === 'multi') {
      return Array.isArray(value) && value.includes(itemValue);
    }
    return value === itemValue;
  };

  // Custom key extractor
  const getKey = (item, index) => {
    if (keyExtractor) return keyExtractor(item, index);
    return item.value?.toString() || index.toString();
  };

  // Custom item renderer
  const renderPickerItem = ({ item, index }) => {
    if (renderItem) {
      return renderItem({
        item,
        index,
        isSelected: isSelected(item.value),
        onSelect: () => handleSelect(item.value)
      });
    }

    return (
      <TouchableOpacity
        style={[
          styles.item,
          isSelected(item.value) && styles.itemSelected
        ]}
        onPress={() => handleSelect(item.value)}
      >
        {type === 'multi' && (
          <Ionicons
            name={isSelected(item.value) ? "checkbox" : "checkbox-outline"}
            size={24}
            color={isSelected(item.value) ? theme.colors.primary : theme.colors.textSecondary}
            style={styles.checkbox}
          />
        )}

        <Text style={[
          styles.itemText,
          isSelected(item.value) && styles.itemTextSelected
        ]}>
          {item.label}
        </Text>

        {isSelected(item.value) && type !== 'multi' && (
          <Ionicons
            name="checkmark"
            size={20}
            color={theme.colors.primary}
            style={styles.checkIcon}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={[
          styles.picker,
          pickerStyle,
          disabled && styles.pickerDisabled,
          error && styles.pickerError,
          style
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
        {...props}
      >
        <Text style={[
          styles.pickerText,
          textStyle,
          (!value || (type === 'multi' && value.length === 0)) && styles.placeholderText,
          disabled && styles.textDisabled
        ]}>
          {getSelectedLabel()}
        </Text>

        <Ionicons
          name={modalVisible ? "chevron-up" : "chevron-down"}
          size={24}
          color={disabled ? theme.colors.textTertiary : theme.colors.textSecondary}
          style={[styles.icon, iconStyle]}
        />
      </TouchableOpacity>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {required && !value && (
        <Text style={styles.requiredText}>*</Text>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {type === 'multi' ? 'Select Options' : 'Select Option'}
              </Text>
              
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSearchQuery('');
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            {(type === 'search' || type === 'multi') && (
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
                <TextInput
                  style={styles.searchInput}
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor={theme.colors.textTertiary}
                />
              </View>
            )}

            {/* Items List */}
            <FlatList
              data={filteredItems}
              keyExtractor={getKey}
              renderItem={renderPickerItem}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={styles.emptyText}>No options found</Text>
              }
            />

            {/* Multi-select actions */}
            {type === 'multi' && (
              <View style={styles.multiActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onValueChange([])}
                >
                  <Text style={styles.actionText}>Clear All</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, styles.primaryAction]}
                  onPress={() => {
                    setModalVisible(false);
                    setSearchQuery('');
                  }}
                >
                  <Text style={[styles.actionText, styles.primaryActionText]}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Create styles based on theme
const createStyles = (theme) => StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.inputBackground,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    minHeight: 50,
  },
  pickerDisabled: {
    backgroundColor: theme.colors.backgroundTertiary,
    borderColor: theme.colors.borderLight,
  },
  pickerError: {
    borderColor: theme.colors.error,
  },
  pickerText: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.md.fontSize,
  },
  placeholderText: {
    color: theme.colors.textTertiary,
  },
  textDisabled: {
    color: theme.colors.textTertiary,
  },
  icon: {
    marginLeft: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.sm.fontSize,
    marginTop: theme.spacing.xs,
  },
  requiredText: {
    color: theme.colors.error,
    position: 'absolute',
    top: -5,
    right: 10,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.typography.lg.fontSize,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  
  // Search styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.md.fontSize,
  },
  
  // List styles
  listContent: {
    padding: theme.spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xs,
  },
  itemSelected: {
    backgroundColor: theme.colors.primary + '20', // 20% opacity
  },
  checkbox: {
    marginRight: theme.spacing.sm,
  },
  itemText: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.md.fontSize,
  },
  itemTextSelected: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  checkIcon: {
    marginLeft: theme.spacing.sm,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    padding: theme.spacing.xl,
    fontSize: theme.typography.md.fontSize,
  },
  
  // Multi-select actions
  multiActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  primaryAction: {
    backgroundColor: theme.colors.primary,
  },
  actionText: {
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  primaryActionText: {
    color: theme.colors.textInverse,
  },
});

export default Picker;