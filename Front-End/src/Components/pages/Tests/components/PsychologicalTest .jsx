import React, { useState } from "react";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Typography,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  useTheme,
  Grid,
  Stack,
} from "@mui/material";

export default function PsychologicalTest({ testData }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(
    Array(testData.questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [diagnosis, setDiagnosis] = useState("");
  const [criticalWarning, setCriticalWarning] = useState(false);
  const theme = useTheme();

  const handleAnswerChange = (value) => {
    const numericValue = parseInt(value, 10);
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = numericValue;
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestion < testData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    let totalScore = 0;

    answers.forEach((answer, index) => {
      if (answer !== null && answer !== undefined) {
        // دعم البنود ذات التقييم العكسي
        if (
          testData.scoring.reverseScoredItems &&
          testData.scoring.reverseScoredItems.includes(index)
        ) {
          totalScore += 3 - answer; // افتراض أن الدرجات من 0 إلى 3
        } else {
          totalScore += answer;
        }
      }
    });

    setScore(totalScore);

    // البحث عن النطاق المناسب للنتيجة
    const matchedRange = testData.scoring.ranges.find(
      (range) => totalScore >= range.min && totalScore <= range.max
    );

    if (matchedRange) {
      setDiagnosis(matchedRange.label);

      // التحقق من البنود الخطرية
      if (testData.scoring.criticalItems) {
        const criticalAnswers = testData.scoring.criticalItems.map(
          (index) => answers[index]
        );
        if (criticalAnswers.some((ans) => ans === 3)) {
          setCriticalWarning(true);
        }
      }
    } else {
      setDiagnosis("غير محدد");
    }

    setShowResults(true);
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers(Array(testData.questions.length).fill(null));
    setShowResults(false);
    setScore(0);
    setDiagnosis("");
    setCriticalWarning(false);
  };

  const progress = Math.round(
    ((currentQuestion + 1) / testData.questions.length) * 100
  );

  return (
    <Container maxWidth="lg" sx={{ py: 1 }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          background: "#f9f9fa",
        }}
      >
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            bgcolor: "#a0d9d5",
            "& .MuiLinearProgress-bar": {
              bgcolor: "#3c7168",
            },
          }}
        />
        <Box sx={{ p: 4 }}>
          {showResults ? (
            // عرض النتائج
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5" sx={{ mb: 2, fontFamily: "Dubai-Bold" }}>
                نتائج الاختبار
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  color: "#3c7168",
                  fontFamily: "Dubai-Bold",
                }}
              >
                التشخيص: {diagnosis}
              </Typography>
              {criticalWarning && (
                <Typography
                  color="error"
                  sx={{
                    mb: 2,
                    fontWeight: "bold",
                    fontFamily: "Dubai-Regular",
                  }}
                >
                  ⚠️ مؤشر خطر مرتفع! يُنصح بمراجعة أخصائي فوراً.
                </Typography>
              )}
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: theme.palette.text.secondary,
                  textAlign: "center",
                  fontFamily: "Dubai-Regular",
                }}
              >
                {testData.disclaimer}
              </Typography>
              <Button
                variant="contained"
                onClick={resetTest}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontFamily: "Dubai-Regular",
                  backgroundColor: "#3c7168",
                  "&:hover": {
                    backgroundColor: "#2a524c",
                  },
                }}
              >
                إعادة الاختبار
              </Button>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {/* العمود الأيمن: عنوان الاختبار والمؤشرات */}
              <Grid item xs={12} md={4}>
                <Stack spacing={3} sx={{ position: "sticky", top: 20 }}>
                  <Typography
                    variant="h4"
                    align="right"
                    gutterBottom
                    sx={{
                      fontFamily: "Dubai-Bold",
                      color: "#3c7168",
                    }}
                  >
                    {testData.name} ({testData.abbreviation})
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    align="right"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontFamily: "Dubai-Regular",
                    }}
                  >
                    {testData.description}
                  </Typography>
                  <Stepper
                    activeStep={currentQuestion}
                    orientation="vertical"
                    sx={{
                      maxHeight: 250,
                      overflow: "auto",
                      "& .MuiStepLabel-label": {
                        fontSize: "0.8rem",
                        textAlign: "right",
                        fontFamily: "Dubai-Regular",
                        mr: 2,
                      },
                      "& .MuiStepConnector-line": {
                        borderColor: "#3c7168",
                        float: "right",
                        mr: 3,
                      },
                      "& .MuiStepIcon-root": {
                        color: "#e0e0e0",
                        "&.Mui-completed": {
                          color: "#3c7168",
                        },
                        "&.Mui-active": {
                          color: "#3c7168",
                        },
                      },
                    }}
                  >
                    {testData.questions.map((question, index) => (
                      <Step key={index}>
                        <StepLabel
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              color: "#3c7168",
                            },
                          }}
                          onClick={() => setCurrentQuestion(index)}
                        >
                          {answers[index] !== null ? `✓ ${question}` : question}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Stack>
              </Grid>
              {/* العمود الأيسر: الأسئلة والإجابات */}
              <Grid item xs={12} md={8}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontFamily: "Dubai-Bold",
                    color: "#3c7168",
                    textAlign: "right",
                  }}
                >
                  {testData.questions[currentQuestion]}
                </Typography>
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={
                      answers[currentQuestion] !== null
                        ? answers[currentQuestion].toString()
                        : ""
                    }
                    onChange={(e) => handleAnswerChange(e.target.value)}
                  >
                    {testData.options[currentQuestion].map((option, index) => (
                      <Paper
                        key={index}
                        elevation={answers[currentQuestion] === index ? 3 : 0}
                        sx={{
                          mb: 1,
                          borderRadius: 2,
                          border:
                            answers[currentQuestion] === index
                              ? `2px solid #3c7168`
                              : `1px solid ${theme.palette.divider}`,
                          transition: "all 0.3s ease",
                          bgcolor: "#f9f9fa",
                        }}
                      >
                        <FormControlLabel
                          value={index.toString()}
                          control={<Radio sx={{ color: "#3c7168 !important" }} />}
                          label={
                            <Typography
                              variant="body1"
                              sx={{
                                textAlign: "right",
                                fontFamily: "Dubai-Regular",
                              }}
                            >
                              {option}
                            </Typography>
                          }
                          sx={{
                            p: 1.2,
                            width: "100%",
                            m: 0,
                            alignItems: "flex-start",
                          }}
                        />
                      </Paper>
                    ))}
                  </RadioGroup>
                </FormControl>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 4,
                    pt: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    disabled={currentQuestion === 0}
                    sx={{
                      px: 4,
                      fontFamily: "Dubai-Regular",
                      py: 1.5,
                      borderRadius: 2,
                      color: "#3c7168",
                      borderColor: "#3c7168",
                      "&:hover": {
                        borderColor: "#2a524c",
                        backgroundColor: "rgba(60, 113, 104, 0.04)",
                      },
                    }}
                  >
                    السابق
                  </Button>
                  <Button
                    variant="contained"
                    onClick={
                      currentQuestion === testData.questions.length - 1
                        ? calculateResults
                        : handleNext
                    }
                    disabled={answers[currentQuestion] === null}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontFamily: "Dubai-Regular",
                      backgroundColor: "#3c7168",
                      "&:hover": {
                        backgroundColor: "#2a524c",
                      },
                    }}
                  >
                    {currentQuestion === testData.questions.length - 1
                      ? "انتهاء الاختبار"
                      : "التالي"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
    </Container>
  );
}