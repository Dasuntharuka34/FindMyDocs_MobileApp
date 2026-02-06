import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ExcuseRequestForm from '../../components/forms/ExcuseRequestForm';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestsContext';
import { useTheme } from '../../context/ThemeContext';

const ExcuseRequestScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { submitRequest, isLoading } = useRequests();
  const [formData, setFormData] = useState({
    regNo: user?.indexNumber || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    address: '',
    levelOfStudy: '',
    subjectCombo: '',
    reason: '',
    reasonDetails: '',
    lectureAbsents: '',
    absences: [{ courseCode: '', date: '' }],
    status: 'Pending Lecturer Approval',
    submittedDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    approvals: [
      {
        approverRole: 'Lecturer',
        approverId: null,
        approverName: '',
        status: 'pending',
        comment: '',
        approvedAt: null
      },
      {
        approverRole: 'HOD',
        approverId: null,
        approverName: '',
        status: 'pending',
        comment: '',
        approvedAt: null
      }
    ],
    currentStageIndex: 0
  });
  const [medicalCertificate, setMedicalCertificate] = useState(null);
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePickMedicalCertificate = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setMedicalCertificate(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleRemoveMedicalCertificate = () => {
    setMedicalCertificate(null);
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.regNo || !formData.reason) {
        Alert.alert('Error', 'Please fill in all required fields (Registration Number and Reason)');
        return;
      }

      // Validate Medical Certificate
      if (!medicalCertificate) {
        Alert.alert('Error', 'Please attach a Medical Certificate');
        return;
      }

      // Validate absences
      const validAbsences = formData.absences.filter(absence =>
        absence.courseCode && absence.date
      ).map(absence => ({
        courseCode: absence.courseCode,
        date: absence.date.includes('/') ? absence.date.split('/').join('-') : absence.date
      }));

      if (validAbsences.length === 0) {
        Alert.alert('Error', 'Please add at least one absence with course code and date');
        return;
      }

      // Prepare request data
      const requestData = {
        ...formData,
        studentId: user._id,
        studentName: user.name,
        regNo: user.indexNumber || formData.regNo,
        absences: validAbsences,
        status: 'Pending Lecturer Approval',
        submittedDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        currentStageIndex: 0,
        approvals: [
          {
            approverRole: 'Lecturer',
            approverId: null,
            approverName: '',
            status: 'pending',
            comment: '',
            approvedAt: null
          },
          {
            approverRole: 'HOD',
            approverId: null,
            approverName: '',
            status: 'pending',
            comment: '',
            approvedAt: null
          }
        ]
      };

      // Add attachments if medical certificate is present
      if (medicalCertificate) {
        requestData.attachments = medicalCertificate.uri;
        requestData.medicalCertificate = medicalCertificate;
      }

      console.log('Submitting excuse request:', requestData);
      console.log('Medical certificate attached:', medicalCertificate);

      const result = await submitRequest('excuse', requestData);

      if (result.success) {
        Alert.alert('Success', 'Excuse request submitted successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    }
  };



  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme?.colors?.background || '#ffffff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: theme?.spacing?.lg || 24 }}>
          <ExcuseRequestForm
            formData={formData}
            onChange={handleFormChange}
            theme={theme}
          />

          {/* Medical Certificate Section */}
          <View style={{ marginTop: theme?.spacing?.lg || 24 }}>
            <Text style={{
              fontSize: theme?.typography?.md?.fontSize || 16,
              fontWeight: '600',
              color: theme?.colors?.textPrimary || '#1f2937',
              marginBottom: theme?.spacing?.md || 16
            }}>
              Medical Certificate *
            </Text>

            {!medicalCertificate && (
              <TouchableOpacity
                onPress={handlePickMedicalCertificate}
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
                <Icon name="attach-file" size={20} color="#ffffff" />
                <Text style={{
                  color: '#ffffff',
                  fontSize: theme?.typography?.md?.fontSize || 16,
                  fontWeight: '600'
                }}>
                  Attach Medical Certificate
                </Text>
              </TouchableOpacity>
            )}

            {medicalCertificate && (
              <View style={{
                marginTop: theme?.spacing?.sm || 8,
                padding: theme?.spacing?.sm || 8,
                backgroundColor: theme?.colors?.backgroundSecondary || '#f3f4f6',
                borderRadius: theme?.borderRadius?.sm || 6,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Icon name="insert-drive-file" size={16} color={theme?.colors?.textSecondary || '#6b7280'} />
                  <Text style={{
                    fontSize: theme?.typography?.sm?.fontSize || 14,
                    color: theme?.colors?.textPrimary || '#1f2937',
                    marginLeft: theme?.spacing?.xs || 4,
                    flex: 1
                  }} numberOfLines={1}>
                    {medicalCertificate.name || 'Attached file'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleRemoveMedicalCertificate}
                  style={{
                    padding: theme?.spacing?.xs || 4
                  }}
                >
                  <Icon name="close" size={16} color={theme?.colors?.error || '#dc2626'} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Button
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={{ marginTop: theme?.spacing?.xl || 32 }}
          >
            Submit Excuse Request
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ExcuseRequestScreen;
