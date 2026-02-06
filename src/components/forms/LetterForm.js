import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../context/ThemeContext';
import DatePicker from '../../components/ui/DatePicker';

const LetterForm = ({ formData, onChange }) => {
  const { theme } = useTheme();

  const handleInputChange = (field, value) => {
    onChange(field, value);
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
          backgroundColor: theme?.colors?.info || '#3b82f6',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: theme?.spacing?.md || 16
        }}>
          <Icon name="description" size={24} color="#ffffff" />
        </View>
        <Text style={{
          fontSize: theme?.typography?.xl?.fontSize || 24,
          fontWeight: '700',
          color: theme?.colors?.textPrimary || '#1f2937',
          marginBottom: theme?.spacing?.xs || 4
        }}>
          General Letter
        </Text>
        <Text style={{
          fontSize: theme?.typography?.sm?.fontSize || 14,
          color: theme?.colors?.textSecondary || '#6b7280',
          textAlign: 'center'
        }}>
          Create an official letter or document
        </Text>
      </View>

      {/* Letter Type Section */}
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
            backgroundColor: theme?.colors?.info || '#3b82f6',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: theme?.spacing?.md || 16
          }}>
            <Icon name="category" size={16} color="#ffffff" />
          </View>
          <Text style={{
            fontSize: theme?.typography?.lg?.fontSize || 18,
            fontWeight: '600',
            color: theme?.colors?.textPrimary || '#1f2937'
          }}>
            Letter Type
          </Text>
        </View>

        <Text style={{
          fontSize: theme?.typography?.sm?.fontSize || 14,
          fontWeight: '500',
          color: theme?.colors?.textSecondary || '#6b7280',
          marginBottom: theme?.spacing?.md || 16
        }}>
          Select the type of letter you want to create *
        </Text>

        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: theme?.spacing?.sm || 8
        }}>
          {['Official', 'Request', 'Application', 'Complaint', 'Other'].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => handleInputChange('type', type)}
              style={{
                paddingHorizontal: theme?.spacing?.md || 16,
                paddingVertical: theme?.spacing?.sm || 12,
                backgroundColor: formData?.type === type
                  ? (theme?.colors?.info || '#3b82f6')
                  : (theme?.colors?.backgroundSecondary || '#f9fafb'),
                borderRadius: theme?.borderRadius?.lg || 12,
                borderWidth: 2,
                borderColor: formData?.type === type
                  ? (theme?.colors?.info || '#3b82f6')
                  : (theme?.colors?.border || '#e5e7eb'),
                minWidth: '30%'
              }}
            >
              <Text style={{
                color: formData?.type === type
                  ? '#ffffff'
                  : (theme?.colors?.textPrimary || '#1f2937'),
                fontSize: theme?.typography?.sm?.fontSize || 14,
                fontWeight: '600',
                textAlign: 'center'
              }}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Subject/Reason Section */}
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
            <Icon name="subject" size={16} color="#ffffff" />
          </View>
          <Text style={{
            fontSize: theme?.typography?.lg?.fontSize || 18,
            fontWeight: '600',
            color: theme?.colors?.textPrimary || '#1f2937'
          }}>
            Subject & Details
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
              Reason/Subject *
            </Text>
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
              placeholder="Enter the reason for this letter"
              placeholderTextColor={theme?.colors?.textSecondary || '#6b7280'}
              value={formData?.reason || ''}
              onChangeText={(text) => handleInputChange('reason', text)}
            />
          </View>

          <View>
            <Text style={{
              fontSize: theme?.typography?.sm?.fontSize || 14,
              fontWeight: '500',
              color: theme?.colors?.textSecondary || '#6b7280',
              marginBottom: theme?.spacing?.xs || 4
            }}>
              Date
            </Text>
            <DatePicker
              value={formData?.date ? new Date(formData.date) : null}
              onChange={(date) => {
                if (date) {
                  const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                  const formattedDate = localDate.toISOString().split('T')[0];
                  handleInputChange('date', formattedDate);
                }
              }}
              placeholder="Select Date"
              style={{ marginBottom: 0 }}
            />
          </View>
        </View>
      </View>

      {/* Additional Details Section */}
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
            backgroundColor: theme?.colors?.success || '#10b981',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: theme?.spacing?.md || 16
          }}>
            <Icon name="notes" size={16} color="#ffffff" />
          </View>
          <Text style={{
            fontSize: theme?.typography?.lg?.fontSize || 18,
            fontWeight: '600',
            color: theme?.colors?.textPrimary || '#1f2937'
          }}>
            Additional Details
          </Text>
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
            minHeight: 120,
            textAlignVertical: 'top'
          }}
          placeholder="Provide any additional details or context for this letter..."
          placeholderTextColor={theme?.colors?.textSecondary || '#6b7280'}
          value={formData?.details || ''}
          onChangeText={(text) => handleInputChange('details', text)}
          multiline
          numberOfLines={6}
        />

        <Text style={{
          fontSize: theme?.typography?.xs?.fontSize || 12,
          color: theme?.colors?.textSecondary || '#6b7280',
          marginTop: theme?.spacing?.sm || 8,
          fontStyle: 'italic'
        }}>
          Include any specific information, requirements, or context that should be included in the letter.
        </Text>
      </View>
    </ScrollView>
  );
};

export default LetterForm;
