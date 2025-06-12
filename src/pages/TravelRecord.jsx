import React, { useState, useRef, useEffect } from 'react';
import '../styles/TravelRecord.css';
import { FaCamera, FaSmile, FaCloudSun, FaMapMarkerAlt, FaThermometerHalf, FaPlus, FaMinus, FaTimes, FaMicrophone, FaVolumeUp, FaComments, FaSave, FaFolder } from 'react-icons/fa';
import axiosInstance from '../api/axiosInstance';

const TravelRecord = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedWeather, setSelectedWeather] = useState('');
  const [selectedTemperature, setSelectedTemperature] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [locations, setLocations] = useState([]);
  const [images, setImages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [showVoiceMode, setShowVoiceMode] = useState(false);
  const [voiceBotText, setVoiceBotText] = useState('오늘 여행은 어떠셨나요?');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatMessagesRef = useRef(null);
  const recognitionRef = useRef(null);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [availableFolders, setAvailableFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [infoSelected, setInfoSelected] = useState(false);

  const seasons = ['🌸 봄', '☀️ 여름', '🍂 가을', '❄️ 겨울'];
  const moods = ['😊 행복', '😌 평온', '😄 신나', '😔 우울', '😡 화나', '😴 피곤'];
  const weathers = ['☀️ 맑음', '⛅️ 구름', '🌧️ 비', '❄️ 눈', '🌪️ 바람'];
  const temperatures = ['🔥 더움', '😊 적당함', '❄️ 추움'];

  const questions = [
    {
      id: 1,
      original: "여행을 떠난 이유, 나의 감정은?",
      friendly: "이번 여행을 떠나게 된 특별한 계기나, 그때 느꼈던 감정을 들려주실 수 있을까요?",
      placeholder: "이 여행을 시작하게 된 계기와 당신의 감정을 들려주세요..."
    },
    {
      id: 2,
      original: "(계절)에 (도시)를 찾은 이유가 있다면?",
      friendly: "이 계절에 이 도시를 선택하신 특별한 이유가 있으신가요?",
      placeholder: "이 계절, 이 도시를 선택한 특별한 이유가 있나요?"
    },
    {
      id: 3,
      original: "(이름)님이 그곳에서의 오늘 하루는 어떻게 흘러갔는지 궁금해진다. 어땠는지",
      friendly: "오늘 하루는 어떻게 보내셨나요? 여행지에서의 소중한 순간들을 시간순으로 들려주시면 좋을 것 같아요.",
      placeholder: "오늘 하루의 여정을 시간순으로 들려주세요..."
    },
    {
      id: 4,
      original: "여행 중 인상 깊었던 인물이나 장면이 있었나요?",
      friendly: "여행 중에 특별히 기억에 남는 사람이나 장면이 있으셨나요? 그 순간을 함께 나눠주실 수 있을까요?",
      placeholder: "특별히 기억에 남는 순간이나 만난 사람이 있다면 이야기해주세요..."
    },
    {
      id: 5,
      original: "(날씨)의 (도시)은 어떤 느낌이었나요? 여행과 함께한 음악이 있다면요?",
      friendly: "오늘의 날씨와 여행지의 분위기는 어땠나요? 혹시 여행과 함께한 음악이 있다면 소개해주셔도 좋아요!",
      placeholder: "도시의 분위기와 함께한 음악에 대해 이야기해주세요..."
    },
    {
      id: 6,
      original: "이 (도시)에서 가장 만족스러웠던 음식은 무엇이었나요?",
      friendly: "여행지에서 맛본 음식 중 가장 기억에 남는 메뉴가 있으신가요? 그때의 느낌을 함께 들려주세요.",
      placeholder: "맛있었던 음식과 그 순간의 기억을 공유해주세요..."
    },
    {
      id: 7,
      original: "여행 중 이건 꼭 해보자라고 생각한 것이 있었다면",
      friendly: "이번 여행에서 꼭 해보고 싶었던 일이나 버킷리스트가 있으셨나요? 그 경험을 나눠주시면 좋겠어요.",
      placeholder: "버킷리스트나 꼭 하고 싶었던 것들이 있다면 알려주세요..."
    },
    {
      id: 8,
      original: "여행을 돌아보았을 때 가장 좋았던 공간은?",
      friendly: "여행을 마치고 돌아봤을 때, 가장 마음에 남는 공간이나 장소가 있으신가요? 그곳에 대한 이야기를 들려주세요.",
      placeholder: "특별히 마음에 들었던 장소나 공간에 대해 이야기해주세요..."
    }
  ];

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // TTS: 챗봇 마지막 메시지 읽기
  const handleTTS = () => {
    const lastBotMsg = [...messages].reverse().find(m => m.type === 'bot');
    if (lastBotMsg && window.speechSynthesis) {
      const utter = new window.SpeechSynthesisUtterance(lastBotMsg.content);
      utter.lang = 'ko-KR';
      window.speechSynthesis.cancel(); // 기존 음성 중지
      window.speechSynthesis.speak(utter);
    }
  };

  // STT: 마이크로 입력 (채팅)
  const handleSTT = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'ko-KR';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
    }
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
      // 자동 전송
      setTimeout(() => {
        const fakeEvent = { preventDefault: () => {} };
        handleSendMessage(fakeEvent, transcript);
      }, 100);
    };
    recognitionRef.current.onerror = () => {
      setIsListening(false);
    };
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
    setIsListening(true);
    recognitionRef.current.start();
  };

  // 음성모드: 오디 질문 및 TTS 자동 재생
  useEffect(() => {
    if (showVoiceMode) {
      // 음성모드 진입 시 첫 질문부터 시작
      setCurrentQuestionIndex(0);
      setVoiceBotText(questions[0].friendly);
      // 첫 질문이 이미 채팅창에 있는지 확인
      setMessages(prev => {
        const alreadyHasFirst = prev.some(
          m => m.type === 'bot' && m.content === questions[0].friendly
        );
        if (alreadyHasFirst) return prev;
        return [
          ...prev,
          {
            type: 'bot',
            content: questions[0].friendly,
            timestamp: new Date().toLocaleTimeString(),
          }
        ];
      });
      handleVoiceTTS(questions[0].friendly);
    }
    // eslint-disable-next-line
  }, [showVoiceMode]);

  // 음성모드에서 답변 입력 및 다음 질문 진행
  const handleVoiceAnswer = (answerText) => {
    // 답변 저장
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].original]: answerText
    }));

    // 사용자 답변을 채팅창에 추가
    setMessages(prev => ([
      ...prev,
      {
        type: 'user',
        content: answerText,
        timestamp: new Date().toLocaleTimeString(),
      }
    ]));

    // 다음 질문 진행
    if (currentQuestionIndex < questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      setTimeout(() => {
        setVoiceBotText(questions[nextIdx].friendly);
        setMessages(prev => ([
          ...prev,
          {
            type: 'bot',
            content: questions[nextIdx].friendly,
            timestamp: new Date().toLocaleTimeString(),
          }
        ]));
        handleVoiceTTS(questions[nextIdx].friendly);
      }, 800);
    } else {
      setTimeout(() => {
        setVoiceBotText('모든 질문에 답변해주셔서 감사합니다! 여행 기록이 완성되었어요.');
        setMessages(prev => ([
          ...prev,
          {
            type: 'bot',
            content: '모든 질문에 답변해주셔서 감사합니다! 여행 기록이 완성되었어요.',
            timestamp: new Date().toLocaleTimeString(),
          }
        ]));
        handleVoiceTTS('모든 질문에 답변해주셔서 감사합니다! 여행 기록이 완성되었어요.');
      }, 800);
    }
  };

  // 음성모드에서 STT로 답변 받기
  const handleVoiceSTT = async () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SpeechRecognition();
    recog.lang = 'ko-KR';
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    setVoiceBotText('듣고 있어요...');
    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setVoiceBotText('답변을 확인했어요!');
      handleVoiceAnswer(transcript);
    };
    recog.onerror = () => {
      setVoiceBotText('음성 인식에 실패했어요. 다시 시도해 주세요.');
    };
    recog.onend = () => {
      setIsListening(false);
    };
    setIsListening(true);
    recog.start();
  };

  // 음성모드: TTS
  const handleVoiceTTS = async (text) => {
    try {
      // TTS API 호출
      const formData = new FormData();
      formData.append('text_input', text);
      
      const ttsResponse = await axiosInstance.post('/speech/tts/', formData);
      
      if (ttsResponse.data.success && ttsResponse.data.audio_data_uri) {
        // Base64 디코딩 및 음성 재생
        const audio = new Audio(ttsResponse.data.audio_data_uri);
        
        setIsSpeaking(true);
        await audio.play();
        audio.onended = () => setIsSpeaking(false);
      }
    } catch (error) {
      console.error('음성 변환 실패:', error);
      setVoiceBotText('음성 변환에 실패했습니다.');
    }
  };

  const closeVoiceMode = () => {
    setShowVoiceMode(false);
    setVoiceBotText('안녕하세요! 무엇이 궁금하신가요?');
    setIsSpeaking(false);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  // 현재 질문 텍스트 생성 (채팅에는 friendly, 저장에는 original)
  const getCurrentQuestionText = () => {
    const question = questions[currentQuestionIndex];
    if (typeof question.friendly === 'function') {
      return question.friendly(
        selectedSeason.replace(/[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF\s]/g, '').trim(),
        locations[0] || '여행지',
        selectedWeather.replace(/[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF\s]/g, '').trim()
      );
    }
    return question.friendly;
  };

  // 컴포넌트 마운트 시 첫 질문 추가 (중복 방지)
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          type: 'bot',
          content: '왼쪽에서 여행 정보(장소, 계절, 날씨, 기온, 기분 등)를 먼저 선택해 주세요.',
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }
  }, []);

  // 여행 정보(필수값) 선택 완료 체크
  useEffect(() => {
    if (
      locations.length > 0 &&
      selectedSeason &&
      selectedWeather &&
      selectedTemperature &&
      selectedMood
    ) {
      setInfoSelected(true);
    } else {
      setInfoSelected(false);
    }
  }, [locations, selectedSeason, selectedWeather, selectedTemperature, selectedMood]);

  // 여행 정보가 모두 선택되면 첫 질문 시작 (중복 방지)
  useEffect(() => {
    if (
      infoSelected &&
      messages.length === 1 &&
      messages[0].type === 'bot' &&
      messages[0].content.includes('여행 정보')
    ) {
      setTimeout(() => {
        setMessages([
          messages[0],
          {
            type: 'bot',
            content: getCurrentQuestionText(),
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      }, 800);
    }
  }, [infoSelected]);

  // 메시지 전송 핸들러 수정
  const handleSendMessage = (e, overrideMessage) => {
    e.preventDefault();
    if (!infoSelected) return;
    const messageToSend = overrideMessage !== undefined ? overrideMessage : inputMessage;
    if (messageToSend.trim() === '') return;

    // 사용자 메시지 추가
    const userMessage = {
      type: 'user',
      content: messageToSend,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // 현재 질문에 대한 답변 저장 (original로 매핑)
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers(prev => ({
      ...prev,
      [typeof currentQuestion.original === 'function'
        ? currentQuestion.original(
            selectedSeason.replace(/[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF\s]/g, '').trim(),
            locations[0] || '여행지',
            selectedWeather.replace(/[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF\s]/g, '').trim()
          )
        : currentQuestion.original]: messageToSend
    }));

    // 다음 질문이 있으면 추가
    if (currentQuestionIndex < questions.length - 1) {
      const nextQuestionIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextQuestionIndex);
      setTimeout(() => {
        const nextQuestion = {
          type: 'bot',
          content: questions[nextQuestionIndex].friendly,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, nextQuestion]);
      }, 1000);
    } else {
      // 모든 질문이 끝났을 때
      setTimeout(() => {
        const completionMessage = {
          type: 'bot',
          content: '모든 질문에 답변해주셔서 감사합니다! 여행 기록이 완성되었어요.',
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, completionMessage]);
      }, 1000);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  // 장소 추가
  const handleAddLocation = (e) => {
    e.preventDefault();
    const trimmed = locationInput.trim();
    if (trimmed && !locations.includes(trimmed)) {
      setLocations([...locations, trimmed]);
      setLocationInput('');
    }
  };

  // 장소 삭제
  const handleRemoveLocation = (index) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  // 여행 기록 저장 함수
  const handleSaveRecord = async () => {
    try {
      // 1. 이미지 업로드
      const imageUploadPromises = images.map(async (imageUrl) => {
        const imageResponse = await fetch(imageUrl);
        const blob = await imageResponse.blob();
        const file = new File([blob], `image_${Date.now()}.jpg`, { type: 'image/jpeg' });

        const formData = new FormData();
        formData.append('magazine_id', 'temp_magazine_id');
        formData.append('files', file);

        const uploadResponse = await axiosInstance.post('/storage/images/upload/', formData);
        if (uploadResponse.status !== 207 && uploadResponse.status !== 200) {
          throw new Error('이미지 업로드 실패');
        }
        return uploadResponse.data;
      });

      // 2. 텍스트 형식으로 여행 기록 저장 (템플릿 형식 사용)
      const textRecord = questions.map((question, index) => {
        const answer = answers[question.original] || "";
        return `q${index + 1} ${question.original}
: ${answer}`;
      }).join('\n\n');

      // 디버깅을 위한 로그
      console.log('현재 answers 상태:', answers);
      console.log('저장될 텍스트:', textRecord);

      // 모든 질문에 답변이 있는지 확인
      const allQuestionsAnswered = questions.every(question => 
        answers[question.original] && answers[question.original].trim() !== ''
      );
      if (!allQuestionsAnswered) {
        if (!window.confirm('일부 질문에 답변이 없습니다. 그래도 저장하시겠습니까?')) {
          return;
        }
      }

      // 답변이 입력된 질문만 필터링
      const filteredAnswers = questions.filter(question => 
        answers[question.original] && answers[question.original].trim() !== ''
      );
      if (filteredAnswers.length === 0) {
        alert('저장할 답변이 없습니다.');
        return;
      }

      const chatFormData = new FormData();
      chatFormData.append('magazine_id', 'temp_magazine_id');
      chatFormData.append('text', textRecord);

      const chatResponse = await axiosInstance.post('/storage/texts/upload/', chatFormData);
      if (chatResponse.status !== 200 && chatResponse.status !== 201) {
        throw new Error('여행 기록 저장 실패');
      }

      // 3. 메타데이터 저장 (이모티콘 제거)
      const metadata = {
        locations,
        season: selectedSeason.replace(/[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF\s]/g, '').trim(),
        weather: selectedWeather.replace(/[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF\s]/g, '').trim(),
        temperature: selectedTemperature.replace(/[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF\s]/g, '').trim(),
        mood: selectedMood.replace(/[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF\s]/g, '').trim(),
        timestamp: new Date().toISOString()
      };

      const metadataResponse = await axiosInstance.post('/magazine/metadata/', {
        magazine_id: 'temp_magazine_id',
        metadata: metadata
      });
      if (metadataResponse.status !== 200 && metadataResponse.status !== 201) {
        throw new Error('메타데이터 저장 실패');
      }

      // 4. 모든 이미지 업로드 완료 대기
      await Promise.all(imageUploadPromises);

      alert('여행 기록이 저장되었습니다!');
      
      // 5. 상태 초기화
      setImages([]);
      setMessages([]);
      setLocations([]);
      setSelectedSeason('');
      setSelectedWeather('');
      setSelectedTemperature('');
      setSelectedMood('');
      setAnswers({});

    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      alert('저장 중 오류가 발생했습니다: ' + error.message);
    }
  };

  // 폴더 목록 불러오기 (API 연동)
  const fetchFolderList = async () => {
    try {
      const res = await axiosInstance.get('/storage/magazines/list/');
      const data = res.data;
      if (data.success) setAvailableFolders(data.magazines);
      else setAvailableFolders([]);
    } catch (e) {
      setAvailableFolders([]);
    }
  };

  useEffect(() => {
    if (showFolderModal) {
      fetchFolderList();
    }
  }, [showFolderModal]);

  // 폴더 생성 핸들러 (더미 텍스트 업로드)
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    setCreatingFolder(true);
    try {
      const formData = new FormData();
      formData.append('magazine_id', newFolderName);
      formData.append('text', '폴더생성');
      await axiosInstance.post('/storage/texts/upload/', formData);
      await fetchFolderList();
      setSelectedFolder(newFolderName);
      setShowFolderModal(false);
      setNewFolderName('');
    } catch (e) {
      alert('폴더 생성에 실패했습니다.');
    } finally {
      setCreatingFolder(false);
    }
  };

  // 음성모드 버튼 클릭 핸들러
  const handleVoiceModeClick = () => {
    if (!infoSelected) {
      alert('왼쪽에서 여행 정보(장소, 계절, 날씨, 기온, 기분 등)를 먼저 선택해 주세요.');
      return;
    }
    setShowVoiceMode(true);
  };

  return (
    <div className="travel-record-container">
      <div className="travel-record-header">
        <h1>여행 기록</h1>
        <p>오디와 대화하며 오늘의 여행을 기록해보세요</p>
        <div className="save-controls">
          <button className="folder-select-btn" onClick={() => setShowFolderModal(true)}>
            <FaFolder /> 폴더 선택
          </button>
          <button className="save-record-btn" onClick={handleSaveRecord}>
            <FaSave /> 기록 저장
          </button>
        </div>
      </div>
      <div className="travel-record-content">
        <div className="travel-info-panel">
          <div className="info-section">
            <h3><FaMapMarkerAlt /> 장소</h3>
            <form className="location-row" onSubmit={handleAddLocation}>
              <input
                type="text"
                placeholder="여행 장소를 입력하세요"
                value={locationInput}
                onChange={e => setLocationInput(e.target.value)}
              />
              <button className="add-location-btn" type="submit">
                <FaPlus /> 장소 추가
              </button>
            </form>
            <ul className="location-list-row">
              {locations.map((loc, idx) => (
                <li key={idx} className="location-pill">
                  <span>{loc}</span>
                  <button className="remove-location-btn" onClick={() => handleRemoveLocation(idx)}>
                    <FaTimes />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="info-section">
            <h3>계절</h3>
            <div className="selection-buttons">
              {seasons.map((season) => (
                <button
                  key={season}
                  className={selectedSeason === season ? 'selected' : ''}
                  onClick={() => setSelectedSeason(season)}
                  type="button"
                >
                  {season}
                </button>
              ))}
            </div>
          </div>

          <div className="info-section">
            <h3><FaCloudSun /> 날씨</h3>
            <div className="selection-buttons">
              {weathers.map((weather) => (
                <button
                  key={weather}
                  className={selectedWeather === weather ? 'selected' : ''}
                  onClick={() => setSelectedWeather(weather)}
                >
                  {weather}
                </button>
              ))}
            </div>
          </div>

          <div className="info-section">
            <h3><FaThermometerHalf /> 기온</h3>
            <div className="selection-buttons">
              {temperatures.map((temp) => (
                <button
                  key={temp}
                  className={selectedTemperature === temp ? 'selected' : ''}
                  onClick={() => setSelectedTemperature(temp)}
                >
                  {temp}
                </button>
              ))}
            </div>
          </div>

          <div className="info-section">
            <h3><FaSmile /> 기분</h3>
            <div className="selection-buttons">
              {moods.map((mood) => (
                <button
                  key={mood}
                  className={selectedMood === mood ? 'selected' : ''}
                  onClick={() => setSelectedMood(mood)}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          <div className="image-upload-section">
            <h3><FaCamera /> 사진</h3>
            <div className="image-upload-area">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload" className="upload-button">
                사진 추가하기
              </label>
            </div>
            <div className="image-preview-grid">
              {images.map((image, index) => (
                <div key={index} className="image-preview-item">
                  <img src={image} alt={`Uploaded ${index + 1}`} />
                  <button onClick={() => removeImage(index)}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chat-section">
          <div className="chat-messages" ref={chatMessagesRef} style={{overflowY: 'auto', maxHeight: '600px'}}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.type}`}
              >
                {message.type === 'bot' && (
                  <img src="/images/odi.png" alt="오디" className="bot-avatar" />
                )}
                <div className="message-content">{message.content}</div>
                <div className="message-timestamp">{message.timestamp}</div>
              </div>
            ))}
          </div>

          <form onSubmit={e => handleSendMessage(e)} className="chat-input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={infoSelected ? (questions[currentQuestionIndex]?.placeholder || "여행 이야기를 들려주세요...") : "먼저 왼쪽에서 여행 정보를 선택해 주세요."}
              disabled={!infoSelected}
            />
            <button type="button" className={`stt-btn${isListening ? ' listening' : ''}`} onClick={handleSTT} title="음성 입력" disabled={!infoSelected}>
              <FaMicrophone />
            </button>
            <button type="submit" disabled={!infoSelected}>전송</button>
          </form>
          <button
            className={`voice-mode-btn${!infoSelected ? ' disabled' : ''}`}
            onClick={handleVoiceModeClick}
            disabled={!infoSelected}
          >
            <img src="/images/voice.png" alt="음성모드" className="voice-mode-icon" style={{marginRight: '0.5rem', width: '1.5em', height: '1.5em'}} />
            음성모드
          </button>
        </div>
      </div>
      {showChatRoom && (
        <div className="chatbot-modal-overlay">
          <div className="chatbot-room">
            <div className="chatbot-header">
              <img src="/images/odi.png" alt="오디" className="chatbot-header-avatar" />
              <div>
                <div className="chatbot-title">오디와의 대화</div>
                <div className="chatbot-status online">● 온라인</div>
              </div>
              <button className="chatbot-modal-close" onClick={() => setShowChatRoom(false)}><FaTimes /></button>
            </div>
            <div className="chatbot-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`chatbot-bubble-row ${msg.type}`}>
                  {msg.type === 'bot' && <img src="/images/odi.png" className="chatbot-avatar" alt="오디" />}
                  <div className={`chatbot-bubble ${msg.type}`}>{msg.content}</div>
                  {msg.type === 'user' && <div className="user-avatar">나</div>}
                </div>
              ))}
            </div>
            <form className="chatbot-input-bar" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="여행 이야기를 들려주세요..."
              />
              <button type="button" className={`tts-btn${messages.some(m=>m.type==='bot') ? '' : ' disabled'}`} onClick={handleTTS} title="챗봇 음성 듣기">
                <FaVolumeUp />
              </button>
              <button type="button" className={`stt-btn${isListening ? ' listening' : ''}`} onClick={handleSTT} title="음성 입력">
                <FaMicrophone />
              </button>
              <button type="submit">전송</button>
            </form>
          </div>
        </div>
      )}
      {showVoiceMode && (
        <div className="voice-mode-overlay">
          <div className="voice-mode-center">
            <img src="/images/odi.png" className={`voice-odi-avatar${isSpeaking ? ' speaking' : ''}`} alt="오디" />
            <div className="voice-odi-text">{voiceBotText}</div>
            <div className="voice-mode-controls" style={{marginTop: '2rem'}}>
              <button className="voice-mic-btn" onClick={handleVoiceSTT} disabled={isListening} title="음성 입력" style={{fontSize:'2.5rem', width:'80px', height:'80px'}}>
                <FaMicrophone />
              </button>
            </div>
          </div>
          <div className="voice-mode-controls">
            <button className="voice-close-btn" onClick={closeVoiceMode} title="닫기">
              <FaTimes />
            </button>
          </div>
        </div>
      )}
      {showFolderModal && (
        <div className="folder-modal-overlay">
          <div className="folder-modal">
            <h3>저장할 폴더 선택</h3>
            <div className="folder-list">
              {availableFolders.map((folder) => (
                <button
                  key={folder}
                  className={`folder-item ${selectedFolder === folder ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedFolder(folder);
                    setShowFolderModal(false);
                  }}
                >
                  {folder}
                </button>
              ))}
            </div>
            <div className="create-folder-row" style={{marginTop:'1em', width:'100%'}}>
              <input
                type="text"
                placeholder="새 폴더 이름 입력"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                style={{width:'70%', padding:'8px', borderRadius:'6px', border:'1.5px solid #A294F9', marginRight:'8px'}}
              />
              <button
                onClick={handleCreateFolder}
                disabled={creatingFolder || !newFolderName.trim()}
                style={{padding:'8px 16px', borderRadius:'6px', background:'#A294F9', color:'#fff', border:'none', fontWeight:'bold'}}
              >
                {creatingFolder ? '생성 중...' : '폴더 생성'}
              </button>
            </div>
            <button className="close-modal-btn" onClick={() => setShowFolderModal(false)}>
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelRecord; 