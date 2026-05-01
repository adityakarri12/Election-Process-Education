export type Option = {
  label: string;
  impact: number;
  feedback: string;
  isCorrect: boolean;
};

export type Question = {
  id: number;
  question: string;
  options: Option[];
};

export const voterQuestions: Question[] = [
  {
    id: 1,
    question: "You arrive at the polling booth and realize your Voter ID (EPIC) is missing. What is your next move?",
    options: [
      { label: "Go back home and miss the voting deadline.", impact: -5, feedback: "Participation is key. You should have checked for alternative IDs.", isCorrect: false },
      { label: "Present an alternative ID like Aadhar or Passport.", impact: 10, feedback: "Correct! The ECI accepts 12 alternative documents if your name is on the roll.", isCorrect: true },
      { label: "Try to argue with the officer to let you in.", impact: -10, feedback: "Officers must follow strict ID protocols. Arguing wastes time.", isCorrect: false }
    ]
  },
  {
    id: 2,
    question: "The voting compartment is crowded and you can't see the EVM buttons clearly. What should you do?",
    options: [
      { label: "Ask the person behind you to point at your candidate.", impact: -50, feedback: "Violation of Secrecy of Ballot! Never reveal your choice or ask others inside.", isCorrect: false },
      { label: "Inform the Presiding Officer and ask for better lighting.", impact: 10, feedback: "Correct. The PO is responsible for maintaining the compartment's accessibility.", isCorrect: true },
      { label: "Just press any button and leave quickly.", impact: -20, feedback: "Your vote is your power. Ensure you cast it correctly.", isCorrect: false }
    ]
  },
  {
    id: 3,
    question: "After pressing the blue button, you notice the VVPAT slip shows a different candidate's name.",
    options: [
      { label: "Loudly complain to other voters to stop the poll.", impact: -15, feedback: "Spreading panic is prohibited. Follow the official grievance process.", isCorrect: false },
      { label: "Inform the Presiding Officer and file a Test Vote (Rule 49MA).", impact: 10, feedback: "Correct. Rule 49MA allows a test vote to verify EVM functionality.", isCorrect: true },
      { label: "Ignore it and walk away.", impact: -10, feedback: "If you suspect a malfunction, you must report it for the sake of democracy.", isCorrect: false }
    ]
  },
  {
    id: 4,
    question: "A group of people offers you money to vote for a specific candidate outside the booth.",
    options: [
      { label: "Take the money and vote for your own choice anyway.", impact: -40, feedback: "Accepting bribes for voting is a criminal offense under Section 171B of IPC.", isCorrect: false },
      { label: "Refuse and report them to the flying squad via cVIGIL.", impact: 20, feedback: "Excellent! cVIGIL is the official app for reporting such violations.", isCorrect: true },
      { label: "Just ignore them and walk in.", impact: 5, feedback: "Safe, but reporting helps clean the system.", isCorrect: false }
    ]
  },
  {
    id: 5,
    question: "You want to check if your name is on the electoral roll before going to the booth.",
    options: [
      { label: "Check the 'Voter Search' on the ECI portal or Voter Helpline App.", impact: 10, feedback: "Correct. Always verify your serial number and booth details beforehand.", isCorrect: true },
      { label: "Go to the booth and ask the officer to find your name.", impact: -5, feedback: "Wastes time on poll day. Verification should be done in advance.", isCorrect: false },
      { label: "Assume your name is there since you voted last time.", impact: -10, feedback: "Electoral rolls are updated frequently. Deletions can happen.", isCorrect: false }
    ]
  },
  {
    id: 6,
    question: "You are a senior citizen and find the queue at the booth very long and exhausting.",
    options: [
      { label: "Leave without voting.", impact: -10, feedback: "Don't give up! Senior citizens are entitled to priority voting.", isCorrect: false },
      { label: "Inform the Booth Level Officer (BLO) to get priority access.", impact: 10, feedback: "Correct. Vulnerable groups have legal priority in queues.", isCorrect: true },
      { label: "Wait in line for hours without saying anything.", impact: 2, feedback: "Admirable patience, but you are entitled to help.", isCorrect: false }
    ]
  },
  {
    id: 7,
    question: "You notice a polling agent taking photos of voters inside the booth.",
    options: [
      { label: "Join them and take a selfie with the EVM.", impact: -100, feedback: "Strictly Prohibited! Photography inside the booth is a major violation.", isCorrect: false },
      { label: "Inform the Presiding Officer immediately.", impact: 15, feedback: "Correct. The PO must confiscate the device and report the violation.", isCorrect: true },
      { label: "Post about it on social media without informing officers.", impact: -10, feedback: "Reporting on-site is more effective for immediate action.", isCorrect: false }
    ]
  }
];

export const candidateQuestions: Question[] = [
  {
    id: 1,
    question: "Your supporters want to use a religious place for an election rally.",
    options: [
      { label: "Allow it, as it's a convenient location for the crowd.", impact: -30, feedback: "Violation! MCC prohibits using religious places for election propaganda.", isCorrect: false },
      { label: "Refuse and choose a public ground with proper permissions.", impact: 15, feedback: "Correct. Secular spaces must be used for campaigning.", isCorrect: true },
      { label: "Do it quietly without any loudspeakers.", impact: -20, feedback: "Location itself is a violation, regardless of the volume.", isCorrect: false }
    ]
  },
  {
    id: 2,
    question: "You want to distribute pamphlets that criticize your opponent's personal life.",
    options: [
      { label: "Print and distribute them widely.", impact: -40, feedback: "MCC prohibits personal attacks. Campaigning must be on policies/work.", isCorrect: false },
      { label: "Stick to criticizing their political performance and policies.", impact: 10, feedback: "Correct. Healthy democracy relies on issue-based campaigning.", isCorrect: true },
      { label: "Ask a supporter to do it anonymously.", impact: -35, feedback: "Anonymous personal attacks are still ethical and legal violations.", isCorrect: false }
    ]
  },
  {
    id: 3,
    question: "A news channel offers you a 'package' for positive coverage in exchange for money.",
    options: [
      { label: "Accept it to boost your public image.", impact: -100, feedback: "This is 'Paid News', a major corrupt practice under election law.", isCorrect: false },
      { label: "Refuse and report the offer to the MCMC committee.", impact: 20, feedback: "Correct. Media Certification and Monitoring Committee tracks such violations.", isCorrect: true },
      { label: "Accept but don't show it in your expenditure account.", impact: -150, feedback: "Double violation: Paid news and hiding election expenses.", isCorrect: false }
    ]
  },
  {
    id: 4,
    question: "You want to hold a rally after 10:00 PM because that's when most people are home.",
    options: [
      { label: "Proceed with the rally using low-volume speakers.", impact: -20, feedback: "Violation. MCC prohibits use of loudspeakers between 10 PM and 6 AM.", isCorrect: false },
      { label: "End all campaigning by 10:00 PM as per ECI guidelines.", impact: 10, feedback: "Correct. Noise pollution and late-night rally rules are strict.", isCorrect: true },
      { label: "Hold the rally indoors instead.", impact: -5, feedback: "Time limit applies to all public campaigning activities.", isCorrect: false }
    ]
  }
];

export const officerQuestions: Question[] = [
  {
    id: 1,
    question: "The EVM in your booth shows an 'Error' message during the mock poll.",
    options: [
      { label: "Try to repair the unit yourself.", impact: -50, feedback: "Never attempt repairs. Call the Sector Officer for a replacement.", isCorrect: false },
      { label: "Immediately inform the Sector Officer and replace the unit.", impact: 15, feedback: "Correct. Standard protocol is to replace malfunctioning units from the reserve.", isCorrect: true },
      { label: "Continue the mock poll with the remaining working units.", impact: -20, feedback: "A faulty unit cannot be used. It must be replaced before the actual poll.", isCorrect: false }
    ]
  },
  {
    id: 2,
    question: "An agent from a political party tries to help a voter press the button.",
    options: [
      { label: "Allow it if the voter seems confused.", impact: -40, feedback: "Absolute violation! No one except the voter can enter the compartment.", isCorrect: false },
      { label: "Warn the agent and remove them from the booth if they repeat it.", impact: 20, feedback: "Correct. Maintaining secrecy and independence is your duty.", isCorrect: true },
      { label: "Ignore it if other agents don't complain.", impact: -15, feedback: "You are the primary enforcer of rules, not the agents.", isCorrect: false }
    ]
  },
  {
    id: 3,
    question: "A voter's finger was already marked with ink when they arrived. What is your decision?",
    options: [
      { label: "Allow them to vote if they say it's just a stain.", impact: -30, feedback: "Violation. An existing ink mark indicates a prior attempt to vote.", isCorrect: false },
      { label: "Refuse entry and record it as a case of suspected impersonation.", impact: 20, feedback: "Correct. Indelible ink is the primary check against double voting.", isCorrect: true },
      { label: "Apply a second mark and let them vote.", impact: -50, feedback: "Serious violation. This facilitates multi-voting.", isCorrect: false }
    ]
  },
  {
    id: 4,
    question: "At the end of the poll, you must seal the EVM. Who should witness this?",
    options: [
      { label: "Only you and your staff to maintain privacy.", impact: -10, feedback: "Transparency is required. Polling agents must be present.", isCorrect: false },
      { label: "Invite all polling agents to witness and sign the seals.", impact: 15, feedback: "Correct. This ensures all parties agree the units haven't been tampered with.", isCorrect: true },
      { label: "Just the police officer at the gate.", impact: -5, feedback: "Police are for security, not for witnessing administrative seals.", isCorrect: false }
    ]
  }
];
