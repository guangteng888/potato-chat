import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Monitor,
  Settings,
  Users,
  MessageSquare,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Camera,
  MoreVertical
} from 'lucide-react'

const VideoCallComponent = ({ 
  roomId, 
  participants = [], 
  isHost = false,
  onEndCall,
  onToggleVideo,
  onToggleMic 
}) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [connectionQuality, setConnectionQuality] = useState('good')
  
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const localStreamRef = useRef(null)
  const peerConnectionRef = useRef(null)

  // 模拟参与者数据
  const mockParticipants = [
    { id: '1', name: '张三', avatar: '/avatars/user1.jpg', isVideoOn: true, isAudioOn: true, isHost: true },
    { id: '2', name: '李四', avatar: '/avatars/user2.jpg', isVideoOn: true, isAudioOn: false, isHost: false },
    { id: '3', name: '王五', avatar: '/avatars/user3.jpg', isVideoOn: false, isAudioOn: true, isHost: false },
    { id: '4', name: '赵六', avatar: '/avatars/user4.jpg', isVideoOn: true, isAudioOn: true, isHost: false }
  ]

  // 初始化媒体设备
  useEffect(() => {
    initializeMedia()
    startCallTimer()
    
    return () => {
      cleanup()
    }
  }, [])

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      
      localStreamRef.current = stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      // 初始化WebRTC连接
      initializePeerConnection()
    } catch (error) {
      console.error('获取媒体设备失败:', error)
    }
  }

  const initializePeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    }
    
    peerConnectionRef.current = new RTCPeerConnection(configuration)
    
    // 添加本地流
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, localStreamRef.current)
      })
    }
    
    // 处理远程流
    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }
    
    // 监听连接状态
    peerConnectionRef.current.onconnectionstatechange = () => {
      const state = peerConnectionRef.current.connectionState
      setConnectionQuality(
        state === 'connected' ? 'good' :
        state === 'connecting' ? 'fair' : 'poor'
      )
    }
  }

  const startCallTimer = () => {
    const startTime = Date.now()
    const timer = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    
    return () => clearInterval(timer)
  }

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }
  }

  const toggleVideo = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0]
    if (videoTrack) {
      videoTrack.enabled = !isVideoEnabled
      setIsVideoEnabled(!isVideoEnabled)
      onToggleVideo?.(!isVideoEnabled)
    }
  }

  const toggleAudio = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = !isAudioEnabled
      setIsAudioEnabled(!isAudioEnabled)
      onToggleMic?.(!isAudioEnabled)
    }
  }

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      })
      
      // 替换视频轨道
      const videoTrack = screenStream.getVideoTracks()[0]
      const sender = peerConnectionRef.current.getSenders().find(
        s => s.track && s.track.kind === 'video'
      )
      
      if (sender) {
        await sender.replaceTrack(videoTrack)
      }
      
      setIsScreenSharing(true)
      
      // 监听屏幕共享结束
      videoTrack.onended = () => {
        stopScreenShare()
      }
    } catch (error) {
      console.error('屏幕共享失败:', error)
    }
  }

  const stopScreenShare = async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true })
      const videoTrack = videoStream.getVideoTracks()[0]
      
      const sender = peerConnectionRef.current.getSenders().find(
        s => s.track && s.track.kind === 'video'
      )
      
      if (sender) {
        await sender.replaceTrack(videoTrack)
      }
      
      setIsScreenSharing(false)
    } catch (error) {
      console.error('停止屏幕共享失败:', error)
    }
  }

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'good': return 'text-green-500'
      case 'fair': return 'text-yellow-500'
      case 'poor': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'h-screen'}`}>
      {/* 主视频区域 */}
      <div className="relative h-full bg-gray-900">
        {/* 远程视频 */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* 本地视频 (画中画) */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <VideoOff className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* 顶部信息栏 */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-red-500">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                直播中
              </Badge>
              <span className="text-sm">{formatDuration(callDuration)}</span>
              <Badge className={getQualityColor(connectionQuality)}>
                {connectionQuality === 'good' ? '网络良好' : 
                 connectionQuality === 'fair' ? '网络一般' : '网络较差'}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setShowParticipants(!showParticipants)}
              >
                <Users className="w-4 h-4 mr-2" />
                {mockParticipants.length}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* 底部控制栏 */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
          <div className="flex items-center justify-center space-x-4">
            {/* 麦克风控制 */}
            <Button
              variant={isAudioEnabled ? "secondary" : "destructive"}
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={toggleAudio}
            >
              {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </Button>

            {/* 摄像头控制 */}
            <Button
              variant={isVideoEnabled ? "secondary" : "destructive"}
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={toggleVideo}
            >
              {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>

            {/* 屏幕共享 */}
            <Button
              variant={isScreenSharing ? "default" : "secondary"}
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={isScreenSharing ? stopScreenShare : startScreenShare}
            >
              <Monitor className="w-6 h-6" />
            </Button>

            {/* 聊天 */}
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="w-6 h-6" />
            </Button>

            {/* 设置 */}
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full w-14 h-14"
            >
              <Settings className="w-6 h-6" />
            </Button>

            {/* 挂断 */}
            <Button
              variant="destructive"
              size="lg"
              className="rounded-full w-14 h-14 bg-red-500 hover:bg-red-600"
              onClick={onEndCall}
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* 参与者面板 */}
        {showParticipants && (
          <div className="absolute top-0 right-0 w-80 h-full bg-black/80 backdrop-blur-sm text-white p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">参与者 ({mockParticipants.length})</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowParticipants(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-3">
              {mockParticipants.map(participant => (
                <div key={participant.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    {participant.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{participant.name}</span>
                      {participant.isHost && (
                        <Badge variant="secondary" className="text-xs">主持人</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      {participant.isVideoOn ? (
                        <Video className="w-3 h-3 text-green-500" />
                      ) : (
                        <VideoOff className="w-3 h-3 text-red-500" />
                      )}
                      {participant.isAudioOn ? (
                        <Mic className="w-3 h-3 text-green-500" />
                      ) : (
                        <MicOff className="w-3 h-3 text-red-500" />
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 聊天面板 */}
        {showChat && (
          <div className="absolute bottom-0 right-0 w-80 h-96 bg-black/80 backdrop-blur-sm text-white p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">聊天</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="flex-1 space-y-2 mb-4 max-h-64 overflow-y-auto">
              <div className="text-sm">
                <span className="text-blue-400">张三:</span>
                <span className="ml-2">大家好！</span>
              </div>
              <div className="text-sm">
                <span className="text-green-400">李四:</span>
                <span className="ml-2">会议开始了吗？</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="输入消息..."
                className="flex-1 px-3 py-2 bg-white/10 rounded-lg text-white placeholder-gray-400 border border-white/20"
              />
              <Button size="sm">发送</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoCallComponent

