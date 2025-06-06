'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { FiX, FiArrowRight, FiArrowLeft, FiCheck, FiSliders as FiRuler, FiUser, FiTrendingUp, FiHeart, FiInfo } from 'react-icons/fi';
import Image from 'next/image';

// Constants
const AI_SIZE_LOGIC = {
  baseSizes: ['SLIM', 'REGULAR', 'ATHLETIC', 'BIG'],
  fitProfiles: ['TAILORED', 'CLASSIC', 'RELAXED'],
  materialStretch: ['RIGID', 'MODERATE', 'STRETCH'],
};

// Size chart based on the provided photo
const sizeChart = {
  XS: { sizeNumber: 38, chest: 39, waist: 39, shoulder: 17, fullLength: 24, sleeve: 7.5, shirtLength: 27 },
  S: { sizeNumber: 39, chest: 41, waist: 41, shoulder: 17.5, fullLength: 25, sleeve: 7.5, shirtLength: 28 },
  M: { sizeNumber: 40, chest: 44, waist: 44, shoulder: 18.5, fullLength: 25.5, sleeve: 8, shirtLength: 29.5 },
  L: { sizeNumber: 42, chest: 47, waist: 47, shoulder: 19.5, fullLength: 26, sleeve: 9, shirtLength: 30.5 },
  XL: { sizeNumber: 44, chest: 51, waist: 51, shoulder: 20.5, fullLength: 27, sleeve: 9.5, shirtLength: 31.5 },
  "2XL": { sizeNumber: 46, chest: 55, waist: 55, shoulder: 21.5, fullLength: 27.25, sleeve: 10, shirtLength: 32 },
  "3XL": { sizeNumber: 48, chest: 58, waist: 58, shoulder: 21.5, fullLength: 27.5, sleeve: 10.5, shirtLength: 32 }
};

// Mock AI Logic for Male Formalwear
const getBaseSize = (height, weight, lowerBody) => {
  if (!height || !weight) return 'REGULAR';
  
  const heightCm = parseFloat(height);
  const weightKg = parseFloat(weight);
  
  const bmi = weightKg / ((heightCm / 100) ** 2);
  
  // Adjusted calculations for male formalwear
  if (bmi < 20) return 'SLIM';
  if (bmi >= 25) {
    return lowerBody === 'CURVIER' ? 'BIG' : 'ATHLETIC';
  }
  return 'REGULAR';
};

const getStretchPreference = (fitPreference) => {
  const preferences = {
    'very tight': 'STRETCH',
    'regular': 'MODERATE',
    'very loose': 'RIGID'
  };
  return preferences[fitPreference] || 'MODERATE';
};

const getTailoringNotes = (bodyShape) => {
  const notes = {
    'SLIM': 'Consider slim-fit cuts for a modern silhouette. XS-S sizes will work best for your frame.',
    'REGULAR': 'Classic fits will provide the most versatile look. M-L sizes typically fit your body type well.',
    'WIDE': 'Look for structured shoulders and tapered legs to balance proportions. XL-2XL sizes with structured cuts are recommended.'
  };
  return notes[bodyShape] || 'Standard fit recommendations apply.';
};

const calculateFinalSize = (sizeProfile) => {
  const { baseSize, fitProfile, stretchFactor } = sizeProfile;
  
  // Updated size matrix based on the provided size chart
  const sizeMatrix = {
    SLIM: {
      'very tight': stretchFactor === 'STRETCH' ? 'XS' : 'S',
      'regular': 'S',
      'very loose': 'M'
    },
    REGULAR: {
      'very tight': stretchFactor === 'STRETCH' ? 'S' : 'M',
      'regular': 'M',
      'very loose': 'L'
    },
    ATHLETIC: {
      'very tight': stretchFactor === 'STRETCH' ? 'M' : 'L',
      'regular': 'L',
      'very loose': 'XL'
    },
    BIG: {
      'very tight': stretchFactor === 'STRETCH' ? 'XL' : '2XL',
      'regular': '2XL',
      'very loose': '3XL'
    }
  };
  
  return sizeMatrix[baseSize]?.[fitProfile] || 'M';
};

const suggestAlternates = (sizeProfile) => {
  const mainSize = calculateFinalSize(sizeProfile);
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
  const mainIndex = sizeOrder.indexOf(mainSize);
  
  if (mainIndex === -1) return ['S', 'M'];
  
  return [
    sizeOrder[Math.max(0, mainIndex - 1)],
    sizeOrder[Math.min(sizeOrder.length - 1, mainIndex + 1)]
  ].filter(size => size !== mainSize);
};

const generateStylingTips = (bodyShape, fitPreference) => {
  const tips = [];
  
  // Body shape tips
  if (bodyShape === 'SLIM') {
    tips.push('The XS-S sizes in our collection will provide the best fit for your slim frame.');
    tips.push('Slim-cut suits with narrow lapels will complement your frame.');
  }
  if (bodyShape === 'REGULAR') {
    tips.push('Our M-L sizes offer the perfect balance of comfort and structure for your build.');
    tips.push('Classic fit suits with medium-width lapels offer timeless elegance.');
  }
  if (bodyShape === 'WIDE') {
    tips.push('Look for XL-2XL sizes with structured shoulders for optimal fit.');
    tips.push('Structured shoulders with a slightly tapered leg create balance.');
  }
  
  // Fit preference tips
  if (fitPreference === 'very tight') {
    tips.push('Consider sizing down for a more fitted look, especially with stretch fabrics.');
    tips.push('Look for "super slim" or "extra fitted" cuts in our collection.');
  }
  if (fitPreference === 'regular') {
    tips.push('Our standard sizes provide a classic fit that works for most occasions.');
    tips.push('Our "modern fit" line offers the perfect balance of comfort and style.');
  }
  if (fitPreference === 'very loose') {
    tips.push('You may want to size up for a more relaxed fit, especially in rigid fabrics.');
    tips.push('Consider our "relaxed fit" collection for maximum comfort.');
  }
  
  return tips.length > 0 ? tips : ['Refer to our detailed size chart for precise measurements.'];
};

// Questions array remains exactly the same as in the original code
const questions = [
  {
    id: 'biometrics',
    title: 'Body Measurements',
    description: 'Provide your basic measurements for accurate sizing.',
    icon: <FiRuler className="text-2xl" />,
    fields: [
      {
        id: 'height',
        label: 'Height (cm)',
        type: 'number',
        placeholder: '180',
        min: 150,
        max: 220,
        precision: 1,
        required: true
      },
      {
        id: 'weight',
        label: 'Weight (kg)',
        type: 'number',
        placeholder: '80',
        min: 40,
        max: 150,
        precision: 1,
        required: true
      },
    ],
    visual: {
      type: 'illustration',
      asset: '/size.jpg',
      alt: 'Male Measurement Guide'
    }
  },
  {
    id: 'lowerBody',
    title: 'Lower Body Proportion',
    description: 'How would you describe your lower body build?',
    icon: <FiUser className="text-2xl" />,
    options: [
      {
        value: 'SLIMMER',
        label: 'Slimmer',
        icon: '👖',
        description: 'Narrow hips and thighs',
        tooltip: 'Best for slim-fit trousers'
      },
      {
        value: 'REGULAR',
        label: 'Regular',
        icon: '🕴️',
        description: 'Balanced proportions',
        tooltip: 'Standard fit works well'
      },
      {
        value: 'CURVIER',
        label: 'Curvier',
        icon: '🏋️',
        description: 'Fuller thighs/seat',
        tooltip: 'Consider relaxed fit options'
      }
    ],
    visual: {
      type: 'illustration',
      asset: '/lower.png',
      alt: 'Lower Body Proportions'
    }
  },
  {
    id: 'bodyShape',
    title: 'Body Shape',
    description: 'How would you describe your overall build?',
    icon: <FiUser className="text-2xl" />,
    options: [
      {
        value: 'SLIM',
        label: 'Slim',
        icon: '📏',
        description: 'Narrow shoulders and waist',
        tooltip: 'Slim-fit styles recommended'
      },
      {
        value: 'REGULAR',
        label: 'Regular',
        icon: '👔',
        description: 'Balanced shoulders and waist',
        tooltip: 'Classic fit works best'
      },
      {
        value: 'WIDE',
        label: 'Wide',
        icon: '🏈',
        description: 'Broad shoulders, fuller midsection',
        tooltip: 'Look for structured fits'
      }
    ],
    visual: {
      type: 'illustration',
      asset: '/body.png',
      alt: 'Male Body Shapes'
    }
  },
  {
    id: 'returnExperience',
    title: 'Return Experience',
    description: 'Have you returned smaller sizes more often?',
    icon: <FiTrendingUp className="text-2xl" />,
    options: [
      {
        value: 'YES',
        label: 'Yes',
        icon: '🔙',
        description: 'I often size up',
        tooltip: 'We\'ll recommend slightly larger'
      },
      {
        value: 'NO',
        label: 'No',
        icon: '✅',
        description: 'My size is usually correct',
        tooltip: 'Standard recommendations'
      },
      {
        value: 'NOT_SURE',
        label: 'Not Sure',
        icon: '❓',
        description: 'I don\'t return often',
        tooltip: 'We\'ll use standard calculations'
      }
    ],
    visual: {
      type: 'illustration',
      asset: '/man.png',
      alt: 'Sizing Experience'
    }
  },
  {
    id: 'fitPreference',
    title: 'Fit Preference',
    description: 'How do you prefer your formalwear to fit?',
    icon: <FiTrendingUp className="text-2xl" />,
    options: [
      {
        value: 'very tight',
        label: 'Very Fitted',
        icon: '👌',
        description: 'Close to body',
        tooltip: 'Tailored, slim silhouette'
      },
      {
        value: 'regular',
        label: 'Classic Fit',
        icon: '🕴️',
        description: 'Standard drape',
        tooltip: 'Traditional formalwear fit'
      },
      {
        value: 'very loose',
        label: 'Relaxed',
        icon: '👔',
        description: 'More room',
        tooltip: 'Comfort-focused fit'
      }
    ],
    visual: {
      type: 'illustration',
      asset: '/fit.png',
      alt: 'Fit Preference Guide'
    }
  }
];

export const FindYourFitModal = ({ 
  isOpen, 
  onClose, 
  onRecommend = () => {}, // Default empty function
  defaultValues = {},
  productCategory = 'clothing' // Can be 'clothing', 'shoes', 'accessories'
}) => {
  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(defaultValues);
  const [recommendation, setRecommendation] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Derived state
  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;
  const progressPercentage = ((currentStep + 1) / questions.length) * 100;

  // Refs & Animations
  const modalRef = useRef();
  const controls = useAnimation();
  const progressControls = useAnimation();
  const formRef = useRef();

  // Effects - Fixed infinite loop
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      controls.start('visible');
      progressControls.start({ width: `${progressPercentage}%` });
    } else {
      document.body.style.overflow = '';
      // Reset state when modal closes
      if (!showResults) {
        setCurrentStep(0);
        setAnswers(defaultValues);
        setRecommendation(null);
      }
      setShowResults(false);
      setIsCalculating(false);
      setValidationErrors({});
    }
  }, [isOpen, showResults]);

  // Validate current step
  const validateCurrentStep = useCallback(() => {
    if (!currentQuestion) return true;
    
    const errors = {};
    
    if (currentQuestion.fields) {
      currentQuestion.fields.forEach(field => {
        if (field.required) {
          const value = answers[currentQuestion.id]?.[field.id];
          if (!value && value !== 0) {
            errors[field.id] = 'This field is required';
          } else if (field.type === 'number' && (isNaN(parseFloat(value)) || 
                    (field.min && parseFloat(value) < field.min) || 
                    (field.max && parseFloat(value) > field.max)) ){
            errors[field.id] = `Please enter a value between ${field.min} and ${field.max}`;
          } else if (field.type === 'text' && field.pattern && !new RegExp(field.pattern).test(value)) {
            errors[field.id] = field.hint || 'Invalid format';
          }
        }
      });
    } else if (currentQuestion.options && !answers[currentQuestion.id]) {
      errors.general = 'Please select an option';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [currentQuestion, answers]);

  // Handlers
  const handleAnswer = (questionId, value) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [questionId]: value };
      
      if (validationErrors[questionId]) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[questionId];
          return newErrors;
        });
      }
      
      return newAnswers;
    });
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (isLastStep) {
      await calculateRecommendation();
    } else {
      await controls.start('exit');
      setCurrentStep(prev => prev + 1);
      controls.start('visible');
    }
  };

  const handlePrevious = async () => {
    if (currentStep > 0) {
      await controls.start('exit');
      setCurrentStep(prev => prev - 1);
      controls.start('visible');
    }
  };

  const calculateRecommendation = useCallback(async () => {
    setIsCalculating(true);
    setValidationErrors({});

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const { biometrics, lowerBody, bodyShape, returnExperience, fitPreference } = answers;
      const height = parseFloat(biometrics?.height);
      const weight = parseFloat(biometrics?.weight);

      // Adjust size based on return experience
      const sizeAdjustment = returnExperience === 'YES' ? 1 : 0;

      // Multi-dimensional size mapping for formalwear
      const sizeProfile = {
        baseSize: getBaseSize(height, weight, lowerBody),
        fitProfile: fitPreference,
        stretchFactor: getStretchPreference(fitPreference),
        tailoringNotes: getTailoringNotes(bodyShape),
        sizeAdjustment,
        productCategory: 'formalwear'
      };

      const confidenceScore = Math.min(98, Math.floor(80 + Math.random() * 20));

      setRecommendation({
        size: calculateFinalSize(sizeProfile),
        confidence: `${confidenceScore}%`,
        alternateSizes: suggestAlternates(sizeProfile),
        stylingTips: generateStylingTips(bodyShape, fitPreference),
        tailoringNotes: sizeProfile.tailoringNotes,
        sizeProfile
      });

      setIsCalculating(false);
      setShowResults(true);
    } catch (error) {
      console.error('Error calculating recommendation:', error);
      setIsCalculating(false);
      setValidationErrors({ general: 'Could not calculate size. Please check your inputs.' });
    }
  }, [answers]);

  // Animations
  const modalVariants = {
    hidden: { opacity: 0, y: 50, rotate: -2 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
        delay: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: 50,
      rotate: 2,
      transition: {
        ease: 'easeIn',
        duration: 0.3
      }
    }
  };

  const questionVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        ease: 'easeIn',
        duration: 0.2
      }
    }
  };

  const resultVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const resultItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "backOut"
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-gray-900/70 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Main Modal */}
        <motion.div
          ref={modalRef}
          className="relative bg-white text-gray-900 rounded-2xl shadow-2xl p-0 w-full max-w-5xl max-h-[90vh] overflow-hidden border border-gray-200"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          layout
        >
          {/* Header */}
          <div className="bg-white p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-light tracking-widest text-gray-800">
                <FiHeart className="inline mr-2 text-gray-700" />
                PERFECT FIT FINDER™
              </h2>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-all"
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX className="w-6 h-6 text-gray-600" />
              </motion.button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gray-700 rounded-full"
                initial={{ width: '0%' }}
                animate={progressControls}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-[70vh] p-8" ref={formRef}>
            {!showResults ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  variants={questionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  {/* Visual Panel */}
                  <div className="relative rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center min-h-[300px]">
  {currentQuestion.visual.type === 'illustration' && (
    <Image
      src={currentQuestion.visual.asset}
      alt={currentQuestion.visual.alt}
      width={400}
      height={300}
      className="object-contain"
    />
  )}
</div>
                  {/* Form Panel */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      {currentQuestion.icon}
                      <div>
                        <h3 className="text-2xl font-light tracking-wide text-gray-800">{currentQuestion.title}</h3>
                        <p className="text-gray-600 text-sm">{currentQuestion.description}</p>
                      </div>
                    </div>

                    {validationErrors.general && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm"
                      >
                        {validationErrors.general}
                      </motion.div>
                    )}

                    {currentQuestion.fields && (
                      <div className="space-y-5">
                        {currentQuestion.fields.map((field) => (
                          <motion.div
                            key={field.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * currentQuestion.fields.indexOf(field) }}
                          >
                            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <input
                              id={field.id}
                              type={field.type}
                              value={answers[currentQuestion.id]?.[field.id] || ''}
                              onChange={(e) => handleAnswer(
                                currentQuestion.id, 
                                { 
                                  ...answers[currentQuestion.id], 
                                  [field.id]: e.target.value 
                                }
                              )}
                              className={`w-full px-4 py-3 border ${
                                validationErrors[field.id] ? 'border-red-300' : 'border-gray-300'
                              } rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all`}
                              placeholder={field.placeholder}
                              min={field.min}
                              max={field.max}
                              step={field.precision ? 0.1 : 1}
                              required={field.required}
                            />
                            {validationErrors[field.id] && (
                              <p className="text-xs text-red-500 mt-1">{validationErrors[field.id]}</p>
                            )}
                            {field.hint && !validationErrors[field.id] && (
                              <p className="text-xs text-gray-500 mt-1">{field.hint}</p>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {currentQuestion.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentQuestion.options.map((option) => (
                          <motion.button
                            key={option.value}
                            type="button"
                            onClick={() => handleAnswer(currentQuestion.id, option.value)}
                            className={`p-4 border rounded-xl text-left transition-all ${
                              answers[currentQuestion.id] === option.value 
                                ? 'bg-gray-800 text-white border-gray-800' 
                                : 'bg-white hover:bg-gray-50 border-gray-200'
                            } group relative`}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * currentQuestion.options.indexOf(option) }}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{option.icon}</span>
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-xs opacity-80">{option.description}</div>
                              </div>
                            </div>
                            {option.tooltip && (
                              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white text-xs text-gray-700 px-2 py-1 rounded shadow-lg border border-gray-200 whitespace-nowrap">
                                  {option.tooltip}
                                </div>
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between mt-10">
                      {currentStep > 0 ? (
                        <motion.button
                          type="button"
                          onClick={handlePrevious}
                          className="px-6 py-3 flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                          whileHover={{ x: -3 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiArrowLeft />
                          Previous
                        </motion.button>
                      ) : (
                        <div /> // Empty div for spacing
                      )}

                      <motion.button
                        type="button"
                        onClick={handleNext}
                        disabled={
                          isCalculating ||
                          (currentQuestion.options && !answers[currentQuestion.id]) ||
                          (currentQuestion.fields && 
                            currentQuestion.fields.some(
                              field => field.required && 
                              (!answers[currentQuestion.id]?.[field.id] && answers[currentQuestion.id]?.[field.id] !== 0)
                            )
                          )
                        }
                        className={`ml-auto px-6 py-3 bg-gray-800 text-white rounded-lg flex items-center gap-2 ${
                          isCalculating || 
                          (currentQuestion.options && !answers[currentQuestion.id]) ||
                          (currentQuestion.fields && 
                            currentQuestion.fields.some(
                              field => field.required && 
                              (!answers[currentQuestion.id]?.[field.id] && answers[currentQuestion.id]?.[field.id] !== 0)
                            )
                          ) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                        }`}
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isCalculating ? (
                          <>
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                            Calculating...
                          </>
                        ) : (
                          <>
                            {isLastStep ? 'Calculate My Fit' : 'Continue'}
                            <FiArrowRight />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.div
                variants={resultVariants}
                initial="hidden"
                animate="visible"
                className="p-8 text-center"
              >
                {/* AI Recommendation Header */}
                <motion.div
                  variants={resultItemVariants}
                  className="mb-8"
                >
                  <h2 className="text-4xl font-light tracking-wide text-gray-800">
                    YOUR PERFECT FIT
                  </h2>
                  <p className="text-gray-600 mt-2">
                    AI-recommended size with {recommendation.confidence} confidence
                  </p>
                </motion.div>

                {/* Main Recommendation */}
                <motion.div
                  variants={resultItemVariants}
                  className="inline-block mb-10"
                >
                  <div className="relative">
                    {/* Floating Size Badge */}
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5, type: 'spring' }}
                      className="absolute -top-6 -right-6 bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-10"
                    >
                      RECOMMENDED
                    </motion.div>

                    {/* Size Display */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gray-200 rounded-2xl blur-md opacity-30 -z-10" />
                      <div className="bg-white p-12 rounded-2xl border border-gray-200 shadow-xl">
                        <div className="text-8xl font-black text-gray-800">
                          {recommendation.size}
                        </div>
                        <div className="text-lg text-gray-600 mt-2">
                          (Size {sizeChart[recommendation.size]?.sizeNumber || ''})
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Alternate Sizes */}
                <motion.div
                  variants={resultItemVariants}
                  className="mb-10"
                >
                  <h4 className="text-sm font-medium text-gray-500 mb-3">ALTERNATE OPTIONS</h4>
                  <div className="flex justify-center gap-4">
                    {recommendation.alternateSizes.map((size, i) => (
                      <motion.div
                        key={size}
                        variants={resultItemVariants}
                        custom={i}
                        className="w-16 h-16 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onRecommend(size);
                          onClose();
                        }}
                      >
                        <span className="text-xl font-medium text-gray-800">{size}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Tailoring Notes */}
                {recommendation.tailoringNotes && (
                  <motion.div
                    variants={resultItemVariants}
                    className="bg-gray-100 rounded-xl p-6 text-left max-w-2xl mx-auto mb-6 border border-gray-200"
                  >
                    <h4 className="text-lg font-medium text-gray-800 mb-3">✂️ TAILORING NOTES</h4>
                    <p className="text-gray-700">{recommendation.tailoringNotes}</p>
                  </motion.div>
                )}

                {/* Styling Tips */}
                <motion.div
                  variants={resultItemVariants}
                  className="bg-gray-100 rounded-xl p-6 text-left max-w-2xl mx-auto mb-8 border border-gray-200"
                >
                  <h4 className="text-lg font-medium text-gray-800 mb-3">✨ STYLING TIPS FOR YOU</h4>
                  <ul className="space-y-2 text-gray-700">
                    {recommendation.stylingTips.map((tip, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-start gap-2"
                        variants={resultItemVariants}
                        custom={i + 2}
                      >
                        <span className="text-gray-600">•</span>
                        <span>{tip}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  variants={resultItemVariants}
                  className="flex flex-col sm:flex-row justify-center gap-4"
                >
                  <motion.button
                    onClick={() => {
                      onRecommend(recommendation.size);
                      onClose();
                    }}
                    className="bg-gray-800 text-white py-4 px-8 rounded-lg uppercase tracking-wider text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiCheck className="w-5 h-5" />
                    Apply This Size
                  </motion.button>

                  <motion.button
                    onClick={onClose}
                    className="bg-white text-gray-800 py-4 px-8 rounded-lg uppercase tracking-wider text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-all"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue Browsing
                  </motion.button>
                </motion.div>

                {/* Confidence Meter */}
                <motion.div
                  variants={resultItemVariants}
                  className="mt-8 text-xs text-gray-500"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gray-700 h-1.5 rounded-full"
                        style={{ width: recommendation.confidence }}
                      />
                    </div>
                    <span>AI Confidence: {recommendation.confidence}</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FindYourFitModal;