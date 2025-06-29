import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Send,
  Trash2,
  Volume2,
  Download,
  Waveform
} from 'lucide-react'

const VoiceMessageRecorder = ({ onSendVoiceMessage, maxDuration = 60 }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [waveformData, setWaveformData] = useState([])
  const [volume, setVolume] = useState(0)
  
  const mediaRecorderRef = useRef(null)
  const audioRef = useRef(null)
  const streamRef = useRef(null)
  const animationRef = useRef(null)
  const analyserRef = useRef(null)
  const dataArrayRef = useRef(null)

  useEffect(() => {
    return () => {
      stopRecording()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      })
      
      streamRef.current = stream
      
      // 设置音频分析器
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      
      analyser.fftSize = 256
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      
      analyserRef.current = analyser
      dataArrayRef.current = dataArray
      source.connect(analyser)
      
      // 开始录音
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      const chunks = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        
        // 停止音频分析
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
      
      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)
      
      // 开始计时和波形分析
      startTimer()
      analyzeAudio()
      
    } catch (error) {
      console.error('录音失败:', error)
      alert('无法访问麦克风，请检查权限设置')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }

  const startTimer = () => {
    const startTime = Date.now()
    
    const updateTimer = () => {
      if (isRecording) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        setDuration(elapsed)
        
        // 自动停止录音
        if (elapsed >= maxDuration) {
          stopRecording()
          return
        }
        
        setTimeout(updateTimer, 100)
      }
    }
    
    updateTimer()
  }

  const analyzeAudio = () => {
    if (!analyserRef.current || !dataArrayRef.current) return
    
    analyserRef.current.getByteFrequencyData(dataArrayRef.current)
    
    // 计算音量
    const sum = dataArrayRef.current.reduce((acc, val) => acc + val, 0)
    const average = sum / dataArrayRef.current.length
    setVolume(Math.floor((average / 255) * 100))
    
    // 生成波形数据
    const waveform = Array.from(dataArrayRef.current).slice(0, 32)
    setWaveformData(waveform)
    
    if (isRecording) {
      animationRef.current = requestAnimationFrame(analyzeAudio)
    }
  }

  const playAudio = () => {
    if (audioRef.current) {
      if (isPaused) {
        audioRef.current.play()
        setIsPaused(false)
      } else {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
      setIsPlaying(true)
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      setIsPaused(true)
    }
  }

  const deleteRecording = () => {
    setAudioBlob(null)
    setAudioUrl(null)
    setDuration(0)
    setWaveformData([])
    setIsPlaying(false)
    setIsPaused(false)
  }

  const sendVoiceMessage = () => {
    if (audioBlob) {
      const voiceMessage = {
        type: 'voice',
        blob: audioBlob,
        url: audioUrl,
        duration: duration,
        timestamp: Date.now()
      }
      
      onSendVoiceMessage?.(voiceMessage)
      deleteRecording()
    }
  }

  const downloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement('a')
      link.href = audioUrl
      link.download = `voice_message_${Date.now()}.webm`
      link.click()
    }
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        {/* 录音状态显示 */}
        <div className="text-center mb-6">
          {isRecording ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <Mic className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-lg font-semibold text-red-500">
                  正在录音... {formatDuration(duration)}
                </div>
                <Progress value={(duration / maxDuration) * 100} className="w-full" />
                <div className="text-sm text-gray-500">
                  最长 {maxDuration} 秒
                </div>
              </div>
              
              {/* 实时波形显示 */}
              <div className="flex items-center justify-center space-x-1 h-16">
                {waveformData.map((value, index) => (
                  <div
                    key={index}
                    className="bg-red-500 w-1 rounded-full transition-all duration-100"
                    style={{ 
                      height: `${Math.max(4, (value / 255) * 60)}px`,
                      opacity: 0.7 + (value / 255) * 0.3
                    }}
                  />
                ))}
              </div>
              
              {/* 音量指示器 */}
              <div className="flex items-center justify-center space-x-2">
                <Volume2 className="w-4 h-4" />
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${volume}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500">{volume}%</span>
              </div>
            </div>
          ) : audioBlob ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                  <Waveform className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="text-lg font-semibold">
                录音完成 ({formatDuration(duration)})
              </div>
              
              {/* 音频播放器 */}
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => {
                  setIsPlaying(false)
                  setIsPaused(false)
                }}
                onTimeUpdate={(e) => {
                  // 可以在这里更新播放进度
                }}
              />
              
              {/* 静态波形显示 */}
              <div className="flex items-center justify-center space-x-1 h-12 bg-gray-100 rounded-lg p-2">
                {Array.from({ length: 32 }, (_, i) => (
                  <div
                    key={i}
                    className="bg-blue-500 w-1 rounded-full"
                    style={{ 
                      height: `${Math.random() * 30 + 10}px`,
                      opacity: 0.6
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                  <Mic className="w-8 h-8 text-gray-600" />
                </div>
              </div>
              
              <div className="text-lg font-semibold text-gray-600">
                点击开始录音
              </div>
              
              <div className="text-sm text-gray-500">
                最长可录制 {maxDuration} 秒语音消息
              </div>
            </div>
          )}
        </div>

        {/* 控制按钮 */}
        <div className="flex items-center justify-center space-x-3">
          {isRecording ? (
            <Button
              variant="destructive"
              size="lg"
              className="rounded-full w-16 h-16"
              onClick={stopRecording}
            >
              <Square className="w-6 h-6" />
            </Button>
          ) : audioBlob ? (
            <>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-12 h-12"
                onClick={deleteRecording}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-12 h-12"
                onClick={isPlaying ? pauseAudio : playAudio}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-12 h-12"
                onClick={downloadAudio}
              >
                <Download className="w-5 h-5" />
              </Button>
              
              <Button
                variant="default"
                size="lg"
                className="rounded-full w-12 h-12 bg-green-500 hover:bg-green-600"
                onClick={sendVoiceMessage}
              >
                <Send className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="lg"
              className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600"
              onClick={startRecording}
            >
              <Mic className="w-6 h-6" />
            </Button>
          )}
        </div>

        {/* 提示信息 */}
        <div className="mt-4 text-center">
          {isRecording ? (
            <p className="text-sm text-gray-500">
              点击停止按钮结束录音
            </p>
          ) : audioBlob ? (
            <p className="text-sm text-gray-500">
              点击播放试听，确认后发送
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              长按录音按钮开始录制语音消息
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default VoiceMessageRecorder

