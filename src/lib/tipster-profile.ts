export type TipsterProfile = {
  authorNumber: number;
  authorName: string;
};

const PROFILE_KEY = "student-square-tipster-profile";
const NEXT_NUMBER_KEY = "student-square-next-tipster-number";

export function getOrCreateTipsterProfile(): TipsterProfile {
  if (typeof window === "undefined") {
    return {
      authorNumber: 0,
      authorName: "꿀팁러 #0000",
    };
  }

  const savedProfile = localStorage.getItem(PROFILE_KEY);

  if (savedProfile) {
    return JSON.parse(savedProfile) as TipsterProfile;
  }

  const nextNumber = Number(localStorage.getItem(NEXT_NUMBER_KEY) ?? "1001");

  const profile: TipsterProfile = {
    authorNumber: nextNumber,
    authorName: `꿀팁러 #${nextNumber}`,
  };

  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  localStorage.setItem(NEXT_NUMBER_KEY, String(nextNumber + 1));

  return profile;
}
