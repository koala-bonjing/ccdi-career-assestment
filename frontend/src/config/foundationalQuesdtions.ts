export const FOUNDATIONAL_QUESTIONS_MAP: Record<
  string,
  {
    text: string;
    correct: string;
    helper: string;
  }
> = {
  // Prerequisite Questions (1-15)
  found_prereq_001: {
    text: "What math subjects have you finished in high school?",
    correct: "Grade 12 Math or higher",
    helper:
      "Don't worry if you haven't taken advanced math - we just want to know where you are now.",
  },
  found_prereq_002: {
    text: "Can you solve this? If 3x + 5 = 20, what is x?",
    correct: "x = 5",
    helper:
      "This checks if you can solve basic algebra. It's okay if you can't - we'll know what to review.",
  },
  found_prereq_003: {
    text: "What is 25% of 80?",
    correct: "20",
    helper:
      "Percentages are used a lot in tech programs for data analysis and calculations.",
  },
  found_prereq_004: {
    text: "Can you read and understand English instructions or textbooks?",
    correct: "I'm very comfortable reading in English",
    helper:
      "This is important because your books and materials will be in English.",
  },
  found_prereq_005: {
    text: "Read this: 'To reset your password, click on Forgot Password, enter your email, and check your inbox for a reset link.' What should you do FIRST?",
    correct: "Click on Forgot Password",
    helper: "We want to see if you can follow step-by-step instructions.",
  },
  found_prereq_006: {
    text: "How comfortable are you using a computer?",
    correct: "I'm very comfortable - I can fix problems and install programs",
    helper: "Be honest - this helps us know how to support you.",
  },
  found_prereq_007: {
    text: "Can you create a folder on your computer and save a file in it?",
    correct: "Yes, and I can organize files into multiple folders",
    helper:
      "Basic file management is important for organizing your schoolwork.",
  },
  found_prereq_008: {
    text: "Have you ever written a computer program or code before?",
    correct: "Yes, regularly",
    helper:
      "It's okay if you've never coded before! Many students start from zero.",
  },
  found_prereq_009: {
    text: "Read this code: if (age >= 18) { print('Adult') } else { print('Minor') }. What will it print if age is 20?",
    correct: "Adult",
    helper:
      "This tests basic logical thinking - don't worry if you don't know, you'll learn this!",
  },
  found_prereq_010: {
    text: "Have you studied science subjects like Physics or Chemistry?",
    correct: "Took advanced science courses",
    helper:
      "We ask this because electronics courses involve some science concepts.",
  },
  found_prereq_011: {
    text: "Do you know what voltage, current, and resistance mean?",
    correct: "Yes, I understand these concepts well",
    helper:
      "These are basic electrical concepts you'll use a lot in electronics programs.",
  },
  found_prereq_012: {
    text: "Which of these tools have you used before? (Choose what applies)",
    correct:
      "Multiple tools including soldering iron or circuit testing equipment",
    helper: "Hands-on experience with tools is helpful but not required.",
  },
  found_prereq_013: {
    text: "Read this: 'A computer needs three main parts: a processor (the brain), memory (temporary storage), and storage (permanent files).' Which part keeps your files permanently?",
    correct: "Storage",
    helper:
      "Don't worry if you don't know computer terms yet - you'll learn them!",
  },
  found_prereq_014: {
    text: "What does 'download' mean?",
    correct: "Getting a file from the internet to your computer",
    helper: "Basic computer vocabulary helps with understanding instructions.",
  },
  found_prereq_015: {
    text: "Read this: 'Electricity flows through wires like water flows through pipes. The amount of electricity is called current.' What does 'current' mean?",
    correct: "The amount of electricity flowing",
    helper: "We use simple examples to explain technical ideas.",
  },

  // Study Habit Questions (16-27)
  found_study_001: {
    text: "How much time can you spend studying EACH WEEK (outside of class)?",
    correct: "More than 15 hours",
    helper:
      "College usually needs 10-15 hours of study per week. Be realistic about your schedule.",
  },
  found_study_002: {
    text: "Do you currently work or have family responsibilities?",
    correct: "No, I can focus mostly on studies",
    helper:
      "Understanding your commitments helps us recommend full-time or part-time enrollment.",
  },
  found_study_003: {
    text: "When you have homework or a project, when do you usually start?",
    correct: "As soon as I get the assignment",
    helper: "There's no wrong answer - we want to help you build good habits.",
  },
  found_study_004: {
    text: "How do you usually study for exams?",
    correct: "I create study schedules and use multiple study techniques",
    helper: "Good study habits can be learned - we offer workshops to help!",
  },
  found_study_005: {
    text: "If something is hard to understand, what do you usually do?",
    correct: "I ask the teacher and keep trying until I understand",
    helper:
      "College can be challenging - it's important to ask for help when you need it.",
  },
  found_study_006: {
    text: "When working on a difficult problem, how long do you usually try before asking for help?",
    correct: "I try for an hour or more before asking",
    helper:
      "Finding the right balance between persistence and asking for help is important.",
  },
  found_study_007: {
    text: "Do you have a quiet place to study at home?",
    correct: "Yes, and I have a good computer/internet too",
    helper:
      "If you don't have a quiet space, you can use the school library or computer labs.",
  },
  found_study_008: {
    text: "Do you have reliable internet access for online resources and research?",
    correct: "Excellent internet access always available",
    helper:
      "Internet access is important for assignments. The school has computer labs if you need them.",
  },
  found_study_009: {
    text: "How do you keep track of your assignments and deadlines?",
    correct: "I have an organized system (planner, app, etc.)",
    helper:
      "We can teach you organization skills - but it helps if you already have a system.",
  },
  found_study_010: {
    text: "In your previous studies, what were your average grades?",
    correct: "90 and above (excellent)",
    helper:
      "Past performance helps us understand your academic preparation. Don't worry - we can help you improve!",
  },
  found_study_011: {
    text: "How well do you handle stress during exams or deadlines?",
    correct: "I handle pressure well and stay focused",
    helper:
      "Learning to manage stress is part of college success. We have counselors who can help!",
  },
  found_study_012: {
    text: "Do you prefer to study alone or with others?",
    correct: "I learn best in study groups",
    helper:
      "Both approaches work! We have study groups and quiet study areas available.",
  },

  // Problem Solving Questions (28-37)
  found_problem_001: {
    text: "SIMPLE MATH: If you have 20 pesos and spend 7 pesos, how much is left?",
    correct: "13 pesos",
    helper: "Just checking basic math skills.",
  },
  found_problem_002: {
    text: "PATTERN: What comes next? 2, 4, 6, 8, ___",
    correct: "10",
    helper: "Can you see the pattern?",
  },
  found_problem_003: {
    text: "LOGIC: If your phone won't turn on, what should you try FIRST?",
    correct: "Check if the battery is charged",
    helper: "This tests if you can troubleshoot problems logically.",
  },
  found_problem_004: {
    text: "SEQUENCE: If A=1, B=2, C=3, what number is F?",
    correct: "6",
    helper:
      "Pattern recognition is important in programming and system design.",
  },
  found_problem_005: {
    text: "WORD PROBLEM: A store sells 30 items on Monday, 45 items on Tuesday, and 25 items on Wednesday. What's the total?",
    correct: "100 items",
    helper: "Business and tech programs work with numbers and data like this.",
  },
  found_problem_006: {
    text: "LOGICAL THINKING: All programmers can code. John can code. Therefore:",
    correct: "John might be a programmer",
    helper: "Logical reasoning is crucial for programming and system analysis.",
  },
  found_problem_007: {
    text: "PROBLEM SOLVING: You need to connect 3 computers to share files and a printer. What's the BEST solution?",
    correct: "Set up a network (WiFi or cables with a router)",
    helper: "Don't worry if you don't know - this is what you'll learn in IT!",
  },
  found_problem_008: {
    text: "DATA ANALYSIS: Look at this data - Week 1: 100 sales, Week 2: 150 sales, Week 3: 200 sales. What do you notice?",
    correct: "Sales are increasing by 50 each week",
    helper:
      "Finding patterns in data is a key skill for business and information systems.",
  },
  found_problem_009: {
    text: "ELECTRICITY BASICS: Why do you get a shock when you touch a live wire?",
    correct: "Electricity flows through your body",
    helper: "Basic safety knowledge - you'll learn much more about this!",
  },
  found_problem_010: {
    text: "CIRCUIT THINKING: If you connect 2 batteries in series (end to end), what happens to the voltage?",
    correct: "Voltage doubles (adds together)",
    helper:
      "Don't worry if you don't know - this is basic electronics you'll learn!",
  },
};
