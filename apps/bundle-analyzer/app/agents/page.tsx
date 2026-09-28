import { AppShell } from '@/components/control-center/app-shell'
import { AgentHubClient } from '@/components/control-center/agent-hub-client'
import { SectionHeading } from '@/components/control-center/ui'
import { getAgentArtifactManifest, getAllSkillFiles } from '@/lib/control-center-data'

export default async function AgentsPage() {
  const [agentFiles, allSkillFiles] = await Promise.all([
    getAgentArtifactManifest(),
    getAllSkillFiles(),
  ])

  return (
    <AppShell
      title={{ en: 'Agent workspace', ar: 'مساحة الوكلاء' }}
      subtitle={{
        en: 'Install coding agents, enter the Next.js repository correctly, understand the integration files each agent uses, and download portable configuration bundles.',
        ar: 'ثبّت وكلاء البرمجة وادخل إلى مستودع Next.js بالطريقة الصحيحة وافهم ملفات التكامل التي يستخدمها كل وكيل وحمّل حزم الإعدادات القابلة للنقل.',
      }}
      eyebrow={{ en: 'Agent operations', ar: 'تشغيل الوكلاء' }}
    >
      <SectionHeading
        eyebrow={{ en: 'Compatibility hub', ar: 'مركز التوافق' }}
        title={{ en: 'Codex, Claude, Cursor, Hermes and Conductor', ar: 'Codex وClaude وCursor وHermes وConductor' }}
        description={{
          en: 'Repository-specific guidance and integration files are kept separate from the agent installers themselves.',
          ar: 'يتم الفصل بين تثبيت الوكيل نفسه وبين تعليمات وملفات تكامل هذا المستودع.',
        }}
      />
      <AgentHubClient agentFiles={agentFiles} allSkillFiles={allSkillFiles} />
    </AppShell>
  )
}
