import React from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../context/ThemeContext';
import DatePicker from '../../components/ui/DatePicker';
import Picker from '../../components/ui/Picker';
import FileUploader from '../FileUploader';

const LeaveRequestForm = ({ formData, onChange }) => {
  const { theme } = useTheme();

  const leaveReasons = [
    { label: 'Official', value: 'official' },
    { label: 'Personal', value: 'personal' },
    { label: 'Illness', value: 'illness' },
  ];

  const handleInputChange = (field, value) => {
    onChange(field, value);
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
          <Picker
            items={leaveReasons}
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
            <DatePicker
              value={formData?.startDate ? new Date(formData.startDate) : null}
              onChange={(date) => handleInputChange('startDate', date)}
              placeholder="Select Start Date"
              minimumDate={new Date()}
              style={{ marginBottom: 0 }}
            />
          </View>

          <View>
            <Text style={{
              fontSize: theme?.typography?.sm?.fontSize || 14,
              fontWeight: '500',
              color: theme?.colors?.textSecondary || '#6b7280',
              marginBottom: theme?.spacing?.xs || 4
            }}>
              End Date *
            </Text>
            <DatePicker
              value={formData?.endDate ? new Date(formData.endDate) : null}
              onChange={(date) => handleInputChange('endDate', date)}
              placeholder="Select End Date"
              minimumDate={formData?.startDate ? new Date(formData.startDate) : new Date()}
              style={{ marginBottom: 0 }}
            />
          </View>
        </View>
      </View>

      {/* Contact Information Section */}
      <View style={{
        backgroundColor: theme?.colors?.card,
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

      {/* Supporting Document Section */}
      <View style={{
        backgroundColor: theme?.colors?.card,
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
            backgroundColor: theme?.colors?.primary || '#4361ee',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: theme?.spacing?.md || 16
          }}>
            <Icon name="attach-file" size={16} color="#ffffff" />
          </View>
          <Text style={{
            fontSize: theme?.typography?.lg?.fontSize || 18,
            fontWeight: '600',
            color: theme?.colors?.textPrimary || '#1f2937'
          }}>
            Supporting Document
          </Text>
        </View>

        <FileUploader
          onFileSelect={(file) => handleInputChange('supportingDocument', file)}
          buttonText="Select Supporting Document"
          fieldName="supportingDocument"
          style={{ marginTop: theme?.spacing?.xs || 4 }}
        />
        <Text style={{
          fontSize: theme?.typography?.xs?.fontSize || 12,
          color: theme?.colors?.textSecondary || '#6b7280',
          marginTop: theme?.spacing?.sm || 8,
          fontStyle: 'italic'
        }}>
          Upload any relevant documents to support your leave request (e.g., medical certificate, invitation letter, etc.)
        </Text>
      </View>
    </ScrollView>
  );
};

export default LeaveRequestForm;
