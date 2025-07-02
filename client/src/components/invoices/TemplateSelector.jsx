import React, { useState, useEffect } from 'react';
import { Grid, Box, Card, CardContent, Typography, Radio, Skeleton, Alert } from '@mui/material';
import { 
  FileText, 
  Sparkles, 
  Palette, 
  Minimize, 
  Star,
  CheckCircle,
  Eye,
  Layout,
  Zap
} from 'lucide-react';
import axios from 'axios';

const TemplateSelector = ({ selectedTemplate, onTemplateChange, sx = {} }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  const templateIcons = {
    invoiceTemplate: FileText,
    modernTemplate: Layout,
    creativeTemplate: Palette,
    minimalTemplate: Minimize
  };

  const templateColors = {
    invoiceTemplate: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#8b5cf6'
    },
    modernTemplate: {
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: '#3b82f6'
    },
    creativeTemplate: {
      primary: '#ff6b6b',
      secondary: '#4ecdc4',
      accent: '#45b7d1'
    },
    minimalTemplate: {
      primary: '#111827',
      secondary: '#374151',
      accent: '#6b7280'
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/invoices/templates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTemplates(response.data);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (templateId) => {
    onTemplateChange(templateId);
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: '12px', mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 4, ...sx }}>
      <div className={`transition-all duration-1000 delay-600 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-100/30 to-transparent rounded-full blur-xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Choose Template</h3>
                <p className="text-gray-600">Select a design for your invoice</p>
              </div>
            </div>

            {loading ? (
              <Grid container spacing={3}>
                {[1, 2, 3, 4].map((item) => (
                  <Grid item xs={12} sm={6} md={3} key={item}>
                    <Card sx={{ borderRadius: '16px', height: '100%' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: '12px', mb: 2 }} />
                        <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="100%" height={20} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={3}>
                {templates.map((template) => {
                  const IconComponent = templateIcons[template.id] || FileText;
                  const colors = templateColors[template.id];
                  const isSelected = selectedTemplate === template.id;

                  return (
                    <Grid item xs={12} sm={6} md={3} key={template.id}>
                      <Card
                        onClick={() => handleTemplateSelect(template.id)}
                        sx={{
                          borderRadius: '20px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          border: isSelected ? `3px solid ${colors.accent}` : '2px solid #f1f5f9',
                          transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                          boxShadow: isSelected 
                            ? `0 15px 35px rgba(0, 0, 0, 0.15), 0 0 0 1px ${colors.accent}40`
                            : '0 4px 15px rgba(0, 0, 0, 0.08)',
                          '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
                          },
                          position: 'relative',
                          overflow: 'hidden',
                          height: '100%'
                        }}
                      >
                        {/* Gradient overlay */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '6px',
                            background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
                          }}
                        />

                        {/* Selection indicator */}
                        {isSelected && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: colors.accent,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 2,
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            }}
                          >
                            <CheckCircle className="w-5 h-5 text-white" />
                          </Box>
                        )}

                        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                          {/* Icon and preview area */}
                          <Box
                            sx={{
                              height: 120,
                              borderRadius: '12px',
                              background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}10)`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mb: 2,
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                          >
                            {/* Background pattern */}
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: `radial-gradient(circle at 20% 50%, ${colors.accent}20 0%, transparent 50%), 
                                           radial-gradient(circle at 80% 20%, ${colors.primary}15 0%, transparent 50%)`,
                              }}
                            />
                            
                            <Box
                              sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '16px',
                                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                                position: 'relative',
                                zIndex: 1
                              }}
                            >
                              <IconComponent className="w-7 h-7 text-white" />
                            </Box>

                            {/* Floating elements */}
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 16,
                                left: 16,
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: colors.accent,
                                opacity: 0.6
                              }}
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 20,
                                right: 20,
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                background: colors.primary,
                                opacity: 0.4
                              }}
                            />
                          </Box>

                          {/* Template info */}
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color: '#1f2937',
                                mb: 1,
                                fontSize: '18px'
                              }}
                            >
                              {template.name}
                              {template.id === 'creativeTemplate' && (
                                <Star className="w-4 h-4 text-yellow-500 ml-1 inline" />
                              )}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#6b7280',
                                lineHeight: 1.5,
                                fontSize: '14px'
                              }}
                            >
                              {template.description}
                            </Typography>
                          </Box>

                          {/* Action buttons */}
                          <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Box
                              sx={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                                py: 1,
                                px: 2,
                                borderRadius: '8px',
                                background: isSelected ? colors.accent : '#f8fafc',
                                color: isSelected ? 'white' : '#6b7280',
                                fontSize: '12px',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {isSelected ? (
                                <>
                                  <CheckCircle className="w-3 h-3" />
                                  Selected
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3 h-3" />
                                  Select
                                </>
                              )}
                            </Box>

                            <Radio
                              checked={isSelected}
                              onChange={() => handleTemplateSelect(template.id)}
                              sx={{
                                color: colors.accent,
                                '&.Mui-checked': {
                                  color: colors.accent,
                                },
                                p: 0.5
                              }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}

            {/* Pro tip */}
            <Box
              sx={{
                mt: 4,
                p: 3,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                border: '1px solid #0ea5e9',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Zap className="w-5 h-5 text-blue-600" />
              <Typography variant="body2" sx={{ color: '#0c4a6e', fontWeight: 500 }}>
                <strong>Pro Tip:</strong> You can change the template anytime when viewing or editing your invoice.
              </Typography>
            </Box>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default TemplateSelector;