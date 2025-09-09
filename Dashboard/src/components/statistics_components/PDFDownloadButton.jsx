import React, { useState } from 'react';
import { 
  Fab, 
  Tooltip, 
  CircularProgress, 
  Snackbar, 
  Alert,
  Box 
} from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import StatisticsPDF from './StatisticsPDF';

const PDFDownloadButton = ({ statistics, doctorStatistics, patientStatistics }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleDownloadStart = () => {
    setIsGenerating(true);
    setSnackbar({
      open: true,
      message: 'Generating PDF...',
      severity: 'info'
    });
  };

  const handleDownloadComplete = () => {
    setIsGenerating(false);
    setSnackbar({
      open: true,
      message: 'Report downloaded successfully!',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // التحقق من وجود البيانات
  const hasData = statistics || doctorStatistics || patientStatistics;

  if (!hasData) {
    return null;
  }

  const fileName = `Balance_Statistics_Report_${new Date().toISOString().split('T')[0]}.pdf`;

  return (
    <Box>
      <PDFDownloadLink
        document={
          <StatisticsPDF 
            statistics={statistics}
            doctorStatistics={doctorStatistics}
            patientStatistics={patientStatistics}
          />
        }
        fileName={fileName}
        style={{ textDecoration: 'none' }}
      >
        {({ blob, url, loading, error }) => {
          const handleClick = () => {
            if (!loading && url) {
              handleDownloadStart();
              // إنشاء رابط تحميل وتفعيله
              const link = document.createElement('a');
              link.href = url;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              setTimeout(handleDownloadComplete, 500);
            }
          };

          return (
            <Tooltip 
              title={loading ? "Generating PDF..." : "Download Statistics Report PDF"} 
              placement="left"
            >
              <span>
                <Fab
                color="primary"
                aria-label="Download PDF"
                sx={{
                  position: 'fixed',
                  bottom: 24,
                  left: 24,
                  zIndex: 1000,
                  background: 'linear-gradient(45deg, #4faa84 30%, #7ce6baff 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #227552ff 30%, #9affd5ff 90%)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
                }}
                disabled={loading || isGenerating}
                onClick={handleClick}
              >
                {loading || isGenerating ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <PictureAsPdf />
                )}
                </Fab>
              </span>
            </Tooltip>
          );
        }}
      </PDFDownloadLink>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PDFDownloadButton;