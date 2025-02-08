'use client';
import { Input } from '@/components/ui/input';
import { CreateMedia } from '@/services/api';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import axios from 'axios';

const Moments = () => {
  const router = useRouter();
  const id = Number(router.query.id);
  const [files, setFiles] = useState<File[]>([]);

  const hideDialog = () => {
    setErrors({
      source_link: '',
      embed_link: '',
      download_link: '',
      file: '',
    });
  };

  const [errors, setErrors] = useState({
    source_link: '',
    embed_link: '',
    download_link: '',
    file: '',
  });

  const [formData, setFormData] = useState({
    source_link: '',
    embed_link: '',
    download_link: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

 const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
   const selectedFiles = Array.from(e.target.files || []);

   // Validate files if needed
   const invalidFiles = selectedFiles.filter(
     (file) => !file.name.toLowerCase().endsWith('.zip')
   );
   if (invalidFiles.length > 0) {
     setErrors((prev) => ({ ...prev, file: 'Please upload only .zip files' }));
     return;
   }

   // Check size for each file
   const maxSize = 100 * 1024 * 1024; // 100MB
   const oversizedFiles = selectedFiles.filter((file) => file.size > maxSize);
   if (oversizedFiles.length > 0) {
     setErrors((prev) => ({ ...prev, file: 'Files must be less than 100MB' }));
     return;
   }

   setFiles(selectedFiles);
   setErrors((prev) => ({ ...prev, file: '' }));
 };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   console.log('Form submitted successfully!?????????????');
  //   setIsUploading(true);

  //   const newErrors = {
  //     source_link: '',
  //     embed_link: '',
  //     download_link: '',
  //     file: '',
  //   };

  //   if (!formData.embed_link) {
  //     newErrors.embed_link = 'Please enter a valid embed link.';
  //   }
  //   if (!formData.source_link) {
  //     newErrors.source_link = 'Please enter a valid source link.';
  //   }
  //   if (!formData.download_link) {
  //     newErrors.download_link = 'Please enter a valid download link.';
  //   }
  //   if (!file) {
  //     newErrors.file = 'Please upload a .zip file.';
  //   }

  //   setErrors(newErrors);

  //   const hasErrors = Object.values(newErrors).some((error) => error !== '');
  //   if (hasErrors) {
  //     setIsUploading(false);
  //     return;
  //   }

  //   console.log('Form data before submission:', formData);

  //   try {
  //     const formDataToSend = new FormData();
  //     formDataToSend.append('embed_link', formData.embed_link);
  //     formDataToSend.append('source_link', formData.source_link);
  //     formDataToSend.append('download_link', formData.download_link);
  //     formDataToSend.append('type', 'Moment');

  //     if (file) {
  //       formDataToSend.append('report', file);
  //     }

  //     for (const [key, value] of formDataToSend.entries()) {
  //       console.log(`Key: ${key}, Value:`, value);
  //     }

  //     if (formDataToSend.get('report')) {
  //       console.log('File is appended to FormData');
  //     } else {
  //       console.log('File is NOT appended to FormData');
  //     }

  //     await CreateMedia(id, formDataToSend);

  //     console.log('Form submitted successfully!');
  //     hideDialog();

  //     setFormData({
  //       source_link: '',
  //       embed_link: '',
  //       download_link: '',
  //     });
  //     setFile(null);
  //   } catch (err) {
  //     console.error('Error submitting form:', err);
  //     setErrors((prev) => ({
  //       ...prev,
  //       file: 'Error uploading file. Please try again.',
  //     }));
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsUploading(true);

  try {
    const formDataToSend = new FormData();

    // Add basic fields
    formDataToSend.append('embed_link', formData.embed_link);
    formDataToSend.append('source_link', formData.source_link);
    formDataToSend.append('download_link', formData.download_link);
    formDataToSend.append('type', 'Moment');

    // Handle multiple files
    if (files.length > 0) {
      files.forEach((file, index) => {
        formDataToSend.append(`files[${index}][file]`, file);
      });
    } else {
      formDataToSend.append('files', JSON.stringify([]));
    }

    // Handle report file if needed
    if (file) {
      formDataToSend.append('report', file);
    }

    await CreateMedia(id, formDataToSend);

    toast.success('Media created successfully!');
    hideDialog();
    setFormData({
      source_link: '',
      embed_link: '',
      download_link: '',
    });
    setFiles([]);
    setFile(null);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage =
        err.response?.data?.[0] ||
        err.response?.data?.message ||
        'Failed to create media';
      toast.error(errorMessage);
    } else {
      toast.error('An unexpected error occurred');
    }
  } finally {
    setIsUploading(false);
  }
};



  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="px-[20px] mt-[20px]">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="space-y-4">
          <div>
            <Input
              type="text"
              name="embed_link"
              placeholder="Add embed link"
              value={formData.embed_link}
              onChange={handleInputChange}
            />
            {errors.embed_link && (
              <p className="text-red-500 text-xs">{errors.embed_link}</p>
            )}
          </div>
          <div>
            <Input
              type="text"
              name="source_link"
              placeholder="Add source link"
              value={formData.source_link}
              onChange={handleInputChange}
            />
            {errors.source_link && (
              <p className="text-red-500 text-xs">{errors.source_link}</p>
            )}
          </div>
          <div>
            <Input
              type="text"
              name="download_link"
              placeholder="Add download link"
              value={formData.download_link}
              onChange={handleInputChange}
            />
            {errors.download_link && (
              <p className="text-red-500 text-xs">{errors.download_link}</p>
            )}
          </div>

          <div className="flex flex-col items-center justify-center h-[100px] border border-dotted bg-gray-200">
            <label
              htmlFor="file-upload"
              className="cursor-pointer font-medium text-[16px] text-center text-[#000000] hover:underline"
            >
              {file ? file.name : '+ Add radio monitor report (.zip)'}
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".zip"
              className="hidden"
              onChange={handleFileUpload}
            />
            {errors.file && (
              <p className="text-red-500 text-xs mt-2">{errors.file}</p>
            )}
          </div>

          <div className="mt-[20px] flex items-center space-x-2">
            <button
              type="submit"
              disabled={isUploading}
              className="font-IBM text-[14px] text-white hover:text-[#ffffff] bg-[#000000] border border-[#000000] hover:bg-orange-500 hover:border-none py-[8px] px-[20px] rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Save'}
            </button>
            <button className="font-IBM text-[14px] text-white hover:text-[#ffffff] bg-[#1f9abd] hover:bg-gray-200 hover:border-none py-[8px] px-[20px] rounded">
              Watch demo
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Moments;
