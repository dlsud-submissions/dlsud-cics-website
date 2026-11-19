// Navigation Mobile Toggle
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isExpanded));
    menuButton.setAttribute(
      "aria-label",
      isExpanded ? "Open navigation" : "Close navigation",
    );
    navigation.classList.toggle("is-open", !isExpanded);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      navigation.classList.remove("is-open");
    }
  });
}

// Current Year in Footer
const currentYearEl = document.querySelector("#current-year");
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

// Scroll Reveal Observer
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document
    .querySelectorAll(".reveal")
    .forEach((element) => revealObserver.observe(element));
} else {
  document
    .querySelectorAll(".reveal")
    .forEach((element) => element.classList.add("is-visible"));
}

// ==========================================================================
// ACADEMIC PROGRAMS INTERACTION LOGIC
// ==========================================================================

// 1. Year Tabs Switcher
document.querySelectorAll(".curriculum-year-tabs").forEach((tabsContainer) => {
  const buttons = tabsContainer.querySelectorAll(".year-tab-btn");
  const parentDegree = tabsContainer.closest(".degree-block");
  if (!parentDegree) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetYear = btn.getAttribute("data-year");

      // Update button state in this container
      buttons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      // Show matching year content panel
      const panels = parentDegree.querySelectorAll(".year-panel");
      panels.forEach((panel) => {
        if (panel.getAttribute("data-year") === targetYear) {
          panel.style.display = "block";
        } else {
          panel.style.display = "none";
        }
      });
    });
  });
});

// 2. Sticky Subnav Active Scrollspy
const subnavPills = document.querySelectorAll(".subnav-pill");
if (subnavPills.length > 0) {
  const sections = Array.from(subnavPills).map((pill) => {
    const hash = pill.getAttribute("href");
    return document.querySelector(hash);
  }).filter(Boolean);

  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach((sec, idx) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        subnavPills.forEach((p) => p.classList.remove("active"));
        subnavPills[idx].classList.add("active");
      }
    });
  }, { passive: true });
}

// 3. Course Syllabus Database & Modal
const courseDatabase = {
  // IT Courses
  "IT101": {
    code: "IT101",
    title: "Introduction to Computing",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "None",
    category: "Computing Core",
    desc: "Provides a foundational overview of computing concepts, hardware architecture, number systems, operating systems, and algorithmic problem-solving methodologies required for IT and CS disciplines.",
    outcomes: [
      "Understand computer internal architecture and digital logic fundamentals.",
      "Analyze elementary problem statements and design pseudocode/flowchart solutions.",
      "Apply computing ethics, Lasallian core values, and digital citizenship in technical contexts."
    ]
  },
  "IT102": {
    code: "IT102",
    title: "Computer Programming 1",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "None",
    category: "IT Fundamental Core",
    desc: "Hands-on introduction to structured programming using Python and C++. Covers variables, data types, control flow, functions, arrays, and standard input/output algorithms.",
    outcomes: [
      "Implement robust structured programs using modern compilers and syntax.",
      "Demonstrate structured decomposition of complex computational problems.",
      "Apply automated unit testing and basic debugging techniques."
    ]
  },
  "IT104": {
    code: "IT104",
    title: "Data Structures & Algorithms",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "IT102 / IT103",
    category: "Computing Core",
    desc: "Comprehensive study of abstract data types: linked lists, stacks, queues, trees, heaps, and graph models. Emphasizes sorting algorithms, searching, and Big-O asymptotic analysis.",
    outcomes: [
      "Evaluate algorithmic time and space complexities using Big-O notation.",
      "Design and implement non-linear hierarchical data structures.",
      "Select optimal data structures for high-performance memory management."
    ]
  },
  "IT201": {
    code: "IT201",
    title: "Object-Oriented Programming",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "IT103",
    category: "Professional IT Course",
    desc: "In-depth OOP paradigm using Java and C#. Explores encapsulation, inheritance, polymorphism, abstraction, design patterns, and GUI event handling.",
    outcomes: [
      "Architect enterprise software utilizing object-oriented principles.",
      "Employ Gang-of-Four design patterns (Singleton, Factory, Observer).",
      "Develop graphical user interface desktop applications with event listeners."
    ]
  },
  "IT202": {
    code: "IT202",
    title: "Database Management Systems 1",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "IT104",
    category: "Professional IT Course",
    desc: "Covers relational database design, entity-relationship diagrams (ERD), relational algebra, normal forms (1NF-BCNF), and SQL queries with PostgreSQL/MySQL.",
    outcomes: [
      "Normalize relational database schemas up to Boyce-Codd Normal Form.",
      "Author complex SQL queries with joins, indexing, and aggregations.",
      "Enforce referential integrity, security, and transaction ACID properties."
    ]
  },
  "IT206": {
    code: "IT206",
    title: "Networking 1 (Cisco CCNA 1)",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "IT101",
    category: "IT Infrastructure Core",
    desc: "Fundamentals of computer networks following the Cisco Networking Academy CCNA curriculum. Covers OSI and TCP/IP models, IP addressing (IPv4/IPv6), subnetting, and Ethernet switching.",
    outcomes: [
      "Calculate VLSM and CIDR IPv4 and IPv6 subnetting schemes.",
      "Configure Cisco switches and routers via CLI interfaces.",
      "Analyze packet captures using Wireshark for protocol troubleshooting."
    ]
  },
  "IT302": {
    code: "IT302",
    title: "Web Systems & Technologies",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "IT201, IT202",
    category: "Professional IT Course",
    desc: "Full-stack web application engineering. Covers modern semantic HTML5, CSS3/Tailwind, JavaScript/TypeScript, React front-ends, RESTful Node.js APIs, and database persistence.",
    outcomes: [
      "Build reactive, responsive single-page web applications.",
      "Develop secure RESTful API backends with JWT authentication.",
      "Deploy full-stack web platforms to modern cloud edge hosting."
    ]
  },
  "IT305": {
    code: "IT305",
    title: "Cloud Computing & Virtualization",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "IT206, IT207",
    category: "Professional IT Course",
    desc: "Architecture of cloud infrastructure (IaaS, PaaS, SaaS) using AWS and Google Cloud. Hands-on Docker containerization, microservices deployment, and serverless architectures.",
    outcomes: [
      "Provision scalable cloud virtual machines, VPCs, and storage buckets.",
      "Containerize applications with Docker and multi-container Docker Compose.",
      "Implement Continuous Integration & Continuous Deployment (CI/CD) pipelines."
    ]
  },
  "IT401": {
    code: "IT401",
    title: "Capstone Project 1",
    units: "3.0 Units (3 Lec)",
    prereq: "Senior Standing",
    category: "Culminating Experience",
    desc: "First phase of the year-long senior design project. Teams identify a real-world client need, conduct feasibility studies, architect system specifications, and defend preliminary prototypes.",
    outcomes: [
      "Conduct rigorous user requirements gathering and software engineering modeling.",
      "Author comprehensive IEEE-compliant system design documentation.",
      "Defend conceptual design before a faculty and industry panel."
    ]
  },
  "IT405": {
    code: "IT405",
    title: "Industry Practicum / OJT (480 Hours)",
    units: "6.0 Units",
    prereq: "Graduating Standing",
    category: "Experiential Learning",
    desc: "Supervised 480-hour on-the-job training in premier multinational or local technology enterprises. Immersion into live agile development teams, IT infrastructure support, or data engineering operations.",
    outcomes: [
      "Demonstrate professional workplace ethics, leadership, and collaboration.",
      "Apply computing theories directly to production-grade enterprise projects.",
      "Produce a technical practicum portfolio documenting accomplishments and solutions."
    ]
  },

  // CS Courses
  "CS101": {
    code: "CS101",
    title: "Discrete Structures 1",
    units: "3.0 Units (3 Lec)",
    prereq: "None",
    category: "CS Mathematics Core",
    desc: "Mathematical foundations of computer science: propositional and predicate logic, set theory, proof techniques (mathematical induction, contradiction), relations, and functions.",
    outcomes: [
      "Construct formal mathematical proofs for computational claims.",
      "Model discrete computational systems using relations and partial orders.",
      "Apply Boolean algebra to digital circuit logic simplification."
    ]
  },
  "CS204": {
    code: "CS204",
    title: "Design & Analysis of Algorithms",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "CS105, CS201",
    category: "Theoretical CS Core",
    desc: "Advanced algorithm design paradigms: divide-and-conquer, dynamic programming, greedy algorithms, branch-and-bound, graph algorithms, and NP-completeness theory.",
    outcomes: [
      "Analyze amortized and worst-case complexities of intricate algorithms.",
      "Formulate optimal dynamic programming state transitions.",
      "Prove NP-completeness reductions for combinatorial decision problems."
    ]
  },
  "CS205": {
    code: "CS205",
    title: "Automata Theory & Formal Languages",
    units: "3.0 Units (3 Lec)",
    prereq: "CS105",
    category: "Theoretical CS Core",
    desc: "Study of computational models: Deterministic and Non-Deterministic Finite Automata (DFA/NFA), Regular Expressions, Context-Free Grammars, Pushdown Automata, and Turing Machines.",
    outcomes: [
      "Design formal grammars and finite state automata for language recognition.",
      "Differentiate the Chomsky hierarchy levels of formal languages.",
      "Examine undecidability, the Halting Problem, and universal Turing machines."
    ]
  },
  "CS301": {
    code: "CS301",
    title: "Intelligent Systems & Artificial Intelligence",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "CS204",
    category: "Advanced CS Core",
    desc: "Foundations of modern AI: heuristic state-space search (A*, Minimax), knowledge representation, probabilistic reasoning, machine learning classification, and computer vision basics.",
    outcomes: [
      "Implement adversarial and informed heuristic search algorithms.",
      "Build Bayesian networks and probabilistic inference engines.",
      "Train supervised machine learning models using Python and Scikit-learn."
    ]
  },
  "CS304": {
    code: "CS304",
    title: "Machine Learning & Neural Networks",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "CS301, MATH103",
    category: "Specialized CS Core",
    desc: "Mathematical foundations and implementation of deep learning architectures: Multilayer Perceptrons, Convolutional Neural Networks (CNNs), Recurrent Networks (RNNs/Transformers), and optimization algorithms.",
    outcomes: [
      "Formulate gradient descent backpropagation from first mathematical principles.",
      "Develop computer vision and NLP models using PyTorch and TensorFlow.",
      "Address overfitting, regularization, and ethical bias in trained AI models."
    ]
  },
  "CS401": {
    code: "CS401",
    title: "CS Thesis 1 (Research Proposal)",
    units: "3.0 Units (3 Lec)",
    prereq: "Senior Standing",
    category: "Research Capstone",
    desc: "First phase of individual or small-group computational scientific research. Students conduct literature reviews, formulate original algorithms or computational models, and defend their thesis proposal.",
    outcomes: [
      "Identify high-impact research gaps in computer science literature.",
      "Formalize theoretical models or algorithmic novelties.",
      "Present and defend oral research proposals before a thesis committee."
    ]
  },
  "CS403": {
    code: "CS403",
    title: "CS Thesis 2 (Defense & Publication)",
    units: "3.0 Units (3 Lec)",
    prereq: "CS401",
    category: "Research Capstone",
    desc: "Final implementation, empirical benchmark evaluation, and defense of the computer science thesis. Includes submission of camera-ready research paper to peer-reviewed conferences or journals.",
    outcomes: [
      "Conduct empirical experiments and statistically analyze performance benchmarks.",
      "Author publication-ready research manuscripts following IEEE formatting.",
      "Successfully defend research contributions in an open academic colloquium."
    ]
  }
};

// Modal Elements
const modal = document.querySelector(".syllabus-modal");
const modalCloseBtn = document.querySelector(".modal-close-btn");
const modalBackdrop = document.querySelector(".modal-backdrop");
const modalCloseFooter = document.querySelector(".modal-close-footer");

function openSyllabusModal(courseId) {
  if (!modal) return;
  const course = courseDatabase[courseId] || {
    code: courseId,
    title: "Curriculum Course Module",
    units: "3.0 Units",
    prereq: "Department Approval",
    category: "Professional Component",
    desc: "Official CICS curriculum course covering foundational and advanced applied computing techniques aligned with CHED CMO No. 25 standards.",
    outcomes: [
      "Demonstrate proficiency in core computing concepts.",
      "Develop problem-solving strategies using industry-standard tools.",
      "Adhere to ethical and professional computing practices."
    ]
  };

  document.querySelector(".modal-course-code").textContent = `COURSE // ${course.code}`;
  document.querySelector(".modal-course-title").textContent = course.title;
  document.querySelector(".modal-units").textContent = course.units;
  document.querySelector(".modal-prereq").textContent = course.prereq;
  document.querySelector(".modal-category").textContent = course.category;
  document.querySelector(".modal-course-desc").textContent = course.desc;

  const outcomesList = document.querySelector(".modal-outcomes-list");
  if (outcomesList) {
    outcomesList.innerHTML = "";
    course.outcomes.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      outcomesList.appendChild(li);
    });
  }

  modal.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeSyllabusModal() {
  if (!modal) return;
  modal.classList.remove("is-open");
  document.body.style.overflow = "";
}

if (modal) {
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeSyllabusModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeSyllabusModal);
  if (modalCloseFooter) modalCloseFooter.addEventListener("click", closeSyllabusModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeSyllabusModal();
    }
  });

  // Attach click listener to course rows
  document.querySelectorAll(".course-row").forEach((row) => {
    row.addEventListener("click", () => {
      const code = row.getAttribute("data-code");
      if (code) openSyllabusModal(code);
    });
  });

  // Attach click listener to Quick View buttons
  document.querySelectorAll(".btn-quickview").forEach((btn) => {
    btn.addEventListener("click", () => {
      const code = btn.getAttribute("data-code") || "IT101";
      openSyllabusModal(code);
    });
  });
}

// 4. Download Prospectus Feedback & File Generation
const toast = document.querySelector(".system-toast");
let toastTimeout;

function showToast(message) {
  if (!toast) return;
  const toastText = toast.querySelector(".toast-text");
  if (toastText) toastText.innerHTML = message;

  toast.classList.add("is-active");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("is-active");
  }, 4200);
}

function triggerProspectusDownload(programName, programCode) {
  showToast(`<b>[SYSTEM]</b> Preparing <b>${programCode}</b> Prospectus (AY 2024-2025)...`);

  // Generate an authentic, structured syllabus checklist file
  setTimeout(() => {
    const content = `================================================================================
DE LA SALLE UNIVERSITY - DASMARIÑAS
COLLEGE OF INFORMATION AND COMPUTER STUDIES (CICS)
CURRICULUM PROSPECTUS & COURSE CHECKLIST
================================================================================
Program: ${programName}
Code: ${programCode}
Accreditation: CHED Center of Development / Level II PAASCU
Format: Outcome-Based Education (OBE) Curriculum
Academic Year: 2024 - 2025

================================================================================
PROGRAM SPECIFICATIONS & GRADUATION REQUIREMENTS
================================================================================
- Total Academic Units: 158 - 162 Units
- General Education Core: 36 Units
- Basic Computing Core: 18 Units
- Professional Computing Courses: 63 Units
- Track / Specialization Electives: 15 Units
- Free & Interdisciplinary Electives: 6 Units
- Capstone Project / Thesis: 6 Units
- Industry Practicum / OJT: 480 Hours (6 Units)
- Physical Education & NSTP: 14 Units

================================================================================
CORE COMPETENCIES & GRADUATE ATTRIBUTES
================================================================================
1. Lasallian Character & Professional Integrity
2. Technical Mastery in Cloud, Software, and Computing Systems
3. Collaborative Agility & Communication Excellence
4. Innovation & Technopreneurial Leadership
5. Lifelong Inquiry & Continuous Learning

For inquiries, contact:
CICS Dean's Office / Department of Computer Studies
De La Salle University-Dasmariñas, City of Dasmariñas, Cavite, Philippines
Web: https://www.dlsud.edu.ph/ | Email: cics@dlsud.edu.ph
================================================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = url;
    downloadAnchor.download = `DLSU-D_CICS_${programCode}_Curriculum_Prospectus.txt`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);

    showToast(`<b>[SUCCESS]</b> Downloaded <b>DLSU-D_CICS_${programCode}_Curriculum_Prospectus.txt</b>!`);
  }, 900);
}

document.querySelectorAll(".btn-download-pdf").forEach((btn) => {
  btn.addEventListener("click", () => {
    const progName = btn.getAttribute("data-program") || "Academic Program";
    const progCode = btn.getAttribute("data-code") || "CICS";
    triggerProspectusDownload(progName, progCode);
  });
});

