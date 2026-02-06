import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import RequestTypeSelector from '../../components/forms/RequestTypeSelector';
import { useTheme } from '../../context/ThemeContext';

const NewRequestScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={{ flex: 1, backgroundColor: theme?.colors?.background || '#ffffff' }}>
        <View style={{ padding: theme?.spacing?.lg || 24 }}>
          <RequestTypeSelector navigation={navigation} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default NewRequestScreen;