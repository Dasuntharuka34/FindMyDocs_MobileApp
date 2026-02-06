import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const RequestTypeSelector = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const requestTypes = [
    {
      id: 'excuse',
      title: 'Excuse Request',
      description: 'For academic absences and medical excuses',
      icon: 'school',
      color: theme?.colors?.primary || '#4361ee',
      screen: 'ExcuseRequest'
    },
    {
      id: 'leave',
      title: 'Leave Request',
      description: 'For personal leave and time off requests',
      icon: 'beach-access',
      color: theme?.colors?.secondary || '#f72585',
      screen: 'LeaveRequest',
      roles: ['Lecturer', 'HOD', 'Dean', 'VC', 'Admin']
    },
    {
      id: 'letter',
      title: 'General Letter',
      description: 'For official letters and documentation',
      icon: 'description',
      color: theme?.colors?.info || '#3b82f6',
      screen: 'LetterRequest'
    }
  ].filter(type => {
    if (!type.roles) return true;
    return type.roles.includes(user?.role);
  });

  const handleTypeSelect = (type) => {
    navigation.navigate(type.screen);
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme?.colors?.background || '#ffffff',
      padding: theme?.spacing?.lg || 24,
      paddingBottom: theme?.spacing?.xl || 32,
    }}>
      {/* Header Section */}
      <View style={{
        alignItems: 'center',
        marginBottom: theme?.spacing?.xl || 32,
        paddingTop: theme?.spacing?.md || 16,
        backgroundColor: theme?.colors?.card || '#ffffff',
        borderRadius: theme?.borderRadius?.xl || 20,
        padding: theme?.spacing?.xl || 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}>
        <View style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          backgroundColor: theme?.colors?.primary || '#4361ee',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: theme?.spacing?.lg || 24,
          shadowColor: theme?.colors?.primary || '#4361ee',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 10,
          borderWidth: 4,
          borderColor: `${theme?.colors?.primary}30` || '#4361ee30',
        }}>
          <Icon name="description" size={36} color="#ffffff" />
        </View>
        <Text style={{
          fontSize: theme?.typography?.xxl?.fontSize || 28,
          fontWeight: '700',
          color: theme?.colors?.textPrimary || '#1f2937',
          marginBottom: theme?.spacing?.sm || 8,
          textAlign: 'center',
          letterSpacing: 0.5,
        }}>
          New Request
        </Text>
        <Text style={{
          fontSize: theme?.typography?.md?.fontSize || 16,
          color: theme?.colors?.textSecondary || '#6b7280',
          textAlign: 'center',
          lineHeight: 24,
          maxWidth: 280,
        }}>
          Choose the type of request you want to submit
        </Text>
      </View>

      {/* Request Types Grid */}
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme?.spacing?.lg || 20,
        justifyContent: 'center',
        alignItems: 'stretch',
      }}>
        {requestTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            onPress={() => handleTypeSelect(type)}
            style={{
              backgroundColor: theme?.colors?.card || '#ffffff',
              borderWidth: 2,
              borderColor: `${type.color}30`,
              borderRadius: theme?.borderRadius?.xl || 20,
              padding: theme?.spacing?.md || 16,
              paddingVertical: theme?.spacing?.sm || 12,
              flex: 1,
              minWidth: 280,
              maxWidth: 320,
              height: 160,
              alignItems: 'center',
              shadowColor: type.color,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 6,
              transform: [{ scale: 1 }],
            }}
            activeOpacity={0.9}
          >
            {/* Icon Container */}
            <View style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: `${type.color}15`,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: theme?.spacing?.sm || 12,
              borderWidth: 2,
              borderColor: `${type.color}30`,
              shadowColor: type.color,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}>
              <Icon
                name={type.icon}
                size={32}
                color={type.color}
              />
            </View>

            {/* Content */}
            <View style={{
              alignItems: 'center',
              flex: 1,
              width: '100%',
              backgroundColor: `${type.color}05`,
              borderRadius: theme?.borderRadius?.lg || 16,
              padding: theme?.spacing?.sm || 12,
            }}>
              <Text style={{
                fontSize: theme?.typography?.md?.fontSize || 16,
                fontWeight: '700',
                color: theme?.colors?.textPrimary || '#1f2937',
                marginBottom: theme?.spacing?.xs || 4,
                textAlign: 'center',
                letterSpacing: 0.3,
              }}>
                {type.title}
              </Text>
              <Text style={{
                fontSize: theme?.typography?.xs?.fontSize || 12,
                color: theme?.colors?.textSecondary || '#6b7280',
                textAlign: 'center',
                lineHeight: 16,
                maxWidth: 220,
              }}>
                {type.description}
              </Text>
            </View>

            {/* Arrow Indicator */}
            <View style={{
              position: 'absolute',
              top: theme?.spacing?.md || 16,
              right: theme?.spacing?.md || 16,
              backgroundColor: `${type.color}20`,
              borderRadius: 16,
              padding: 8,
              borderWidth: 2,
              borderColor: `${type.color}30`,
            }}>
              <Icon
                name="arrow-forward"
                size={20}
                color={type.color}
              />
            </View>

            {/* Bottom Gradient Effect */}
            <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              backgroundColor: type.color,
              borderBottomLeftRadius: theme?.borderRadius?.xl || 20,
              borderBottomRightRadius: theme?.borderRadius?.xl || 20,
              opacity: 0.1,
            }} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default RequestTypeSelector;