import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Menu, 
  MenuItem, 
  Box, 
  Typography, 
  Divider,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import { 
  Download, 
  Palette, 
  FileText, 
  Layout, 
  Minimize, 
  ChevronDown,
  Sparkles,
  Eye
} from 'lucide-react';
import { generateInvoicePdf, getInvoiceTemplates } from '../../api/invoices';
import { toast } from 'react-toastify';

const TemplatePDFDownload = ({ invoiceId, invoiceNumber, currentTemplate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] = useState(null);

  const templateIcons = {
    invoiceTemplate: FileText,
    modernTemplate: Layout,
    creativeTemplate: Palette,
    minimalTemplate: Minimize
  };

  const templateColors = {
    invoiceTemplate: '#8b5cf6',
    modernTemplate: '#3b82f6',
    creativeTemplate: '#45b7d1',
    minimalTemplate: '#6b7280'
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const templatesData = await getInvoiceTemplates();
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const downloadPDF = async (templateId = null) => {
    setDownloadingTemplate(templateId || 'current');
    setLoading(true);
    
    try {
      const pdfBlob = await generateInvoicePdf(invoiceId, templateId);
      
      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceNumber}-${templateId || currentTemplate || 'default'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    } finally {
      setLoading(false);
      setDownloadingTemplate(null);
      handleClose();
    }
  };

  const isDownloading = (templateId) => {
    return downloadingTemplate === templateId || downloadingTemplate === 'current';
  };

  return (
    <Box>
      <Button
        variant="contained"
        onClick={handleClick}
        disabled={loading}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 600,
          borderRadius: '12px',
          textTransform: 'none',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
            transform: 'translateY(-2px)'
          },
          '&:disabled': {
            background: '#9ca3af',
            boxShadow: 'none'
          },
          transition: 'all 0.2s ease'
        }}
        startIcon={loading ? (
          <Box
            sx={{
              width: 16,
              height: 16,
              border: '2px solid #ffffff40',
              borderTop: '2px solid #ffffff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
        ) : <Download size={18} />}
        endIcon={!loading && <ChevronDown size={16} />}
      >
        {loading ? 'Generating...' : 'Download PDF'}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f1f5f9',
            minWidth: 280,
            mt: 1
          }
        }}
      >
        {/* Header */}
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #f1f5f9' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937', mb: 0.5 }}>
            Choose Template
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Select a design for your PDF
          </Typography>
        </Box>

        {/* Current Template Option */}
        <MenuItem 
          onClick={() => downloadPDF()}
          disabled={isDownloading('current')}
          sx={{ 
            px: 3, 
            py: 2,
            '&:hover': { backgroundColor: '#f8fafc' }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: `linear-gradient(135deg, ${templateColors[currentTemplate || 'invoiceTemplate']}, ${templateColors[currentTemplate || 'invoiceTemplate']}CC)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <Eye size={16} />
            </Box>
          </ListItemIcon>
          <ListItemText 
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                  Current Template
                </Typography>
                <Chip 
                  label="Applied" 
                  size="small" 
                  sx={{ 
                    height: 20, 
                    fontSize: '11px',
                    backgroundColor: '#dbeafe', 
                    color: '#1e40af',
                    fontWeight: 600
                  }} 
                />
              </Box>
            }
            secondary={
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                Use the selected template design
              </Typography>
            }
          />
          {isDownloading('current') && (
            <Box
              sx={{
                width: 16,
                height: 16,
                border: '2px solid #e5e7eb',
                borderTop: '2px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                ml: 1
              }}
            />
          )}
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        {/* Template Options */}
        {templates.map((template) => {
          const IconComponent = templateIcons[template.id] || FileText;
          const isCurrentTemplate = template.id === currentTemplate;
          
          return (
            <MenuItem 
              key={template.id}
              onClick={() => downloadPDF(template.id)}
              disabled={isDownloading(template.id)}
              sx={{ 
                px: 3, 
                py: 2,
                '&:hover': { backgroundColor: '#f8fafc' },
                opacity: isCurrentTemplate ? 0.7 : 1
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, ${templateColors[template.id]}, ${templateColors[template.id]}CC)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                >
                  <IconComponent size={16} />
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600, 
                        color: isCurrentTemplate ? '#6b7280' : '#1f2937' 
                      }}
                    >
                      {template.name}
                    </Typography>
                    {isCurrentTemplate && (
                      <Chip 
                        label="Current" 
                        size="small" 
                        sx={{ 
                          height: 20, 
                          fontSize: '11px',
                          backgroundColor: '#f3f4f6', 
                          color: '#6b7280',
                          fontWeight: 600
                        }} 
                      />
                    )}
                    {template.id === 'creativeTemplate' && (
                      <Sparkles size={14} style={{ color: '#fbbf24' }} />
                    )}
                  </Box>
                }
                secondary={
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: isCurrentTemplate ? '#9ca3af' : '#6b7280' 
                    }}
                  >
                    {template.description}
                  </Typography>
                }
              />
              {isDownloading(template.id) && (
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    border: '2px solid #e5e7eb',
                    borderTop: '2px solid #3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    ml: 1
                  }}
                />
              )}
            </MenuItem>
          );
        })}

        {/* Footer */}
        <Box sx={{ px: 3, py: 2, borderTop: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
          <Typography variant="caption" sx={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Sparkles size={12} />
            Professional templates with beautiful designs
          </Typography>
        </Box>
      </Menu>

      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};

export default TemplatePDFDownload;