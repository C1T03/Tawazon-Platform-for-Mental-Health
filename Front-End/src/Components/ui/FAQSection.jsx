import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { 
  Box,
  Typography,
  IconButton,
  Collapse
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const QuestionContainer = styled(Box)({
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '8px',
  backgroundColor: '#f9f9f9',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
});

const QuestionHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const QuestionText = styled(Typography)({
  fontSize: '1.1rem',
  fontFamily: 'Dubai-Bold'
});

const AnswerText = styled(Typography)({
  paddingTop: '16px',
  color: '#555',
  fontFamily: 'Dubai-Regular'

});

const ExpandIcon = styled(ExpandMoreIcon)(({ expanded }) => ({
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 0.3s ease',
}));

const QuestionItem = ({ question, answer }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <QuestionContainer onClick={toggleExpand}>
      <QuestionHeader>
        <QuestionText>{question}</QuestionText>
        <IconButton 
          size="small" 
          aria-label={expanded ? 'Hide answer' : 'Show answer'}
          sx={{ padding: 0 }}
        >
          <ExpandIcon expanded={expanded} />
        </IconButton>
      </QuestionHeader>
      
      <Collapse in={expanded}>
        <AnswerText>{answer}</AnswerText>
      </Collapse>
    </QuestionContainer>
  );
};

// مثال على استخدام المكون
const FAQSection = ({question, answer}) => {

  return (     
        <QuestionItem 
          question={question}
          answer={answer}
        />
  );
};

export default FAQSection;