import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../context/ThemeContext';

const LeaveRequestForm = ({ formData, onChange }) => {
  const { theme } = useTheme();
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  const handleDateChange = (field, event, selectedDate) => {
    if (field === 'startDate') setShowStartDatePicker(false);
    if (field === 'endDate') setShowEndDatePicker(false);

    if (selectedDate) {
      onChange(field, selectedDate);
    }
  };

  const validateDates = () => {
    const startDate = formData?.startDate || new Date();
    const endDate = formData?.endDate || new Date();
    if (endDate <= startDate) {
      Alert.alert('Error', 'End date must be after start date');
      return false;
    }
    return true;
  };

  const formatDate = (date) => {
    if (!date) return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <ScrollView style={{
      flex: 1,
      backgroundColor: theme?.colors?.background,
      padding: theme?.spacing?.sm || 24
    }}>
      {/* Header */}
      <View style={{
        alignItems: 'center',
        marginBottom: theme?.spacing?.xl || 32,
        paddingTop: theme?.spacing?.md || 16
      }}>
        <View style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: theme?.colors?.secondary || '#f72585',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: theme?.spacing?.md || 16
        }}>
          <Icon name="beach-access" size={24} color="#ffffff" />
        </View>
        <Text style={{
          fontSize: theme?.typography?.xl?.fontSize || 24,
          fontWeight: '700',
          color: theme?.colors?.textPrimary || '#1f2937',
          marginBottom: theme?.spacing?.xs || 4
        }}>
          Leave Request
        </Text>
        <Text style={{
          fontSize: theme?.typography?.sm?.fontSize || 14,
          color: theme?.colors?.textSecondary || '#6b7280',
          textAlign: 'center'
        }}>
          Submit your leave request
        </Text>
      </View>

      {/* Leave Details Section */}
      <View style={{
        backgroundColor:  theme?.colors?.card,
        borderRadius: theme?.borderRadius?.lg || 12,
        padding: theme?.spacing?.lg || 24,
        marginBottom: theme?.spacing?.lg || 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: theme?.spacing?.lg || 24
        }}>
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: theme?.colors?.secondary || '#f72585',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: theme?.spacing?.md || 16
          }}>
            <Icon name="description" size={16} color="#ffffff" />
          </View>
          <Text style={{
            fontSize: theme?.typography?.lg?.fontSize || 18,
            fontWeight: '600',
            color: theme?.colors?.textPrimary || '#1f2937'
          }}>
            Leave Details
          </Text>
        </View>

        <View style={{ gap: theme?.spacing?.md || 16 }}>
          <View style={{
            borderWidth: 1,
            borderColor: theme?.colors?.border || '#e5e7eb',
            borderRadius: theme?.borderRadius?.md || 8,
            backgroundColor: theme?.colors?.backgroundSecondary || '#f9fafb',
          }}>
            <Picker
              selectedValue={formData?.reason || ''}
              onValueChange={(value) => handleInputChange('reason', value)}
              style={{
                color: theme?.colors?.textPrimary || '#1f2937',
                height: 50,
              }}
            >
              <Picker.Item label="-- Select Reason --" value="" />
              <Picker.Item label="Official" value="official" />
              <Picker.Item label="Personal" value="personal" />
              <Picker.Item label="Illness" value="illness" />
            </Picker>
          </View>

          <TextInput
            style={{
              borderWidth: 1,
              borderColor: theme?.colors?.border || '#e5e7eb',
              borderRadius: theme?.borderRadius?.md || 8,
              padding: theme?.spacing?.md || 16,
              fontSize: theme?.typography?.md?.fontSize || 16,
              backgroundColor: theme?.colors?.backgroundSecondary || '#f9fafb',
              color: theme?.colors?.textPrimary || '#1f2937',
              minHeight: 100,
              textAlignVertical: 'top'
            }}
            placeholder="Detailed Explanation *"
            placeholderTextColor={theme?.colors?.textSecondary || '#6b7280'}
            value={formData?.reasonDetails || ''}
            onChangeText={(value) => handleInputChange('reasonDetails', value)}
            multiline
          />
        </View>
      </View>

      {/* Date Selection Section */}
      <View style={{
        backgroundColor:  theme?.colors?.card,
        borderRadius: theme?.borderRadius?.lg || 12,
        padding: theme?.spacing?.lg || 24,
        marginBottom: theme?.spacing?.lg || 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: theme?.spacing?.lg || 24
        }}>
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: theme?.colors?.warning || '#f59e0b',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: theme?.spacing?.md || 16
          }}>
            <Icon name="date-range" size={16} color="#ffffff" />
          </View>
          <Text style={{
            fontSize: theme?.typography?.lg?.fontSize || 18,
            fontWeight: '600',
            color: theme?.colors?.textPrimary || '#1f2937'
          }}>
            Leave Period
          </Text>
        </View>

        <View style={{ gap: theme?.spacing?.md || 16 }}>
          <View>
            <Text style={{
              fontSize: theme?.typography?.sm?.fontSize || 14,
              fontWeight: '500',
              color: theme?.colors?.textSecondary || '#6b7280',
              marginBottom: theme?.spacing?.xs || 4
            }}>
              Start Date *
            </Text>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: theme?.colors?.border || '#e5e7eb',
                borderRadius: theme?.borderRadius?.md || 8,
                padding: theme?.spacing?.md || 16,
                backgroundColor: theme?.colors?.backgroundSecondary || '#f9fafb',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={{
                fontSize: theme?.typography?.md?.fontSize || 16,
                color: theme?.colors?.textPrimary || '#1f2937'
              }}>
                {formatDate(formData?.startDate)}
              </Text>
              <Icon name="calendar-today" size={20} color={theme?.colors?.textSecondary || '#6b7280'} />
            </TouchableOpacity>
          </View>

          {showStartDatePicker && (
            <DateTimePicker
              value={formData?.startDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => handleDateChange('startDate', event, date)}
              minimumDate={new Date()}
            />
          )}

          <View>
            <Text style={{
              fontSize: theme?.typography?.sm?.fontSize || 14,
              fontWeight: '500',
              color: theme?.colors?.textSecondary || '#6b7280',
              marginBottom: theme?.spacing?.xs || 4
            }}>
              End Date *
            </Text>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: theme?.colors?.border || '#e5e7eb',
                borderRadius: theme?.borderRadius?.md || 8,
                padding: theme?.spacing?.md || 16,
                backgroundColor: theme?.colors?.backgroundSecondary || '#f9fafb',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={{
                fontSize: theme?.typography?.md?.fontSize || 16,
                color: theme?.colors?.textPrimary || '#1f2937'
              }}>
                {formatDate(formData?.endDate)}
              </Text>
              <Icon name="calendar-today" size={20} color={theme?.colors?.textSecondary || '#6b7280'} />
            </TouchableOpacity>
          </View>

          {showEndDatePicker && (
            <DateTimePicker
              value={formData?.endDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => handleDateChange('endDate', event, date)}
              minimumDate={formData?.startDate || new Date()}
            />
          )}
        </View>
      </View>

      {/* Contact Information Section */}
      <View style={{
        backgroundColor:  theme?.colors?.card,
        borderRadius: theme?.borderRadius?.lg || 12,
        padding: theme?.spacing?.lg || 24,
        marginBottom: theme?.spacing?.xl || 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: theme?.spacing?.lg || 24
        }}>
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: theme?.colors?.info || '#3b82f6',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: theme?.spacing?.md || 16
          }}>
            <Icon name="contact-phone" size={16} color="#ffffff" />
          </View>
          <Text style={{
            fontSize: theme?.typography?.lg?.fontSize || 18,
            fontWeight: '600',
            color: theme?.colors?.textPrimary || '#1f2937'
          }}>
            Contact Information
          </Text>
        </View>

        <View style={{ gap: theme?.spacing?.md || 16 }}>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: theme?.colors?.border || '#e5e7eb',
              borderRadius: theme?.borderRadius?.md || 8,
              padding: theme?.spacing?.md || 16,
              fontSize: theme?.typography?.md?.fontSize || 16,
              backgroundColor: theme?.colors?.backgroundSecondary || '#f9fafb',
              color: theme?.colors?.textPrimary || '#1f2937'
            }}
            placeholder="Contact Information During Leave"
            placeholderTextColor={theme?.colors?.textSecondary || '#6b7280'}
            value={formData?.contactDuringLeave || ''}
            onChangeText={(value) => handleInputChange('contactDuringLeave', value)}
          />

          <TextInput
            style={{
              borderWidth: 1,
              borderColor: theme?.colors?.border || '#e5e7eb',
              borderRadius: theme?.borderRadius?.md || 8,
              padding: theme?.spacing?.md || 16,
              fontSize: theme?.typography?.md?.fontSize || 16,
              backgroundColor: theme?.colors?.backgroundSecondary || '#f9fafb',
              color: theme?.colors?.textPrimary || '#1f2937',
              minHeight: 80,
              textAlignVertical: 'top'
            }}
            placeholder="Additional Remarks"
            placeholderTextColor={theme?.colors?.textSecondary || '#6b7280'}
            value={formData?.remarks || ''}
            onChangeText={(value) => handleInputChange('remarks', value)}
            multiline
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default LeaveRequestForm;
