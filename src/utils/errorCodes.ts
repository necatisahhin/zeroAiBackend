// Validation error codes mapping
export const VALIDATION_ERROR_CODES: Record<string, string> = {
    'Full name is required': 'VALL_ERROR_01',
    'Full name must be between 2 and 100 characters': 'VALL_ERROR_02',
    'Full name must be a string': 'VALL_ERROR_03',
    'Email is required': 'VALL_ERROR_04',
    'Invalid email format': 'VALL_ERROR_05',
    'Email must be a string': 'VALL_ERROR_06',
    'Email already in use': 'VALL_ERROR_07',
    'Password is required': 'VALL_ERROR_08',
    'Password must be at least 8 characters long': 'VALL_ERROR_09',
    'Password must be a string': 'VALL_ERROR_10',
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character': 'VALL_ERROR_11',
    'Social media links must be an object': 'VALL_ERROR_12',
    'Invalid YouTube URL': 'VALL_ERROR_13',
    'Invalid Instagram URL': 'VALL_ERROR_14',
    'Invalid Twitter URL': 'VALL_ERROR_15',
    'Invalid Facebook URL': 'VALL_ERROR_16',
    'Invalid LinkedIn URL': 'VALL_ERROR_17',

    // Restaurant validation errors
    'Restaurant name is required': 'VALL_ERROR_18',
    'Restaurant name must be between 2 and 100 characters': 'VALL_ERROR_19',
    'Restaurant name must be a string': 'VALL_ERROR_20',
    'Address is required': 'VALL_ERROR_21',
    'Address must be between 5 and 200 characters': 'VALL_ERROR_22',
    'Address must be a string': 'VALL_ERROR_23',
    'Phone number must be a string': 'VALL_ERROR_24',
    'Invalid phone number format': 'VALL_ERROR_25',
    'Restaurant ID is required': 'VALL_ERROR_26',
    'Restaurant ID must be a string': 'VALL_ERROR_27',

    // Profile validation errors
    'Role must be a string': 'VALL_ERROR_28',
    'Invalid role': 'VALL_ERROR_29',
    'is_active must be a boolean': 'VALL_ERROR_30',

};

export const getValidationErrorCode = (message: string): string => {
    return VALIDATION_ERROR_CODES[message] || 'VALL_ERROR_00';
};
