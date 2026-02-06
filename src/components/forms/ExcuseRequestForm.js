import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../context/ThemeContext';
import DatePicker from '../../components/ui/DatePicker';
import Picker from '../../components/ui/Picker';

const ExcuseRequestForm = ({ formData, onChange }) => {
  const { theme } = useTheme();

  const studyLevels = [
    { label: '1G', value: '1G' },
    { label: '1S', value: '1S' },
    { label: '2G', value: '2G' },
    { label: '2S', value: '2S' },
    { label: '3G', value: '3G' },
    { label: '3S', value: '3S' },
    { label: '3M', value: '3M' },
    { label: '4S', value: '4S' },
    { label: '4M', value: '4M' },
    { label: '4X', value: '4X' },
  ];

  const absenceReasons = [
    { label: 'Official university assignment', value: 'official' },
    { label: 'Applicant\'s wedding', value: 'wedding' },
    { label: 'Sudden illness or hospitalization', value: 'illness' },
    { label: 'Demise of a parent/guardian/sibling', value: 'death' },
  ];


  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  const handleAbsenceChange = (index, field, value) => {
    const currentAbsences = formData?.absences || [{ courseCode: '', date: '' }];
    const updatedAbsences = [...currentAbsences];
    updatedAbsences[index] = { ...updatedAbsences[index], [field]: value };
    onChange('absences', updatedAbsences);
  };



  const addAbsence = () => {
    const currentAbsences = formData?.absences || [{ courseCode: '', date: '' }];
    onChange('absences', [...currentAbsences, { courseCode: '', date: '' }]);
  };

  const removeAbsence = (index) => {
    const currentAbsences = formData?.absences || [{ courseCode: '', date: '' }];
    if (currentAbsences.length > 1) {
      const updatedAbsences = currentAbsences.filter((_, i) => i !== index);
      onChange('absences', updatedAbsences);
    }
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
          backgroundColor: theme?.colors?.primary || '#4361ee',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: theme?.spacing?.md || 16
        }}>
          <Icon name="school" size={24} color="#ffffff" />
        </View>
        <Text style={{
          fontSize: theme?.typography?.xl?.fontSize || 24,
          fontWeight: '700',
          color: theme?.colors?.textPrimary || '#1f2937',
          marginBottom: theme?.spacing?.xs || 4
        }}>
          Excuse Request
        </Text>
        <Text style={{
          fontSize: theme?.typography?.sm?.fontSize || 14,
          color: theme?.colors?.textSecondary || '#6b7280',
          textAlign: 'center'
        }}>
          Submit your academic absence request
        </Text>
      </View>

      {/* Personal Information Section */}
      <View style={{
        backgroundColor: theme?.colors?.card,
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
            backgroundColor: theme?.colors?.primary || '#4361ee',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: theme?.spacing?.md || 16
          }}>
            <Icon name="person" size={16} color="#ffffff" />
          </View>
          <Text style={{
            fontSize: theme?.typography?.lg?.fontSize || 18,
            fontWeight: '600',
            color: theme?.colors?.textPrimary || '#1f2937'
          }}>
            Personal Information
          </Text>
        </View>

        <View style={{ gap: theme?.spacing?.md || 16, padding: 0 }}>
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
            placeholder="Registration Number *"
            placeholderTextColor={theme?.colors?.textSecondary || '#6b7280'}
            value={formData?.regNo || ''}
            onChangeText={(value) => handleInputChange('regNo', value)}
          />

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
            placeholder="Mobile Number"
            placeholderTextColor={theme?.colors?.textSecondary || '#6b7280'}
            value={formData?.mobile || ''}
            onChangeText={(value) => handleInputChange('mobile', value)}
            keyboardType="phone-pad"
          />

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
            placeholder="Email"
            placeholderTextColor={theme?.colors?.textSecondary || '#6b7280'}
            value={formData?.email || ''}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
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
            placeholder="Address"
            placeholderTextColor={theme?.colors?.textSecondary || '#6b7280'}
            value={formData?.address || ''}
            onChangeText={(value) => handleInputChange('address', value)}
            multiline
          />

          <Picker
            items={studyLevels}
            value={formData?.levelOfStudy}
            onValueChange={(value) => handleInputChange('levelOfStudy', value)}
            placeholder="Select Level of Study"
            style={{ marginBottom: 0 }}
          />

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
            placeholder="Subject Combination"
            placeholderTextColor={theme?.colors?.textSecondary || '#6b7280'}
            value={formData?.subjectCombo || ''}
            onChangeText={(value) => handleInputChange('subjectCombo', value)}
          />
        </View>
      </View>

      {/* Absence Details Section */}
      <View style={{
        backgroundColor: theme?.colors?.card,
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
            <Icon name="event-note" size={16} color="#ffffff" />
          </View>
          <Text style={{
            fontSize: theme?.typography?.lg?.fontSize || 18,
            fontWeight: '600',
            color: theme?.colors?.textPrimary || '#1f2937'
          }}>
            Absence Details
          </Text>
        </View>

        {(formData?.absences || [{ courseCode: '', date: '' }]).map((absence, index) => (
          <View key={index} style={{
            backgroundColor: theme?.colors?.backgroundTertiary || '#f9fafb',
            borderRadius: theme?.borderRadius?.md || 8,
            padding: theme?.spacing?.md || 16,
            marginBottom: theme?.spacing?.md || 16
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme?.spacing?.sm || 8
            }}>
              <Text style={{
                fontSize: theme?.typography?.md?.fontSize || 16,
                fontWeight: '600',
                color: theme?.colors?.textPrimary || '#1f2937'
              }}>
                Absence {index + 1}
              </Text>
              {(formData?.absences || []).length > 1 && (
                <TouchableOpacity
                  onPress={() => removeAbsence(index)}
                  style={{
                    backgroundColor: '#fee2e2',
                    borderRadius: 16,
                    paddingHorizontal: 12,
                    paddingVertical: 6
                  }}
                >
                  <Text style={{
                    color: '#dc2626',
                    fontSize: theme?.typography?.sm?.fontSize || 14,
                    fontWeight: '500'
                  }}>
                    Remove
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={{ gap: theme?.spacing?.sm || 8 }}>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: theme?.colors?.border || '#e5e7eb',
                  borderRadius: theme?.borderRadius?.sm || 6,
                  padding: theme?.spacing?.sm || 12,
                  fontSize: theme?.typography?.md?.fontSize || 16,
                  backgroundColor: theme?.colors?.card,
                  color: theme?.colors?.textPrimary || '#1f2937'
                }}
                placeholder="Course Code *"
                placeholderTextColor={theme?.colors?.textSecondary || '#6b7280'}
                value={absence?.courseCode || ''}
                onChangeText={(value) => handleAbsenceChange(index, 'courseCode', value)}
              />

              <DatePicker
                value={absence?.date ? new Date(absence.date) : null}
                onChange={(date) => {
                  if (date) {
                    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                    const formattedDate = localDate.toISOString().split('T')[0];
                    handleAbsenceChange(index, 'date', formattedDate);
                  }
                }}
                placeholder="Select Date *"
                minimumDate={new Date(2023, 0, 1)}
                maximumDate={new Date(2025, 11, 31)}
                style={{
                  marginBottom: 0
                }}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity
          onPress={addAbsence}
          style={{
            backgroundColor: theme?.colors?.primary || '#4361ee',
            borderRadius: theme?.borderRadius?.md || 8,
            padding: theme?.spacing?.md || 16,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8
          }}
        >
          <Icon name="add" size={20} color="#ffffff" />
          <Text style={{
            color: '#ffffff',
            fontSize: theme?.typography?.md?.fontSize || 16,
            fontWeight: '600'
          }}>
            Add Another Absence
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reason Section */}
      <View style={{
        backgroundColor: theme?.colors?.card,
        borderRadius: theme?.borderRadius?.lg || 12,
        padding: theme?.spacing?.lg || 24,
        marginBottom: theme?.spacing?.sm || 32,
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
            <Icon name="description" size={16} color="#ffffff" />
          </View>
          <Text style={{
            fontSize: theme?.typography?.lg?.fontSize || 18,
            fontWeight: '600',
            color: theme?.colors?.textPrimary || '#1f2937'
          }}>
            Reason for Absence
          </Text>
        </View>

        <View style={{ gap: theme?.spacing?.md || 16 }}>
          <Picker
            items={absenceReasons}
            value={formData?.reason}
            onValueChange={(value) => handleInputChange('reason', value)}
            placeholder="Select Reason"
            style={{ marginBottom: 0 }}
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
              minHeight: 100,
              textAlignVertical: 'top'
            }}
            placeholder="Detailed Explanation"
            placeholderTextColor={theme?.colors?.textSecondary || '#6b7280'}
            value={formData?.reasonDetails || ''}
            onChangeText={(value) => handleInputChange('reasonDetails', value)}
            multiline
          />

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
            placeholder="Lectures/Practicals Missed"
            placeholderTextColor={theme?.colors?.textSecondary || '#6b7280'}
            value={formData?.lectureAbsents || ''}
            onChangeText={(value) => handleInputChange('lectureAbsents', value)}
            keyboardType="numeric"
          />
        </View>

      </View>
    </ScrollView>

  );
};

export default ExcuseRequestForm;
