// Brand links trigger the mosaic reveal when they return to the About page.
document.querySelectorAll(".brand").forEach((brand) => {
  brand.addEventListener("click", () => {
    sessionStorage.setItem("cics-mosaic-replay", "true");
    window.dispatchEvent(new CustomEvent("cics-logo-activate"));
  });
});

const logoFrame = document.querySelector(".logo-frame");
if (logoFrame) {
  const pixelGrid = logoFrame.querySelector(".logo-pixels");
  const palette = ["#063322", "#0b4531", "#2d8060", "#78b895", "#b5d36b"];
  const pixels = [];

  for (let i = 0; i < 144; i++) {
    const pixel = document.createElement("i");
    pixel.style.setProperty(
      "--pixel",
      palette[Math.floor(Math.random() * palette.length)],
    );
    pixel.style.setProperty("--d", `${(Math.random() * 1.6).toFixed(2)}s`);
    pixelGrid.append(pixel);
    pixels.push(pixel);
  }

  const replayLogo = () => {
    logoFrame.classList.remove("is-resolved");
    pixels.forEach((pixel) => pixel.classList.remove("blink"));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => logoFrame.classList.add("is-resolved"));
    });
  };

  replayLogo();
  window.addEventListener("cics-logo-activate", replayLogo);

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (!reduceMotion) {
    setTimeout(() => {
      setInterval(() => {
        if (document.hidden) return;
        for (let n = 0; n < 3; n++) {
          const pixel = pixels[Math.floor(Math.random() * pixels.length)];
          pixel.classList.remove("blink");
          void pixel.offsetWidth;
          pixel.classList.add("blink");
        }
      }, 700);
    }, 2200);
  }
}

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

const inquiryForm = document.querySelector("#inquiry-form");
if (inquiryForm) {
  inquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(inquiryForm);
    const name = formData.get("name").toString().trim();
    const email = formData.get("email").toString().trim();
    const message = formData.get("message").toString().trim();
    const subject = `CICS website inquiry from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;

    document.querySelector("#inquiry-status").textContent =
      "Opening your email app to send this inquiry.";
    window.location.href = `mailto:cicssg@dlsud.edu.ph?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
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
  const sections = Array.from(subnavPills)
    .map((pill) => {
      const hash = pill.getAttribute("href");
      return document.querySelector(hash);
    })
    .filter(Boolean);

  window.addEventListener(
    "scroll",
    () => {
      const scrollPos = window.scrollY + 120;
      sections.forEach((sec, idx) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          subnavPills.forEach((p) => p.classList.remove("active"));
          subnavPills[idx].classList.add("active");
        }
      });
    },
    { passive: true },
  );
}

// 3. Course Syllabus Database & Modal
const courseDatabase = {
  // IT Courses
  IT101: {
    code: "IT101",
    title: "Introduction to Computing",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "None",
    category: "Computing Core",
    desc: "Provides a foundational overview of computing concepts, hardware architecture, number systems, operating systems, and algorithmic problem-solving methodologies required for IT and CS disciplines.",
    outcomes: [
      "Understand computer internal architecture and digital logic fundamentals.",
      "Analyze elementary problem statements and design pseudocode/flowchart solutions.",
      "Apply computing ethics, Lasallian core values, and digital citizenship in technical contexts.",
    ],
  },
  IT102: {
    code: "IT102",
    title: "Computer Programming 1",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "None",
    category: "IT Fundamental Core",
    desc: "Hands-on introduction to structured programming using Python and C++. Covers variables, data types, control flow, functions, arrays, and standard input/output algorithms.",
    outcomes: [
      "Implement robust structured programs using modern compilers and syntax.",
      "Demonstrate structured decomposition of complex computational problems.",
      "Apply automated unit testing and basic debugging techniques.",
    ],
  },
  IT104: {
    code: "IT104",
    title: "Data Structures & Algorithms",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "IT102 / IT103",
    category: "Computing Core",
    desc: "Comprehensive study of abstract data types: linked lists, stacks, queues, trees, heaps, and graph models. Emphasizes sorting algorithms, searching, and Big-O asymptotic analysis.",
    outcomes: [
      "Evaluate algorithmic time and space complexities using Big-O notation.",
      "Design and implement non-linear hierarchical data structures.",
      "Select optimal data structures for high-performance memory management.",
    ],
  },
  IT201: {
    code: "IT201",
    title: "Object-Oriented Programming",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "IT103",
    category: "Professional IT Course",
    desc: "In-depth OOP paradigm using Java and C#. Explores encapsulation, inheritance, polymorphism, abstraction, design patterns, and GUI event handling.",
    outcomes: [
      "Architect enterprise software utilizing object-oriented principles.",
      "Employ Gang-of-Four design patterns (Singleton, Factory, Observer).",
      "Develop graphical user interface desktop applications with event listeners.",
    ],
  },
  IT202: {
    code: "IT202",
    title: "Database Management Systems 1",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "IT104",
    category: "Professional IT Course",
    desc: "Covers relational database design, entity-relationship diagrams (ERD), relational algebra, normal forms (1NF-BCNF), and SQL queries with PostgreSQL/MySQL.",
    outcomes: [
      "Normalize relational database schemas up to Boyce-Codd Normal Form.",
      "Author complex SQL queries with joins, indexing, and aggregations.",
      "Enforce referential integrity, security, and transaction ACID properties.",
    ],
  },
  IT206: {
    code: "IT206",
    title: "Networking 1 (Cisco CCNA 1)",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "IT101",
    category: "IT Infrastructure Core",
    desc: "Fundamentals of computer networks following the Cisco Networking Academy CCNA curriculum. Covers OSI and TCP/IP models, IP addressing (IPv4/IPv6), subnetting, and Ethernet switching.",
    outcomes: [
      "Calculate VLSM and CIDR IPv4 and IPv6 subnetting schemes.",
      "Configure Cisco switches and routers via CLI interfaces.",
      "Analyze packet captures using Wireshark for protocol troubleshooting.",
    ],
  },
  IT302: {
    code: "IT302",
    title: "Web Systems & Technologies",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "IT201, IT202",
    category: "Professional IT Course",
    desc: "Full-stack web application engineering. Covers modern semantic HTML5, CSS3/Tailwind, JavaScript/TypeScript, React front-ends, RESTful Node.js APIs, and database persistence.",
    outcomes: [
      "Build reactive, responsive single-page web applications.",
      "Develop secure RESTful API backends with JWT authentication.",
      "Deploy full-stack web platforms to modern cloud edge hosting.",
    ],
  },
  IT305: {
    code: "IT305",
    title: "Cloud Computing & Virtualization",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "IT206, IT207",
    category: "Professional IT Course",
    desc: "Architecture of cloud infrastructure (IaaS, PaaS, SaaS) using AWS and Google Cloud. Hands-on Docker containerization, microservices deployment, and serverless architectures.",
    outcomes: [
      "Provision scalable cloud virtual machines, VPCs, and storage buckets.",
      "Containerize applications with Docker and multi-container Docker Compose.",
      "Implement Continuous Integration & Continuous Deployment (CI/CD) pipelines.",
    ],
  },
  IT401: {
    code: "IT401",
    title: "Capstone Project 1",
    units: "3.0 Units (3 Lec)",
    prereq: "Senior Standing",
    category: "Culminating Experience",
    desc: "First phase of the year-long senior design project. Teams identify a real-world client need, conduct feasibility studies, architect system specifications, and defend preliminary prototypes.",
    outcomes: [
      "Conduct rigorous user requirements gathering and software engineering modeling.",
      "Author comprehensive IEEE-compliant system design documentation.",
      "Defend conceptual design before a faculty and industry panel.",
    ],
  },
  IT405: {
    code: "IT405",
    title: "Industry Practicum / OJT (480 Hours)",
    units: "6.0 Units",
    prereq: "Graduating Standing",
    category: "Experiential Learning",
    desc: "Supervised 480-hour on-the-job training in premier multinational or local technology enterprises. Immersion into live agile development teams, IT infrastructure support, or data engineering operations.",
    outcomes: [
      "Demonstrate professional workplace ethics, leadership, and collaboration.",
      "Apply computing theories directly to production-grade enterprise projects.",
      "Produce a technical practicum portfolio documenting accomplishments and solutions.",
    ],
  },

  // CS Courses
  CS101: {
    code: "CS101",
    title: "Discrete Structures 1",
    units: "3.0 Units (3 Lec)",
    prereq: "None",
    category: "CS Mathematics Core",
    desc: "Mathematical foundations of computer science: propositional and predicate logic, set theory, proof techniques (mathematical induction, contradiction), relations, and functions.",
    outcomes: [
      "Construct formal mathematical proofs for computational claims.",
      "Model discrete computational systems using relations and partial orders.",
      "Apply Boolean algebra to digital circuit logic simplification.",
    ],
  },
  CS204: {
    code: "CS204",
    title: "Design & Analysis of Algorithms",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "CS105, CS201",
    category: "Theoretical CS Core",
    desc: "Advanced algorithm design paradigms: divide-and-conquer, dynamic programming, greedy algorithms, branch-and-bound, graph algorithms, and NP-completeness theory.",
    outcomes: [
      "Analyze amortized and worst-case complexities of intricate algorithms.",
      "Formulate optimal dynamic programming state transitions.",
      "Prove NP-completeness reductions for combinatorial decision problems.",
    ],
  },
  CS205: {
    code: "CS205",
    title: "Automata Theory & Formal Languages",
    units: "3.0 Units (3 Lec)",
    prereq: "CS105",
    category: "Theoretical CS Core",
    desc: "Study of computational models: Deterministic and Non-Deterministic Finite Automata (DFA/NFA), Regular Expressions, Context-Free Grammars, Pushdown Automata, and Turing Machines.",
    outcomes: [
      "Design formal grammars and finite state automata for language recognition.",
      "Differentiate the Chomsky hierarchy levels of formal languages.",
      "Examine undecidability, the Halting Problem, and universal Turing machines.",
    ],
  },
  CS301: {
    code: "CS301",
    title: "Intelligent Systems & Artificial Intelligence",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "CS204",
    category: "Advanced CS Core",
    desc: "Foundations of modern AI: heuristic state-space search (A*, Minimax), knowledge representation, probabilistic reasoning, machine learning classification, and computer vision basics.",
    outcomes: [
      "Implement adversarial and informed heuristic search algorithms.",
      "Build Bayesian networks and probabilistic inference engines.",
      "Train supervised machine learning models using Python and Scikit-learn.",
    ],
  },
  CS304: {
    code: "CS304",
    title: "Machine Learning & Neural Networks",
    units: "3.0 Units (2 Lec, 3 Lab)",
    prereq: "CS301, MATH103",
    category: "Specialized CS Core",
    desc: "Mathematical foundations and implementation of deep learning architectures: Multilayer Perceptrons, Convolutional Neural Networks (CNNs), Recurrent Networks (RNNs/Transformers), and optimization algorithms.",
    outcomes: [
      "Formulate gradient descent backpropagation from first mathematical principles.",
      "Develop computer vision and NLP models using PyTorch and TensorFlow.",
      "Address overfitting, regularization, and ethical bias in trained AI models.",
    ],
  },
  CS401: {
    code: "CS401",
    title: "CS Thesis 1 (Research Proposal)",
    units: "3.0 Units (3 Lec)",
    prereq: "Senior Standing",
    category: "Research Capstone",
    desc: "First phase of individual or small-group computational scientific research. Students conduct literature reviews, formulate original algorithms or computational models, and defend their thesis proposal.",
    outcomes: [
      "Identify high-impact research gaps in computer science literature.",
      "Formalize theoretical models or algorithmic novelties.",
      "Present and defend oral research proposals before a thesis committee.",
    ],
  },
  CS403: {
    code: "CS403",
    title: "CS Thesis 2 (Defense & Publication)",
    units: "3.0 Units (3 Lec)",
    prereq: "CS401",
    category: "Research Capstone",
    desc: "Final implementation, empirical benchmark evaluation, and defense of the computer science thesis. Includes submission of camera-ready research paper to peer-reviewed conferences or journals.",
    outcomes: [
      "Conduct empirical experiments and statistically analyze performance benchmarks.",
      "Author publication-ready research manuscripts following IEEE formatting.",
      "Successfully defend research contributions in an open academic colloquium.",
    ],
  },
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
      "Adhere to ethical and professional computing practices.",
    ],
  };

  document.querySelector(".modal-course-code").textContent =
    `COURSE // ${course.code}`;
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
  if (modalCloseBtn)
    modalCloseBtn.addEventListener("click", closeSyllabusModal);
  if (modalBackdrop)
    modalBackdrop.addEventListener("click", closeSyllabusModal);
  if (modalCloseFooter)
    modalCloseFooter.addEventListener("click", closeSyllabusModal);

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
  showToast(
    `<b>[SYSTEM]</b> Preparing <b>${programCode}</b> Prospectus (AY 2024-2025)...`,
  );

  setTimeout(() => {
    const escapePdfText = (text) =>
      String(text)
        .replace(/[^\x20-\x7E]/g, "")
        .replace(/\\/g, "\\\\")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)");

    const programData = {
      BSIT: {
        credits: "162 Units",
        compliance: "CHED CMO 25",
        practicum: "480 Hours",
      },
      BSCS: {
        credits: "158 Units",
        compliance: "CHED CMO 25",
        practicum: "480 Hours",
      },
      BSEMC: {
        credits: "160 Units",
        compliance: "CHED CMO 02",
        practicum: "480 Hours",
      },
      MSIT: {
        credits: "36 Units",
        compliance: "Executive Modular",
        practicum: "Master's Thesis",
      },
    };
    const details = programData[programCode] || programData.BSIT;

    const requirements =
      programCode === "MSIT"
        ? [
            ["Core graduate courses", "18 Units"],
            ["Specialization electives", "6 Units"],
            ["Research methods", "6 Units"],
            ["Master's thesis", "6 Units"],
          ]
        : [
            ["General education", "36 Units"],
            ["Basic computing core", "18 Units"],
            ["Professional computing", "63 Units"],
            ["Track / specialization electives", "15 Units"],
            ["Capstone / thesis", "6 Units"],
            ["Industry practicum / OJT", "6 Units"],
          ];

    const competencies = [
      "Lasallian character and professional integrity",
      "Technical mastery in computing systems",
      "Collaborative communication and agility",
      "Innovation and technopreneurial leadership",
      "Lifelong inquiry and continuous learning",
    ];

    const commands = [
      "0.024 0.200 0.127 rg",
      "0 792 612 -792 re f",
      "0.710 0.827 0.420 rg",
      "54 706 504 5 re f",
      "BT /F2 9 Tf 54 752 Td (DE LA SALLE UNIVERSITY-DASMARIÑAS) Tj ET",
      "BT /F1 8 Tf 54 736 Td (COLLEGE OF INFORMATION AND COMPUTER STUDIES) Tj ET",

      "1 1 1 rg",
      "54 626 504 70 re f",
      "0.024 0.200 0.127 rg",
      `BT /F2 19 Tf 72 672 Td (${escapePdfText(programName)}) Tj ET`,
      `BT /F1 9 Tf 72 648 Td (PROGRAM CODE: ${programCode}  |  ACADEMIC YEAR: 2024-2025) Tj ET`,

      "0.710 0.827 0.420 rg",
      "54 591 504 20 re f",
      "0.024 0.200 0.127 rg",
      "BT /F2 9 Tf 64 596 Td (PROGRAM PROFILE) Tj ET",

      "0.024 0.200 0.127 rg",
      "BT /F2 11 Tf 54 560 Td (Academic requirements) Tj ET",
    ];

    let y = 532;
    requirements.forEach(([label, value], index) => {
      commands.push(
        index % 2 === 0 ? "0.96 0.97 0.95 rg" : "0.91 0.95 0.91 rg",
      );
      commands.push(`54 ${y - 6} 504 26 re f`);
      commands.push("0.024 0.200 0.127 rg");
      commands.push(
        `BT /F1 9 Tf 64 ${y + 3} Td (${escapePdfText(label)}) Tj ET`,
      );
      commands.push(
        `BT /F2 9 Tf 500 ${y + 3} Td (${escapePdfText(value)}) Tj ET`,
      );
      y -= 30;
    });

    commands.push("0.024 0.200 0.127 rg");
    commands.push("BT /F2 11 Tf 54 338 Td (Core competencies) Tj ET");

    let competencyY = 308;
    competencies.forEach((item, index) => {
      commands.push("0.710 0.827 0.420 rg");
      commands.push(`54 ${competencyY - 4} 20 20 re f`);
      commands.push("0.024 0.200 0.127 rg");
      commands.push(
        `BT /F2 8 Tf 60 ${competencyY + 2} Td (${index + 1}) Tj ET`,
      );
      commands.push(
        `BT /F1 9 Tf 84 ${competencyY + 2} Td (${escapePdfText(item)}) Tj ET`,
      );
      competencyY -= 28;
    });

    commands.push("0.710 0.827 0.420 rg", "54 154 504 48 re f");
    commands.push("0.024 0.200 0.127 rg");
    commands.push("BT /F2 9 Tf 64 184 Td (CICS PROFILE) Tj ET");
    commands.push(
      `BT /F1 8 Tf 64 166 Td (TOTAL CREDITS: ${details.credits}) Tj ET`,
    );
    commands.push(
      `BT /F1 8 Tf 230 166 Td (COMPLIANCE: ${details.compliance}) Tj ET`,
    );
    commands.push(
      `BT /F1 8 Tf 430 166 Td (PRACTICUM: ${details.practicum}) Tj ET`,
    );

    commands.push("0.024 0.200 0.127 rg");
    commands.push("BT /F1 8 Tf 54 128 Td (For inquiries) Tj ET");
    commands.push(
      "BT /F2 8 Tf 54 112 Td (CICS Dean's Office / Department of Computer Studies) Tj ET",
    );
    commands.push(
      "BT /F1 8 Tf 54 96 Td (De La Salle University-Dasmarinas, Cavite, Philippines) Tj ET",
    );
    commands.push(
      "BT /F1 8 Tf 54 80 Td (Web: www.dlsud.edu.ph  |  Email: cics@dlsud.edu.ph) Tj ET",
    );

    commands.push("0.024 0.200 0.127 rg", "54 58 504 1 re f");
    commands.push(
      "BT /F1 7 Tf 54 42 Td (DLSU-D CICS / CURRICULUM PROSPECTUS) Tj ET",
    );
    commands.push("BT /F1 7 Tf 510 42 Td (01 / 01) Tj ET");

    const stream = commands.join("\n");
    const pdfObjects = [];
    pdfObjects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
    pdfObjects[2] = "<< /Type /Pages /Kids [5 0 R] /Count 1 >>";
    pdfObjects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
    pdfObjects[4] =
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";
    pdfObjects[5] =
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents 6 0 R >>";
    pdfObjects[6] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;

    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    for (let id = 1; id <= 6; id++) {
      offsets[id] = pdf.length;
      pdf += `${id} 0 obj\n${pdfObjects[id]}\nendobj\n`;
    }

    const xrefOffset = pdf.length;
    const xrefEntries = ["0000000000 65535 f "];
    for (let id = 1; id <= 6; id++) {
      xrefEntries.push(`${String(offsets[id]).padStart(10, "0")} 00000 n `);
    }
    pdf += `xref\n0 7\n${xrefEntries.join("\n")}\n`;
    pdf += `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    const blob = new Blob([pdf], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const filename = `DLSU-D_CICS_${programCode}_Curriculum_Prospectus.pdf`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = url;
    downloadAnchor.download = filename;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    showToast(`<b>[SUCCESS]</b> Downloaded <b>${filename}</b>!`);
  }, 900);
}

document.querySelectorAll(".btn-download-pdf").forEach((btn) => {
  btn.addEventListener("click", () => {
    const progName = btn.getAttribute("data-program") || "Academic Program";
    const progCode = btn.getAttribute("data-code") || "CICS";
    triggerProspectusDownload(progName, progCode);
  });
});

// ==========================================================
// FACULTY & STAFF INTERACTION LOGIC
// ==========================================================
(() => {
  /* ---------- directory search + filter ---------- */
  const cards = [...document.querySelectorAll(".faculty-card")];
  const leadership = [
    ...document.querySelectorAll(".faculty-leadership article"),
  ];
  const rosterRows = [...document.querySelectorAll(".faculty-table tbody tr")];
  const chips = [...document.querySelectorAll(".chip")];
  const search = document.querySelector("#faculty-search");
  const countEl = document.querySelector("#faculty-count");
  const emptyEl = document.querySelector("#faculty-empty");
  const leadershipSection = document.querySelector(".faculty-leadership");
  const csRoster = document.querySelector(
    ".faculty-roster:not(.faculty-roster-it)",
  );
  const itRoster = document.querySelector(".faculty-roster-it");
  let activeFilter = "all";

  cards.forEach((card) => {
    card.hidden = true;
  });

  const applyFilters = () => {
    const query = search ? search.value.trim().toLowerCase() : "";
    let shown = 0;

    leadership.forEach((card) => {
      const matchesFilter =
        activeFilter === "all" || activeFilter === "leadership";
      const matchesText =
        !query || card.textContent.toLowerCase().includes(query);
      card.hidden = !(matchesFilter && matchesText);
      if (!card.hidden) shown += 1;
    });

    rosterRows.forEach((row) => {
      const isItRow = Boolean(row.closest(".faculty-roster-it"));
      const rowDepartment = isItRow ? "professional-it" : "professional-cs";
      const matchesFilter =
        activeFilter === "all" || activeFilter === rowDepartment;
      const matchesText =
        !query || row.textContent.toLowerCase().includes(query);
      row.hidden = !(matchesFilter && matchesText);
      if (!row.hidden) shown += 1;
    });

    if (leadershipSection) {
      const hasVisibleLeadership = leadership.some((card) => !card.hidden);
      leadershipSection.hidden = !hasVisibleLeadership;
    }
    if (csRoster) {
      const csRows = [...csRoster.querySelectorAll("tbody tr")];
      csRoster.hidden = !csRows.some((row) => !row.hidden);
    }
    if (itRoster) {
      const itRows = [...itRoster.querySelectorAll("tbody tr")];
      itRoster.hidden = !itRows.some((row) => !row.hidden);
    }

    if (countEl) countEl.textContent = shown;
    if (emptyEl) emptyEl.hidden = shown !== 0;
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      activeFilter = chip.dataset.filter;
      chips.forEach((c) => c.classList.toggle("is-active", c === chip));
      applyFilters();
    });
  });
  if (search) search.addEventListener("input", applyFilters);

  /* ---------- lab tabs (keyboard accessible) ---------- */
  const tabs = [...document.querySelectorAll(".lab-tab")];
  const panels = [...document.querySelectorAll(".lab-panel")];

  const selectTab = (tab, focus = false) => {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.classList.toggle("is-active", selected);
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      const selected = panel.id === tab.getAttribute("aria-controls");
      panel.hidden = !selected;
      panel.classList.toggle("is-active", selected);
      if (selected) panel.classList.add("is-visible");
    });
    if (focus) tab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next = null;
      if (event.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
      if (event.key === "ArrowLeft")
        next = tabs[(index - 1 + tabs.length) % tabs.length];
      if (event.key === "Home") next = tabs[0];
      if (event.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        event.preventDefault();
        selectTab(next, true);
      }
    });
  });
})();
