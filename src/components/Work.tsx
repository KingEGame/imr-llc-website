import { useReveal } from '../hooks/useReveal'
import './Work.css'

const projects = [
  {
    kind: 'AI/ML · HRTech',
    title: 'AiJobApplier',
    body: 'Autonomous job-search and application engine. Monitors job boards, scores postings against a candidate profile, auto-fills applications, and tracks pipeline status — all hands-free.',
    tech: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Celery', 'Docker'],
    liveUrl: 'https://aiapplier.up.railway.app/api/v1',
    githubUrl: 'https://github.com/KingEGame/ai-job-applier',
  },
  {
    kind: 'Enterprise · Mining',
    title: 'ASU-GTK — Mining Fleet Control',
    body: 'Automated control system for mining vehicle fleets. Real-time GIS telemetry, simplex-optimised dispatch scheduling, UDP sensor ingestion, and POI-based reporting for open-pit operations.',
    tech: ['Java 21', 'Spring Boot', 'PostgreSQL', 'Netty', 'Apache POI', 'GIS'],
    githubUrl: 'https://github.com/KingEGame/mining-vehicle-control',
  },
  {
    kind: 'Healthcare · Hackathon — Cornell Tech',
    title: 'HealthClimateAI',
    body: 'Medical alert and predictive health notifier built at Cornell Tech. Correlates climate and environmental signals with patient vitals to surface early-warning health alerts via AWS RDS.',
    tech: ['Python', 'Flask', 'Scikit-Learn', 'Pandas', 'AWS RDS', 'Docker'],
    githubUrl: 'https://github.com/KingEGame/health-notifier-backend',
  },
  {
    kind: 'Web & SaaS · Real Estate',
    title: 'KTM Apartments',
    body: 'Modern rental marketplace with tenant-facing search, landlord dashboards, document management, and Cloudflare R2 media storage. Full-stack, live in production.',
    tech: ['Python', 'FastAPI', 'React', 'Next.js', 'Supabase', 'PostgreSQL'],
    liveUrl: 'https://ktm-frontend-production.up.railway.app',
    githubUrl: 'https://github.com/KingEGame/KTMAppartments',
  },
  {
    kind: 'Robotics · Agriculture',
    title: 'GardenStation — Master\'s Thesis',
    body: 'AI-powered agricultural robot (Master\'s thesis). Computer-vision weed and crop detection with YOLO, ROS-based actuation, IoT sensor telemetry, and FreeCAD-designed chassis.',
    tech: ['Python', 'ROS', 'YOLO', 'Computer Vision', 'Arduino', 'FreeCAD'],
    githubUrl: 'https://github.com/KingEGame/GardenStation',
  },
  {
    kind: 'EdTech · SaaS',
    title: 'Mentor — NextGen LMS',
    body: 'Full-stack learning management and interactive mentorship platform. Multi-tier curriculum management, real-time analytics, assessment modules, and a course marketplace — live on Railway.',
    tech: ['Laravel', 'React 19', 'Inertia.js', 'TypeScript', 'Tailwind CSS', 'MySQL'],
    liveUrl: 'https://mentor-web-production-a704.up.railway.app',
    githubUrl: 'https://github.com/KingEGame/mentor',
  },
  {
    kind: 'eCommerce · SaaS',
    title: 'MultiStore — Multi-Vendor Shop',
    body: 'Scalable multi-vendor eCommerce ecosystem. Dynamic vendor dashboards, inventory management, localised product catalogs, and secure checkout lifecycles — live on Railway.',
    tech: ['Laravel', 'PHP', 'MySQL', 'Tailwind CSS', 'REST API', 'PWA'],
    liveUrl: 'https://store-web-production-a540.up.railway.app',
    githubUrl: 'https://github.com/KingEGame/store',
  },
  {
    kind: 'AI/ML · Audio',
    title: 'AI Audio Library System',
    body: 'Intelligent audio library with NLP-powered scene-prompt search, FastText language detection, pymorphy3 Russian lemmatisation, and AI-generated cover art via diffusion models.',
    tech: ['Python', 'FastAPI', 'spaCy', 'FastText', 'PostgreSQL', 'Qdrant'],
    githubUrl: 'https://github.com/KingEGame/ai-audio-library',
  },
  {
    kind: 'Systems · Spring Boot',
    title: 'Web Analytics Platform',
    body: 'Spring Boot analytics backend with event ingestion, aggregation pipelines, and a real-time reporting dashboard for web traffic and user behaviour metrics.',
    tech: ['Java', 'Spring Boot', 'PostgreSQL', 'React', 'Chart.js'],
    githubUrl: 'https://github.com/KingEGame/web-analytics-spring',
  },
]

export default function Work() {
  const gridRef = useReveal<HTMLDivElement>({ stagger: 90 })
  return (
    <section className="work section" id="work">
      <div className="shell">
        <span className="eyebrow">04 · Selected work</span>
        <h2 className="section-title">Systems we&rsquo;ve shipped.</h2>
        <p className="section-lead">
          A sample of the platforms, agents and automations now running in
          production for our clients and partners.
        </p>
        <div className="work-grid" ref={gridRef}>
          {projects.map((p) => (
            <article key={p.title} className="work-card" data-reveal>
              <span className="work-kind">{p.kind}</span>
              <h3 className="work-title">{p.title}</h3>
              <p className="work-body">{p.body}</p>
              <div className="work-tech">
                {p.tech.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
              <div className="work-actions">
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="work-btn work-btn--live"
                  >
                    Live Demo ↗
                  </a>
                )}
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="work-btn work-btn--gh"
                  >
                    GitHub ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
