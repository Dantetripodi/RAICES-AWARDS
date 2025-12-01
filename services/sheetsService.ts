import { Vote } from '../types';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzChM7ZbD5gFPbVDEjAei6IJffkq4A_bxoXfiFqOhp3CWFpiCVLUYDCySndxHGSTLX2qA/exec';

export async function appendVote(vote: Vote, categoryName?: string, nomineeName?: string) {
  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        action: 'addVote',
        vote: {
          ...vote,
          categoryName: categoryName || vote.categoryId,
          nomineeName: nomineeName || vote.nomineeId
        }
      })
    });

    console.log('✅ Voto enviado');
    return { success: true };
  } catch (error) {
    console.error('❌ Error en appendVote:', error);
    throw error;
  }
}

export async function getAllVotes(): Promise<Vote[]> {
  return [];
}

export async function clearVotes() {
  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        action: 'clearVotes'
      })
    });

    console.log('✅ Votos limpiados');
    return { success: true };
  } catch (error) {
    console.error('❌ Error en clearVotes:', error);
    throw error;
  }
}