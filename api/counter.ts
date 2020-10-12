import { NowRequest, NowResponse } from '@vercel/node';
import firebaseInstance from '../firebase';

const COLLECTION = 'tools';
const DOCUMENT = 'hit-count';

const COUNTER = async (req: NowRequest, res: NowResponse) => {
  const { name = 'default', simulate = false } = req.query;
  const docRef = firebaseInstance.collection(COLLECTION).doc(DOCUMENT);
  const params = {
    name: name as string,
    simulate: simulate as boolean,
  };

  const doc = await docRef.get();

  if (!doc.exists) {
    return res.status(500).send('Error: Document Not Found!');
  }

  const data = doc.data();
  const count = data[params.name] ? data[params.name] + 1 : 1;

  res.status(200).send({ name: params.name, count });
  if (!simulate) {
    docRef.set({ [params.name]: count }, { merge: true });
  }
};

export default COUNTER;
