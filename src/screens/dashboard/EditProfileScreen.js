import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { commonStyles, useTheme } from '../../context/ThemeContext';
import { updateUser } from '../../services/api';

const EditProfileScreen = ({ navigation }) => {
  const { user, updateUser: updateUserContext } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    nic: '',
    department: '',
    indexNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        nic: user.nic || '',
        department: user.department || '',
        indexNumber: user.indexNumber || ''
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    const newTouched = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      newTouched.name = true;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      newTouched.email = true;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      newTouched.email = true;
    }

    // Mobile validation (optional but if provided, should be valid)
    if (formData.mobile.trim()) {
      const mobileRegex = /^[0-9+\-\s()]+$/;
      if (!mobileRegex.test(formData.mobile)) {
        newErrors.mobile = 'Please enter a valid mobile number';
        newTouched.mobile = true;
      }
    }

    // NIC validation (optional but if provided, should be valid)
    if (formData.nic.trim()) {
      const nicRegex = /^[0-9]{9}[vVxX]?$/;
      if (!nicRegex.test(formData.nic)) {
        newErrors.nic = 'Please enter a valid NIC number';
        newTouched.nic = true;
      }
    }

    setErrors(newErrors);
    setTouched({ ...touched, ...newTouched });

    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleInputBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await updateUser(user._id, formData);
      if (updatedUser) {
        updateUserContext(updatedUser);
        Alert.alert('Success', 'Profile updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Update Failed', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      ...commonStyles.container(theme),
      padding: theme.spacing.sm,
    },
    header: {
      ...commonStyles.text(theme, 'primary', 'xxl'),
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    formContainer: {
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      ...commonStyles.text(theme, 'primary', 'lg'),
      fontWeight: '600',
      marginBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingBottom: theme.spacing.xs,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xl
    },
    saveButton: {
      flex: 1,
    },
    cancelButton: {
      flex: 1,
    },
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>Edit Profile</Text>

        <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <Input
          label="Full Name"
          value={formData.name}
          onChangeText={(value) => handleInputChange('name', value)}
          onBlur={() => handleInputBlur('name')}
          placeholder="Enter your full name"
          error={errors.name}
          touched={touched.name}
          autoCapitalize="words"
        />

        <Input
          label="Email Address"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          onBlur={() => handleInputBlur('email')}
          placeholder="Enter your email address"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          touched={touched.email}
        />

        <Input
          label="Mobile Number"
          value={formData.mobile}
          onChangeText={(value) => handleInputChange('mobile', value)}
          onBlur={() => handleInputBlur('mobile')}
          placeholder="Enter your mobile number"
          keyboardType="phone-pad"
          error={errors.mobile}
          touched={touched.mobile}
        />

        <Input
          label="NIC Number"
          value={formData.nic}
          onChangeText={(value) => handleInputChange('nic', value)}
          onBlur={() => handleInputBlur('nic')}
          placeholder="Enter your NIC number"
          autoCapitalize="none"
          error={errors.nic}
          touched={touched.nic}
        />

        <Text style={[styles.sectionTitle, { marginTop: theme.spacing.lg }]}>Academic Information</Text>

        <Input
          label="Department"
          value={formData.department}
          onChangeText={(value) => handleInputChange('department', value)}
          onBlur={() => handleInputBlur('department')}
          placeholder="Enter your department"
          autoCapitalize="words"
        />

        <Input
          label="Index Number"
          value={formData.indexNumber}
          onChangeText={(value) => handleInputChange('indexNumber', value)}
          onBlur={() => handleInputBlur('indexNumber')}
          placeholder="Enter your index number"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          variant="secondary"
          onPress={() => navigation.goBack()}
          disabled={loading}
          style={styles.cancelButton}
        >
          Cancel
        </Button>

        <Button
          variant="primary"
          onPress={handleSave}
          loading={loading}
          style={styles.saveButton}
        >
          Save Changes
        </Button>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;
