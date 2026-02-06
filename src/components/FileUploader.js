import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

const FileUploader = ({
  onFileSelect,
  allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'],
  maxSizeMB = 10,
  buttonText = "Select File",
  fieldName = "file",
  style,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { theme } = useTheme();

  const validateFile = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const fileSizeMB = file.size / (1024 * 1024);

    if (!allowedTypes.includes(`.${fileExtension}`)) {
      throw new Error(`Only ${allowedTypes.join(', ')} files are allowed`);
    }

    if (fileSizeMB > maxSizeMB) {
      throw new Error(`File size must be less than ${maxSizeMB}MB`);
    }

    return true;
  };

  const pickDocument = async () => {
    if (disabled) return;

    try {
      setIsLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedTypes.map(type => `application/${type.replace('.', '')}`),
      });

      if (result.canceled) return;

      const file = result.assets[0];
      validateFile(file);

      setSelectedFile(file);
      onFileSelect?.(file, fieldName);

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    if (disabled) return;

    try {
      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      const file = {
        uri: asset.uri,
        name: asset.uri.split('/').pop(),
        size: asset.fileSize || 0,
        type: asset.type || 'image',
      };

      validateFile(file);
      setSelectedFile(file);
      onFileSelect?.(file, fieldName);

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    onFileSelect?.(null, fieldName);
  };

  const getFileIcon = () => {
    if (!selectedFile) return 'attach-file';
    
    const extension = selectedFile.name.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'pdf': return 'picture-as-pdf';
      case 'doc': case 'docx': return 'description';
      case 'jpg': case 'jpeg': case 'png': return 'image';
      default: return 'insert-drive-file';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, style]}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading file...
        </Text>
      </View>
    );
  }

  return (
    <View style={style}>
      {selectedFile ? (
        <View style={styles.fileContainer}>
          <View style={styles.fileInfo}>
            <Icon 
              name={getFileIcon()} 
              size={24} 
              color={theme.colors.primary} 
              style={styles.fileIcon}
            />
            <View style={styles.fileDetails}>
              <Text 
                style={[styles.fileName, { color: theme.colors.textPrimary }]}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {selectedFile.name}
              </Text>
              <Text style={[styles.fileSize, { color: theme.colors.textSecondary }]}>
                {formatFileSize(selectedFile.size)}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={removeFile} style={styles.removeButton}>
            <Icon name="close" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          onPress={pickDocument}
          disabled={disabled}
          style={[
            styles.uploadButton,
            { 
              backgroundColor: disabled ? theme.colors.border : theme.colors.primaryLight,
              borderColor: theme.colors.primary,
            }
          ]}
        >
          <Icon 
            name="cloud-upload" 
            size={20} 
            color={disabled ? theme.colors.textTertiary : theme.colors.primary} 
          />
          <Text style={[
            styles.buttonText, 
            { 
              color: disabled ? theme.colors.textTertiary : theme.colors.primary,
              marginLeft: theme.spacing.sm,
            }
          ]}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = {
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileIcon: {
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
};

export default FileUploader;