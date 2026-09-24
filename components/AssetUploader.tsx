import React, { useState } from 'react';
import { requireSupabase } from '../supabaseClient';
import { Icon } from './Icon';

interface AssetUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: 'logos' | 'banners' | 'products' | 'gallery' | 'promotions';
  helpText?: string;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const AssetUploader: React.FC<AssetUploaderProps> = ({ label, value, onChange, folder, helpText, disabled = false }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Choose an image file (JPG, PNG, WebP, or GIF).');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Choose an image smaller than 5 MB.');
      return;
    }

    setError('');
    setIsUploading(true);
    try {
      const client = requireSupabase();
      const { data: authData, error: authError } = await client.auth.getUser();
      if (authError || !authData.user) throw new Error('Please sign in before uploading an image.');

      const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
      const path = `${authData.user.id}/${folder}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await client.storage.from('stall-assets').upload(path, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false,
      });
      if (uploadError) throw uploadError;

      const { data } = client.storage.from('stall-assets').getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'We could not upload that image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-brand-dark dark:text-slate-300">{label}</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Paste an image URL or upload a file"
          disabled={disabled || isUploading}
          className="min-w-0 flex-1 rounded-md border border-gray-300 bg-brand-light p-2 dark:border-slate-600 dark:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-gold disabled:cursor-not-allowed disabled:opacity-60"
        />
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-brand-blue px-3 py-2 text-sm font-semibold text-brand-blue transition-colors hover:bg-brand-blue/10 dark:border-brand-gold dark:text-brand-gold dark:hover:bg-brand-gold/10">
          <Icon name="upload" className="h-4 w-4" />
          {isUploading ? 'Uploading…' : 'Upload'}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={handleFileChange} disabled={disabled || isUploading} />
        </label>
      </div>
      {value && <img src={value} alt="Selected upload preview" className="h-20 w-20 rounded-md border border-gray-200 object-cover dark:border-slate-600" />}
      {helpText && <p className="text-xs text-brand-secondary dark:text-slate-400">{helpText}</p>}
      {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default AssetUploader;
