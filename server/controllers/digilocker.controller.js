export const initiate = (req, res) => {
  res.json({
    success: true,
    redirectUrl: 'https://sandbox.api-setu.in/digilocker/auth',
    sessionId: `session_${Date.now()}`
  });
};

export const callback = (req, res) => {
  const { sessionId, code } = req.body;

  res.json({
    digilockerVerified: true,
    verifiedData: {
      fullName: "John Doe",
      dob: "1990-01-15",
      gender: "Male"
    },
    nextStep: null
  });
};

