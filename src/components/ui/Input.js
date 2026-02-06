import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
  touched,
  multiline = false,
  numberOfLines = 1,
  style,
  containerStyle,
  ...props
}) => {
  const { theme } = useTheme();

  const hasError = error && touched;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          {label}
        </Text>
      )}
      
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.inputBackground,
            borderColor: hasError ? theme.colors.error : theme.colors.inputBorder,
            color: theme.colors.textPrimary,
            minHeight: multiline ? numberOfLines * 24 : 48,
          },
          style,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.inputPlaceholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : undefined}
        {...props}
      />
      
      {hasError && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default Input;