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

  // In this form we only collect these fields:
  const [formData, setFormData] = useState({
    embed_link: '',
    source_link: '',
    download_link: '',
  });

  // File(s) state:
  const [file, setFile] = useState<File | null>(null); // For "report"
  const [files, setFiles] = useState<File[]>([]); // For "files" array

  const [errors, setErrors] = useState({
    source_link: '',
    embed_link: '',
    download_link: '',
    file: '',
  });

  const [isUploading, setIsUploading] = useState(false);

  const hideDialog = () => {
    setErrors({
      source_link: '',
      embed_link: '',
      download_link: '',
      file: '',
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Validate that every file is a .zip file.
    const invalidFiles = selectedFiles.filter(
      (f) => !f.name.toLowerCase().endsWith('.zip')
    );
    if (invalidFiles.length > 0) {
      setErrors((prev) => ({ ...prev, file: 'Please upload only .zip files' }));
      return;
    }

    // Validate that each file is less than 100MB.
    const maxSize = 100 * 1024 * 1024;
    const oversizedFiles = selectedFiles.filter((f) => f.size > maxSize);
    if (oversizedFiles.length > 0) {
      setErrors((prev) => ({ ...prev, file: 'Files must be less than 100MB' }));
      return;
    }

    // We use the same file for both the report and the files array.
    setFiles(selectedFiles);
    setFile(selectedFiles.length > 0 ? selectedFiles[0] : null);
    setErrors((prev) => ({ ...prev, file: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const formDataToSend = new FormData();

      // Append only non-empty text fields.
      if (formData.embed_link) {
        formDataToSend.append('embed_link', formData.embed_link);
      }
      if (formData.source_link) {
        formDataToSend.append('source_link', formData.source_link);
      }
      if (formData.download_link) {
        formDataToSend.append('download_link', formData.download_link);
      }

      // Append a required static field.
      formDataToSend.append('type', 'Moment');

      // For the file fields:
      // Append the "files" field only if there is at least one file.
      if (files.length > 0) {
        // The expected structure is an array of objects with key "file".
        // We can mimic that by using a key like: files[0][file]
        files.forEach((f, index) => {
          formDataToSend.append(`files[${index}][file]`, f);
        });
      }

      // Append the "report" field if a file is selected.
      if (file) {
        formDataToSend.append('report', file);
      }

      // (Optional) Uncomment to log FormData entries for debugging.
      // for (const pair of formDataToSend.entries()) {
      //   console.log(pair[0], pair[1]);
      // }

      await CreateMedia(id, formDataToSend);

      toast.success('Media created successfully!');
      hideDialog();

      // Reset the form state.
      setFormData({
        embed_link: '',
        source_link: '',
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
