import { NextApiRequest, NextApiResponse } from "next";
import { admin } from "../../utils/firebaseAdmin";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const docRef = await admin.firestore().doc(`parties/${req.query.id}`).get();

    return res.json({ exists: docRef.exists });
  } catch (error) {
    console.error(error);

    return res.send(500);
  }
};

export default handler;
