import { db } from './db';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const getUserSubscription = async (email: string) => {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }
  const isActive = user.stripoePriceId && user.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();
  return {
    ...user,
    isActive
  }
}