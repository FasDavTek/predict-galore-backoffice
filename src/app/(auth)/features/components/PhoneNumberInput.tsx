/**
 * Phone Number Input Component
 * Memoized for performance
 */

'use client';

import React, { memo, useCallback, useMemo } from 'react';
import { TextField, Autocomplete, InputAdornment } from '@mui/material';
import { Phone as PhoneIcon } from '@mui/icons-material';
import { UseFormRegister, UseFormSetValue, FieldErrors, useWatch, Control } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import { designTokens } from '@/shared/styles/tokens';
import type { RegisterFormData, CountryCode } from '@/features/auth/validations/auth';

const countryCodes: CountryCode[] = [
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
];

interface PhoneNumberInputProps {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  setValue: UseFormSetValue<RegisterFormData>;
  control: Control<RegisterFormData>;
}

export const PhoneNumberInput = memo<PhoneNumberInputProps>(({
  register,
  errors,
  setValue,
  control,
}) => {
  const countryCodeValue = useWatch({ control, name: 'countryCode' });
  
  const selectedCountry = useMemo(
    () => countryCodes.find((c) => c.code === countryCodeValue) || countryCodes[0],
    [countryCodeValue]
  );

  const handleCountryChange = useCallback((_event: React.SyntheticEvent, newValue: CountryCode | null) => {
    if (newValue) {
      setValue('countryCode', newValue.code);
    }
  }, [setValue]);

  return (
    <Stack direction="row" spacing={designTokens.spacing.itemGap} sx={{ mb: designTokens.spacing.sectionGap }}>
      <Autocomplete
        options={countryCodes}
        getOptionLabel={(option) => `${option.flag} ${option.code}`}
        value={selectedCountry}
        onChange={handleCountryChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Code"
            error={!!errors.countryCode}
            helperText={errors.countryCode?.message}
            sx={{ width: 140 }}
          />
        )}
        disableClearable
      />
      <TextField
        fullWidth
        label="Phone Number"
        {...register('phoneNumber')}
        error={!!errors.phoneNumber}
        helperText={errors.phoneNumber?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PhoneIcon color="disabled" />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
});

PhoneNumberInput.displayName = 'PhoneNumberInput';

