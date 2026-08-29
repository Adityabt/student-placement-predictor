import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import axios from "axios";
import {
  FaSpinner,
  FaGraduationCap,
  FaLaptopCode,
  FaUserAlt,
  FaBriefcase,
  FaTimes,
  FaPlus,
  FaCertificate,
} from "react-icons/fa";
import GlowCard from "../components/GlowCard";
import { IoMdAnalytics } from "react-icons/io";
import { stagger, fadeUp } from "../lib/motionVariants";

const API = "http://localhost:8000";

const EASE = [0.16, 1, 0.3, 1];

const BRANCHES = [
  "CSE", "Civil", "ECE", "EEE", "IT", "Mechanical",
  "AI & Data Science", "Cybersecurity", "Biotechnology",
  "Chemical", "Aerospace", "Robotics & Automation",
];

const SPECIALIZATIONS = {
  CSE: [
    "AI & Machine Learning",
    "Web Development",
    "Cybersecurity",
    "Data Science",
    "Cloud Computing",
    "App Development",
    "Other",
  ],
  Civil: [
    "Structural Engineering",
    "Transportation Engineering",
    "Environmental Engineering",
    "Construction Management",
    "Other",
  ],
  ECE: ["VLSI Design", "Embedded Systems", "Signal Processing", "IoT", "Other"],
  EEE: [
    "Power Systems",
    "Control Systems",
    "Renewable Energy",
    "Electrical Machines",
    "Other",
  ],
  IT: [
    "Software Development",
    "Cloud Computing",
    "Cybersecurity",
    "Data Science",
    "Other",
  ],
  Mechanical: [
    "Design Engineering",
    "Thermal Engineering",
    "Manufacturing",
    "Robotics",
    "Other",
  ],
  "AI & Data Science": [
    "Machine Learning",
    "Deep Learning",
    "Data Engineering",
    "Natural Language Processing",
    "Computer Vision",
    "Other",
  ],
  Cybersecurity: [
    "Network Security",
    "Ethical Hacking",
    "Cloud Security",
    "Digital Forensics",
    "Security Operations",
    "Other",
  ],
  Biotechnology: [
    "Genetic Engineering",
    "Bioinformatics",
    "Pharmaceutical Biotechnology",
    "Food Technology",
    "Other",
  ],
  Chemical: [
    "Process Engineering",
    "Petrochemical Engineering",
    "Polymer Technology",
    "Environmental Engineering",
    "Other",
  ],
  Aerospace: [
    "Aerodynamics",
    "Propulsion",
    "Avionics",
    "Structural Design",
    "Other",
  ],
  "Robotics & Automation": [
    "Industrial Automation",
    "Robotic Process Automation",
    "Embedded Robotics",
    "Control Systems",
    "Other",
  ],
};

const APTITUDE_TESTS = [
  "TCS NQT",
  "AMCAT",
  "CoCubes",
  "College Mock Test",
  "Other",
];

const TECHNICAL_SKILLS = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C",
  "TypeScript",
  "React",
  "Node.js",
  "Express.js",
  "Next.js",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "SQL",
  "AWS",
  "Azure",
  "Google Cloud Platform",
  "Docker",
  "Kubernetes",
  "Git",
  "GitHub",
  "Machine Learning",
  "Deep Learning",
  "Artificial Intelligence",
  "TensorFlow",
  "PyTorch",
  "Keras",
  "Scikit-learn",
  "XGBoost",
  "SHAP",
  "Data Structures & Algorithms",
  "HTML/CSS",
  "Django",
  "Flask",
  "FastAPI",
  "REST APIs",
  "GraphQL",
  "Firebase",
  "Linux",
  "Data Analysis",
  "Data Analytics",
  "Power BI",
  "Tableau",
  "Excel",
  "VBA",
  "NumPy",
  "Pandas",
  "Matplotlib",
  "Seaborn",
  "SciPy",
  "Data Visualization",
  "KPI Analysis",
  "Business Analytics",
  "Business Intelligence",
  "A/B Testing",
  "Statistics",
  "Statistical Analysis",
  "Data Mining",
  "Data Cleaning",
  "Feature Engineering",
  "Predictive Modeling",
  "Natural Language Processing",
  "Computer Vision",
  "OpenCV",
  "Generative AI",
  "NLP",
  "NoSQL",
  "Redis",
  "Spring Boot",
  "Kotlin",
  "Swift",
  "Selenium",
  "Jenkins",
  "CI/CD",
  "Agile",
  "Scrum",
  "Apache Spark",
  "PySpark",
  "Hadoop",
  "Databricks",
  "Apache Kafka",
  "Jupyter",
  "Jupyter Notebook",
  "ETL",
  "Data Engineering",
  "Data Pipelines",
  "Data Warehousing",
  "Database Management",
  "Database Design",
  "Relational Databases",
  "MongoDB",
  "Oracle Database",
  "Microsoft SQL Server",
  "Postman",
  "Swagger",
  "GitLab",
  "Bitbucket",
  "Terraform",
  "Ansible",
  "DevOps",
  "Microservices",
  "System Design",
  "Software Testing",
  "Unit Testing",
  "API Testing",
  "Embedded Systems",
  "Arduino",
  "ESP8266",
  "Internet of Things",
];

const SOFT_SKILLS = [
  "Communication",
  "Leadership",
  "Teamwork",
  "Problem Solving",
  "Critical Thinking",
  "Time Management",
  "Adaptability",
  "Creativity",
  "Emotional Intelligence",
  "Decision Making",
  "Conflict Resolution",
  "Collaboration",
  "Interpersonal Skills",
  "Presentation Skills",
  "Public Speaking",
  "Active Listening",
  "Negotiation",
  "Networking",
  "Work Ethic",
  "Attention to Detail",
  "Organization",
  "Self-Motivation",
  "Accountability",
  "Empathy",
  "Flexibility",
  "Resilience",
  "Multitasking",
  "Stress Management",
  "Mentoring",
  "Coaching",
  "Relationship Building",
  "Customer Service",
  "Analytical Thinking",
  "Strategic Thinking",
  "Team Building",
  "Project Management",
  "Time Management",
  "Professionalism",
  "Confidence",
  "Initiative",
  "Curiosity",
  "Learning Agility",
  "Positive Attitude",
  "Reliability",
  "Interpersonal Communication",
  "Written Communication",
  "Verbal Communication",
  "Active Problem Solving",
  "Workplace Etiquette",
  "Cultural Awareness",
];

// Placement training providers/formats — chips shown only when the
// toggle below is "Yes". Purely for display/insight purposes; the model
// still only ever sees the Yes/No PlacementTraining field.
const TRAINING_TYPES = [
  "College TPO Cell",
  "Coding Bootcamp",
  "Mock Interviews",
  "Group Discussion Practice",
  "Resume Building Workshop",
  "Soft Skills Workshop",
  "Aptitude Training",
  "Online Course (Udemy/Coursera)",
  "Other",
];

// Preferred role/domain — now a REAL model input (PreferredRoleCategory),
// not just a display extra. That means this list must be a closed set,
// index-aligned with ROLE_CATEGORIES in add_synthetic_features.py and
// PREFERRED_ROLE_NAMES in main.py — no "Other" free-text entry anymore,
// since CatBoost was trained on exactly these 10 categories and an
// unseen string can't be encoded into that.
const PREFERRED_ROLES = [
  "Software Development Engineer",
  "Data Analyst",
  "Data Scientist / ML Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "QA / Test Engineer",
  "Core Engineering (Non-IT)",
  "Business Analyst",
];

// Index-aligned with training encoding (0=No, 1=Yes, 2=Flexible) — kept
// in this exact order so `RELOCATE_OPTIONS.indexOf(form.relocate)` can be
// sent straight to the model with no separate mapping step.
const RELOCATE_OPTIONS = ["No", "Yes", "Flexible"];

const labelClass =
  "block text-gray-500 text-[10px] font-medium mb-1.5 uppercase tracking-widest";

const inputClass =
  "w-full bg-gray-950/80 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)]";

const selectClass = `${inputClass} appearance-none cursor-pointer`;

// ---- Shared chrome (mirrors the Analysis page) ----

function HoverCard({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: EASE }}
      className={`transition-shadow duration-300 rounded-2xl hover:shadow-[0_8px_30px_rgba(168,85,247,0.12)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({ icon: Icon, title, hint }) {
  return (
    <div className="flex items-baseline justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon className="text-purple-400" size={12} />
        <h2 className="text-xs font-semibold tracking-wide text-white uppercase">
          {title}
        </h2>
      </div>
      {hint && (
        <span className="text-[10px] text-gray-600 tracking-wide">{hint}</span>
      )}
    </div>
  );
}

// ---- Reusable controls ----

function NumberStepper({
  label,
  name,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}) {
  const update = (delta) => {
    const next = Math.min(max, Math.max(min, Number(value) + delta));
    onChange(name, next);
  };

  return (
    <div>
      <label className={labelClass}>{label}</label>

      <div className="flex items-center bg-gray-950/80 border border-white/10 rounded-lg overflow-hidden focus-within:border-purple-500/50 focus-within:shadow-[0_0_0_3px_rgba(168,85,247,0.12)] transition-all duration-200">
        <motion.button
          whileTap={{ scale: 0.88 }}
          type="button"
          onClick={() => update(-step)}
          className="px-3 py-2.5 text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          −
        </motion.button>

        <input
          type="number"
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          onBlur={(e) => {
            if (e.target.value === "" || isNaN(Number(e.target.value)))
              onChange(name, min);
          }}
          min={min}
          max={max}
          step={step}
          className="w-full bg-transparent text-center text-white text-sm py-2.5 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <motion.button
          whileTap={{ scale: 0.88 }}
          type="button"
          onClick={() => update(step)}
          className="px-3 py-2.5 text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          +
        </motion.button>
      </div>
    </div>
  );
}

function SegmentedToggle({ label, name, value, options, onChange }) {
  const activeIndex = options.indexOf(value);

  return (
    <div>
      <label className={labelClass}>{label}</label>

      <div className="relative flex gap-1 p-1 overflow-hidden border rounded-lg bg-gray-950/80 border-white/10">
        <motion.div
  className="absolute rounded-md top-1 bottom-1"
  style={{
    background: "linear-gradient(135deg, #5b21b6 0%, #7e22ce 45%, #a3195b 100%)",
  }}
  animate={{
    left: `calc(${activeIndex} * (100% / ${options.length}) + 4px)`,
    width: `calc(100% / ${options.length} - 6px)`
  }}
  transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.6 }}
/>

        {options.map((opt) => (
          <motion.button
            key={opt}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => onChange(name, opt)}
            className={`relative z-10 flex-1 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              value === opt ? "text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// Type-to-search picker with chips, backed by a known pool (skills)

function TagPicker({ label, pool, selected, onAdd, onRemove, placeholder }) {
  const [query, setQuery] = useState("");

  const suggestions = query.trim()
    ? pool
        .filter(
          (s) =>
            s.toLowerCase().includes(query.trim().toLowerCase()) &&
            !selected.includes(s),
        )
        .slice(0, 6)
    : [];

  const addSkill = (skill) => {
    onAdd(skill);
    setQuery("");
  };

  return (
    <div>
      <label className={labelClass}>{label}</label>

      <div className="relative">
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && suggestions.length > 0) {
              e.preventDefault();
              addSkill(suggestions[0]);
            }
          }}
          className={inputClass}
        />

        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="absolute z-20 mt-1.5 w-full bg-gray-950 border border-white/10 rounded-lg overflow-hidden shadow-xl shadow-black/40 max-h-56 overflow-y-auto"
            >
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSkill(s)}
                  className="w-full px-4 py-2 text-sm text-left text-gray-300 transition-colors hover:bg-purple-500/10 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selected.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger(0.03)}
          className="flex flex-wrap gap-2 mt-3"
        >
          {selected.map((s) => (
            <motion.span
              key={s}
              variants={fadeUp}
              whileHover={{ scale: 1.04 }}
              className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs font-medium pl-3 pr-2 py-1.5 rounded-full"
            >
              {s}
              <button
                type="button"
                onClick={() => onRemove(s)}
                className="text-purple-300 transition-colors hover:text-white"
              >
                <FaTimes size={10} />
              </button>
            </motion.span>
          ))}
        </motion.div>
      )}
    </div>
  );
}



function FreeTagList({ label, items, onAdd, onRemove, placeholder }) {
  const [draft, setDraft] = useState("");

  const submit = () => {
    const val = draft.trim();

    if (!val || items.includes(val)) return;

    onAdd(val);
    setDraft("");
  };

  return (
    <div>
      <label className={labelClass}>{label}</label>

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          className={inputClass}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={submit}
          className="px-3 text-purple-200 transition-colors border rounded-lg shrink-0 bg-purple-500/15 border-purple-500/30 hover:bg-purple-500/25"
        >
          <FaPlus size={12} />
        </motion.button>
      </div>

      {items.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger(0.03)}
          className="flex flex-wrap gap-2 mt-3"
        >
          {items.map((s) => (
            <motion.span
              key={s}
              variants={fadeUp}
              whileHover={{ scale: 1.04 }}
              className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs font-medium pl-3 pr-2 py-1.5 rounded-full"
            >
              {s}
              <button
                type="button"
                onClick={() => onRemove(s)}
                className="text-purple-300 transition-colors hover:text-white"
              >
                <FaTimes size={10} />
              </button>
            </motion.span>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// Generic "add a specific entry, see a running list" builder — same idea
// as the Internships/Training-programs sections, parameterized so
// Projects, Workshops, and Extracurriculars can each collect the fields
// that actually make sense for them instead of just a bare count.
//
// Duration sits on one compact line with the add button — but instead of
// relying on a placeholder (which gets clipped to nothing in a narrow
// box), it's labeled with plain fixed text ("Duration (months)") that
// sits beside a small number input. Plain text doesn't truncate the way
// placeholders inside bordered inputs do, so this stays both compact
// (no wasted full-width row for a 1–3 digit number) and unambiguous.
function EntryList({
  fields,
  durationUnit,
  durationKey = "duration",
  hasDescription = false,
  descriptionPlaceholder,
  entries,
  draft,
  setDraft,
  onAdd,
  onRemove,
  emptyText,
  renderTitle,
  renderMeta,
}) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-3 mb-3 sm:grid-cols-2">
        {fields.map((f) => (
          <input
            key={f.key}
            type="text"
            placeholder={f.placeholder}
            value={draft[f.key]}
            onChange={(e) =>
              setDraft((p) => ({ ...p, [f.key]: e.target.value }))
            }
            className={inputClass}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-gray-500 text-[10px] font-medium uppercase tracking-widest whitespace-nowrap">
          Duration <span className="tracking-normal text-gray-600 normal-case">({durationUnit})</span>
        </span>

        <input
          type="number"
          placeholder="0"
          min={0}
          max={99}
          value={draft[durationKey]}
          onChange={(e) =>
            setDraft((p) => ({ ...p, [durationKey]: e.target.value }))
          }
          className="w-20 shrink-0 bg-gray-950/80 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm text-center placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={onAdd}
          className="px-3 py-2.5 text-purple-200 transition-colors border rounded-lg shrink-0 bg-purple-500/15 border-purple-500/30 hover:bg-purple-500/25"
        >
          <FaPlus size={12} />
        </motion.button>
      </div>

      {hasDescription && (
        <textarea
          rows={2}
          placeholder={descriptionPlaceholder}
          value={draft.description}
          onChange={(e) =>
            setDraft((p) => ({ ...p, description: e.target.value }))
          }
          className={`${inputClass} mb-4 resize-none`}
        />
      )}

      {entries.length > 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger(0.05)}
          className="space-y-2"
        >
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              variants={fadeUp}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="flex items-start justify-between gap-3 bg-gray-950/80 border border-white/10 rounded-lg px-4 py-2.5 hover:border-purple-500/30 transition-colors"
            >
              <div className="min-w-0 text-sm text-gray-200">
                <div className="font-semibold truncate">
                  {renderTitle(entry)}
                </div>
                <div className="mt-0.5 text-xs text-gray-500">
                  {renderMeta(entry)}
                </div>
                {entry.description && (
                  <div className="mt-1 text-xs leading-relaxed text-gray-400">
                    {entry.description}
                  </div>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.85 }}
                type="button"
                onClick={() => onRemove(entry.id)}
                className="mt-0.5 text-gray-500 transition-colors shrink-0 hover:text-red-400"
              >
                <FaTimes size={12} />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-xs text-gray-600">{emptyText}</p>
      )}
    </div>
  );
}

const headlineLines = [
  { text: "Build your", gradient: false },
  { text: "profile", gradient: true },
];

// ---- Main form ----

export default function PredictForm({ setResult, setLoading, loading }) {
  const [form, setForm] = useState({
    gender: "Male",
    branch: "CSE",
    specialization: SPECIALIZATIONS.CSE[0],
    specializationOther: "",
    cgpa: 7.0,
    backlogs: 0,
    ssc_marks: 70,
    hsc_marks: 70,
    placement_training: "Yes",
    codingPlatform: "LeetCode",
    problemsSolved: 0,
    githubRepos: 0,
    githubContributions: 0,
    aptitudeTest: "TCS NQT",
    aptitudeTestOther: "",
    aptitudeScored: 0,
    aptitudeTotal: 100,
    // Personal / profile info — preferredRole and relocate are now real
    // model inputs (PreferredRoleCategory / WillingToRelocate); portfolio
    // link doubles as the HasPortfolio signal (see handleSubmit) and also
    // stays around as a clickable extra for the profile UI.
    preferredRole: PREFERRED_ROLES[0],
    relocate: "No",
    expectedCTC: 6,
    portfolioLink: "",
  });

  const [technicalSkills, setTechnicalSkills] = useState([]);
  const [softSkills, setSoftSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [internships, setInternships] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [projectEntries, setProjectEntries] = useState([]);
  const [workshopEntries, setWorkshopEntries] = useState([]);
  const [extracurricularEntries, setExtracurricularEntries] = useState([]);

  const [internDraft, setInternDraft] = useState({
    company: "",
    domain: "",
    duration: "",
  });

  const [trainingDraft, setTrainingDraft] = useState({
    type: "",
    duration: "",
  });

  const [projectDraft, setProjectDraft] = useState({
    title: "",
    stack: "",
    duration: "",
    description: "",
  });

  const [workshopDraft, setWorkshopDraft] = useState({
    title: "",
    organizer: "",
    duration: "",
    description: "",
  });

  const [extracurricularDraft, setExtracurricularDraft] = useState({
    activity: "",
    role: "",
    duration: "",
    description: "",
  });

  const sectionRef = useRef(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(500px circle at ${mx}% ${my}%, rgba(168,85,247,0.08), transparent 70%)`;
  const handleMouseMove = (e) => {
    const rect = sectionRef.current.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 100);
    my.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const handleChange = (name, value) => {
    setForm((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      if (name === "branch") {
        next.specialization = SPECIALIZATIONS[value][0];
      }

      return next;
    });

    // Clear logged trainings if the user flips training back to "No" —
    // avoids submitting stale training entries for a "No" answer.
    if (name === "placement_training" && value === "No") {
      setTrainings([]);
    }
  };

  const addInternship = () => {
    if (!internDraft.company.trim() || !internDraft.duration) return;

    setInternships((prev) => [
      ...prev,
      {
        ...internDraft,
        id: Date.now(),
      },
    ]);

    setInternDraft({
      company: "",
      domain: "",
      duration: "",
    });
  };

  const removeInternship = (id) => {
    setInternships((prev) => prev.filter((i) => i.id !== id));
  };

  const addTraining = () => {
    if (!trainingDraft.type.trim() || !trainingDraft.duration) return;

    setTrainings((prev) => [
      ...prev,
      {
        type: trainingDraft.type.trim(),
        duration_weeks: parseInt(trainingDraft.duration) || 0,
        id: Date.now(),
      },
    ]);

    setTrainingDraft({ type: "", duration: "" });
  };

  const removeTraining = (id) => {
    setTrainings((prev) => prev.filter((t) => t.id !== id));
  };

  const addProject = () => {
    if (!projectDraft.title.trim()) return;

    setProjectEntries((prev) => [
      ...prev,
      {
        title: projectDraft.title.trim(),
        stack: projectDraft.stack.trim(),
        duration: parseInt(projectDraft.duration) || 0,
        description: projectDraft.description.trim(),
        id: Date.now(),
      },
    ]);

    setProjectDraft({ title: "", stack: "", duration: "", description: "" });
  };

  const removeProject = (id) => {
    setProjectEntries((prev) => prev.filter((p) => p.id !== id));
  };

  const addWorkshop = () => {
    if (!workshopDraft.title.trim()) return;

    setWorkshopEntries((prev) => [
      ...prev,
      {
        title: workshopDraft.title.trim(),
        organizer: workshopDraft.organizer.trim(),
        duration: parseInt(workshopDraft.duration) || 0,
        description: workshopDraft.description.trim(),
        id: Date.now(),
      },
    ]);

    setWorkshopDraft({
      title: "",
      organizer: "",
      duration: "",
      description: "",
    });
  };

  const removeWorkshop = (id) => {
    setWorkshopEntries((prev) => prev.filter((w) => w.id !== id));
  };

  const addExtracurricular = () => {
    if (!extracurricularDraft.activity.trim()) return;

    setExtracurricularEntries((prev) => [
      ...prev,
      {
        activity: extracurricularDraft.activity.trim(),
        role: extracurricularDraft.role.trim(),
        duration: parseInt(extracurricularDraft.duration) || 0,
        description: extracurricularDraft.description.trim(),
        id: Date.now(),
      },
    ]);

    setExtracurricularDraft({
      activity: "",
      role: "",
      duration: "",
      description: "",
    });
  };

  const removeExtracurricular = (id) => {
    setExtracurricularEntries((prev) => prev.filter((x) => x.id !== id));
  };

  // Derived scores

  const githubScore = Math.min(
    10,
    form.githubRepos * 0.15 + form.githubContributions * 0.008,
  );

  const codingScore = Math.min(100, form.problemsSolved * 0.4);

  const technicalScore = Math.min(100, technicalSkills.length * 8);

  const softSkillsScore = Math.min(10, softSkills.length * 1.5);

  const aptitudeScore =
    form.aptitudeTotal > 0
      ? Math.min(100, (form.aptitudeScored / form.aptitudeTotal) * 100)
      : 0;

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const resolvedSpecialization =
        form.specialization === "Other"
          ? form.specializationOther.trim()
          : form.specialization;

      const resolvedAptitudeTest =
        form.aptitudeTest === "Other"
          ? form.aptitudeTestOther.trim()
          : form.aptitudeTest;

      const isTrained = form.placement_training === "Yes";
      const preferredRoleCategory = PREFERRED_ROLES.indexOf(form.preferredRole);
      const willingToRelocateCode = RELOCATE_OPTIONS.indexOf(form.relocate);
      const hasPortfolio = form.portfolioLink.trim() ? 1 : 0;

      const payload = {
        gender: form.gender === "Male" ? 1 : form.gender === "Female" ? 0 : 2,

        branch: BRANCHES.indexOf(form.branch),

        cgpa: parseFloat(form.cgpa) || 0,

        backlogs: parseInt(form.backlogs) || 0,

        ssc_marks: parseFloat(form.ssc_marks) || 0,

        hsc_marks: parseFloat(form.hsc_marks) || 0,

        internships: internships.length,

        projects: projectEntries.length,

        workshops: workshopEntries.length + certifications.length,

        technical_score: technicalScore,

        coding_score: codingScore,

        github_score: parseFloat(githubScore.toFixed(1)) || 0,

        aptitude_score: parseFloat(aptitudeScore.toFixed(1)) || 0,

        soft_skills: parseFloat(softSkillsScore.toFixed(1)) || 0,

        extracurricular: extracurricularEntries.length,
        placement_training: isTrained ? 1 : 0,

        // Real model inputs (retrained CatBoost — see hyperparameter_tune.py)
        has_portfolio: hasPortfolio,
        willing_to_relocate: willingToRelocateCode,
        preferred_role_category: preferredRoleCategory,
        expected_ctc: parseFloat(form.expectedCTC) || 0,

        // Extra fields — ignored by current model
        specialization: resolvedSpecialization,

        technical_skills: technicalSkills,

        soft_skill_tags: softSkills,

        certifications,

        coding_platform: form.codingPlatform,

        problems_solved: form.problemsSolved,

        github_repos: form.githubRepos,

        github_contributions: form.githubContributions,

        aptitude_test_name: resolvedAptitudeTest,

        aptitude_marks_scored: form.aptitudeScored,

        aptitude_marks_total: form.aptitudeTotal,

        internship_details: internships.map(({ id, ...rest }) => rest),

        project_details: projectEntries.map(({ id, ...rest }) => rest),

        workshop_details: workshopEntries.map(({ id, ...rest }) => rest),

        extracurricular_details: extracurricularEntries.map(
          ({ id, ...rest }) => rest,
        ),

        // Richer placement-training context — display/insight use only,
        // the model still only ever sees the plain Yes/No above. Each
        // training program keeps its own duration rather than one
        // combined total.
        training_details: isTrained
          ? { entries: trainings.map(({ id, ...rest }) => rest) }
          : null,

        // Human-readable duplicates for the profile/insights UI — the
        // model only ever sees the numeric fields above (has_portfolio,
        // willing_to_relocate, preferred_role_category, expected_ctc).
        preferred_role_label: form.preferredRole,
        portfolio_link: form.portfolioLink.trim(),
      };

      const res = await axios.post(`${API}/predict`, payload);

      const fullResult = {
        ...res.data,
        inputs: payload,
      };

      setResult(fullResult);

      sessionStorage.setItem("predictionResult", JSON.stringify(fullResult));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 pt-20 pb-16">
      <div className="max-w-5xl mx-auto">
        <div
          ref={sectionRef}
          onMouseMove={handleMouseMove}
          className="relative"
        >
          <motion.div
            className="absolute inset-0 pointer-events-none -z-10"
            style={{ background: spotlight }}
          />

          {/* Heading — same reveal treatment as Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <p className="mb-2 text-xs font-medium tracking-widest text-purple-400 uppercase">
              Predict
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.15]">
              {headlineLines.map((line, i) => (
                <motion.span
                  key={line.text}
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  transition={{
                    delay: 0.1 + i * 0.15,
                    duration: 0.5,
                    ease: EASE,
                  }}
                  className={
                    line.gradient
                      ? "inline-block py-1 ml-2 text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text"
                      : "inline-block text-white"
                  }
                >
                  {line.text}
                </motion.span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="max-w-md mx-auto mt-3 text-xs leading-relaxed text-gray-500"
            >
              Fill in your details to get your placement prediction, along
              with a clear breakdown of what's helping and what to improve.
            </motion.p>
          </motion.div>

          {/* 01 Academic details */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <HoverCard>
              <GlowCard>
                <div className="p-4 md:p-5">
                  <SectionHeader
                    icon={FaGraduationCap}
                    title="Academic details"
                  />

                  <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                    <NumberStepper
                      label="CGPA"
                      name="cgpa"
                      value={form.cgpa}
                      onChange={handleChange}
                      min={0}
                      max={10}
                      step={0.1}
                    />

                    <NumberStepper
                      label="SSC %"
                      name="ssc_marks"
                      value={form.ssc_marks}
                      onChange={handleChange}
                      min={0}
                      max={100}
                    />

                    <NumberStepper
                      label="HSC %"
                      name="hsc_marks"
                      value={form.hsc_marks}
                      onChange={handleChange}
                      min={0}
                      max={100}
                    />

                    <NumberStepper
                      label="Backlogs"
                      name="backlogs"
                      value={form.backlogs}
                      onChange={handleChange}
                      min={0}
                      max={20}
                    />
                  </div>
                </div>
              </GlowCard>
            </HoverCard>
          </motion.div>

          {/* 02 Branch & specialization */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-4"
          >
            <HoverCard>
              <GlowCard>
                <div className="p-4 md:p-5">
                  <SectionHeader
                    icon={FaUserAlt}
                    title="Branch & specialization"
                  />

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Branch</label>
                      <select
                        value={form.branch}
                        onChange={(e) => handleChange("branch", e.target.value)}
                        className={selectClass}
                      >
                        {BRANCHES.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Specialization</label>
                      <select
                        value={form.specialization}
                        onChange={(e) =>
                          handleChange("specialization", e.target.value)
                        }
                        className={selectClass}
                      >
                        {SPECIALIZATIONS[form.branch].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <AnimatePresence>
                        {form.specialization === "Other" && (
                          <motion.input
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: EASE }}
                            type="text"
                            placeholder="Type your specialization"
                            value={form.specializationOther}
                            onChange={(e) =>
                              handleChange(
                                "specializationOther",
                                e.target.value,
                              )
                            }
                            className={`${inputClass} mt-2`}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </GlowCard>
            </HoverCard>
          </motion.div>

          {/* 03 Skills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4"
          >
            <HoverCard>
              <GlowCard>
                <div className="p-4 md:p-5">
                  <SectionHeader icon={FaLaptopCode} title="Skills" />

                  <div className="grid grid-cols-1 gap-8 mb-6 md:grid-cols-2">
                    <TagPicker
                      label="Technical skills"
                      pool={TECHNICAL_SKILLS}
                      selected={technicalSkills}
                      onAdd={(s) => setTechnicalSkills((p) => [...p, s])}
                      onRemove={(s) =>
                        setTechnicalSkills((p) => p.filter((x) => x !== s))
                      }
                      placeholder="Type to search e.g. Python, NumPy..."
                    />

                    <TagPicker
                      label="Soft skills"
                      pool={SOFT_SKILLS}
                      selected={softSkills}
                      onAdd={(s) => setSoftSkills((p) => [...p, s])}
                      onRemove={(s) =>
                        setSoftSkills((p) => p.filter((x) => x !== s))
                      }
                      placeholder="Type to search e.g. Leadership..."
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Coding platform</label>
                      <select
                        value={form.codingPlatform}
                        onChange={(e) =>
                          handleChange("codingPlatform", e.target.value)
                        }
                        className={selectClass}
                      >
                        <option>LeetCode</option>
                        <option>HackerRank</option>
                        <option>CodeChef</option>
                        <option>GeeksforGeeks</option>
                      </select>
                    </div>

                    <NumberStepper
                      label="Problems solved"
                      name="problemsSolved"
                      value={form.problemsSolved}
                      onChange={handleChange}
                      min={0}
                      max={2000}
                      step={5}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2">
                    <NumberStepper
                      label="GitHub repos"
                      name="githubRepos"
                      value={form.githubRepos}
                      onChange={handleChange}
                      min={0}
                      max={200}
                    />

                    <NumberStepper
                      label="GitHub contributions (past year)"
                      name="githubContributions"
                      value={form.githubContributions}
                      onChange={handleChange}
                      min={0}
                      max={5000}
                      step={10}
                    />
                  </div>

                  {/* Aptitude test */}
                  <div className="mb-6">
                    <div className="grid grid-cols-1 gap-4 mb-3 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>Aptitude test</label>
                        <select
                          value={form.aptitudeTest}
                          onChange={(e) =>
                            handleChange("aptitudeTest", e.target.value)
                          }
                          className={selectClass}
                        >
                          {APTITUDE_TESTS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>

                        <AnimatePresence>
                          {form.aptitudeTest === "Other" && (
                            <motion.input
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2, ease: EASE }}
                              type="text"
                              placeholder="Name the test"
                              value={form.aptitudeTestOther}
                              onChange={(e) =>
                                handleChange(
                                  "aptitudeTestOther",
                                  e.target.value,
                                )
                              }
                              className={`${inputClass} mt-2`}
                            />
                          )}
                        </AnimatePresence>
                      </div>

                      <NumberStepper
                        label="Aptitude / mock test score"
                        name="aptitudeScored"
                        value={form.aptitudeScored}
                        onChange={handleChange}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>

                    <p className="text-[11px] text-gray-600">
                      Tests quantitative aptitude, logical reasoning, and verbal
                      ability — the standard first-round placement test format.
                    </p>
                  </div>

                  <FreeTagList
                    label="Certifications"
                    items={certifications}
                    onAdd={(c) => setCertifications((p) => [...p, c])}
                    onRemove={(c) =>
                      setCertifications((p) => p.filter((x) => x !== c))
                    }
                    placeholder="e.g. AWS Certified Cloud Practitioner"
                  />
                </div>
              </GlowCard>
            </HoverCard>
          </motion.div>

          {/* 04 Internships */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-4"
          >
            <HoverCard>
              <GlowCard>
                <div className="p-4 md:p-5">
                  <SectionHeader icon={FaBriefcase} title="Internships" />

                  <div className="grid grid-cols-1 gap-3 mb-4 sm:grid-cols-4">
                    <input
                      type="text"
                      placeholder="Company"
                      value={internDraft.company}
                      onChange={(e) =>
                        setInternDraft((p) => ({
                          ...p,
                          company: e.target.value,
                        }))
                      }
                      className={`${inputClass} sm:col-span-2`}
                    />

                    <input
                      type="text"
                      placeholder="Domain (e.g. Backend)"
                      value={internDraft.domain}
                      onChange={(e) =>
                        setInternDraft((p) => ({
                          ...p,
                          domain: e.target.value,
                        }))
                      }
                      className={inputClass}
                    />

                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Months"
                        min={0}
                        max={24}
                        value={internDraft.duration}
                        onChange={(e) =>
                          setInternDraft((p) => ({
                            ...p,
                            duration: e.target.value,
                          }))
                        }
                        className={inputClass}
                      />

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.92 }}
                        type="button"
                        onClick={addInternship}
                        className="px-3 text-purple-200 transition-colors border rounded-lg shrink-0 bg-purple-500/15 border-purple-500/30 hover:bg-purple-500/25"
                      >
                        <FaPlus size={12} />
                      </motion.button>
                    </div>
                  </div>

                  {internships.length > 0 ? (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={stagger(0.05)}
                      className="space-y-2"
                    >
                      {internships.map((i) => (
                        <motion.div
                          key={i.id}
                          variants={fadeUp}
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.2, ease: EASE }}
                          className="flex items-center justify-between bg-gray-950/80 border border-white/10 rounded-lg px-4 py-2.5 hover:border-purple-500/30 transition-colors"
                        >
                          <div className="text-sm text-gray-200">
                            <span className="font-semibold">{i.company}</span>
                            {i.domain && (
                              <span className="text-gray-500">
                                {" "}
                                · {i.domain}
                              </span>
                            )}
                            <span className="text-gray-500">
                              {" "}
                              · {i.duration} mo
                            </span>
                          </div>

                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            type="button"
                            onClick={() => removeInternship(i.id)}
                            className="text-gray-500 transition-colors hover:text-red-400"
                          >
                            <FaTimes size={12} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <p className="text-xs text-gray-600">
                      No internships added yet — that's okay, add them as you
                      complete them.
                    </p>
                  )}
                </div>
              </GlowCard>
            </HoverCard>
          </motion.div>

          {/* 05 Other experience (left) + Placement training & Personal
              info stacked (right) — the right column's combined height
              now naturally matches the left column instead of stretching
              a near-empty Placement Training card to match it. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid items-start gap-4 mb-4 md:grid-cols-2"
          >
            <HoverCard>
              <GlowCard>
                <div className="p-4 md:p-5">
                  <SectionHeader
                    icon={FaCertificate}
                    title="Other experience"
                  />

                  <div className="space-y-6">
                    <div>
                      <label className={labelClass}>Projects</label>
                      <EntryList
                        fields={[
                          { key: "title", placeholder: "Project title" },
                          { key: "stack", placeholder: "Tech stack (e.g. React)" },
                        ]}
                        durationUnit="months"
                        hasDescription
                        descriptionPlaceholder="What did you build, and what was your role? (optional)"
                        entries={projectEntries}
                        draft={projectDraft}
                        setDraft={setProjectDraft}
                        onAdd={addProject}
                        onRemove={removeProject}
                        emptyText="No projects added yet — add each one, however small."
                        renderTitle={(e) => e.title}
                        renderMeta={(e) =>
                          [e.stack, `${e.duration || 0} mo`]
                            .filter(Boolean)
                            .join(" · ")
                        }
                      />
                    </div>

                    <div className="pt-6 border-t border-white/5">
                      <label className={labelClass}>
                        Workshops &amp; courses
                      </label>
                      <EntryList
                        fields={[
                          { key: "title", placeholder: "Workshop / course" },
                          { key: "organizer", placeholder: "Organizer" },
                        ]}
                        durationUnit="days"
                        hasDescription
                        descriptionPlaceholder="What did it cover? (optional)"
                        entries={workshopEntries}
                        draft={workshopDraft}
                        setDraft={setWorkshopDraft}
                        onAdd={addWorkshop}
                        onRemove={removeWorkshop}
                        emptyText="No workshops or courses added yet."
                        renderTitle={(e) => e.title}
                        renderMeta={(e) =>
                          [
                            e.organizer,
                            `${e.duration || 0} day${e.duration === 1 ? "" : "s"}`,
                          ]
                            .filter(Boolean)
                            .join(" · ")
                        }
                      />
                    </div>

                    <div className="pt-6 border-t border-white/5">
                      <label className={labelClass}>
                        Extracurricular activities
                      </label>
                      <EntryList
                        fields={[
                          { key: "activity", placeholder: "Activity (e.g. Club)" },
                          { key: "role", placeholder: "Role (e.g. Lead)" },
                        ]}
                        durationUnit="months"
                        hasDescription
                        descriptionPlaceholder="What did you do there? (optional)"
                        entries={extracurricularEntries}
                        draft={extracurricularDraft}
                        setDraft={setExtracurricularDraft}
                        onAdd={addExtracurricular}
                        onRemove={removeExtracurricular}
                        emptyText="No extracurriculars added yet — clubs, sports, fests, volunteering all count."
                        renderTitle={(e) => e.activity}
                        renderMeta={(e) =>
                          [e.role, `${e.duration || 0} mo`]
                            .filter(Boolean)
                            .join(" · ")
                        }
                      />
                    </div>
                  </div>
                </div>
              </GlowCard>
            </HoverCard>

            <div className="flex flex-col gap-4">
              <HoverCard>
                <GlowCard>
                  <div className="p-4 md:p-5">
                    <SectionHeader
                      icon={FaBriefcase}
                      title="Placement training"
                    />

                    <SegmentedToggle
                      label="Placement training"
                      name="placement_training"
                      value={form.placement_training}
                      options={["Yes", "No"]}
                      onChange={handleChange}
                    />

                    <AnimatePresence initial={false}>
                      {form.placement_training === "Yes" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="pt-5 mt-5 border-t border-white/5">
                            <label className={labelClass}>
                              Training programs completed
                            </label>

                            <datalist id="training-type-options">
                              {TRAINING_TYPES.map((t) => (
                                <option key={t} value={t} />
                              ))}
                            </datalist>

                            <div className="grid grid-cols-1 gap-3 mb-4 sm:grid-cols-3">
                              <input
                                type="text"
                                list="training-type-options"
                                placeholder="Type e.g. Mock Interviews"
                                value={trainingDraft.type}
                                onChange={(e) =>
                                  setTrainingDraft((p) => ({
                                    ...p,
                                    type: e.target.value,
                                  }))
                                }
                                className={`${inputClass} sm:col-span-2`}
                              />

                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  placeholder="Weeks"
                                  min={0}
                                  max={52}
                                  value={trainingDraft.duration}
                                  onChange={(e) =>
                                    setTrainingDraft((p) => ({
                                      ...p,
                                      duration: e.target.value,
                                    }))
                                  }
                                  className={inputClass}
                                />

                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.92 }}
                                  type="button"
                                  onClick={addTraining}
                                  className="px-3 text-purple-200 transition-colors border rounded-lg shrink-0 bg-purple-500/15 border-purple-500/30 hover:bg-purple-500/25"
                                >
                                  <FaPlus size={12} />
                                </motion.button>
                              </div>
                            </div>

                            {trainings.length > 0 ? (
                              <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={stagger(0.05)}
                                className="space-y-2"
                              >
                                {trainings.map((t) => (
                                  <motion.div
                                    key={t.id}
                                    variants={fadeUp}
                                    whileHover={{ x: 3 }}
                                    transition={{ duration: 0.2, ease: EASE }}
                                    className="flex items-center justify-between bg-gray-950/80 border border-white/10 rounded-lg px-4 py-2.5 hover:border-purple-500/30 transition-colors"
                                  >
                                    <div className="text-sm text-gray-200">
                                      <span className="font-semibold">
                                        {t.type}
                                      </span>
                                      <span className="text-gray-500">
                                        {" "}
                                        · {t.duration_weeks} wk
                                        {t.duration_weeks === 1 ? "" : "s"}
                                      </span>
                                    </div>

                                    <motion.button
                                      whileTap={{ scale: 0.85 }}
                                      type="button"
                                      onClick={() => removeTraining(t.id)}
                                      className="text-gray-500 transition-colors hover:text-red-400"
                                    >
                                      <FaTimes size={12} />
                                    </motion.button>
                                  </motion.div>
                                ))}
                              </motion.div>
                            ) : (
                              <p className="text-xs text-gray-600">
                                No trainings added yet — add each program
                                separately so its own duration counts.
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </GlowCard>
              </HoverCard>

              <HoverCard>
                <GlowCard>
                  <div className="p-4 md:p-5">
                    <SectionHeader icon={FaUserAlt} title="Personal info" />

                    <div className="space-y-5">
                      <SegmentedToggle
                        label="Gender"
                        name="gender"
                        value={form.gender}
                        options={["Male", "Female", "Other"]}
                        onChange={handleChange}
                      />

                      <div>
                        <label className={labelClass}>
                          Preferred role / domain
                        </label>

                        {/* A closed dropdown, not free text — this is a
                            real model category now (PreferredRoleCategory),
                            so it has to be one of exactly the categories
                            CatBoost was trained on. */}
                        <select
                          value={form.preferredRole}
                          onChange={(e) =>
                            handleChange("preferredRole", e.target.value)
                          }
                          className={selectClass}
                        >
                          {PREFERRED_ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <SegmentedToggle
                          label="Willing to relocate"
                          name="relocate"
                          value={form.relocate}
                          options={RELOCATE_OPTIONS}
                          onChange={handleChange}
                        />

                        <NumberStepper
                          label="Expected CTC (LPA)"
                          name="expectedCTC"
                          value={form.expectedCTC}
                          onChange={handleChange}
                          min={0}
                          max={100}
                          step={0.5}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          Portfolio / LinkedIn link
                        </label>
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/..."
                          value={form.portfolioLink}
                          onChange={(e) =>
                            handleChange("portfolioLink", e.target.value)
                          }
                          className={inputClass}
                        />
                        <p className="mt-1.5 text-[11px] text-gray-600">
                          Having a link on file counts as having a
                          portfolio in the model's eyes — leave it blank
                          if you don't have one yet.
                        </p>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </HoverCard>
            </div>
          </motion.div>

          {/* Predict button — restrained premium CTA, echoes the app's accent */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.button
  whileHover={{ y: -2 }}
  whileTap={{ scale: 0.985, y: 0 }}
  transition={{ type: "spring", stiffness: 500, damping: 30 }}
  onClick={handleSubmit}
  disabled={loading}
  className="group relative w-full overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl flex items-center justify-center gap-2.5 isolate"
>
  {/* Deep, rich violet-to-pink base — still solid, not washed out */}
  <div
    className="absolute inset-0 rounded-xl"
    style={{
      background: "linear-gradient(135deg, #5b21b6 0%, #7e22ce 45%, #a3195b 100%)",
    }}
  />

  {/* Fine top-light for glass depth */}
  <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.10] via-transparent to-black/20 pointer-events-none" />

  {/* Hairline border + soft glow */}
  <div
    className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-300 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_28px_rgba(168,85,247,0.45)]"
    style={{
      border: "1px solid rgba(255,255,255,0.14)",
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.10), 0 0 20px rgba(126,34,206,0.35)",
    }}
  />

  <span className="relative z-10 flex items-center justify-center gap-2.5">
    {loading ? (
      <>
        <FaSpinner className="animate-spin text-[15px]" />
        <span className="font-medium text-[15px] tracking-wide text-white/90">
          Analyzing your profile
        </span>
      </>
    ) : (
      <>
        <IoMdAnalytics className="text-[17px] text-white/90" />
        <span className="font-semibold text-[15px] tracking-wide">
          Predict my placement
        </span>
        <motion.span
          className="text-white/60 text-[15px]"
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          →
        </motion.span>
      </>
    )}
  </span>
</motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}