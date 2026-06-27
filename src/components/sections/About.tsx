'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Users, Award, Clock, Heart } from 'lucide-react'

const stats = [
  { icon: Users, number: '100+', labelKey: 'happyClients' as const },
  { icon: Award, number: '200+', labelKey: 'projectsCompleted' as const },
  { icon: Clock, number: '5+', labelKey: 'yearsExperience' as const },
  { icon: Heart, number: '99%', labelKey: 'clientSatisfaction' as const }
]

const team = [
  {
    name: 'John Doe',
    role: 'Lead Developer',
    image: '/api/placeholder/300/300',
    description: 'Full-stack developer with 8+ years experience'
  },
  {
    name: 'Jane Smith',
    role: 'UI/UX Designer',
    image: '/api/placeholder/300/300',
    description: 'Creative designer focused on user experience'
  },
  {
    name: 'Mike Johnson',
    role: 'Project Manager',
    image: '/api/placeholder/300/300',
    description: 'Experienced PM ensuring project success'
  }
]

export function About() {
  const { t } = useLanguage()

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('aboutTitle')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('aboutSubtitle')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-gray-600">{t(stat.labelKey)}</div>
            </div>
          ))}
        </div>

        {/* About Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              {t('whyChoose')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t('expertTeam')}</h4>
                  <p className="text-gray-600">{t('expertTeamDesc')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t('modernTech')}</h4>
                  <p className="text-gray-600">{t('modernTechDesc')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t('support247')}</h4>
                  <p className="text-gray-600">{t('support247Desc')}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-4">{t('ourMission')}</h4>
              <p className="text-primary-100 leading-relaxed">
                {t('missionDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {t('meetTeam')}
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{member.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h4>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}