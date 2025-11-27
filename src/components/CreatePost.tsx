'use client';

import { useState, useRef } from 'react';
import { User, Post } from '@/types/post';

interface CreatePostProps {
  currentUser: User;
  onPostCreated: (post: Post) => void;
}

export default function CreatePost({ currentUser, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaType, setMediaType] = useState<'none' | 'image' | 'file' | 'poll'>('none');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);

    // Simular envío
    setTimeout(() => {
      const newPost: Post = {
        id: Date.now().toString(),
        user: currentUser,
        content: content.trim(),
        timestamp: 'Hace unos momentos',
        likes: 0,
        liked: false,
        comments: [],
        shares: 0,
        shared: false
      };

      // Agregar imagen si hay una seleccionada
      if (mediaType === 'image' && selectedImage) {
        newPost.media = {
          type: 'image',
          url: imagePreview || URL.createObjectURL(selectedImage),
          name: selectedImage.name
        };
      }

      // Agregar archivo si hay uno seleccionado
      if (mediaType === 'file' && selectedFile) {
        newPost.media = {
          type: 'file',
          url: URL.createObjectURL(selectedFile),
          name: selectedFile.name
        };
      }

      // Agregar encuesta si está configurada
      if (mediaType === 'poll' && pollQuestion.trim() && pollOptions.some(opt => opt.trim())) {
        newPost.poll = {
          question: pollQuestion.trim(),
          options: pollOptions
            .filter(opt => opt.trim())
            .map((opt, index) => ({
              id: (index + 1).toString(),
              text: opt.trim(),
              votes: 0
            })),
          voted: false
        };
      }

      onPostCreated(newPost);
      resetForm();
      setIsSubmitting(false);
    }, 1000);
  };

  const resetForm = () => {
    setContent('');
    setMediaType('none');
    setSelectedImage(null);
    setSelectedFile(null);
    setImagePreview(null);
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setSelectedFile(null);
      setMediaType('image');
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedImage(null);
      setImagePreview(null);
      setMediaType('file');
    }
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📕';
      case 'doc':
      case 'docx':
        return '📄';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📽️';
      case 'zip':
      case 'rar':
        return '📦';
      default:
        return '📎';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
          <span className="text-gray-600 font-semibold text-sm">
            {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Comparte una actualización, noticia o recurso con la comunidad..."
              className="w-full border border-gray-300 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            
            {/* Preview de imagen */}
            {imagePreview && (
              <div className="mt-4">
                <div className="relative inline-block">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-48 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                      setMediaType('none');
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Preview de archivo */}
            {selectedFile && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getFileIcon(selectedFile.name)}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setMediaType('none');
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Formulario de encuesta */}
            {mediaType === 'poll' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="Escribe tu pregunta..."
                  className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <div className="space-y-2">
                  {pollOptions.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updatePollOption(index, e.target.value)}
                        placeholder={`Opción ${index + 1}`}
                        className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removePollOption(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {pollOptions.length < 4 && (
                  <button
                    type="button"
                    onClick={addPollOption}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    + Agregar opción
                  </button>
                )}
              </div>
            )}

            {/* Opciones de medios */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setMediaType('none');
                    setSelectedImage(null);
                    setSelectedFile(null);
                    setImagePreview(null);
                    setPollQuestion('');
                    setPollOptions(['', '']);
                  }}
                  className={`flex items-center space-x-1 p-2 rounded-lg transition-colors ${
                    mediaType === 'none' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>📝</span>
                  <span className="text-sm">Solo texto</span>
                </button>

                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className={`flex items-center space-x-1 p-2 rounded-lg transition-colors ${
                    mediaType === 'image' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>🖼️</span>
                  <span className="text-sm">Imagen</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center space-x-1 p-2 rounded-lg transition-colors ${
                    mediaType === 'file' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>📎</span>
                  <span className="text-sm">Archivo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMediaType('poll');
                    setSelectedImage(null);
                    setSelectedFile(null);
                    setImagePreview(null);
                  }}
                  className={`flex items-center space-x-1 p-2 rounded-lg transition-colors ${
                    mediaType === 'poll' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>📊</span>
                  <span className="text-sm">Encuesta</span>
                </button>
              </div>
              
              <button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Publicando...' : 'Publicar'}
              </button>
            </div>

            {/* Inputs ocultos para archivos */}
            <input
              type="file"
              ref={imageInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageSelect}
            />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
              onChange={handleFileSelect}
            />
          </form>
        </div>
      </div>
    </div>
  );
}