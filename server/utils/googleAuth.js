const verifyGoogleCredential = async (credential, expectedClientId) => {
  if (!credential) {
    throw new Error('Missing Google credential.');
  }

  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
  );

  if (!response.ok) {
    throw new Error('Google token verification failed.');
  }

  const payload = await response.json();

  if (expectedClientId && payload.aud !== expectedClientId) {
    throw new Error('Google token audience mismatch.');
  }

  if (!payload.email || payload.email_verified !== 'true') {
    throw new Error('Google account email is not verified.');
  }

  return payload;
};

module.exports = { verifyGoogleCredential };
