const fileEncryptionForm = document.getElementById('fileEncryptionForm');
const fileEncryptionMessage = document.getElementById('fileEncryptionMessage');
const fileDownloadLink = document.getElementById('fileDownloadLink');
const selectFileMode = document.getElementById('selectFileMode');
// file encryption & decryption
fileEncryptionForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  fileEncryptionMessage.style.display = 'block';
  fileEncryptionMessage.textContent = 'Processing...';

  const formData = new FormData();
  const file = document.querySelector('input[name="fileInput"]').files[0];
  const key = document.querySelector('input[name="fileKeyInput"]').value;

  const keyValue =
    selectFileMode.value === 'decryption' ? 'decryptionKey' : 'encryptionKey';

  if (!file || !key) {
    fileEncryptionMessage.textContent = 'File and key are required.';
    return;
  }

  formData.append('file', file);
  formData.append(keyValue, key);

  try {
    const url =
      selectFileMode.value === 'decryption'
        ? '/cryptofile/decrypt'
        : '/cryptofile/encrypt';

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      fileEncryptionMessage.textContent = result.message;
      fileDownloadLink.href = result.downloadUrl;
      fileDownloadLink.style.display = 'inline-block';
    } else {
      fileEncryptionMessage.textContent = result.message;
    }
  } catch (err) {
    console.error('Encryption error:', err);
    fileEncryptionMessage.textContent = 'Something went wrong.';
  }
});

const textEncryptionForm = document.getElementById('textEncryptionForm');
const textEncryptionMessage = document.getElementById('textEncryptionMessage');
const textInput = document.getElementById('textInput');
const textKeyInput = document.getElementById('textKeyInput');
const selectTextMode = document.getElementById('selectTextMode');
const textOutput = document.getElementById('textOutput');
const copyTextOutputBtn = document.getElementById('copyTextOutputBtn');

// text encryption & decryption
textEncryptionForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  textEncryptionMessage.style.display = 'block';
  textEncryptionMessage.textContent = 'Processing...';

  const text = textInput.value.trim();
  const key = textKeyInput.value.trim();

  const keyValue =
    selectTextMode.value === 'decryption' ? 'decryptionKey' : 'encryptionKey';

  if (!text || !key) {
    textEncryptionMessage.textContent = 'Text and key are required.';
    return;
  }

  try {
    const url =
      selectTextMode.value === 'decryption'
        ? '/cryptotext/decrypt'
        : '/cryptotext/encrypt';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        [keyValue]: key,
      }),
    });

    const result = await response.json();
    if (result.success) {
      textEncryptionMessage.textContent = result.message;
      textOutput.value = result.output;
    } else {
      textEncryptionMessage.textContent = result.message;
    }
  } catch (err) {
    console.error('Text encryption error:', err);
    textEncryptionMessage.textContent = 'Something went wrong.';
  }
});

// Copy text output
copyTextOutputBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(textOutput.value);
  const original = textOutput.value;
  textOutput.value = 'Copied!';
  setTimeout(() => (textOutput.value = original), 1000);
});

// bcrypt hashing

const bcryptHashForm = document.getElementById('bcryptHashForm');
// const secretInput = document.getElementById('secretInput');
const bcryptMessage = document.getElementById('bcryptMessage');
// const bcryptOutput = document.getElementById('bcryptOutput');
// const copyBcryptOutputBtn = document.getElementById('copyBcryptOutputBtn');
// const toggleSecretVisibility = document.getElementById(
//   'toggleSecretVisibility'
// );

// handle hashing
bcryptHashForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  bcryptMessage.style.display = 'block';
  bcryptMessage.textContent = 'Processing...';

  const secret = secretInput.value.trim();
  if (!secret) {
    bcryptMessage.textContent = 'Secret is required.';
    return;
  }

  try {
    const response = await fetch('/bcrypt/hash', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ secret }),
    });

    const result = await response.json();
    if (result.success) {
      bcryptMessage.textContent = result.message;
      bcryptOutput.value = result.hashedSecret;
    } else {
      bcryptMessage.textContent = result.message;
    }
  } catch (err) {
    console.error('Hashing error:', err);
    bcryptMessage.textContent = 'Something went wrong.';
  }
});

// bcrypt compare
const bcryptCompareForm = document.getElementById('bcryptCompareForm');
const compareSecretInput = document.getElementById('compareSecretInput');
const compareHashInput = document.getElementById('compareHashInput');
const compareResult = document.getElementById('compareResult');
const compareToggleSecret = document.getElementById('compareToggleSecret');
const pasteCompareHashBtn = document.getElementById('pasteCompareHashBtn');

// Compare bcrypt secret visibility
compareToggleSecret.addEventListener('click', () => {
  const type =
    compareSecretInput.getAttribute('type') === 'password'
      ? 'text'
      : 'password';
  compareSecretInput.setAttribute('type', type);
});

// past hash
pasteCompareHashBtn.addEventListener('click', async () => {
  const hash = await navigator.clipboard.readText();
  compareHashInput.value = hash;
});

// handle comparison
bcryptCompareForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  compareResult.value = 'Processing...';

  const secret = compareSecretInput.value.trim();
  const hashedSecret = compareHashInput.value.trim();

  if (!secret || !hashedSecret) {
    compareResult.value = 'Both secret and hash are required.';
    return;
  }

  try {
    const response = await fetch('/bcrypt/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ secret, hashedSecret }),
    });

    const result = await response.json();
    if (result.success) {
      compareResult.value = result.message;
    } else {
      compareResult.value = result.message;
    }
  } catch (err) {
    console.error('Verify error:', err);
    compareResult.value = 'Something went wrong.';
  }
});

// metadata
// ====================== Metadata Tool ======================
const metadataForm = document.getElementById('metadataForm');
const metadataFileInput = document.getElementById('metadataFileInput');

const viewMetaBtn = document.getElementById('viewMetaBtn');
const removeMetaBtn = document.getElementById('removeMetaBtn');

const metadataCard = document.getElementById('metadataCard');
const metadataOutput = document.getElementById('metadataOutput');
const copyMetadataBtn = document.getElementById('copyMetadataBtn');

const downloadCard = document.getElementById('downloadCard');
const downloadLink = document.getElementById('downloadLink');
const metaDataMessage = document.getElementById('metaDataMessage');

// Helper function to send file via fetch
async function sendFile(url) {
  if (!metadataFileInput.files.length) {
    alert('Please choose a file.');
    return null;
  }

  const formData = new FormData();
  formData.append('file', metadataFileInput.files[0]);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    return await response.json();
  } catch (err) {
    metaDataMessage.textContent = err.message;
    return null;
  }
}

viewMetaBtn.addEventListener('click', async () => {
  metaDataMessage.style.display = 'block';
  metaDataMessage.textContent = 'Processing....';
  const result = await sendFile('/metadata/view');
  if (result && result.success) {
    metadataCard.classList.remove('hidden');
    downloadCard.classList.add('hidden');
    metaDataMessage.textContent = result.message;
    metadataOutput.textContent = JSON.stringify(result.metadata, null, 2);
  } else if (result) {
    alert(result.message);
  }
});

removeMetaBtn.addEventListener('click', async () => {
  const result = await sendFile('/metadata/remove');
  metaDataMessage.style.display = 'block';
  metaDataMessage.textContent = 'Processing....';
  if (result && result.success) {
    downloadCard.classList.remove('hidden');
    metadataCard.classList.add('hidden');
    metaDataMessage.textContent = result.message;
    downloadLink.href = result.downloadUrl;
    downloadLink.textContent = 'Download file without metadata';
  } else if (result) {
    alert(result.message);
  }
});

copyMetadataBtn.addEventListener('click', () => {
  if (!metadataOutput.textContent) return;

  navigator.clipboard
    .writeText(metadataOutput.textContent)
    .then(() => {
      metaDataMessage.style.display = 'block';
      metaDataMessage.textContent = 'Metadata copied to clipboard';
    })
    .catch((err) => {
      metaDataMessage.style.display = 'block';
      metaDataMessage.textContent = 'Failed to copy metadata';
    });
});

// sha256 hash
const selectSha256Mode = document.getElementById('selectSha256Mode');
const textDiv = document.getElementById('sha256TextInput');
const fileDiv = document.getElementById('sha256FileUpload');
const copySha256Btn = document.getElementById('copySha256OutputBtn');
const sha256Output = document.getElementById('sha256Output');

// mode
selectSha256Mode.addEventListener('change', () => {
  if (selectSha256Mode.value === 'file') {
    textDiv.classList.add('hidden');
    fileDiv.classList.remove('hidden');
  } else {
    textDiv.classList.remove('hidden');
    fileDiv.classList.add('hidden');
  }
});

// hashing
const sha256HashForm = document.getElementById('sha256HashForm');
const sha256FileInput = document.getElementById('sha256FileInput');

sha256HashForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('file', sha256FileInput.files[0]);

  const sha256Text = document.getElementById('sha256Text').value;

  const url =
    selectSha256Mode.value === 'file' ? '/sha256/hashFile' : '/sha256/hashText';

  const options =
    selectSha256Mode.value === 'file'
      ? { method: 'POST', body: formData }
      : {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sha256Text }),
        };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    // display hash
    sha256Output.value = data.computedHash || 'No hash returned';
  } catch (err) {
    sha256Output.value = `Error: ${err.message}`;
  }
});

// copy sha256 hash

copySha256Btn.addEventListener('click', () => {
  navigator.clipboard.writeText(sha256Output.value);
  const original = sha256Output.value;
  sha256Output.value = 'Copied!';
  setTimeout(() => (sha256Output.value = original), 1000);
});

// verify sha256 hash
const selectSha256VerifyMode = document.getElementById(
  'selectSha256VerifyMode'
);
const textVerifyDiv = document.getElementById('sha256VerifyTextInput');
const fileVerifyDiv = document.getElementById('sha256VerifyFileUpload');
const verifyOutput = document.getElementById('sha256VerifyOutput');

// mode toggle
selectSha256VerifyMode.addEventListener('change', () => {
  if (selectSha256VerifyMode.value === 'file') {
    textVerifyDiv.classList.add('hidden');
    fileVerifyDiv.classList.remove('hidden');
  } else {
    textVerifyDiv.classList.remove('hidden');
    fileVerifyDiv.classList.add('hidden');
  }
});

// verification submit
const sha256VerifyForm = document.getElementById('sha256VerifyForm');
const verifyFileInput = document.getElementById('verifyFileInput');

sha256VerifyForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  let url, options;

  if (selectSha256VerifyMode.value === 'file') {
    const formData = new FormData();
    formData.append('file', verifyFileInput.files[0]);
    formData.append(
      'expectedHash',
      document.getElementById('expectedFileHash').value
    );

    url = '/sha256/verifyFile';
    options = { method: 'POST', body: formData };
  } else {
    const text = document.getElementById('verifyText').value;
    const expectedHash = document.getElementById('expectedTextHash').value;

    url = '/sha256/verifyText';
    options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, expectedHash }),
    };
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    verifyOutput.value = data.valid ? data.message : 'Hash does not match';
  } catch (err) {
    verifyOutput.value = `Error: ${err.message}`;
  }
});

const pasteVerifySha256TextBtn = document.getElementById(
  'pasteVerifySha256TextBtn'
);

const expectedTextHash = document.getElementById('expectedTextHash');
const expectedFileHash = document.getElementById('expectedFileHash');

const pasteVerifySha256FileBtn = document.getElementById(
  'pasteVerifySha256FileBtn'
);

pasteVerifySha256TextBtn.addEventListener('click', async () => {
  const hash = await navigator.clipboard.readText();
  expectedTextHash.value = hash;
});
pasteVerifySha256FileBtn.addEventListener('click', async () => {
  const hash = await navigator.clipboard.readText();
  expectedFileHash.value = hash;
});
