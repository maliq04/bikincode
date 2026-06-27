'use client'

import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useSettings } from '@/contexts/SettingsContext'

export function Hero() {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [isShaking, setIsShaking] = useState(false)
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()
  const { getSetting } = useSettings()

  const handleCardClick = () => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)
  }

  // Clean and format phone number for WhatsApp
  const cleanPhoneNumber = (phone: string): string => {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/[^0-9]/g, '')
    
    // If starts with 0, replace with 62 (Indonesia country code)
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1)
    }
    
    // If doesn't start with country code, add 62
    if (!cleaned.startsWith('62')) {
      cleaned = '62' + cleaned
    }
    
    return cleaned
  }

  // Update WhatsApp URL whenever settings change
  useEffect(() => {
    const contactPhone = getSetting('contactPhone', '+62 822 8188 3489')
    const whatsappNumber = cleanPhoneNumber(contactPhone)
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello! I\'m interested in your services.')}`
    setWhatsappUrl(url)
    console.log('Hero: WhatsApp URL updated:', url, 'from phone:', contactPhone)
  }, [getSetting])

  return (
    <section className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* More striking white gradient from bottom left corner */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/25 via-white/10 to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* Main Layout - Business Text Centered on Mobile, Left on Desktop with MacCodeCard Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Business Text - Centered on Mobile, Left on Desktop */}
          <div className="text-white text-center lg:text-left lg:col-span-1">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-8">
              {t('heroTitle').split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < t('heroTitle').split('\n').length - 1 && <br />}
                </span>
              ))}
            </h1>
            
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              {t('heroSubtitle')}
            </p>

            <button className="border-2 border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider">
              {t('contactUs')}
            </button>
          </div>

          {/* MacCodeCard - Right Side - HIDDEN ON MOBILE, VISIBLE ON DESKTOP */}
          <div className="hidden lg:flex justify-center items-center lg:col-span-1">
            <div className="w-full max-w-xl xl:max-w-2xl">
            {/* Outer container - floating effect / shadow */}
            <div 
              ref={cardRef}
              onMouseMove={(e) => {
                if (!cardRef.current) return
                const rect = cardRef.current.getBoundingClientRect()
                
                // Logic for calculating mouse position relative to center of card
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                const centerX = rect.width / 2
                const centerY = rect.height / 2
                
                // Value 30 is rotation softness level
                setRotate({
                  x: (y - centerY) / -30,
                  y: (x - centerX) / 30,
                })
              }}
              onMouseLeave={() => setRotate({ x: 0, y: 0 })}
              onClick={handleCardClick}
              style={{
                transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                transition: 'transform 0.1s ease-out',
                transformStyle: 'preserve-3d',
              }}
              className={`relative rounded-2xl bg-gradient-to-b from-gray-800 to-gray-950 shadow-2xl shadow-black/60 overflow-hidden border border-gray-700/60 cursor-pointer [perspective:1200px] ${
                isShaking ? 'animate-shake' : ''
              }`}
            >
              {/* MacOS traffic lights + title bar */}
              <div className="relative h-11 bg-gradient-to-b from-gray-800 to-gray-900 border-b border-gray-700/80 flex items-center px-4 select-none">
                {/* Traffic lights */}
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#28c940] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]" />
                </div>
                {/* Window title */}
                <div className="absolute left-1/2 -translate-x-1/2 text-xs text-gray-400 font-medium truncate max-w-[60%]">
                  index.html — My First Webpage
                </div>
              </div>

              {/* Code area - Responsive sizing */}
              <div className="p-4 lg:p-6 xl:p-8 font-mono text-xs lg:text-sm leading-relaxed text-gray-300 bg-[#0f1117] min-h-[300px] lg:min-h-[350px] xl:min-h-[400px]">
                {/* Line numbers + code */}
                <div className="flex gap-3 lg:gap-4 xl:gap-6">
                  {/* Line numbers */}
                  <div className="text-right text-gray-600 select-none w-8 lg:w-10 xl:w-12 shrink-0">
                    {Array.from({ length: 16 }, (_, i) => i + 1).map((num) => (
                      <div key={num} className="h-5 lg:h-6">{num}</div>
                    ))}
                  </div>
                  {/* HTML Code */}
                  <div className="flex-1 overflow-hidden">
                    <div className="h-5 lg:h-6"><span className="text-pink-400">&lt;!DOCTYPE html&gt;</span></div>
                    <div className="h-5 lg:h-6"><span className="text-pink-400">&lt;html&gt;</span></div>
                    <div className="h-5 lg:h-6"><span className="text-pink-400">&lt;head&gt;</span></div>
                    <div className="h-5 lg:h-6">{'  '}<span className="text-cyan-300">&lt;title&gt;</span>My First Webpage<span className="text-cyan-300">&lt;/title&gt;</span></div>
                    <div className="h-5 lg:h-6"><span className="text-pink-400">&lt;/head&gt;</span></div>
                    <div className="h-5 lg:h-6"><span className="text-pink-400">&lt;body&gt;</span></div>
                    <div className="h-5 lg:h-6">{'  '}<span className="text-pink-400">&lt;h1&gt;</span>My First Webpage<span className="text-pink-400">&lt;/h1&gt;</span></div>
                    <div className="h-5 lg:h-6">{'  '}<span className="text-pink-400">&lt;p&gt;</span>Hello World...<span className="text-pink-400">&lt;/p&gt;</span></div>
                    <div className="h-5 lg:h-6 truncate">{'  '}<span className="text-pink-400">&lt;p&gt;</span>Do you want create website?<span className="text-pink-400">&lt;/p&gt;</span></div>
                    <div className="h-5 lg:h-6">{'  '}<span className="text-pink-400">&lt;p&gt;</span>Contact us now!<span className="text-pink-400">&lt;/p&gt;</span></div>
                    <div className="h-5 lg:h-6 truncate">{'  '}<span className="text-pink-400">&lt;p&gt;</span>created by bikincode<span className="text-pink-400">&lt;/p&gt;</span></div>
                    <div className="h-5 lg:h-6 truncate">{'  '}<span className="text-pink-400">&lt;p&gt;</span><span className="text-blue-400">https://bikincode.com</span><span className="text-pink-400">&lt;/p&gt;</span></div>
                    <div className="h-5 lg:h-6"><span className="text-pink-400">&lt;/body&gt;</span></div>
                    <div className="h-5 lg:h-6"><span className="text-pink-400">&lt;/html&gt;</span></div>
                    <div className="h-5 lg:h-6"></div>
                    <div className="h-5 lg:h-6"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional shadow glow at bottom */}
            <div className="mt-4 lg:mt-6 h-4 lg:h-6 bg-gradient-to-t from-black/40 to-transparent blur-xl mx-auto w-3/4 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            console.log('WhatsApp floating button clicked:', whatsappUrl)
          }}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-green-600 transition-all duration-300 hover:scale-110 animate-pulse"
          title="Chat on WhatsApp"
        >
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        </a>
      </div>
    </section>
  )
}