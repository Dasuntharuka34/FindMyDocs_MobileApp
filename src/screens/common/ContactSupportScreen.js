import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, ScrollView } from 'react-native';
import { commonStyles, useTheme } from '../../context/ThemeContext';
import { Card } from '../../components/ui/Card';
import { Ionicons } from '@expo/vector-icons';

const ContactSupportScreen = () => {
  const { theme } = useTheme();

  const handleEmailPress = () => {
    Linking.openURL('mailto:findmydocsteam00@gmail.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+94112222222');
  };

  const styles = StyleSheet.create({
    container: {
      ...commonStyles.container(theme),
      padding: theme.spacing.md,
    },
    header: {
      ...commonStyles.text(theme, 'primary', 'xl'),
      fontWeight: 'bold',
      marginBottom: theme.spacing.md,
      marginTop: theme.spacing.lg,
      textAlign: 'center',
    },
    description: {
      ...commonStyles.text(theme, 'secondary', 'md'),
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
      lineHeight: 24,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: `${theme.colors.primary}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    textContainer: {
      flex: 1,
    },
    label: {
      ...commonStyles.text(theme, 'secondary', 'sm'),
      fontWeight: '600',
      marginBottom: 2,
    },
    value: {
      ...commonStyles.text(theme, 'primary', 'md'),
      fontWeight: 'bold',
    },
    arrow: {
      marginLeft: theme.spacing.sm,
    }
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Contact Support</Text>
      <Text style={styles.description}>
        If you have any issues or questions, please contact us through one of the following methods:
      </Text>

      <TouchableOpacity onPress={handleEmailPress}>
        <View style={styles.contactItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Email Us</Text>
            <Text style={styles.value}>findmydocsteam00@gmail.com</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} style={styles.arrow} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePhonePress}>
        <View style={styles.contactItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="call" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Call Us</Text>
            <Text style={styles.value}>+94 11 222 2222</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} style={styles.arrow} />
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ContactSupportScreen;
