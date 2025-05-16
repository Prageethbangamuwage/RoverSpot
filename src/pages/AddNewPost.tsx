import React, { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image, MapPin, Bold, Italic, List, X } from 'lucide-react';

interface FormData {
  title: string;
  content: string;
  location: string;
  image: File | null;
}

const AddNewPost = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    location: '',
    image: null
  });
  
  const [imagePreview, setImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      const words = editor.getText().trim().split(/\s+/).length;
      setWordCount(words);
      setFormData(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.match('image.*')) {
        setFormData(prev => ({ ...prev, image: file }));
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);
        setErrors(prev => ({ ...prev, image: undefined }));
      } else {
        setErrors(prev => ({ ...prev, image: 'Please upload an image file' }));
      }
    }
  };

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.match('image.*')) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, image: undefined }));
    } else {
      setErrors(prev => ({ ...prev, image: 'Please upload an image file' }));
    }
  }, []);

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview('');
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.image) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        // Mock successful submission
        console.log('Form submitted:', formData);
        navigate(`/blog/category/${category}`);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Blog Post</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-4">
                Blog Cover Image
              </label>
              
              {!imagePreview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors duration-300"
                >
                  <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      Drag and drop your image here, or
                    </p>
                    <label className="inline-block">
                      <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors duration-300">
                        Browse Files
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors duration-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
              {errors.image && (
                <p className="mt-2 text-sm text-red-600">{errors.image}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
                Blog Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter a catchy title for your blog"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Content
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${
                      editor?.isActive('bold') ? 'bg-gray-200' : ''
                    }`}
                  >
                    <Bold className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${
                      editor?.isActive('italic') ? 'bg-gray-200' : ''
                    }`}
                  >
                    <Italic className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${
                      editor?.isActive('bulletList') ? 'bg-gray-200' : ''
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                  <div className="ml-auto text-sm text-gray-500">
                    {wordCount} words
                  </div>
                </div>
                <EditorContent
                  editor={editor}
                  className="prose max-w-none p-4 min-h-[200px]"
                />
              </div>
              {errors.content && (
                <p className="mt-2 text-sm text-red-600">{errors.content}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-lg font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter or select the location related to your blog"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.location && (
                <p className="mt-2 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-300"
              >
                Post Blog
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewPost;