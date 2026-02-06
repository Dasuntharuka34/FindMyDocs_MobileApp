import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { Alert, Platform } from 'react-native';

// File type constants
export const FILE_TYPES = {
  IMAGE: 'image',
  PDF: 'pdf',
  DOCUMENT: 'document',
  ALL: 'all'
};

// MIME type mappings
export const MIME_TYPES = {
  JPEG: 'image/jpeg',
  JPG: 'image/jpg',
  PNG: 'image/png',
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  PDF: 5 * 1024 * 1024,   // 5MB
  DOCUMENT: 5 * 1024 * 1024, // 5MB
  DEFAULT: 5 * 1024 * 1024 // 5MB
};

// Allowed file extensions
export const ALLOWED_EXTENSIONS = {
  IMAGE: ['.jpg', '.jpeg', '.png'],
  PDF: ['.pdf'],
  DOCUMENT: ['.doc', '.docx'],
  ALL: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx']
};

// Error messages
export const FILE_ERRORS = {
  PERMISSION_DENIED: 'Permission to access files was denied',
  FILE_TOO_LARGE: 'File size is too large. Maximum size is 5MB.',
  INVALID_TYPE: 'File type is not supported. Please select a valid file.',
  NO_FILE_SELECTED: 'No file was selected',
  UPLOAD_FAILED: 'File upload failed',
  UNKNOWN_ERROR: 'An unknown error occurred'
};

// Request file system permissions
export const requestPermissions = async () => {
  try {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need media library permissions to select files.'
        );
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('Permission request error:', error);
    return false;
  }
};

// Validate file size
export const validateFileSize = (fileSize, fileType = 'DEFAULT') => {
  const maxSize = FILE_SIZE_LIMITS[fileType] || FILE_SIZE_LIMITS.DEFAULT;
  return fileSize <= maxSize;
};

// Validate file type
export const validateFileType = (fileName, allowedTypes = 'ALL') => {
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  const allowedExtensions = ALLOWED_EXTENSIONS[allowedTypes] || ALLOWED_EXTENSIONS.ALL;
  return allowedExtensions.includes(extension);
};

// Get file information
export const getFileInfo = async (fileUri) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    const fileName = fileUri.split('/').pop();
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    
    return {
      uri: fileUri,
      name: fileName,
      size: fileInfo.size,
      extension: extension,
      exists: fileInfo.exists
    };
  } catch (error) {
    console.error('Error getting file info:', error);
    throw error;
  }
};

// Pick image from gallery
export const pickImage = async (options = {}) => {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return { success: false, error: FILE_ERRORS.PERMISSION_DENIED };
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.images,
      allowsEditing: options.allowsEditing || true,
      aspect: options.aspect || [4, 3],
      quality: options.quality || 0.5,
      base64: options.base64 || false,
      ...options
    });

    if (result.canceled) {
      return { success: false, error: FILE_ERRORS.NO_FILE_SELECTED };
    }

    const asset = result.assets[0];
    const fileInfo = await getFileInfo(asset.uri);

    // Validate file
    if (!validateFileSize(fileInfo.size, 'IMAGE')) {
      return { success: false, error: FILE_ERRORS.FILE_TOO_LARGE };
    }

    if (!validateFileType(fileInfo.name, 'IMAGE')) {
      return { success: false, error: FILE_ERRORS.INVALID_TYPE };
    }

    return {
      success: true,
      data: {
        ...fileInfo,
        type: 'image',
        width: asset.width,
        height: asset.height
      }
    };

  } catch (error) {
    console.error('Image picker error:', error);
    return { success: false, error: error.message || FILE_ERRORS.UNKNOWN_ERROR };
  }
};

// Pick document file
export const pickDocument = async (options = {}) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: options.type || '*/*',
      copyToCacheDirectory: options.copyToCacheDirectory ?? true,
      multiple: options.multiple || false,
      ...options
    });

    if (result.canceled) {
      return { success: false, error: FILE_ERRORS.NO_FILE_SELECTED };
    }

    const asset = result.assets[0];
    const fileInfo = await getFileInfo(asset.uri);

    // Validate file size
    if (!validateFileSize(fileInfo.size, 'DOCUMENT')) {
      return { success: false, error: FILE_ERRORS.FILE_TOO_LARGE };
    }

    // Validate file type
    if (!validateFileType(fileInfo.name, options.allowedTypes || 'ALL')) {
      return { success: false, error: FILE_ERRORS.INVALID_TYPE };
    }

    return {
      success: true,
      data: {
        ...fileInfo,
        type: getFileTypeFromExtension(fileInfo.extension),
        mimeType: asset.mimeType
      }
    };

  } catch (error) {
    console.error('Document picker error:', error);
    return { success: false, error: error.message || FILE_ERRORS.UNKNOWN_ERROR };
  }
};

// Get file type from extension
export const getFileTypeFromExtension = (extension) => {
  switch (extension) {
    case '.jpg':
    case '.jpeg':
    case '.png':
      return 'image';
    case '.pdf':
      return 'pdf';
    case '.doc':
    case '.docx':
      return 'document';
    default:
      return 'unknown';
  }
};

// Prepare file for upload (creates FormData)
export const prepareFileForUpload = async (fileUri, fieldName, additionalData = {}) => {
  try {
    const fileInfo = await getFileInfo(fileUri);
    
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    const formData = new FormData();

    // Add additional data to form data
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    // Append file with proper type detection
    const fileType = getFileTypeFromExtension(fileInfo.extension);
    let mimeType = MIME_TYPES.JPEG;

    switch (fileType) {
      case 'image':
        mimeType = fileInfo.extension === '.png' ? MIME_TYPES.PNG : MIME_TYPES.JPEG;
        break;
      case 'pdf':
        mimeType = MIME_TYPES.PDF;
        break;
      case 'document':
        mimeType = fileInfo.extension === '.docx' ? MIME_TYPES.DOCX : MIME_TYPES.DOC;
        break;
    }

    const fileObject = {
      uri: fileUri,
      name: fileInfo.name,
      type: mimeType,
    };

    formData.append(fieldName, fileObject);

    return {
      success: true,
      data: formData,
      fileInfo: fileInfo
    };

  } catch (error) {
    console.error('File preparation error:', error);
    return { success: false, error: error.message || FILE_ERRORS.UNKNOWN_ERROR };
  }
};

// Upload file to server
export const uploadFile = async (fileUri, fieldName, apiEndpoint, additionalData = {}) => {
  try {
    // Prepare file for upload
    const preparation = await prepareFileForUpload(fileUri, fieldName, additionalData);
    
    if (!preparation.success) {
      return preparation;
    }

    // Get auth token if needed
    const token = await SecureStore.getItemAsync('token');
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      body: preparation.data,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const responseData = await response.json();

    return {
      success: true,
      data: responseData,
      fileInfo: preparation.fileInfo
    };

  } catch (error) {
    console.error('File upload error:', error);
    return { success: false, error: error.message || FILE_ERRORS.UPLOAD_FAILED };
  }
};

// Take photo with camera
export const takePhoto = async (options = {}) => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera permissions to take photos.'
      );
      return { success: false, error: FILE_ERRORS.PERMISSION_DENIED };
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.images,
      allowsEditing: options.allowsEditing || true,
      aspect: options.aspect || [4, 3],
      quality: options.quality || 0.8,
      base64: options.base64 || false,
      ...options
    });

    if (result.canceled) {
      return { success: false, error: FILE_ERRORS.NO_FILE_SELECTED };
    }

    const asset = result.assets[0];
    const fileInfo = await getFileInfo(asset.uri);

    // Validate file
    if (!validateFileSize(fileInfo.size, 'IMAGE')) {
      return { success: false, error: FILE_ERRORS.FILE_TOO_LARGE };
    }

    return {
      success: true,
      data: {
        ...fileInfo,
        type: 'image',
        width: asset.width,
        height: asset.height
      }
    };

  } catch (error) {
    console.error('Camera error:', error);
    return { success: false, error: error.message || FILE_ERRORS.UNKNOWN_ERROR };
  }
};

// Multiple file selection
export const pickMultipleFiles = async (type = 'ALL', options = {}) => {
  try {
    let results;
    
    if (type === 'IMAGE') {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        return { success: false, error: FILE_ERRORS.PERMISSION_DENIED };
      }

      results = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.images,
        allowsMultipleSelection: true,
        quality: options.quality || 0.8,
        ...options
      });
    } else {
      results = await DocumentPicker.getDocumentAsync({
        type: type === 'ALL' ? '*/*' : `${type}/*`,
        copyToCacheDirectory: true,
        multiple: true,
        ...options
      });
    }

    if (results.canceled) {
      return { success: false, error: FILE_ERRORS.NO_FILE_SELECTED };
    }

    const files = [];
    
    for (const asset of results.assets) {
      try {
        const fileInfo = await getFileInfo(asset.uri);

        // Validate each file
        if (!validateFileSize(fileInfo.size, type)) {
          console.warn(`File ${fileInfo.name} is too large, skipping`);
          continue;
        }

        if (!validateFileType(fileInfo.name, type)) {
          console.warn(`File ${fileInfo.name} has invalid type, skipping`);
          continue;
        }

        files.push({
          ...fileInfo,
          type: getFileTypeFromExtension(fileInfo.extension),
          mimeType: asset.mimeType
        });
      } catch (error) {
        console.warn(`Error processing file: ${error.message}`);
      }
    }

    if (files.length === 0) {
      return { success: false, error: 'No valid files were selected' };
    }

    return {
      success: true,
      data: files,
      count: files.length
    };

  } catch (error) {
    console.error('Multiple file picker error:', error);
    return { success: false, error: error.message || FILE_ERRORS.UNKNOWN_ERROR };
  }
};

// Delete local file
export const deleteLocalFile = async (fileUri) => {
  try {
    await FileSystem.deleteAsync(fileUri, { idempotent: true });
    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.message };
  }
};

// Get file size in human-readable format
export const getReadableFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Check available storage space
export const getFreeDiskSpace = async () => {
  try {
    const freeDiskSpace = await FileSystem.getFreeDiskStorageAsync();
    return {
      success: true,
      freeSpace: freeDiskSpace,
      readable: getReadableFileSize(freeDiskSpace)
    };
  } catch (error) {
    console.error('Error getting disk space:', error);
    return { success: false, error: error.message };
  }
};

export default {
  // File picking
  pickImage,
  pickDocument,
  takePhoto,
  pickMultipleFiles,
  
  // File operations
  prepareFileForUpload,
  uploadFile,
  deleteLocalFile,
  getFileInfo,
  
  // Utilities
  validateFileSize,
  validateFileType,
  getReadableFileSize,
  getFreeDiskSpace,
  requestPermissions,
  
  // Constants
  FILE_TYPES,
  MIME_TYPES,
  FILE_SIZE_LIMITS,
  ALLOWED_EXTENSIONS,
  FILE_ERRORS
};